import { FOOTER } from '../content.js'

// The brokerage footer at the very bottom of the page.
export default function SiteFooter() {
  const sopReady = Boolean(FOOTER.sopUrl)
  return (
    <footer className="site-footer">
      <a className="footer-logo" href={FOOTER.brokerageUrl} target="_blank" rel="noreferrer" aria-label="Eastern Prime Realty website">
        <img src={FOOTER.companyLogo} alt="Eastern Prime Realty logo" loading="lazy" />
      </a>
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
