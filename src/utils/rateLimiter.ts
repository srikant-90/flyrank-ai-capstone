/**
 * Production Hardening & Anti-Abuse Guardrails Module
 * FlyRank AI Capstone — Week 8 Assignment
 * 
 * Provides:
 * 1. Sliding Window Token Bucket Rate Limiter (prevents API credit exhaustion)
 * 2. Prompt & Payload Input Sanitizer / Length Capper (prevents context inflation attacks)
 * 3. Streaming Response Timeout Wrapper (maxDuration enforcement)
 */

export interface RateLimiterOptions {
  maxRequests: number;  // Max allowed requests per window (e.g. 10)
  windowMs: number;     // Window duration in milliseconds (e.g. 60,000ms = 1 min)
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
  total: number;
}

export class SlidingWindowRateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(options: RateLimiterOptions = { maxRequests: 10, windowMs: 60000 }) {
    this.maxRequests = options.maxRequests;
    this.windowMs = options.windowMs;
  }

  /**
   * Check if a request is allowed under the current sliding window
   */
  check(now: number = Date.now()): RateLimitResult {
    // Clear timestamps outside the sliding window
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      const remaining = this.maxRequests - this.requests.length;
      return {
        allowed: true,
        remaining,
        resetMs: this.windowMs,
        total: this.maxRequests
      };
    }

    const oldestRequest = this.requests[0];
    const resetMs = Math.max(0, this.windowMs - (now - oldestRequest));

    return {
      allowed: false,
      remaining: 0,
      resetMs,
      total: this.maxRequests
    };
  }

  reset(): void {
    this.requests = [];
  }
}

export const MAX_PROMPT_CHARS = 2000;
export const MAX_PAYLOAD_BYTES = 100 * 1024; // 100 KB limit

export interface InputValidationResult {
  valid: boolean;
  sanitized: string;
  originalLength: number;
  sanitizedLength: number;
  warning?: string;
}

/**
 * Validates and sanitizes prompt inputs to protect against context window inflation attacks
 */
export function validateAndSanitizePrompt(input: string, maxChars: number = MAX_PROMPT_CHARS): InputValidationResult {
  if (!input || typeof input !== 'string') {
    return {
      valid: false,
      sanitized: '',
      originalLength: 0,
      sanitizedLength: 0,
      warning: 'Input must be a non-empty string.'
    };
  }

  const originalLength = input.length;
  // Strip control characters except newline and tab
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();

  let warning: string | undefined;

  if (sanitized.length > maxChars) {
    sanitized = sanitized.substring(0, maxChars);
    warning = `Input exceeded maximum allowed character limit (${maxChars} chars). Content truncated for security.`;
  }

  return {
    valid: true,
    sanitized,
    originalLength,
    sanitizedLength: sanitized.length,
    warning
  };
}

/**
 * Enforces a maximum execution timeout duration on async streaming handlers
 */
export async function withMaxDuration<T>(
  fn: () => Promise<T>,
  maxDurationMs: number = 30000
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Handler execution exceeded maximum timeout ceiling (${maxDurationMs}ms). Request terminated for anti-abuse protection.`));
    }, maxDurationMs);

    fn()
      .then(result => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}
