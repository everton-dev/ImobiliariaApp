import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StickyHeaderComponent } from './sticky-header.component';
import { ConfigService } from '../../../core/services/config.service';
import { LanguageService } from '../../../core/services/language.service';
import { signal } from '@angular/core';
import { SiteConfig } from '../../../core/models/site-config.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

const MOCK_CONFIG: SiteConfig = {
  site: {
    title: { pt: 'Imobiliária', en: 'Real Estate' },
    description: { pt: '' },
    agentName: 'Maria',
    agentPhone: '5511999998888',
  },
  sections: {
    aboutMe: {
      enabled: true,
      heading: { pt: 'Sobre Mim' },
      body: { pt: '' },
      whatsapp: { label: { pt: '' }, message: { pt: '' } },
      seo: { title: { pt: '' }, description: { pt: '' } },
    },
    myProcess: {
      enabled: true,
      heading: { pt: 'Meu Processo' },
      steps: [],
      whatsapp: { label: { pt: '' }, message: { pt: '' } },
      seo: { title: { pt: '' }, description: { pt: '' } },
    },
    clients: {
      enabled: true,
      heading: { pt: 'Clientes' },
      testimonials: [],
      seo: { title: { pt: '' }, description: { pt: '' } },
    },
    contact: {
      enabled: true,
      heading: { pt: 'Contato' },
      buttonLabel: { pt: '' },
      whatsapp: { message: { pt: '' } },
      seo: { title: { pt: '' }, description: { pt: '' } },
    },
  },
  nav: {
    aboutMe: { pt: 'Sobre Mim', en: 'About Me' },
    myProcess: { pt: 'Meu Processo', en: 'My Process' },
    clients: { pt: 'Clientes', en: 'Clients' },
    contact: { pt: 'Contato', en: 'Contact' },
  },
};

describe('StickyHeaderComponent', () => {
  let fixture: ComponentFixture<StickyHeaderComponent>;
  let langService: LanguageService;
  const configSig = signal(MOCK_CONFIG);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StickyHeaderComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [
        LanguageService,
        { provide: ConfigService, useValue: { config: configSig } },
      ],
    });
    fixture = TestBed.createComponent(StickyHeaderComponent);
    langService = TestBed.inject(LanguageService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('(a) renders exactly 4 nav items', () => {
    const navItems = fixture.nativeElement.querySelectorAll('.nav-item');
    expect(navItems.length).toBe(4);
  });

  it('(b) nav item labels come from config.nav in current language', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Sobre Mim');
    expect(text).toContain('Meu Processo');
    expect(text).toContain('Clientes');
    expect(text).toContain('Contato');
  });

  it('(b) nav labels update when language switches to en', () => {
    langService.setLang('en');
    fixture.detectChanges();
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('About Me');
    expect(text).toContain('My Process');
    expect(text).toContain('Clients');
    expect(text).toContain('Contact');
  });

  it('(d) active nav item has active CSS class when activeSection input is set', () => {
    fixture.componentInstance.activeSection = 'about-me';
    fixture.detectChanges();
    const activeItem = fixture.nativeElement.querySelector('.nav-item.active');
    expect(activeItem).toBeTruthy();
    expect(activeItem.textContent.trim()).toContain('Sobre Mim');
  });

  it('(e) renders three flag buttons with accessible aria-labels', () => {
    const flagButtons = fixture.nativeElement.querySelectorAll('.lang-btn');
    expect(flagButtons.length).toBe(3);
    const labels = Array.from(flagButtons).map((b: any) => b.getAttribute('aria-label'));
    expect(labels).toContain('Português');
    expect(labels).toContain('English');
    expect(labels).toContain('Español');
  });
});

// T052: Hidden nav item edge case
describe('StickyHeaderComponent — hidden nav edge case (T052)', () => {
  it('when sections.clients.enabled=false, nav still renders 4 items (hidden sections show nav without scrolling anchor)', () => {
    // Note: StickyHeaderComponent renders all 4 nav links from config.nav regardless of section enabled.
    // Visibility of sections is controlled by AppComponent's @if guards, not the header.
    // This test verifies the header always shows 4 nav links (by design — user can still see the label).
    const configWithClientsDisabled = {
      ...MOCK_CONFIG,
      sections: {
        ...MOCK_CONFIG.sections,
        clients: { ...MOCK_CONFIG.sections.clients, enabled: false },
      },
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [StickyHeaderComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [
        LanguageService,
        { provide: ConfigService, useValue: { config: signal(configWithClientsDisabled) } },
      ],
    });
    const fixture2 = TestBed.createComponent(StickyHeaderComponent);
    fixture2.detectChanges();
    const navItems = fixture2.nativeElement.querySelectorAll('.nav-item');
    // Header always shows 4 nav items (section visibility is AppComponent's responsibility)
    expect(navItems.length).toBe(4);
  });
});
