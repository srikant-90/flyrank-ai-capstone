/**
 * lib/ai/config.ts
 * -----------------------------------------------------------------------
 * Single source of truth for the AI stream — provider: Groq (free tier).
 * Get your free GROQ_API_KEY at https://console.groq.com
 * Only change AI_MODEL here to switch models — nothing else needs updating.
 * -----------------------------------------------------------------------
 */

// Groq: llama-3.3-70b-versatile — free, fast, high quality open model.
export const AI_MODEL = "llama-3.3-70b-versatile";

export const AI_CONFIG = {
  model: AI_MODEL,
  // Audits should read the same way twice — keep temperature low.
  temperature: 0.3,
  maxOutputTokens: 1024,
} as const;

/**
 * System prompt for the audit-summary chat.
 */
export const SYSTEM_PROMPT = `
You are an AI assistant embedded in a Task Manager dashboard.
Your job: help the user analyze, summarize, and manage their tasks.

Rules:
- Be clear, concise, and helpful.
- If the user asks about tasks, give structured and actionable advice.
- Use short paragraphs and markdown lists — never a wall of text.
- If you are unsure of something, say so honestly instead of guessing.
- Never fabricate data, numbers, or information you were not given.
`.trim();
