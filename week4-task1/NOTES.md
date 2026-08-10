# Week 4 – Foundations

## Components Built From Scratch

I implemented three interactive components from scratch using React and TypeScript without using a component library:

1. Modal Dialog
2. Tabs
3. Disclosure

The implementations follow the relevant WAI-ARIA Authoring Practices patterns.

---

## 1. Modal Dialog

The hand-built modal implements:

- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby`
- Focus movement into the dialog when opened
- Focus trapping with Tab and Shift+Tab
- Escape key to close
- Focus restoration to the trigger after closing

The implementation manually finds focusable elements and manages focus using React refs and keyboard event handling.

---

## 2. Tabs

The hand-built Tabs implementation uses:

- `role="tablist"`
- `role="tab"`
- `role="tabpanel"`
- `aria-selected`
- `aria-controls`
- Roving `tabIndex`
- ArrowLeft and ArrowRight navigation
- Home and End navigation
- Automatic activation
- Focus movement to the newly selected tab

---

## 3. Disclosure

The hand-built Disclosure uses:

- A native `<button>` as the trigger
- `aria-expanded`
- `aria-controls`
- `useId()` for a unique content ID
- The native keyboard behavior of a button for Enter and Space
- The `hidden` attribute to hide collapsed content

---

# Comparison With shadcn/ui

I installed shadcn/ui with the Radix UI primitives and inspected the generated Dialog and Tabs source.

## Gap 1 – Modal focus management

My hand-built Modal manually implements focus management.

It manually:

- finds focusable elements,
- moves focus into the dialog,
- traps Tab and Shift+Tab,
- handles Escape,
- restores focus to the trigger.

The shadcn Dialog delegates these interaction and accessibility behaviors to the Radix Dialog primitive through `DialogPrimitive.Content`, `DialogPrimitive.Close`, and related primitives.

This means less custom focus-management code has to be maintained manually.

## Gap 2 – Dialog composition and accessibility structure

My Modal is implemented as one component with manually managed behavior.

shadcn provides separate reusable primitives:

- `Dialog`
- `DialogTrigger`
- `DialogContent`
- `DialogTitle`
- `DialogDescription`
- `DialogClose`
- `DialogOverlay`
- `DialogPortal`

This provides a more structured and reusable API for building accessible dialogs.

## Gap 3 – Tabs keyboard and state management

My hand-built Tabs manually implements the active tab state, roving `tabIndex`, arrow-key navigation, Home/End navigation, and focus movement.

The shadcn Tabs component delegates these behaviors to the Radix Tabs primitives:

- `TabsPrimitive.Root`
- `TabsPrimitive.List`
- `TabsPrimitive.Trigger`
- `TabsPrimitive.Content`

Therefore, the underlying primitive handles the complex tab interaction behavior rather than requiring all of it to be implemented manually.

## Gap 4 – Tabs composition and flexibility

My implementation requires an array of tab items:

```text
items + idPrefix