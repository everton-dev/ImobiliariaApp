import { Component, inject, computed } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ConfigService } from '../../core/services/config.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <section
      id="hero"
      class="hero"
      [style.backgroundImage]="bgImage()"
    >
      @if (bgImage()) {
        <div class="hero-overlay"></div>
      }

      <div class="hero-content container">
        <p class="eyebrow">
          <span class="eyebrow-dot"></span>
          {{ section().eyebrow | translate }}
        </p>

        <h1 class="hero-heading">
          {{ section().heading | translate }}
          <em class="hero-heading-em"> {{ section().headingEmphasis | translate }}</em>
        </h1>

        <p class="hero-sub">{{ section().subheading | translate }}</p>

        <div class="hero-ctas">
          <a class="btn-gold" [href]="waLink()" target="_blank" rel="noopener">
            <span class="material-icons" aria-hidden="true">chat</span>
            {{ section().ctaPrimary.label | translate }}
          </a>
          <a class="btn-outline" [href]="'#' + section().ctaSecondaryAnchor">
            {{ section().ctaSecondaryLabel | translate }}
            <span class="material-icons" aria-hidden="true">south</span>
          </a>
        </div>
      </div>

      <!-- Stats bar -->
      @if (section().stats.length) {
        <div class="stats-bar">
          <div class="stats-inner container">
            @for (stat of section().stats; track stat.value) {
              <div class="stat">
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label | translate }}</span>
              </div>
            }
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: 100svh;
      display: flex;
      flex-direction: column;
      background-color: #1a1a16;
      background-size: cover;
      background-position: center;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(to right,  rgba(247,244,239,0.95) 0%, rgba(247,244,239,0.0) 45%),
        linear-gradient(to left,   rgba(247,244,239,0.95) 0%, rgba(247,244,239,0.0) 45%),
        rgba(247,244,239,0.15);
    }

    .hero-content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      flex: 1;
      padding-block: calc(var(--nav-h) + 80px) 120px;
      gap: 28px;
    }

    .eyebrow { color: var(--accent); }

    .hero-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.4rem, 6vw, 4.5rem);
      color: #0D0D0B;
      max-width: 560px;
      line-height: 1.1;
    }

    .hero-heading-em {
      color: var(--accent);
      font-style: italic;
    }

    .hero-sub {
      color: rgba(13,13,11,0.65);
      font-size: clamp(1rem, 2.5vw, 1.2rem);
      max-width: 520px;
      line-height: 1.7;
    }

    .hero-ctas {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 8px;
    }

    /* Stats bar */
    .stats-bar {
      position: relative;
      background: rgba(13,13,11,0.9);
      border-top: 1px solid rgba(201,168,76,0.2);
      padding: 28px 0;
    }

    .stats-inner {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 24px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .stat-value {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 700;
      color: var(--accent);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.55);
      text-align: center;
    }

    @media (max-width: 600px) {
      .hero-ctas { flex-direction: column; align-items: flex-start; }
      .stats-inner { grid-template-columns: repeat(2, 1fr); }
    }
  `],
})
export class HeroComponent {
  private readonly configSvc = inject(ConfigService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly langSvc   = inject(LanguageService);
  protected readonly section = computed(() => this.configSvc.config().sections.hero);

  protected bgImage(): SafeStyle | '' {
    const url = this.section().backgroundImageUrl;
    return url ? this.sanitizer.bypassSecurityTrustStyle(`url('${url}')`) : '';
  }

  protected waLink(): string {
    const phone = this.configSvc.config().site.agentPhone.replace(/\D/g, '');
    const messages = this.section().ctaPrimary.message;
    const lang = this.langSvc.lang();
    const msg = encodeURIComponent(messages[lang] ?? messages.pt);
    return `https://wa.me/${phone}?text=${msg}`;
  }
}
