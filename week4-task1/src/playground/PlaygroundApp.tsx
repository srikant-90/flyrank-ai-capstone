import { useRef, useState } from "react";
import { Modal } from "./Modal";
import { Tabs } from "./Tabs";
import { Disclosure } from "./Disclosure";
import "./playground.css";

export default function PlaygroundApp() {
  const [modalOpen, setModalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <main className="playground-app">
      <h1>Week 4 · Task 1 — Accessible Component Playground</h1>

      <section>
        <h2>Modal</h2>
        <button ref={triggerRef} type="button" onClick={() => setModalOpen(true)}>
          Open modal
        </button>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          titleId="demo-modal-title"
          title="Delete item?"
          triggerRef={triggerRef}
        >
          <p>This action cannot be undone.</p>
          <input type="text" placeholder="type reason (optional)" />
        </Modal>
      </section>

      <section>
        <h2>Tabs</h2>
        <Tabs
          idPrefix="demo"
          items={[
            { id: "profile", label: "Profile", content: <p>Profile panel content.</p> },
            { id: "account", label: "Account", content: <p>Account panel content.</p> },
            { id: "billing", label: "Billing", content: <p>Billing panel content.</p> },
          ]}
        />
      </section>

      <section>
        <h2>Disclosure</h2>
        <Disclosure summary="What is the refund policy?">
          <p>Refunds are issued within 14 days of purchase, no questions asked.</p>
        </Disclosure>
      </section>
    </main>
  );
}
