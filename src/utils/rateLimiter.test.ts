import { describe, it, expect, beforeEach } from 'vitest';
import {
  SlidingWindowRateLimiter,
  validateAndSanitizePrompt,
  withMaxDuration,
  MAX_PROMPT_CHARS
} from './rateLimiter';

describe('SlidingWindowRateLimiter', () => {
  let limiter: SlidingWindowRateLimiter;

  beforeEach(() => {
    limiter = new SlidingWindowRateLimiter({ maxRequests: 3, windowMs: 1000 });
  });

  it('allows requests within the limit', () => {
    const r1 = limiter.check(1000);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = limiter.check(1050);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = limiter.check(1100);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it('blocks requests exceeding maxRequests limit', () => {
    limiter.check(1000);
    limiter.check(1050);
    limiter.check(1100);

    const blocked = limiter.check(1150);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetMs).toBeGreaterThan(0);
  });

  it('resets window after windowMs passes', () => {
    limiter.check(1000);
    limiter.check(1050);
    limiter.check(1100);

    const resetRequest = limiter.check(2100);
    expect(resetRequest.allowed).toBe(true);
    expect(resetRequest.remaining).toBe(2);
  });
});

describe('validateAndSanitizePrompt', () => {
  it('accepts valid input within limit', () => {
    const input = 'What are AI agent tool-calling patterns?';
    const res = validateAndSanitizePrompt(input);
    expect(res.valid).toBe(true);
    expect(res.sanitized).toBe(input);
    expect(res.warning).toBeUndefined();
  });

  it('truncates inputs exceeding MAX_PROMPT_CHARS', () => {
    const longInput = 'A'.repeat(MAX_PROMPT_CHARS + 500);
    const res = validateAndSanitizePrompt(longInput);
    expect(res.valid).toBe(true);
    expect(res.sanitizedLength).toBe(MAX_PROMPT_CHARS);
    expect(res.warning).toBeDefined();
  });

  it('handles invalid empty input gracefully', () => {
    const res = validateAndSanitizePrompt('');
    expect(res.valid).toBe(false);
    expect(res.warning).toBe('Input must be a non-empty string.');
  });
});

describe('withMaxDuration', () => {
  it('resolves normal async handler within maxDuration', async () => {
    const result = await withMaxDuration(async () => 'success', 500);
    expect(result).toBe('success');
  });

  it('rejects handler exceeding maxDuration timeout ceiling', async () => {
    vi.useFakeTimers();
    try {
      const slowTask = () => new Promise(resolve => setTimeout(resolve, 300));
      const promise = withMaxDuration(slowTask, 50);
      vi.advanceTimersByTime(100);
      await expect(promise).rejects.toThrow('Handler execution exceeded maximum timeout ceiling');
    } finally {
      vi.useRealTimers();
    }
  });
});
