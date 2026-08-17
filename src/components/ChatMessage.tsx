import React from 'react';

export interface ChatPart {
  type: 'text' | 'code';
  content: string;
  language?: string;
}

export interface ChatMessageProps {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: ChatPart[];
  isPending?: boolean;
  isStreaming?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  parts,
  isPending = false,
  isStreaming = false,
  error = null,
  onRetry,
}) => {
  return (
    <article aria-label={`${role} message`} className={`chat-message chat-message-${role}`}>
      <header className="chat-header">
        <span className="role-label">{role === 'user' ? 'You' : 'AI Assistant'}</span>
      </header>

      <div className="chat-body">
        {parts.map((part, idx) => {
          if (part.type === 'code') {
            return (
              <div key={idx} className="code-block" role="region" aria-label={`Code snippet (${part.language || 'text'})`}>
                <div className="code-header">
                  <span>{part.language || 'code'}</span>
                  <button
                    type="button"
                    aria-label="Copy code to clipboard"
                    onClick={() => navigator.clipboard?.writeText(part.content)}
                  >
                    Copy
                  </button>
                </div>
                <pre>
                  <code>{part.content}</code>
                </pre>
              </div>
            );
          }
          return (
            <p key={idx} className="text-content">
              {part.content}
            </p>
          );
        })}

        {isStreaming && (
          <span className="streaming-cursor" role="status" aria-label="AI is typing...">
            <span aria-hidden="true">▍</span>
          </span>
        )}

        {isPending && (
          <div className="pending-indicator" role="status" aria-label="Thinking...">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}

        {error && (
          <div className="error-alert" role="alert">
            <p className="error-text">{error}</p>
            {onRetry && (
              <button type="button" onClick={onRetry} aria-label="Retry generating response">
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
