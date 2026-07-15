# Tasks: Real Estate Lead-Generation Site (001-realtor-lead-site)

**Input**: [plan.md](plan.md) · [spec.md](spec.md) · [data-model.md](data-model.md) · [contracts/](contracts/) · [research.md](research.md) · [quickstart.md](quickstart.md)

**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ ✅

**Tests**: TDD is **NON-NEGOTIABLE** per Constitution Principle II. Test tasks appear before implementation tasks in every phase. Write the test, watch it fail, then implement (Red → Green → Refactor).

**Organization**: Tasks are grouped by User Story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks in same batch)
- **[Story]**: User story this task belongs to (US1 = WhatsApp CTA, US2 = Navigation, US3 = Config/i18n, US4 = SEO)
- TDD rule: Every `[US?]` implementation task that adds behavior MUST have a preceding test task in the same phase

---

## Path Conventions

- Frontend: `frontend/src/app/`, `frontend/e2e/`, `frontend/src/assets/`
- Backend: `backend/src/ImobiliariaApp.Functions/`, `backend/tests/ImobiliariaApp.Functions.Tests/`

---

## Phase 1: Setup

**Purpose**: Scaffold both projects, wire CI, and verify the empty shell compiles and serves.

- [X] T001 Initialize Angular 18 workspace with standalone components in `frontend/` — `ng new imobiliaria-frontend --standalone --routing=false --style=scss --ssr=false`
- [X] T002 [P] Add Angular Material 18 and configure global theme in `frontend/src/styles.scss` — `ng add @angular/material`
- [X] T003 [P] Replace default Karma/Jasmine with Jest in `frontend/` — install `@angular-builders/jest jest @types/jest` and create `frontend/jest.config.ts` + `frontend/tsconfig.spec.json`
- [X] T004 [P] Install and configure Playwright for E2E in `frontend/` — `npm init playwright@latest` (outputs `frontend/playwright.config.ts` and `frontend/e2e/`)
- [X] T005 [P] Initialize .NET 10 Azure Functions App (isolated worker) in `backend/src/ImobiliariaApp.Functions/` — `func init ImobiliariaApp.Functions --worker-runtime dotnet-isolated --target-framework net10.0`
- [X] T006 [P] Create xUnit test project in `backend/tests/ImobiliariaApp.Functions.Tests/` — `dotnet new xunit` and add project reference to the Functions project
- [X] T007 Scaffold EF Core + SQL Server infrastructure in `backend/src/ImobiliariaApp.Functions/Infrastructure/AppDbContext.cs` — add `Microsoft.EntityFrameworkCore.SqlServer` package, create empty `AppDbContext`, register in `Program.cs` (no migrations yet; connection string from `local.settings.json`)
- [X] T008 [P] Commit `.gitignore` entries: `frontend/node_modules/`, `frontend/dist/`, `backend/bin/`, `backend/obj/`, `local.settings.json`, `frontend/src/assets/config.json` (owner's file — not committed; only `config.example.json` is committed)
- [X] T009 Verify setup: `cd frontend && ng serve` renders default Angular shell at `http://localhost:4200`; `cd backend/src/ImobiliariaApp.Functions && func start` starts Functions host without errors; `cd frontend && npx jest` exits 0; `cd backend && dotnet test` exits 0

**Checkpoint**: Both projects compile, serve, and have green (empty) test suites. Ready for foundational tasks.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that ALL user stories depend on. No user story work begins until this phase is complete.

**⚠️ CRITICAL**: Complete all Phase 2 tasks before starting any Phase 3+ task.

- [X] T010 [P] Create TypeScript models in `frontend/src/app/core/models/site-config.model.ts` — `LangCode`, `TranslatedString`, `SiteInfo`, `SeoConfig`, `WhatsAppConfig`, `Testimonial`, `ProcessStep`, section interfaces, `SiteConfig` (full schema from `data-model.md`)
- [X] T011 [P] Create .NET DTOs in `backend/src/ImobiliariaApp.Functions/Models/` — `TranslatedStringDto`, `SeoConfigDto`, `WhatsAppConfigDto`, `TestimonialDto`, `ProcessStepDto`, `SiteInfoDto`, `NavLabelsDto`, section DTOs, `SiteConfigDto` (mirrors TypeScript model)
- [X] T012 Write unit test for `ConfigService` in `frontend/src/app/core/services/config.service.spec.ts` — test: (a) loads and parses valid JSON, (b) returns safe defaults when fetch fails (404), (c) returns safe defaults when JSON is malformed
- [X] T013 Implement `ConfigService` in `frontend/src/app/core/services/config.service.ts` — `load(): Promise<void>` fetches `/assets/config.json` via `HttpClient`, stores parsed `SiteConfig`, exposes `config()` signal; on any error applies `defaults()` (hard-coded safe minimum from `data-model.md`); wire `APP_INITIALIZER` in `frontend/src/app/app.config.ts`
- [X] T014 Write unit test for `LanguageService` in `frontend/src/app/core/services/language.service.spec.ts` — test: (a) default language is `'pt'`, (b) `translate()` returns `field.pt` for `'pt'`, (c) `translate()` returns `field.en` when lang is `'en'`, (d) `translate()` falls back to `field.pt` when `field.en` is absent (FR-021), (e) `switch()` updates the signal
- [X] T015 Implement `LanguageService` in `frontend/src/app/core/services/language.service.ts` — `lang = signal<LangCode>('pt')`, `translate(field: TranslatedString): string` (`field[this.lang()] ?? field.pt`), `switch(code: LangCode): void`
- [X] T016 Write unit test for `TranslatePipe` in `frontend/src/app/shared/pipes/translate.pipe.spec.ts` — test: transforms `TranslatedString` to correct string for current language; reacts to language change
- [X] T017 [P] Implement `TranslatePipe` in `frontend/src/app/shared/pipes/translate.pipe.ts` — `transform(field: TranslatedString | null): string` delegates to `LanguageService.translate()`; pure: `false` so it re-evaluates on language signal change
- [X] T018 [P] Create `config.example.json` in `frontend/src/assets/config.example.json` — commit the annotated example from `contracts/config-schema.md` (this is the file committed to git; `config.json` is gitignored)
- [X] T019 Set up `app.component.ts` as the SPA shell — import `StickyHeaderComponent`, render one `<section>` per enabled config section using `@if` and `ConfigService.config()` signal; no feature components yet (those come in their phases)

**Checkpoint**: `npx jest` is green. `ConfigService` loads config, falls back on error. `LanguageService` translates and switches. Foundation ready — user story implementation can begin.

---

## Phase 3: User Story 1 — Contact via WhatsApp (Priority: P1) 🎯 MVP

**Goal**: Any visitor can open a WhatsApp conversation with the agent in ≤2 taps from any section.

**Independent Test** (from quickstart.md VS1): Load the site on mobile and desktop, tap each WhatsApp CTA, and confirm WhatsApp opens with the correct number and a pre-filled message in the current language.

### Tests for User Story 1

> **Write these FIRST — ensure they FAIL before implementing**

- [X] T020 [P] [US1] Write unit test for `WhatsAppService` in `frontend/src/app/core/services/whatsapp.service.spec.ts` — test: (a) `buildUrl('5511999998888', 'Olá')` returns `'https://wa.me/5511999998888?text=Ol%C3%A1'`, (b) `buildUrl('', 'msg')` returns `null` (disabled state), (c) message is `encodeURIComponent`-encoded
- [X] T021 [P] [US1] Write unit test for `WhatsAppButtonComponent` in `frontend/src/app/shared/components/whatsapp-button/whatsapp-button.component.spec.ts` — test: (a) renders anchor with correct `href` from `WhatsAppService`, (b) renders WhatsApp icon + label text, (c) when phone is empty the button is visually disabled and has `aria-disabled="true"`
- [X] T022 [P] [US1] Write unit test for `ContactComponent` in `frontend/src/app/features/contact/contact.component.spec.ts` — test: (a) renders exactly one `WhatsAppButtonComponent`, (b) button label matches `config.sections.contact.buttonLabel` for current language, (c) WhatsApp URL uses `config.site.agentPhone` and `config.sections.contact.whatsapp.message` for current language
- [X] T023 [P] [US1] Write Playwright E2E test in `frontend/e2e/whatsapp-cta.spec.ts` — scenario: (a) tap Contact section button → confirm `wa.me` link href with correct phone, (b) phone number is displayed in the Contact section as fallback text, (c) About Me and My Process CTAs open with section-specific pre-filled messages

### Implementation for User Story 1

- [X] T024 [US1] Implement `WhatsAppService` in `frontend/src/app/core/services/whatsapp.service.ts` — `buildUrl(phone: string, message: string): string | null` returns `null` when phone is empty, otherwise `https://wa.me/${phone}?text=${encodeURIComponent(message)}`; `getDisplayPhone(phone: string): string` formats for display (e.g. adds `+` prefix)
- [X] T025 [US1] Implement `WhatsAppButtonComponent` in `frontend/src/app/shared/components/whatsapp-button/whatsapp-button.component.ts` — inputs: `label: string`, `phone: string`, `message: string`; renders `<a [href]="url" target="_blank" rel="noopener" aria-label>` with `mat-raised-button` + `matIcon` WhatsApp icon; when `url` is `null` renders a disabled button showing the display phone number (fallback per FR-004 edge case)
- [X] T026 [US1] Implement `ContactComponent` in `frontend/src/app/features/contact/contact.component.ts` — section `id="contact"`, single `<h2>` heading, single `WhatsAppButtonComponent` with `buttonLabel` from config and `message` in current language; no other content
- [X] T027 [US1] Wire WhatsApp CTAs into `AboutMeComponent` in `frontend/src/app/features/about-me/about-me.component.ts` — render heading, body text (via `TranslatePipe`), optional agent photo, and a `WhatsAppButtonComponent` using `sections.aboutMe.whatsapp`
- [X] T028 [US1] Wire WhatsApp CTA into `MyProcessComponent` in `frontend/src/app/features/my-process/my-process.component.ts` — render heading, process steps list, and a `WhatsAppButtonComponent` using `sections.myProcess.whatsapp`
- [X] T029 [US1] Add `ContactComponent`, `AboutMeComponent`, `MyProcessComponent` as section blocks in `app.component.ts` (shell); each wrapped in `<section [id]="sectionId" @if(enabled)>` using `ConfigService.config()` signal

**Checkpoint**: User Story 1 independently functional and testable. A visitor can tap WhatsApp CTAs and open a conversation. All US1 tests green. Deployable as MVP.

---

## Phase 4: User Story 2 — Sticky Header Navigation (Priority: P1)

**Goal**: A fixed header with exactly 4 nav items lets visitors jump to any section on any device, with hash-fragment URL updates and active-state indication.

**Independent Test** (from quickstart.md VS2 + VS5): Scroll on mobile and desktop — header stays fixed, nav items scroll to sections, URL updates to hash fragment. Cold-load `/#clients` → page scrolls to Clients section.

### Tests for User Story 2

> **Write these FIRST — ensure they FAIL before implementing**

- [X] T030 [P] [US2] Write unit test for `StickyHeaderComponent` in `frontend/src/app/shared/components/sticky-header/sticky-header.component.spec.ts` — test: (a) renders exactly 4 nav items, (b) nav item labels come from `config.nav` via `TranslatePipe`, (c) clicking a nav item emits the target section anchor, (d) the active nav item has the active CSS class, (e) three flag icons are rendered with accessible `aria-label`s
- [X] T031 [P] [US2] Write unit test for `NavigationService` (if extracted) or for the navigation logic in `AppComponent` — test: (a) `navigateTo('about-me')` calls `ViewportScroller.scrollToAnchor` and updates fragment, (b) `IntersectionObserver` callback updates active section signal, (c) on init with fragment `'clients'`, `scrollToAnchor('clients')` is called
- [X] T032 [P] [US2] Write Playwright E2E test in `frontend/e2e/navigation.spec.ts` — scenario: (a) header is visible after 1000 px scroll, (b) clicking "Clientes" nav item scrolls to `#clients` and URL becomes `/#clients`, (c) navigating to `http://localhost:4200/#my-process` cold-loads and scrolls to My Process section, (d) at 375 px viewport hamburger menu opens and exposes 4 items

### Implementation for User Story 2

- [X] T033 [US2] Implement `StickyHeaderComponent` in `frontend/src/app/shared/components/sticky-header/sticky-header.component.ts` — `MatToolbar` with `position="fixed"` style; 4 nav items from `ConfigService.config().nav` (hidden when `sections.*.enabled = false`); active-state class bound to active section signal; hamburger `MatSideNav` or `MatMenu` for mobile (breakpoint via `BreakpointObserver`); three flag buttons (`<button mat-icon-button aria-label="Português">` etc.) that call `LanguageService.switch()`
- [X] T034 [US2] Implement section scroll + URL navigation in `frontend/src/app/app.component.ts` — `Router` fragment navigation on nav-item click (`replaceUrl: false`); `IntersectionObserver` watching each `<section>` element updates an `activeSection = signal<string>('')` passed to `StickyHeaderComponent`; on `AfterViewInit` read `ActivatedRoute.fragment` and call `ViewportScroller.scrollToAnchor()` for cold-load deep-linking (FR-007a, SC-012)
- [X] T035 [US2] Configure Angular Router in `frontend/src/app/app.config.ts` — `provideRouter([], withHashLocation: false)`, enable `anchorScrolling: 'enabled'` and `scrollPositionRestoration: 'enabled'`; configure `staticwebapp.config.json` (or note for hosting) to serve `index.html` for all paths (SPA fallback)
- [X] T036 [US2] Implement `ClientsSection` in `frontend/src/app/features/clients/clients.component.ts` — section `id="clients"`, heading, `@for` loop of `TestimonialCardComponent`; if `testimonials` array is empty renders a graceful empty state
- [X] T037 [P] [US2] Implement `TestimonialCardComponent` in `frontend/src/app/features/clients/testimonial-card.component.ts` — `MatCard` with quote text (via `TranslatePipe`), client name, optional `<img>` with `[alt]="clientName"` (accessibility FR-015); falls back to initials avatar when `photoUrl` is absent

**Checkpoint**: User Story 2 complete. Header sticks, nav scrolls, URL updates, hamburger works, deep-links load correctly. All US2 tests green.

---

## Phase 5: User Story 3 — Dynamic Configuration & i18n (Priority: P2)

**Goal**: Owner can update content via `config.json` without a code change; visitors can switch between PT-BR, EN, and ES instantly.

**Independent Test** (from quickstart.md VS3 + VS4): Change a config value → reload → change appears. Switch each language flag → all content updates < 1 second without page reload. Missing `en` key → falls back to `pt`.

### Tests for User Story 3

> **Write these FIRST — ensure they FAIL before implementing**

- [X] T038 [P] [US3] Write unit test for config validation in `frontend/src/app/core/services/config.service.spec.ts` (extend T012 test file) — test: (a) config with `sections.aboutMe.enabled = false` causes About Me nav item to be absent from `StickyHeaderComponent`, (b) config with missing `en` key on a translatable field → `LanguageService.translate()` returns `pt` value when language is `'en'`, (c) config with empty `testimonials` array renders Clients section without crash
- [X] T039 [P] [US3] Write Playwright E2E test in `frontend/e2e/language-switch.spec.ts` — scenario: (a) click UK flag → all nav labels update to English strings from config, (b) click Spain flag → all nav labels update to Spanish strings, (c) click WhatsApp button after switching to Spanish → `wa.me` URL `text` param is the Spanish pre-filled message, (d) with `en` key absent from a field → no empty visible text appears when language is English

### Implementation for User Story 3

- [X] T040 [US3] Extend `ConfigService` in `frontend/src/app/core/services/config.service.ts` — add `validateConfig(raw: unknown): SiteConfig` that checks required fields (`site.agentPhone`, `site.agentName`, each section's `enabled`) and coerces missing optional fields to defaults; called inside `load()` after JSON.parse; log validation warnings to console (not shown to user)
- [X] T041 [US3] Verify `LanguageService.switch()` triggers reactive updates across all components — add an integration test confirming `TranslatePipe` output changes reactively when `LanguageService.lang` signal changes; fix any component that reads language without the pipe (must use `TranslatePipe` or `LanguageService.translate()` in template)
- [X] T042 [US3] Verify WhatsApp CTAs use current language for pre-filled messages — confirm `WhatsAppButtonComponent` reads `message` input at render time from the language-aware `TranslatePipe`; update `AboutMeComponent`, `MyProcessComponent`, `ContactComponent` if any hardcodes `pt` message (FR-020)

**Checkpoint**: User Story 3 complete. Config drives content. All three language flags switch content instantly. Missing keys fall back gracefully. All US3 tests green.

---

## Phase 6: User Story 4 — SEO & Search Discovery (Priority: P2)

**Goal**: The page is crawlable with descriptive metadata per section; shared links produce accurate social previews.

**Independent Test** (from quickstart.md VS6): Inspect `<head>` on root load and on each section activation — `<title>`, `<meta name="description">`, OG tags, and `LocalBusiness` JSON-LD are correct and non-empty.

### Tests for User Story 4

> **Write these FIRST — ensure they FAIL before implementing**

- [X] T043 [P] [US4] Write unit test for `SeoService` in `frontend/src/app/core/services/seo.service.spec.ts` — test: (a) `update(seoConfig, lang)` sets `<title>` via `Title` service, (b) sets `<meta name="description">` via `Meta` service, (c) sets `og:title`, `og:description`, `og:image`, (d) injects `<script type="application/ld+json">` with `LocalBusiness` block on first call, (e) subsequent calls update the existing tags without creating duplicates
- [X] T044 [P] [US4] Write Playwright E2E test in `frontend/e2e/seo.spec.ts` — scenario: (a) root load → `document.title` matches `site.title.pt`, (b) scroll to `#my-process` → `document.title` updates to `sections.myProcess.seo.title.pt`, (c) `og:image` meta tag matches `site.ogImage`, (d) `<script type="application/ld+json">` is present and parseable as valid JSON containing `@type: "LocalBusiness"`, (e) all visible images have non-empty `alt` attributes

### Implementation for User Story 4

- [X] T045 [US4] Implement `SeoService` in `frontend/src/app/core/services/seo.service.ts` — inject Angular `Title` and `Meta` services; `update(section: SeoConfig, lang: LangCode, ogImage?: string): void` sets `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:image` (update existing tags, never duplicate); `injectStructuredData(agent: SiteInfo): void` creates or updates a `<script type="application/ld+json">` tag with a `LocalBusiness` JSON-LD block (name, telephone, url)
- [X] T046 [US4] Populate static OG tags in `frontend/src/index.html` — add `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`, `<meta property="og:type" content="website">` with placeholder values that `SeoService.update()` will override at runtime; ensures social crawlers scraping `index.html` directly see meaningful defaults
- [X] T047 [US4] Wire `SeoService` into `app.component.ts` — call `SeoService.injectStructuredData()` once after `ConfigService` loads; call `SeoService.update()` whenever `activeSection` signal changes (update with the new section's `seo` config and current language); also call `SeoService.update()` when language changes to refresh title/description in the selected language
- [X] T048 [US4] Add descriptive `alt` attributes to all images in `AboutMeComponent` and `TestimonialCardComponent` — agent photo: `alt="{{ config.site.agentName }}"`, testimonial avatar: `alt="{{ testimonial.clientName }}"`, missing photo initials placeholder: `aria-hidden="true"` (FR-015)

**Checkpoint**: User Story 4 complete. `<head>` metadata updates on section change. JSON-LD present. OG tags in `index.html`. All images have `alt`. All US4 tests green.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility audit, performance, edge cases, and final validation across all stories.

- [X] T049 Accessibility audit — run Playwright accessibility scan (`@axe-core/playwright`) in `frontend/e2e/accessibility.spec.ts`; fix any WCAG 2.1 AA violations on header, nav items, flag buttons, WhatsApp CTAs, and testimonial cards (SC-009); confirm keyboard Tab order covers all interactive elements
- [X] T050 [P] Mobile header constraint — verify header does not obscure an unreasonable portion of the viewport in landscape mobile (320 × 568 px); add `max-height` CSS guard if needed in `frontend/src/app/shared/components/sticky-header/sticky-header.component.scss`
- [X] T051 [P] Slow-connection resilience — verify core content and WhatsApp CTA are usable before `config.json` finishes loading: `APP_INITIALIZER` resolves to defaults immediately on timeout (add 5 s timeout to `ConfigService.load()`); add loading skeleton to `app.component.ts` for the brief initialization window
- [X] T052 [P] Hidden nav item edge case — add test in `frontend/src/app/shared/components/sticky-header/sticky-header.component.spec.ts`: when `sections.clients.enabled = false`, the "Clients" nav item is not rendered and the `#clients` anchor does not appear; verify `@if(section.enabled)` guard is on each section block
- [X] T053 [P] Backend: write and run xUnit tests for `ConfigFunction` in `backend/tests/ImobiliariaApp.Functions.Tests/ConfigFunctionTests.cs` — test: (a) `GET /api/v1/config` returns 200 with valid `SiteConfigDto` JSON when `config.json` is present, (b) returns 503 with `error: "config_unavailable"` when file is missing; implement `ConfigFunction.cs` and `ConfigFileService.cs` per `contracts/api-config.md`
- [X] T054 [P] Create `frontend/src/assets/config.json` from `config.example.json` with real agent data for local development (gitignored — not committed); verify `ng serve` loads it and all sections render
- [ ] T055 Run full quickstart validation — execute all scenarios VS1–VS7 from `quickstart.md` manually or via Playwright; document any failures and fix before marking this task complete
- [ ] T056 [P] Performance check — run `ng build --configuration production` and inspect bundle size; confirm Angular Material tree-shaking is working (no unused component imports); target: initial JS bundle < 200 kB gzipped
- [X] T057 Code cleanup — remove any unused Angular component imports, dead template code, and placeholder comments introduced during development; run `ng lint` and fix all warnings

---

## Phase 8: Visual Redesign — isaquebrito.com.br Layout

**Purpose**: Align the visual design with the reference layout: same section order, typography system, color palette, component hierarchy, and interaction patterns. All content remains data-driven via `ConfigService`; no hardcoded copy or colors in components.

**Design System Established** (`frontend/src/styles.scss`):
- Fonts: `Playfair Display` (headings, Stat numbers, italic emphasis) + `DM Sans` (body, nav, buttons) via Google Fonts
- CSS custom properties: `--bg: #F7F4EF`, `--bg-elevated: #EFECE5`, `--text: #0D0D0B`, `--accent: #C9A84C`, `--accent-dark: #9E7E35`, `--muted: #726D66`, `--nav-h: 80px`
- Angular Material M3 theme: `mat.$violet-palette` (primary) + `mat.$green-palette` (tertiary)
- Global utility classes: `.container`, `.eyebrow`, `.eyebrow-dot`, `.reveal`, `.btn-gold`, `.btn-outline`, `.card-lift`
- Reveal animation: `.reveal` (`opacity: 0; translateY(20px)`) → `.visible` via `IntersectionObserver`

**Section DOM Order**: `WhatsAppFloat → StickyHeader → Hero → AgentHighlight → AboutMe → MyProcess → Clients → Contact → Footer`

- [X] T058 [P] Implement `HeroComponent` in `frontend/src/app/features/hero/hero.component.ts` — full-viewport hero with dark-gradient background image from config, eyebrow + animated gold dot, `Playfair Display` heading with gold italic emphasis word, subheading, two CTAs (gold pill "WhatsApp" + outline secondary), 3-column stats bar at bottom; `bgImage()` returns CSS `url()` string; `waLink()` builds `wa.me` URL; data-driven via `ConfigService.config().sections.hero`
- [X] T059 [P] Implement `AgentHighlightComponent` in `frontend/src/app/shared/components/agent-highlight/agent-highlight.component.ts` — `--bg-elevated` strip: 3-column grid (agent photo circle with gold border + shadow, name/credential/tagline centered, bio paragraph pair); responsive: 2-col at 768 px, 1-col at 480 px; all content from `config().site`
- [X] T060 [P] Implement `FooterComponent` in `frontend/src/app/shared/components/footer/footer.component.ts` — `#E8E4DC` background, 3-column flexbox: brand logo + name (left), anchor nav links (center), copyright text + developer credit with domain extracted via `new URL(url).hostname` (right); collapses to single-column on mobile; content from `config().sections.footer` and `config().nav`
- [X] T061 [P] Implement `WhatsAppFloatComponent` in `frontend/src/app/shared/components/whatsapp-float/whatsapp-float.component.ts` — fixed bottom-right `56×56 px` circle `#25D366`, inline WhatsApp SVG, `box-shadow` with green glow, hover: `translateY(-4px) scale(1.07)`; `wa.me` link using `config().site.agentPhone` + contact section pre-filled message
- [X] T062 Redesign `StickyHeaderComponent` in `frontend/src/app/shared/components/sticky-header/sticky-header.component.ts` — fixed 80 px, transparent → frosted-glass (`backdrop-filter: blur(16px)`) when `scrollY > 60`; height shrinks to 60 px on scroll; desktop: logo + nav links + flag switcher + gold CTA; hamburger → fullscreen dark `#0D0D0B` overlay on mobile with `Playfair Display` 2 rem links; signals: `scrolled`, `menuOpen`; uses `@HostListener('window:scroll')`
- [X] T063 Wire all new components in `frontend/src/app/app.component.ts` + `app.component.html` — import `HeroComponent`, `AgentHighlightComponent`, `FooterComponent`, `WhatsAppFloatComponent`; DOM order per design system (T058–T061); `IntersectionObserver` for `activeSection` signal; SEO effect; `sectionIds = ['hero', 'about-me', 'my-process', 'clients', 'contact']`

**Checkpoint**: Dev server running at `http://localhost:4201/`. Build: main 93.22 kB · polyfills 90.20 kB · styles 63.49 kB. All sections render with design-system typography, colors, and layout.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completion — **BLOCKS all user stories**
- **Phase 3 (US1 · WhatsApp)**: Depends on Phase 2 — can start after foundational
- **Phase 4 (US2 · Navigation)**: Depends on Phase 2 — can start in parallel with Phase 3 (different files)
- **Phase 5 (US3 · Config/i18n)**: Depends on Phase 2 — can start after Phase 2; exercises `ConfigService` and `LanguageService` already built in Phase 2
- **Phase 6 (US4 · SEO)**: Depends on Phase 2 — can start in parallel; `SeoService` is independent
- **Phase 7 (Polish)**: Depends on Phases 3–6 completion

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories — uses `ConfigService`, `LanguageService`, `WhatsAppService`
- **US2 (P1)**: No dependency on US1 — uses `ConfigService`, `LanguageService`, Router, `IntersectionObserver`; `StickyHeaderComponent` calls `LanguageService.switch()` (shared with US3)
- **US3 (P2)**: Extends `ConfigService` (T040) and verifies US1+US2 react correctly to language changes — minor dependency on US1/US2 being present to verify integration; can be completed independently with mocks
- **US4 (P2)**: Fully independent — `SeoService` is a new service wired into `app.component.ts`

### Within Each Phase (TDD Order)

1. **Tests** — write and run; must FAIL (Red)
2. **Models / DTOs** — if new types required
3. **Services** — business logic
4. **Components** — presentation
5. **Integration** — wire into shell
6. Tests now **pass** (Green)
7. **Refactor** if needed, tests still green

---

## Parallel Opportunities

### Phase 2 (Foundational) — all [P] tasks can start together after T001

```
T010 (models)      ──┐
T011 (.NET DTOs)   ──┤
T016 (TranslatePipe test) ──┐─→ T017 (TranslatePipe impl)
T012 (ConfigService test) ──┤
T014 (LanguageService test) ──┤
T018 (config.example.json) ──┘
```
T013 (ConfigService impl) depends on T012 passing.
T015 (LanguageService impl) depends on T014 passing.
T019 (app shell) depends on T013 + T015.

### Phase 3 (US1) — tests can all start in parallel after Phase 2

```
T020 (WhatsAppService test)   ──→ T024 (impl)
T021 (WhatsAppButton test)    ──→ T025 (impl)
T022 (ContactComponent test)  ──→ T026 (impl)
T023 (E2E test)               ──→ (validate after T024–T028)
T027, T028 (AboutMe, MyProcess CTAs) — after T024
T029 (wire into shell) — after T026–T028
```

### Phases 3–6 parallel opportunity (if multiple developers)

```
Phase 3 (US1): developer A — WhatsAppService + CTAs
Phase 4 (US2): developer B — StickyHeader + navigation
Phase 6 (US4): developer C — SeoService (fully independent)
Phase 5 (US3): developer A (after US1) — config validation + language integration tests
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 = P1)

1. Complete **Phase 1**: Setup — both projects scaffold and serve
2. Complete **Phase 2**: Foundational — config loading, language service, translate pipe (**blocks all stories**)
3. Complete **Phase 3**: US1 (WhatsApp CTA) — **validate independently** (VS1)
4. Complete **Phase 4**: US2 (Navigation) — **validate independently** (VS2 + VS5)
5. **Stop and demo**: visitor can navigate the page and contact via WhatsApp in their default language
6. **Deploy MVP** if ready

### Incremental Delivery

1. MVP above (US1 + US2) → Deploy
2. Add **Phase 5** (US3 · Config/i18n) → language flags work → Deploy
3. Add **Phase 6** (US4 · SEO) → metadata correct → Deploy
4. **Phase 7** (Polish) → accessibility + performance hardening → Final release

---

## Notes

- `[P]` tasks = different files, no blocking dependency on each other in the same batch
- `[USn]` maps each task to its user story for traceability to `spec.md`
- Every test task MUST be written BEFORE its implementation counterpart (TDD — Constitution Principle II)
- `config.json` is gitignored; only `config.example.json` is committed
- Commit after each phase checkpoint or logical group; PRs reviewed with constitution compliance checklist
- Avoid cross-phase file conflicts: check no two parallel tasks write to the same file
