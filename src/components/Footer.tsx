import './Footer.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__brand">
          <span className="site-footer__logo-mark" aria-hidden="true">
            FR
          </span>
          FlyRank AI Capstone
        </p>
        <p className="site-footer__copy">
          &copy; {year} FlyRank AI Internship onboarding project. Built with React, Vite, and
          TypeScript.
        </p>
      </div>
    </footer>
  );
}
