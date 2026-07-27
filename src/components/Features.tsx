import './Features.css';

const FEATURES = [
  {
    title: 'Structured prompting',
    description:
      'Compare vague vs. detailed AI prompts and see how clear requirements lead to better code.',
  },
  {
    title: 'Form validation',
    description:
      'React Hook Form with Zod schema validation catches empty fields and invalid emails before submit.',
  },
  {
    title: 'Accessibility first',
    description:
      'Every input has a label, validation messages use aria-live, and keyboard navigation is supported.',
  },
  {
    title: 'Test coverage',
    description:
      'Unit tests verify happy paths, validation errors, and disabled submit state during async saves.',
  },
] as const;

export function Features() {
  return (
    <section id="features" className="features" aria-labelledby="features-heading">
      <div className="features__inner">
        <div className="features__header">
          <h2 id="features-heading">What this project covers</h2>
          <p>
            Key skills practiced during the FlyRank AI onboarding assignment — from prompting
            strategy to production-ready React patterns.
          </p>
        </div>

        <ul className="features__grid">
          {FEATURES.map(({ title, description }) => (
            <li key={title} className="features__card">
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
