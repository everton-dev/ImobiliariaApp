# Feature Specification: Real Estate Lead-Generation Site

**Feature Branch**: `001-realtor-lead-site`

**Created**: 2026-07-15

**Status**: Draft

**Input**: User description: "A single-page Real Estate application utilizing Angular and Material Design, designed specifically for lead generation. The entire platform is optimized to channel user engagement directly to WhatsApp for personalized consultations. Key requirements include comprehensive SEO optimization across all pages for improved Google search rankings, a Mobile-First Responsive Layout, a Fixed Header (Sticky Menu), and a Dynamic Loading Configuration. The header navigation must be restricted to only 4 menus: 'About Me', 'My Process', 'Clients'"

## Clarifications

### Session 2026-07-15

- Q: What is the fourth header menu item? → A: "Contact" — a dedicated section containing a WhatsApp icon button labeled "Contact us" that opens a WhatsApp conversation with the agent.
- Q: How should translated content be structured in the configuration source? → A: Single config file with language keys — every content field holds an object keyed by language code (`pt`/`en`/`es`), e.g., `{ "pt": "...", "en": "...", "es": "..." }`.
- Q: What does the "Clients" section showcase? → A: Testimonials — short quotes from past clients, each with a client name and an optional photo/avatar.
- Q: How does the owner edit the configuration source? → A: Plain file (JSON or YAML) edited directly in a text editor or hosting file manager; no admin panel or CMS required.
- Q: Should section navigation update the URL for deep-linking and SEO? → A: Hash fragments — each section is addressable via `/#section-id` (e.g., `/#about-me`, `/#contact`); no server-side routing required.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Contact the agent via WhatsApp (Priority: P1)

A prospective client visits the site, reads enough to trust the agent, and taps a
clearly visible call-to-action that opens WhatsApp with a pre-filled message so
they can start a personalized consultation without filling forms or waiting.

**Why this priority**: The entire purpose of the platform is lead generation
funneled to WhatsApp. If this works and nothing else does, the business still
captures leads — this is the MVP.

**Independent Test**: Load the site on mobile and desktop, tap each WhatsApp
call-to-action, and confirm WhatsApp opens addressed to the agent's number with a
context-appropriate pre-filled message.

**Acceptance Scenarios**:

1. **Given** a visitor on any section of the page, **When** they tap a primary
   "Talk on WhatsApp" call-to-action, **Then** WhatsApp (app or web) opens a chat
   with the agent's number and a pre-filled introductory message.
2. **Given** a visitor on a mobile device with WhatsApp installed, **When** they
   tap the call-to-action, **Then** the native WhatsApp app opens the conversation.
3. **Given** a visitor on a desktop without the app, **When** they tap the
   call-to-action, **Then** WhatsApp Web opens the conversation in a new tab.
4. **Given** a visitor viewing a specific section (e.g., "My Process"), **When**
   they use a section-level call-to-action, **Then** the pre-filled message
   references that context.
5. **Given** a visitor on the "Contact" section, **When** they tap the
   "Contact us" button (WhatsApp icon + label), **Then** WhatsApp opens with
   the agent's number and the default pre-filled message.

---

### User Story 2 - Browse the single-page content and navigate via sticky header (Priority: P1)

A visitor lands on the page and uses a fixed header menu that stays visible while
scrolling to jump directly to the sections that matter to them, on any device.

**Why this priority**: Navigation and content presentation are required for the
visitor to gain enough trust to convert. Without readable, navigable content the
WhatsApp funnel has nothing feeding it.

**Independent Test**: Scroll the page on mobile and desktop; confirm the header
stays fixed, each menu item scrolls smoothly to its section, and the layout adapts
to screen size.

**Acceptance Scenarios**:

1. **Given** a visitor scrolling the page, **When** they scroll past the top,
   **Then** the header remains fixed and visible at the top of the viewport.
2. **Given** the header is visible, **When** the visitor selects a menu item,
   **Then** the page scrolls to the corresponding section and the active item is
   visually indicated.
