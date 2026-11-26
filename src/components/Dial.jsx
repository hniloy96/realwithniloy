import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'

/*
  The looping dial menu.

  - `pos` is a single number: which item sits in the middle. It is NOT limited
    to 0..4, it keeps counting (…, -1, 0, 1, 2, …) so the dial loops forever.
    Item k shows label items[k mod 5].
  - Every item is a "spoke" rotated around a circle center:
      side   (desktop): center sits off-screen to the RIGHT, so the ends bend right
      bottom (phone)  : center sits BELOW the screen, so the arc bulges upward
  - Mouse wheel over the dial moves exactly one item per notch and never
    scrolls the page. Dragging / swiping also spins it.
*/

const SPRING = { type: 'spring', stiffness: 180, damping: 26, mass: 0.9 }
const WHEEL_COOLDOWN_MS = 220 // minimum time between two separate wheel notches
const GESTURE_GAP_MS = 140 // events closer than this belong to one swipe
const GESTURE_REPEAT_MS = 520 // a long continuous swipe steps at most this often
const WHEEL_THRESHOLD = 30 // how much wheel movement counts as one notch
const VISIBLE = 4 // how many items to render on each side of the center

const mod = (n, m) => ((n % m) + m) % m
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

function useSize(ref) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

function geometry(layout, w, h) {
  if (layout === 'bottom') {
    const R = Math.max(w * 1.15, 440)
    const stepPx = clamp(w * 0.64, 180, 300)
    return {
      R,
      cx: w / 2,
      cy: h * 0.5 + R,
      step: (stepPx / R) * (180 / Math.PI),
      pxPerItem: stepPx,
    }
  }
  // Circle center sits off to the RIGHT of the screen, so the top and bottom
  // items bend toward the right edge and the middle item sits furthest left.
  const R = clamp(h * 0.55, 280, 600)
  const stepPx = clamp(h * 0.135, 84, 128)
  return {
    R,
    cx: clamp(w * 0.1, 24, 48) + R,
    cy: h / 2,
    step: (stepPx / R) * (180 / Math.PI),
    pxPerItem: stepPx,
  }
}

function DialItem({ index, label, pos, geo, layout, isCenter, onPick }) {
  const theta = useTransform(pos, (p) => (index - p) * geo.step)
  const closeness = useTransform(theta, (t) => Math.max(0, 1 - Math.abs(t) / geo.step))
  const opacity = useTransform(theta, (t) => clamp(1 - Math.abs(t) / (geo.step * 3.3), 0, 1) ** 1.3)
  const scale = useTransform(closeness, (c) => 1 + 0.28 * c)
  const negTheta = useTransform(theta, (t) => -t)

  const side = layout === 'side'
  // side layout: positive angle = below the middle, so rotate the other way
  return (
    <motion.div className="dial-spoke" style={{ left: geo.cx, top: geo.cy, rotate: side ? negTheta : theta }}>
      <motion.button
        type="button"
        className={`dial-item${isCenter ? ' is-center' : ''}`}
        style={{
          left: side ? -geo.R : 0,
          top: side ? 0 : -geo.R,
          x: side ? 0 : '-50%',
          y: '-50%',
          originX: side ? 0 : 0.5,
          originY: 0.5,
          scale,
          opacity,
        }}
        tabIndex={isCenter ? 0 : -1}
        aria-current={isCenter ? 'true' : undefined}
        onClick={() => onPick(index)}
      >
        <span className="dial-label">{label}</span>
      </motion.button>
    </motion.div>
  )
}

export default function Dial({ items, active, onSelect, layout }) {
  const N = items.length
  const panelRef = useRef(null)
  const { w, h } = useSize(panelRef)
  const geo = geometry(layout, w, h)

  const pos = useMotionValue(active)
  const target = useRef(active)
  const [center, setCenter] = useState(active)

  useEffect(() => pos.on('change', (v) => setCenter(Math.round(v))), [pos])

  const goTo = useCallback(
    (t) => {
      target.current = t
      animate(pos, t, SPRING)
    },
    [pos],
  )

  // Page scroll changed the active section -> spin the dial the short way round
  useEffect(() => {
    const cur = target.current
    if (mod(cur, N) === active) return
    let delta = mod(active - cur, N)
    if (delta > N / 2) delta -= N
    goTo(cur + delta)
  }, [active, N, goTo])

  // Mouse wheel / trackpad over the dial: one item per notch, page never moves
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    let acc = 0
    let last = 0 // time of the last step
    let lastEvent = 0 // time of the last wheel event
    const onWheel = (e) => {
      e.preventDefault()
      e.stopPropagation()
      const raw = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      const d = e.deltaMode === 1 ? raw * 33 : e.deltaMode === 2 ? raw * 400 : raw
      const now = performance.now()
      const sameGesture = now - lastEvent < GESTURE_GAP_MS
      lastEvent = now
      // A trackpad flick fires a long stream of tiny events. Treat that stream
      // as one gesture and only step again after a calm pause, so one swipe
      // never jumps over an item.
      const wait = sameGesture ? GESTURE_REPEAT_MS : WHEEL_COOLDOWN_MS
      if (now - last < wait) {
        acc = 0
        return
      }
      acc += d
      if (Math.abs(acc) >= WHEEL_THRESHOLD) {
        goTo(Math.round(target.current) + Math.sign(acc))
        acc = 0
        last = now
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [goTo])

  // Drag / swipe to spin
  const drag = useRef(null)
  const justDragged = useRef(false)
  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    drag.current = { x: e.clientX, y: e.clientY, start: pos.get(), moving: false, id: e.pointerId }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const delta = layout === 'bottom' ? e.clientX - d.x : e.clientY - d.y
    if (!d.moving && Math.abs(delta) > 6) {
      d.moving = true
      pos.stop()
      panelRef.current?.setPointerCapture(d.id)
    }
    if (d.moving) pos.set(d.start - delta / geo.pxPerItem)
  }
  const onPointerUp = () => {
    const d = drag.current
    drag.current = null
    if (d?.moving) {
      justDragged.current = true
      setTimeout(() => (justDragged.current = false), 50)
      goTo(Math.round(pos.get()))
    }
  }

  const pick = (index) => {
    if (justDragged.current) return
    goTo(index)
    onSelect(mod(index, N))
  }

  const onKeyDown = (e) => {
    const prev = layout === 'bottom' ? 'ArrowLeft' : 'ArrowUp'
    const next = layout === 'bottom' ? 'ArrowRight' : 'ArrowDown'
    if (e.key === prev || e.key === next) {
      e.preventDefault()
      goTo(Math.round(target.current) + (e.key === next ? 1 : -1))
    }
  }

  const indices = []
  for (let k = center - VISIBLE; k <= center + VISIBLE; k++) indices.push(k)

  return (
    <nav
      ref={panelRef}
      className={`dial dial--${layout}`}
      aria-label="Site sections"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      {w > 0 &&
        indices.map((k) => (
          <DialItem
            key={k}
            index={k}
            label={items[mod(k, N)]}
            pos={pos}
            geo={geo}
            layout={layout}
            isCenter={k === center}
            onPick={pick}
          />
        ))}
      <span className="dial-hint" aria-hidden="true">
        {layout === 'bottom' ? 'swipe' : 'scroll here to spin'}
      </span>
    </nav>
  )
}
