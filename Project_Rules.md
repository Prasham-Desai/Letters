# PROJECT_RULES.md

# Project Rules — When You Need Me

These rules are **non-negotiable**. If any rule conflicts with implementation convenience, the rule takes priority.

---

# 1. General Philosophy

* This is **not** a commercial website.
* This is **not** a portfolio.
* This is **not** a product.
* This is a handcrafted digital gift.

Every decision should reinforce that feeling.

---

# 2. Technology

The website must be:

* Fully static
* Deployable to Cloudflare Pages
* No backend
* No authentication
* No API dependencies
* No databases
* No server-side persistence

Use browser Local Storage only where persistence is required.

---

# 3. Content

Letters are content.

They are **never** hardcoded into React components.

Each letter must exist as an individual Markdown file.

All metadata must come from `index.json`.

Adding a new letter should require only:

1. Create a new Markdown file.
2. Add one object to `index.json`.

Nothing else.

---

# 4. Design

The website should feel:

* Warm
* Cozy
* Calm
* Handmade
* Personal

It should **never** feel:

* Corporate
* Flashy
* Minimalist to the point of emptiness
* Overly feminine
* Like a Valentine's Day template
* Like an admin dashboard

---

# 5. Art Style

All illustrations must belong to one cohesive visual language.

Generate custom assets when needed.

Do not mix styles.

Avoid stock assets whenever possible.

Preferred style:

* Hand-drawn
* Watercolor
* Pencil sketch
* Soft muted colors
* Rounded shapes
* Storybook quality

---

# 6. Envelopes

The envelopes are the primary navigation.

Never replace them with:

* Cards
* Lists
* Tables
* Dashboards
* Grid systems

The envelopes must always feel like physical objects resting on a desk.

---

# 7. Animations

Animations must feel:

* Soft
* Intentional
* Physical

Avoid:

* Flashy effects
* Bouncy UI
* Excessive particles
* Abrupt transitions

Movement should communicate craftsmanship rather than spectacle.

---

# 8. Performance

Performance is part of the experience.

Requirements:

* Smooth scrolling
* Responsive interactions
* 60 FPS where practical
* Optimized assets
* Lazy loading when appropriate

Never sacrifice responsiveness for visual effects.

---

# 9. Accessibility

Support:

* Keyboard navigation
* Reduced motion
* Screen readers
* Good color contrast
* Responsive layouts

Beauty should never reduce usability.

---

# 10. Mobile

Desktop is not the primary experience.

The website must feel equally handcrafted on:

* Mobile
* Tablet
* Desktop

No desktop-first assumptions.

---

# 11. Code Quality

Code must be:

* Modular
* Typed
* Reusable
* Maintainable
* Easy to understand

Avoid:

* Duplicate logic
* Massive components
* Magic numbers
* Unused dependencies

---

# 12. Asset Rules

Generate assets that match the project's art direction.

This includes:

* Doodles
* Wax seals
* Stamps
* Decorative objects
* Icons

Everything should feel like it belongs to the same world.

---

# 13. Persistence

Only use Local Storage.

Persist:

* Opened letters
* Optional opened date
* Landing animation completed
* User preferences (if any)

Do not store personal data.

---

# 14. Letter Experience

Reading a letter should always be the emotional focus.

The UI should never compete with the content.

If an animation distracts from the letter, simplify the animation.

---

# 15. Living World

Ambient details should exist to reward attention.

Examples include:

* Floating dust
* Falling leaves
* Small doodle animations
* Gentle lighting changes

These effects must remain subtle.

---

# 16. AI Behaviour

When making implementation decisions:

Prefer:

* Craftsmanship
* Readability
* Maintainability
* Emotional impact

Over:

* Shortcuts
* Generic components
* Boilerplate solutions

---

# 17. Things To Avoid

Never use:

* Bootstrap
* Material UI
* Template themes
* Generic icon packs as the primary visual identity
* Loud gradients
* Neon colors
* Random AI placeholder text
* Stock Valentine's artwork
* Generic envelope SVGs copied from the internet

---

# 18. Acceptance Test

Before considering the project complete, verify:

* The website feels handcrafted.
* Every envelope feels unique.
* The desk feels alive without being distracting.
* The UI is intuitive.
* New letters can be added without modifying the UI.
* The website works entirely without a backend.
* All interactions are smooth.
* The visual style is consistent.
* Mobile experience is polished.
* The experience remains memorable after multiple visits.

---

# 19. Final Principle

If a visitor's first reaction is:

> "This is a nice website."

keep improving.

If their first reaction is:

> "He actually made this for me."

the project has achieved its purpose.

---

# 20. Golden Rule

Every line of code, every animation, every doodle, every shadow, every envelope, and every interaction should quietly answer one question:

**"Does this make the experience feel more personal?"**

If the answer is **no**, redesign it.
