# Quickstart Validation Guide: Real Estate Lead-Generation Site (001-realtor-lead-site)

**Feature**: `001-realtor-lead-site`
**Date**: 2026-07-15
**Purpose**: Runnable end-to-end validation scenarios that prove the feature works. This is not an implementation guide — see `tasks.md` for implementation steps.

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 20 LTS+ | `node -v` |
| Angular CLI | 18+ | `ng version` |
| .NET SDK | 10.0+ | `dotnet --version` |
| Azure Functions Core Tools | v4+ | `func --version` |
| SQL Server / LocalDB | 2019+ | `sqlcmd -?` (LocalDB for dev) |

---

## Setup

### 1 — Install frontend dependencies

```bash
cd frontend
npm install
```

### 2 — Configure the site

Copy and customize the example config:

```bash
cp frontend/src/assets/config.example.json frontend/src/assets/config.json
```

Edit `frontend/src/assets/config.json` and set at minimum:

- `site.agentPhone` — a real WhatsApp number in E.164 format without `+` (e.g. `"5511999998888"`)
- `site.agentName` — the agent's name

Full schema reference: [contracts/config-schema.md](contracts/config-schema.md)

### 3 — Start the Angular dev server

```bash
cd frontend
ng serve
```

Angular SPA available at: `http://localhost:4200`

### 4 — (Optional) Start the backend Functions App

```bash
cd backend/src/ImobiliariaApp.Functions
func start
```

Functions host available at: `http://localhost:7071`

---

## Validation Scenarios

Run these scenarios in the order listed. Each maps to a User Story in [spec.md](spec.md).

---

### VS1 — WhatsApp Call-to-Action (User Story 1 · P1)

**Goal**: Verify a visitor can open a WhatsApp conversation in ≤2 taps from any section.

**Steps**:

1. Open `http://localhost:4200` on a mobile device or in Chrome DevTools mobile view (375 px width).
2. Scroll to any section that has a WhatsApp call-to-action button.
3. Tap the button.

**Expected outcomes**:

- [ ] The native WhatsApp app opens (if installed) with the agent's number pre-filled.
- [ ] On desktop without the app, `wa.me` redirects to WhatsApp Web in a new tab.
- [ ] The pre-filled message is in the currently selected language (default: Brazilian Portuguese).
- [ ] The "Contact" section's button shows a WhatsApp icon and the label matching `config.contact.buttonLabel.pt` (default: "Fale Conosco").

**Edge case — WhatsApp unavailable**:

4. Disconnect from the internet and tap the button.
5. Expected: the agent's phone number is displayed somewhere on the Contact section, copyable.

**Spec references**: FR-002, FR-003, FR-004, FR-006, SC-001, SC-002

---

### VS2 — Sticky Header Navigation (User Story 2 · P1)

**Goal**: Verify the header stays fixed and navigates correctly on all screen sizes.

**Steps**:

1. Open `http://localhost:4200` in a desktop browser (≥1024 px width).
2. Scroll down past the first section.
3. Observe the header.
4. Click each of the four nav items in sequence.
5. Resize the viewport to 375 px (mobile).
6. Observe the header.

**Expected outcomes**:

- [ ] Header stays visible (position: fixed) while scrolling at any screen width.
- [ ] Exactly four nav items are visible: "Sobre Mim", "Meu Processo", "Clientes", "Contato" (or translated equivalents).
- [ ] Clicking a nav item smoothly scrolls to the corresponding section.
- [ ] The URL updates to the section's hash fragment (e.g., `/#about-me`) without a page reload.
- [ ] The active nav item has a visually distinct style (underline, color, etc.).
- [ ] At 375 px, the nav collapses to a hamburger menu exposing the same four items.

**Spec references**: FR-005, FR-006, FR-007, FR-007a, FR-008, FR-009, SC-003, SC-007

---

### VS3 — Dynamic Configuration Loading (User Story 3 · P2)

**Goal**: Verify that config changes appear on reload without a code change.

**Steps — config change**:

1. Note the current heading text for the "About Me" section.
2. Edit `frontend/src/assets/config.json`: change `sections.aboutMe.heading.pt` to `"Teste de Configuração"`.
3. Save the file. The Angular dev server hot-reloads automatically.
4. Observe the "About Me" section heading.

**Expected outcomes**:

- [ ] The "About Me" section heading now reads "Teste de Configuração" without any code change.

**Steps — config unavailable**:

5. Rename `config.json` to `config.json.bak` temporarily.
6. Hard-reload the browser (`Ctrl+Shift+R`).
7. Rename the file back.

**Expected outcomes**:

- [ ] The site loads with safe default content (no blank page, no unhandled error).
- [ ] The WhatsApp button may be disabled (phone number is empty in defaults).

