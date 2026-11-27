import { FOOTER } from '../content.js'

// Equal Housing Opportunity mark: a house with an equals sign, drawn in the
// current text color so it reads in both themes.
function EqualHousing() {
  return (
    <svg className="equal-housing" viewBox="0 0 120 120" role="img" aria-label="Equal Housing Opportunity">
      <path d="M60 8 L8 46 H20 V86 H100 V46 H112 Z M32 52 L60 31 L88 52 V76 H32 Z" fillRule="evenodd" />
      <rect x="44" y="51" width="32" height="7" />
      <rect x="44" y="64" width="32" height="7" />
      <text x="60" y="102" textAnchor="middle">EQUAL HOUSING</text>
      <text x="60" y="115" textAnchor="middle">OPPORTUNITY</text>
    </svg>
  )
}

// The brokerage footer at the very bottom of the page.
export default function SiteFooter() {
  const sopReady = Boolean(FOOTER.sopUrl)
  return (
    <footer className="site-footer">
      <div className="footer-logos">
        <a className="footer-logo" href={FOOTER.brokerageUrl} target="_blank" rel="noreferrer" aria-label="Eastern Prime Realty website">
          <img src={FOOTER.companyLogo} alt="Eastern Prime Realty logo" loading="lazy" />
        </a>
        <EqualHousing />
      </div>
      <nav className="footer-links" aria-label="Brokerage links">
        <a
          href={sopReady ? FOOTER.sopUrl : '#'}
          target={sopReady ? '_blank' : undefined}
          rel="noreferrer"
          onClick={sopReady ? undefined : (e) => e.preventDefault()}
        >
          Standard Operating Procedure
        </a>
        <span className="footer-sep" aria-hidden="true">|</span>
        <a href={FOOTER.brokerageUrl} target="_blank" rel="noreferrer">
          Brokerage Website
        </a>
      </nav>
      <p className="footer-info">
        {FOOTER.info.map((item) =>
          typeof item === 'string' ? (
            <span key={item}>{item} </span>
          ) : (
            <span key={item.label}>
              {item.label}: <a href={`tel:+1${item.phone.replace(/[^\d]/g, '')}`}>{item.phone}</a>{' '}
            </span>
          ),
        )}
      </p>
      <p className="footer-copy">
        &copy; {new Date().getFullYear()} Hamim Niloy · realwithniloy.com
      </p>
    </footer>
  )
}
