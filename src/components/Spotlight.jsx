import { useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'

// A soft warm light that follows the mouse across the whole page.
export default function Spotlight() {
  const x = useMotionValue(-1000)
  const y = useMotionValue(-1000)
  const sx = useSpring(x, { stiffness: 90, damping: 20 })
  const sy = useSpring(y, { stiffness: 90, damping: 20 })
  const background = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgb(var(--glow-rgb) / 0.075), transparent 70%)`

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [x, y])

  return <motion.div className="spotlight" style={{ background }} aria-hidden="true" />
}
