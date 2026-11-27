import { useState } from 'react'
import { CONTACT } from '../content.js'
import Reveal from './Reveal.jsx'
import Drift from './Drift.jsx'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error | offline
  const [errorText, setErrorText] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!CONTACT.formspreeEndpoint) {
      setStatus('offline')
      return
    }
    setStatus('sending')
    setErrorText('')
    try {
      const res = await fetch(CONTACT.formspreeEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
      if (!res.ok) {
        // Formspree explains what went wrong (for example an invalid email)
        const data = await res.json().catch(() => ({}))
        setErrorText(data.errors?.map((er) => er.message).join(' ') || '')
        throw new Error('Request failed')
      }
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section contact">
      <Drift amount={10} className="section-body">
      <Reveal>
        <p className="hand eyebrow">contact</p>
        <h2 className="title">{CONTACT.title}</h2>
        <p className="body">{CONTACT.intro}</p>
      </Reveal>
      <Reveal delay={0.1} className="contact-wrap">
        <form className="contact-form" onSubmit={onSubmit}>
          <label>
            <span>Your name</span>
            <input name="name" required autoComplete="name" placeholder="Your full name" />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            <span>Phone</span>
            <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" />
          </label>
          <label>
            <span>I&rsquo;m thinking about&hellip;</span>
            <select name="interest" defaultValue="Buying">
              <option>Buying</option>
              <option>Selling</option>
              <option>Both</option>
              <option>Just exploring</option>
            </select>
          </label>
          <label className="full">
            <span>Tell me what you&rsquo;re looking for</span>
            <textarea
              name="message"
              rows={4}
              required
              placeholder="A first home, selling, a move across town, an investment property…"
            />
            {/* subject line for the email you receive */}
            <input type="hidden" name="_subject" value="New message from realwithniloy.com" />
          </label>
          <button type="submit" className="cta" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden="true">&rarr;</span>
          </button>
          <p className={`form-status${status === 'sent' ? ' is-sent' : ''}`} role="status">
            {status === 'sent' && (
              <>
                <strong>Message sent!</strong> Thank you, I&rsquo;ll get back to you soon.
              </>
            )}
            {status === 'error' && (errorText || 'Something went wrong. Please try again, or email or call me directly.')}
            {status === 'offline' &&
              'The form isn’t connected yet. Please email or call me directly for now.'}
          </p>
        </form>
        <aside className="contact-direct">
          <p className="hand">or reach me directly</p>
          <div className="contact-group">
            <span className="muted small">Email</span>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </div>
          <div className="contact-group">
            <span className="muted small">Cell</span>
            <a href={`tel:+1${CONTACT.phone.replace(/[^\d]/g, '')}`}>{CONTACT.phone}</a>
          </div>
          <div className="contact-group">
            <span className="muted small">Office</span>
            <span className="office-company">{CONTACT.company}</span>
            <a
              className="contact-address"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address.join(', '))}`}
              target="_blank"
              rel="noreferrer"
            >
              {CONTACT.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </a>
          </div>
        </aside>
      </Reveal>
      </Drift>
    </section>
  )
}
