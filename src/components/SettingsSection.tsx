import { SettingsForm } from './SettingsForm';
import './SettingsSection.css';

export function SettingsSection() {
  return (
    <section id="settings" className="settings-section" aria-labelledby="settings-section-heading">
      <div className="settings-section__inner">
        <div className="settings-section__header">
          <h2 id="settings-section-heading">Interactive settings demo</h2>
          <p>
            Try the form below — validation runs on submit, and success feedback appears after a
            simulated save.
          </p>
        </div>

        <div className="settings-section__form-card">
          <SettingsForm />
        </div>
      </div>
    </section>
  );
}
