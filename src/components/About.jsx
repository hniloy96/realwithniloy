import { useLayoutEffect, useRef, useState } from 'react'
import { ABOUT } from '../content.js'
import Reveal from './Reveal.jsx'
import Drift from './Drift.jsx'
import Vines from './Vines.jsx'
import HobbyMorph, { useHobbyCycle } from './HobbyMorph.jsx'

/*
  On desktop, size the photo so that the photo plus the details under it end
  exactly where the last paragraph ends (and start where the heading starts).
  Measured without transforms, so the drift and fade-in animations don't
  affect it. Re-measured whenever the layout changes size.
*/
function useFittedPhotoWidth(sectionRef) {
  const [width, setWidth] = useState(null)
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const desktop = window.matchMedia('(min-width: 861px)')
    const measure = () => {
      if (!desktop.matches) return setWidth(null)
      const text = section.querySelector('.about-text')
      const bodies = text.querySelectorAll('.body')
      const last = bodies[bodies.length - 1]
      const first = text.firstElementChild
      const creds = section.querySelector('.credentials')
      if (!last || !first || !creds) return
      const textHeight = last.offsetTop + last.offsetHeight - first.offsetTop
      const capHeight = creds.offsetHeight + parseFloat(getComputedStyle(creds).marginTop)
      const maxW = section.clientWidth * 0.4
      const w = Math.max(180, Math.min(maxW, (textHeight - capHeight) * 0.8)) // photo is 4:5
      setWidth(Math.round(w))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(section)
    document.fonts?.ready.then(measure)
    desktop.addEventListener('change', measure)
    return () => {
      ro.disconnect()
      desktop.removeEventListener('change', measure)
    }
  }, [sectionRef])
  return width
}

export default function About() {
  const hobby = useHobbyCycle()
  const sectionRef = useRef(null)
  const photoWidth = useFittedPhotoWidth(sectionRef)
  return (
    <section id="about" className="section about" ref={sectionRef}>
      <HobbyMorph index={hobby} spot="corner" />
      <div className={`about-left${photoWidth ? ' is-fitted' : ''}`} style={photoWidth ? { width: photoWidth } : undefined}>
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
        <Drift amount={-6}>
          <Reveal delay={0.15} className="credentials">
            <span className="cred-name">{ABOUT.credentials.name}</span>
            <span className="cred-title">{ABOUT.credentials.title}</span>
            <span className="muted small">{ABOUT.credentials.license}</span>
            <span className="cred-company">{ABOUT.credentials.company}</span>
            <span className="muted small">{ABOUT.credentials.address}</span>
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
          <HobbyMorph index={hobby} spot="stats" />
        </Reveal>
      </Drift>
    </section>
  )
}
