import { ABOUT } from '../content.js'
import Reveal from './Reveal.jsx'
import Drift from './Drift.jsx'
import Vines from './Vines.jsx'
import HobbyMorph from './HobbyMorph.jsx'

export default function About() {
  return (
    <section id="about" className="section about">
      <HobbyMorph />
      <div className="about-photo-stage">
        {/* the vines and the photo drift by different amounts, so they feel like separate layers */}
        <Drift amount={-16} className="vines-layer">
          <Vines />
        </Drift>
        <Drift amount={-6}>
          <Reveal className="about-photo">
            <img src={ABOUT.photo} alt="Niloy smiling, black and white photo" loading="lazy" />
          </Reveal>
        </Drift>
      </div>
      <Drift amount={10} className="about-text">
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
      </Drift>
    </section>
  )
}
