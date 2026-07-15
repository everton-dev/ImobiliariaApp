# Research: Real Estate Lead-Generation Site (001-realtor-lead-site)

**Feature**: `001-realtor-lead-site`
**Date**: 2026-07-15
**Stack**: Angular 18+ / Angular Material · .NET 10 Azure Functions (isolated worker) · SQL Server

---

## Decision 1: Frontend Framework & Component Library

**Decision**: Angular 18+ with Angular Material Design 3 (MD3).

**Rationale**: Explicitly selected by product owner. Angular 18 standalone components and signals-based reactivity eliminate NgModule boilerplate. Angular Material 3 ships accessible, pre-built components (Toolbar, Sidenav, Card, Button, Badge) that satisfy the WCAG 2.1 AA baseline (Principle VI) with minimal custom CSS.

**Alternatives considered**:
- React + MUI: rejected — owner explicitly chose Angular.
- Custom CSS component library: rejected — Angular Material provides tested accessibility primitives, saving significant effort on focus management and contrast.

---

## Decision 2: Backend Runtime & Architecture Pattern

**Decision**: .NET 10 Azure Functions App, isolated worker model, one Function App acting as the monolith HTTP API.

**Rationale**: Isolated worker decouples the Functions host from the .NET runtime, enabling the full .NET 10 feature set (minimal-API-style middleware, DI container, custom serialization). A single Function App with `HttpTrigger` functions organized by domain module satisfies the monolith API requirement without over-engineering.

