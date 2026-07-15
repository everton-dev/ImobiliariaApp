# Implementation Plan: Real Estate Lead-Generation Site

**Branch**: `001-realtor-lead-site` | **Date**: 2026-07-15 | **Spec**: [spec.md](spec.md)

**Input**: [spec.md](spec.md) · [research.md](research.md) · [data-model.md](data-model.md) · [contracts/](contracts/)

---

## Summary

Build a single-page Angular 18+ lead-generation site (mobile-first, Angular Material, three-language i18n) backed by an optional .NET 10 Azure Functions monolith API. All site content is driven by a runtime-editable `config.json` file. The entire user journey funnels to WhatsApp via `wa.me` deep-links. SQL Server and EF Core are provisioned as shared infrastructure; no database tables are required for this feature.

---

## Technical Context

**Language/Version**: TypeScript 5.x (Angular 18+) · C# 13 / .NET 10

**Primary Dependencies**:
- Frontend: `@angular/core` 18+, `@angular/material` 18+, `@angular/router`
- Backend: `Microsoft.Azure.Functions.Worker` (.NET 10 isolated), `Microsoft.EntityFrameworkCore.SqlServer`
- Testing: Jest + `@angular-builders/jest`, Playwright (frontend); xUnit + Moq (backend)

**Storage**: SQL Server (Azure SQL in prod, LocalDB in dev) — EF Core 10, code-first. No tables for this feature; DbContext scaffolded for future features.

**Testing**: `npx jest` (Angular unit), `npx playwright test` (Angular E2E), `dotnet test` (xUnit)

**Target Platform**: Browser SPA (Chrome, Firefox, Safari, Edge) + Azure Static Web Apps (frontend), Azure Functions consumption plan (backend)

**Project Type**: Web application — Angular SPA frontend + Azure Functions monolith HTTP API backend

**Performance Goals**:
- SC-004: Primary content + WhatsApp CTA usable within 3 seconds on a typical mobile connection
- SC-010: Language switch completes within 1 second (client-side only — no network round-trip)

**Constraints**:
- FR-009: Layout usable from 320 px to 1920 px
- FR-011: Site must remain usable when `config.json` fails to load (safe defaults, no blank page)
- FR-004: WhatsApp CTA must degrade gracefully when WhatsApp is unavailable (show phone number)
- WCAG 2.1 AA: keyboard navigation, sufficient contrast, labeled controls (SC-009)

**Scale/Scope**: Single-agent personal site; low traffic (informational / lead-gen). No database load for this feature. Performance profile is dominated by initial asset load and config fetch.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Clean & Layered Architecture ✅

Frontend follows a strict three-tier layout:

| Layer | Location | Contents |
|-------|----------|----------|
| Domain/Application | `core/models/`, `core/services/` | `SiteConfig` interfaces, `ConfigService`, `LanguageService`, `WhatsAppService`, `SeoService` — no Angular Material imports |
| Presentation | `features/*/`, `shared/components/` | Angular Material components; consumes services only through injected interfaces |
| Infrastructure | `core/services/config.service.ts` (HTTP fetch) | Only place that knows about `HttpClient` and the config file URL |

Backend follows the same inward-dependency rule:

| Layer | Location | Contents |
|-------|----------|----------|
| Domain (thin — no DB for this feature) | `Models/` DTOs | Plain C# record types |
| Application | `Services/` | Config loading logic |
| Infrastructure/Presentation | `Functions/` | `HttpTrigger` functions (entry points); EF Core `DbContext` registration (for future features) |

Cross-layer leakage check: Angular Material types do NOT appear in `core/models/` or `core/services/`; EF entities are NOT returned by Functions endpoints.

### II. Test-First Development (NON-NEGOTIABLE) ✅

Every functional requirement has at least one automated test. TDD order per task:

1. Write test (Jest unit or Playwright E2E for frontend; xUnit for backend)
2. Run — expect FAIL
3. Implement to GREEN
4. Refactor

No task in `tasks.md` can be marked complete without accompanying tests. CI pipeline fails on any test failure.

### III. Data Integrity & Security ✅

