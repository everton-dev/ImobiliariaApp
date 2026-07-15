# Data Model: Real Estate Lead-Generation Site (001-realtor-lead-site)

**Feature**: `001-realtor-lead-site`
**Date**: 2026-07-15
**Tech**: Angular 18+ / .NET 10 Azure Functions / SQL Server

---

## Overview

This feature has **no database tables**. The spec explicitly states: "WhatsApp is the sole conversion channel; no on-site contact form or lead-capture database is required." All data for this feature lives in a **runtime-loaded JSON configuration file** (`/assets/config.json`) and is modelled as TypeScript interfaces on the frontend and as DTOs on the backend.

SQL Server and Entity Framework Core are provisioned as infrastructure for future features; no migrations are created in this feature.

---

## Configuration File Schema (`/assets/config.json`)

This is the single source of truth for all site content and settings. Rules:

- **Translatable fields**: object with keys `"pt"`, `"en"`, `"es"` (all three required)
- **Non-translatable fields**: plain scalar (string, number, boolean, array)
- **Missing field fallback**: `LanguageService.translate()` returns the `pt` value when the requested language key is absent

### Full Schema

```json
{
  "site": {
    "title":            { "pt": "string", "en": "string", "es": "string" },
    "description":      { "pt": "string", "en": "string", "es": "string" },
    "ogImage":          "string (URL)",
    "agentName":        "string",
    "agentPhone":       "string (E.164 without +, e.g. 5511999998888)",
    "agentPhotoUrl":    "string (URL, optional)",
    "agentCredential":  "string (e.g. 'CRECI 12345')",
    "agentTagline":     { "pt": "string", "en": "string", "es": "string" },
    "agentBio1":        { "pt": "string", "en": "string", "es": "string" },
    "agentBio2":        { "pt": "string", "en": "string", "es": "string" },
    "instagramUrl":     "string (URL, optional)",
    "defaultLanguage":  "string ('pt' | 'en' | 'es')"
  },
  "sections": {
    "hero": {
      "enabled":             "boolean",
      "eyebrow":             { "pt": "string", "en": "string", "es": "string" },
      "heading":             { "pt": "string", "en": "string", "es": "string" },
      "headingEmphasis":     { "pt": "string", "en": "string", "es": "string" },
      "subheading":          { "pt": "string", "en": "string", "es": "string" },
      "backgroundImageUrl":  "string (URL)",
      "ctaPrimary":          { "pt": "string", "en": "string", "es": "string" },
      "ctaSecondaryLabel":   { "pt": "string", "en": "string", "es": "string" },
      "ctaSecondaryAnchor":  "string (e.g. '#about-me')",
      "stats": [
        { "value": "string", "label": { "pt": "string", "en": "string", "es": "string" } }
      ],
      "seo": {
        "title":       { "pt": "string", "en": "string", "es": "string" },
        "description": { "pt": "string", "en": "string", "es": "string" }
      }
    },
    "aboutMe": {
      "enabled":    "boolean",
      "heading":    { "pt": "string", "en": "string", "es": "string" },
      "body":       { "pt": "string", "en": "string", "es": "string" },
      "photoUrl":   "string (URL, optional)",
      "whatsapp": {
        "label":   { "pt": "string", "en": "string", "es": "string" },
        "message": { "pt": "string", "en": "string", "es": "string" }
      },
      "seo": {
        "title":       { "pt": "string", "en": "string", "es": "string" },
        "description": { "pt": "string", "en": "string", "es": "string" }
      }
    },
    "myProcess": {
      "enabled":    "boolean",
      "heading":    { "pt": "string", "en": "string", "es": "string" },
      "steps": [
        {
          "heading": { "pt": "string", "en": "string", "es": "string" },
          "body":    { "pt": "string", "en": "string", "es": "string" }
        }
      ],
      "whatsapp": {
        "label":   { "pt": "string", "en": "string", "es": "string" },
        "message": { "pt": "string", "en": "string", "es": "string" }
      },
      "seo": {
        "title":       { "pt": "string", "en": "string", "es": "string" },
        "description": { "pt": "string", "en": "string", "es": "string" }
      }
    },
    "clients": {
      "enabled":    "boolean",
      "heading":    { "pt": "string", "en": "string", "es": "string" },
      "testimonials": [
        {
          "quote":     { "pt": "string", "en": "string", "es": "string" },
          "clientName": "string",
          "photoUrl":   "string (URL, optional)"
        }
      ],
      "seo": {
        "title":       { "pt": "string", "en": "string", "es": "string" },
        "description": { "pt": "string", "en": "string", "es": "string" }
      }
    },
    "contact": {
      "enabled":    "boolean",
      "heading":    { "pt": "string", "en": "string", "es": "string" },
      "body":       { "pt": "string", "en": "string", "es": "string" },
      "buttonLabel":{ "pt": "string", "en": "string", "es": "string" },
      "whatsapp": {
        "message": { "pt": "string", "en": "string", "es": "string" }
      },
      "seo": {
        "title":       { "pt": "string", "en": "string", "es": "string" },
        "description": { "pt": "string", "en": "string", "es": "string" }
      }
    },
    "footer": {
      "copyrightName": "string",
      "developerLabel":{ "pt": "string", "en": "string", "es": "string" },
      "developerUrl":  "string (URL)"
    }
  },
  "nav": {
    "aboutMe":   { "pt": "string", "en": "string", "es": "string" },
    "myProcess": { "pt": "string", "en": "string", "es": "string" },
    "clients":   { "pt": "string", "en": "string", "es": "string" },
    "contact":   { "pt": "string", "en": "string", "es": "string" }
  }
}
```

