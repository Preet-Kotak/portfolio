/**
 * ProfessionalPage — Phase 11 placeholder.
 * This page will be built out in Phase 11.
 */

export default function ProfessionalPage() {
  return (
    <div style={{
      position:        'fixed',
      inset:           0,
      backgroundColor: '#0f172a',
      display:         'flex',
      flexDirection:   'column',
      alignItems:      'center',
      justifyContent:  'center',
      fontFamily:      '"Segoe UI", system-ui, sans-serif',
      color:           '#94a3b8',
      textAlign:       'center',
      padding:         '32px',
    }}>
      <div style={{
        fontSize:      '48px',
        marginBottom:  '24px',
        filter:        'grayscale(0.3)',
      }}>
        💼
      </div>
      <h1 style={{
        color:         '#e2e8f0',
        fontSize:      'clamp(20px, 4vw, 32px)',
        fontWeight:    700,
        marginBottom:  '12px',
        letterSpacing: '-0.02em',
      }}>
        Professional Portfolio
      </h1>
      <p style={{
        fontSize:    'clamp(13px, 2vw, 16px)',
        maxWidth:    '380px',
        lineHeight:  1.7,
        margin:      '0 0 32px',
      }}>
        Coming in Phase 11 — a clean, modern resume-style portfolio experience.
      </p>
      <div style={{
        width:        '40px',
        height:       '2px',
        background:   'linear-gradient(90deg, transparent, #64748b, transparent)',
        borderRadius: '2px',
      }} />
    </div>
  );
}
