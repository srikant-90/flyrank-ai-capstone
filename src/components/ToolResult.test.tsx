import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ToolResult } from './ToolResult';

describe('ToolResult Component', () => {
  it('renders successful tool execution with parameters and output', () => {
    render(
      <ToolResult
        toolName="query_arxiv_api"
        parameters={{ query: 'cat:cs.AI agentic workflows', max_results: 3 }}
        output={{ papers_found: 3, status: 'synced' }}
        status="success"
        executionTimeMs={340}
      />
    );

    const toolSection = screen.getByRole('region', { name: /tool execution: query_arxiv_api/i });
    expect(toolSection).toBeInTheDocument();
    expect(screen.getByText('query_arxiv_api')).toBeInTheDocument();
    expect(screen.getByLabelText(/status: success/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/execution time: 340ms/i)).toBeInTheDocument();

    const paramCode = screen.getByLabelText(/tool input parameters/i);
    expect(paramCode).toHaveTextContent('cat:cs.AI agentic workflows');

    const outputCode = screen.getByLabelText(/tool output result/i);
    expect(outputCode).toHaveTextContent('papers_found');
  });

  it('renders tool execution error inside an alert role', () => {
    render(
      <ToolResult
        toolName="export_flashcards_json"
        parameters={{ count: 5 }}
        output="ValidationError: schema mismatch at key 'answer'"
        status="error"
      />
    );

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent("ValidationError: schema mismatch at key 'answer'");
  });

  it('allows expanding and collapsing the tool payload', async () => {
    const user = userEvent.setup();

    render(
      <ToolResult
        toolName="query_arxiv_api"
        parameters={{ query: 'test' }}
        output="Result OK"
        status="success"
      />
    );

    const toggleBtn = screen.getByRole('button', { name: /collapse query_arxiv_api payload/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(screen.getByLabelText(/tool input parameters/i)).toBeInTheDocument();

    // Click to collapse
    await user.click(toggleBtn);
    expect(screen.queryByLabelText(/tool input parameters/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /expand query_arxiv_api payload/i })).toBeInTheDocument();

    // Click to expand again
    await user.click(screen.getByRole('button', { name: /expand query_arxiv_api payload/i }));
    expect(screen.getByLabelText(/tool input parameters/i)).toBeInTheDocument();
  });
});
