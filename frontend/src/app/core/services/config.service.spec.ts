import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ConfigService } from './config.service';
import { SiteConfig } from '../models/site-config.model';

const VALID_CONFIG: SiteConfig = {
  site: {
    title: { pt: 'Título PT' },
    description: { pt: 'Descrição PT' },
    agentName: 'Maria Silva',
    agentPhone: '5511999998888',
    defaultLanguage: 'pt',
  },
  sections: {
    aboutMe: {
      enabled: true,
      heading: { pt: 'Sobre Mim' },
      body: { pt: 'Texto sobre mim.' },
      whatsapp: {
        label: { pt: 'Fale Comigo' },
        message: { pt: 'Olá, quero saber mais.' },
      },
      seo: { title: { pt: 'Sobre Mim SEO' }, description: { pt: 'Desc SEO' } },
    },
    myProcess: {
      enabled: true,
      heading: { pt: 'Meu Processo' },
      steps: [],
      whatsapp: {
        label: { pt: 'Iniciar' },
        message: { pt: 'Quero iniciar o processo.' },
      },
      seo: { title: { pt: 'Processo SEO' }, description: { pt: 'Desc SEO' } },
    },
    clients: {
      enabled: true,
      heading: { pt: 'Clientes' },
      testimonials: [],
      seo: { title: { pt: 'Clientes SEO' }, description: { pt: 'Desc SEO' } },
    },
    contact: {
      enabled: true,
      heading: { pt: 'Contato' },
      buttonLabel: { pt: 'Fale Conosco' },
      whatsapp: { message: { pt: 'Olá, gostaria de conversar.' } },
      seo: { title: { pt: 'Contato SEO' }, description: { pt: 'Desc SEO' } },
    },
  },
  nav: {
    aboutMe: { pt: 'Sobre Mim' },
    myProcess: { pt: 'Meu Processo' },
    clients: { pt: 'Clientes' },
    contact: { pt: 'Contato' },
  },
};

describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService],
    });
    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('(a) loads and parses valid config JSON', async () => {
    const loadPromise = service.load();
    const req = httpMock.expectOne('/assets/config.json');
    req.flush(VALID_CONFIG);
    await loadPromise;

    const config = service.config();
    expect(config.site.agentName).toBe('Maria Silva');
    expect(config.site.agentPhone).toBe('5511999998888');
    expect(config.sections.aboutMe.enabled).toBe(true);
  });

  it('(b) returns safe defaults when fetch fails with 404', async () => {
    const loadPromise = service.load();
    const req = httpMock.expectOne('/assets/config.json');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    await loadPromise;

    const config = service.config();
    expect(config.site.agentPhone).toBe('');
    expect(config.site.agentName).toBe('');
    expect(config.sections.aboutMe.enabled).toBe(true);
  });

  it('(c) returns safe defaults when JSON is malformed', async () => {
    const loadPromise = service.load();
    const req = httpMock.expectOne('/assets/config.json');
    req.flush('{ invalid json !!!', {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'text/plain' },
    });
    await loadPromise;

    const config = service.config();
    expect(config.site.agentPhone).toBe('');
  });

  // T038: US3 config validation tests
  describe('config validation (US3)', () => {
    it('(US3-a) config with sections.clients.enabled=false is stored as-is', async () => {
      const configWithDisabledClients = {
        ...VALID_CONFIG,
        sections: {
          ...VALID_CONFIG.sections,
          clients: { ...VALID_CONFIG.sections.clients, enabled: false },
        },
      };
      const loadPromise = service.load();
      const req = httpMock.expectOne('/assets/config.json');
      req.flush(configWithDisabledClients);
      await loadPromise;

      expect(service.config().sections.clients.enabled).toBe(false);
    });

    it('(US3-b) missing en key in TranslatedString does not cause crash', async () => {
      const configMissingEn = {
        ...VALID_CONFIG,
        nav: {
          aboutMe: { pt: 'Sobre Mim' }, // no 'en' key
          myProcess: { pt: 'Meu Processo' },
          clients: { pt: 'Clientes' },
          contact: { pt: 'Contato' },
        },
      };
      const loadPromise = service.load();
      const req = httpMock.expectOne('/assets/config.json');
      req.flush(configMissingEn);
      await loadPromise;

      const config = service.config();
      expect(config.nav.aboutMe.pt).toBe('Sobre Mim');
      expect(config.nav.aboutMe.en).toBeUndefined();
    });

    it('(US3-c) config with empty testimonials array does not cause crash', async () => {
      const loadPromise = service.load();
      const req = httpMock.expectOne('/assets/config.json');
      req.flush(VALID_CONFIG);
      await loadPromise;

      expect(service.config().sections.clients.testimonials).toEqual([]);
    });
  });
});
