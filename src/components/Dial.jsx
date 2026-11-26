import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'

/*
  The looping dial menu.

  - `pos` is a single number: which item sits in the middle. It is NOT limited
    to 0..4, it keeps counting (…, -1, 0, 1, 2, …) so the dial loops forever.
    Item k shows label items[k mod 5].
  - Items sit along a curve:
      side   (desktop): around a circle whose center is off to the right
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

// Size by position: middle = 100%, next out = 75%, the ones after = 50%,
// changing smoothly in between while the dial turns.
const SIZE_STEP = 0.25
const MIN_SIZE = 0.3
const sizeAt = (o) => Math.max(MIN_SIZE, 1 - SIZE_STEP * Math.abs(o))
const UMAX = (1 - MIN_SIZE) / SIZE_STEP // offset where items stop shrinking

// Distance along the curve from the middle to an item at offset o, when each
// item needs room proportional to its own size (+ a fixed gap). Neighbours
// are always exactly far enough apart to never touch.
function distAt(o, unit, gap) {
  const u = Math.abs(o)
  const k = Math.min(u, UMAX)
  const shrinking = unit * (k - (SIZE_STEP / 2) * k * k) + gap * k
  const rest = (unit * MIN_SIZE + gap) * Math.max(0, u - UMAX)
  return Math.sign(o) * (shrinking + rest)
}
const PAD_EM = 0.3 // button padding + letter spacing allowance, in em

// Width of each label as a multiple of the font size (measured with the real
// font, so the layout adapts to whatever font is set in CSS).
function useLabelWidths(labels) {
  const [m, setM] = useState(() => ({ ratio: 6.5, widths: labels.map(() => 6.5) }))
  useEffect(() => {
    let alive = true
    const family = getComputedStyle(document.documentElement).getPropertyValue('--hand').trim() || 'serif'
    const measure = () => {
      const ctx = document.createElement('canvas').getContext('2d')
      ctx.font = `400 100px ${family}`
      const widths = labels.map((l) => (ctx.measureText(l).width + l.length) / 100 + PAD_EM)
      if (alive) setM({ ratio: Math.max(...widths), widths })
    }
    measure()
    document.fonts.load(`400 100px ${family.split(',')[0]}`).then(measure, measure)
    document.fonts.ready.then(measure)
    return () => {
      alive = false
    }
  }, [labels])
  return m
}

/*
  Works out font size, spacing and the curve so that:
  - the widest label always fits on screen when it is the big middle one
  - each item gets room in proportion to its size, so nothing overlaps
*/
function geometry(layout, w, h, { ratio, widths }) {
  if (layout === 'bottom') {
    // Phone: items in a row along an arc that rises in the middle. Items are
    // packed by their real widths (a small fixed gap between neighbours), and
    // the font size is chosen so the middle item plus both neighbours always
    // fit across the screen, whichever item is in the middle.
    const gap = 12
    const n = widths.length
    let need = 0 // widest "half middle + one neighbour at 75%", in font sizes
    for (let c = 0; c < n; c++) {
      const side = Math.max(widths[mod(c - 1, n)], widths[mod(c + 1, n)])
      need = Math.max(need, widths[c] / 2 + sizeAt(1) * side)
    }
    const fs = clamp((w * 0.47 - gap) / need, 12, 30)
    const Rc = Math.max(w * 1.8, 600)
    return { layout, fs, widths, gap, Rc, cx: w / 2, baseY: h * 0.55, w, h }
  }
  // Desktop: items sit around the left half of a circle whose center is off
  // to the right, like numbers on a clock face. Each label's right end sits on
  // the circle and the text points away from the center, so labels fan apart
  // instead of colliding, and the top and bottom bend clearly to the right.
  const inset = clamp(w * 0.06, 16, 36)
  const margin = 22
  const Rc = clamp(h * 0.36, 210, 380)
  const lineH = 1.2
  const gap = 10
  let fs = 72
  for (let i = 0; i < 5; i++) {
    const unit = fs * lineH
    const phi2 = Math.min(distAt(2, unit, gap) / Rc, Math.PI / 2)
    const shift2 = Rc * (1 - Math.cos(phi2)) // how far right the ±2 items move
    const fitWidth = (w - inset - margin - shift2) / ratio
    const fitHeight = h * 0.11 // keeps the five visible items comfortably on screen
    fs = clamp(Math.min(72, fitWidth, fitHeight), 18, 72)
  }
  const anchorX = inset + ratio * fs // right end of the middle label
  return { layout, fs, unit: fs * lineH, gap, Rc, cx: anchorX + Rc, cy: h / 2, w, h }
}

// Phone: horizontal position of item k when item c is exactly in the middle,
// packing labels edge to edge (by their real, scaled widths) plus a gap.
function rowX(geo, k, c) {
  const n = geo.widths.length
  const half = (j) => (geo.widths[mod(j, n)] * geo.fs * sizeAt(j - c)) / 2
  let x = 0
  if (k > c) for (let j = c; j < k; j++) x += half(j) + half(j + 1) + geo.gap
  else for (let j = c; j > k; j--) x -= half(j) + half(j - 1) + geo.gap
  return x
}

function placeItem(geo, o, index) {
  // o = how many steps this item is away from the middle (can be fractional)
  if (geo.layout === 'bottom') {
    // blend between the two neighbouring "resting" layouts while turning
    const p = index - o
    const c0 = Math.floor(p)
    const f = p - c0
    const d = rowX(geo, index, c0) * (1 - f) + rowX(geo, index, c0 + 1) * f
    const ax = clamp(d, -geo.Rc + 1, geo.Rc - 1)
    const y = geo.baseY + (geo.Rc - Math.sqrt(geo.Rc * geo.Rc - ax * ax))
    const tilt = (Math.asin(ax / geo.Rc) * 180) / Math.PI
    return { x: geo.cx + d, y, rotate: tilt * 0.6 }
  }
  const d = distAt(o, geo.unit, geo.gap)
  const phi = clamp(d / geo.Rc, -Math.PI * 0.9, Math.PI * 0.9)
  return {
    x: geo.cx - geo.Rc * Math.cos(phi),
    y: geo.cy + geo.Rc * Math.sin(phi),
    rotate: (-phi * 180) / Math.PI,
  }
}

function DialItem({ index, label, pos, geo, isCenter, onPick }) {
  const offset = useTransform(pos, (p) => index - p)
  const x = useTransform(offset, (o) => placeItem(geo, o, index).x)
  const y = useTransform(offset, (o) => placeItem(geo, o, index).y)
  const rotate = useTransform(offset, (o) => placeItem(geo, o, index).rotate)
  const scale = useTransform(offset, sizeAt)
  // Blur follows the size: sharp in the middle, softer further out
  const blurMax = Math.max(geo.fs * 0.1, 3)
  const filter = useTransform(offset, (o) => `blur(${((1 - sizeAt(o)) * blurMax).toFixed(2)}px)`)
  const fade = geo.layout === 'bottom' ? 2.4 : 2.7
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
          x: side ? '-100%' : '-50%',
          y: '-50%',
          originX: side ? 1 : 0.5,
          originY: 0.5,
          scale,
          opacity,
          filter,
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
  const labelSizes = useLabelWidths(items)
  const geo = geometry(layout, w, h, labelSizes)

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
    if (d.moving) pos.set(d.start - delta / (layout === 'bottom' ? geo.fs * 4.5 + geo.gap : geo.unit * 0.875 + geo.gap))
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
