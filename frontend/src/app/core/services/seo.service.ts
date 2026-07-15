import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoConfig, SiteInfo, LangCode, TranslatedString } from '../models/site-config.model';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(seo: SeoConfig, lang: LangCode, ogImage?: string): void {
    const titleText = this.resolve(seo.title, lang);
    const descText = this.resolve(seo.description, lang);

    this.title.setTitle(titleText);

    this.meta.updateTag({ name: 'description', content: descText });
    this.meta.updateTag({ property: 'og:title', content: titleText });
    this.meta.updateTag({ property: 'og:description', content: descText });

    if (ogImage) {
      this.meta.updateTag({ property: 'og:image', content: ogImage });
    }
  }

  injectStructuredData(site: SiteInfo): void {
    const existing = this.document.querySelector('script[type="application/ld+json"]');

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: site.agentName,
      telephone: `+${site.agentPhone}`,
      url: this.document.location.origin,
    };

    if (existing) {
      existing.textContent = JSON.stringify(ld);
    } else {
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(ld);
      this.document.head.appendChild(script);
    }
  }

  private resolve(field: TranslatedString, lang: LangCode): string {
    return field[lang] ?? field.pt;
  }
}
