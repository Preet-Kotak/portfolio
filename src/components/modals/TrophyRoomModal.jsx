import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal, { C } from './Modal';
import ModalArrow from './ModalArrow';

// ── Handles ───────────────────────────────────────────────────────────
const CF_HANDLE   = 'Preet-Kotak';
const LC_USERNAME = 'Preet-Kotak';
const GH_USERNAME = 'Preet-Kotak';

const CF_URL = `https://codeforces.com/profile/${CF_HANDLE}`;
const LC_URL = `https://leetcode.com/u/${LC_USERNAME}`;
const GH_URL = `https://github.com/${GH_USERNAME}`;

// ── Platform config (for dots / tabs) ────────────────────────────────
const PLATFORMS = [
  { key: 'cf', logo: 'assets/skills/codeforces-logo.png', label: 'Codeforces' },
  { key: 'lc', logo: 'assets/skills/leetcode-logo.png',   label: 'LeetCode'   },
  { key: 'gh', logo: 'assets/skills/github-logo.png',     label: 'GitHub'     },
];

// ── CF rank colour ────────────────────────────────────────────────────
function cfRankColor(rating) {
  if (!rating || isNaN(rating)) return '#808080';
  if (rating >= 2400) return '#FF0000';
  if (rating >= 2100) return '#FF8C00';
  if (rating >= 1900) return '#AA00AA';
  if (rating >= 1600) return '#0000FF';
  if (rating >= 1400) return '#03A89E';
  if (rating >= 1200) return '#008000';
  return '#808080';
}

// ── Stat row ──────────────────────────────────────────────────────────
function StatRow({ label, value, color }) {
  return (
    <div style={{
      display:        'flex',
      justifyContent: 'space-between',
      alignItems:     'center',
      padding:        '9px 0',
      borderBottom:   `1px solid ${C.bgDark}`,
    }}>
      <span style={{ fontSize: '12px', color: C.textMuted, letterSpacing: '0.04em' }}>
        {label}
      </span>
      <span style={{ fontSize: '15px', fontWeight: 900, color: color ?? C.text }}>
        {value ?? '—'}
      </span>
    </div>
  );
}

