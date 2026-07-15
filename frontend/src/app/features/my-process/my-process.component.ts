import { Component, inject, computed } from '@angular/core';
import { ConfigService } from '../../core/services/config.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-my-process',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <section id="my-process" class="my-process">
      <div class="container">
        <div class="process-top">
          <p class="eyebrow">
            <span class="eyebrow-dot"></span>
            {{ section().eyebrow | translate }}
          </p>
          <h2 class="process-heading">
            {{ section().heading | translate }}
            <em class="process-heading-em"> {{ section().headingEmphasis | translate }}</em>
          </h2>
        </div>

        @if (section().steps.length) {
          <div class="steps-grid">
            @for (step of section().steps; track step.number) {
              <div class="step-card card-lift">
                <span class="step-number" aria-hidden="true">{{ step.number }}</span>
                <div class="step-icon">
                  <span class="material-icons">{{ step.icon }}</span>
                </div>
                <h3 class="step-heading">{{ step.heading | translate }}</h3>
                <p class="step-body">{{ step.body | translate }}</p>
              </div>
            }
          </div>
        }

        <div class="process-cta">
          <a class="btn-gold" [href]="waLink()" target="_blank" rel="noopener">
            <span class="material-icons" aria-hidden="true">chat</span>
            {{ section().whatsapp.label | translate }}
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .my-process {
      background: var(--bg-elevated);
      padding: 96px 0;
    }

    .process-top {
      text-align: center;
      margin-bottom: 64px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .process-heading {
      color: var(--text);
      max-width: 600px;
      line-height: 1.2;
    }

    .process-heading-em {
      color: var(--accent);
      font-style: italic;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
      margin-bottom: 56px;
    }

    .step-card {
      background: var(--bg);
      border-radius: 16px;
      padding: 36px 28px;
      position: relative;
      overflow: hidden;
      border: 2px solid transparent;
      transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    }

    .step-card:hover { border-color: var(--accent); }

    .step-number {
      position: absolute;
      top: -8px;
      right: 20px;
      font-family: 'Playfair Display', serif;
      font-size: 5rem;
      font-weight: 700;
      color: var(--accent);
      opacity: 0.12;
      line-height: 1;
      user-select: none;
      pointer-events: none;
    }

    .step-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      background: rgba(201,168,76,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .step-icon .material-icons {
      color: var(--accent);
      font-size: 24px;
    }

    .step-heading {
      font-family: 'Playfair Display', serif;
      font-size: 1.15rem;
      color: var(--text);
      margin: 0 0 12px;
    }

    .step-body {
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.7;
    }

    .process-cta {
      display: flex;
      justify-content: center;
    }

    @media (max-width: 900px) { .steps-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 560px) { .steps-grid { grid-template-columns: 1fr; } }
  `],
})
export class MyProcessComponent {
  private readonly configSvc = inject(ConfigService);
  private readonly langSvc = inject(LanguageService);
  protected readonly section = computed(() => this.configSvc.config().sections.myProcess);

  protected waLink(): string {
    const phone = this.configSvc.config().site.agentPhone.replace(/\D/g, '');
    const msg = encodeURIComponent(this.langSvc.translate(this.section().whatsapp.message));
    return `https://wa.me/${phone}?text=${msg}`;
  }
}
