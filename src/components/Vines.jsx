import { motion, useReducedMotion } from 'motion/react'

/*
  Hand-drawn vines and leaves that grow out from behind the About Me photo
  when the section scrolls into view. Coordinates are in a 400 x 500 box that
  matches the photo; anything outside that box pokes out around the photo.
*/

const VINES = [
  // left side, curling up past the top-left corner
  { d: 'M40 190 C -6 172, -44 132, -40 82 C -37 40, -10 6, 28 -14', delay: 0.15 },
  { d: 'M-38 104 C -60 96, -74 78, -70 60', delay: 0.9, thin: true },
  // top edge, arching up and over the top-right corner
  { d: 'M300 30 C 316 -14, 356 -44, 396 -36 C 426 -30, 440 -6, 432 18', delay: 0.35 },
  { d: 'M398 -36 C 404 -56, 396 -70, 382 -72', delay: 1.1, thin: true },
  // bottom-left corner, trailing down and out
  { d: 'M60 460 C 18 486, -26 520, -66 506 C -98 494, -102 452, -74 432', delay: 0.5 },
  // right edge, lower down (kept close so it never reaches the text)
  { d: 'M380 360 C 412 372, 430 396, 424 428 C 418 458, 398 474, 414 500', delay: 0.7 },
  { d: 'M426 420 C 440 416, 446 404, 444 392', delay: 1.3, thin: true },
]

// x, y, angle (degrees), size, which vine it belongs to (for timing)
const LEAVES = [
  [-24, 150, 200, 1, 0],
  [-42, 96, 160, 0.9, 0],
  [-30, 46, 220, 1.05, 0],
  [2, 4, 300, 0.85, 0],
  [-70, 62, 120, 0.7, 1],
  [312, -2, 250, 0.9, 2],
  [350, -36, 300, 1, 2],
  [404, -34, 350, 0.85, 2],
  [432, 12, 80, 0.8, 2],
  [382, -72, 230, 0.6, 3],
  [10, 486, 150, 0.95, 4],
  [-44, 512, 200, 1, 4],
  [-92, 478, 250, 0.85, 4],
  [404, 368, 320, 0.9, 5],
  [426, 410, 20, 0.8, 5],
  [410, 464, 150, 0.9, 5],
  [444, 392, 290, 0.6, 6],
]

const LEAF = 'M0 0 C 10 -11, 24 -11, 34 0 C 24 11, 10 11, 0 0 Z'
const RIB = 'M2 0 L 28 0'

export default function Vines() {
  const reduce = useReducedMotion()
  const grow = (delay, duration) =>
    reduce
      ? { hidden: { pathLength: 1, opacity: 1 }, visible: { pathLength: 1, opacity: 1 } }
      : {
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1, transition: { delay, duration, ease: [0.45, 0, 0.2, 1] } },
        }

  return (
    <motion.svg
      className="vines"
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid meet"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      aria-hidden="true"
    >
      {VINES.map((v, i) => (
        <motion.path
          key={i}
          d={v.d}
          className={v.thin ? 'vine vine-thin' : 'vine'}
          variants={grow(v.delay, v.thin ? 0.8 : 1.6)}
        />
      ))}
      {LEAVES.map(([x, y, a, s, vine], i) => {
        const delay = VINES[vine].delay + 0.6 + (i % 4) * 0.18
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
            <motion.path
              d={LEAF}
              className="leaf"
              variants={
                reduce
                  ? { hidden: { pathLength: 1, opacity: 1 }, visible: { pathLength: 1, opacity: 1 } }
                  : {
                      hidden: { pathLength: 0, opacity: 0, fillOpacity: 0 },
                      visible: {
                        pathLength: 1,
                        opacity: 1,
                        fillOpacity: 1,
                        transition: { delay, duration: 0.7, fillOpacity: { delay: delay + 0.5, duration: 0.6 } },
                      },
                    }
              }
            />
            <motion.path d={RIB} className="leaf-rib" variants={grow(delay + 0.3, 0.4)} />
          </g>
        )
      })}
    </motion.svg>
  )
}
