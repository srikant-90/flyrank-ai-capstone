/**
 * components/chat/audit-chat.tsx
 * -----------------------------------------------------------------------
 * Streaming AI chat powered by Google Gemini via Vercel AI SDK.
 * Features:
 *  - Token-by-token streaming (useChat + toUIMessageStreamResponse)
 *  - Stop mid-stream without breaking state
 *  - Multi-turn conversation history persists across turns
 *  - API key stays server-side only (never exposed to the browser)
 *  - Clean, fully visible UI with inline styles for reliability
 * -----------------------------------------------------------------------
 */

"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

// Render an assistant message — plain text with preserved newlines.
// Intentionally NOT using a markdown library to keep styling simple and visible.
function AssistantMessage({ text }: { text: string }) {
  return (
    <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "#1a1a2e" }}>
      {text}
    </div>
  );
}

export function AuditChat() {
  const { messages, sendMessage, status, stop, error } = useChat({
    api: "/api/chat",
  });

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isStreaming = status === "streaming" || status === "submitted";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
  }

  // Extract plain text from message parts
  function getMessageText(parts: { type: string; text?: string }[]): string {
    return parts
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "600px",
        border: "1.5px solid #e2e8f0",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#f8fafc",
        fontFamily: "Inter, system-ui, sans-serif",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: error ? "#ef4444" : "#4ade80",
            boxShadow: error ? "0 0 6px #ef4444" : "0 0 6px #4ade80",
          }}
        />
        <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>
          AI Assistant (Groq LLaMA 3.3)
        </span>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          backgroundColor: "#f8fafc",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: "80px",
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            👋 Hello! Ask me anything about your tasks or work.
          </div>
        )}

        {messages.map((m) => {
          const text = getMessageText(m.parts as { type: string; text?: string }[]);
          const isUser = m.role === "user";

          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
              }}
            >
              {/* Avatar for AI */}
              {!isUser && (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    marginRight: 8,
                    flexShrink: 0,
                    alignSelf: "flex-end",
                  }}
                >
                  🤖
                </div>
              )}

              {/* Bubble */}
              <div
                style={{
                  maxWidth: "78%",
                  padding: "10px 16px",
                  borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  backgroundColor: isUser ? "#667eea" : "#ffffff",
                  color: isUser ? "#ffffff" : "#1a1a2e",
                  fontSize: 14,
                  lineHeight: 1.6,
                  boxShadow: isUser
                    ? "0 2px 8px rgba(102,126,234,0.4)"
                    : "0 2px 8px rgba(0,0,0,0.08)",
                  border: isUser ? "none" : "1px solid #e2e8f0",
                  wordBreak: "break-word",
                }}
              >
                {isUser ? (
                  <span>{text}</span>
                ) : (
                  <AssistantMessage text={text} />
                )}
              </div>

              {/* Avatar for user */}
              {isUser && (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#667eea",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    marginLeft: 8,
                    flexShrink: 0,
                    alignSelf: "flex-end",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  U
                </div>
              )}
            </div>
          );
        })}

        {/* Typing / thinking indicator */}
        {status === "submitted" && (
          <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
              }}
            >🤖</div>
            <div
              style={{
                padding: "10px 16px", borderRadius: "18px 18px 18px 4px",
                backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                display: "flex", gap: 4, alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 7, height: 7, borderRadius: "50%",
                    backgroundColor: "#667eea",
                    display: "inline-block",
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error message banner */}
        {error && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              fontSize: "13px",
              lineHeight: 1.5,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "16px" }}>⚠️</span>
            <div>
              <strong>Connection Error:</strong> {error.message || "Failed to reach AI service."}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1.5px solid #e2e8f0",
          backgroundColor: "#ffffff",
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
          placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            border: "1.5px solid #e2e8f0",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 14,
            fontFamily: "inherit",
            color: "#1a1a2e",
            backgroundColor: "#f8fafc",
            outline: "none",
            maxHeight: 120,
            lineHeight: 1.5,
          }}
          onFocus={(e) => (e.target.style.borderColor = "#667eea")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={stop}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: "none",
              backgroundColor: "#ef4444",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              flexShrink: 0,
              fontFamily: "inherit",
            }}
          >
            ⏹ Stop
          </button>
        ) : (
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!input.trim()}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: "none",
              background: input.trim()
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "#e2e8f0",
              color: input.trim() ? "#fff" : "#94a3b8",
              fontWeight: 600,
              fontSize: 14,
              cursor: input.trim() ? "pointer" : "not-allowed",
              flexShrink: 0,
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            Send ➤
          </button>
        )}
      </div>

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
