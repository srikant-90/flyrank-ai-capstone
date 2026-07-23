import { z } from 'zod';

export const THEME_OPTIONS = ['light', 'dark'] as const;

export const settingsSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  theme: z.enum(THEME_OPTIONS, {
    required_error: 'Theme is required',
    invalid_type_error: 'Theme is required',
  }),
  notifications: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const defaultSettingsValues: SettingsFormValues = {
  fullName: '',
  email: '',
  theme: 'light',
  notifications: false,
};
