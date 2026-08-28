/**
 * WaveDivider — three-layer SVG wave that transitions between the dark
 * brown gradient and the light parchment gradient.
 *
 * Props:
 *   direction  'to-dark'  — fills with pro-darkGrad  (use at bottom of light sections)
 *              'to-light' — fills with pro-lightGrad  (use at bottom of dark sections)
 *
 * Desktop height: 82px.  Mobile (≤768px): 44px — less intrusive on small screens.
 * Parent section must have  position: relative.
 */
import PropTypes from 'prop-types';

const WAVE_PATHS = {
  p1: 'M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z',
  p2: 'M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z',
  p3: 'M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z',
};

const WAVE_STYLES = `
  .pro-wave-svg {
    display: block;
    width: calc(100% + 1.3px);
    height: 82px;
  }
  @media only screen and (max-width: 768px) {
    .pro-wave-svg { height: 44px; }
  }
`;

export default function WaveDivider({ direction = 'to-dark' }) {
  const isDark  = direction === 'to-dark';
  const fillUrl = isDark ? 'url(#pro-darkGrad)' : 'url(#pro-lightGrad)';

  return (
    <>
      <style>{WAVE_STYLES}</style>
      <div
        style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          width:      '100%',
          overflow:   'hidden',
          lineHeight: 0,
          transform:  'rotate(180deg)',
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="pro-wave-svg"
          style={{ transform: isDark ? 'rotateY(180deg)' : undefined }}
        >
          <path fill={fillUrl} fillOpacity="0.25" d={WAVE_PATHS.p1} />
          <path fill={fillUrl} fillOpacity="0.5"  d={WAVE_PATHS.p2} />
          <path fill={fillUrl}                    d={WAVE_PATHS.p3} />
        </svg>
      </div>
    </>
  );
}

WaveDivider.propTypes = {
  direction: PropTypes.oneOf(['to-dark', 'to-light']),
};
