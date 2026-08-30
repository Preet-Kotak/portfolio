/**
 * ContactFormModal — CoC-styled contact form.
 * Fields: Name, Email, Message.
 * Sends via EmailJS. Falls back gracefully if env vars aren't set.
 *
 * Required env vars in .env:
 *   VITE_EMAILJS_SERVICE_ID
 *   VITE_EMAILJS_TEMPLATE_ID
 *   VITE_EMAILJS_PUBLIC_KEY
 *
 * EmailJS template variables expected:
 *   {{from_name}}, {{from_email}}, {{message}}
 */

import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import emailjs from '@emailjs/browser';
import { trackEvent } from '../../utils/analytics';
import Modal, { C, useMobile } from './Modal';

/* ── labelled input/textarea field ───────────────────────────── */
function Field({ label, type = 'text', value, onChange, placeholder, rows, disabled, error }) {
  const mobile = useMobile();
  const [focused, setFocused] = useState(false);

  const base = {
    width:       '100%',
    padding:     mobile ? '7px 9px' : '8px 10px',
    borderRadius:'8px',
    border:      `1.5px solid ${error ? '#CC2222' : focused ? C.gold : C.bgDark}`,
    background:  disabled ? C.bgDark : C.bgPanel,
    color:       C.text,
    fontSize:    mobile ? '11px' : '12px',
    fontFamily:  '"Segoe UI", system-ui, sans-serif',
    outline:     'none',
    resize:      'none',
    lineHeight:  1.5,
    boxShadow:   'inset 0 1px 3px rgba(0,0,0,0.08)',
    transition:  'border-color 0.15s',
    boxSizing:   'border-box',
    opacity:     disabled ? 0.6 : 1,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{
        fontSize:      mobile ? '9px' : '10px',
        fontWeight:    800,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color:         error ? '#CC2222' : C.textGold,
        fontFamily:    '"Segoe UI", system-ui, sans-serif',
      }}>
        {label}{error && <span style={{ marginLeft: '6px', fontWeight: 700, letterSpacing: 0 }}>{error}</span>}
      </label>
      {rows ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          style={base}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => e.stopPropagation()}
          onKeyUp={e => e.stopPropagation()}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={base}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => e.stopPropagation()}
          onKeyUp={e => e.stopPropagation()}
        />
      )}
    </div>
  );
}

