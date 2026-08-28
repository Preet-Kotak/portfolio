import { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import emailjs from '@emailjs/browser';
import MessageLog from './MessageLog';
import CloseChatButton from './CloseChatButton';

/* ── Quick action button (CoC green) ── */
function QuickBtn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:       '5px 10px',
        borderRadius:  '6px',
        border:        '1.5px solid #3a7010',
        background:    'linear-gradient(180deg, #b0e560 0%, #8bd43a 50%, #5a9a1e 100%)',
        boxShadow:     '0 2px 0 #2a6000, 0 3px 6px rgba(0,0,0,0.4)',
        color:         '#ffffff',
        fontSize:      '10px',
        fontWeight:    800,
        cursor:        'pointer',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        textShadow:    '0 1px 2px rgba(0,0,0,0.5)',
        transition:    'filter 0.1s',
        whiteSpace:    'nowrap',
        lineHeight:    1,
        flex:          '1 1 auto',
      }}
      onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.12)'; }}
      onMouseLeave={e => {
        e.currentTarget.style.filter    = '';
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 2px 0 #2a6000, 0 3px 6px rgba(0,0,0,0.4)';
      }}
      onMouseDown={e => {
        e.currentTarget.style.transform = 'translateY(2px)';
        e.currentTarget.style.boxShadow = '0 0px 0 #2a6000';
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 2px 0 #2a6000, 0 3px 6px rgba(0,0,0,0.4)';
      }}
    >
      {label}
    </button>
  );
}

/* ── Send button (CoC green) ── */
function SendBtn({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label="Send message"
      style={{
        padding:    '0 14px',
        height:     '100%',
        minHeight:  '36px',
        borderRadius:'8px',
        border:     disabled ? '1.5px solid #2a4010' : '1.5px solid #3a7010',
        background: disabled
          ? 'linear-gradient(180deg, #4a5040 0%, #343830 100%)'
          : 'linear-gradient(180deg, #b0e560 0%, #8bd43a 50%, #5a9a1e 100%)',
        boxShadow:  disabled ? 'none' : '0 3px 0 #2a6000, 0 4px 8px rgba(0,0,0,0.4)',
        color:      disabled ? '#4a5040' : '#ffffff',
        fontSize:   '15px',
        fontWeight: 900,
        cursor:     disabled ? 'default' : 'pointer',
        flexShrink: 0,
        transition: 'filter 0.1s',
        lineHeight: 1,
        textShadow: disabled ? 'none' : '0 1px 2px rgba(0,0,0,0.5)',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.12)'; }}
      onMouseLeave={e => {
        e.currentTarget.style.filter    = '';
        e.currentTarget.style.transform = '';
        if (!disabled) e.currentTarget.style.boxShadow = '0 3px 0 #2a6000, 0 4px 8px rgba(0,0,0,0.4)';
      }}
      onMouseDown={e => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(2px)';
          e.currentTarget.style.boxShadow = '0 0px 0 #2a6000';
        }
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform = '';
        if (!disabled) e.currentTarget.style.boxShadow = '0 3px 0 #2a6000, 0 4px 8px rgba(0,0,0,0.4)';
      }}
    >
      ➤
    </button>
  );
}

/* ── Quick buttons: About, Contact, Help, Clear ── */
const QUICK_ACTIONS = [
  { label: '👤 About',   command: 'about'          },
  { label: '📬 Contact', command: '__contact__'     },
  { label: '❓ Help',    command: 'help'            },
  { label: '🧹 Clear',   command: 'clear'           },
];

/* ─────────────────────────────────────────────────────────────────────
   Knowledge base — plain conversational text, \n = real line break
   Project keywords show info in chat only (no popup).
   Only the "projects" command opens the modal.
   ───────────────────────────────────────────────────────────────────── */
