# API Contract: GET /api/config

**Feature**: `001-realtor-lead-site`
**Version**: v1
**Date**: 2026-07-15

---

## Overview

This endpoint serves the site configuration as JSON. It is an **optional** delivery mechanism: the default deployment has Angular fetch `config.json` directly as a static asset. This endpoint exists for scenarios where the owner prefers API-mediated delivery (e.g., future dynamic config generation, A/B testing, per-subdomain config).

---

## Request

```
GET /api/v1/config
Host: {function-app-host}
Accept: application/json
```

No authentication required (this is a public, read-only endpoint).  
No request body.  
No query parameters.

---

## Response — 200 OK

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: public, max-age=300
```

**Body** (the full `SiteConfigDto` graph):

```json
{
  "site": {
    "title":           { "pt": "string", "en": "string", "es": "string" },
    "description":     { "pt": "string", "en": "string", "es": "string" },
    "ogImage":         "string | null",
    "agentName":       "string",
    "agentPhone":      "string",
    "defaultLanguage": "pt | en | es"
  },
  "sections": {
    "aboutMe": {
      "enabled": true,
      "heading": { "pt": "string", "en": "string", "es": "string" },
      "body":    { "pt": "string", "en": "string", "es": "string" },
      "photoUrl": "string | null",
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
      "enabled": true,
      "heading": { "pt": "string", "en": "string", "es": "string" },
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
      "enabled": true,
      "heading": { "pt": "string", "en": "string", "es": "string" },
      "testimonials": [
        {
          "quote":      { "pt": "string", "en": "string", "es": "string" },
          "clientName": "string",
          "photoUrl":   "string | null"
        }
      ],
      "seo": {
        "title":       { "pt": "string", "en": "string", "es": "string" },
        "description": { "pt": "string", "en": "string", "es": "string" }
      }
    },
    "contact": {
      "enabled": true,
      "heading":     { "pt": "string", "en": "string", "es": "string" },
      "buttonLabel": { "pt": "string", "en": "string", "es": "string" },
      "whatsapp": {
        "message": { "pt": "string", "en": "string", "es": "string" }
      },
      "seo": {
        "title":       { "pt": "string", "en": "string", "es": "string" },
        "description": { "pt": "string", "en": "string", "es": "string" }
      }
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

---

## Response — 503 Service Unavailable

Returned when `config.json` is missing or cannot be parsed. Angular falls back to hard-coded defaults; this response is for diagnostics only.

```
HTTP/1.1 503 Service Unavailable
Content-Type: application/json; charset=utf-8
```

```json
{
  "error": "config_unavailable",
  "message": "The site configuration could not be loaded."
}
```

---

## Versioning

The endpoint path includes the API version (`/api/v1/config`). Breaking changes to the shape (removing fields, renaming top-level keys) require a new version path (`/api/v2/config`).

---

## Error Codes Summary

| HTTP Status | Error Code | Meaning |
|-------------|------------|---------|
| 200 | — | Config loaded successfully |
| 503 | `config_unavailable` | Config file missing or malformed |

---

## Notes

- All translatable fields return an object with at least a `pt` key. `en` and `es` are optional; consumers MUST fall back to `pt` when absent.
- `agentPhone` is returned as a raw digit string (no `+`, no spaces). Consumers build the `wa.me` URL.
- `ogImage` and `photoUrl` are nullable — consumers must handle `null` gracefully.
- `sections.*.enabled = false` means the section and its nav item should be hidden entirely; the API still returns the disabled section's data for completeness.
