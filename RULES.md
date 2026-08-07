# ApnaTrip - Global Development Rules

Version: 1.0

These rules apply to EVERY page, component, feature, and screen unless explicitly overridden.

---

# 1. Project

Project Name:
ApnaTrip

Tech Stack:
- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Lucide Icons

Current Stage:
Frontend UI Design

Do NOT build backend functionality unless requested.

---

# 2. Design Philosophy

The design must feel like:

- Airbnb
- Apple
- Notion
- Linear
- Booking.com

NOT like:

- Dashboard templates
- Bootstrap admin panels
- Material UI demos
- Generic travel apps

The design language should be:

- Premium
- Modern
- Minimal
- Soft
- Clean
- Spacious

---

# 3. Mobile First

Every page MUST be designed for mobile first.

Design width:

390px

Approx height:

844px+

Think like an actual smartphone.

Never design tablet layouts.

Never create stretched layouts.

Never make elements tiny.

Everything should be thumb friendly.

---

# 4. Desktop Rules

Desktop is NOT a stretched mobile app.

Desktop should become a proper responsive website.

Examples:

Mobile

Navigation:
Bottom Navigation

Desktop

Navigation:
Top Navigation

Example:

Desktop

---------------------------------------------------

Logo

Home

Explore

Community

Trips

Profile

Search

Notifications

---------------------------------------------------

Desktop should use:

- Responsive grids
- Wider cards
- Proper spacing
- Sections
- Maximum width containers

Never place a tiny mobile screen in the center of desktop.

Never emulate a phone on desktop.

Desktop must feel like a modern website.

---

# 5. Page Width

Desktop

max-width:
1440px

Content:

1280px

Centered.

Mobile:

Full width.

---

# 6. Safe Area

DO NOT generate:

- iPhone status bar
- Battery
- Signal
- WiFi
- Time

The UI starts directly from the app header.

---

# 7. Navigation

Bottom navigation:

Home

Explore

My Trips

Community

Profile

Always visible unless specified.

Icons:

Lucide Icons

Rounded navigation.

Floating white background.

Shadow.

---

# 8. Header

Every page should include:

Logo

Page title

Notification icon

Message icon

unless told otherwise.

---

# 9. Border Radius

Cards:

24px

Buttons:

18px

Images:

22px

Inputs:

18px

Small chips:

999px

---

# 10. Shadows

Very soft shadows only.

No harsh shadows.

No dark borders.

---

# 11. Colors

Primary:

#FF4D6D

Background:

#F8F9FC

Cards:

White

Text:

#111827

Secondary:

#6B7280

Success:

#22C55E

Warning:

#F59E0B

Error:

#EF4444

---

# 12. Typography

Modern.

Bold headings.

Readable.

No decorative fonts.

Large titles.

Good spacing.

---

# 13. Images

Always use placeholders.

Never generate AI illustrations.

Use image placeholders.

Example:

Hero Image

Destination Image

Agency Image

Traveler Image

Story Cover

Gallery Image

Video Thumbnail

I will replace them later.

---

# 14. Icons

Use Lucide Icons only.

Consistent size.

Rounded.

Simple.

---

# 15. Animations

Subtle.

Fade

Slide

Scale

No excessive motion.

---

# 16. Components

Always reuse components.

Example:

Card

Button

Search

Filter Chip

Section Header

Destination Card

Agency Card

Story Card

Package Card

Traveler Card

Never redesign components on every page.

---

# 17. Spacing

Generous spacing.

Never overcrowd.

8pt grid system.

---

# 18. Forms

Rounded inputs.

Large touch targets.

Inline validation.

Simple.

---

# 19. Scroll

Pages should naturally scroll.

Never force everything into one screen.

Long pages are expected.

---

# 20. UI Quality

Every page should look production ready.

Not a wireframe.

Not a concept.

Not an admin dashboard.

---

# 21. Community Design

Feels like:

Instagram + Reddit + Polarsteps

Not Facebook.

---

# 22. Agency Marketplace

Feels premium.

Large cards.

Professional.

Trustworthy.

Agency branding should stand out.

---

# 23. Home

Purpose:

Discover

Not booking.

---

# 24. Explore

Purpose:

Inspiration

Discovery

Hidden Gems

Agencies

Community Picks

---

# 25. My Trips

Purpose:

Trip Management

Upcoming

Current

Past

Bookings

Documents

---

# 26. Community

Purpose:

Travel Stories

Posts

Traveler Connections

Travel Circles

Questions

Leaderboards

---

# 27. Profile

Purpose:

Traveler Identity

Passport

Achievements

Gallery

Posts

Reviews

Trips

---

# 28. Code Quality

Reusable components.

Clean folder structure.

No duplicate code.

TypeScript.

Readable.

---

# 29. Naming

Use descriptive names.

Example:

DestinationCard

AgencyCard

PackageCard

CommunityPost

TravelerProfile

NOT:

Card1

Card2

ComponentX

---

# 30. Important

Before generating ANY UI ask internally:

Is this production quality?

Would Airbnb ship this?

Would Apple approve this?

If the answer is no,

Improve it before generating.

---

# 31. Never Do

❌ Tablet UI

❌ Status Bar

❌ Fake Battery

❌ Fake Time

❌ Crowded UI

❌ Tiny Buttons

❌ Tiny Fonts

❌ Dark Dashboard Style

❌ Generic Bootstrap Layout

❌ Inconsistent Components

❌ Different Design Language Between Pages

---

# 32. Final Goal

The entire application should feel like one cohesive product.

Every page should look like it belongs to ApnaTrip.

A user should instantly recognize the design language across the entire application.

# 33. Consistency Rule

When generating a new page, always reference the existing Home page.

Maintain:
- Identical page width
- Identical header spacing
- Identical bottom navigation height
- Identical corner radius
- Identical shadows
- Identical typography scale
- Identical card spacing
- Identical color palette

Never redesign existing components unless explicitly requested.