import { Component, inject, computed } from '@angular/core';
import { ConfigService } from '../../core/services/config.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { Testimonial } from '../../core/models/site-config.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <section id="clients" class="clients">
      <div class="container">
        <div class="clients-top">
          <p class="eyebrow">
            <span class="eyebrow-dot"></span>
            {{ section().eyebrow | translate }}
          </p>
          <h2 class="clients-heading">{{ section().heading | translate }}</h2>
        </div>

        @if (section().testimonials.length) {
          <div class="testimonials-grid">
            @for (item of section().testimonials; track item.clientName) {
              <div class="testimonial-card card-lift">
                <!-- Stars -->
                @if (item.score) {
                  <div class="stars-row">
                    @for (i of stars(item.score); track i) {
                      <span class="material-icons star">star</span>
                    }
                    <span class="score-label">{{ item.score }}.0</span>
                  </div>
                }

                <span class="quote-mark" aria-hidden="true">"</span>

                <p class="quote-text">{{ item.quote | translate }}</p>

                <div class="author">
                  @if (item.photoUrl) {
                    <img [src]="item.photoUrl" [alt]="item.clientName" class="avatar-photo" />
                  } @else {
                    <div
                      class="avatar-circle"
                      [style.background]="item.avatarColor || '#726D66'"
                    >{{ item.clientName.charAt(0) }}</div>
                  }
                  <div class="author-info">
                    <span class="author-name">{{ item.clientName }}</span>
                    @if (item.location) {
                      <span class="author-location">{{ item.location | translate }}</span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .clients {
      background: var(--bg);
      padding: 96px 0;
    }

    .clients-top {
      text-align: center;
      margin-bottom: 64px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .clients-heading { color: var(--text); }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
    }

    .testimonial-card {
      background: var(--bg-elevated);
      border-radius: 16px;
      padding: 32px 28px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      border: 1px solid transparent;
      transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    }

    .testimonial-card:hover { border-color: rgba(201,168,76,0.25); }

    .stars-row {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .star {
      color: var(--accent);
      font-size: 18px;
    }

    .score-label {
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--accent);
      margin-left: 6px;
    }

    .quote-mark {
      font-family: 'Playfair Display', serif;
      font-size: 4rem;
      color: var(--accent);
      opacity: 0.3;
      line-height: 0.5;
      align-self: flex-start;
    }

    .quote-text {
      color: var(--text);
      font-style: italic;
      font-size: 0.95rem;
      line-height: 1.75;
      flex: 1;
    }

    .author {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid rgba(0,0,0,0.06);
    }

    .avatar-circle,
    .avatar-photo {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .avatar-photo { object-fit: cover; }

    .avatar-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .author-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .author-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text);
    }

    .author-location {
      font-size: 0.8rem;
      color: var(--muted);
    }

    @media (max-width: 900px) {
      .testimonials-grid {
        grid-template-columns: repeat(2, 1fr);
        overflow-x: auto;
      }
    }

    @media (max-width: 560px) {
      .testimonials-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class ClientsComponent {
  private readonly configSvc = inject(ConfigService);
  protected readonly section = computed(() => this.configSvc.config().sections.clients);

  protected stars(score: number): number[] {
    return Array.from({ length: Math.min(Math.round(score), 5) }, (_, i) => i);
  }
}
