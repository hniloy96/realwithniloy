import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'

/*
  The looping dial menu.

  - `pos` is a single number: which item sits in the middle. It is NOT limited
    to 0..4, it keeps counting (…, -1, 0, 1, 2, …) so the dial loops forever.
    Item k shows label items[k mod 5].
  - Items sit along a curve:
      side   (desktop): stacked down the right side, top and bottom bend right
      bottom (phone)  : in a row along the bottom, the middle sits highest
  - Font size and spacing are computed from the real label widths, so the
    widest label always fits and no two items overlap.
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

const CENTER_SCALE = 1.18 // how much bigger the middle item is
const PAD_EM = 0.3 // button padding + letter spacing allowance, in em

// Width of the widest label, as a fraction of the font size (measured with
// the real font, so the layout adapts to whatever font is set in CSS).
function useLabelRatio(labels) {
  const [ratio, setRatio] = useState(6.5)
  useEffect(() => {
    let alive = true
    const family = getComputedStyle(document.documentElement).getPropertyValue('--hand').trim() || 'serif'
    const measure = () => {
      const ctx = document.createElement('canvas').getContext('2d')
      ctx.font = `400 100px ${family}`
      const widest = Math.max(...labels.map((l) => ctx.measureText(l).width + l.length * 1))
      if (alive) setRatio(widest / 100 + PAD_EM)
    }
    measure()
    document.fonts.load(`400 100px ${family.split(',')[0]}`).then(measure, measure)
    document.fonts.ready.then(measure)
    return () => {
      alive = false
    }
  }, [labels])
  return ratio
}

/*
  Works out font size, spacing and the curve so that:
  - the widest label always fits on screen (even when it is the big middle one)
  - items are spaced by at least one full label (+ a gap), so nothing overlaps
*/
function geometry(layout, w, h, ratio) {
  if (layout === 'bottom') {
    // Phone: items in a row along an arc that rises in the middle.
    const fs = clamp((w * 0.8) / (ratio * CENTER_SCALE), 18, 36)
    const widest = ratio * fs
    const stepPx = widest * (CENTER_SCALE / 2 + 0.5) + 28 // neighbors start after the middle item ends
    const Rc = Math.max(w * 1.6, 600)
    return { layout, fs, stepPx, Rc, cx: w / 2, baseY: h * 0.5, w, h }
  }
  // Desktop: items stacked down the right side along a curve whose top and
  // bottom bend toward the right edge (circle center is off-screen right).
  const inset = clamp(w * 0.08, 20, 40)
  const margin = 20
  const Rc = Math.max(h * 0.75, 420)
  const lineH = 1.25
  let fs = 60
  for (let i = 0; i < 3; i++) {
    const stepPx = fs * lineH * CENTER_SCALE + 18
    const y2 = Math.min(stepPx * 2, Rc - 1)
    const shift2 = Rc - Math.sqrt(Rc * Rc - y2 * y2) // how far right the ±2 items move
    const fitCenter = (w - inset - margin) / (ratio * CENTER_SCALE)
    const fitEdge = (w - inset - margin - shift2) / ratio
    const fitHeight = (h * 0.86) / (5 * lineH * CENTER_SCALE + 90 / fs) // 5 items visible
    fs = clamp(Math.min(60, fitCenter, fitEdge, fitHeight), 20, 60)
  }
  const stepPx = fs * lineH * CENTER_SCALE + 18
  return { layout, fs, stepPx, Rc, inset, cy: h / 2, w, h }
}

function placeItem(geo, o) {
  // o = how many steps this item is away from the middle (can be fractional)
  if (geo.layout === 'bottom') {
    const dx = o * geo.stepPx
    const ax = clamp(dx, -geo.Rc + 1, geo.Rc - 1)
    const y = geo.baseY + (geo.Rc - Math.sqrt(geo.Rc * geo.Rc - ax * ax))
    const tilt = (Math.asin(ax / geo.Rc) * 180) / Math.PI
    return { x: geo.cx + dx, y, rotate: tilt }
  }
  const dy = o * geo.stepPx
  const ay = clamp(dy, -geo.Rc + 1, geo.Rc - 1)
  const x = geo.inset + (geo.Rc - Math.sqrt(geo.Rc * geo.Rc - ay * ay))
  const tilt = (Math.asin(ay / geo.Rc) * 180) / Math.PI
  return { x, y: geo.cy + dy, rotate: tilt * 0.35 }
}

function DialItem({ index, label, pos, geo, isCenter, onPick }) {
  const offset = useTransform(pos, (p) => index - p)
  const x = useTransform(offset, (o) => placeItem(geo, o).x)
  const y = useTransform(offset, (o) => placeItem(geo, o).y)
  const rotate = useTransform(offset, (o) => placeItem(geo, o).rotate)
  const scale = useTransform(offset, (o) => 1 + (CENTER_SCALE - 1) * Math.max(0, 1 - Math.abs(o)))
  const fade = geo.layout === 'bottom' ? 1.6 : 2.7
  const opacity = useTransform(offset, (o) => clamp(1 - Math.abs(o) / fade, 0, 1) ** 1.2)

  const side = geo.layout === 'side'
  return (
    <motion.div className="dial-spoke" style={{ left: 0, top: 0, x, y, rotate }}>
      <motion.button
        type="button"
        className={`dial-item${isCenter ? ' is-center' : ''}`}
        style={{
          left: 0,
          top: 0,
          fontSize: geo.fs,
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
  const ratio = useLabelRatio(items)
  const geo = geometry(layout, w, h, ratio)

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
    if (d.moving) pos.set(d.start - delta / geo.stepPx)
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
