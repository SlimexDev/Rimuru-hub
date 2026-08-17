const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma seeding for LiquidScript Hub...');

  // 1. Seed Admin User
  const adminUsername = process.env.ADMIN_USERNAME || 'slimex';
  const adminPassword = process.env.ADMIN_PASSWORD || '612777';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: {
      passwordHash,
      name: 'Rimuru Master Admin',
    },
    create: {
      username: adminUsername,
      passwordHash,
      name: 'Rimuru Master Admin',
    },
  });
  console.log(`✅ Admin user created/updated (${adminUsername} / ${adminPassword})`);

  // 2. Games
  const gamesData = [
    {
      name: 'Blox Fruits',
      slug: 'blox-fruits',
      icon: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Blade Ball',
      slug: 'blade-ball',
      icon: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Pet Simulator 99',
      slug: 'pet-simulator-99',
      icon: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Murder Mystery 2',
      slug: 'murder-mystery-2',
      icon: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Da Hood',
      slug: 'da-hood',
      icon: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Fisch',
      slug: 'fisch',
      icon: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    },
    {
      name: 'King Legacy',
      slug: 'king-legacy',
      icon: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Arsenal',
      slug: 'arsenal',
      icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  const createdGames = {};
  for (const g of gamesData) {
    const game = await prisma.game.upsert({
      where: { slug: g.slug },
      update: g,
      create: g,
    });
    createdGames[g.slug] = game;
  }
  console.log(`✅ ${Object.keys(createdGames).length} games seeded.`);

  // 3. Seed Default Unlock Steps
  const defaultSteps = [
    {
      label: 'Subscribe to Rimuru YouTube',
      description: 'Subscribe to our official YouTube channel for daily script showcases & updates',
      targetUrl: 'https://youtube.com',
      order: 1,
      isActive: true,
    },
    {
      label: 'Join Rimuru Discord Community',
      description: 'Join 50K+ active members for executor support, bypass keys, and giveaways',
      targetUrl: 'https://discord.com',
      order: 2,
      isActive: true,
    },
    {
      label: 'Visit Verified Partner Network',
      description: 'Browse verified Roblox executor partner sites to support server maintenance',
      targetUrl: 'https://roblox.com',
      order: 3,
      isActive: true,
    },
  ];

  await prisma.unlockStep.deleteMany({ where: { scriptId: null } });
  for (const s of defaultSteps) {
    await prisma.unlockStep.create({
      data: s,
    });
  }
  console.log('✅ Default unlock steps seeded.');

  // 4. Scripts
  const scriptsData = [
    {
      slug: 'redz-hub-blox-fruits-v3',
      title: 'Redz Hub Blox Fruits - Auto Farm Level & Auto Sea Events',
      gameSlug: 'blox-fruits',
      banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      excerpt: 'The most stable, keyless and high-performance Blox Fruits script hub. Features Sea 1-3 Auto Farm, Leviathan, Kitsune Island, and Fast Attack.',
      content: `### Redz Hub Blox Fruits v3.2.0

Redz Hub is currently ranked the #1 safest and most optimized script for Blox Fruits. Engineered with bypass technology, it runs seamlessly across both mobile and desktop executors with zero memory leaks.

#### Key Features:
- **Auto Farm Level**: High-speed quest auto-pickup, mob clump magnet, and bypass hitbox.
- **Sea 3 Events**: Auto Leviathan hunt, Kitsune shrine auto-ember collector, Terror Shark auto-defeat.
- **Fruit Sniper & Store**: Instant store notifier, auto-buy fruit from dealer when in stock.
- **Mastery Auto-Farm**: Automatic switch weapon and skill casting when HP reaches kill range.
- **Fast Attack Mode**: Ultra-low delay attack packets without kickback.
- **Fully Keyless**: No tedious multi-checkpoint keys required.

#### Mobile & PC Optimization
Optimized specifically for Delta Mobile, Hydrogen, Codex, and PC executors like Solara and Wave. UI automatically scales to screen size.`,
      code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/realredz/BloxFruits/main/Source.lua"))()`,
      executors: JSON.stringify(['Delta', 'Solara', 'Wave', 'Codex', 'Hydrogen', 'Arceus X']),
      features: JSON.stringify(['Auto Farm 1-2550', 'Auto Sea Events', 'Fruit Sniper', 'Fast Attack', 'ESP Players/Fruits', 'Bypass Anticheat']),
      isPublished: true,
      isVerified: true,
      isKeyless: true,
      views: 18450,
      downloads: 6200,
      rating: 4.95,
      author: 'Redz Team',
      version: 'v3.4.1',
    },
    {
      slug: 'hoho-hub-blox-fruits-sea3',
      title: 'Hoho Hub Blox Fruits - Auto Race V4 & Auto Mirage Island',
      gameSlug: 'blox-fruits',
      banner: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=1200&auto=format&fit=crop&q=80',
      videoUrl: '',
      excerpt: 'Complete Race V4 solver, Auto Mirage Island Finder with Gear Finder, Auto Raid Dungeon and Full Auto Stats.',
      content: `### Hoho Hub Blox Fruits Premium Edition

A legacy script hub trusted by over 200,000 players worldwide. Hoho Hub features unmatched Race V4 automation, Temple of Time trial helpers, and Mirage gear finder.

#### Feature Breakdown:
- **Race V4 Complete**: Auto Trial (Mink, Human, Sky, Fish, Cyborg, Ghoul) with auto-door clicker.
- **Mirage Island**: Auto-steer boat to high spawn rate coordinates, auto moon resonate, and blue gear locator with waypoint ESP.
- **Dungeon Automation**: Full automatic raid start, mob wipe, and chip re-purchase loop.`,
      code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/acsu123/HOHO_HUB/main/Loading_UI"))()`,
      executors: JSON.stringify(['Solara', 'Delta', 'Wave', 'Codex']),
      features: JSON.stringify(['Auto Race V4', 'Mirage Gear ESP', 'Auto Raid Dungeon', 'Auto Bounty Hunt', 'Mob Vacuum']),
      isPublished: true,
      isVerified: true,
      isKeyless: true,
      views: 14200,
      downloads: 4890,
      rating: 4.88,
      author: 'Hoho Team',
      version: 'v2.8.0',
    },
    {
      slug: 'blade-ball-auto-parry-godmode',
      title: 'Blade Ball - AI Prediction Auto Parry & Curve Ball Deflect',
      gameSlug: 'blade-ball',
      banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
      videoUrl: '',
      excerpt: 'Unbeatable Ping-Compensated Auto Parry with curve trajectory detection, spam block for clash mode, and visual ball indicator.',
      content: `### Blade Ball Quantum Auto Parry

Built using advanced trajectory prediction formulas, Quantum Auto Parry calculates exact ball velocity, angle, curvature, and your network latency to guarantee 100% parry accuracy even in 200ms+ ping matches.

#### Features:
- **Ping Compensated Auto Parry**: Dynamically adjusts parry trigger distance based on your real-time FPS & ping.
- **Curve Ball Deflection**: Detects Infinity, Telekinesis, and Reaper curving angles.
- **Clash Mode Auto Spam**: Triggers ultra-fast block packets when entering head-to-head close combat.
- **Auto Abilities**: Instant activation for Shadow Step, Forcefield, and Rapture.
- **Player & Ball ESP**: Highlights target with trajectory vector lines.`,
      code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/V3rmillionDev/BladeBallAI/main/parry.lua"))()`,
      executors: JSON.stringify(['Delta', 'Solara', 'Hydrogen', 'Wave', 'Codex']),
      features: JSON.stringify(['AI Auto Parry', 'Clash Auto Spam', 'Curve Predictor', 'Player ESP', 'Auto Win Streak']),
      isPublished: true,
      isVerified: true,
      isKeyless: true,
      views: 22100,
      downloads: 8100,
      rating: 4.97,
      author: 'QuantumDev',
      version: 'v4.1.2',
    },
    {
      slug: 'pet-sim-99-auto-farm-huge',
      title: 'Pet Simulator 99 - Auto Farm Breakables, Auto Roll & Huge Sniper',
      gameSlug: 'pet-simulator-99',
      banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
      videoUrl: '',
      excerpt: 'Massive zone auto-farm, auto open eggs with fast-open glitch, auto enchant & potion, and merchant sniper.',
      content: `### Pet Simulator 99 Ultimate Suite

The most comprehensive utility for PS99. Leave your PC or phone running overnight with zero disconnections thanks to our built-in Anti-AFK and Auto Reconnect.

#### Highlights:
- **Smart Area Break**: Sends pets to optimal breakables (Diamonds, Mini Chests, Vaults) for maximum coin per second.
- **Egg Fast-Open**: Skips unboxing animation for 10x faster egg hatch rate.
- **Auto Mini-Games**: Automates Digsite, Fishing, and Stairway to Heaven.
- **Auto Merge & Rainbow**: Automatically upgrades pets to Gold/Rainbow to free up inventory space.`,
      code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/ZapHub/PS99/main/loader.lua"))()`,
      executors: JSON.stringify(['Solara', 'Wave', 'Delta', 'Codex']),
      features: JSON.stringify(['Auto Breakables', 'Fast Egg Hatch', 'Auto Fishing/Digsite', 'Anti-AFK 24/7', 'Huge Alert']),
      isPublished: true,
      isVerified: true,
      isKeyless: true,
      views: 16700,
      downloads: 5120,
      rating: 4.82,
      author: 'Zap Hub',
      version: 'v2.1.0',
    },
    {
      slug: 'mm2-silent-aim-coin-farm',
      title: 'Murder Mystery 2 - Silent Aim, Gun Teleport & Auto Farm Coins',
      gameSlug: 'murder-mystery-2',
      banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
      videoUrl: '',
      excerpt: 'Instant Murderer/Sheriff reveal with 3D chams, 100% hit silent aim for gun, auto grab dropped gun, and bag fill coin farm.',
      content: `### MM2 Phantom Edition

Dominates Murder Mystery 2 rounds without suspicious looking behavior. Configurable FOV circle and smooth aimbot options.

#### Key Functions:
- **Role Revealer & ESP**: Highlights Murderer (Red), Sheriff (Blue), and Innocents (Green) with distance counters.
- **Silent Aim**: Sheriff shots snap to murderer within customizable FOV angle.
- **Auto Grab Gun**: Teleports instantaneously to dropped sheriff gun and returns to safe hiding spot.
- **Bag Coin Farm**: Collects map coins with tween pathing to bypass velocity anticheat.`,
      code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/MM2Gods/Phantom/main/script.lua"))()`,
      executors: JSON.stringify(['Delta', 'Solara', 'Wave', 'Hydrogen', 'Arceus X']),
      features: JSON.stringify(['Role ESP & Chams', 'Silent Aim 360', 'Auto Grab Gun', 'Coin Path Farm', 'Kill All Murderer']),
      isPublished: true,
      isVerified: true,
      isKeyless: true,
      views: 19800,
      downloads: 7300,
      rating: 4.91,
      author: 'Phantom Devs',
      version: 'v5.0.0',
    },
    {
      slug: 'fisch-auto-fish-perfect-cast',
      title: 'Fisch - Instant Catch, Auto Shake & Rare Fish Radar',
      gameSlug: 'fisch',
      banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      videoUrl: '',
      excerpt: 'Automate fishing in the trending Roblox game Fisch! Features 100% Perfect Cast, Auto Shake, Instant Reel, and Mythic Fish ESP.',
      content: `### Fisch Master Automation v2.0

Designed specifically for the hit Roblox fishing simulator. Maximize your money and catch legendary/mythic creatures in record time.

#### Features:
- **100% Perfect Cast**: Always hits the green 100% power sweet spot.
- **Auto Shake UI**: Solves minigame UI buttons automatically in under 0.2s.
- **Instant Reel / Fast Catch**: Skips fight duration safely.
- **Weather & Fish Radar**: Teleports to active aurora, fog, or meteor events.
- **Auto Sell**: Sells low-tier fish to merchant and keeps mutate/rare catches.`,
      code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/FischGods/Master/main/loader.lua"))()`,
      executors: JSON.stringify(['Delta', 'Solara', 'Wave', 'Codex', 'Hydrogen']),
      features: JSON.stringify(['100% Perfect Cast', 'Auto Shake', 'Fast Reel', 'Weather Teleport', 'Auto Sell Inventory']),
      isPublished: true,
      isVerified: true,
      isKeyless: true,
      views: 24500,
      downloads: 9800,
      rating: 4.98,
      author: 'Poseidon Studio',
      version: 'v2.3.0',
    },
    {
      slug: 'da-hood-lock-aim-anti-stomp',
      title: 'Da Hood - Camlock Prediction, Auto Armor & Anti-Stomp',
      gameSlug: 'da-hood',
      banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      videoUrl: '',
      excerpt: 'Silky smooth Q-lock and CFrame speed, anti-stomp teleports you when knocked, auto buy ammo and armor, and crash protections.',
      content: `### Da Hood Vengeance v6

The premier PvP utility for competitive Da Hood players. Featuring velocity prediction, resolver for anti-aim, and macro speed booster.`,
      code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/VengeanceDH/Main/main/script.lua"))()`,
      executors: JSON.stringify(['Solara', 'Wave', 'Delta', 'Codex']),
      features: JSON.stringify(['Camlock Prediction', 'CFrame Speed Macro', 'Anti-Stomp', 'Auto Armor Buy', 'Desync Anti-Lock']),
      isPublished: true,
      isVerified: true,
      isKeyless: true,
      views: 11200,
      downloads: 3400,
      rating: 4.75,
      author: 'Vengeance Team',
      version: 'v6.2.0',
    },
  ];

  for (const s of scriptsData) {
    const game = createdGames[s.gameSlug];
    if (!game) continue;
    await prisma.script.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        gameId: game.id,
        banner: s.banner,
        videoUrl: s.videoUrl,
        excerpt: s.excerpt,
        content: s.content,
        code: s.code,
        executors: s.executors,
        features: s.features,
        isPublished: s.isPublished,
        isVerified: s.isVerified,
        isKeyless: s.isKeyless,
        views: s.views,
        downloads: s.downloads,
        rating: s.rating,
        author: s.author,
        version: s.version,
      },
      create: {
        slug: s.slug,
        title: s.title,
        gameId: game.id,
        banner: s.banner,
        videoUrl: s.videoUrl,
        excerpt: s.excerpt,
        content: s.content,
        code: s.code,
        executors: s.executors,
        features: s.features,
        isPublished: s.isPublished,
        isVerified: s.isVerified,
        isKeyless: s.isKeyless,
        views: s.views,
        downloads: s.downloads,
        rating: s.rating,
        author: s.author,
        version: s.version,
      },
    });
  }
  console.log(`✅ ${scriptsData.length} scripts seeded.`);

  // 5. Guides
  const guidesData = [
    {
      slug: 'how-to-execute-scripts-pc-2026',
      title: 'Complete Guide: How to Execute Roblox Scripts on PC Safely',
      category: 'PC Executors',
      excerpt: 'Step-by-step walkthrough for configuring Solara, Wave, and Synapse Z on Windows without triggering Hyperion anticheat detections.',
      content: `## How to Safely Execute Scripts on PC (2026 Edition)

Running scripts on PC requires using trusted Level 7/8 executors that maintain proper Hyperion / Byfron bypasses. Here is our recommended procedure:

### 1. Choosing Your Executor
- **Solara**: Fast, free, and lightweight Level 3/7 executor with high loadstring compatibility.
- **Wave**: Feature-rich executor with decompiler and saveinstance support.
- **Synapse Z**: Premium stable executor with daily patch updates.

### 2. Preparation Steps
1. Disable Windows Defender real-time scanning temporarily or add your Executor folder to exclusions (executors use DLL injection which triggers generic heuristics).
2. Download the executor ONLY from official community links listed on our Trust page.
3. Launch Roblox and enter your desired game server.

### 3. Executing the Script
1. Open your executor as Administrator.
2. Click **Attach** or **Inject** button and wait 2-3 seconds until you see the 'Successfully Injected' status.
3. Copy the clean Lua \`loadstring()\` code from our hub.
4. Paste it into the editor and press **Execute**.
5. The Liquid Glass style script UI will pop up on your screen. Enjoy!`,
      banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      author: 'Senior Security Analyst',
      readTime: '5 min read',
      views: 9400,
    },
    {
      slug: 'mobile-roblox-scripting-delta-codex',
      title: 'Mobile Scripting Masterclass: Running Scripts on Android & iOS',
      category: 'Mobile Guide',
      excerpt: 'How to install and run Delta Executor, Codex, and Hydrogen on Android APK and iOS sideloaded clients with 120 FPS unlock.',
      content: `## Mobile Scripting on Android & iOS

Mobile Roblox scripting has become easier than ever with customized APK and IPA clients that have executor engines built directly inside.

### For Android Users (Delta / Codex APK)
1. Download the official modified Roblox APK from trusted sources.
2. Uninstall original Roblox from Google Play (make sure your account credentials are saved).
3. Install the APK and grant storage permissions.
4. Open the game, tap the floating glass icon to open the script executor panel, paste your script and execute.

### For iOS Users (Apple Sideloading)
1. Use Scarlet, TrollStore, or Sideloadly to install the Delta IPA onto your iPhone/iPad.
2. Trust the enterprise certificate in iOS Settings -> General -> VPN & Device Management.
3. Launch Roblox, tap the overlay, and paste your code.`,
      banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
      author: 'Mobile Lead',
      readTime: '4 min read',
      views: 12800,
    },
    {
      slug: 'anti-ban-safety-rules-checklist',
      title: 'The Anti-Ban Manifesto: 7 Rules to Never Get Banned',
      category: 'Security & Safety',
      excerpt: 'Essential security principles to safeguard your main Roblox account, avoid player reports, and bypass server-side velocity logs.',
      content: `## 7 Golden Rules for Script Safety

### Rule 1: Always Test on an Alt Account First
Never run a brand-new or unverified script directly on your high-value main account. Test on an alternative account for 24-48 hours first.

### Rule 2: Avoid Obvious Speed & Teleport Hacks in Public Lobbies
Server-side anticheats flag sudden coordinate jumps greater than player max speed. Use Tween (smooth fly/walk) instead of instant coordinate teleportation.

### Rule 3: Use Verified Hubs Only
Do not download random obfuscated scripts from suspicious pastebins. Malicious actors can embed token loggers or webhook scrapers. All scripts on LiquidScript Hub are pre-scanned and sandbox tested.`,
      banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
      author: 'Cyber Threat Intelligence',
      readTime: '3 min read',
      views: 7600,
    },
  ];

  for (const gd of guidesData) {
    await prisma.guide.upsert({
      where: { slug: gd.slug },
      update: gd,
      create: gd,
    });
  }
  console.log(`✅ ${guidesData.length} guides seeded.`);

  // 6. Site Settings
  const settingsData = [
    { key: 'site_name', value: 'Rimuru Script' },
    { key: 'site_tagline', value: 'The Ultimate Liquid Glass Roblox Script Experience' },
    { key: 'site_description', value: 'Discover 100% verified, keyless, and malware-free Roblox scripts with the revolutionary Rimuru Apple Liquid Glass design system.' },
    { key: 'discord_url', value: 'https://discord.gg/roblox' },
    { key: 'telegram_url', value: 'https://t.me/rimuruscripts' },
    { key: 'github_url', value: 'https://github.com' },
    { key: 'contact_email', value: 'support@rimuruscript.io' },
    { key: 'terms_content', value: 'Rimuru Script Hub provides educational and research scripts for Roblox. We are not affiliated with Roblox Corporation. Users assume full responsibility when using third-party game utilities.' },
  ];

  for (const st of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: st.key },
      update: { value: st.value },
      create: st,
    });
  }
  console.log('✅ Site settings seeded.');

  // 7. Analytics Data (Past 7 days)
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    await prisma.analyticsStat.upsert({
      where: { date: dateStr },
      update: {},
      create: {
        date: dateStr,
        views: Math.floor(4500 + Math.random() * 2500),
        unlocks: Math.floor(1800 + Math.random() * 900),
        copies: Math.floor(1400 + Math.random() * 700),
      },
    });
  }
  console.log('✅ 7-day analytics seeded.');

  console.log('🎉 All seed data initialized successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
