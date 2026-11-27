import { useEffect } from 'react'
import { motion, motionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'

// One shared mouse position for the whole page (-1 to 1 on each axis), so
// every drifting element listens to the same single event listener.
const mx = motionValue(0)
const my = motionValue(0)
let listening = false
function listen() {
  if (listening || typeof window === 'undefined') return
  listening = true
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return
    mx.set((e.clientX / window.innerWidth) * 2 - 1)
    my.set((e.clientY / window.innerHeight) * 2 - 1)
  })
}

/*
  Gently moves its content with the mouse, like the text on the home page.
  amount = how many pixels it can travel; a negative amount moves the
  opposite way, which makes layers feel like they sit at different depths.
*/
export default function Drift({ amount = 10, className, children, as = 'div' }) {
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!reduce) listen()
  }, [reduce])
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })
  const x = useTransform(sx, [-1, 1], [-amount, amount])
  const y = useTransform(sy, [-1, 1], [-amount * 0.6, amount * 0.6])
  const Tag = motion[as]
  return (
    <Tag className={className} style={reduce ? undefined : { x, y }}>
      {children}
    </Tag>
  )
}
