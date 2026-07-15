import { Component, inject, computed } from '@angular/core';
import { ConfigService } from '../../core/services/config.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <section id="about-me" class="about-me">
      <div class="container">
        <div class="about-top">
          <p class="eyebrow">
            <span class="eyebrow-dot"></span>
            {{ section().eyebrow | translate }}
          </p>
          <h2 class="about-heading">{{ section().heading | translate }}</h2>
          @if (section().intro.pt) {
            <p class="about-intro">{{ section().intro | translate }}</p>
          }
        </div>

        @if (section().cards.length) {
          <div class="cards-grid">
            @for (card of section().cards; track card.heading.pt) {
              <div class="feature-card card-lift">
                <div class="card-icon" [style.background]="card.iconBg">
                  <span class="material-icons">{{ card.icon }}</span>
                </div>
                <h3 class="card-heading">{{ card.heading | translate }}</h3>
                <p class="card-body">{{ card.body | translate }}</p>
              </div>
            }
          </div>
        }

        <div class="about-cta">
          <a class="btn-gold" [href]="waLink()" target="_blank" rel="noopener">
            <span class="material-icons" aria-hidden="true">chat</span>
            {{ section().whatsapp.label | translate }}
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-me {
      background: var(--bg);
      padding: 96px 0;
    }

    .about-top {
      text-align: center;
      margin-bottom: 64px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .about-heading {
      color: var(--text);
      max-width: 600px;
    }

    .about-intro {
      color: var(--muted);
      max-width: 560px;
      font-size: 1.05rem;
      line-height: 1.75;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
      margin-bottom: 56px;
    }

    .feature-card {
      background: var(--bg-elevated);
      border-radius: 16px;
      padding: 36px 28px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      border: 1px solid transparent;
      transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    }

    .feature-card:hover { border-color: rgba(201,168,76,0.3); }

    .card-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-icon .material-icons {
      color: #fff;
      font-size: 26px;
    }

    .card-heading {
      font-family: 'Playfair Display', serif;
      font-size: 1.15rem;
      color: var(--text);
      margin: 0;
    }

    .card-body {
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.7;
    }

    .about-cta {
      display: flex;
      justify-content: center;
    }

    @media (max-width: 900px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 560px) { .cards-grid { grid-template-columns: 1fr; } }
  `],
})
export class AboutMeComponent {
  private readonly configSvc = inject(ConfigService);
  private readonly langSvc = inject(LanguageService);
  protected readonly section = computed(() => this.configSvc.config().sections.aboutMe);

  protected waLink(): string {
    const phone = this.configSvc.config().site.agentPhone.replace(/\D/g, '');
    const msg = encodeURIComponent(this.langSvc.translate(this.section().whatsapp.message));
    return `https://wa.me/${phone}?text=${msg}`;
  }
}