// ── Platform card ─────────────────────────────────────────────────────
function PlatformCard({ platform, loading, error, children }) {
  const accent = platform.key === 'cf' ? '#4A90D9'
               : platform.key === 'lc' ? '#FFA116'
               :                         C.textSilver;
  const url    = platform.key === 'cf' ? CF_URL
               : platform.key === 'lc' ? LC_URL
               :                         GH_URL;

  return (
    <div style={{
      borderRadius: '12px',
      padding:      '18px 20px',
      background:   C.header,
      border:       `1px solid ${C.bgDark}`,
      position:     'relative',
      overflow:     'hidden',
      minHeight:    '180px',
      boxShadow:    'inset 0 1px 0 rgba(255,255,255,0.7)',
    }}>
      {/* top accent strip */}
      <div style={{
        position:   'absolute',
        top: 0, left: 0, right: 0,
        height:     '2px',
        background: `linear-gradient(90deg, transparent, ${accent}99, transparent)`,
      }} />

      {/* header */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        marginBottom:   '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={platform.logo}
            alt={platform.label}
            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
          />
          <span style={{
            fontSize:      '13px',
            fontWeight:    900,
            color:         accent,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {platform.label}
          </span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding:        '4px 12px',
            borderRadius:   '8px',
            textDecoration: 'none',
            fontSize:       '10px',
            fontWeight:     800,
            letterSpacing:  '0.06em',
            textTransform:  'uppercase',
            background:     `linear-gradient(180deg, ${C.btnGreenHi} 0%, ${C.btnGreen} 55%, ${C.btnGreenShadow} 100%)`,
            border:         `2px solid ${C.btnGreenBorder}`,
            boxShadow:      `0 2px 0 ${C.btnGreenShadow}`,
            color:          '#FFFFFF',
            transition:     'filter 0.1s',
            textShadow:     '0 1px 2px rgba(0,0,0,0.4)',
          }}
          onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
        >
          Visit ↗
        </a>
      </div>

      {/* body */}
      {loading ? (
        <div style={{
          fontSize:  '12px',
          color:     C.textMuted,
          textAlign: 'center',
          padding:   '24px 0',
          opacity:   0.7,
        }}>
          Loading…
        </div>
      ) : error ? (
        <div style={{
          fontSize:  '12px',
          color:     '#CC2222',
          textAlign: 'center',
          padding:   '24px 0',
        }}>
          Could not load stats
        </div>
      ) : (
        children
      )}
    </div>
  );
}

// ── Codeforces card body ──────────────────────────────────────────────
function CodeforcesBody({ data }) {
  const rc = cfRankColor(data.rating);
  const rm = cfRankColor(data.maxRating);
  return (
    <>
      <StatRow label="Rating"     value={data.rating}    color={rc} />
      <StatRow label="Max Rating" value={data.maxRating} color={rm} />
      <StatRow label="Rank"       value={data.rank}      color={rc} />
      <StatRow label="Max Rank"   value={data.maxRank}   color={rm} />
    </>
  );
}

// ── LeetCode card body ────────────────────────────────────────────────
function LeetCodeBody({ data }) {
  return (
    <>
      <StatRow label="Total Solved"  value={data.solvedProblem} color="#FFA116" />
      <StatRow label="Easy"          value={data.easySolved}    color="#00B8A3" />
      <StatRow label="Medium"        value={data.mediumSolved}  color="#FFC01E" />
      <StatRow label="Hard"          value={data.hardSolved}    color="#EF4743" />
    </>
  );
}

// ── GitHub card body ──────────────────────────────────────────────────
function GitHubBody({ data }) {
  return (
    <>
      <StatRow label="Total Commits"  value={data.totalCommits} color={C.text} />
      <StatRow label="Public Repos"   value={data.public_repos} />
      <StatRow label="Followers"      value={data.followers}    />
      <StatRow label="Following"      value={data.following}    />
    </>
  );
}

// ── Main modal ────────────────────────────────────────────────────────
function TrophyRoomModal({ isOpen, onClose }) {
  const [page,   setPage]   = useState(0);
  const [stats,  setStats]  = useState({ cf: null, lc: null, gh: null });
  const [loads,  setLoads]  = useState({ cf: true, lc: true, gh: true });
  const [errors, setErrors] = useState({ cf: false, lc: false, gh: false });

  const fetchAll = useCallback(async () => {
    setStats({ cf: null, lc: null, gh: null });
    setLoads({ cf: true, lc: true, gh: true });
    setErrors({ cf: false, lc: false, gh: false });

    // Codeforces
    fetch(`https://codeforces.com/api/user.info?handles=${CF_HANDLE}`)
      .then(r => r.json())
      .then(json => {
        if (json.status === 'OK') {
          const u = json.result[0];
          setStats(s => ({ ...s, cf: {
            rating:       u.rating       ?? 'Unrated',
            maxRating:    u.maxRating    ?? 'N/A',
            rank:         u.rank         ?? 'unrated',
            maxRank:      u.maxRank      ?? 'unrated',
            contribution: u.contribution ?? 0,
          }}));
        } else {
          setErrors(e => ({ ...e, cf: true }));
        }
      })
      .catch(() => setErrors(e => ({ ...e, cf: true })))
      .finally(() => setLoads(l => ({ ...l, cf: false })));

    // LeetCode — use /userProfile/ which returns solved counts reliably
    fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${LC_USERNAME}`)
      .then(r => r.json())
      .then(json => {
        if (json.totalSolved !== undefined) {
          setStats(s => ({ ...s, lc: {
            solvedProblem: json.totalSolved,
            easySolved:    json.easySolved,
            mediumSolved:  json.mediumSolved,
            hardSolved:    json.hardSolved,
          }}));
        } else {
          setErrors(e => ({ ...e, lc: true }));
        }
      })
      .catch(() => setErrors(e => ({ ...e, lc: true })))
      .finally(() => setLoads(l => ({ ...l, lc: false })));

    // GitHub — user info + commit count via search API
    Promise.all([
      fetch(`https://api.github.com/users/${GH_USERNAME}`).then(r => r.json()),
      fetch(`https://api.github.com/search/commits?q=author:${GH_USERNAME}`, {
        headers: { Accept: 'application/vnd.github.cloak-preview+json' }
      }).then(r => r.json()),
    ])
      .then(([user, commits]) => {
        if (user.login) {
          setStats(s => ({ ...s, gh: {
            ...user,
            totalCommits: commits.total_count ?? '—',
          }}));
        } else {
          setErrors(e => ({ ...e, gh: true }));
        }
      })
      .catch(() => setErrors(e => ({ ...e, gh: true })))
      .finally(() => setLoads(l => ({ ...l, gh: false })));
  }, []);

  // Fetch on open
  useEffect(() => {
    if (isOpen) fetchAll();
  }, [isOpen, fetchAll]);

  // Arrow key nav
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  setPage(p => Math.max(0, p - 1));
      if (e.key === 'ArrowRight') setPage(p => Math.min(PLATFORMS.length - 1, p + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const cur = PLATFORMS[page];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🏆 Trophy Room" width="min(94vw, 460px)">
      <div style={{ padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', background: C.bg }}>

        {/* refresh */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={fetchAll}
            style={{
              padding:       '3px 10px',
              borderRadius:  '6px',
              border:        `2px solid ${C.bgDark}`,
              background:    C.bgPanel,
              color:         C.textSub,
              fontSize:      '10px',
              fontWeight:    700,
              cursor:        'pointer',
              letterSpacing: '0.04em',
              transition:    'all 0.1s',
              boxShadow:     'inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.bgDark; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.bgPanel; }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* arrows + card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ModalArrow dir="left"  disabled={page === 0}                    onClick={() => setPage(p => p - 1)} />
          <div style={{ flex: 1 }}>
            <PlatformCard
              platform={cur}
              loading={loads[cur.key]}
              error={errors[cur.key]}
            >
              {cur.key === 'cf' && stats.cf && <CodeforcesBody data={stats.cf} />}
              {cur.key === 'lc' && stats.lc && <LeetCodeBody   data={stats.lc} />}
              {cur.key === 'gh' && stats.gh && <GitHubBody     data={stats.gh} />}
            </PlatformCard>
          </div>
          <ModalArrow dir="right" disabled={page === PLATFORMS.length - 1} onClick={() => setPage(p => p + 1)} />
        </div>

        <div style={{ fontSize: '9px', color: C.textMuted, textAlign: 'center' }}>
          Live stats · CF &amp; GitHub official APIs · LeetCode via community proxy
        </div>

      </div>
    </Modal>
  );
}

// prop types
TrophyRoomModal.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired };
PlatformCard.propTypes    = {
  platform: PropTypes.object.isRequired,
  loading:  PropTypes.bool,
  error:    PropTypes.bool,
  children: PropTypes.node,
};
StatRow.propTypes       = { label: PropTypes.string.isRequired, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), color: PropTypes.string };
CodeforcesBody.propTypes = { data: PropTypes.object.isRequired };
LeetCodeBody.propTypes   = { data: PropTypes.object.isRequired };
GitHubBody.propTypes     = { data: PropTypes.object.isRequired };

export default TrophyRoomModal;
export { CF_HANDLE };
