import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { TranslatedString } from '../../core/models/site-config.model';

@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private readonly lang: LanguageService) {}

  transform(field: TranslatedString | null | undefined): string {
    if (!field) return '';
    return this.lang.translate(field);
  }
}
