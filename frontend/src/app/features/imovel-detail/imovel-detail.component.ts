import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfigService } from '../../core/services/config.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { PropertyListing } from '../../core/models/site-config.model';
import { StickyHeaderComponent } from '../../shared/components/sticky-header/sticky-header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { WhatsAppFloatComponent } from '../../shared/components/whatsapp-float/whatsapp-float.component';

@Component({
  selector: 'app-imovel-detail',
  standalone: true,
  imports: [TranslatePipe, RouterLink, StickyHeaderComponent, FooterComponent, WhatsAppFloatComponent],
  template: `
    <app-whatsapp-float />
    <app-sticky-header [activeSection]="''" />

    @if (listing(); as l) {
      <!-- Breadcrumb -->
      <div class="breadcrumb container">
        <a routerLink="/" class="breadcrumb__link">{{ ui().home }}</a>
        <span class="material-icons breadcrumb__sep">chevron_right</span>
        <a routerLink="/" fragment="imoveis" class="breadcrumb__link">{{ ui().properties }}</a>
        <span class="material-icons breadcrumb__sep">chevron_right</span>
        <span class="breadcrumb__current">{{ l.address }}</span>
      </div>

      <div class="detail-layout container">
        <!-- LEFT column -->
        <main class="detail-main">
          <!-- Gallery -->
          <div class="gallery">
            <div class="gallery__main-wrap">
              <div
                class="gallery__main"
                [style.backgroundImage]="'url(' + activeImage() + ')'"
              ></div>
              @if (l.images.length > 1) {
                <button class="gallery__nav gallery__nav--prev" (click)="prevImage(l.images.length)" [attr.aria-label]="ui().prev">
                  <span class="material-icons">chevron_left</span>
                </button>
                <button class="gallery__nav gallery__nav--next" (click)="nextImage(l.images.length)" [attr.aria-label]="ui().next">
                  <span class="material-icons">chevron_right</span>
                </button>
                <div class="gallery__counter">{{ activeIdx() + 1 }} / {{ l.images.length }}</div>
              }
            </div>

            @if (l.images.length > 1) {
              <div class="gallery__thumbs">
                @for (img of l.images; track img; let i = $index) {
                  <button
                    class="gallery__thumb"
                    [class.active]="activeIdx() === i"
                    [style.backgroundImage]="'url(' + img + ')'"
                    (click)="setImage(i)"
                    [attr.aria-label]="ui().photo + ' ' + (i + 1)"
                  ></button>
                }
              </div>
            }
          </div>

          <!-- Description -->
          @if (l.description) {
            <section class="detail-section">
              <h2 class="detail-section__title">{{ ui().about }}</h2>
              <p class="detail-description">{{ l.description | translate }}</p>
            </section>
          }

          <!-- Amenities -->
          @if (l.amenities?.length) {
            <section class="detail-section">
              <h2 class="detail-section__title">{{ ui().highlights }}</h2>
              <ul class="amenities-list">
                @for (a of l.amenities!; track a) {
                  <li class="amenity-item">{{ a }}</li>
                }
              </ul>
            </section>
          }

          <!-- Specs detail -->
          <section class="detail-section">
            <h2 class="detail-section__title">{{ ui().specs }}</h2>
            <div class="specs-grid">
              <div class="spec-item">
                <span class="material-icons spec-item__icon">square_foot</span>
                <div>
                  <div class="spec-item__value">{{ l.areaM2 }} m²</div>
                  <div class="spec-item__label">{{ ui().area }}</div>
                </div>
              </div>
              <div class="spec-item">
                <span class="material-icons spec-item__icon">bed</span>
                <div>
                  <div class="spec-item__value">{{ l.bedrooms }}</div>
                  <div class="spec-item__label">{{ l.bedrooms === 1 ? ui().bedroom : ui().bedrooms }}</div>
                </div>
              </div>
              <div class="spec-item">
                <span class="material-icons spec-item__icon">shower</span>
                <div>
                  <div class="spec-item__value">{{ l.bathrooms }}</div>
                  <div class="spec-item__label">{{ l.bathrooms === 1 ? ui().bathroom : ui().bathrooms }}</div>
                </div>
              </div>
              @if (l.parkingSpots) {
                <div class="spec-item">
                  <span class="material-icons spec-item__icon">directions_car</span>
                  <div>
                    <div class="spec-item__value">{{ l.parkingSpots }}</div>
                    <div class="spec-item__label">{{ l.parkingSpots === 1 ? ui().spot : ui().spots }}</div>
                  </div>
                </div>
              }
            </div>
          </section>
        </main>

        <!-- RIGHT sticky sidebar -->
        <aside class="detail-sidebar">
          <div class="sidebar-card">
            <div class="sidebar-card__badge">{{ l.type | translate }}</div>
            <div class="sidebar-card__address">{{ l.address }}</div>
            <div class="sidebar-card__neighborhood">
              <span class="material-icons">location_on</span>
              {{ l.neighborhood }}
            </div>
            <div class="sidebar-card__divider"></div>
            <div class="sidebar-card__price">{{ formatPrice(l.price) }}</div>
            <div class="sidebar-card__modality">{{ l.modality | translate }}</div>
            <div class="sidebar-card__divider"></div>
            <div class="sidebar-card__specs">
              <span class="sidebar-spec">
                <span class="material-icons">square_foot</span> {{ l.areaM2 }} m²
              </span>
              <span class="sidebar-spec">
                <span class="material-icons">bed</span> {{ l.bedrooms }} {{ l.bedrooms === 1 ? ui().bedroom : ui().bedrooms }}
              </span>
              <span class="sidebar-spec">
                <span class="material-icons">shower</span> {{ l.bathrooms }} {{ l.bathrooms === 1 ? ui().bathroom : ui().bathrooms }}
              </span>
              @if (l.parkingSpots) {
                <span class="sidebar-spec">
                  <span class="material-icons">directions_car</span> {{ l.parkingSpots }} {{ l.parkingSpots === 1 ? ui().spot : ui().spots }}
                </span>
              }
            </div>
            <a class="sidebar-card__cta" [href]="waLink()" target="_blank" rel="noopener">
              <span class="material-icons">chat</span>
              {{ ui().cta }}
            </a>
          </div>
        </aside>
      </div>

      <!-- Dark CTA Banner -->
      <section class="cta-banner">
        <div class="cta-banner__inner container">
          <div class="cta-banner__text">
            <h2 class="cta-banner__heading">{{ ui().bannerHeading }}</h2>
            <p class="cta-banner__sub">{{ ui().bannerSub }}</p>
          </div>
          <a class="cta-banner__btn" [href]="waLink()" target="_blank" rel="noopener">
            <span class="material-icons">chat</span>
            {{ ui().talkWith }} {{ config().site.agentName }}
          </a>
        </div>
      </section>
    } @else {
      <div class="not-found container">
        <p>{{ ui().notFound }}</p>
        <a routerLink="/" class="not-found__back">{{ ui().back }}</a>
      </div>
    }

    <app-footer />
  `,
  styles: [`
    /* ── Breadcrumb ──────────────────────────── */
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 88px 0 16px;
      font-size: 0.82rem;
      color: var(--muted);
    }
    .breadcrumb__link {
      color: var(--muted);
      text-decoration: none;
      transition: color 0.2s;
    }
    .breadcrumb__link:hover { color: var(--accent); }
    .breadcrumb__sep { font-size: 16px; }
    .breadcrumb__current { color: var(--text); font-weight: 500; }

    /* ── Two-column layout ───────────────────── */
    .detail-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 40px;
      padding-bottom: 64px;
    }
    @media (min-width: 900px) {
      .detail-layout {
        grid-template-columns: 1fr 360px;
        align-items: start;
      }
    }

    /* ── Gallery ─────────────────────────────── */
    .gallery { margin-bottom: 40px; }
    .gallery__main-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 16/9;
      border-radius: 16px;
      overflow: hidden;
      background: #1a1a16;
    }
    .gallery__main {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      transition: background-image 0.3s ease;
    }
    .gallery__nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(13,13,11,0.6);
      border: none;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      z-index: 2;
      transition: background 0.2s;
      padding: 0;
    }
    .gallery__nav:hover { background: rgba(13,13,11,0.9); }
    .gallery__nav--prev { left: 14px; }
    .gallery__nav--next { right: 14px; }
    .gallery__nav .material-icons { font-size: 24px; }
    .gallery__counter {
      position: absolute;
      top: 12px;
      right: 14px;
      background: rgba(13,13,11,0.65);
      color: #fff;
      font-size: 0.78rem;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 20px;
    }
    .gallery__thumbs {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .gallery__thumb {
      flex-shrink: 0;
      width: 80px;
      height: 56px;
      border-radius: 8px;
      background-size: cover;
      background-position: center;
      border: 2px solid transparent;
      cursor: pointer;
      transition: border-color 0.2s, opacity 0.2s;
      opacity: 0.7;
      padding: 0;
    }
    .gallery__thumb.active,
    .gallery__thumb:hover {
      border-color: var(--accent);
      opacity: 1;
    }

    /* ── Detail sections ─────────────────────── */
    .detail-section { margin-bottom: 40px; }
    .detail-section__title {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--text);
      margin: 0 0 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }
    .detail-description {
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--muted);
      margin: 0;
    }

    /* ── Amenities ───────────────────────────── */
    .amenities-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 10px;
    }
    .amenity-item {
      background: var(--surface);
      border: 1px solid rgba(0,0,0,0.07);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 0.88rem;
      color: var(--text);
    }

    /* ── Specs grid ──────────────────────────── */
    .specs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 16px;
    }
    .spec-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--surface);
      border-radius: 12px;
      padding: 16px;
    }
    .spec-item__icon {
      font-size: 24px;
      color: var(--accent);
    }
    .spec-item__value {
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text);
    }
    .spec-item__label {
      font-size: 0.78rem;
      color: var(--muted);
      margin-top: 2px;
    }

    /* ── Sidebar ─────────────────────────────── */
    .detail-sidebar {
      position: sticky;
      top: 80px;
    }
    .sidebar-card {
      background: var(--surface);
      border-radius: 20px;
      padding: 28px;
      border: 1px solid rgba(0,0,0,0.07);
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .sidebar-card__badge {
      display: inline-block;
      background: rgba(201,168,76,0.15);
      color: var(--accent);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 20px;
      align-self: flex-start;
    }
    .sidebar-card__address {
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text);
      line-height: 1.3;
    }
    .sidebar-card__neighborhood {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.82rem;
      color: var(--muted);
    }
    .sidebar-card__neighborhood .material-icons { font-size: 16px; color: var(--accent); }
    .sidebar-card__divider {
      height: 1px;
      background: rgba(0,0,0,0.07);
      margin: 4px 0;
    }
    .sidebar-card__price {
      font-family: 'Playfair Display', serif;
      font-size: 1.7rem;
      font-weight: 700;
      color: var(--accent);
    }
    .sidebar-card__modality {
      font-size: 0.8rem;
      color: var(--muted);
      margin-top: -6px;
    }
    .sidebar-card__specs {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .sidebar-spec {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: var(--text);
    }
    .sidebar-spec .material-icons { font-size: 17px; color: var(--accent); }
    .sidebar-card__cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
      padding: 14px;
      background: var(--accent);
      color: #0D0D0B;
      font-weight: 700;
      font-size: 0.95rem;
      border-radius: 40px;
      text-decoration: none;
      transition: background 0.2s, transform 0.2s;
    }
    .sidebar-card__cta:hover {
      background: var(--accent-dark);
      transform: translateY(-1px);
    }
    .sidebar-card__cta .material-icons { font-size: 20px; }

    /* ── Dark CTA Banner ─────────────────────── */
    .cta-banner {
      background: var(--text);
      padding: 60px 0;
      margin-top: 16px;
    }
    .cta-banner__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
    }
    .cta-banner__heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.4rem, 3vw, 2rem);
      font-weight: 700;
      color: #fff;
      margin: 0 0 8px;
    }
    .cta-banner__sub {
      font-size: 0.95rem;
      color: rgba(255,255,255,0.6);
      margin: 0;
    }
    .cta-banner__btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 36px;
      background: var(--accent);
      color: #0D0D0B;
      font-weight: 700;
      font-size: 0.95rem;
      border-radius: 40px;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.2s, transform 0.2s;
    }
    .cta-banner__btn:hover {
      background: var(--accent-dark);
      transform: translateY(-1px);
    }
    .cta-banner__btn .material-icons { font-size: 20px; }

    /* ── Not found ───────────────────────────── */
    .not-found {
      padding: 80px 0;
      text-align: center;
      color: var(--muted);
    }
    .not-found__back {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
    }

    /* ── Mobile adjustments ──────────────────── */
    @media (max-width: 640px) {
      .cta-banner__inner { flex-direction: column; align-items: flex-start; }
      .gallery__thumb { width: 64px; height: 46px; }
    }
  `],
})
export class ImovelDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly configSvc = inject(ConfigService);
  private readonly langSvc = inject(LanguageService);

  protected readonly config = this.configSvc.config;
  protected readonly activeIdx = signal(0);

  protected readonly listing = computed<PropertyListing | null>(() => {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (!id) return null;
    const listings = this.config().sections.imoveis?.listings ?? [];
    return listings.find(l => l.id === id) ?? null;
  });

  protected readonly activeImage = computed(() => {
    const l = this.listing();
    if (!l || !l.images.length) return '';
    return l.images[this.activeIdx()] ?? l.images[0];
  });

  protected readonly ui = computed((): {
    home: string; properties: string; prev: string; next: string; photo: string;
    about: string; highlights: string; specs: string; area: string;
    bedroom: string; bedrooms: string; bathroom: string; bathrooms: string;
    spot: string; spots: string; cta: string;
    bannerHeading: string; bannerSub: string; talkWith: string;
    notFound: string; back: string;
  } => {
    const lang = this.langSvc.lang();
    if (lang === 'en') return {
      home: 'Home', properties: 'Properties', prev: 'Previous', next: 'Next', photo: 'Photo',
      about: 'About this Property', highlights: 'Highlights', specs: 'Specifications', area: 'Area',
      bedroom: 'Bedroom', bedrooms: 'Bedrooms', bathroom: 'Bathroom', bathrooms: 'Bathrooms',
      spot: 'Spot', spots: 'Spots', cta: "I'm interested",
      bannerHeading: 'Did you like this property?', bannerSub: 'Contact us and schedule a visit',
      talkWith: 'Talk with', notFound: 'Property not found.', back: '← Back',
    };
    if (lang === 'es') return {
      home: 'Inicio', properties: 'Propiedades', prev: 'Anterior', next: 'Siguiente', photo: 'Foto',
      about: 'Sobre la Propiedad', highlights: 'Diferenciales', specs: 'Características', area: 'Área',
      bedroom: 'Habitación', bedrooms: 'Habitaciones', bathroom: 'Baño', bathrooms: 'Baños',
      spot: 'Plaza', spots: 'Plazas', cta: 'Me interesa',
      bannerHeading: '¿Te gustó esta propiedad?', bannerSub: 'Contáctanos y agenda una visita',
      talkWith: 'Hablar con', notFound: 'Propiedad no encontrada.', back: '← Volver',
    };
    return {
      home: 'Início', properties: 'Imóveis', prev: 'Anterior', next: 'Próxima', photo: 'Foto',
      about: 'Sobre o Imóvel', highlights: 'Diferenciais', specs: 'Características', area: 'Área',
      bedroom: 'Quarto', bedrooms: 'Quartos', bathroom: 'Banheiro', bathrooms: 'Banheiros',
      spot: 'Vaga', spots: 'Vagas', cta: 'Tenho interesse',
      bannerHeading: 'Gostou deste imóvel?', bannerSub: 'Entre em contato e agende uma visita',
      talkWith: 'Falar com', notFound: 'Imóvel não encontrado.', back: '← Voltar',
    };
  });

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
    }
  }

  protected setImage(idx: number): void {
    this.activeIdx.set(idx);
  }

  protected nextImage(total: number): void {
    this.activeIdx.update(i => (i + 1) % total);
  }

  protected prevImage(total: number): void {
    this.activeIdx.update(i => (i - 1 + total) % total);
  }

  protected formatPrice(value: number): string {
    return 'R$ ' + value.toLocaleString('pt-BR');
  }

  protected waLink(): string {
    const l = this.listing();
    if (!l) return '#';
    const phone = this.config().site.agentPhone.replace(/\D/g, '');
    const lang = this.langSvc.lang();
    const section = this.config().sections.imoveis;
    const base = section?.whatsapp.message[lang] ?? section?.whatsapp.message.pt ?? '';
    const msg = encodeURIComponent(base + l.address + ', ' + l.neighborhood);
    return `https://wa.me/${phone}?text=${msg}`;
  }
}
