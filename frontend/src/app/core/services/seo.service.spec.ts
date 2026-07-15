import { TestBed } from '@angular/core/testing';
import { SeoService } from './seo.service';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoConfig, SiteInfo } from '../models/site-config.model';

const SEO_CONFIG: SeoConfig = {
  title: { pt: 'Título da Seção', en: 'Section Title' },
  description: { pt: 'Descrição da seção', en: 'Section description' },
};

const SITE_INFO: SiteInfo = {
  title: { pt: 'Imobiliária Maria' },
  description: { pt: 'Especialista em imóveis' },
  agentName: 'Maria Silva',
  agentPhone: '5511999998888',
  ogImage: 'https://example.com/og.jpg',
};

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let metaService: Meta;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeoService, Title, Meta],
    });
    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
    document = TestBed.inject(DOCUMENT);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('(a) update() sets <title> via Title service in pt', () => {
    service.update(SEO_CONFIG, 'pt');
    expect(titleService.getTitle()).toBe('Título da Seção');
  });

  it('(a) update() sets <title> via Title service in en', () => {
    service.update(SEO_CONFIG, 'en');
    expect(titleService.getTitle()).toBe('Section Title');
  });

  it('(b) update() sets <meta name="description">', () => {
    service.update(SEO_CONFIG, 'pt');
    const desc = metaService.getTag('name="description"');
    expect(desc?.getAttribute('content')).toBe('Descrição da seção');
  });

  it('(c) update() sets og:title and og:description', () => {
    service.update(SEO_CONFIG, 'pt');
    expect(metaService.getTag('property="og:title"')?.getAttribute('content'))
      .toBe('Título da Seção');
    expect(metaService.getTag('property="og:description"')?.getAttribute('content'))
      .toBe('Descrição da seção');
  });

  it('(c) update() sets og:image when ogImage is provided', () => {
    service.update(SEO_CONFIG, 'pt', 'https://example.com/image.jpg');
    expect(metaService.getTag('property="og:image"')?.getAttribute('content'))
      .toBe('https://example.com/image.jpg');
  });

  it('(d) injectStructuredData() creates a LocalBusiness JSON-LD script tag', () => {
    service.injectStructuredData(SITE_INFO);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed['@type']).toBe('LocalBusiness');
    expect(parsed.name).toBe('Maria Silva');
    expect(parsed.telephone).toBe('+5511999998888');
  });

  it('(e) subsequent update() calls do not create duplicate meta tags', () => {
    service.update(SEO_CONFIG, 'pt');
    service.update(SEO_CONFIG, 'en');
    const descTags = document.querySelectorAll('meta[name="description"]');
    expect(descTags.length).toBe(1);
    const ogTitleTags = document.querySelectorAll('meta[property="og:title"]');
    expect(ogTitleTags.length).toBe(1);
  });

  it('(e) subsequent injectStructuredData() calls do not create duplicate script tags', () => {
    service.injectStructuredData(SITE_INFO);
    service.injectStructuredData(SITE_INFO);
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(1);
  });
});
