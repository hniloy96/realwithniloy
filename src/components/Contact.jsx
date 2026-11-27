import { useState } from 'react'
import { CONTACT } from '../content.js'
import Reveal from './Reveal.jsx'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error | offline

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!CONTACT.formspreeEndpoint) {
      setStatus('offline')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(CONTACT.formspreeEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section contact">
      <Reveal>
        <p className="hand eyebrow">contact</p>
        <h2 className="title">{CONTACT.title}</h2>
        <p className="body">{CONTACT.intro}</p>
      </Reveal>
      <Reveal delay={0.1} className="contact-wrap">
        <form className="contact-form" onSubmit={onSubmit}>
          <label>
            <span>Your name</span>
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label className="full">
            <span>I&rsquo;m thinking about&hellip;</span>
            <select name="interest" defaultValue="Buying">
              <option>Buying</option>
              <option>Selling</option>
              <option>Both</option>
              <option>Just exploring</option>
            </select>
          </label>
          <label className="full">
            <span>Tell me a little about where you are</span>
            <textarea name="message" rows={4} required />
          </label>
          <button type="submit" className="cta" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden="true">&rarr;</span>
          </button>
          <p className="form-status" role="status">
            {status === 'sent' && 'Thank you. I’ll get back to you soon.'}
            {status === 'error' && 'Something went wrong. Please try again, or email me directly.'}
            {status === 'offline' &&
              'This form isn’t connected yet (placeholder). Add a Formspree endpoint in src/content.js to make it send.'}
          </p>
        </form>
        <aside className="contact-direct">
          <p className="hand">or reach me directly</p>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={`tel:+1${CONTACT.phone.replace(/[^\d]/g, '')}`}>{CONTACT.phone}</a>
          <a
            className="contact-address"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address.join(', '))}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="muted small">Office</span>
            {CONTACT.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </a>
        </aside>
      </Reveal>
    </section>
  )
}
