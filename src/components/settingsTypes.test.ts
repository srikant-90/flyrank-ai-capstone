import { describe, expect, it } from 'vitest';
import { settingsSchema } from './settingsTypes';

describe('settingsSchema', () => {
  it('requires a valid theme value', () => {
    const result = settingsSchema.safeParse({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      theme: '',
      notifications: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.theme?.length).toBeGreaterThan(0);
    }
  });
});
