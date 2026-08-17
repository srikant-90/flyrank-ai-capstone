import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChatMessage } from './ChatMessage';

describe('ChatMessage Component', () => {
  it('renders standard text messages with accessible role', () => {
    render(
      <ChatMessage
        id="msg-1"
        role="assistant"
        parts={[{ type: 'text', content: 'Hello! I found 3 relevant arXiv papers.' }]}
      />
    );

    const messageArticle = screen.getByRole('article', { name: /assistant message/i });
    expect(messageArticle).toBeInTheDocument();
    expect(screen.getByText('Hello! I found 3 relevant arXiv papers.')).toBeInTheDocument();
  });

  it('renders code snippet parts with accessible region and copy button', async () => {
    const user = userEvent.setup();
    const mockClipboard = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockClipboard,
      },
      writable: true,
      configurable: true,
    });

    render(
      <ChatMessage
        id="msg-2"
        role="assistant"
        parts={[
          {
            type: 'code',
            language: 'python',
            content: 'import httpx\nresponse = httpx.get("https://export.arxiv.org/api/query")',
          },
        ]}
      />
    );

    const codeRegion = screen.getByRole('region', { name: /code snippet \(python\)/i });
    expect(codeRegion).toBeInTheDocument();

    const copyBtn = screen.getByRole('button', { name: /copy code to clipboard/i });
    expect(copyBtn).toBeInTheDocument();

    await user.click(copyBtn);
    expect(mockClipboard).toHaveBeenCalledWith(
      'import httpx\nresponse = httpx.get("https://export.arxiv.org/api/query")'
    );
  });

  it('displays pending indicator with status role when isPending is true', () => {
    render(
      <ChatMessage
        id="msg-3"
        role="assistant"
        parts={[]}
        isPending={true}
      />
    );

    const pendingStatus = screen.getByRole('status', { name: /thinking/i });
    expect(pendingStatus).toBeInTheDocument();
  });

  it('displays streaming cursor with status role when isStreaming is true', () => {
    render(
      <ChatMessage
        id="msg-4"
        role="assistant"
        parts={[{ type: 'text', content: 'Analyzing paper abstracts' }]}
        isStreaming={true}
      />
    );

    expect(screen.getByText('Analyzing paper abstracts')).toBeInTheDocument();
    const streamingStatus = screen.getByRole('status', { name: /ai is typing/i });
    expect(streamingStatus).toBeInTheDocument();
  });

  it('displays error alert and triggers onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();

    render(
      <ChatMessage
        id="msg-5"
        role="assistant"
        parts={[]}
        error="Failed to connect to arXiv API (Status 503)"
        onRetry={handleRetry}
      />
    );

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toBeInTheDocument();
    expect(screen.getByText(/failed to connect to arxiv api/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /retry generating response/i });
    await user.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
