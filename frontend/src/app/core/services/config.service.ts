import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import {
  SiteConfig, LangCode, TranslatedString, FeatureCard, Stat, ProcessStep, Testimonial, PropertyListing
} from '../models/site-config.model';

const ET: TranslatedString = { pt: '' };

function t(val: unknown, fallback: TranslatedString): TranslatedString {
  if (val && typeof val === 'object' && typeof (val as any).pt === 'string') {
    return val as TranslatedString;
  }
  return fallback;
}

function defaults(): SiteConfig {
  return {
    site: {
      title: { pt: 'Imobiliária' },
      description: { pt: '' },
      agentName: '',
      agentPhone: '',
      defaultLanguage: 'pt' as LangCode,
    },
    sections: {
      hero: {
        enabled: true,
        eyebrow: ET,
        heading: ET,
        headingEmphasis: ET,
        subheading: ET,
        ctaPrimary: { label: ET, message: ET },
        ctaSecondaryLabel: ET,
        ctaSecondaryAnchor: 'about-me',
        stats: [],
        seo: { title: ET, description: ET },
      },
      aboutMe: {
        enabled: true,
        eyebrow: ET,
        heading: { pt: 'Sobre Mim' },
        intro: ET,
        cards: [],
        whatsapp: { label: ET, message: ET },
        seo: { title: ET, description: ET },
      },
      myProcess: {
        enabled: true,
        eyebrow: ET,
        heading: { pt: 'Como Trabalho' },
        headingEmphasis: ET,
        steps: [],
        whatsapp: { label: ET, message: ET },
        seo: { title: ET, description: ET },
      },
      clients: {
        enabled: true,
        eyebrow: ET,
        heading: { pt: 'Clientes' },
        testimonials: [],
        seo: { title: ET, description: ET },
      },
      contact: {
        enabled: true,
        heading: { pt: 'Contato' },
        body: ET,
        buttonLabel: ET,
        whatsapp: { message: ET },
        seo: { title: ET, description: ET },
      },
      footer: {
        copyrightName: '',
      },
    },
    nav: {
      aboutMe: { pt: 'Quem Sou' },
      myProcess: { pt: 'Como Trabalho' },
      clients: { pt: 'Clientes' },
      contact: { pt: 'Contato' },
    },
  };
}

