import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 896;

function isPortraitMobile() {
  return (
    window.innerWidth < MOBILE_BREAKPOINT &&
    window.innerHeight > window.innerWidth
  );
}

export default function OrientationPrompt() {
  const [showPrompt, setShowPrompt] = useState(isPortraitMobile);

  useEffect(() => {
    // Attempt to lock to landscape on supported browsers
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch((err) => {
        // Gracefully ignore — most desktop browsers and some mobile browsers
        // throw here (e.g. "not in fullscreen", "not supported")
        console.log('Orientation lock not supported:', err.message);
      });
    }

    function handleChange() {
      setShowPrompt(isPortraitMobile());
    }

    window.addEventListener('resize', handleChange);
    window.addEventListener('orientationchange', handleChange);

    return () => {
      window.removeEventListener('resize', handleChange);
      window.removeEventListener('orientationchange', handleChange);
    };
  }, []);

  if (!showPrompt) return null;

  return (
    <>
      <style>{`
        @keyframes rotatePhone {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(-90deg); }
          75%  { transform: rotate(-90deg); }
          100% { transform: rotate(0deg); }
        }

        .orientation-phone-icon {
          animation: rotatePhone 2.4s ease-in-out infinite;
          font-size: 72px;
          line-height: 1;
          display: block;
          margin-bottom: 24px;
          filter: drop-shadow(0 0 12px #F5A623aa);
        }
      `}</style>

      <div
        style={{
          position:        'fixed',
          inset:           0,
          zIndex:          9999,
          backgroundColor: '#1a1208',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          padding:         '32px',
          textAlign:       'center',
        }}
      >
        {/* Animated phone icon */}
        <span className="orientation-phone-icon" role="img" aria-label="rotate phone">
          📱
        </span>

        {/* CoC-style heading */}
        <h2
          style={{
            fontFamily:    '"Georgia", "Times New Roman", serif',
            fontWeight:    900,
            fontSize:      '20px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color:         '#F5A623',
            margin:        '0 0 12px 0',
            textShadow:    '0 2px 6px rgba(0,0,0,0.8)',
          }}
        >
          ROTATE YOUR DEVICE
        </h2>

        <p
          style={{
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontSize:   '15px',
            color:      '#F5F5F5',
            margin:     0,
            maxWidth:   '260px',
            lineHeight: 1.6,
            textShadow: '0 1px 4px rgba(0,0,0,0.9)',
          }}
        >
          Switch to landscape mode for the best village experience, Chief!
        </p>

        {/* Decorative border strip */}
        <div
          style={{
            marginTop:    '28px',
            width:        '160px',
            height:       '3px',
            background:   'linear-gradient(90deg, transparent, #F5A623, transparent)',
            borderRadius: '2px',
          }}
        />
      </div>
    </>
  );
}
