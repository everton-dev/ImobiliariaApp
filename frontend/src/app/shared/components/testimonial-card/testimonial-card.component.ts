import { Component, inject, Input } from '@angular/core';
import { Testimonial } from '../../../core/models/site-config.model';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <article class="testimonial-card">
      @if (testimonial.photoUrl) {
        <img
          class="client-photo"
          [src]="testimonial.photoUrl"
          [alt]="testimonial.clientName + ' foto'"
        />
      }
      <blockquote class="quote">"{{ testimonial.quote | translate }}"</blockquote>
      <p class="client-name">— {{ testimonial.clientName }}</p>
    </article>
  `,
  styles: [`
    .testimonial-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 24px;
      border-radius: 12px;
      background: var(--mat-sys-surface-variant, #f3edf7);
      text-align: center;
    }
    .client-photo {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
    }
    .quote {
      margin: 0;
      font-style: italic;
    }
    .client-name {
      margin: 0;
      font-weight: 600;
    }
  `],
})
export class TestimonialCardComponent {
  @Input({ required: true }) testimonial!: Testimonial;
  protected readonly langService = inject(LanguageService);
}
