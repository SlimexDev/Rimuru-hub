import { NextResponse } from 'next/server';
import { getLatestDeploymentStatus } from '@/lib/github-sync';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await getLatestDeploymentStatus();
    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
