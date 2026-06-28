# MASTER_PROMPT.md

# Project: **When You Need Me**

Version: 1.0

---

# 1. Overview

You are an expert frontend engineer, UI/UX designer, motion designer, illustrator, interaction designer, accessibility specialist and software architect.

Your goal is **NOT** to build a website.

Your goal is to build a place.

A place someone comes back to.

A place that quietly waits.

A place that feels handcrafted.

The website is a birthday gift made for one person.

Every decision should reinforce one thought:

> Someone sat down and made this especially for me.

Never make the website feel like a template.

Never make it feel AI generated.

Never make it feel like a commercial product.

It should feel handmade.

---

# 2. Core Philosophy

The website should feel like discovering a small wooden desk tucked beside a rainy window.

On the desk are handwritten envelopes.

Each envelope contains a tiny letter.

Nothing screams for attention.

Nothing flashes.

Nothing tries to impress.

Instead...

Everything quietly invites curiosity.

The website should communicate comfort before romance.

Emotion before technology.

Craftsmanship before features.

---

# 3. Emotional Direction

The order of emotions is extremely important.

Prioritize these emotions in this order.

1. Comfort
2. Safety
3. Warmth
4. Curiosity
5. Peace
6. Joy
7. Nostalgia
8. Love

Love should naturally emerge from everything else.

Never force romance.

---

# 4. Story

The birthday is merely how she receives this gift.

The website is not about birthdays.

The website is a place she can revisit whenever life happens.

If she is happy...

There is a letter.

If she is stressed...

There is a letter.

If she misses him...

There is a letter.

If she succeeds...

There is a letter.

If she cries...

There is a letter.

If she is angry with him...

There is even a letter.

The website quietly says:

> "Whenever you need me, there is already something waiting for you."

That message should never be explicitly written everywhere.

It should simply be felt.

---

# 5. Design Language

Avoid:

* Bright pink
* Valentine's Day themes
* Heart explosions
* Glitter
* Neon
* Loud gradients
* Generic romance UI

Instead use

Warm paper

Wood

Ink

Wax

Postage

Old stationery

Books

Rain

Plants

Tea

Cozy lighting

Soft shadows

Natural imperfections

---

# 6. Color Palette

Primary Background

Warm Cream

Secondary Background

Soft Beige

Accent

Dusty Sage

Secondary Accent

Muted Terracotta

Ink

Warm Charcoal

Highlight

Dusty Blue

Interactive Highlight

Golden Amber

All colors should be muted.

Nothing should feel saturated.

---

# 7. Typography

Three fonts maximum.

Heading

A tasteful handwritten font.

Used sparingly.

Body

Elegant serif.

Long letters should be comfortable to read.

Interface

Rounded modern sans serif.

Readable.

Minimal.

---

# 8. General Feel

The website should feel like

50% storybook

20% wooden writing desk

15% cozy reading nook

10% magical realism

5% birthday gift

If it feels like a birthday website...

It has failed.

---

# 9. Website Title

When You Need Me

Subtitle

A small collection of letters.

For every version of you.

Keep the subtitle subtle.

---

# 10. Landing Experience

No splash screen.

Instead create an experience.

The page starts empty.

Warm paper slowly fades in.

Soft paper texture appears.

Tiny floating dust particles become visible.

A sealed envelope gently falls onto the desk.

The impact creates a tiny puff of paper dust.

The wax seal catches light.

The envelope slowly opens.

A folded letter rises.

Ink begins writing.

"When You Need Me"

The handwriting animation should look authentic.

After writing finishes...

The desk slowly appears.

Ambient doodles fade into existence.

The envelopes are revealed.

Total duration:

4–6 seconds.

Must be skippable.

---

# 11. Cursor

The cursor should never feel like a normal pointer.

Create a custom cursor.

Possible inspirations:

A fountain pen nib.

A folded envelope.

A tiny feather quill.

The cursor should react.

Hover

Grow slightly.

Rotate.

Glow softly.