3. **Given** a visitor on a small screen, **When** the header cannot fit all menu
   items, **Then** navigation collapses into a mobile-friendly menu (e.g.,
   hamburger) that exposes the same items.
4. **Given** the navigation, **When** it is rendered, **Then** it contains exactly
   the four items "About Me", "My Process", "Clients", and "Contact" and no more.

---

### User Story 3 - Content and site behavior driven by dynamic configuration (Priority: P2)

The site owner can change key content and behavior — such as the WhatsApp number,
pre-filled messages, section text, images, and menu labels — through a
configuration source without a developer editing hardcoded content, so the site
stays current as the agent's offering evolves.

The application must support multilingual capabilities, including Brazilian
Portuguese, English, and Spanish. The option to toggle the language of the entire
website must be integrated into the header, represented by three flags: Brazil,
Spain, and the United Kingdom. Clicking a specific flag must immediately transition
the website to the selected language.

**Why this priority**: Dynamic loading configuration was explicitly requested. It
protects long-term maintainability and lets the owner keep messaging fresh. The
same configuration source carries all translations, making multilingual and dynamic
content a single unified capability.

**Independent Test**: Change a configuration value (e.g., WhatsApp number or a
section heading) in the configuration source, reload the site, and confirm the
change appears without code changes. Also switch each language flag and confirm all
visible content updates immediately without a page reload.

**Acceptance Scenarios**:

1. **Given** a configuration source defining site content and settings, **When**
   the page loads, **Then** the displayed content, WhatsApp number, and pre-filled
   messages reflect the current configuration values.
2. **Given** the owner updates a configuration value, **When** a visitor next
   loads the page, **Then** the updated value is shown without a code deployment.
3. **Given** the configuration cannot be loaded, **When** the page loads, **Then**
   the site displays safe default content and remains usable (no blank page).
4. **Given** the header language flags are visible, **When** a visitor clicks the
   Brazil flag, **Then** all visible text content switches to Brazilian Portuguese
   immediately without a page reload.
5. **Given** a visitor who selected Spanish, **When** they tap a WhatsApp
   call-to-action, **Then** the pre-filled message is in Spanish.

---

### User Story 4 - Discover the site through Google search (Priority: P2)

A person searching Google for a real estate agent or related terms finds the
site ranked well, with an informative, accurate result listing that entices them
to click through.

**Why this priority**: SEO is a primary driver of the lead pipeline, but it is a
growth lever that compounds over time rather than a launch blocker for a visitor
who already has the link.

**Independent Test**: Inspect each section/page for descriptive titles, meta
descriptions, structured data, and shareable link previews; verify the site is
crawlable and produces valid, human-readable search and social previews.

**Acceptance Scenarios**:

1. **Given** a search engine crawler, **When** it requests the site, **Then** it
   receives meaningful, indexable content including a descriptive page title and
   meta description.
2. **Given** the site is shared on social platforms, **When** a link preview is
   generated, **Then** it shows an accurate title, description, and image.
3. **Given** the page content, **When** analyzed for SEO best practices, **Then**
   it includes a single primary heading structure, descriptive image alternative
   text, and structured data describing the agent/business.

---

### Edge Cases

- What happens when a visitor's device has neither the WhatsApp app nor access to
  WhatsApp Web (e.g., WhatsApp blocked)? The call-to-action MUST still degrade to
  a usable fallback (e.g., display the number to copy).
- How does the site handle a missing or malformed configuration value? It MUST
  fall back to safe defaults for that value rather than breaking the page.
- What happens on very slow connections? Core content and the primary WhatsApp
  call-to-action MUST remain usable while non-critical assets load.
- How does the sticky header behave on very short viewports (landscape mobile)?
  It MUST not obscure an unreasonable portion of the content.
- What happens if a menu item's target section is not present in the current
  configuration? That menu item MUST be hidden rather than linking to nothing.
- What happens when the visitor switches language and a translation string is
  missing? The site MUST fall back to the default language string rather than
  showing an empty element.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST present its content as a single continuous page with
  distinct, anchorable sections.
- **FR-002**: The site MUST provide prominent WhatsApp call-to-action controls
  that open a conversation with the agent's configured number.
