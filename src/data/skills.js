/**
 * Skills data — used by SkillsModal (Barracks click).
 *
 * Fields:
 *   category — category heading
 *   icon     — emoji shown in the tab
 *   items    — array of { name, logo }
 *              logo: filename inside public/assets/skills/
 *                    null = no image, falls back to name text
 */
const skills = [
  {
    category: 'Languages',
    icon: '💻',
    items: [
      { name: 'C',             logo: 'c.png'             },
      { name: 'C++',           logo: 'c++.png'           },
      { name: 'JavaScript',    logo: 'javascript.png'    },
      { name: 'Python',        logo: 'python.png'        },
      { name: '8086 Assembly', logo: '8086-assembly.png' },
    ],
  },
  {
    category: 'Frontend',
    icon: '🎨',
    items: [
      { name: 'React',        logo: 'react.png'        },
      { name: 'Tailwind CSS', logo: 'tailwind-css.png' },
      { name: 'HTML5',        logo: 'html5.png'        },
      { name: 'CSS3',         logo: 'css3.png'         },
      { name: 'Phaser.js',    logo: 'phaserjs.png'     },
    ],
  },
  {
    category: 'Backend',
    icon: '⚙️',
    items: [
      { name: 'Node.js',    logo: 'nodejs.png'    },
      { name: 'Express',    logo: 'express.png'   },
      { name: 'discord.py', logo: 'discord.png'   },
      { name: 'REST APIs',  logo: 'rest-api.png'  },
      { name: 'WebSockets', logo: 'websockets.png'},
    ],
  },
  {
    category: 'Databases',
    icon: '🗄️',
    items: [
      { name: 'MongoDB',    logo: 'mongodb.png'    },
      { name: 'PostgreSQL', logo: 'postgresql.png' },
      { name: 'MySQL',      logo: 'mysql.png'      },
      { name: 'Redis',      logo: 'redis.png'      },
      { name: 'Supabase',   logo: 'supabase.png'   },
    ],
  },
  {
    category: 'Tools & Platforms',
    icon: '🛠️',
    items: [
      { name: 'Git',     logo: 'git.png'     },
      { name: 'GitHub',  logo: 'github.png'  },
      { name: 'VS Code', logo: 'vscode.png'  },
      { name: 'Postman', logo: 'postman.png' },
      { name: 'Kiro',    logo: 'kiro.png'    },
    ],
  },
  {
    category: 'Parallel Computing',
    icon: '⚡',
    items: [
      { name: 'OpenMP', logo: 'openmp.png' },
      { name: 'MPI',    logo: 'mpi.png'    },
    ],
  },
  {
    category: 'CS Fundamentals',
    icon: '📐',
    items: [
      { name: 'Data Structures & Algorithms', logo: null },
      { name: 'OOP',                          logo: null },
      { name: 'OS Concepts',                  logo: null },
      { name: 'DBMS',                         logo: null },
      { name: 'Theory of Computation',        logo: null },
      { name: 'Parallel Computing',           logo: null },
    ],
  },
];

export default skills;
