import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SettingsForm } from './SettingsForm';

describe('SettingsForm', () => {
  it('submits successfully with valid data and shows success message', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(<SettingsForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.selectOptions(screen.getByLabelText(/theme/i), 'dark');
    await user.click(screen.getByLabelText(/notifications/i));

    const submitButton = screen.getByRole('button', { name: /save settings/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        theme: 'dark',
        notifications: true,
      });
    });

    expect(await screen.findByText('Settings saved successfully.')).toBeInTheDocument();
  });

  it('shows validation errors when required fields are empty', async () => {
    const user = userEvent.setup();

    render(<SettingsForm onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /save settings/i }));

    expect(await screen.findByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('shows an error for an invalid email address', async () => {
    const user = userEvent.setup();

    render(<SettingsForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.selectOptions(screen.getByLabelText(/theme/i), 'light');
    await user.click(screen.getByRole('button', { name: /save settings/i }));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('disables the submit button while submitting', async () => {
    const user = userEvent.setup();
    let resolveSubmit: () => void = () => undefined;

    const handleSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    render(<SettingsForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.selectOptions(screen.getByLabelText(/theme/i), 'light');

    const submitButton = screen.getByRole('button', { name: /save settings/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();

    resolveSubmit();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