- **FR-003**: WhatsApp call-to-actions MUST open with a pre-filled message, and
  section-level call-to-actions SHOULD include context relevant to that section.
- **FR-004**: The site MUST open the native WhatsApp app when available and fall
  back to WhatsApp Web otherwise, with a further fallback to display the number
  when neither is available.
- **FR-005**: The header MUST remain fixed (sticky) and visible while the visitor
  scrolls.
- **FR-006**: The header navigation MUST contain exactly four menu items: "About Me",
  "My Process", "Clients", and "Contact". The "Contact" item scrolls to a dedicated
  section whose sole content is a prominent button displaying a WhatsApp icon and
  the label "Contact us", which opens a WhatsApp conversation with the agent.
- **FR-007**: Selecting a menu item MUST scroll the visitor to the corresponding
  section and update the browser URL to the section's hash fragment (e.g.,
  `/#about-me`), with a clear active-state indication on the selected item.
- **FR-007a**: Each section MUST have a stable, unique hash anchor (e.g.,
  `#about-me`, `#my-process`, `#clients`, `#contact`) so visitors can share or
  bookmark a direct link to that section.
- **FR-008**: On screens too small to display the full navigation inline, the menu
  MUST collapse into a mobile-friendly control that exposes the same four items.
- **FR-009**: The layout MUST be mobile-first and responsive, remaining usable and
  readable from small phones up to large desktop screens.
- **FR-010**: Site content, settings, and behavior (including WhatsApp number,
  pre-filled messages, section content, images, menu labels, and all translatable
  strings) MUST be driven by a single runtime-loaded configuration file. Every
  translatable field in that file MUST be structured as an object keyed by language
  code (`pt`, `en`, `es`), e.g., `{ "pt": "...", "en": "...", "es": "..." }`.
  Non-translatable values (e.g., WhatsApp number, image URLs) MUST be plain scalars.
- **FR-011**: If the configuration source is unavailable or a value is missing,
  the site MUST display safe default content and remain usable.
- **FR-012**: Every section MUST expose SEO metadata — descriptive title, meta
  description, and structured data describing the agent/business — updated in the
  document `<head>` when the section's hash fragment becomes active.
- **FR-013**: The site MUST be crawlable by search engines and serve indexable,
  meaningful content.
- **FR-014**: Shared links MUST produce accurate social/link previews (title,
  description, image).
- **FR-015**: Images MUST include descriptive alternative text, and the page MUST
  use a coherent heading structure for accessibility and SEO.
- **FR-016**: The site MUST meet the accessibility baseline (keyboard navigation
  of the header and call-to-actions, sufficient contrast, labeled controls) so it
  is usable via assistive technology.
- **FR-017**: The site MUST support three languages: Brazilian Portuguese (default),
  English, and Spanish. All user-facing text content MUST be available in each
  language.
- **FR-018**: The header MUST display three flag icons (Brazil, United Kingdom,
  Spain) as a language toggle. Each flag MUST be visually distinct and labeled
  accessibly.
- **FR-019**: Clicking a language flag MUST immediately switch all visible text
  content on the page to the selected language without a page reload.
- **FR-020**: WhatsApp pre-filled messages MUST be in the language currently
  selected by the visitor.
- **FR-021**: When a translation string is missing for the selected language, the
  site MUST fall back to the Brazilian Portuguese default string rather than
  displaying an empty element.

### Key Entities *(include if feature involves data)*

- **Site Configuration**: A single runtime-loaded config file that drives the
  entire site. Non-translatable fields (WhatsApp number, image URLs, section order)
  are plain scalars. Every translatable field (section headings, body text, button
  labels, pre-filled WhatsApp messages, menu labels) is an object keyed by language
  code: `{ "pt": "...", "en": "...", "es": "..." }`. One file; the owner edits it
  directly to update content or add/correct translations.
