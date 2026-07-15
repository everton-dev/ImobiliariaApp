# Contract: Site Configuration File (`config.json`)

**Feature**: `001-realtor-lead-site`
**Date**: 2026-07-15

---

## Purpose

`config.json` is the single runtime-editable file that drives all site content and behavior. It is served as a static asset at `/assets/config.json` relative to the Angular SPA root and is loaded once on page initialization via `ConfigService`.

This document is the authoritative schema contract for the file. Both the Angular frontend and the optional .NET backend API (`GET /api/v1/config`) must conform to this schema.

---

## File Location

```
frontend/
└── src/
    └── assets/
        └── config.json     ← Owner edits this file directly
```

On production, this file is deployed alongside the SPA bundle and can be overwritten independently without a code redeployment.

---

## Schema Conventions

| Convention | Rule |
|-----------|------|
| **Translatable field** | Object: `{ "pt": "...", "en": "...", "es": "..." }` — `pt` key is required; `en`/`es` are optional (fall back to `pt`) |
| **Non-translatable field** | Plain scalar: string, number, boolean, or array |
| **Optional field** | Marked `?` — may be omitted; consumer must handle absence gracefully |
| **Disabled section** | `"enabled": false` — section and its nav item are hidden; the section's content data may still be present |

---

## Annotated Example

