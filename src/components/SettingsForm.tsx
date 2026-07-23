import { FormEvent, useState } from "react";
import {
  defaultSettings,
  SettingsFormProps,
  SettingsValues,
  validateSettings,
} from "./settingsTypes";
import "./SettingsForm.css";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export default function SettingsForm({ initialValues, onSave }: SettingsFormProps) {
  const [values, setValues] = useState<SettingsValues>({
    ...defaultSettings,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SettingsValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  function updateField<K extends keyof SettingsValues>(field: K, value: SettingsValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
    setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateSettings(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("saving");
    try {
      await onSave?.(values);
      setStatus("saved");
    } catch {
      setStatus("idle");
    }
  }

  function handleReset() {
    setValues({ ...defaultSettings, ...initialValues });
    setErrors({});
    setStatus("idle");
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <header className="settings-form__header">
        <h1>Settings</h1>
        <p>Manage your profile, preferences, and notification options.</p>
      </header>

      <section className="settings-form__section" aria-labelledby="profile-heading">
        <h2 id="profile-heading">Profile</h2>

        <div className="settings-form__field">
          <label htmlFor="displayName">Display name</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            value={values.displayName}
            aria-invalid={Boolean(errors.displayName)}
            aria-describedby={errors.displayName ? "displayName-error" : undefined}
            onChange={(event) => updateField("displayName", event.target.value)}
          />
          {errors.displayName && (
            <span id="displayName-error" className="settings-form__error" role="alert">
              {errors.displayName}
            </span>
          )}
        </div>

        <div className="settings-form__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            onChange={(event) => updateField("email", event.target.value)}
          />
          {errors.email && (
            <span id="email-error" className="settings-form__error" role="alert">
              {errors.email}
            </span>
          )}
        </div>
      </section>

      <section className="settings-form__section" aria-labelledby="preferences-heading">
        <h2 id="preferences-heading">Preferences</h2>

        <div className="settings-form__field">
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            name="theme"
            value={values.theme}
            onChange={(event) =>
              updateField("theme", event.target.value as SettingsValues["theme"])
            }
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="settings-form__field">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            name="language"
            value={values.language}
            onChange={(event) => updateField("language", event.target.value)}
          >
            {LANGUAGES.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </div>

        <div className="settings-form__field">
          <label htmlFor="timezone">Timezone</label>
          <select
            id="timezone"
            name="timezone"
            value={values.timezone}
            onChange={(event) => updateField("timezone", event.target.value)}
          >
            {TIMEZONES.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="settings-form__section" aria-labelledby="notifications-heading">
        <h2 id="notifications-heading">Notifications</h2>

        <label className="settings-form__toggle">
          <input
            type="checkbox"
            name="emailNotifications"
            checked={values.emailNotifications}
            onChange={(event) => updateField("emailNotifications", event.target.checked)}
          />
          <span>
            <strong>Email notifications</strong>
            <small>Receive updates about your account by email.</small>
          </span>
        </label>

        <label className="settings-form__toggle">
          <input
            type="checkbox"
            name="pushNotifications"
            checked={values.pushNotifications}
            onChange={(event) => updateField("pushNotifications", event.target.checked)}
          />
          <span>
            <strong>Push notifications</strong>
            <small>Get real-time alerts in your browser.</small>
          </span>
        </label>

        <label className="settings-form__toggle">
          <input
            type="checkbox"
            name="weeklyDigest"
            checked={values.weeklyDigest}
            onChange={(event) => updateField("weeklyDigest", event.target.checked)}
          />
          <span>
            <strong>Weekly digest</strong>
            <small>A summary of activity delivered every Monday.</small>
          </span>
        </label>
      </section>

      <footer className="settings-form__actions">
        <button type="button" className="settings-form__button settings-form__button--secondary" onClick={handleReset}>
          Reset
        </button>
        <button
          type="submit"
          className="settings-form__button settings-form__button--primary"
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving..." : "Save changes"}
        </button>
      </footer>

      {status === "saved" && (
        <p className="settings-form__status" role="status">
          Settings saved successfully.
        </p>
      )}
    </form>
  );
}
