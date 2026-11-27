import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/*
  A faint line drawing in the About Me background that keeps changing, in
  order, between a MIDI keyboard (music), a computer keyboard (coding) and a
  coffee cup. Each one sits in its own spot, draws itself in, rests, then fades
  into the next.
*/

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay: i * 0.04, duration: 1.4, ease: 'easeInOut' }, opacity: { delay: i * 0.04, duration: 0.3 } },
  }),
  exit: { opacity: 0, transition: { duration: 0.8 } },
}

function P(props) {
  return <motion.path variants={draw} {...props} />
}

function MidiKeyboard() {
  const white = Array.from({ length: 14 }, (_, i) => 22 + i * 11.2)
  const blackAt = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12]
  return (
    <>
      <P d="M14 52 h172 a8 8 0 0 1 8 8 v58 a8 8 0 0 1 -8 8 h-172 a8 8 0 0 1 -8 -8 v-58 a8 8 0 0 1 8 -8 z" custom={0} />
      <P d="M18 80 h164 v40 h-164 z" custom={1} />
      {white.slice(1).map((x, i) => (
        <P key={`w${i}`} d={`M${x + 7.2} 80 v40`} custom={2 + i * 0.3} />
      ))}
      {blackAt.map((k, i) => (
        <P key={`b${i}`} d={`M${18 + (k + 1) * 11.2 - 3.4} 80 v22 h6.8 v-22`} custom={4 + i * 0.3} />
      ))}
      {[30, 48, 66].map((x, i) => (
        <P key={`k${i}`} d={`M${x + 6} 66 a6 6 0 1 1 -12 0 a6 6 0 1 1 12 0`} custom={6 + i} />
      ))}
      {[120, 138, 156, 174].map((x, i) => (
        <P key={`p${i}`} d={`M${x - 6} 60 h12 v12 h-12 z`} custom={7 + i * 0.5} />
      ))}
    </>
  )
}

function ComputerKeyboard() {
  const rows = [
    { y: 60, n: 13, x0: 16, w: 12.4 },
    { y: 75, n: 12, x0: 22, w: 12.4 },
    { y: 90, n: 11, x0: 28, w: 12.4 },
  ]
  return (
    <>
      <P d="M12 48 h176 a8 8 0 0 1 8 8 v62 a8 8 0 0 1 -8 8 h-176 a8 8 0 0 1 -8 -8 v-62 a8 8 0 0 1 8 -8 z" custom={0} />
      {rows.map((r, ri) =>
        Array.from({ length: r.n }, (_, i) => (
          <P key={`${ri}-${i}`} d={`M${r.x0 + i * (r.w + 1.2)} ${r.y} h${r.w} v11 h-${r.w} z`} custom={1 + ri + i * 0.15} />
        )),
      )}
      <P d="M60 105 h80 v11 h-80 z" custom={5} />
      <P d="M28 105 h26 v11 h-26 z M146 105 h26 v11 h-26 z" custom={5.5} />
    </>
  )
}

function Coffee() {
  return (
    <>
      <P d="M64 62 h68 v34 a26 26 0 0 1 -26 26 h-16 a26 26 0 0 1 -26 -26 z" custom={0} />
      <P d="M132 72 h8 a13 13 0 0 1 0 26 h-10" custom={2} />
      <P d="M40 126 h116 a4 4 0 0 1 0 8 h-116 a4 4 0 0 1 0 -8 z" custom={3} />
      <P d="M84 52 c-8 -8 8 -14 0 -24 c-6 -8 4 -14 2 -20" custom={5} />
      <P d="M100 50 c-8 -8 8 -14 0 -24 c-6 -8 4 -14 2 -20" custom={6} />
      <P d="M116 52 c-8 -8 8 -14 0 -24 c-6 -8 4 -14 2 -20" custom={7} />
    </>
  )
}

const ITEMS = [MidiKeyboard, ComputerKeyboard, Coffee]

// Picks which drawing is showing and moves to the next one every few seconds.
export function useHobbyCycle() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce) return
    let timer
    const next = () => {
      timer = setTimeout(() => {
        // always in order: MIDI keyboard, computer keyboard, coffee, then repeat
        setIndex((cur) => (cur + 1) % ITEMS.length)
        next()
      }, 6000)
    }
    next()
    return () => clearTimeout(timer)
  }, [reduce])

  return index
}

// Where each drawing appears: the computer keyboard sits in the upper right of
// the section; the MIDI keyboard and the coffee cup share a spot beside the stats.
export const SPOTS = { corner: [1], stats: [0, 2] }

export default function HobbyMorph({ index, spot, className = '' }) {
  const reduce = useReducedMotion()
  const visible = SPOTS[spot].includes(index)
  const Item = ITEMS[index]
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={index}
          className={`hobby-morph hobby-${spot} hobby-item-${index} ${className}`}
          initial={reduce ? 'show' : 'hidden'}
          animate="show"
          exit="exit"
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 150">
            <Item />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