/* ── main modal ──────────────────────────────────────────────── */
function ContactFormModal({ isOpen, onClose }) {
  const mobile = useMobile();
  const formRef = useRef(null);

  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [errors,  setErrors]  = useState({});
  const [status,  setStatus]  = useState('idle'); // idle | sending | success | error

  function validate() {
    const e = {};
    if (!name.trim())                          e.name    = '— required';
    if (!email.trim())                         e.email   = '— required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = '— invalid format';
    if (!message.trim())                       e.message = '— required';
    else if (message.trim().length < 10)       e.message = '— too short';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      /* env vars not set yet — show a helpful dev message */
      setStatus('noenv');
      return;
    }

    setStatus('sending');
    try {
      await emailjs.send(
        serviceId,
        templateId,
        { from_name: name.trim(), from_email: email.trim(), message: message.trim() },
        { publicKey },
      );
      trackEvent('Engagement', 'Contact Form Submitted', 'success');
      setStatus('success');
      setName(''); setEmail(''); setMessage(''); setErrors({});
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  }

  function handleClose() {
    setStatus('idle');
    setErrors({});
    onClose();
  }

  const sending = status === 'sending';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Send a Message">
      <div style={{
        padding:       mobile ? '12px 12px 16px' : '18px 16px 22px',
        display:       'flex',
        flexDirection: 'column',
        gap:           mobile ? '12px' : '14px',
        background:    C.bg,
      }}>

        {/* ── success state ── */}
        {status === 'success' && (
          <div style={{
            borderRadius: '10px',
            padding:      mobile ? '14px 12px' : '18px 16px',
            background:   C.bgPanel,
            border:       `1px solid ${C.bgDark}`,
            textAlign:    'center',
            display:      'flex',
            flexDirection:'column',
            alignItems:   'center',
            gap:          '10px',
          }}>
            <div style={{ fontSize: '36px' }}>✅</div>
            <div style={{ fontSize: mobile ? '12px' : '13px', fontWeight: 800, color: C.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Message Sent!
            </div>
            <div style={{ fontSize: mobile ? '10px' : '11px', color: C.textSub, lineHeight: 1.6 }}>
              Thanks for reaching out. I&apos;ll get back to you soon.
            </div>
            <button
              onClick={handleClose}
              style={{
                marginTop:     '4px',
                padding:       mobile ? '7px 20px' : '8px 24px',
                borderRadius:  '10px',
                border:        `2px solid ${C.btnGreenBorder}`,
                background:    `linear-gradient(180deg, ${C.btnGreenHi} 0%, ${C.btnGreen} 55%, ${C.btnGreenShadow} 100%)`,
                boxShadow:     `0 4px 0 ${C.btnGreenShadow}`,
                color:         '#fff',
                fontSize:      mobile ? '10px' : '11px',
                fontWeight:    800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                cursor:        'pointer',
                textShadow:    '0 1px 2px rgba(0,0,0,0.4)',
                fontFamily:    '"Segoe UI", system-ui, sans-serif',
              }}
            >
              Close
            </button>
          </div>
        )}

        {/* ── no-env state (dev only) ── */}
        {status === 'noenv' && (
          <div style={{
            borderRadius: '10px',
            padding:      '12px',
            background:   '#FFF8E8',
            border:       `1px solid ${C.gold}`,
            fontSize:     mobile ? '10px' : '11px',
            color:        C.textSub,
            lineHeight:   1.6,
          }}>
            <strong style={{ color: C.textGold }}>⚠ EmailJS not configured yet.</strong><br />
            Add these to your <code style={{ background: C.bgDark, padding: '1px 4px', borderRadius: 3 }}>.env</code> file:<br />
            <code style={{ fontSize: '10px', display: 'block', marginTop: '6px', color: C.text }}>
              VITE_EMAILJS_SERVICE_ID=...<br />
              VITE_EMAILJS_TEMPLATE_ID=...<br />
              VITE_EMAILJS_PUBLIC_KEY=...
            </code>
          </div>
        )}

        {/* ── error state ── */}
        {status === 'error' && (
          <div style={{
            borderRadius: '8px',
            padding:      '10px 12px',
            background:   '#FFF0F0',
            border:       '1px solid #CC2222',
            fontSize:     mobile ? '10px' : '11px',
            color:        '#882222',
            lineHeight:   1.5,
          }}>
            ❌ Failed to send. Check your connection and try again.
          </div>
        )}

        {/* ── form (hidden on success) ── */}
        {status !== 'success' && (
          <>
            <Field
              label="Your Name"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: '' })); }}
              placeholder="Chief"
              disabled={sending}
              error={errors.name}
            />
            <Field
              label="Your Email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: '' })); }}
              placeholder="chief@example.com"
              disabled={sending}
              error={errors.email}
            />
            <Field
              label="Message"
              value={message}
              onChange={e => { setMessage(e.target.value); setErrors(v => ({ ...v, message: '' })); }}
              placeholder="Say hi, ask about a project, or just send a raven..."
              rows={4}
              disabled={sending}
              error={errors.message}
            />

            {/* submit button */}
            <button
              ref={formRef}
              onClick={handleSubmit}
              disabled={sending}
              style={{
                width:         '100%',
                padding:       mobile ? '9px 0' : '10px 0',
                borderRadius:  '10px',
                border:        `2px solid ${C.btnGreenBorder}`,
                background:    sending
                  ? `linear-gradient(180deg, #B0A898 0%, #908878 55%, #706858 100%)`
                  : `linear-gradient(180deg, ${C.btnGreenHi} 0%, ${C.btnGreen} 55%, ${C.btnGreenShadow} 100%)`,
                boxShadow:     sending ? `0 2px 0 #504840` : `0 4px 0 ${C.btnGreenShadow}, 0 6px 12px rgba(0,0,0,0.2)`,
                color:         '#FFFFFF',
                fontSize:      mobile ? '11px' : '12px',
                fontWeight:    800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                cursor:        sending ? 'default' : 'pointer',
                textShadow:    '0 1px 2px rgba(0,0,0,0.4)',
                transition:    'filter 0.08s',
                fontFamily:    '"Segoe UI", system-ui, sans-serif',
              }}
              onMouseEnter={e => { if (!sending) e.currentTarget.style.filter = 'brightness(1.1)'; }}
              onMouseLeave={e => {
                e.currentTarget.style.filter = '';
                e.currentTarget.style.transform = '';
                if (!sending) e.currentTarget.style.boxShadow = `0 4px 0 ${C.btnGreenShadow}, 0 6px 12px rgba(0,0,0,0.2)`;
              }}
              onMouseDown={e => {
                if (sending) return;
                e.currentTarget.style.transform = 'translateY(3px)';
                e.currentTarget.style.boxShadow = `0 1px 0 ${C.btnGreenShadow}`;
              }}
              onMouseUp={e => {
                if (sending) return;
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = `0 4px 0 ${C.btnGreenShadow}, 0 6px 12px rgba(0,0,0,0.2)`;
              }}
            >
              {sending ? 'Sending…' : '⚔️  Send Message'}
            </button>

            {/* direct contact fallback */}
            <div style={{
              borderRadius:  '8px',
              padding:       mobile ? '7px 10px' : '8px 12px',
              background:    C.bgPanel,
              border:        `1px solid ${C.bgDark}`,
              textAlign:     'center',
              fontSize:      mobile ? '9px' : '9.5px',
              color:         C.textMuted,
              letterSpacing: '0.03em',
              lineHeight:    1.6,
            }}>
              Or email directly:{' '}
              <a
                href="mailto:preetdkotak@gmail.com"
                style={{ color: C.textGold, textDecoration: 'none', fontWeight: 700 }}
              >
                preetdkotak@gmail.com
              </a>
            </div>
          </>
        )}

      </div>
    </Modal>
  );
}

ContactFormModal.propTypes = {
  isOpen:  PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

Field.propTypes = {
  label:       PropTypes.string.isRequired,
  type:        PropTypes.string,
  value:       PropTypes.string.isRequired,
  onChange:    PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows:        PropTypes.number,
  disabled:    PropTypes.bool,
  error:       PropTypes.string,
};

export default ContactFormModal;
