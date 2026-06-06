# 3D Immersive Globe Portfolio — Redesign Plan

## Overview

Redesign the portfolio from a traditional scroll-based section layout into a **full-viewport immersive 3D experience** centered around an interactive Earth globe. The globe is the primary navigation mechanism — scrolling rotates it, markers are projects, and all content is delivered through floating overlays on a dark background.

---

## Architecture

### Current State
- Traditional multi-section page (Hero → About → Projects → Globe → Experience → Skills → Contact)
- Globe exists as one section within the scroll flow
- Light warm color scheme (warm whites, burgundy accent)
- Sections scroll normally, globe rotates on scroll within its section only

### Target State
- **Single full-viewport canvas** — no traditional scrolling
- **Globe is always visible** as the central, full-background element
- **Scroll hijacking** — wheel/trackpad events rotate the globe instead of scrolling the page
- **Project markers** on the globe surface (lat/lng already exist in data)
- **Click/hover markers** → floating detail cards overlay the globe
- **Navigation links** → fly the globe to the corresponding project marker
- **Dark theme** — deep dark background, cyan/teal accent glows

---

## Detailed Component Plan

### 1. Theme Overhaul — `app/globals.css`

Invert all color tokens to a dark palette:

| Token | Light (current) | Dark (new) |
|---|---|---|
| `--background` | `oklch(0.985 ...)` | `oklch(0.11 0.01 270)` — near-black with blue tint |
| `--foreground` | `oklch(0.18 ...)` | `oklch(0.93 0.01 270)` — near-white |
| `--card` | light | `oklch(0.15 0.01 270)` — dark card |
| `--accent` | burgundy `oklch(0.42 0.13 25)` | cyan/teal `oklch(0.72 0.14 195)` |
| All borders, muted, etc. | light variants | dark variants with subtle opacity |

- Change `::selection` color to cyan tint
- Ensure `.section-rule` borders use subtle dark-mode colors
- Keep animation keyframes

### 2. Root Layout — `app/layout.tsx`

- Remove `<Nav>` from the layout (nav moves to a floating overlay)
- Keep `<Footer>` as a minimal overlay at the bottom
- Set body to `overflow: hidden` to prevent default scrolling
- Add a dark background class

### 3. Main Page — `app/page.tsx` (Major Rewrite)

Replace multi-section layout with the immersive shell:

```
<div className="fixed inset-0">
  <StarField />
  <DynamicGlobe ... />
  <OverlayNav />
  <ContentPanel />
  <HeroOverlay />
  <SectionNavDots />
</div>
```

### 4. Globe — `components/3d/globe.tsx` (Major Rewrite)

**Visual changes:**
- RADIUS increases to fill more of the viewport (~2.0)
- Sphere material: dark navy wireframe + glowing cyan dot matrix
- Outer atmosphere: subtle cyan/teal glow ring (Fresnel shader or meshBasicMaterial with opacity gradient)
- Equator ring: cyan color instead of burgundy
- Marker dots: bright cyan with glow (emissive material + point light)
- Active marker: larger, pulsing, bright white/cyan with beam line from surface

**Interaction changes:**
- **Scroll-driven rotation**: wheel events control globe Y-axis rotation. Each "stop" maps to rotating the globe to face a project marker. Smooth lerp between stops.
- **Drag-to-rotate**: Allow mouse drag for manual globe rotation (pointer events in R3F)
- **Click marker**: onSelect triggers the content panel to slide in
- **Hover marker**: cursor change + subtle scale up

**Scroll-stop model:**
- Stop 0: Initial view (globe centered, hero text visible)
- Stop 1–N: Each project marker — globe rotates to face that project
- Bonus stops: About, Experience, Skills, Contact content panels
- The scroll position maps to a float index that smoothly interpolates between stops

### 5. New Component: `components/scroll-controller.tsx`

Intercepts all wheel/trackpad events on the document, converts to a "progress" value (0 to totalStops - 1), and provides:
- `progress`: float value for current scroll position
- `activeStop`: integer for the nearest stop
- `scrollToStop(n)`: imperative method to animate to a specific stop

Key behaviors:
- `e.preventDefault()` on wheel events to prevent page scroll
- Uses `requestAnimationFrame` for smooth updates
- Applies damping/lerp so the globe animates smoothly between stops
- Handles keyboard navigation (arrow keys)

### 6. New Component: `components/star-field.tsx`

R3F particle system:
- Random star positions in a large sphere around the camera
- Gentle slow rotation for subtle life
- Small white dots with varying opacity
- No heavy computation — simple Points geometry

### 7. New Component: `components/overlay-nav.tsx`

Floating top navigation overlay:
- Semi-transparent dark backdrop-blur bar
- Name on left, nav links on right
- Clicking a link calls scrollToStop(n) to fly the globe
- Links: About, Projects, Experience, Skills, Contact
- Minimal, glassmorphism style

### 8. New Component: `components/content-panel.tsx`

Sliding overlay panel for displaying project/section details:
- Positioned at the right side of the viewport on desktop, bottom on mobile
- Glassmorphism card with dark semi-transparent background + blur
- Animated slide-in/out (transform + opacity transition)
- Shows project details (title, location, description, stack, links) or section content
- Close button to dismiss and show hero overlay again
- Mobile responsive: full-width bottom sheet

### 9. New Component: `components/hero-overlay.tsx`

Initial intro overlay:
- Shows on load when no project/section is active
- Name, role, tagline — centered on top of the globe
- Fades out when a project/section is activated
- Returns when content panel is closed