- `config.json` is a public read-only file — no secrets. `agentPhone` is non-sensitive configuration, not a secret.
- No auth/authz required: site is fully public (no non-public endpoints in this feature).
- `wa.me` URL is constructed via `encodeURIComponent()` — no injection risk.
- Config values are validated/sanitized before use: phone number stripped of non-digits; translatable fields validated for `pt` key presence.
- HTTPS is mandatory for production deployment (Azure Static Web Apps enforces it).
- No secrets committed: connection string lives in `local.settings.json` (gitignored) and Azure Function App settings in production.

### IV. Clean Code, DRY & KISS ✅

- `TranslatePipe` wraps `LanguageService.translate()` — single source of truth for field resolution.
- `WhatsAppService.buildUrl()` — one method, used by all CTAs.
- `SeoService.update()` — one method, called by the section-scroll observer.
- No third-party i18n library: config schema already carries all strings.
- No SSR: not justified by requirements (see research Decision 8).

### V. Purposeful Design Patterns ✅

Patterns in use and their justification:

| Pattern | Where | Justification |
|---------|-------|--------------|
| Service (Dependency Injection) | `ConfigService`, `LanguageService`, `WhatsAppService`, `SeoService` | Angular DI is the native mechanism; eliminates direct instantiation |
| Signal (reactive state) | `LanguageService.lang`, `active section` | Replaces RxJS Subject for simple scalar state — no over-engineering |
| `APP_INITIALIZER` | `ConfigService.load()` | Framework-standard way to block bootstrap until config is ready |
| `IntersectionObserver` | Section scroll tracking | Browser native API — no library needed |
| `TranslatePipe` (Pipe pattern) | Template binding | Clean separation: templates use `{{ field \| translate }}`, know nothing about `LangCode` |

Speculative patterns deliberately excluded: Repository (no DB for this feature), Factory (no complex object graphs), Strategy (single WhatsApp link strategy), Observable chains (Signals sufficient).

### VI. UX Simplicity & Accessibility ✅

- Sticky header always visible; exactly four nav items per FR-006.
- WhatsApp CTA reachable in ≤2 taps from any section (SC-001, SC-002).
- Flag icons as language toggles — intuitive, no dropdown overhead.
- WCAG 2.1 AA baseline: `mat-icon-button` with `aria-label` on flag buttons; `MatToolbar` with `role="navigation"`; keyboard focus visible on all interactive elements.
- Contact section: single button (WhatsApp icon + "Contact us" label) — minimal, unambiguous.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-realtor-lead-site/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── api-config.md    # GET /api/v1/config contract
│   └── config-schema.md # config.json schema + annotated example
└── tasks.md             # Phase 2 output (/speckit-tasks — not yet created)
```

### Source Code (repository root)

```text
frontend/                          # Angular 18+ workspace
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   └── site-config.model.ts        # SiteConfig, TranslatedString, etc.
│   │   │   └── services/
│   │   │       ├── config.service.ts            # APP_INITIALIZER, config fetch + defaults
│   │   │       ├── language.service.ts          # LangCode Signal, translate(), switch()
│   │   │       ├── whatsapp.service.ts          # buildUrl(), phone display fallback
│   │   │       └── seo.service.ts               # Meta + Title service wrapper
│   │   ├── features/
│   │   │   ├── hero/
│   │   │   │   └── hero.component.ts            # Full-viewport hero: bg image, eyebrow, heading, stats bar, CTAs
│   │   │   ├── about-me/
│   │   │   │   └── about-me.component.ts
│   │   │   ├── my-process/
│   │   │   │   └── my-process.component.ts
│   │   │   ├── clients/
│   │   │   │   └── clients.component.ts
│   │   │   └── contact/
│   │   │       └── contact.component.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── agent-highlight/
│   │   │   │   │   └── agent-highlight.component.ts  # Cream strip: photo + bio + credential
│   │   │   │   ├── footer/
│   │   │   │   │   └── footer.component.ts           # 3-column footer: brand, nav links, copyright
│   │   │   │   ├── sticky-header/
│   │   │   │   │   └── sticky-header.component.ts    # Fixed nav: transparent→frosted glass, hamburger
│   │   │   │   ├── testimonial-card/
│   │   │   │   │   └── testimonial-card.component.ts # Star rating, quote, avatar/initials
│   │   │   │   ├── whatsapp-button/
│   │   │   │   │   └── whatsapp-button.component.ts
│   │   │   │   └── whatsapp-float/
│   │   │   │       └── whatsapp-float.component.ts   # Fixed bottom-right 56px green circle
│   │   │   └── pipes/
│   │   │       └── translate.pipe.ts               # {{ field | translate }}
│   │   └── app.component.ts                        # Root component, section wiring
│   ├── assets/
│   │   ├── config.json                             # Runtime site config (owner edits, gitignored)
│   │   └── config.example.json                     # Committed annotated example
│   └── index.html                                  # Static OG meta for root URL
├── e2e/                                            # Playwright E2E tests
│   ├── whatsapp-cta.spec.ts
│   ├── navigation.spec.ts
│   ├── language-switch.spec.ts
│   └── seo.spec.ts
├── jest.config.ts
└── playwright.config.ts

