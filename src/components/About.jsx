import { ABOUT } from '../content.js'
import Reveal from './Reveal.jsx'
import Placeholder from './Placeholder.jsx'

export default function About() {
  return (
    <section id="about" className="section about">
      <Reveal className="about-photo">
        <img src={ABOUT.photo} alt="Niloy (placeholder photo)" />
        <Placeholder>PLACEHOLDER PHOTO</Placeholder>
      </Reveal>
      <div className="about-text">
        <Reveal>
          <p className="hand eyebrow">about me</p>
          <h2 className="title">{ABOUT.title}</h2>
        </Reveal>
        {ABOUT.paragraphs.map((p, i) => (
          <Reveal key={i} delay={0.08 * i} as="p" className="body">
            {p}
          </Reveal>
        ))}
        <Reveal delay={0.2} className="facts">
          {ABOUT.facts.map((f) => (
            <div key={f.label} className="fact">
              <span className="hand fact-value">{f.value}</span>
              <span className="muted">{f.label}</span>
            </div>
          ))}
        </Reveal>
        <p className="muted small">Story and numbers above are placeholders.</p>
      </div>
    </section>
  )
}