### Field Rules & Validation

| Field | Required | Validation |
|-------|----------|-----------|
| `site.agentPhone` | Yes | Digits only, 10–15 chars (E.164 without `+`) |
| `site.defaultLanguage` | No | Must be `'pt'`, `'en'`, or `'es'`; defaults to `'pt'` if absent |
| `sections.*.enabled` | Yes | Boolean; if `false`, the nav item is hidden and the section is not rendered |
| `sections.*.whatsapp.message` | Yes (where applicable) | Translatable string; must have at least `pt` key |
| Translatable field | Partial | `pt` key is required; `en`/`es` fall back to `pt` if absent |
| `testimonials[].quote.pt` | Yes | Non-empty string |
| `testimonials[].clientName` | Yes | Non-empty string |
| `testimonials[].photoUrl` | No | Absolute URL or omitted |

---

## TypeScript Interfaces (Frontend)

Location: `frontend/src/app/core/models/`

```typescript
// frontend/src/app/core/models/site-config.model.ts

export type LangCode = 'pt' | 'en' | 'es';

export interface TranslatedString {
  pt: string;
  en?: string;
  es?: string;
}

export interface SeoConfig {
  title: TranslatedString;
  description: TranslatedString;
}

export interface WhatsAppConfig {
  label?: TranslatedString;
  message: TranslatedString;
}

export interface Testimonial {
  quote: TranslatedString;
  clientName: string;
  photoUrl?: string;
}

export interface ProcessStep {
  heading: TranslatedString;
  body: TranslatedString;
}

export interface Stat {
  value: string;
  label: TranslatedString;
}

export interface FeatureCard {
  icon: string;
  iconBg: string;
  heading: TranslatedString;
  body: TranslatedString;
}

export interface HeroSection {
  enabled: boolean;
  eyebrow: TranslatedString;
  heading: TranslatedString;
  headingEmphasis: TranslatedString;
  subheading: TranslatedString;
  backgroundImageUrl: string;
  ctaPrimary: TranslatedString;
  ctaSecondaryLabel: TranslatedString;
  ctaSecondaryAnchor: string;
  stats: Stat[];
  seo: SeoConfig;
}

export interface AboutMeSection {
  enabled: boolean;
  eyebrow: TranslatedString;
  heading: TranslatedString;
  intro: TranslatedString;
  cards: FeatureCard[];
  photoUrl?: string;
  whatsapp: WhatsAppConfig;
  seo: SeoConfig;
}

export interface MyProcessSection {
  enabled: boolean;
  eyebrow: TranslatedString;
  heading: TranslatedString;
  headingEmphasis: TranslatedString;
  steps: ProcessStep[];
  whatsapp: WhatsAppConfig;
  seo: SeoConfig;
}

export interface ClientsSection {
  enabled: boolean;
  heading: TranslatedString;
  testimonials: Testimonial[];
  seo: SeoConfig;
}

export interface ContactSection {
  enabled: boolean;
  heading: TranslatedString;
  body: TranslatedString;
  buttonLabel: TranslatedString;
  whatsapp: WhatsAppConfig;
  seo: SeoConfig;
}

export interface FooterSection {
  copyrightName: string;
  developerLabel: TranslatedString;
  developerUrl: string;
}

export interface SiteSections {
  hero: HeroSection;
  aboutMe: AboutMeSection;
  myProcess: MyProcessSection;
  clients: ClientsSection;
  contact: ContactSection;
  footer: FooterSection;
}

export interface NavLabels {
  aboutMe: TranslatedString;
  myProcess: TranslatedString;
  clients: TranslatedString;
  contact: TranslatedString;
}

export interface SiteInfo {
  title: TranslatedString;
  description: TranslatedString;
  ogImage?: string;
  agentName: string;
  agentPhone: string;
  agentPhotoUrl?: string;
  agentCredential?: string;
  agentTagline?: TranslatedString;
  agentBio1?: TranslatedString;
  agentBio2?: TranslatedString;
  instagramUrl?: string;
  defaultLanguage?: LangCode;
}

export interface SiteConfig {
  site: SiteInfo;
  sections: SiteSections;
  nav: NavLabels;
}
```

