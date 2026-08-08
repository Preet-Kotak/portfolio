/**
 * Personal profile data — used by AboutModal (Town Hall click).
 * Update this file to keep all "about me" content in one place.
 */
const about = {
  name:       'Preetkumar Kotak',
  tagline:    'Build · Break · Fix · Repeat',
  email:      'preetdkotak@gmail.com',
  avatar:     'assets/profile.jpg',

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
