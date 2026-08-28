/**
 * Projects data — used by ProjectsModal (Builder's Hut click) and the
 * Phase 11 Professional view.
 *
 * Fields:
 *   title       — project name
 *   description — one punchy sentence: what it is + the key technical detail
 *   tech        — array of tech stack tags
 *   links       — array of { label, href } objects
 *   status      — 'done' | 'wip'  (legacy field kept for modal compatibility)
 *   isWIP       — boolean derived from status; used by Professional view
 *   image       — (optional) path to screenshot in public/assets/projects/
 *   liveUrl     — (optional) live demo URL, or null
 *   githubUrl   — (optional) primary GitHub URL (convenience alias)
 *   highlights  — (optional) array of terms to highlight gold in description
 *
 * NOTE: BidKar GitHub link is temporary (Sai01tailor's repo).
 *       Update href once you fork it to your own account.
 */
const projects = [
  {
    title: 'BidKar',
    description:
      '3-person team real-time auction platform. I built roughly half the backend — Redis distributed lock (NX/PX + Lua) for race-free bidding, mock Aadhaar verification API, auction lifecycle via cron jobs, and frontend cleanup once the backend was stable.',
    tech:       ['Node.js', 'Express', 'MongoDB', 'Redis', 'Socket.io', 'JWT', 'Razorpay'],
    highlights: ['Redis distributed lock', 'race-free bidding', 'cron jobs'],
    links:      [{ label: 'GitHub', href: 'https://github.com/Sai01tailor/Auction-it-all' }],
    githubUrl:  'https://github.com/Sai01tailor/Auction-it-all',
    image:      'assets/projects/bidkar.png',
    liveUrl:    'https://bidkar.in',
    status:     'wip',
    isWIP:      true,
  },
  {
    title: 'CoC Tournament Bot',
    description:
      '5,000+ line Discord bot that ran a live Clan Capital esports tournament — 43 slash commands across 7 cogs, PIL-generated match images, and an anti-scam honeypot system.',
    tech:       ['Python', 'discord.py', 'PostgreSQL', 'asyncpg', 'Supabase', 'PIL'],
    highlights: ['43 slash commands', 'PIL-generated match images', 'anti-scam honeypot'],
    links:      [{ label: 'GitHub', href: 'https://github.com/Preet-Kotak/tournament-bot' }],
    githubUrl:  'https://github.com/Preet-Kotak/tournament-bot',
    image:      'assets/projects/tournament-bot.png',
    liveUrl:    null,
    status:     'done',
    isWIP:      false,
  },
  {
    title: 'KissanLink',
    description:
      'WhatsApp-native hyperlocal marketplace for rural Gujarat farmers — Biothon 2026 Finalist (~400 teams total). Gujarati conversational chatbot over 2G, MongoDB geospatial matching, built end-to-end during the hackathon.',
    tech:       ['Node.js', 'Express', 'MongoDB', 'Twilio', 'Render'],
    highlights: ['Biothon 2026 Finalist', 'geospatial matching', 'conversational chatbot'],
    links:      [{ label: 'GitHub', href: 'https://github.com/Preet-Kotak/kissanlink-biothon' }],
    githubUrl:  'https://github.com/Preet-Kotak/kissanlink-biothon',
    image:      'assets/projects/kissanlink.png',
    liveUrl:    null,
    status:     'done',
    isWIP:      false,
  },
  {
    title: '8086 Calculator',
    description:
      'Fully working calculator in 16-bit 8086 Assembly. 32-bit arithmetic via register chaining (high+low word), fixed-point decimals (numbers multiplied by 100 internally), digit-by-digit base-4 square root, base conversions (HEX/BIN including fractional), memory ops (MS/MR/MC), overflow and divide-by-zero handling, and a hand-drawn 80×25 text-mode UI with keyboard navigation.',
    tech:       ['8086 Assembly', 'TASM', 'DOS'],
    highlights: ['32-bit arithmetic', 'fixed-point decimals', 'base-4 square root'],
    links:      [{ label: 'GitHub', href: 'https://github.com/Preet-Kotak/calculator' }],
    githubUrl:  'https://github.com/Preet-Kotak/calculator',
    image:      'assets/projects/8086-calculator.png',
    liveUrl:    null,
    status:     'done',
    isWIP:      false,
  },
  {
    title: 'CoC Portfolio',
    description:
      'This portfolio — an isometric Clash of Clans village built with Phaser.js and React where every building opens a section of my work. You are here.',
    tech:       ['React', 'Phaser.js', 'Vite', 'Tailwind'],
    highlights: ['isometric Clash of Clans village', 'Phaser.js'],
    links:      [{ label: 'GitHub', href: 'https://github.com/Preet-Kotak' }],
    githubUrl:  'https://github.com/Preet-Kotak',
    image:     'assets/projects/portfolio.png',
    liveUrl:    null,
    status:     'wip',
    isWIP:      true,
  },
];

export default projects;