Click

Compress.

Tiny sparkle.

Release.

Cursor movement should feel smooth.

Not laggy.

---

# 12. Background

Never static.

Always alive.

Very subtle.

Examples:

Dust floating.

Leaves drifting.

Stars twinkling.

Paper scraps moving slightly.

Soft light changing.

Window glow changing with time.

Everything extremely slow.

Almost unnoticeable.

---

# 13. Doodles

Generate original hand drawn doodles.

Do NOT use stock illustrations.

Possible doodles

Tiny flowers

Leaves

Cats

Bears

Rabbits

Birds

Tea cups

Books

Clouds

Stars

Moon

Mushrooms

Postboxes

Envelopes

Lanterns

Pencils

Paper clips

Pressed flowers

Branches

Tiny houses

The doodles should look like they were drawn in the margins of a notebook.

Use imperfect lines.

Slight wobble.

Natural variation.

---

# 14. Ambient Life

Every few minutes...

Something tiny happens.

A flower blooms.

A bird hops.

Steam rises from a teacup.

A paper airplane flies by.

A cat stretches.

A rabbit blinks.

A star twinkles.

A leaf lands on an envelope.

None of these should distract.

They simply reward spending time.

---

# 15. Audio

Muted by default.

Optional.

Rain

Cafe ambience

Fireplace

Soft piano

Birds

Never autoplay with sound.

Always respect browser autoplay policies.

---

# 16. Envelope Philosophy

The envelopes are the stars of the website.

They should never appear in a rigid grid.

Imagine someone gently placing envelopes on a desk over time.

Every envelope has

Different rotation

Different shadow

Different stamp

Different wax seal

Different handwriting

Different paper tone

Tiny imperfections

No two envelopes should ever feel identical.

The desk should look intentionally imperfect, like it has been lovingly arranged by hand rather than generated by a computer.

Hovering over one envelope should create a subtle chain reaction: nearby envelopes shift ever so slightly, as if your hand brushed against them while reaching for the one you wanted.

This tiny detail should reinforce the illusion that these are real, physical objects resting on a desk—not flat UI cards on a webpage.

---

# 17. Interaction Philosophy

Every interaction should have weight.

Nothing should happen instantly.

Everything should ease naturally.

Opening an envelope should feel like opening a real envelope.

Closing it should feel equally satisfying.

The animations should invite users to slow down rather than rush.

Never sacrifice this feeling for speed.

Fast is good.

Intentional is better.

---

# End of Part 1

# MASTER_PROMPT.md

# Project: **When You Need Me**

# PART 2 — Website Architecture & Technical Specification

---

# 18. Technical Goal

The project must be developed as a modern, responsive web application.

Primary goals:

* Extremely smooth
* Beautiful
* Highly interactive
* Lightweight
* Accessible
* Easy to expand
* Easy to maintain

This project will eventually contain a large number of letters.

The architecture must support growth without requiring UI modifications.

Never hardcode letters into React components.

Letters are data.

The interface is simply a beautiful way to discover them.

---

# 19. Technology Stack

Preferred Stack

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* GSAP (only where necessary)
* Markdown Rendering
* Local Storage

No backend.

No authentication.

No databases.

Everything should work as a completely static website.

Deployable to

* Cloudflare Pages
* Vercel
* Netlify

without modification.

---

# 20. Folder Structure

Design the project to scale elegantly.

```
src/
│
├── app/
│
├── components/
│   ├── desk/
│   ├── envelope/
│   ├── letter/
│   ├── doodles/
│   ├── cursor/
│   ├── loading/
│   ├── ambience/
│   ├── audio/
│   ├── transitions/
│   ├── typography/
│   └── ui/
│
├── animations/
│
├── hooks/
│
├── context/
│
├── utils/
│
├── lib/
│
├── assets/
│
├── styles/
│
├── content/
│   ├── index.json
│   └── letters/
│
└── types/
```

Everything should have a clear purpose.

Never create large miscellaneous folders.

---

