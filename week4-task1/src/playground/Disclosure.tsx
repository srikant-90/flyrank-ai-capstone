import { useId, useState, type ReactNode } from "react";

/**
 * Disclosure — implements the APG "Disclosure (Show/Hide)" pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * Requirements implemented:
 * - A native <button> as the trigger (gets Enter/Space activation and Tab focus for free)
 * - aria-expanded reflects open/closed state
 * - aria-controls points at the content region's id
 * - Content is removed from the accessibility tree and the tab sequence when collapsed (hidden attribute)
 */

interface DisclosureProps {
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({ summary, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="disclosure">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        className="disclosure-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span aria-hidden="true" className={`disclosure-caret ${open ? "open" : ""}`}>
          ▶
        </span>
        {summary}
      </button>
      <div id={contentId} role="region" hidden={!open} className="disclosure-content">
        {children}
      </div>
    </div>
  );
}