- **Content Section**: A distinct region of the single page — "About Me", "My
  Process", "Clients", or "Contact" — each with a heading, body content, optional
  media, and an optional call-to-action. The "Clients" section exclusively displays
  Testimonials. The "Contact" section's only content is a WhatsApp icon button
  labeled "Contact us". Each section is anchorable via its menu item and carries
  SEO metadata.
- **Testimonial**: A single client quote entry within the "Clients" section,
  comprising a quote text (translatable), a client name, and an optional
  photo/avatar image. Multiple testimonials may be displayed in the section.
  Quote text MUST be translatable per language key; client name and photo are
  language-neutral scalars.
- **Navigation Menu Item**: One of exactly four header entries ("About Me",
  "My Process", "Clients", "Contact"), each with a label (per language) and a
  target section anchor.
- **Language Configuration**: The set of translated strings for one supported
  language (Brazilian Portuguese, English, or Spanish), covering all user-facing
  content including section text, button labels, and pre-filled WhatsApp messages.
- **Lead Interaction**: A visitor's act of tapping a WhatsApp call-to-action,
  carrying the originating context (which section) and current language to shape
  the pre-filled message.
- **SEO Metadata**: Per-page/section descriptive title, meta description,
  structured data, and social preview fields.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can go from landing on the page to an open WhatsApp
  conversation with the agent in 2 taps or fewer.
- **SC-002**: The primary WhatsApp call-to-action is reachable from any point on
  the page within one interaction (visible or one scroll to the sticky header).
- **SC-003**: The site is fully usable — content readable, navigation and
  call-to-action operable — on screen widths from 320px to 1920px.
- **SC-004**: The primary content and WhatsApp call-to-action become usable within
  3 seconds on a typical mobile connection.
- **SC-005**: 100% of pages/sections expose a descriptive title, meta description,
  and valid structured data, and pass a standard SEO/technical audit with no
  critical errors.
- **SC-006**: Shared links render an accurate preview (title, description, image)
  on major social and messaging platforms.
- **SC-007**: The header navigation displays exactly four items on every viewport,
  and every item scrolls to a present, correct section.
- **SC-008**: An owner can change the WhatsApp number, a pre-filled message, or a
  section heading via configuration and see it reflected on reload with no code
  change.
- **SC-009**: The site meets WCAG 2.1 AA for the header, navigation, and
  call-to-action controls, verifiable by an accessibility audit.
- **SC-010**: Clicking a language flag switches all visible text content to the
  selected language within 1 second, with no page reload.
- **SC-011**: All three supported languages (Brazilian Portuguese, English,
  Spanish) are complete — no visible empty or untranslated strings — at launch.
- **SC-012**: Visiting a direct hash-fragment URL (e.g., `/#clients`) loads the
  page and scrolls immediately to the correct section without user interaction.

## Assumptions

- The site represents a single real estate agent (personal brand), consistent with
  menu items like "About Me" and "My Process".
- WhatsApp is the sole conversion channel; no on-site contact form or lead-capture
  database is required. Leads are captured through the WhatsApp conversation itself.
- The agent has a single WhatsApp number used for all consultations, supplied via
  configuration.
- The configuration source is a plain JSON or YAML file loaded at runtime. The
  owner or a developer edits it directly in a text editor or hosting file manager
  and overwrites it on the server; no admin panel or CMS is required.
- "All pages" refers to the sections/routes of this single-page application; SEO
  requirements apply per section/route.
- Content is primarily informational (about the agent, process, client social proof,
  and a contact call-to-action) rather than a searchable property listings database.
- Brazilian Portuguese is the default language; the site loads in Brazilian
  Portuguese unless the visitor selects another language.
- The language selection is session-scoped and not persisted across visits (a
  returning visitor sees the default language on a fresh load), unless the
  configuration specifies otherwise.

## Dependencies

- Access to the agent's WhatsApp Business or personal number and the ability to
  deep-link into WhatsApp / WhatsApp Web.
- A plain JSON or YAML configuration file served at a known runtime path, carrying
  all site settings and translatable strings per language (`pt`/`en`/`es`),
  editable directly by the owner or developer without a CMS or admin tool.
- Search engine and social platform crawlers for indexing and link previews
  (external, not controlled by the project).
