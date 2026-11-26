// A small visible tag so it's obvious what still needs replacing.
export default function Placeholder({ children = 'PLACEHOLDER' }) {
  return <span className="ph-badge">{children}</span>
}
