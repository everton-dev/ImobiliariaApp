import { Component, inject, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { ConfigService } from '../../core/services/config.service';
import { SeoService } from '../../core/services/seo.service';
import { LanguageService } from '../../core/services/language.service';
import { HeroComponent } from '../hero/hero.component';
import { AboutMeComponent } from '../about-me/about-me.component';
import { MyProcessComponent } from '../my-process/my-process.component';
import { ClientsComponent } from '../clients/clients.component';
import { ContactComponent } from '../contact/contact.component';
import { AgentHighlightComponent } from '../../shared/components/agent-highlight/agent-highlight.component';
import { ImoveisComponent } from '../imoveis/imoveis.component';
import { StickyHeaderComponent } from '../../shared/components/sticky-header/sticky-header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { WhatsAppFloatComponent } from '../../shared/components/whatsapp-float/whatsapp-float.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    WhatsAppFloatComponent,
    StickyHeaderComponent,
    HeroComponent,
    ImoveisComponent,
    AgentHighlightComponent,
    AboutMeComponent,
    MyProcessComponent,
    ClientsComponent,
    ContactComponent,
    FooterComponent,
  ],
  template: `
    <app-whatsapp-float />
    <app-sticky-header [activeSection]="activeSection()" />

    <main>
      @if (config().sections.hero.enabled) {
        <app-hero />
      }
      @if (config().sections.imoveis?.enabled) {
        <app-imoveis />
      }
      <app-agent-highlight />
      @if (config().sections.aboutMe.enabled) {
        <app-about-me />
      }
      @if (config().sections.myProcess.enabled) {
        <app-my-process />
      }
      @if (config().sections.clients.enabled) {
        <app-clients />
      }
      @if (config().sections.contact.enabled) {
        <app-contact />
      }
    </main>

    <app-footer />
  `,
})
export class HomeComponent implements OnInit, OnDestroy {
  protected readonly config = inject(ConfigService).config;
  protected readonly activeSection = signal('');

  private readonly seoService = inject(SeoService);
  private readonly langService = inject(LanguageService);

  private readonly sectionIds = ['hero', 'imoveis', 'about-me', 'my-process', 'clients', 'contact'];
  private observer!: IntersectionObserver;

  constructor() {
    effect(() => {
      const section = this.activeSection();
      const lang = this.langService.lang();
      const cfg = this.config();
      const seoMap: Record<string, any> = {
        'hero': cfg.sections.hero.seo,
        'about-me': cfg.sections.aboutMe.seo,
        'my-process': cfg.sections.myProcess.seo,
        'clients': cfg.sections.clients.seo,
        'contact': cfg.sections.contact.seo,
      };
      const seo = seoMap[section] ?? cfg.sections.hero.seo;
      this.seoService.update(seo, lang, cfg.site.ogImage);
    });
  }

  ngOnInit(): void {
    this.seoService.injectStructuredData(this.config().site);

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) this.activeSection.set(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    for (const id of this.sectionIds) {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
