import fs from 'fs';
import path from 'path';
import { Octokit } from 'octokit';

interface SaveOptions {
  fileName: string;
  data: any;
  commitMessage: string;
}

export interface DeploymentStatus {
  status: 'idle' | 'publishing' | 'building' | 'deployed' | 'error' | 'local';
  message: string;
  lastCommit?: string;
  url?: string;
  updatedAt: string;
}

/**
 * Saves a data file either directly to local disk (in local development)
 * or commits directly to GitHub repository via Octokit (on Vercel production).
 */
export async function saveDataFile({
  fileName,
  data,
  commitMessage,
}: SaveOptions): Promise<{ success: boolean; mode: 'github' | 'local'; sha?: string }> {
  const jsonContent = JSON.stringify(data, null, 2) + '\n';
  const localFilePath = path.join(process.cwd(), 'data', fileName);

  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO; // e.g. "SlimexDev/Rimuru-hub" or "owner/repo"
  const githubBranch = process.env.GITHUB_BRANCH || 'main';

  // 1. Always attempt local write in development or fallback
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(localFilePath, jsonContent, 'utf-8');
  } catch (localErr) {
    console.warn(`Local file write notice for ${fileName}:`, localErr);
  }

  // 2. If GitHub environment variables are provided, commit directly to GitHub repository
  if (githubToken && githubRepo) {
    try {
      const [owner, repo] = githubRepo.split('/');
      if (!owner || !repo) {
        throw new Error('Invalid GITHUB_REPO format. Expected "owner/repo"');
      }

      const octokit = new Octokit({ auth: githubToken });
      const repoPath = `data/${fileName}`;

      // Get current file SHA if it exists
      let existingSha: string | undefined;
      try {
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: repoPath,
          ref: githubBranch,
        });

        if ('sha' in fileData) {
          existingSha = fileData.sha;
        }
      } catch (err: any) {
        // File doesn't exist yet on GitHub (404 is normal for new files)
        if (err.status !== 404) {
          console.error(`Error getting GitHub SHA for ${repoPath}:`, err);
        }
      }

      // Create or update file content via GitHub API
      const response = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: repoPath,
        message: commitMessage || `feat(content): update ${fileName} via Rimuru Admin Portal`,
        content: Buffer.from(jsonContent, 'utf-8').toString('base64'),
        sha: existingSha,
        branch: githubBranch,
      });

      return {
        success: true,
        mode: 'github',
        sha: response.data.commit.sha,
      };
    } catch (githubErr: any) {
      console.error(`GitHub API commit failed for ${fileName}:`, githubErr);
      throw new Error(`GitHub commit error: ${githubErr.message}`);
    }
  }

  // Local mode success
  return {
    success: true,
    mode: 'local',
  };
}

/**
 * Checks deployment / GitHub Actions workflow status
 */
export async function getLatestDeploymentStatus(): Promise<DeploymentStatus> {
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;
  const now = new Date().toISOString();

  if (!githubToken || !githubRepo) {
    return {
      status: 'local',
      message: 'Local Mode (Changes saved to disk)',
      updatedAt: now,
    };
  }

  try {
    const [owner, repo] = githubRepo.split('/');
    const octokit = new Octokit({ auth: githubToken });

    // Fetch latest commit on main branch
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 1,
    });

    const latestCommit = commits[0];
    const commitMsg = latestCommit?.commit?.message || 'Latest change';
    const commitSha = latestCommit?.sha ? latestCommit.sha.substring(0, 7) : undefined;

    // Check recent workflow runs / deployments
    let status: DeploymentStatus['status'] = 'deployed';
    let message = `Latest commit ${commitSha}: ${commitMsg}`;

    try {
      const { data: runs } = await octokit.rest.actions.listWorkflowRunsForRepo({
        owner,
        repo,
        per_page: 1,
      });

      if (runs.workflow_runs.length > 0) {
        const latestRun = runs.workflow_runs[0];
        if (latestRun.status === 'in_progress' || latestRun.status === 'queued') {
          status = 'building';
          message = `Building & Deploying commit ${commitSha}...`;
        } else if (latestRun.conclusion === 'success') {
          status = 'deployed';
          message = `Deployed successfully (${commitSha})`;
        } else if (latestRun.conclusion === 'failure') {
          status = 'error';
          message = `Build failed on commit ${commitSha}`;
        }
      }
    } catch {
      // Deployments / actions might not be active, fallback to commit info
    }

    return {
      status,
      message,
      lastCommit: commitSha,
      url: latestCommit?.html_url,
      updatedAt: now,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: `GitHub API error: ${error.message}`,
      updatedAt: now,
    };
  }
}
