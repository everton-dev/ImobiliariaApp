import { Component, inject, computed, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../../core/services/config.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { PropertyListing } from '../../core/models/site-config.model';

@Component({
  selector: 'app-imoveis',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <section id="imoveis" class="imoveis-section">
      <div class="imoveis-header container">
        <div class="imoveis-title-block">
          <p class="eyebrow">
            <span class="eyebrow-dot"></span>
            {{ section().eyebrow | translate }}
          </p>
          <h2 class="imoveis-heading">{{ section().heading | translate }}</h2>
        </div>
      </div>

      <div class="imoveis-grid container">
        @for (listing of section().listings; track listing.id; let i = $index) {
          <div class="imovel-card" (click)="goToDetail(listing.id)" style="cursor:pointer">
            <!-- Image carousel -->
            <div class="imovel-img-wrap">
              <div class="imovel-slides">
                @for (img of listing.images; track img; let imgIdx = $index) {
                  <div
                    class="imovel-slide"
                    [class.active]="activeSlide()[i] === imgIdx"
                    [style.backgroundImage]="'url(' + img + ')'"
                  ></div>
                }
              </div>

              @if (listing.images.length > 1) {
                <button
                  class="slide-btn slide-prev"
                  (click)="prevSlide(i, listing.images.length); $event.stopPropagation()"
                  [attr.aria-label]="ui().prev"
                >
                  <span class="material-icons">chevron_left</span>
                </button>
                <button
                  class="slide-btn slide-next"
                  (click)="nextSlide(i, listing.images.length); $event.stopPropagation()"
                  [attr.aria-label]="ui().next"
                >
                  <span class="material-icons">chevron_right</span>
                </button>
                <div class="slide-count">{{ activeSlide()[i] + 1 }}/{{ listing.images.length }}</div>
              }

              <span class="imovel-badge">{{ listing.type | translate }}</span>
            </div>

            <!-- Card body -->
            <div class="imovel-body">
              <div class="imovel-address">{{ listing.address }}</div>
              <div class="imovel-neighborhood">{{ listing.neighborhood }}</div>

              <div class="imovel-specs">
                <span class="imovel-spec">
                  <span class="material-icons">square_foot</span>
                  {{ listing.areaM2 }} m²
                </span>
                <span class="imovel-spec">
                  <span class="material-icons">bed</span>
                  {{ listing.bedrooms }} {{ listing.bedrooms === 1 ? ui().bedroom : ui().bedrooms }}
                </span>
                <span class="imovel-spec">
                  <span class="material-icons">shower</span>
                  {{ listing.bathrooms }} {{ listing.bathrooms === 1 ? ui().bathroom : ui().bathrooms }}
                </span>
                @if (listing.parkingSpots) {
                  <span class="imovel-spec">
                    <span class="material-icons">directions_car</span>
                    {{ listing.parkingSpots }} {{ listing.parkingSpots === 1 ? ui().spot : ui().spots }}
                  </span>
                }
              </div>

              <div class="imovel-divider"></div>

              <div class="imovel-price">{{ formatPrice(listing.price) }}</div>

              <a
                class="imovel-cta"
                [href]="waLink(listing)"
                target="_blank"
                rel="noopener"
                (click)="$event.stopPropagation()"
              >
                <span class="material-icons">chat</span>
                {{ ui().cta }}
              </a>
            </div>
          </div>
        }
      </div>

      <!-- Portfolio CTA -->
      <div class="imoveis-footer container">
        <a
          class="btn-portfolio"
          [href]="waPortfolio()"
          target="_blank"
          rel="noopener"
        >
          {{ section().ctaPortfolioLabel | translate }}
          <span class="material-icons">arrow_forward</span>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .imoveis-section {
      background: var(--bg);
      padding: 80px 0 64px;
    }

    .imoveis-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 48px;
      gap: 24px;
    }

    .imoveis-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      color: var(--text);
      margin: 8px 0 0;
    }

    /* Card grid */
    .imoveis-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 32px;
    }

    .imovel-card {
      background: var(--surface);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
      transition: transform 0.3s, box-shadow 0.3s;
      border: 1px solid transparent;
      display: flex;
      flex-direction: column;
    }

    .imovel-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.12);
      border-color: rgba(201,168,76,0.3);
    }

    /* Carousel */
    .imovel-img-wrap {
      position: relative;
      height: 220px;
      overflow: hidden;
      background: #1a1a16;
    }

    .imovel-slides {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .imovel-slide {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .imovel-slide.active {
      opacity: 1;
    }

    .slide-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(13,13,11,0.55);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      z-index: 2;
      transition: background 0.2s;
      padding: 0;
    }

    .slide-btn:hover { background: rgba(13,13,11,0.85); }
    .slide-btn .material-icons { font-size: 22px; }

    .slide-prev { left: 10px; }
    .slide-next { right: 10px; }

    .slide-count {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(13,13,11,0.65);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 20px;
      z-index: 2;
    }

    .imovel-badge {
      position: absolute;
      bottom: 12px;
      left: 12px;
      background: rgba(13,13,11,0.82);
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 20px;
      z-index: 2;
    }

    /* Body */
    .imovel-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .imovel-address {
      font-family: 'Playfair Display', serif;
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text);
      line-height: 1.3;
    }

    .imovel-neighborhood {
      font-size: 0.82rem;
      color: var(--muted);
    }

    .imovel-specs {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 4px;
    }

    .imovel-spec {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: var(--muted);
    }

    .imovel-spec .material-icons {
      font-size: 15px;
      color: var(--accent);
    }

    .imovel-divider {
      height: 1px;
      background: rgba(0,0,0,0.06);
      margin: 8px 0;
    }

    .imovel-price {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--accent);
      margin-top: auto;
    }

    .imovel-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding: 11px 24px;
      background: var(--accent);
      color: #0D0D0B;
      font-weight: 700;
      font-size: 0.9rem;
      border-radius: 40px;
      text-decoration: none;
      transition: background 0.2s, transform 0.2s;
      align-self: flex-start;
    }

    .imovel-cta:hover {
      background: var(--accent-dark);
      transform: translateY(-1px);
    }

    .imovel-cta .material-icons { font-size: 18px; }

    /* Footer CTA */
    .imoveis-footer {
      margin-top: 48px;
      display: flex;
      justify-content: center;
    }

    .btn-portfolio {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 36px;
      border: 2px solid rgba(13,13,11,0.25);
      border-radius: 40px;
      color: var(--text);
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      transition: border-color 0.2s, background 0.2s;
    }

    .btn-portfolio:hover {
      border-color: var(--accent);
      color: var(--accent);
      background: rgba(201,168,76,0.05);
    }

    .btn-portfolio .material-icons { font-size: 18px; }

    @media (max-width: 640px) {
      .imoveis-grid { grid-template-columns: 1fr; }
      .imoveis-header { flex-direction: column; align-items: flex-start; }
    }
  `],
})
export class ImoveisComponent {
  private readonly configSvc = inject(ConfigService);
  private readonly langSvc   = inject(LanguageService);
  private readonly router    = inject(Router);

  protected readonly section  = computed(() => this.configSvc.config().sections.imoveis!);
  protected readonly activeSlide = signal<number[]>([]);

  protected readonly ui = computed((): {
    prev: string; next: string;
    bedroom: string; bedrooms: string;
    bathroom: string; bathrooms: string;
    spot: string; spots: string;
    cta: string; portfolioMsg: string;
  } => {
    const lang = this.langSvc.lang();
    if (lang === 'en') return {
      prev: 'Previous', next: 'Next',
      bedroom: 'Bedroom', bedrooms: 'Bedrooms',
      bathroom: 'Bathroom', bathrooms: 'Bathrooms',
      spot: 'Spot', spots: 'Spots',
      cta: "I'm interested",
      portfolioMsg: 'Hello! I would like to see the full property portfolio.',
    };
    if (lang === 'es') return {
      prev: 'Anterior', next: 'Siguiente',
      bedroom: 'Habitación', bedrooms: 'Habitaciones',
      bathroom: 'Baño', bathrooms: 'Baños',
      spot: 'Plaza', spots: 'Plazas',
      cta: 'Me interesa',
      portfolioMsg: '¡Hola! Me gustaría ver el portafolio completo de propiedades disponibles.',
    };
    return {
      prev: 'Anterior', next: 'Próxima',
      bedroom: 'Quarto', bedrooms: 'Quartos',
      bathroom: 'Banheiro', bathrooms: 'Banheiros',
      spot: 'Vaga', spots: 'Vagas',
      cta: 'Tenho interesse',
      portfolioMsg: 'Olá! Gostaria de ver o portfólio completo de imóveis disponíveis.',
    };
  });

  constructor() {
    effect(() => {
      const count = this.section().listings.length;
      if (this.activeSlide().length !== count) {
        this.activeSlide.set(new Array(count).fill(0));
      }
    }, { allowSignalWrites: true });
  }

  protected goToDetail(id: string): void {
    this.router.navigate(['/imovel'], { queryParams: { id } });
  }

  protected formatPrice(value: number): string {
    return 'R$ ' + value.toLocaleString('pt-BR');
  }

  protected nextSlide(cardIdx: number, total: number): void {
    this.activeSlide.update(slides => {
      const copy = [...slides];
      copy[cardIdx] = (copy[cardIdx] + 1) % total;
      return copy;
    });
  }

  protected prevSlide(cardIdx: number, total: number): void {
    this.activeSlide.update(slides => {
      const copy = [...slides];
      copy[cardIdx] = (copy[cardIdx] - 1 + total) % total;
      return copy;
    });
  }

  protected waLink(listing: PropertyListing): string {
    const phone = this.configSvc.config().site.agentPhone.replace(/\D/g, '');
    const lang  = this.langSvc.lang();
    const msg0  = this.section().whatsapp.message;
    const base  = msg0[lang] ?? msg0.pt;
    const msg   = encodeURIComponent(base + listing.address + ', ' + listing.neighborhood);
    return `https://wa.me/${phone}?text=${msg}`;
  }

  protected waPortfolio(): string {
    const phone = this.configSvc.config().site.agentPhone.replace(/\D/g, '');
    const msg   = encodeURIComponent(this.ui().portfolioMsg);
    return `https://wa.me/${phone}?text=${msg}`;
  }
}
