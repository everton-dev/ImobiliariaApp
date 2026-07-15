import { Injectable, signal } from '@angular/core';
import { LangCode, TranslatedString } from '../models/site-config.model';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly _lang = signal<LangCode>('pt');
  readonly lang = this._lang.asReadonly();

  setLang(lang: LangCode): void {
    this._lang.set(lang);
  }

  translate(field: TranslatedString): string {
    const value = field[this._lang()];
    return value ?? field.pt;
  }
}
