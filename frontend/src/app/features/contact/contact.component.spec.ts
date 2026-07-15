import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { ConfigService } from '../../core/services/config.service';
import { LanguageService } from '../../core/services/language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { SiteConfig } from '../../core/models/site-config.model';

const MOCK_CONFIG: SiteConfig = {
  site: {
    title: { pt: 'Título' },
    description: { pt: 'Desc' },
    agentName: 'Maria',
    agentPhone: '5511999998888',
  },
  sections: {
    aboutMe: {
      enabled: true,
      heading: { pt: 'Sobre' },
      body: { pt: 'Corpo' },
      whatsapp: { label: { pt: 'Fale' }, message: { pt: 'Msg' } },
      seo: { title: { pt: 'SEO' }, description: { pt: 'D' } },
    },
    myProcess: {
      enabled: true,
      heading: { pt: 'Processo' },
      steps: [],
      whatsapp: { label: { pt: 'Iniciar' }, message: { pt: 'Proc' } },
      seo: { title: { pt: 'SEO' }, description: { pt: 'D' } },
    },
    clients: {
      enabled: true,
      heading: { pt: 'Clientes' },
      testimonials: [],
      seo: { title: { pt: 'SEO' }, description: { pt: 'D' } },
    },
    contact: {
      enabled: true,
      heading: { pt: 'Contato' },
      buttonLabel: { pt: 'Fale Conosco', en: 'Contact Us' },
      whatsapp: { message: { pt: 'Olá!', en: 'Hello!' } },
      seo: { title: { pt: 'SEO' }, description: { pt: 'D' } },
    },
  },
  nav: {
    aboutMe: { pt: 'Sobre' },
    myProcess: { pt: 'Processo' },
    clients: { pt: 'Clientes' },
    contact: { pt: 'Contato' },
  },
};

describe('ContactComponent', () => {
  let fixture: ComponentFixture<ContactComponent>;
  let langService: LanguageService;

  beforeEach(() => {
    const configSig = signal(MOCK_CONFIG);
    TestBed.configureTestingModule({
      imports: [ContactComponent, HttpClientTestingModule],
      providers: [
        LanguageService,
        {
          provide: ConfigService,
          useValue: { config: configSig },
        },
      ],
    });
    fixture = TestBed.createComponent(ContactComponent);
    langService = TestBed.inject(LanguageService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('(a) renders exactly one app-whatsapp-button', () => {
    const buttons = fixture.nativeElement.querySelectorAll('app-whatsapp-button');
    expect(buttons.length).toBe(1);
  });

  it('(b) button label matches config for current language (pt)', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Fale Conosco');
  });

  it('(c) button label switches when language changes to en', () => {
    langService.setLang('en');
    fixture.detectChanges();
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Contact Us');
  });
});
