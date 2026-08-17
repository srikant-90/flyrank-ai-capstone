import React, { useState } from 'react';

export interface ToolResultProps {
  toolName: string;
  parameters: Record<string, unknown>;
  output: unknown;
  status: 'success' | 'error';
  executionTimeMs?: number;
}

export const ToolResult: React.FC<ToolResultProps> = ({
  toolName,
  parameters,
  output,
  status,
  executionTimeMs,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section
      aria-label={`Tool execution: ${toolName}`}
      className={`tool-result-container status-${status}`}
    >
      <header className="tool-result-header">
        <div className="tool-title-group">
          <span className="tool-badge" aria-label={`Status: ${status}`}>
            {status === 'success' ? 'Tool Executed' : 'Tool Failed'}
          </span>
          <h4 className="tool-name">{toolName}</h4>
          {executionTimeMs !== undefined && (
            <span className="execution-time" aria-label={`Execution time: ${executionTimeMs}ms`}>
              {executionTimeMs}ms
            </span>
          )}
        </div>

        <button
          type="button"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? `Collapse ${toolName} payload` : `Expand ${toolName} payload`}
          onClick={() => setIsExpanded(!isExpanded)}
          className="toggle-btn"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </header>

      {isExpanded && (
        <div className="tool-result-body">
          <div className="tool-section">
            <h5 className="section-subtitle">Parameters</h5>
            <pre aria-label="Tool input parameters">
              <code>{JSON.stringify(parameters, null, 2)}</code>
            </pre>
          </div>

          <div className="tool-section">
            <h5 className="section-subtitle">Output</h5>
            {status === 'error' ? (
              <div role="alert" className="tool-error-box">
                {String(output)}
              </div>
            ) : (
              <pre aria-label="Tool output result">
                <code>{typeof output === 'string' ? output : JSON.stringify(output, null, 2)}</code>
              </pre>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
