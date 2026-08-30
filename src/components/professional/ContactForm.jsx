/**
 * ContactForm — Task 11.9
 * EmailJS contact form with validation
 */
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import about from '../../data/about';

const STYLES = `
  .pro-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    margin: 0;
  }

  .pro-form__group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .pro-form__label {
    font-family: "Fira Code", monospace;
    font-size: 14px;
    color: var(--muted-text);
  }

  .pro-form__input,
  .pro-form__textarea {
    background: transparent;
    border: 1px solid var(--muted-text);
    border-radius: 8px;
    padding: 12px 16px;
    font-family: "Fira Code", monospace;
    font-size: 14px;
    color: var(--dark-text);
    transition: border-color 200ms ease, outline 200ms ease;
  }

  .pro-form__input::placeholder,
  .pro-form__textarea::placeholder {
    color: var(--muted-text);
    opacity: 0.7;
  }

  .pro-form__input:focus,
  .pro-form__textarea:focus {
    border-color: var(--gold);
    outline: 2px solid var(--gold);
    outline-offset: -2px;
  }

  .pro-form__input.pro-form__input--error,
  .pro-form__textarea.pro-form__input--error {
    border-color: #CC2222;
  }

  .pro-form__textarea {
    min-height: 120px;
    resize: vertical;
  }

  .pro-form__error {
    font-family: "Fira Code", monospace;
    font-size: 12px;
    color: #CC2222;
    margin-top: 4px;
  }

  .pro-form__submit {
    font-family: "Fira Code", monospace;
    color: #2C1A0E;
    border: 2px solid var(--gold);
    background: var(--gold);
    padding: 10px 24px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.04em;
    transition: all 200ms ease;
    margin-top: 8px;
  }

  .pro-form__submit:hover:not(:disabled) {
    background: var(--gold-light);
    border-color: var(--gold-light);
    color: #2C1A0E;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(200, 138, 0, 0.35);
  }

  .pro-form__submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .pro-form__banner {
    padding: 16px;
    border-radius: 8px;
    font-family: "Fira Code", monospace;
    font-size: 14px;
    text-align: center;
    margin-bottom: 16px;
  }

  .pro-form__banner--success {
    background: #1A3A0A;
    border: 1px solid var(--gold);
    color: #80D830;
  }

  .pro-form__banner--error {
    background: #3A0A0A;
    border: 1px solid #CC2222;
    color: #FF6666;
  }

  .pro-form__banner--error a {
    color: var(--gold);
    text-decoration: underline;
  }

  @media only screen and (max-width: 768px) {
    .pro-form { max-width: 100%; }
  }
`;

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Name is required';
      case 'email':
        if (!value.trim()) return 'Email is required';
        return validateEmail(value) ? '' : 'Invalid email format';
      case 'message':
        if (!value.trim()) return 'Message is required';
        return value.trim().length >= 10 ? '' : 'Message must be at least 10 characters';
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const focusFirstInvalidField = () => {
    const firstError = Object.keys(errors).find((key) => errors[key]);
    if (firstError) {
      document.querySelector(`.pro-form input[name="${firstError}"]`)?.focus();
      document.querySelector(`.pro-form textarea[name="${firstError}"]`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      name: validateField('name', form.name),
      email: validateField('email', form.email),
      message: validateField('message', form.message),
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err);
    if (hasErrors) {
      focusFirstInvalidField();
      return;
    }

    setStatus('sending');

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { from_name: form.name, reply_to: form.email, message: form.message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  };

  return (
    <form className="pro-form" onSubmit={handleSubmit} noValidate>
      <style>{STYLES}</style>

      {status === 'success' && (
        <div className="pro-form__banner pro-form__banner--success">
          ✓ Message sent successfully! I'll get back to you soon.
        </div>
      )}

      {status === 'error' && (
        <div className="pro-form__banner pro-form__banner--error">
          ✗ Failed to send message.{' '}
          <a href={`mailto:${about.email}`}>Email me directly</a> at {about.email}
        </div>
      )}

      <div className="pro-form__group">
        <label htmlFor="form-name" className="pro-form__label">
          Name
        </label>
        <input
          id="form-name"
          name="name"
          type="text"
          className={`pro-form__input ${errors.name ? 'pro-form__input--error' : ''}`}
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === 'sending'}
          autoComplete="name"
        />
        {errors.name && <span className="pro-form__error">{errors.name}</span>}
      </div>

      <div className="pro-form__group">
        <label htmlFor="form-email" className="pro-form__label">
          Email
        </label>
        <input
          id="form-email"
          name="email"
          type="email"
          className={`pro-form__input ${errors.email ? 'pro-form__input--error' : ''}`}
          placeholder="your@email.com"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === 'sending'}
          autoComplete="email"
        />
        {errors.email && <span className="pro-form__error">{errors.email}</span>}
      </div>

      <div className="pro-form__group">
        <label htmlFor="form-message" className="pro-form__label">
          Message
        </label>
        <textarea
          id="form-message"
          name="message"
          className={`pro-form__textarea ${errors.message ? 'pro-form__input--error' : ''}`}
          placeholder="Your message... (minimum 10 characters)"
          value={form.message}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={status === 'sending'}
        />
        {errors.message && <span className="pro-form__error">{errors.message}</span>}
      </div>

      <button
        type="submit"
        className="pro-form__submit"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}