import { REVIEWS } from '../content.js'
import Reveal from './Reveal.jsx'
import Drift from './Drift.jsx'

export default function Reviews() {
  return (
    <section id="reviews" className="section reviews">
      <Drift amount={10}>
        <Reveal>
          <p className="hand eyebrow">kind words</p>
          <h2 className="title">What it felt like, in their words.</h2>
        </Reveal>
      </Drift>
      <Drift amount={-5} className="review-grid">
        {REVIEWS.map((r, i) => (
          <Reveal key={i} delay={i * 0.12} className="review-card" as="figure">
            <span className="quote-mark" aria-hidden="true">&ldquo;</span>
            <blockquote>{r.quote}</blockquote>
            <figcaption>
              <span className="hand reviewer">{r.name}</span>
              <span className="muted">{r.detail}</span>
            </figcaption>
          </Reveal>
        ))}
      </Drift>
    </section>
  )
}
