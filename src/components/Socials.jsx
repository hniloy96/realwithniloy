import { SOCIALS } from '../content.js'
import Reveal from './Reveal.jsx'
import Drift from './Drift.jsx'

export default function Socials() {
  return (
    <section id="socials" className="section socials">
      <Drift amount={10} className="section-body">
      <Reveal>
        <p className="hand eyebrow">socials</p>
        <h2 className="title">Come say hi. I share the real side of the work.</h2>
      </Reveal>
      <ul className="social-list">
        {SOCIALS.map((s, i) => (
          <Reveal key={s.name} as="li" delay={i * 0.07}>
            <a href={s.url} className="social-link" target="_blank" rel="noreferrer">
              <span className="hand social-name">{s.name}</span>
              <span className="muted">{s.handle}</span>
              <span className="arrow" aria-hidden="true">↗</span>
            </a>
          </Reveal>
        ))}
      </ul>
      <footer className="footer">
        <span>&copy; {new Date().getFullYear()} Niloy</span>
        <span>realwithniloy.com</span>
      </footer>
      </Drift>
    </section>
  )
}
