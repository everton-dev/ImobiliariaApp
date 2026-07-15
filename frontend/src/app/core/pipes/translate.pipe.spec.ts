import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate.pipe';
import { LanguageService } from '../services/language.service';
import { TranslatedString } from '../models/site-config.model';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let langService: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslatePipe, LanguageService],
    });
    pipe = TestBed.inject(TranslatePipe);
    langService = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns pt string by default', () => {
    const field: TranslatedString = { pt: 'Olá', en: 'Hello' };
    expect(pipe.transform(field)).toBe('Olá');
  });

  it('returns active-language string after setLang', () => {
    const field: TranslatedString = { pt: 'Olá', en: 'Hello', es: 'Hola' };
    langService.setLang('en');
    expect(pipe.transform(field)).toBe('Hello');
    langService.setLang('es');
    expect(pipe.transform(field)).toBe('Hola');
  });

  it('falls back to pt when translation missing', () => {
    const field: TranslatedString = { pt: 'Somente PT' };
    langService.setLang('en');
    expect(pipe.transform(field)).toBe('Somente PT');
  });

  it('returns empty string for null/undefined input', () => {
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
  });
});
