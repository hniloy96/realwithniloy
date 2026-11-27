import { FAIR_HOUSING, FOOTER } from '../content.js'
import Logo from './Logo.jsx'
import ThemeToggle from './ThemeToggle.jsx'

/*
  The bar pinned to the top of every page.
  Left: HN logo.
  Right (in order): theme button, Fair Housing Notice, Eastern Prime Realty.
*/
export default function TopBar({ onHome }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <Logo onClick={onHome} />
      </div>
      <div className="topbar-right">
        <ThemeToggle />
        <a className="fair-housing" href={FAIR_HOUSING.url} target="_blank" rel="noreferrer">
          {FAIR_HOUSING.label}
        </a>
        <a className="topbar-brokerage" href={FOOTER.brokerageUrl} target="_blank" rel="noreferrer">
          <span className="topbar-brokerage-name">Eastern Prime Realty</span>
          <img src="/images/ep_mark.png" alt="Eastern Prime Realty logo" />
        </a>
      </div>
    </header>
  )
}
