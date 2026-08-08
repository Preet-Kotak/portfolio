/**
 * Achievements + Certificates data — used by TrophyRoomModal.
 * LeetCode + Codeforces live stats live in the separate "Stats" tab.
 *
 * Achievement fields:
 *   id          — unique key
 *   title       — achievement headline
 *   subtitle    — event / platform name
 *   icon        — emoji icon
 *   description — one line of context
 *   color       — accent color for the badge
 *   href        — (optional) link for more info
 *   certificate — (optional) { pdfPath } — if present, shows "View Certificate" button
 *                 pdfPath points to a file in public/assets/certificates/
 *   placeholder — if true, renders as a "coming soon" slide (greyed out)
 */
const achievements = [
  {
    id:          'biothon-2026',
    title:       'Finalist',
    subtitle:    'Biothon 2026',
    icon:        '🏆',
    description: 'Top finalist out of ~400 teams — KissanLink (Team No Chance), Marwadi University, Rajkot.',
    color:       '#F0C040',
    href:        'https://github.com/Preet-Kotak/kissanlink-biothon',
    certificate: {
      pdfPath: 'assets/certificates/biothon-2026.pdf',
    },
    placeholder: false,
  },
  {
    id:          'more-coming',
    title:       'More incoming...',
    subtitle:    'Stay tuned',
    icon:        '⚔️',
    description: 'Currently raiding. New trophies will be added here.',
    color:       '#6878A8',
    href:        null,
    certificate: null,
    placeholder: true,
  },
];

export default achievements;