function buildKnowledgeBase(onOpenModal) {
  const kb = {};

  // ── Skills by category ────────────────────────────────────────────
  kb['languages'] = 'I code mainly in C, C++ and JavaScript. I also know Python, and I have done some 8086 Assembly work which was really fun to figure out.';
  kb['frontend']  = 'On the frontend I use React, Tailwind CSS, and Phaser.js. This portfolio itself is built with all three.';
  kb['front end'] = kb['frontend'];
  kb['front-end'] = kb['frontend'];
  kb['backend']   = 'For backend I work with Node.js and Express mostly. I have also built stuff with discord.py, REST APIs, and WebSockets.';
  kb['back end']  = kb['backend'];
  kb['back-end']  = kb['backend'];
  kb['server']    = kb['backend'];
  kb['databases'] = 'I have worked with MongoDB, PostgreSQL, MySQL, Redis, and Supabase. I pick based on what the project needs.';
  kb['database']  = kb['databases'];
  kb['db']        = kb['databases'];
  kb['sql']       = 'I know SQL — mainly PostgreSQL and MySQL. I have used it for user data, tournament records, and general relational stuff.';
  kb['tools']     = 'Day to day I use Git, GitHub, VS Code, Postman, and Kiro. Nothing fancy.';
  kb['stack']     = 'My main stack is React + Node.js + MongoDB or PostgreSQL on the backend, with Redis when I need caching or distributed locks. For systems stuff I drop down to C/C++.';
  kb['skills']    = () => { onOpenModal('barracks'); return 'Opening the Barracks — you can see all my skills there.\n\nOr just ask me about a specific area, like "frontend", "backend", or "databases".'; };
  kb['tech']      = kb['stack'];

  // Individual skill lookups
  const skillMap = {
    'react':      'I use React for most frontend work. This portfolio is built with it.',
    'tailwind':   'I use Tailwind for styling. Fast to write, easy to keep consistent.',
    'phaser':     'Phaser.js is what powers this whole interactive village. It handles the canvas, sprites, depth sorting, all of it.',
    'node':       'Node.js is my go-to for backend. Most of my projects use it.',
    'nodejs':     'Node.js is my go-to for backend. Most of my projects use it.',
    'express':    'I use Express for REST APIs. Lightweight and gets the job done.',
    'mongodb':    'I use MongoDB for unstructured or flexible data — like the auction bids in BidKar.',
    'redis':      'I used Redis in BidKar for distributed locking — NX/PX flags with a Lua script to prevent race conditions in live auctions.',
    'postgresql': 'I use PostgreSQL for relational data. Used it heavily for the tournament bot — match records, player stats, all that.',
    'postgres':   'I use PostgreSQL for relational data. Used it heavily for the tournament bot.',
    'supabase':   'I used Supabase in the tournament bot as the hosted Postgres provider. Easy to set up, good free tier.',
    'python':     'I use Python mainly for scripting and discord bots. The tournament bot is about 5000 lines of Python.',
    'discord.py': 'discord.py is what I used to build the CoC tournament bot. Got pretty deep into its async patterns.',
    'assembly':   'I wrote a full calculator in 8086 Assembly — multi-digit arithmetic, fixed-point decimals, square root. Painful but worth it.',
    '8086':       'I wrote a full calculator in 8086 Assembly — multi-digit arithmetic, fixed-point decimals, square root. Painful but worth it.',
    'c++':        'C++ is where I do most competitive programming. Clean, fast, and I know the STL well.',
    'openmp':     'I have used OpenMP and MPI for parallel computing — mostly for coursework but I found it genuinely interesting.',
    'mpi':        'I have used OpenMP and MPI for parallel computing — mostly for coursework but I found it genuinely interesting.',
    'websockets': 'I used WebSockets via Socket.io in BidKar for real-time bidding. Everyone in a room sees bids instantly.',
    'socket.io':  'Socket.io powers the real-time bidding in BidKar. I also handled the edge case of concurrent bids with Redis locks.',
    'git':        'I use Git daily. Nothing special to say — just version control everything.',
    'github':     kb['github'] ?? 'My GitHub is github.com/Preet-Kotak. Most of my projects are there.',
    'vscode':     'VS Code is my main editor. I have been experimenting with Kiro too lately.',
    'kiro':       'Kiro is the AI dev environment I am using to build this portfolio. It is quite good for iterating fast.',
    'postman':    'I use Postman to test APIs during development. Quick to set up, saves a lot of time.',
    'dsa':        'DSA is something I actively practice — mostly on Codeforces. Graphs, trees, segment trees, that kind of thing.',
    'algorithms': 'I practise algorithms on Codeforces. I enjoy graph problems and dynamic programming the most.',
  };
  Object.entries(skillMap).forEach(([k, v]) => { kb[k] = v; });

  // ── Projects — show in chat, do NOT open modal ────────────────────
  kb['bidkar'] = 'BidKar is a real-time auction platform — 3-person team. I did roughly half the backend with one of my friends.\n\nI built the Redis distributed lock using NX/PX flags and a Lua script to prevent race conditions when multiple people bid at the same time, a mock Aadhaar verification API, and the auction lifecycle cron jobs. Once the backend was solid I also helped with frontend cleanup and the remaining UI work.\n\nStack: Node.js, Express, MongoDB, Redis, Socket.io, JWT, Razorpay.';

  kb['auction'] = kb['bidkar'];

  kb['tournament bot'] = 'The CoC tournament bot is probably my biggest project — around 5000 lines of Python.\n\nIt ran a live Clash of Clans esports tournament: 43 slash commands across 7 cogs, PIL-generated match images, and an anti-scam honeypot system.\n\nStack: discord.py, PostgreSQL, asyncpg, Supabase, PIL.';
  kb['tournament']     = kb['tournament bot'];
  kb['discord bot']    = kb['tournament bot'];
  kb['coc bot']        = kb['tournament bot'];
  kb['bot']            = kb['tournament bot'];

  kb['kissanlink'] = 'KissanLink was a hackathon project for Biothon 2026 — around 400 teams total participated.\n\nIt is a WhatsApp-native marketplace for rural farmers in Gujarat. Works over 2G, has a Gujarati conversational chatbot, and uses MongoDB geospatial matching to connect farmers with nearby buyers. We built the whole thing during the hackathon and made it to the finals.\n\nStack: Node.js, Express, MongoDB, Twilio, Render.';
  kb['kissan']     = kb['kissanlink'];
  kb['farmer']     = kb['kissanlink'];
  kb['whatsapp']   = kb['kissanlink'];
  kb['biothon']    = 'I was a Biothon 2026 Finalist — around 400 teams participated in total. My project was KissanLink, a WhatsApp-native marketplace for rural Gujarat farmers built during the hackathon.';

  kb['8086 calculator'] = 'I built a fully working calculator in 16-bit 8086 Assembly for my Microprocessor subject — wanted a real project, not just lab exercises.\n\nThe 8086 only has 16-bit registers so the max is 65535. I chained two registers (high word + low word) to get 32-bit arithmetic — handles up to 2.14 billion. Decimals work via fixed-point: every number is internally multiplied by 100, decimal point inserted on screen. Square root uses a digit-by-digit base-4 algorithm since there is no FPU instruction for it.\n\nIt also does HEX and BIN conversions including fractional parts (e.g. 10.5 → 1010.1 in binary), memory ops (MS/MR/MC), overflow and divide-by-zero detection, and a hand-drawn 80×25 text-mode UI you navigate with arrow keys.\n\nStack: 8086 Assembly, TASM, DOSBox.';
  kb['calculator'] = kb['8086 calculator'];

  kb['coc portfolio'] = 'You are literally looking at it right now.\n\nIsometric CoC village built with Phaser.js and React — every building opens a different section. The chat (this) is part of it too.\n\nStack: React, Phaser.js, Vite, Tailwind.';
  kb['portfolio']      = kb['coc portfolio'];

  // "projects" command → open modal
  kb['projects'] = () => { onOpenModal('builderhut'); return "Opening the Builder's Hut — all my projects are in there.\n\nOr ask me about a specific one: BidKar, tournament bot, KissanLink, 8086 calculator."; };

  // ── Competitive stats — live fetch ────────────────────────────────
  const cfFetch = async () => {
    try {
      const r = await fetch('https://codeforces.com/api/user.info?handles=Preet-Kotak');
      const j = await r.json();
      if (j.status !== 'OK') return 'Could not fetch Codeforces right now, try again in a bit.';
      const u = j.result[0];
      return `Codeforces handle: Preet-Kotak\nRating: ${u.rating ?? '—'} (max ${u.maxRating ?? '—'})\nRank: ${u.rank ?? '—'} (max ${u.maxRank ?? '—'})`;
    } catch { return 'Could not fetch Codeforces right now, try again in a bit.'; }
  };

  const lcFetch = async () => {
    try {
      const r = await fetch('https://alfa-leetcode-api.onrender.com/Preet-Kotak/solved');
      const j = await r.json();
      return `LeetCode handle: Preet-Kotak\nSolved: ${j.solvedProblem ?? '—'} total\nEasy: ${j.easySolved ?? '—'}   Medium: ${j.mediumSolved ?? '—'}   Hard: ${j.hardSolved ?? '—'}`;
    } catch { return 'Could not fetch LeetCode right now, try again in a bit.'; }
  };

  const ghFetch = async () => {
    try {
      const [uRes, evRes] = await Promise.all([
        fetch('https://api.github.com/users/Preet-Kotak'),
        fetch('https://api.github.com/search/commits?q=author:Preet-Kotak&per_page=1', {
          headers: { Accept: 'application/vnd.github.cloak-preview' },
        }),
      ]);
      const u  = await uRes.json();
      const ev = await evRes.json();
      return `GitHub: github.com/Preet-Kotak\nPublic repos: ${u.public_repos ?? '—'}\nFollowers: ${u.followers ?? '—'}   Following: ${u.following ?? '—'}\nTotal commits: ${ev.total_count ?? '—'}`;
    } catch { return 'Could not fetch GitHub right now, try again in a bit.'; }
  };

  ['codeforces', 'cf', 'competitive', 'cp', 'rating', 'competitive programming'].forEach(k => { kb[k] = cfFetch; });
  ['leetcode', 'lc', 'solving', 'solved', 'problems'].forEach(k => { kb[k] = lcFetch; });
  ['repos', 'commits', 'open source', 'contributions'].forEach(k => { kb[k] = ghFetch; });
  // github alone is ambiguous — could mean the link or stats; show link + offer stats
  kb['github'] = `My GitHub is github.com/Preet-Kotak — most of my projects are there.\n\nType "github stats" if you want the numbers.`;
  kb['github stats'] = ghFetch;

  // ── Trophy room ───────────────────────────────────────────────────
  kb['trophies'] = () => { onOpenModal('trophy'); return 'Opening the Trophy Room — live stats from Codeforces, LeetCode and GitHub.'; };
  kb['trophy']   = kb['trophies'];
  kb['stats']    = 'Which platform? Type "codeforces", "leetcode", or "github stats".';

  // ── About ─────────────────────────────────────────────────────────
  kb['about'] = () => { onOpenModal('about'); return 'Opening my profile.'; };
  kb['who']   = "I'm Preet — B.Tech CSE student at SVNIT Surat (CGPA 7.95). I do full-stack dev and competitive programming. Click the Town Hall or type \"about\" for more.";
  kb['preet'] = kb['who'];
  kb['name']  = kb['who'];

  // ── Education ─────────────────────────────────────────────────────
  kb['education'] = "B.Tech CSE at SVNIT Surat. Currently in my program with a CGPA of 7.95.";
  kb['svnit']     = kb['education'];
  kb['college']   = kb['education'];
  kb['university']= kb['education'];
  kb['cgpa']      = "My CGPA is 7.95 at SVNIT Surat.";
  kb['gpa']       = kb['cgpa'];

  // ── Contact ───────────────────────────────────────────────────────
  kb['contact']  = "Email: preetdkotak@gmail.com\nLinkedIn: linkedin.com/in/preet-kotak-8538b033a\nGitHub: github.com/Preet-Kotak";
  kb['email']    = kb['contact'];
  kb['linkedin'] = kb['contact'];
  kb['hire']     = "Preet is open to both internships and full-time roles.\n\nBest way to reach him: preetdkotak@gmail.com or LinkedIn at linkedin.com/in/preet-kotak-8538b033a";
  kb['internship']= kb['hire'];
  kb['job']      = kb['hire'];
  kb['available']= kb['hire'];
  kb['full time']= kb['hire'];
  kb['fulltime'] = kb['hire'];
  kb['full-time']= kb['hire'];
  kb['work']     = kb['hire'];
  kb['opportunity'] = kb['hire'];
  kb['opportunities']= kb['hire'];
  kb['recruit']  = kb['hire'];
  kb['recruiting']= kb['hire'];
  kb['hire me']  = kb['hire'];

  // ── Achievements ──────────────────────────────────────────────────
  kb['achievements'] = () => { onOpenModal('laboratory'); return 'Opening my achievements.'; };
  kb['awards']       = kb['achievements'];
  kb['gwoc']         = 'I participated in GirlScript Winter of Code — contributed to open source projects during the program.';
  kb['hackathon']    = kb['biothon'];

  // ── Resume ────────────────────────────────────────────────────────
  kb['resume'] = () => { onOpenModal('resume'); return 'Opening my resume.'; };
  kb['cv']     = kb['resume'];

  // ── Help ──────────────────────────────────────────────────────────
  kb['help'] = `Here is what you can ask me:\n\nabout me — about, who, preet\nmy work — projects, bidkar, tournament bot, kissanlink, calculator\nskills — frontend, backend, databases, languages, tools, stack\nstats — codeforces, leetcode, github stats\nother — education, contact, hire, resume, achievements\n\nI am open to internships and full-time roles — type "hire" for details.\n\nOr just type anything — I will try to figure it out.`;

  // ── Clear ─────────────────────────────────────────────────────────
  kb['clear'] = '__clear__';

  return kb;
}

function getTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}

/* ── Main ChatPanel ── */
function ChatPanel({ isOpen, onClose, onOpenModal, onBotReply }) {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Hey! Ask me anything about Preet.\n\nTry: "frontend", "bidkar", "leetcode", or "help" for everything I know.', time: getTime() },
  ]);
  const [input, setInput]   = useState('');
  const inputRef            = useRef(null);
  const nextId              = useRef(2);
  const kb                  = useRef(null);
  if (!kb.current) kb.current = buildKnowledgeBase(onOpenModal);

  // Notification sound delegated to parent (App) so it respects global musicOn
  const playNotif = useCallback(() => {
    onBotReply?.();
  }, [onBotReply]);

  // ── Contact flow state machine ──────────────────────────────────
  // null = not in flow  |  'name' | 'email' | 'message' | 'sending'
  const contactStep = useRef(null);
  const contactData = useRef({ name: '', email: '', message: '' });

  const botMsg = useCallback((text) => {
    setMessages(prev => [...prev, { id: nextId.current++, role: 'bot', text, time: getTime() }]);
    playNotif();
  }, [playNotif]);

  const startContactFlow = useCallback(() => {
    contactStep.current = 'name';
    contactData.current = { name: '', email: '', message: '' };
    setMessages(prev => [
      ...prev,
      { id: nextId.current++, role: 'user', text: '📬 Contact', time: getTime() },
      { id: nextId.current++, role: 'bot',  text: "Sure! Let's get a message to Preet.\n\nWhat's your name, Chief?", time: getTime() },
    ]);
    playNotif();
    setInput('');
  }, [playNotif]);

  const cancelContactFlow = useCallback(() => {
    contactStep.current = null;
    contactData.current = { name: '', email: '', message: '' };
  }, []);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput('');

    // ── Contact flow intercept ─────────────────────────────────────
    if (contactStep.current) {
      const step = contactStep.current;

      // Clear cancels the flow at any point
      if (trimmed.toLowerCase() === 'clear') {
        cancelContactFlow();
        setMessages([{ id: nextId.current++, role: 'bot', text: '🧹 Chat cleared!', time: getTime() }]);
        return;
      }

      setMessages(prev => [...prev, { id: nextId.current++, role: 'user', text: trimmed, time: getTime() }]);

      if (step === 'name') {
        contactData.current.name = trimmed;
        contactStep.current = 'email';
        botMsg(`Nice to meet you, ${trimmed}! 👋\n\nWhat's your email address?`);
        return;
      }

      if (step === 'email') {
        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          botMsg("That doesn't look like a valid email. Try again?");
          return;
        }
        contactData.current.email = trimmed;
        contactStep.current = 'message';
        botMsg("Got it! Now type your message and hit Enter to send it.");
        return;
      }

      if (step === 'message') {
        contactData.current.message = trimmed;
        contactStep.current = 'sending';

        // Show sending indicator
        const typingId = nextId.current++;
        setMessages(prev => [...prev, { id: typingId, role: 'bot', text: '📨 Sending…', time: getTime() }]);

        try {
          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            {
              from_name:  contactData.current.name,
              from_email: contactData.current.email,
              message:    contactData.current.message,
            },
            { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
          );
          setMessages(prev => prev.map(m =>
            m.id === typingId
              ? { ...m, text: `✅ Message sent! I'll get back to you soon, ${contactData.current.name}.` }
              : m
          ));
          playNotif();
        } catch (err) {
          console.error('EmailJS error:', err);
          setMessages(prev => prev.map(m =>
            m.id === typingId
              ? { ...m, text: '❌ Failed to send. Please try emailing directly: preetdkotak@gmail.com' }
              : m
          ));
          playNotif();
        }

        contactStep.current = null;
        contactData.current = { name: '', email: '', message: '' };
        return;
      }

      return;
    }

    // ── Normal chat flow ───────────────────────────────────────────
    // Handle contact quick button
    if (trimmed === '__contact__') {
      startContactFlow();
      return;
    }

    const userMsg = { id: nextId.current++, role: 'user', text: trimmed, time: getTime() };
    setMessages(prev => [...prev, userMsg]);

    const cmd = trimmed.toLowerCase();

    // Also allow "contact" keyword to start flow
    if (cmd === 'contact' || cmd === 'send message' || cmd === 'message') {
      startContactFlow();
      return;
    }

    // 1. Exact full phrase
    let handler = kb.current[cmd];

    // 2. Sliding window: try 3-word then 2-word substrings
    if (!handler) {
      const words = cmd.split(/\s+/);
      outer: for (let len = Math.min(3, words.length); len >= 2; len--) {
        for (let i = 0; i <= words.length - len; i++) {
          const phrase = words.slice(i, i + len).join(' ');
          if (kb.current[phrase]) { handler = kb.current[phrase]; break outer; }
        }
      }
    }

    // 3. Single word scan — first match wins
    if (!handler) {
      const words = cmd.split(/\s+/);
      for (const word of words) {
        if (kb.current[word]) { handler = kb.current[word]; break; }
      }
    }

    // 4. Partial contains — key is substring of input or vice versa
    if (!handler) {
      const keys = Object.keys(kb.current);
      const found = keys.find(k => k.length > 3 && (cmd.includes(k) || k.includes(cmd)));
      if (found) handler = kb.current[found];
    }

    if (!handler) {
      const botMsg2 = { id: nextId.current++, role: 'bot', text: 'Not sure about that one. Type "help" to see what I can answer.', time: getTime() };
      setMessages(prev => [...prev, botMsg2]);
      playNotif();
      return;
    }

    if (handler === '__clear__') {
      setMessages([{ id: nextId.current++, role: 'bot', text: '🧹 Chat cleared!', time: getTime() }]);
      return;
    }

    const typingId = nextId.current++;
    setMessages(prev => [...prev, { id: typingId, role: 'bot', text: '…', time: getTime() }]);

    try {
      const result = typeof handler === 'function' ? await handler() : handler;
      setMessages(prev => prev.map(m => m.id === typingId ? { ...m, text: result } : m));
      playNotif();
    } catch {
      setMessages(prev => prev.map(m => m.id === typingId ? { ...m, text: '❌ Something went wrong.' } : m));
      playNotif();
    }
  }, [onOpenModal, startContactFlow, cancelContactFlow, botMsg, playNotif]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }, [input, sendMessage]);

  if (!isOpen) return null;

  return (
    <div style={{
      position:     'fixed',
      left:         0,
      top:          0,
      bottom:       0,
      zIndex:       44,
      display:      'flex',
      flexDirection:'row',
      alignItems:   'center',
      pointerEvents:'none',
    }}>
      {/* ── Panel ── */}
      <div style={{
        /* wider on desktop, full-ish on mobile */
        width:         'min(400px, 88vw)',
        height:        '100%',
        display:       'flex',
        flexDirection: 'column',
        pointerEvents: 'all',
        borderRadius:  '0 12px 12px 0',
        overflow:      'hidden',
        boxShadow:     '0 0 24px rgba(0,0,0,0.65)',
        animation:     'chatSlideIn 0.22s cubic-bezier(0.22,1,0.36,1) both',
        border:        '2px solid #4a2e0a',
        borderLeft:    'none',
      }}>

        {/* ── Header ── */}
        <div style={{
          background:     'linear-gradient(180deg, #9a7030 0%, #7d5b20 40%, #5a3a10 100%)',
          borderBottom:   '2px solid #3a2008',
          padding:        '0 12px',
          height:         '44px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
          position:       'relative',
          boxShadow:      'inset 0 1px 0 rgba(255,220,120,0.25), inset 0 -1px 0 rgba(0,0,0,0.3)',
        }}>
          <div style={{ position:'absolute', left:'10px', width:'8px', height:'8px', borderRadius:'50%', background:'radial-gradient(circle at 35% 35%, #f5d060, #c88a00)', border:'1px solid #8a5a00', boxShadow:'0 1px 2px rgba(0,0,0,0.5)' }} />
          <span style={{ color:'#f5e8c0', fontSize:'12px', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', textShadow:'0 1px 3px rgba(0,0,0,0.6)' }}>
            💬 Village Chat
          </span>
          <div style={{ position:'absolute', right:'10px', width:'8px', height:'8px', borderRadius:'50%', background:'radial-gradient(circle at 35% 35%, #f5d060, #c88a00)', border:'1px solid #8a5a00', boxShadow:'0 1px 2px rgba(0,0,0,0.5)' }} />
        </div>

        {/* ── Message log ── */}
        <div style={{ flex:1, background:'#2e2a27', overflow:'hidden', display:'flex', flexDirection:'column', minHeight:0 }}>
          <MessageLog messages={messages} />
        </div>

        {/* ── Quick buttons (1 row of 4) ── */}
        <div style={{
          background:  '#252220',
          borderTop:   '1px solid #3a3028',
          padding:     '7px 8px',
          display:     'flex',
          gap:         '5px',
          flexShrink:  0,
        }}>
          {QUICK_ACTIONS.map(({ label, command }) => (
            <QuickBtn key={command} label={label} onClick={() => sendMessage(command)} />
          ))}
        </div>

        {/* ── Input ── */}
        <div style={{ background:'#1e1b18', borderTop:'2px solid #3a2008', padding:'8px', display:'flex', gap:'6px', alignItems:'stretch', flexShrink:0 }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              // Stop ALL keys from reaching Phaser's window listeners (fixes WASD camera)
              e.stopPropagation();
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            onKeyUp={e => e.stopPropagation()}
            onKeyPress={e => e.stopPropagation()}
            placeholder="e.g. frontend · leetcode · bidkar"
            rows={1}
            style={{
              flex:       1,
              minHeight:  '36px',
              maxHeight:  '80px',
              padding:    '8px 10px',
              borderRadius:'8px',
              border:     '1.5px solid #5a4a35',
              background: '#2e2a27',
              color:      '#e8dcc8',
              fontSize:   '11px',
              fontFamily: 'inherit',
              resize:     'none',
              outline:    'none',
              lineHeight: '1.4',
              boxShadow:  'inset 0 1px 4px rgba(0,0,0,0.4)',
              transition: 'border-color 0.15s',
              overflowY:  'auto',
              WebkitOverflowScrolling: 'touch',
              boxSizing:  'border-box',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#c88a00'; }}
            onBlur={e =>  { e.currentTarget.style.borderColor = '#5a4a35'; }}
          />
          <SendBtn onClick={() => sendMessage(input)} disabled={!input.trim()} />
        </div>

      </div>

      {/* ── Close button — sits immediately right of panel ── */}
      <div style={{ pointerEvents:'all', flexShrink:0, marginLeft:'6px' }}>
        <CloseChatButton onClick={onClose} />
      </div>

    </div>
  );
}

ChatPanel.propTypes = {
  isOpen:      PropTypes.bool.isRequired,
  onClose:     PropTypes.func.isRequired,
  onOpenModal: PropTypes.func.isRequired,
  onBotReply:  PropTypes.func,
};

QuickBtn.propTypes = {
  label:   PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

SendBtn.propTypes = {
  onClick:  PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default ChatPanel;
