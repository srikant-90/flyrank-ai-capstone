# Week 6 Deliverable: Explain It Like You Built It (Owning the Build)

**Track:** General AI Fluency  
**Intern:** Srikant  
**Capstone Project:** FlyRank AI Practitioner Portfolio  
**Course Module:** Week 6 — Explain Your Build (Human in the Loop & Eliminating Mystery Code)  
**Deliverable URL / File:** `Week6_Explain_Your_Build.html` / `Week6_Explain_Your_Build.md`  
**GitHub Repository:** `https://github.com/srikant-90/flyrank-ai-capstone`  

---

## 1. The Piece of My Build I Chose: Modal Popups & Event Bubbling

In my portfolio (`index.html`), clicking "Connect" or "Schedule Call" opens an interactive modal window. 

When the AI originally generated this feature, it gave me this snippet:

```html
<!-- The dark full-screen overlay -->
<div id="booking-modal" class="modal-overlay" onclick="closeModal('booking-modal')">
  
  <!-- The modal dialog box inside -->
  <div class="modal-card" onclick="event.stopPropagation()">
    <button class="modal-close" onclick="closeModal('booking-modal')">&times;</button>
    <h3>Schedule a Technical Chat</h3>
    <p>Select a time to discuss AI agent design...</p>
  </div>

</div>
```

### The "Mystery Code" That Confused Me
When I first inspected this code, I understood what `closeModal()` did (it sets `display: none`). But I had no idea why `onclick="event.stopPropagation()"` was sitting on the `.modal-card` div. 

I asked myself:
> *"Why do I need to 'stop propagation'? What is propagating, and why would clicking inside the card break anything if I didn't have that line?"*

Rather than shipping this mystery code, I used AI as a tutor to break down browser event architecture until I could explain it without looking at notes.

---

## 2. Plain-Words Explanation (Teaching a Friend Who Has Never Built a Website)

Imagine you are looking through two layers of glass:
1. A giant, tinted sheet of glass that covers your entire computer screen (the dark overlay background).
2. A small, solid white whiteboard resting right in the middle on top of it (the popup card with text and buttons).

### The Natural Problem (How Browsers Listen to Clicks)
When you click on a website, the browser treats your mouse click like dropping a pebble into a pond. The ripples don't just stay where the pebble hit—**they ripple outward and upward through every parent layer containing that element.** This is called **"Event Bubbling."**

If you click the dark background glass outside the white box, you want the popup to close. That makes sense: `onclick="closeModal()"` on the dark background does exactly that.

**The catch:** If you click inside the white box (for example, clicking a text link or typing in a field), your mouse technically also touched the dark sheet underneath it, because the white card lives *inside* the background layer in the HTML structure.

Without any protection, the browser says:
1. *"User clicked the text inside the white card."*
2. *"The white card is inside the dark background."*
3. *"The dark background has an instruction: When clicked, close everything!"*
4. **Result:** The modal abruptly snaps shut in the user's face the moment they try to click or select text inside it!

### What `event.stopPropagation()` Actually Does
`event.stopPropagation()` is like catching the ripple before it travels any further.

It tells the browser:
> *"Handle whatever the user clicked right here inside this white box, and **STOP** the notification from bubbling up to the dark background layer."*

Because the click notification stops at the card, the dark background never hears about it, and the modal stays open while the user interacts with the form. But if the user clicks anywhere *outside* the card onto the dark space, the notification hits the background listener directly and closes the window smoothly.

---

## 3. How the CSS Layout Makes the Dimmed Effect Work

To make the modal feel like a real native app, three simple CSS properties work together on the outer `.modal-overlay`:

```css
.modal-overlay {
  display: none;        /* Hidden by default until JavaScript turns it into 'flex' */
  position: fixed;     /* Locks the layer to the screen so it stays centered even if scrolling */
  top: 0; left: 0;     /* Pins the overlay to the very top-left corner */
  width: 100%;         /* Stretches the overlay across the full width of the screen */
  height: 100%;        /* Stretches the overlay across the full height of the screen */
  background: rgba(9, 13, 22, 0.85); /* 85% opacity dark slate, letting the page blur underneath */
  z-index: 1000;       /* Forces this layer to sit on top of everything else on the page */
}
```

- **`position: fixed`**: Takes the overlay out of normal document flow. Even if the user was halfway down the page reading the ResearchScout case study, the modal opens right in front of their eyes.
- **`z-index: 1000`**: In CSS, elements stack like layers of paper. A high `z-index` guarantees that navigation bars, buttons, and text never poke through the popup.
- **`backdrop-filter: blur(8px)`**: Blurs the actual portfolio content behind the dark tint, focusing all visual attention onto the modal card.

---

## 4. The Tutoring Self-Test (Proving Genuine Understanding)

During my tutoring session, I asked the AI to quiz me on edge cases to test my retention:

* **Quiz Question:** *"What happens if you remove `event.stopPropagation()` and click the 'Copy Link' button inside the modal?"*
  * **My Answer:** The link text might copy, but the entire modal will instantly disappear because the click bubbles up to the `.modal-overlay` container and triggers `closeModal()`.
* **Quiz Question:** *"Why not just put the modal card outside the overlay in HTML?"*
  * **My Answer:** If the card is outside the overlay, positioning them together centered on the screen requires complex coordinate math, and you lose the automatic backdrop containment that Flexbox gives you (`justify-content: center; align-items: center;`).

---

## 5. Pass / Revise Self-Audit

| Criteria | Standard | Status | Evidence |
|:---|:---|:---|:---|
| **Real Piece of Build** | Must be actual code from the shipped repository, not a generic tutorial. | **PASS** | Directly explains lines 358–386 and 583–618 in `index.html` (the modal overlay and event handling). |
| **In Own Words & Correct** | Clear, jargon-free explanation using accurate analogies. | **PASS** | Pebble/ripple pond analogy for event bubbling; glass layers for fixed positioning and z-index. |
| **Demonstrates Learning** | Shows elimination of mystery code through interactive understanding. | **PASS** | Explains the specific failure mode that occurs when `stopPropagation()` is omitted. |

---

*Authored by Srikant · FlyRank AI Internship Capstone · General AI Fluency Track (Week 6)*
