export interface SettingsValues {
  displayName: string;
  email: string;
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
}

export const defaultSettings: SettingsValues = {
  displayName: "",
  email: "",
  theme: "system",
  language: "en",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  emailNotifications: true,
  pushNotifications: false,
  weeklyDigest: true,
};

export interface SettingsFormProps {
  initialValues?: Partial<SettingsValues>;
  onSave?: (values: SettingsValues) => void | Promise<void>;
}

export function validateSettings(values: SettingsValues): Partial<Record<keyof SettingsValues, string>> {
  const errors: Partial<Record<keyof SettingsValues, string>> = {};

  if (!values.displayName.trim()) {
    errors.displayName = "Display name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}