backend/                           # .NET 10 Azure Functions App (isolated worker)
├── src/
│   └── ImobiliariaApp.Functions/
│       ├── Functions/
│       │   └── ConfigFunction.cs                   # GET /api/v1/config HttpTrigger
│       ├── Services/
│       │   └── ConfigFileService.cs                # Reads config.json from disk/blob
│       ├── Models/
│       │   ├── SiteConfigDto.cs
│       │   ├── TranslatedStringDto.cs
│       │   └── ... (all DTOs from data-model.md)
│       ├── Infrastructure/
│       │   └── AppDbContext.cs                     # EF Core DbContext (no tables yet)
│       ├── Configuration/
│       │   └── AppSettings.cs                      # IOptions<T> settings classes
│       ├── Program.cs                              # Host builder, DI registration
│       └── host.json
└── tests/
    └── ImobiliariaApp.Functions.Tests/
        ├── ConfigFunctionTests.cs
        └── ConfigFileServiceTests.cs
```

**Design System** (implemented in `frontend/src/styles.scss`):

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#F7F4EF` | Page base background |
| `--bg-elevated` | `#EFECE5` | Alternating section strips (AgentHighlight, MyProcess) |
| `--text` | `#0D0D0B` | Primary text; Contact section background |
| `--accent` | `#C9A84C` | Gold: CTA buttons, card borders on hover, eyebrow dot |
| `--accent-dark` | `#9E7E35` | Gold hover state |
| `--muted` | `#726D66` | Secondary/caption text |
| `--nav-h` | `80px` | Fixed nav height (shrinks to 60px on scroll) |
| Heading font | `Playfair Display` | Headings, stat numbers, italic emphasis |
| Body font | `DM Sans` | Body copy, nav items, buttons |

**Section DOM Order** (app.component.html):
`WhatsAppFloat → StickyHeader → Hero → AgentHighlight → AboutMe → MyProcess → Clients → Contact → Footer`

**Structure Decision**: Two-root web application layout (`frontend/` + `backend/`) per research Decision 10. This is the "Option 2: Web application" from the plan template, adapted with Azure Functions in the backend root instead of a traditional ASP.NET Core project. Each root has its own CI/CD pipeline and test suite.

---

## Constitution Check — Post-Design Re-evaluation

*All gates remain PASS after Phase 1 design. No violations introduced.*

| Principle | Pre-design | Post-design | Change |
|-----------|-----------|-------------|--------|
| I. Clean & Layered Architecture | ✅ | ✅ | None |
| II. Test-First | ✅ | ✅ | None |
| III. Data Integrity & Security | ✅ | ✅ | None |
| IV. Clean Code, DRY & KISS | ✅ | ✅ | None |
| V. Purposeful Design Patterns | ✅ | ✅ | None |
| VI. UX Simplicity & Accessibility | ✅ | ✅ | None |

---

## Complexity Tracking

> One justified deviation documented.

| Deviation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Azure Functions instead of ASP.NET Core Web API (constitution lists ASP.NET Core as default) | Azure Functions on consumption plan eliminates server management for a low-traffic personal site; `HttpTrigger` functions are architecturally equivalent to controllers; the isolated worker model supports full .NET 10 DI and middleware | ASP.NET Core Web API requires an App Service or Container — additional infrastructure cost and management overhead for a site that may receive minimal traffic; no capability gap that justifies the cost difference |

All other decisions are within constitution constraints.
