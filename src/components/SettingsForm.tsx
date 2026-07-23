import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  defaultSettingsValues,
  settingsSchema,
  THEME_OPTIONS,
  type SettingsFormValues,
} from './settingsTypes';
import './SettingsForm.css';

export interface SettingsFormProps {
  onSubmit?: (values: SettingsFormValues) => Promise<void> | void;
  defaultValues?: Partial<SettingsFormValues>;
}

export function SettingsForm({ onSubmit, defaultValues }: SettingsFormProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { ...defaultSettingsValues, ...defaultValues },
    mode: 'onSubmit',
  });

  const onFormSubmit = handleSubmit(async (values) => {
    setSubmitStatus('idle');

    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      setSubmitStatus('success');
      reset(values);
    } catch {
      setSubmitStatus('error');
    }
  });

  return (
    <form
      className="settings-form"
      onSubmit={onFormSubmit}
      noValidate
      aria-labelledby="settings-form-title"
    >
      <h2 id="settings-form-title">Settings</h2>

      <div className="form-field">
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          aria-invalid={errors.fullName ? 'true' : 'false'}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          {...register('fullName')}
        />
        {errors.fullName && (
          <p id="fullName-error" className="field-error" role="alert" aria-live="polite">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="field-error" role="alert" aria-live="polite">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="theme">Theme</label>
        <select
          id="theme"
          aria-invalid={errors.theme ? 'true' : 'false'}
          aria-describedby={errors.theme ? 'theme-error' : undefined}
          {...register('theme')}
        >
          {THEME_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === 'light' ? 'Light' : 'Dark'}
            </option>
          ))}
        </select>
        {errors.theme && (
          <p id="theme-error" className="field-error" role="alert" aria-live="polite">
            {errors.theme.message}
          </p>
        )}
      </div>

      <div className="form-field form-field--checkbox">
        <input id="notifications" type="checkbox" {...register('notifications')} />
        <label htmlFor="notifications">Notifications</label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Settings'}
      </button>

      <div aria-live="polite" aria-atomic="true" className="form-status">
        {submitStatus === 'success' && (
          <p role="status" className="form-success">
            Settings saved successfully.
          </p>
        )}
        {submitStatus === 'error' && (
          <p role="alert" className="form-error">
            Unable to save settings. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}
