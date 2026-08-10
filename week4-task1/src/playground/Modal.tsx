import { useEffect, useRef, type ReactNode, type KeyboardEvent as ReactKeyboardEvent } from "react";

/**
 * Modal Dialog — implements the APG "Dialog (Modal)" pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * Requirements implemented:
 * - role="dialog" + aria-modal="true" + aria-labelledby pointing at the heading
 * - Focus moves into the dialog when it opens (first focusable element)
 * - Focus is trapped inside the dialog while open (Tab / Shift+Tab wrap)
 * - Escape closes the dialog
 * - Focus returns to the element that triggered the dialog when it closes
 * - Content behind the dialog is inert to screen readers (aria-hidden on siblings via a portal-less
 *   approach here: we simply don't render page content inside the dialog, and rely on the dialog being
 *   the last interactive surface — for a production app you'd also set aria-hidden on #root siblings)
 */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  children: ReactNode;
  triggerRef: React.RefObject<HTMLElement | null>;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => el.offsetParent !== null
  );
}

export function Modal({ isOpen, onClose, titleId, title, children, triggerRef }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Move focus into the dialog on open; restore it to the trigger on close.
  useEffect(() => {
    if (!isOpen) return;

    const dialogNode = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = dialogNode ? getFocusableElements(dialogNode) : [];
    (focusables[0] ?? dialogNode)?.focus();

    return () => {
      // Prefer the explicit trigger ref; fall back to whatever had focus before opening.
      (triggerRef.current ?? previouslyFocused)?.focus();
    };
  }, [isOpen, triggerRef]);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) return;

    // Trap focus: cycle Tab/Shift+Tab within the dialog's focusable elements.
    const focusables = getFocusableElements(dialogRef.current);
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <h2 id={titleId}>{title}</h2>
        {children}
        <button type="button" onClick={onClose} className="modal-close">
          Close
        </button>
      </div>
    </div>
  );
}