```json
{
  "site": {
    "title": {
      "pt": "Maria Silva — Corretora de Imóveis",
      "en": "Maria Silva — Real Estate Agent",
      "es": "Maria Silva — Agente Inmobiliaria"
    },
    "description": {
      "pt": "Encontre o imóvel dos seus sonhos com Maria Silva.",
      "en": "Find your dream property with Maria Silva.",
      "es": "Encuentre la propiedad de sus sueños con María Silva."
    },
    "ogImage": "https://example.com/og-cover.jpg",
    "agentName": "Maria Silva",
    "agentPhone": "5511999998888",
    "defaultLanguage": "pt"
  },

  "sections": {
    "aboutMe": {
      "enabled": true,
      "heading": {
        "pt": "Sobre Mim",
        "en": "About Me",
        "es": "Sobre Mí"
      },
      "body": {
        "pt": "Sou corretora há 10 anos, especializada em imóveis residenciais em São Paulo.",
        "en": "I have been a real estate agent for 10 years, specializing in residential properties in São Paulo.",
        "es": "Soy agente inmobiliaria desde hace 10 años, especializada en propiedades residenciales en São Paulo."
      },
      "photoUrl": "https://example.com/maria.jpg",
      "whatsapp": {
        "label": {
          "pt": "Fale Comigo",
          "en": "Talk to Me",
          "es": "Habla Conmigo"
        },
        "message": {
          "pt": "Olá, Maria! Vi sua página e gostaria de saber mais sobre você.",
          "en": "Hello, Maria! I saw your page and would like to know more about you.",
          "es": "¡Hola, María! Vi tu página y me gustaría saber más sobre ti."
        }
      },
      "seo": {
        "title": {
          "pt": "Sobre Maria Silva — Corretora de Imóveis",
          "en": "About Maria Silva — Real Estate Agent",
          "es": "Sobre María Silva — Agente Inmobiliaria"
        },
        "description": {
          "pt": "Conheça Maria Silva, corretora especializada em imóveis residenciais em São Paulo.",
          "en": "Meet Maria Silva, a real estate agent specializing in residential properties in São Paulo.",
          "es": "Conozca a María Silva, agente inmobiliaria especializada en propiedades residenciales en São Paulo."
        }
      }
    },

    "myProcess": {
      "enabled": true,
      "heading": {
        "pt": "Meu Processo",
        "en": "My Process",
        "es": "Mi Proceso"
      },
      "steps": [
        {
          "heading": { "pt": "Entendimento", "en": "Understanding", "es": "Entendimiento" },
          "body":    { "pt": "Conversa inicial para entender suas necessidades.", "en": "Initial conversation to understand your needs.", "es": "Conversación inicial para comprender sus necesidades." }
        },
        {
          "heading": { "pt": "Busca", "en": "Search", "es": "Búsqueda" },
          "body":    { "pt": "Curadoria de imóveis alinhados ao seu perfil.", "en": "Curation of properties aligned with your profile.", "es": "Selección de propiedades alineadas con su perfil." }
        }
      ],
      "whatsapp": {
        "label": { "pt": "Iniciar Processo", "en": "Start Process", "es": "Iniciar Proceso" },
        "message": {
          "pt": "Olá, Maria! Gostaria de iniciar o processo de busca do meu imóvel.",
          "en": "Hello, Maria! I would like to start the property search process.",
          "es": "¡Hola, María! Me gustaría iniciar el proceso de búsqueda de mi propiedad."
        }
      },
      "seo": {
        "title": { "pt": "Meu Processo — Maria Silva", "en": "My Process — Maria Silva", "es": "Mi Proceso — María Silva" },
        "description": { "pt": "Veja como funciona o processo de compra ou aluguel com Maria Silva.", "en": "See how the buying or renting process works with Maria Silva.", "es": "Vea cómo funciona el proceso de compra o alquiler con María Silva." }
      }
    },

    "clients": {
      "enabled": true,
      "heading": { "pt": "Clientes", "en": "Clients", "es": "Clientes" },
      "testimonials": [
        {
          "quote": {
            "pt": "Maria foi incrível! Encontrou exatamente o que precisávamos.",
            "en": "Maria was incredible! She found exactly what we needed.",
            "es": "¡María fue increíble! Encontró exactamente lo que necesitábamos."
          },
          "clientName": "João e Ana Costa",
          "photoUrl": "https://example.com/joao-ana.jpg"
        },
        {
          "quote": {
            "pt": "Processo rápido e transparente. Recomendo muito!",
            "en": "Fast and transparent process. Highly recommended!",
            "es": "Proceso rápido y transparente. ¡Muy recomendable!"
          },
          "clientName": "Carlos Pereira"
        }
      ],
      "seo": {
        "title": { "pt": "Clientes — Maria Silva", "en": "Clients — Maria Silva", "es": "Clientes — María Silva" },
        "description": { "pt": "Veja os depoimentos de clientes satisfeitos com o trabalho de Maria Silva.", "en": "See testimonials from satisfied clients of Maria Silva.", "es": "Vea los testimonios de clientes satisfechos con el trabajo de María Silva." }
      }
    },

    "contact": {
      "enabled": true,
      "heading": { "pt": "Contato", "en": "Contact", "es": "Contacto" },
      "buttonLabel": { "pt": "Fale Conosco", "en": "Contact us", "es": "Contáctenos" },
      "whatsapp": {
        "message": {
          "pt": "Olá, Maria! Gostaria de conversar sobre um imóvel.",
          "en": "Hello, Maria! I would like to talk about a property.",
          "es": "¡Hola, María! Me gustaría hablar sobre una propiedad."
        }
      },
      "seo": {
        "title": { "pt": "Contato — Maria Silva", "en": "Contact — Maria Silva", "es": "Contacto — María Silva" },
        "description": { "pt": "Entre em contato com Maria Silva pelo WhatsApp.", "en": "Contact Maria Silva via WhatsApp.", "es": "Contacte a María Silva por WhatsApp." }
      }
    }
  },

  "nav": {
    "aboutMe":   { "pt": "Sobre Mim", "en": "About Me",   "es": "Sobre Mí"  },
    "myProcess": { "pt": "Meu Processo", "en": "My Process", "es": "Mi Proceso" },
    "clients":   { "pt": "Clientes",    "en": "Clients",    "es": "Clientes"  },
    "contact":   { "pt": "Contato",     "en": "Contact",    "es": "Contacto"  }
  }
}
```

---

## Validation Rules

| Rule | Detail |
|------|--------|
| Every translatable field MUST include `"pt"` | `en`/`es` are optional and fall back to `pt` |
| `site.agentPhone` MUST be digits only | No `+`, spaces, or dashes; 10–15 digits |
| `site.defaultLanguage` | If present, must be `"pt"`, `"en"`, or `"es"` |
| `sections.*.enabled` MUST be boolean | If `false`, section and nav item hidden |
| `testimonials` MAY be an empty array `[]` | No testimonials displayed when empty |
| `testimonials[].photoUrl` MAY be omitted | Avatar falls back to initials placeholder |
| `ogImage` and `photoUrl` MUST be absolute URLs if present | Relative URLs are not supported |

---

## Owner Edit Guidelines

1. Edit `config.json` directly in a text editor or the hosting file manager.
2. Overwrite the deployed file — no code change or redeployment required.
3. Refresh the browser to see the updated content.
4. Validate JSON syntax before deploying (use `jsonlint.com` or a text editor with JSON support).
5. To disable a section, set `"enabled": false` — do not delete the section block.
6. To add a testimonial, copy an existing object in the `testimonials` array and update its fields.
