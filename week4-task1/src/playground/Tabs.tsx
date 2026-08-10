import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";

/**
 * Tabs — implements the APG "Tabs" pattern (automatic activation, horizontal).
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Requirements implemented:
 * - role="tablist" on the container, role="tab" on each tab, role="tabpanel" on each panel
 * - aria-selected on the active tab, aria-controls / id pairing tab <-> panel
 * - Roving tabindex: only the active tab is in the Tab sequence (tabIndex 0), the rest are -1
 * - ArrowLeft / ArrowRight move focus and activate (automatic activation model)
 * - Home / End jump to the first / last tab
 * - Tab panel is reachable by Tab key from the active tab (tabIndex 0 on panel, no nested tab stop loop)
 */

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  idPrefix: string;
}

export function Tabs({ items, idPrefix }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function activate(index: number) {
    const clamped = (index + items.length) % items.length;
    setActiveIndex(clamped);
    tabRefs.current[clamped]?.focus();
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        activate(activeIndex + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        activate(activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        activate(0);
        break;
      case "End":
        event.preventDefault();
        activate(items.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div className="tabs">
      <div role="tablist" aria-label="Playground tabs" className="tablist">
        {items.map((item, index) => {
          const tabId = `${idPrefix}-tab-${item.id}`;
          const panelId = `${idPrefix}-panel-${item.id}`;
          const selected = index === activeIndex;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={tabId}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              className="tab"
              onClick={() => activate(index)}
              onKeyDown={handleKeyDown}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item, index) => {
        const tabId = `${idPrefix}-tab-${item.id}`;
        const panelId = `${idPrefix}-panel-${item.id}`;
        const selected = index === activeIndex;
        return (
          <div
            key={item.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!selected}
            tabIndex={0}
            className="tabpanel"
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
