import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientsComponent } from './clients.component';
import { ConfigService } from '../../core/services/config.service';
import { LanguageService } from '../../core/services/language.service';
import { signal } from '@angular/core';
import { SiteConfig } from '../../core/models/site-config.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const MOCK_CONFIG: Partial<SiteConfig> = {
  site: { title: { pt: '' }, description: { pt: '' }, agentName: 'Maria', agentPhone: '5511999998888' },
  sections: {
    clients: {
      enabled: true,
      heading: { pt: 'Clientes', en: 'Clients' },
      testimonials: [
        { quote: { pt: 'Ótimo!', en: 'Great!' }, clientName: 'João' },
        { quote: { pt: 'Excelente!' }, clientName: 'Ana', photoUrl: 'https://example.com/a.jpg' },
      ],
      seo: { title: { pt: '' }, description: { pt: '' } },
    },
  } as any,
  nav: { aboutMe: { pt: '' }, myProcess: { pt: '' }, clients: { pt: '' }, contact: { pt: '' } },
};

describe('ClientsComponent', () => {
  let fixture: ComponentFixture<ClientsComponent>;
  let langService: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClientsComponent, NoopAnimationsModule],
      providers: [
        LanguageService,
        { provide: ConfigService, useValue: { config: signal(MOCK_CONFIG) } },
      ],
    });
    fixture = TestBed.createComponent(ClientsComponent);
    langService = TestBed.inject(LanguageService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('(a) renders section with id="clients"', () => {
    const section = fixture.nativeElement.querySelector('#clients');
    expect(section).toBeTruthy();
  });

  it('(b) renders heading in current language', () => {
    expect(fixture.nativeElement.textContent).toContain('Clientes');
  });

  it('(c) renders one testimonial card per testimonial', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-testimonial-card');
    expect(cards.length).toBe(2);
  });

  it('(d) heading updates when language switches to en', () => {
    langService.setLang('en');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Clients');
  });
});