# 21. Letter System

The letters are the heart of the application.

Treat them as content.

Not components.

Each letter should exist as an individual markdown file.

Example

```
letters/

birthday.md

sad.md

miss-me.md

lonely.md

angry.md

proud.md

sleep.md

future.md

...
```

This allows unlimited expansion.

---

# 22. Letter Metadata

Every letter is described inside

index.json

Example

```json
{
"id":"sad",

"title":"Open When You're Sad",

"file":"sad.md",

"stamp":"moon",

"seal":"navy",

"rotation":-6,

"paper":"cream",

"opened":false,

"category":"comfort"
}
```

The UI should generate itself from this file.

Never manually place envelopes.

---

# 23. Random Natural Placement

The desk should never look generated.

Envelopes should appear naturally scattered.

However—

They must not overlap in frustrating ways.

Design an intelligent placement algorithm.

Goals

Looks handmade.

No obvious grid.

Balanced spacing.

Natural randomness.

Readable.

Works on every screen.

The AI should simulate how someone would casually place envelopes across a wooden desk.

---

# 24. Envelope Variations

Generate many unique combinations.

Paper colors.

Wax seal colors.

Postage stamps.

Paper sizes.

Fold marks.

Handwriting styles.

Coffee stains.

Pressed flowers.

Ribbon pieces.

Tiny tape.

Corners slightly bent.

Different paper textures.

Every envelope should feel unique.

---

# 25. Hover Interaction

Hover should create delight.

Envelope

Lifts.

Shadow grows.

Nearby envelopes move slightly.

Tiny paper rustle.

Wax seal catches light.

Handwritten title sharpens.

Cursor reacts.

Animation duration

300–450ms

No sudden movement.

---

# 26. Click Interaction

Clicking should feel tactile.

Sequence

Cursor presses.

Envelope compresses.

Wax seal cracks.

Flap lifts.

Paper slides upward.

Letter unfolds.

Desk background subtly blurs.

Reading mode begins.

Everything should use realistic easing.

Never linear animations.

---

# 27. Closing Interaction

Reverse the experience.

Letter folds.

Slides inside.

Envelope closes.

Desk regains focus.

Envelope returns gently.

No popping.

No disappearing.

---

# 28. Reading Mode

Reading mode should still feel connected to the desk.

Avoid fullscreen modals.

Instead

The desk softly fades into the background.

The selected envelope remains visible.

The opened letter unfolds from that exact envelope.

This preserves spatial continuity.

---

# 29. Opened Letters

Opened letters must visually evolve.

Examples

Broken wax seal.

Letter sticking out.

Different shadow.

Softer paper.

Fold marks.

Slightly faded envelope.

Small "opened" ribbon.

Never simply display a checkmark.

The desk should visually tell the story.

---

# 30. Persistence

Opened letters should remain opened.

Use browser local storage.

Never require login.

Returning visitors should find the desk exactly as they left it.

The website should feel remembered.

---

# 31. Future Expansion

Adding a new letter should require only

1.

Create markdown file.

2.

Add metadata to index.json.

Nothing else.

No routing changes.

No UI edits.

No component changes.

---

# 32. Markdown Rendering

Support

Headings

Paragraphs

Lists

Italic

Bold

Horizontal rules

Blockquotes

Small handwritten notes

Keep typography beautiful.

Never expose raw markdown.

---

# 33. Letter Length

Letters are intentionally short.

Usually

100–350 words.

Some may only contain

30 words.

Some may contain

500.

The design must adapt gracefully.

---

# 34. Letter Categories

Categories exist only for organization.

Examples

Comfort

Celebration

Memories

Future

Sleep

Lonely

Motivation

Forgiveness

Birthday

Funny

Love

Hope

These categories should not dominate the UI.

---

# 35. Search

No search bar.

The experience should encourage browsing.

Discovery is intentional.

---

# 36. Navigation

Avoid traditional navigation.

No navbar.

No dashboard.

No sidebar.

The desk itself is navigation.