**Alternatives considered**:
- ASP.NET Core Web API (as stated in constitution Technology section): architecturally equivalent; Azure Functions chosen for consumption-plan cost efficiency and zero-server-management. See Complexity Tracking in `plan.md`.
- Multiple Function Apps: rejected (KISS — a single app is sufficient for this feature's entire scope).

---

## Decision 3: Database & Persistence

**Decision**: SQL Server (Azure SQL in production, SQL Server Express / LocalDB in development) with Entity Framework Core 10, code-first migrations.

**Feature-specific finding**: Feature `001-realtor-lead-site` has **no database persistence requirement**. The spec explicitly states: "WhatsApp is the sole conversion channel; no on-site contact form or lead-capture database is required." Site configuration is a plain static file, not a database record. SQL Server infrastructure (connection string, DbContext, EF Core registration, migration runner) will be **scaffolded but no tables are created for this feature**. Tables arrive with future features (property listings, contracts, etc.).

**Alternatives considered**:
- Azure Cosmos DB: rejected — relational model better fits the real estate domain long-term.
- Storing configuration in the database: rejected — spec mandates a plain JSON/YAML file editable via text editor with no admin panel.

---

## Decision 4: Runtime Configuration Loading

**Decision**: Single JSON file (`/assets/config.json`) bundled as a static Angular asset. Angular `APP_INITIALIZER` token fetches and validates it before bootstrap. The Angular SPA fetches this file directly via `HttpClient`; the backend serves it only if the owner prefers API-mediated config delivery.

**Rationale**: JSON is natively parsed by the browser (no extra library). Placing the file in `/assets/` lets the owner overwrite it through any hosting file manager. YAML parsing would require `js-yaml` — an extra dependency contradicting KISS.

```
// Angular app.config.ts (provider pattern)
{
  provide: APP_INITIALIZER,
  useFactory: (cfg: ConfigService) => () => cfg.load(),
  deps: [ConfigService],
  multi: true
}
```

**Fallback behaviour**: `ConfigService.load()` catches all HTTP errors and applies hard-coded safe defaults before resolving. The app never blocks on a missing or malformed config (FR-011).

**Alternatives considered**:
- API endpoint only (`GET /api/config`): still defined as a contract (see `contracts/`) for future flexibility, but the default deployment uses the static file directly.
- Angular `environment.ts`: build-time only — not runtime-editable by the owner without a redeploy.

---

## Decision 5: Multilingual / i18n Strategy

**Decision**: Custom `LanguageService` that resolves translated strings from the config structure `{ "pt": "...", "en": "...", "es": "..." }`. No third-party i18n library.

**Rationale**: The config schema already carries all translations. A thin service that reads `field[currentLang] ?? field.pt` is the simplest implementation (KISS), has zero extra dependencies, and trivially satisfies the instant-switch requirement (FR-019) via an Angular Signal or `BehaviorSubject`.

```typescript
// core/services/language.service.ts (sketch)
export type LangCode = 'pt' | 'en' | 'es';
export interface TranslatedString { pt: string; en: string; es: string; }

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal<LangCode>('pt');         // default: Brazilian Portuguese
  translate(field: TranslatedString): string {
    return field[this.lang()] ?? field.pt;         // FR-021 fallback
  }
  switch(code: LangCode): void { this.lang.set(code); }
}
```

**Alternatives considered**:
- `@ngx-translate/core`: mature but redundant — requires separate JSON translation files when the config already carries all strings.
- Angular `@angular/localize` (compile-time): a separate build per language; incompatible with runtime instant-switching (FR-019).
- `transloco`: well-regarded, but still an external dependency when config covers the need.

---

## Decision 6: Hash-Fragment Navigation & Deep-Linking

**Decision**: Angular Router with the default `PathLocationStrategy`. Section navigation calls `Router.navigate([], { fragment: 'about-me', replaceUrl: false })`. An `IntersectionObserver` tracks which section is in the viewport and updates the URL fragment. On cold load, `ActivatedRoute.fragment` is read once and `ViewportScroller.scrollToAnchor()` is called.

**Why not `HashLocationStrategy`**: That strategy produces `/#/about-me` (Angular's Router-level hash with a leading slash), not `/#about-me` as the spec requires (FR-007a). PathLocationStrategy with the Router's `anchorScrolling: 'enabled'` option gives the correct URL format.

**Hosting note**: The SPA host must serve `index.html` for all paths so direct hash URLs don't 404.
- Azure Static Web Apps: add `staticwebapp.config.json` with `navigationFallback`.
- Azure Blob Storage static hosting: set the 404 document to `index.html`.

**Alternatives considered**:
- Manual `window.history.replaceState`: brittle; skips Angular Router state tracking.
- Plain anchor `<a href="#section">` only: no active-state tracking, no deep-link scroll on load.

---

## Decision 7: WhatsApp Deep-Link Strategy

**Decision**: `https://wa.me/{phone}?text={encodedMessage}` — the universal wa.me link.

**Rationale**: A single `wa.me` URL opens the native WhatsApp app on mobile (when installed) and WhatsApp Web on desktop, covering FR-004 in one URL. Phone number must be in international E.164 format without `+` or spaces (e.g., `5511999998888`).

```typescript
// core/services/whatsapp.service.ts (sketch)
buildUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
```

**Fallback for unavailability**: The Contact section always displays the formatted phone number below the WhatsApp button. If the visitor cannot reach WhatsApp (network block, unsupported platform), they can copy the number manually. Programmatic detection of WhatsApp reachability before the tap is not reliably possible; the phone-number display is the explicit fallback per the edge-case requirement in the spec.

**Alternatives considered**:
- `whatsapp://send?phone=...` deep-link: platform-specific; requires a separate fallback URL for desktop — more complex for no gain.
- Custom tracking endpoint: rejected — spec explicitly excludes a lead-capture database for this feature.

---

## Decision 8: SEO — Angular Meta Service vs. Server-Side Rendering

**Decision**: Angular `Meta` + `Title` services update `<head>` dynamically on active-section change. Meaningful static Open Graph tags are placed in `index.html` for the root URL social preview. No SSR for this feature.

**Rationale**:
- **Google indexing (SC-005)**: Googlebot renders JavaScript SPAs; Angular `Meta` service updates are crawled. Dynamic meta satisfies the SEO audit requirement.
- **Social sharing (SC-006)**: Social platforms (Facebook, Twitter/X, LinkedIn) fetch the root URL when a link is shared. Hash fragments (`/#clients`) are stripped by most platforms so they receive the root URL's `index.html` meta — which is populated statically. Per-section OG tags are therefore not required for social sharing to work correctly.

**SSR trade-off note**: Angular SSR (`@angular/ssr` + Node.js runtime) would enable per-section OG previews but requires a separate Node.js Azure Functions layer alongside the .NET Functions App — adding operational complexity not justified by the feature's social-sharing requirements.

**Structured data**: A `LocalBusiness` JSON-LD block is injected via Angular `Meta` service into the document `<head>` on first render (US4-SC3).

**Alternatives considered**:
- Angular SSR: deferred to a future feature if the owner needs per-section social sharing.
- Build-time prerendering: contradicts the runtime-loaded configuration requirement.

---

## Decision 9: Testing Strategy

| Layer | Framework | Rationale |
|-------|-----------|-----------|
| Angular unit tests | **Jest** (`@angular-builders/jest`) | Faster than Karma; better DX; officially supported by Angular CLI 18+ |
| Angular E2E tests | **Playwright** | Cross-browser, handles hash navigation and dynamic content, lighter than Cypress |
| .NET unit tests | **xUnit + Moq** | Community standard for isolated-worker Functions; integrates with `dotnet test` |
| .NET integration tests | **xUnit + `WebApplicationFactory`** (or Functions worker test host) | Validates full HTTP request/response cycle including middleware |

All test suites are wired into CI; build fails on test failure (Principle II, Development Workflow gate).

**Alternatives considered**:
- Karma + Jasmine (Angular default): rejected — slower build feedback loop.
- Cypress: rejected — Playwright has broader browser support and better GitHub Actions integration.
- NUnit / MSTest: rejected — xUnit is the standard for new .NET Core projects.

---

## Decision 10: Project Structure

**Decision**: Two-root web application layout — `frontend/` for the Angular workspace, `backend/` for the .NET Functions App.

```
frontend/
  src/
    app/
      core/
        models/       # TypeScript interfaces (SiteConfig, TranslatedString, etc.)
        services/     # ConfigService, LanguageService, WhatsAppService, SeoService
      features/
        about-me/     # AboutMeComponent
        my-process/   # MyProcessComponent
        clients/      # ClientsComponent (testimonials)
        contact/      # ContactComponent (WhatsApp button only)
      shared/
        components/   # StickyHeaderComponent, WhatsAppButtonComponent, FlagPickerComponent
        pipes/        # TranslatePipe (wraps LanguageService.translate())
    assets/
      config.json     # Runtime site configuration (owner edits this file)
    index.html        # Static OG meta for root URL

backend/
  src/
    ImobiliariaApp.Functions/
      Functions/      # HttpTrigger Azure Functions (e.g., ConfigFunction.cs)
      Services/       # Application-layer services
      Models/         # DTOs (SiteConfigDto, TranslatedStringDto, etc.)
      Configuration/  # IOptions<T> settings classes
  tests/
    ImobiliariaApp.Functions.Tests/   # xUnit test project
```

**Rationale**: Clear physical separation enables independent CI/CD pipelines per layer. Each sub-project independently follows Principle I (layered architecture). The Angular `core/` layer mirrors the Domain/Application split from the constitution; Angular `shared/` components are pure presentation.

---

## Resolved Items Summary

| Item | Resolution |
|------|-----------|
| Frontend framework | Angular 18+ + Angular Material 3 |
| Backend runtime | .NET 10 Azure Functions (isolated worker) |
| Database | SQL Server / EF Core — scaffolded, no tables for this feature |
| Config loading | Static `/assets/config.json` + `APP_INITIALIZER`; `GET /api/config` as optional API contract |
| i18n strategy | Custom `LanguageService` reading from config — no third-party library |
| Hash navigation | Angular Router `PathLocationStrategy` + `anchorScrolling` + `IntersectionObserver` |
| WhatsApp deep-link | `wa.me` universal link + phone-number display fallback |
| SEO / OG meta | Angular `Meta`+`Title` services + static `index.html` OG tags — no SSR |
| Testing | Jest + Playwright (frontend), xUnit + Moq (backend) |
| Project structure | `frontend/` + `backend/` two-root layout |
