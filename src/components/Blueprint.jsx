import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/*
  A faint architect-style line drawing of a house in the home page background.
  It draws itself in line by line, rests, then fades and redraws now and then.
*/

const line = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay: 0.3 + i * 0.07, duration: 1.2, ease: 'easeInOut' }, opacity: { delay: 0.3 + i * 0.07, duration: 0.2 } },
  }),
  exit: { opacity: 0, transition: { duration: 1.2 } },
}

let n = 0
const L = (d, cls) => ({ d, cls, i: n++ })
const rect = (x, y, w, h) => `M${x} ${y} h${w} v${h} h-${w} z`
const pane = (x, y, w, h) => `${rect(x, y, w, h)} M${x + w / 2} ${y} v${h} M${x} ${y + h / 2} h${w}`

// drawing order = the order the lines appear
const LINES = [
  L('M20 330 H580'), // ground
  L('M110 330 V170 M490 170 V330'), // walls
  L('M90 172 L180 96 H420 L510 172 Z'), // main roof
  L('M150 128 V58 H182 V102'), // chimney
  L('M230 172 L300 70 L370 172'), // center gable
  L('M252 160 L300 90 L348 160', 'fine'),
  L(pane(286, 116, 28, 34)), // gable window
  L(pane(136, 190, 32, 44)),
  L(pane(196, 190, 32, 44)),
  L(pane(284, 190, 32, 44)),
  L(pane(372, 190, 32, 44)),
  L(pane(432, 190, 32, 44)),
  L('M80 250 H520 L502 236 H98 Z'), // porch roof
  L('M262 236 L300 210 L338 236'), // porch gable
  L('M100 250 V318 M170 250 V318 M240 250 V318 M360 250 V318 M430 250 V318 M500 250 V318'), // columns
  L('M90 318 H510'), // porch floor
  L(pane(128, 264, 28, 38)),
  L(pane(196, 264, 28, 38)),
  L(rect(284, 262, 32, 56) + ' M300 262 V318'), // front door
  L(pane(376, 264, 28, 38)),
  L(pane(444, 264, 28, 38)),
  L('M100 300 H240 M360 300 H500', 'fine'), // railings
  L(
    Array.from({ length: 13 }, (_, k) => `M${110 + k * 10} 300 V318`).join(' ') +
      ' ' +
      Array.from({ length: 13 }, (_, k) => `M${370 + k * 10} 300 V318`).join(' '),
    'fine',
  ),
  L('M270 318 V324 H330 V318 M262 324 V330 H338 V324'), // steps
  // dimension lines, like on a real plan
  L('M110 32 H490 M110 26 V38 M490 26 V38', 'dim'),
  L('M58 170 V330 M52 170 H64 M52 330 H64', 'dim'),
  L('M540 96 V330 M534 96 H546 M534 330 H546', 'dim'),
]

export default function Blueprint() {
  const reduce = useReducedMotion()
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setCycle((c) => c + 1), 16000)
    return () => clearInterval(t)
  }, [reduce])

  return (
    <svg className="blueprint-svg" viewBox="0 0 600 360" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.g key={cycle} initial={reduce ? 'show' : 'hidden'} animate="show" exit="exit">
          {LINES.map((l) => (
            <motion.path key={l.i} d={l.d} className={l.cls} variants={line} custom={l.i} />
          ))}
          <motion.text x="300" y="22" className="dim-label" variants={line} custom={LINES.length}>
            40&apos;-0&quot;
          </motion.text>
          <motion.text x="24" y="254" className="dim-label" variants={line} custom={LINES.length + 1}>
            24&apos;
          </motion.text>
        </motion.g>
      </AnimatePresence>
    </svg>
  )
}
