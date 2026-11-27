// The HN logo in the top-left corner. It is drawn as a shape filled with the
// current text color, so it reads well in both the dark and light themes.
export default function Logo({ onClick }) {
  return (
    <button type="button" className="site-logo" onClick={onClick} aria-label="Back to the top">
      <span className="site-logo-mark" aria-hidden="true" />
    </button>
  )
}