**Steps — missing translation key**:

8. Edit `config.json`: remove the `"en"` key from any one translatable field (e.g., `sections.aboutMe.heading`).
9. Switch the site language to English.

**Expected outcomes**:

- [ ] The field with the missing `en` translation shows the Portuguese (`pt`) value instead of an empty string.

**Spec references**: FR-010, FR-011, FR-017, FR-018, FR-019, FR-021, SC-008, SC-010, SC-011
 (User Story 3 · P2)

**Goal**: Verify all three language flags switch content instantly without a page reload.

**Steps**:

1. Open `http://localhost:4200`. Default language: Brazilian Portuguese.
2. Click the UK flag.
3. Click the Spain flag.
4. Click the Brazil flag.

**Expected outcomes** (per language switch):

- [ ] All visible text content switches to the selected language immediately (< 1 second) with no page reload.
- [ ] Nav item labels update.
- [ ] Section headings and body text update.
- [ ] WhatsApp pre-filled message language matches the selected language.
- [ ] The flag icons are visually distinct and each has an accessible label (check DevTools → Accessibility tree).

**Spec references**: FR-017, FR-018, FR-019, FR-020, SC-010, SC-011

---

### VS5 — Hash-Fragment Deep-Linking (User Story 2 · P1)

**Goal**: Verify section URLs are bookmarkable and load correctly on a cold visit.

**Steps**:

1. Navigate directly to `http://localhost:4200/#clients` (paste into address bar, press Enter).

**Expected outcomes**:

- [ ] The page loads and scrolls immediately to the "Clients" section without user interaction.
- [ ] The URL remains `/#clients`.
- [ ] The "Clients" nav item shows as active.

2. Repeat for `/#about-me`, `/#my-process`, `/#contact`.

**Spec references**: FR-007a, SC-012

---

### VS6 — SEO & Open Graph (User Story 4 · P2)

**Goal**: Verify the page has correct metadata for search engines and social sharing.

**Steps**:

1. Open `http://localhost:4200`.
2. Open Chrome DevTools → Elements → `<head>`.
3. Verify the following tags exist and are non-empty at root load.

**Expected `<head>` tags at root load**:

- [ ] `<title>` — non-empty, matches `site.title.pt`
- [ ] `<meta name="description">` — non-empty, matches `site.description.pt`
- [ ] `<meta property="og:title">` — non-empty
- [ ] `<meta property="og:description">` — non-empty
- [ ] `<meta property="og:image">` — matches `site.ogImage` (if set)
- [ ] `<script type="application/ld+json">` — contains a `LocalBusiness` structured data block

4. Click the "About Me" nav item. Inspect `<title>` and `<meta name="description">`.

**Expected on section change**:

- [ ] `<title>` updates to the active section's `seo.title.pt` value.
- [ ] `<meta name="description">` updates to `seo.description.pt`.

**Spec references**: FR-012, FR-013, FR-014, FR-015, SC-005, SC-006

---

### VS7 — Accessibility Baseline (Cross-cutting · WCAG 2.1 AA)

**Goal**: Verify keyboard navigation and accessibility of header and call-to-action controls.

**Steps**:

1. Open `http://localhost:4200`.
2. Using only the keyboard (Tab, Enter, Space, Escape):
   - Navigate through all four header nav items.
   - Open the mobile hamburger menu (if on small viewport).
   - Activate the WhatsApp call-to-action in the Contact section.
3. Run the Chrome Lighthouse accessibility audit (DevTools → Lighthouse → Accessibility).

**Expected outcomes**:

- [ ] All nav items and the WhatsApp button are reachable and activatable by keyboard.
- [ ] Flag icons have accessible labels (visible text or `aria-label`).
- [ ] Lighthouse accessibility score ≥ 90 (WCAG 2.1 AA baseline for header + call-to-action).
- [ ] No contrast errors on text over primary backgrounds.

**Spec references**: FR-016, SC-009

---

## Optional: Backend Contract Validation

If the `.NET` Functions backend is running (`func start` on port 7071):

```bash
curl -s http://localhost:7071/api/v1/config | python -m json.tool
```

**Expected**: Returns the full `SiteConfigDto` JSON without errors. See [contracts/api-config.md](contracts/api-config.md) for the expected shape.

---

## Running Tests

### Frontend unit tests

```bash
cd frontend
npx jest
```

Expected: all tests pass.

### Frontend E2E tests

```bash
cd frontend
npx playwright test
```

Expected: all scenarios pass; see `frontend/e2e/` for test files.

### Backend unit tests

```bash
cd backend
dotnet test
```

Expected: all tests pass.
