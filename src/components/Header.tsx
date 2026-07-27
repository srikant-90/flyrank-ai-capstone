import './Header.css';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#settings', label: 'Settings' },
  { href: '#workflow', label: 'Workflow' },
] as const;

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#" className="site-header__logo" aria-label="FlyRank AI Capstone home">
          <span className="site-header__logo-mark" aria-hidden="true">
            FR
          </span>
          <span className="site-header__logo-text">FlyRank</span>
        </a>

        <nav className="site-header__nav" aria-label="Main navigation">
          <ul className="site-header__nav-list">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
