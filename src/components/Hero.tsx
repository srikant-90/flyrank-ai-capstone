import './Hero.css';

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__content">
        <p className="hero__eyebrow">FlyRank AI Internship Capstone</p>
        <h1 id="hero-heading" className="hero__title">
          Build smarter with{' '}
          <span className="hero__title-accent">AI-assisted development</span>
        </h1>
        <p className="hero__description">
          A hands-on project exploring structured prompting, accessible React forms, and
          quality-focused workflows using Claude Code, Git, and GitHub.
        </p>
        <div className="hero__actions">
          <a href="#settings" className="hero__cta hero__cta--primary">
            Try the settings form
          </a>
          <a href="#workflow" className="hero__cta hero__cta--secondary">
            See the workflow
          </a>
        </div>
      </div>

      <div className="hero__stats" aria-label="Project highlights">
        <div className="hero__stat">
          <span className="hero__stat-value">React</span>
          <span className="hero__stat-label">Hook Form + Zod</span>
        </div>
        <div className="hero__stat">
          <span className="hero__stat-value">A11y</span>
          <span className="hero__stat-label">Labels &amp; keyboard nav</span>
        </div>
        <div className="hero__stat">
          <span className="hero__stat-value">Tests</span>
          <span className="hero__stat-label">Vitest + Testing Library</span>
        </div>
      </div>
    </section>
  );
}