### 10. New Component: `components/section-nav-dots.tsx`

Side navigation dots (vertical scroll indicator):
- Fixed right side of viewport
- Small dots for each stop (Hero, Project 1-4, Experience, Skills, Contact)
- Active dot highlighted (cyan)
- Clicking a dot navigates to that stop

### 11. Remove `components/sections/globe-section.tsx`

Absorbed into immersive layout + content panel.

### 12. Updated Other Sections

These sections no longer render as traditional page sections. Their **data** powers the content panel:

- `about.tsx` → content inside ContentPanel for "About" stop
- `experience.tsx` → content inside ContentPanel for "Experience" stop
- `skills.tsx` → content inside ContentPanel for "Skills" stop
- `contact.tsx` → content inside ContentPanel for "Contact" stop
- `projects.tsx` → removed (replaced by globe markers + content panel)

Each is refactored to export inner content only (no section wrapper).

### 13. Existing Data — No Changes Needed

`data/projects.ts` already has lat/lng coordinates for globe markers. `data/links.ts`, `data/skills.ts`, `data/experience.ts` remain as-is.

---

## Scroll Interaction Flow

```
Stop 0: Hero — Globe centered, hero text overlay visible
  ↓ scroll down
Stop 1: Project "Atlas" — Globe rotates to face Bengaluru (12.97, 77.59)
  ↓ scroll down
Stop 2: Project "Marginalia" — Globe rotates to face San Francisco (37.77, -122.42)
  ↓ scroll down
Stop 3: Project "Field Notes" — Globe rotates to face Berlin (52.52, 13.41)
  ↓ scroll down
Stop 4: Project "Index" — Globe rotates to face Tokyo (35.68, 139.69)
  ↓ scroll down
Stop 5: About — Content panel slides in with about content
  ↓ scroll down
Stop 6: Experience — Content panel updates
  ↓ scroll down
Stop 7: Skills — Content panel updates
  ↓ scroll down
Stop 8: Contact — Content panel updates
```

Scrolling up reverses the flow. The globe rotates smoothly between stops using lerp in useFrame.

---

## File Change Summary

| File | Action | Description |
|---|---|---|
| `app/globals.css` | Edit | Switch to dark color tokens |
| `app/layout.tsx` | Edit | Remove Nav, add overflow-hidden, dark bg |
| `app/page.tsx` | Rewrite | New immersive shell layout |
| `components/3d/globe.tsx` | Rewrite | Dark theme globe, scroll-driven rotation, drag, glow, markers |
| `components/3d/dynamic-globe.tsx` | Edit | Update props interface for new globe |
| `components/scroll-controller.tsx` | Create | Wheel event hijack → progress state |
| `components/star-field.tsx` | Create | R3F star particle background |
| `components/overlay-nav.tsx` | Create | Floating glassmorphism nav |
| `components/content-panel.tsx` | Create | Sliding glassmorphism detail card |
| `components/hero-overlay.tsx` | Create | Initial hero text overlay |
| `components/section-nav-dots.tsx` | Create | Side dot navigation |
| `components/nav.tsx` | Remove | Replaced by overlay-nav |
| `components/footer.tsx` | Remove/simplify | Minimal or removed in immersive layout |
| `components/sections/globe-section.tsx` | Remove | Absorbed into immersive layout |
| `components/sections/hero.tsx` | Remove | Replaced by hero-overlay |
| `components/sections/about.tsx` | Refactor | Export inner content only |
| `components/sections/experience.tsx` | Refactor | Export inner content only |
| `components/sections/skills.tsx` | Refactor | Export inner content only |
| `components/sections/contact.tsx` | Refactor | Export inner content only |
| `components/sections/projects.tsx` | Remove | Replaced by globe markers |

---

## Implementation Order

1. **Dark theme** — Update `globals.css` color tokens
2. **Layout + page shell** — `layout.tsx` and `page.tsx` rewrite for full-viewport immersive container
3. **Scroll controller** — Create `scroll-controller.tsx` with wheel hijack
4. **Globe rewrite** — Rewrite `globe.tsx` with dark theme, scroll-driven rotation, atmosphere glow, enhanced markers, drag rotation
5. **Star field** — Create `star-field.tsx`
6. **Overlay components** — Create `overlay-nav.tsx`, `content-panel.tsx`, `hero-overlay.tsx`, `section-nav-dots.tsx`
7. **Section refactoring** — Refactor about/experience/skills/contact to export inner content, remove old section wrappers
8. **Cleanup** — Remove old nav, hero, projects section, globe-section
9. **Polish** — Responsive design, animations, mobile touch gestures

---

## Dependencies

No new npm packages needed. The project already has:
- `@react-three/fiber` — R3F renderer
- `@react-three/drei` — Helpers (Html, etc.)
- `three` — 3D engine

Optionally could add `@react-three/postprocessing` for bloom/glow effects, but not required.

---

## Visual Aesthetic

- Background: Deep space black (#0a0a14) with subtle blue tint
- Globe: Navy wireframe + cyan dot matrix + cyan atmosphere ring
- Markers: Bright cyan dots with white pulse on hover/active
- UI elements: Glassmorphism (semi-transparent dark cards with backdrop-blur)
- Accent color: Cyan/teal (oklch(0.72 0.14 195)) — replacing burgundy
- Typography: Keep Fraunces + Geist fonts, lighter weights for dark bg
- Animations: Smooth, understated — lerp-based globe rotation, CSS transitions for panels