---

## .NET DTOs (Backend — optional API contract)

Location: `backend/src/ImobiliariaApp.Functions/Models/`

These DTOs mirror the JSON schema and are used only if a `GET /api/config` endpoint is implemented (see `contracts/api-config.md`). They are deserialized from `config.json` by the Functions host and returned as HTTP responses.

```csharp
// TranslatedStringDto.cs
public record TranslatedStringDto(string Pt, string? En = null, string? Es = null);

// SeoConfigDto.cs
public record SeoConfigDto(TranslatedStringDto Title, TranslatedStringDto Description);

// WhatsAppConfigDto.cs
public record WhatsAppConfigDto(TranslatedStringDto Message, TranslatedStringDto? Label = null);

// TestimonialDto.cs
public record TestimonialDto(TranslatedStringDto Quote, string ClientName, string? PhotoUrl = null);

// ProcessStepDto.cs
public record ProcessStepDto(TranslatedStringDto Heading, TranslatedStringDto Body);

// SiteInfoDto.cs
public record SiteInfoDto(
  TranslatedStringDto Title,
  TranslatedStringDto Description,
  string AgentName,
  string AgentPhone,
  string? OgImage = null,
  string DefaultLanguage = "pt"
);

// NavLabelsDto.cs
public record NavLabelsDto(
  TranslatedStringDto AboutMe,
  TranslatedStringDto MyProcess,
  TranslatedStringDto Clients,
  TranslatedStringDto Contact
);

// Section DTOs (abbreviated — mirror the TypeScript shape)
// ... AboutMeSectionDto, MyProcessSectionDto, ClientsSectionDto, ContactSectionDto

// SiteConfigDto.cs — root DTO
public record SiteConfigDto(SiteInfoDto Site, SiteSectionsDto Sections, NavLabelsDto Nav);
```

---

## Defaults (Hard-Coded Fallback)

When `config.json` fails to load (`ConfigService.load()` catches the error), `ConfigService.defaults()` returns the following safe minimum so the site never shows a blank page (FR-011):

| Field | Default |
|-------|---------|
| `site.title.pt` | `"Agente Imobiliário"` |
| `site.agentPhone` | `""` (empty — WhatsApp button disabled) |
| `site.defaultLanguage` | `"pt"` |
| All sections `enabled` | `true` |
| Section headings | Section name in Portuguese |
| Translatable strings | Hard-coded Portuguese-only placeholder |
| `testimonials` | `[]` (empty array) |

---

## State Transitions

The only runtime state in this feature is **active language** and **active section** (for nav highlight and SEO updates). These are Angular Signals — not persisted, not database-tracked.

```
Language State:
  'pt' (default) ──[flag click]──► 'en'
  'pt' (default) ──[flag click]──► 'es'
  'en' ──[flag click]──► 'pt' | 'es'
  'es' ──[flag click]──► 'pt' | 'en'

Active Section State (driven by IntersectionObserver):
  null (initial) ──[scroll / cold load]──► 'hero' | 'about-me' | 'my-process' | 'clients' | 'contact'
```
