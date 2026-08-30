/**
 * Personal profile data — used by AboutModal (Town Hall click) and
 * the Phase 11 Professional view.
 * Update this file to keep ALL "about me" content in one place.
 */
const about = {
  // ── Core identity ──────────────────────────────────────────────
  name:        'Preetkumar Kotak',
  initials:    'P',
  tagline:     'Build · Break · Fix · Repeat',
  roles:       ['CS Student'],
  email:       'preetdkotak@gmail.com',
  githubUrl:   'https://github.com/Preet-Kotak',
  linkedinUrl: 'https://www.linkedin.com/in/preet-kotak-8538b033a',
  resumePath:  '/assets/resume.pdf',

  // ── Platform handles (used by TrophyRoomModal, App, ChatPanel) ─
  cfHandle:    'Preet-Kotak',
  lcUsername:  'Preet-Kotak',
  ghUsername:  'Preet-Kotak',

  // ── Media ──────────────────────────────────────────────────────
  avatar:       'assets/profile.jpg',   // used by modal (legacy key)
  profilePhoto: '/assets/profile.jpg',  // used by Professional view

  // ── Bio — paragraphs for the About section ─────────────────────
  bio: [
    "I'm a B.Tech CSE student at Sardar Vallabhbhai National Institute of Technology, Surat (CGPA 7.95), passionate about building things that actually work — from real-time auction platforms to a fully functional 8086 Assembly calculator.",
    "I spend most of my time in the full-stack and systems space: Node.js backends, Python scripting and bots, and the occasional deep dive into low-level programming. I also run a CoC tournament Discord bot spanning 5,000+ lines of code.",
    "Currently looking for internship opportunities. If you're building something interesting, let's talk.",
  ],

  // Terms to highlight gold in the bio (matched case-insensitively)
  specialTerms: ['Sardar Vallabhbhai National Institute of Technology', 'full-stack', 'Node.js', 'Python', '8086 Assembly', 'Discord bot'],

  // ── Legacy links array (used by modal) ────────────────────────
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/preet-kotak-8538b033a', external: true  },
    { label: 'GitHub',   href: 'https://github.com/Preet-Kotak',                   external: true  },
  ],

  // Cards shown in the horizontal scroll row inside the modal.
  // Each card has a title and an array of text lines.
  cards: [
    {
      title: 'About',
      lines: [
        'B.Tech CSE @ SVNIT Surat (CGPA 7.95)',
        'Full-stack developer & competitive programmer.',
        'Passionate about clean architecture and low-level systems.',
      ],
    },
    {
      title: 'Stack',
      lines: [
        'C/C++, JavaScript, Python, 8086 Assembly',
        'React, Node.js, Express, Tailwind, discord.py',
        'MongoDB, PostgreSQL, Redis, Supabase',
      ],
    },
    {
      title: 'Building',
      lines: [
        'Real-time auction platform (BidKar)',
        'CoC tournament Discord bot (5k+ lines)',
        '8086 Assembly calculator with custom math engine',
      ],
    },
    {
      title: 'Goals',
      lines: [
        'Ship projects people actually use',
        'Land a strong internship — open to opportunities',
      ],
    },
  ],
};

export default about;