function validateConfig(raw: unknown): SiteConfig {
  const d = defaults();
  if (!raw || typeof raw !== 'object') return d;
  const r = raw as any;
  const site = r.site ?? {};
  const sections = r.sections ?? {};
  const hero = sections.hero ?? {};
  const am = sections.aboutMe ?? {};
  const mp = sections.myProcess ?? {};
  const cl = sections.clients ?? {};
  const co = sections.contact ?? {};
  const ft = sections.footer ?? {};
  const nav = r.nav ?? {};

  const stats: Stat[] = Array.isArray(hero.stats)
    ? hero.stats.filter((s: any) => s?.value).map((s: any): Stat => ({
        value: String(s.value),
        label: t(s.label, ET),
      }))
    : [];

  const cards: FeatureCard[] = Array.isArray(am.cards)
    ? am.cards.filter((c: any) => c?.heading?.pt).map((c: any): FeatureCard => ({
        icon: typeof c.icon === 'string' ? c.icon : 'star',
        iconBg: typeof c.iconBg === 'string' ? c.iconBg : '#1a1a1a',
        heading: t(c.heading, ET),
        body: t(c.body, ET),
      }))
    : [];

  const steps: ProcessStep[] = Array.isArray(mp.steps)
    ? mp.steps.filter((s: any) => s?.heading?.pt).map((s: any): ProcessStep => ({
        number: typeof s.number === 'string' ? s.number : '',
        icon: typeof s.icon === 'string' ? s.icon : 'check',
        heading: t(s.heading, ET),
        body: t(s.body, ET),
      }))
    : [];

  const im = sections.imoveis ?? {};
  const listings: PropertyListing[] = Array.isArray(im.listings)
    ? im.listings.filter((l: any) => typeof l?.id === 'string').map((l: any): PropertyListing => ({
        id: l.id,
        type: t(l.type, ET),
        address: typeof l.address === 'string' ? l.address : '',
        neighborhood: typeof l.neighborhood === 'string' ? l.neighborhood : '',
        areaM2: typeof l.areaM2 === 'number' ? l.areaM2 : 0,
        bedrooms: typeof l.bedrooms === 'number' ? l.bedrooms : 0,
        bathrooms: typeof l.bathrooms === 'number' ? l.bathrooms : 0,
        parkingSpots: typeof l.parkingSpots === 'number' ? l.parkingSpots : undefined,
        modality: t(l.modality, ET),
        price: typeof l.price === 'number' ? l.price : 0,
        images: Array.isArray(l.images) ? l.images.filter((i: any) => typeof i === 'string') : [],
        description: l.description ? t(l.description, ET) : undefined,
        amenities: Array.isArray(l.amenities) ? l.amenities.filter((a: any) => typeof a === 'string') : undefined,
      }))
    : [];

  const testimonials: Testimonial[] = Array.isArray(cl.testimonials)
    ? cl.testimonials.filter((x: any) => typeof x?.clientName === 'string').map((x: any): Testimonial => ({
        quote: t(x.quote, ET),
        clientName: x.clientName,
        location: x.location ? t(x.location, ET) : undefined,
        score: typeof x.score === 'number' ? x.score : undefined,
        avatarColor: typeof x.avatarColor === 'string' ? x.avatarColor : '#726D66',
        photoUrl: typeof x.photoUrl === 'string' ? x.photoUrl : undefined,
      }))
    : [];

  return {
    site: {
      title: t(site.title, d.site.title),
      description: t(site.description, d.site.description),
      agentName: typeof site.agentName === 'string' ? site.agentName : '',
      agentCredential: typeof site.agentCredential === 'string' ? site.agentCredential : undefined,
      agentPhone: typeof site.agentPhone === 'string' ? site.agentPhone : '',
      agentPhotoUrl: typeof site.agentPhotoUrl === 'string' ? site.agentPhotoUrl : undefined,
      agentTagline: site.agentTagline ? t(site.agentTagline, ET) : undefined,
      agentBio1: site.agentBio1 ? t(site.agentBio1, ET) : undefined,
      agentBio2: site.agentBio2 ? t(site.agentBio2, ET) : undefined,
      instagramUrl: typeof site.instagramUrl === 'string' ? site.instagramUrl : undefined,
      ogImage: typeof site.ogImage === 'string' ? site.ogImage : undefined,
      defaultLanguage: (['pt', 'en', 'es'] as LangCode[]).includes(site.defaultLanguage)
        ? site.defaultLanguage : 'pt',
    },
    sections: {
      hero: {
        enabled: typeof hero.enabled === 'boolean' ? hero.enabled : true,
        eyebrow: t(hero.eyebrow, ET),
        heading: t(hero.heading, ET),
        headingEmphasis: t(hero.headingEmphasis, ET),
        subheading: t(hero.subheading, ET),
        backgroundImageUrl: typeof hero.backgroundImageUrl === 'string' ? hero.backgroundImageUrl : undefined,
        ctaPrimary: {
          label: t(hero.ctaPrimary?.label, ET),
          message: t(hero.ctaPrimary?.message, ET),
        },
        ctaSecondaryLabel: t(hero.ctaSecondaryLabel, ET),
        ctaSecondaryAnchor: typeof hero.ctaSecondaryAnchor === 'string' ? hero.ctaSecondaryAnchor : 'about-me',
        stats,
        seo: {
          title: t(hero.seo?.title, ET),
          description: t(hero.seo?.description, ET),
        },
      },
      imoveis: im && typeof im.enabled === 'boolean' ? {
        enabled: im.enabled,
        eyebrow: t(im.eyebrow, ET),
        heading: t(im.heading, ET),
        ctaAllLabel: t(im.ctaAllLabel, ET),
        ctaPortfolioLabel: t(im.ctaPortfolioLabel, ET),
        whatsapp: { message: t(im.whatsapp?.message, ET) },
        listings,
      } : undefined,
      aboutMe: {
        enabled: typeof am.enabled === 'boolean' ? am.enabled : true,
        eyebrow: t(am.eyebrow, ET),
        heading: t(am.heading, d.sections.aboutMe.heading),
        intro: t(am.intro, ET),
        cards,
        photoUrl: typeof am.photoUrl === 'string' ? am.photoUrl : undefined,
        whatsapp: {
          label: t(am.whatsapp?.label, ET),
          message: t(am.whatsapp?.message, ET),
        },
        seo: {
          title: t(am.seo?.title, ET),
          description: t(am.seo?.description, ET),
        },
      },
      myProcess: {
        enabled: typeof mp.enabled === 'boolean' ? mp.enabled : true,
        eyebrow: t(mp.eyebrow, ET),
        heading: t(mp.heading, d.sections.myProcess.heading),
        headingEmphasis: t(mp.headingEmphasis, ET),
        steps,
        whatsapp: {
          label: t(mp.whatsapp?.label, ET),
          message: t(mp.whatsapp?.message, ET),
        },
        seo: {
          title: t(mp.seo?.title, ET),
          description: t(mp.seo?.description, ET),
        },
      },
      clients: {
        enabled: typeof cl.enabled === 'boolean' ? cl.enabled : true,
        eyebrow: t(cl.eyebrow, ET),
        heading: t(cl.heading, d.sections.clients.heading),
        testimonials,
        seo: {
          title: t(cl.seo?.title, ET),
          description: t(cl.seo?.description, ET),
        },
      },
      contact: {
        enabled: typeof co.enabled === 'boolean' ? co.enabled : true,
        heading: t(co.heading, d.sections.contact.heading),
        body: t(co.body, ET),
        buttonLabel: t(co.buttonLabel, ET),
        whatsapp: {
          message: t(co.whatsapp?.message, ET),
        },
        seo: {
          title: t(co.seo?.title, ET),
          description: t(co.seo?.description, ET),
        },
      },
      footer: {
        copyrightName: typeof ft.copyrightName === 'string' ? ft.copyrightName : '',
        developerLabel: ft.developerLabel ? t(ft.developerLabel, ET) : undefined,
        developerUrl: typeof ft.developerUrl === 'string' ? ft.developerUrl : undefined,
      },
    },
    nav: {
      imoveis: nav.imoveis ? t(nav.imoveis, ET) : undefined,
      aboutMe: t(nav.aboutMe, d.nav.aboutMe),
      myProcess: t(nav.myProcess, d.nav.myProcess),
      clients: t(nav.clients, d.nav.clients),
      contact: t(nav.contact, d.nav.contact),
    },
  };
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly _config = signal<SiteConfig>(defaults());
  readonly config = this._config.asReadonly();

  constructor(private readonly http: HttpClient) {}

  async load(): Promise<void> {
    try {
      const raw = await firstValueFrom(
        this.http.get<unknown>('/assets/config.json').pipe(timeout(5000))
      );
      const validated = validateConfig(raw);
      this._config.set(validated);
    } catch (err) {
      console.error('[ConfigService] load failed:', err);
      this._config.set(defaults());
    }
  }
}
