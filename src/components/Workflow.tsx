import './Workflow.css';

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Vague prompt',
    description:
      'A single-line request produced a basic form without validation, tests, or accessibility.',
  },
  {
    step: '02',
    title: 'Structured prompt',
    description:
      'Detailed requirements yielded React Hook Form, Zod validation, aria labels, and unit tests.',
  },
  {
    step: '03',
    title: 'Verification review',
    description:
      'Manual review caught edge cases — invalid emails, empty fields, and submit-state handling.',
  },
] as const;

export function Workflow() {
  return (
    <section id="workflow" className="workflow" aria-labelledby="workflow-heading">
      <div className="workflow__inner">
        <div className="workflow__header">
          <h2 id="workflow-heading">AI workflow comparison</h2>
          <p>
            Two rounds of AI-assisted development — one with a vague prompt, one with structured
            requirements — showed a clear quality gap.
          </p>
        </div>

        <ol className="workflow__steps">
          {WORKFLOW_STEPS.map(({ step, title, description }) => (
            <li key={step} className="workflow__step">
              <span className="workflow__step-number" aria-hidden="true">
                {step}
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
