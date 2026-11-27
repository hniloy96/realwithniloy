import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
import { HOME } from '../content.js'
import Drift from './Drift.jsx'
import Blueprint from './Blueprint.jsx'

export default function Home({ onContact }) {
  const reduce = useReducedMotion()
  // mouse position from -1 to 1 across the screen
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })

  const rotateY = useTransform(sx, [-1, 1], [-9, 9])
  const rotateX = useTransform(sy, [-1, 1], [7, -7])
  const photoX = useTransform(sx, [-1, 1], [-14, 14])
  const photoY = useTransform(sy, [-1, 1], [-10, 10])
  const textX = useTransform(sx, [-1, 1], [10, -10])
  const textY = useTransform(sy, [-1, 1], [6, -6])
  const glowX = useTransform(sx, [-1, 1], ['20%', '80%'])
  const glowY = useTransform(sy, [-1, 1], ['15%', '85%'])
  // the dot grids drift the opposite way to the photo, which gives depth
  const dotsX = useTransform(sx, [-1, 1], [16, -16])
  const dotsY = useTransform(sy, [-1, 1], [12, -12])
  const frameX = useTransform(sx, [-1, 1], [-6, 6])
  const frameY = useTransform(sy, [-1, 1], [-5, 5])

  useEffect(() => {
    if (reduce) return
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1)
      my.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my, reduce])

  return (
    <section id="home" className="section home">
      <Drift amount={-14} className="blueprint">
        <Blueprint />
      </Drift>
      <motion.div className="home-text" style={{ x: textX, y: textY }}>
        <motion.p
          className="hand hello"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {HOME.hello}
        </motion.p>
        <h1 className="headline">
          {HOME.headline.map((line, i) => (
            <motion.span
              key={i}
              className="headline-line"
              initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.35 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              {line}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="lede"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1 }}
        >
          {HOME.message}
        </motion.p>
        <motion.button
          type="button"
          className="cta"
          onClick={onContact}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          whileHover={{ x: 4 }}
        >
          {HOME.cta} <span aria-hidden="true">&rarr;</span>
        </motion.button>
      </motion.div>

      <div className="portrait-stage">
        <motion.div
          className="dots dots-back"
          style={{ x: dotsX, y: dotsY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.5 }}
          aria-hidden="true"
        />
        <motion.div
          className="dots dots-corner"
          style={{ x: dotsX, y: dotsY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.8 }}
          aria-hidden="true"
        />
        <motion.div
          className="portrait-frame"
          style={{ x: frameX, y: frameY }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          aria-hidden="true"
        />
        <motion.div
          className="portrait-wrap"
          style={{ rotateX, rotateY, x: photoX, y: photoY }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img className="portrait" src={HOME.portrait} alt="Niloy smiling, black and white portrait" />
          <motion.div className="portrait-glow" style={{ left: glowX, top: glowY }} />
          <span className="corner corner-tl" aria-hidden="true" />
          <span className="corner corner-br" aria-hidden="true" />
        </motion.div>
        <motion.p
          className="portrait-note"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          aria-hidden="true"
        >
          {HOME.portraitNote}
          <svg viewBox="0 0 60 40" className="note-arrow">
            <path d="M4 34 C 18 32, 34 24, 50 8" />
            <path d="M38 8 L 51 7 L 49 20" />
          </svg>
        </motion.p>
      </div>
    </section>
  )
}
