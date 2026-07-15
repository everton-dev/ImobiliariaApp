import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { LangCode, TranslatedString } from '../models/site-config.model';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LanguageService] });
    service = TestBed.inject(LanguageService);
  });

  it('should default to pt', () => {
    expect(service.lang()).toBe('pt');
  });

  it('setLang changes the active language', () => {
    service.setLang('en');
    expect(service.lang()).toBe('en');
    service.setLang('es');
    expect(service.lang()).toBe('es');
  });

  it('translate returns the active-language string', () => {
    const field: TranslatedString = { pt: 'Sobre Mim', en: 'About Me', es: 'Sobre Mí' };
    service.setLang('en');
    expect(service.translate(field)).toBe('About Me');
    service.setLang('es');
    expect(service.translate(field)).toBe('Sobre Mí');
  });

  it('translate falls back to pt when active language is missing', () => {
    const field: TranslatedString = { pt: 'Apenas PT' };
    service.setLang('en');
    expect(service.translate(field)).toBe('Apenas PT');
  });

  it('translate falls back to pt when active-language value is undefined', () => {
    const field = { pt: 'PT fallback', en: undefined } as unknown as TranslatedString;
    service.setLang('en');
    expect(service.translate(field)).toBe('PT fallback');
  });
});
