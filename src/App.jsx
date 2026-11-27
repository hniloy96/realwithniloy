import { useCallback, useEffect, useRef, useState } from 'react'
import { SECTIONS } from './content.js'
import Dial from './components/Dial.jsx'
import Spotlight from './components/Spotlight.jsx'
import Home from './components/Home.jsx'
import Reviews from './components/Reviews.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Socials from './components/Socials.jsx'
import TopBar from './components/TopBar.jsx'
import SiteFooter from './components/SiteFooter.jsx'

const LABELS = SECTIONS.map((s) => s.label)

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export default function App() {
  const isPhone = useMediaQuery('(max-width: 860px)')
  const [active, setActive] = useState(0)
  // While the page is gliding to a section after a dial click, ignore the
  // in-between sections so the dial doesn't flicker through them.
  const lockRef = useRef(false)
  const unlockTimer = useRef(null)

  // Page scroll -> which section is in the middle of the screen
  const measure = useCallback(() => {
    const line = window.innerHeight * 0.45
    let found = 0
    SECTIONS.forEach((s, i) => {
      const el = document.getElementById(s.id)
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.top <= line) found = i
    })
    // At the very bottom of the page, the last section counts as active
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      found = SECTIONS.length - 1
    }
    return found
  }, [])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (lockRef.current) {
        // keep the lock until scrolling has been quiet for a moment
        clearTimeout(unlockTimer.current)
        unlockTimer.current = setTimeout(() => {
          lockRef.current = false
          setActive(measure())
        }, 160)
        return
      }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setActive(measure()))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    setActive(measure())
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [measure])

  // Dial click -> scroll the page to that section
  const goToSection = useCallback((i) => {
    const el = document.getElementById(SECTIONS[i].id)
    if (!el) return
    setActive(i)
    lockRef.current = true
    clearTimeout(unlockTimer.current)
    // safety net in case the page was already there and no scroll happens
    unlockTimer.current = setTimeout(() => {
      lockRef.current = false
    }, 1200)
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Spotlight />
      <div className="grain" aria-hidden="true" />
      <TopBar onHome={() => goToSection(0)} />
      <main className={isPhone ? 'layout-phone' : 'layout-desktop'}>
        <Home onContact={() => goToSection(3)} />
        <Reviews />
        <About />
        <Contact />
        <Socials />
        <SiteFooter />
      </main>
      <Dial
        items={LABELS}
        active={active}
        onSelect={goToSection}
        layout={isPhone ? 'bottom' : 'side'}
      />
    </>
  )
}