The envelopes are navigation.

---

# 37. Mobile Experience

Desktop

Feels like sitting at a desk.

Tablet

Feels like sitting beside the desk.

Mobile

Feels like holding a journal.

Do not simply shrink desktop.

Design separately.

---

# 38. Responsive Behaviour

Envelope placement should intelligently adapt.

No overlaps.

No clipping.

No horizontal scrolling.

Maintain the illusion of naturally scattered letters across every device.

---

# 39. Performance Goals

Initial load under

2 seconds.

Animations

60 FPS.

Images

Optimized.

SVG preferred.

Lazy load where appropriate.

Avoid unnecessary JavaScript.

The experience should feel effortless even on mid-range mobile devices.

---

# 40. Accessibility

Keyboard navigation.

Reduced motion support.

Screen reader labels.

Sufficient color contrast.

Readable typography.

Focus indicators.

The website should be beautiful for everyone.

---

# 41. Implementation Philosophy

Never choose convenience over craftsmanship.

If a feature can be implemented in a way that feels more thoughtful, choose that approach even if it requires additional effort.

Every animation, transition, shadow, and interaction should contribute to the illusion that these are real envelopes resting on a real desk.

The user should stop noticing the technology and start noticing the feeling.

That is the standard this project should strive to achieve.

---

# END OF PART 2

# MASTER_PROMPT.md

# PART 3 — Motion Design Bible

---

# 42. Motion Philosophy

Motion is not decoration.

Motion is communication.

Every movement should explain something.

Every transition should feel physical.

Every animation should have intention.

The user should subconsciously understand what is happening without ever needing to think about it.

Never animate simply because something can move.

Animate because movement reinforces the illusion that these are real objects.

---

# 43. Physical World Rules

Pretend this website exists in a tiny physical world.

Everything obeys simple physical principles.

Objects have:

Weight

Momentum

Softness

Elasticity

Friction

Gravity

No object should instantly appear.

No object should instantly disappear.

Nothing should teleport.

Everything should move from somewhere to somewhere.

---

# 44. Animation Personality

If this website were a person, its movements would feel

Gentle

Patient

Confident

Warm

Curious

Never rushed.

Never robotic.

Never flashy.

---

# 45. Global Motion Rules

Every animation should use easing.

Avoid linear motion.

Movement should accelerate naturally.

Movement should decelerate naturally.

Objects should feel like they possess mass.

---

# 46. Motion Duration Guide

Micro interactions

100–180ms

Hover interactions

250–350ms

Envelope movement

350–500ms

Opening envelope

700–1000ms

Letter unfolding

900–1300ms

Page transitions

500–900ms

Ambient events

3–20 seconds

Nothing should ever feel hurried.

---

# 47. Staggering

When multiple elements appear

Never reveal everything simultaneously.

Instead

Element 1

pause

Element 2

pause

Element 3

pause

Tiny delays create personality.

---

# 48. Hover Principles

Hover should feel like curiosity.

Not selection.

The envelope notices your attention.

It responds.

It does not jump.

---

# 49. Hover Animation

Envelope

Lifts

3–8 pixels

Rotation straightens slightly

Shadow softens

Paper texture becomes slightly brighter

Wax seal catches light

Nearby envelopes subtly react

Cursor acknowledges interaction

---

# 50. Click Animation

Clicking should feel satisfying.

Sequence

Envelope compresses slightly

Tiny pause

Wax seal cracks

Flap loosens

Flap opens

Letter begins sliding upward

Letter unfolds

Reading mode begins

Everything should feel continuous.

---

# 51. Letter Extraction

The paper should never suddenly appear.

Imagine pulling paper from an actual envelope.

The paper catches slightly on the flap.

It bends naturally.

Then slowly unfolds.

Corners relax.

Creases flatten.

Only then does the writing appear.

---

# 52. Ink Appearance

The text should not instantly exist.

Instead

The ink softly fades onto the paper.

Optional enhancement:

Headings appear as though being written by a fountain pen.

Body text gently fades line by line.

Never imitate a typing animation.

It should feel handwritten, not typed.

---

# 53. Closing Letter

Reverse every stage.

Ink fades slightly.

Paper folds.

Creases return.

Letter slides down.

Envelope closes.

Wax seal gently reforms visually (without implying it's physically re-sealed).

Desk regains focus.

Everything should end exactly where it started.

---

# 54. Shadows

Shadows are part of the storytelling.

Use multiple soft shadows instead of one harsh shadow.

When an envelope lifts

Shadow becomes

Larger

Softer

Lighter

Never darker.

---

# 55. Rotation

Perfect alignment feels fake.

Every object should have tiny rotational imperfections.

Usually

-7°

to

+7°

Never random every render.

Generate once.

Persist.

---

# 56. Scale

Tiny scale changes communicate touch.

Hover

101%

Click

98%

Release

100%

These differences should be barely noticeable.

---

# 57. Scroll Behaviour

Scrolling should feel smooth.

Never abrupt.

Parallax should exist.

But be subtle.

Objects farther away move less.

Foreground doodles move slightly more.

Never create motion sickness.

---

# 58. Parallax

Three depth layers

Background

Desk

Foreground

Every layer reacts slightly differently.

Very small movements.

Enough to create depth.

Not enough to distract.

---

# 59. Cursor Motion

Cursor should glide.

Tiny trailing effect.

Soft interpolation.

No long delay.

No exaggerated lag.

The cursor should feel elegant.

---

# 60. Cursor States

Default

Hover

Clickable

Dragging

Reading

Disabled

Each state should have its own tiny personality.

Never dramatic.

---

# 61. Focus

When reading a letter

Everything else gently loses emphasis.

Not blur alone.

Reduce saturation slightly.

Lower movement.

Lower brightness.

Reduce ambient distractions.

The world quietly lets the letter become the center of attention.

---

# 62. Idle Motion

Nothing should remain perfectly still.

Every object has microscopic movement.

Paper breathes.

Leaves sway.

Dust drifts.

Lamp glow fluctuates.

These movements should be almost imperceptible.

---

# 63. Ambient Timing

Avoid loops that feel repetitive.

Instead

Use randomized intervals.

Events should feel accidental.

Not programmed.

---

# 64. Transitions

Never fade to black.

Never wipe.

Never use generic page transitions.

Every transition should originate from the desk.

The desk is always home.

---

# 65. Motion Consistency

Once a motion language is chosen

Use it everywhere.

If envelopes open slowly

All envelopes open slowly.

If paper unfolds elegantly

Every paper unfolds elegantly.

Consistency creates trust.

---

# 66. Animation Quality Bar

Before shipping

Watch the website with all text hidden.

Only animations visible.

If the website still feels comforting

The motion system is successful.

If it feels busy

Reduce animations.

If it feels empty

Increase subtle ambient life.

---

# 67. Motion Principle

Every animation should answer this question:

"If this object existed in real life, how would it naturally move?"

If the answer feels unrealistic

Redesign the animation.

---

# END OF PART 3

# MASTER_PROMPT.md

# PART 4 — Components & Interactions

---

# 68. Website Structure

The website should consist of only a few core experiences.

* Landing Experience
* Letter Desk
* Letter Reader
* Loading States
* Error States (minimal)

Avoid unnecessary pages.

---

# 69. Landing Experience

The first visit should feel special.

Sequence:

1. Soft fade in from paper texture.
2. Envelope gently lands on the desk.
3. Ink writes the title **"When You Need Me"**.
4. Subtitle fades in.
5. Envelope opens.
6. Camera subtly reveals the desk full of letters.

Allow users to skip after 2 seconds.

---

# 70. Letter Desk

This is the main page.

Requirements:

* No grids.
* No rows.
* No cards.
* No list view.

The desk itself is the navigation.

Letters should feel casually placed by hand.

Each envelope should have:

* Unique rotation
* Unique paper tone
* Unique wax seal
* Unique stamp
* Slightly different shadow
* Slightly different size

The arrangement should be carefully balanced—not messy, not symmetrical.

---

# 71. Envelope Component

Every envelope is unique.

### Hover

* Lift 4–8px
* Rotate slightly toward the cursor
* Shadow deepens
* Nearby envelopes shift subtly
* Wax seal catches light
* Cursor changes state

### Click

* Small compression
* Wax seal cracks
* Flap opens
* Letter slides out
* Reader opens

### Close

* Reverse every animation
* Return envelope to original position

---

# 72. Opened State

Opened envelopes should never look identical to unopened ones.

Visual indicators may include:

* Broken wax seal
* Letter slightly visible
* Fold marks
* Softer colors
* Pressed flower peeking out
* Small handwritten ✓ in the corner

Do not use badges or checkmarks from UI libraries.

The change should feel natural.

Persist this state using Local Storage.

---

# 73. Letter Reader

The letter should emerge from the selected envelope.

Do not open a generic modal.

The transition should preserve spatial continuity.

Requirements:

* Paper texture
* Comfortable reading width
* Elegant typography
* Large margins
* Responsive layout
* Easy close interaction

Support long and short letters equally well.

---

# 74. Cursor

Use a custom cursor.

Requirements:

* Smooth interpolation
* Slight scaling on hover
* Gentle click animation
* Context-aware states

Never become distracting.

Respect touch devices by disabling custom cursors.

---

# 75. Loading States

Never use spinners.

Instead, randomly display one of several handcrafted loading moments.

Examples:

* An envelope being stamped.
* A paper airplane gliding across the screen.
* A fountain pen finishing a handwritten line.
* A pressed flower gently falling onto the desk.

Each loading state should last only as long as necessary and transition seamlessly into the content.

---

# 76. Empty States

If there are no letters:

Display a small handwritten note instead of an empty page.

Example:

> "Looks like there aren't any letters here yet."

---

# 77. Error States

Keep them warm and minimal.

Avoid technical language.

Instead of:

"404"

Use something like:

> "This letter seems to have wandered off."

Provide a simple way back to the desk.

---

# 78. Animations

Animation Rules:

* Every movement should have easing.
* Avoid abrupt fades.
* Never teleport elements.
* Keep transitions under one second.
* Prioritize smoothness over complexity.

---

# 79. Data Structure

All letters should be generated from `index.json`.

Each letter should have:

* ID
* Title
* Markdown file path
* Stamp style
* Wax seal style
* Rotation
* Position
* Category
* Opened state

Adding a new letter should only require:

1. Create a Markdown file.
2. Add one entry to `index.json`.

No component changes should be necessary.

---

# 80. State Persistence

Store locally:

* Opened letters
* Last visited letter
* Landing animation seen (optional)

The desk should feel familiar when revisited.

---

# 81. Do NOT

* Do not use grids.
* Do not use cards.
* Do not use Material UI.
* Do not use Bootstrap.
* Do not use stock illustrations.
* Do not use generic Valentine's Day assets.
* Do not autoplay audio.
* Do not use loading spinners.
* Do not hardcode letter data.
* Do not randomly rearrange envelopes on every visit.
* Do not use flashy particle effects.
* Do not overwhelm the user with animations.

Less is more.

---

# END OF PART 4

# MASTER_PROMPT.md

# PART 5 — Art Direction & Living World

---

# 82. Art Direction

The website should look handcrafted.

Not cartoonish.

Not childish.

Not overly feminine.

Not minimalist.

The inspiration should be:

* A cozy stationery shop
* A wooden writing desk
* A well-loved journal
* A storybook
* A rainy afternoon
* Handwritten letters

Every asset should feel intentionally made.

---

# 83. Illustration Style

All illustrations should be AI-generated or custom-made in **one consistent style**.

Requirements:

* Thin hand-drawn outlines
* Soft watercolor fills
* Slight imperfections
* Muted colors
* Pencil sketch details
* Rounded shapes
* Cozy appearance

Never mix multiple illustration styles.

---

# 84. Desk

The desk is a character.

Requirements:

* Warm wooden texture
* Slight imperfections
* Visible wood grain
* Soft lighting
* Clean but lived-in

It should feel like someone actually sits here to write letters.

---

# 85. Paper

Every paper should be unique.

Include subtle variations such as:

* Different cream tones
* Fold lines
* Deckled edges
* Tiny wrinkles
* Slight texture
* Small ink imperfections

Never use perfectly flat white rectangles.

---

# 86. Wax Seals

Every envelope should have its own wax seal.

Examples:

* Flower
* Moon
* Leaf
* Star
* Feather
* Tiny bear
* Small bird

Generate multiple colors:

* Burgundy
* Forest Green
* Navy
* Terracotta
* Brown
* Deep Purple

No bright colors.

---

# 87. Stamps

Every letter should have a unique postage stamp.

Ideas:

* Mountains
* Rain clouds
* Tiny rabbit
* Cat
* Moon
* Lighthouse
* Wildflowers
* Tea cup
* Library
* Forest
* Small cottage

These don't need to represent real places—they're decorative and help each envelope feel unique.

---

# 88. Doodles

Scatter small doodles naturally around the desk and interface.

Examples:

* Leaves
* Stars
* Tiny flowers
* Mushrooms
* Teacups
* Books
* Envelopes
* Lanterns
* Branches
* Feather pens
* Butterflies
* Birds
* Sleeping cat
* Rabbit
* Bear
* Paper airplanes

Keep them subtle.

They should decorate the experience, not dominate it.

---

# 89. Living Details

Small details make the website feel alive.

Examples:

* Dust particles drifting.
* A leaf slowly falling.
* Steam rising from a cup.
* A butterfly crossing the page.
* A bird landing briefly before flying away.
* A paper airplane gliding across the desk.
* A cat blinking or stretching occasionally.
* A lantern flickering gently.

These events should happen infrequently and at random intervals.

---

# 90. Lighting

Lighting should always feel soft.

Avoid harsh contrast.

Use:

* Warm sunlight
* Gentle shadows
* Ambient glow
* Soft highlights

Nothing should appear artificial.

---

# 91. Time of Day

The website should adapt to the visitor's local time.

Morning:

* Brighter lighting
* Warm sunshine

Afternoon:

* Neutral daylight

Evening:

* Warm golden tones
* Slightly deeper shadows

Night:

* Moonlight
* Warm desk lamp glow
* More visible stars

The transition should be subtle and automatic.

---

# 92. Seasonal Details (Optional)

If implemented:

Spring:

* Small blossoms

Summer:

* Bright leaves

Autumn:

* Falling leaves

Winter:

* Gentle snow outside the window

Never let seasonal decorations overwhelm the core experience.

---

# 93. Color Rules

Prefer:

* Cream
* Beige
* Walnut
* Sage
* Dusty Blue
* Terracotta
* Olive
* Warm Gray

Avoid:

* Neon
* Pure black
* Pure white
* Hot pink
* Bright red
* Electric blue

---

# 94. Shadows

Use layered soft shadows.

Objects should appear to rest naturally on the desk.

Hovering should increase depth naturally.

---

# 95. Decorative Objects

The desk may contain subtle decorative objects such as:

* Fountain pen
* Ink bottle
* Paper clips
* Bookmark
* Pressed flowers
* Small plant
* Stack of books
* Candle
* Bookmark ribbon

These objects should never interfere with the letters.

---

# 96. Handcrafted Imperfection

Nothing should be perfectly aligned.

Examples:

* Slightly uneven handwriting
* Tiny paper rotation
* Irregular ink density
* Small paper edge imperfections
* Slight stamp misalignment

These imperfections should be intentional and consistent.

---

# 97. Emotional Consistency

Every visual element should reinforce:

Comfort.

Warmth.

Safety.

Care.

Nothing should exist purely because it looks cool.

Every decoration should contribute to the atmosphere.

---

# 98. Final Artistic Goal

The user should never think:

"This is a beautiful website."

Instead, the first thought should be:

> "He really spent time making this for me."

If the art direction supports that feeling, it has succeeded.

---

# END OF PART 5

# MASTER_PROMPT.md

# PART 6 — Implementation Rules & Acceptance Criteria

---

# 99. Backend

This project must **NOT** use any backend.

Do not use:

* Databases
* Authentication
* APIs
* CMS
* Cloud storage
* User accounts
* Server actions
* Analytics services

Everything should work as a completely static website.

---

# 100. Persistence

Use Local Storage only.

Persist:

* Opened letters
* First visit flag
* Last opened letter
* Optional "opened on" date

Never require internet after the website loads.

---

# 101. Letter Content

Letter content is stored separately from the application.

Every letter is an individual Markdown file.

The UI must automatically discover and render letters using `index.json`.

Never hardcode letter text.

---

# 102. Scalability

The website should support:

* 10 letters
* 50 letters
* 100 letters
* 200+ letters

without requiring UI redesign.

The desk should intelligently reposition envelopes as the collection grows.

---

# 103. Performance

Requirements:

* Fast first load
* Lazy load heavy assets
* Optimize SVGs
* Compress textures
* Avoid unnecessary re-renders
* Maintain smooth animations

Target 60 FPS on modern devices.

---

# 104. Browser Support

Support the latest versions of:

* Chrome
* Edge
* Firefox
* Safari

Desktop and mobile.

---

# 105. Mobile Experience

This website must be designed mobile-first.

Requirements:

* Touch-friendly interactions
* Responsive typography
* No hover-only functionality
* Smooth scrolling
* Comfortable reading width

Desktop should enhance the experience rather than redefine it.

---

# 106. Accessibility

Include:

* Keyboard navigation
* Visible focus states
* Alt text where appropriate
* Reduced motion support
* Semantic HTML
* Good contrast ratios

Beauty should never come at the cost of usability.

---

# 107. Code Quality

The codebase should be:

* Modular
* Typed
* Readable
* Reusable
* Well-commented where necessary

Avoid duplication.

Keep components focused on a single responsibility.

---

# 108. AI Asset Generation

Any generated assets should follow one consistent visual style.

This includes:

* Doodles
* Wax seals
* Stamps
* Decorative elements
* Icons

The user should never notice different art styles.

---

# 109. QA Checklist

Before considering the project complete, verify:

* Every envelope has unique styling.
* Every animation is smooth.
* No layout breaks on common screen sizes.
* Opened letters persist after refresh.
* New letters can be added without code changes.
* The website works without a backend.
* The site feels cohesive and handcrafted.
* Performance remains smooth.

---

# 110. Future Expansion

The architecture should allow future additions such as:

* More letters
* Additional doodles
* New envelope styles
* Seasonal themes
* Extra decorative desk items

These additions should not require major refactoring.

---

# 111. Do NOT

Do NOT:

* Use generic templates.
* Use stock illustrations.
* Use generic Valentine's Day imagery.
* Use Bootstrap.
* Use Material UI.
* Use loading spinners.
* Use cookie banners.
* Use pop-ups.
* Require login.
* Add unnecessary settings pages.
* Introduce backend dependencies.
* Sacrifice craftsmanship for speed.

---

# 112. Definition of Done

The project is complete when:

* The website feels handcrafted.
* The desk feels like a real place.
* Every interaction is intentional.
* Letters are the clear focus.
* The UI remains clean and uncluttered.
* The experience is memorable without being overwhelming.
* The codebase is easy to maintain and extend.

---

# 113. Final Goal

Do not build a website that impresses with complexity.

Build a place that feels personal.

The visitor should leave believing:

> "Someone spent a lot of time making this just for me."

If the technology fades into the background and the emotions remain, the project has succeeded.

# END OF MASTER PROMPT
