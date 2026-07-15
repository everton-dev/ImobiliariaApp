import { Component, HostListener, inject, Input, signal } from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { NavLabels } from '../../../core/models/site-config.model';

interface NavEntry {
  id: keyof NavLabels;
  anchor: string;
}

@Component({
  selector: 'app-sticky-header',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <header class="nav" [class.scrolled]="scrolled()" [class.menu-open]="menuOpen()">
      <div class="nav-inner container">

        <!-- Logo -->
        <a class="logo" href="#" aria-label="Início">
          <img src="assets/images/logo.png" [alt]="config().site.agentName" class="logo-img" />
        </a>

        <!-- Desktop nav links -->
        <nav class="nav-links" aria-label="Seções do site">
          @for (item of navEntries; track item.id) {
            <a
              class="nav-link"
              [class.active]="activeSection === item.anchor"
              [href]="'#' + item.anchor"
              (click)="closeMenu()"
            >{{ config().nav[item.id] | translate }}</a>
          }
        </nav>

        <!-- Desktop right: lang + login + CTA -->
        <div class="nav-actions">
          <div class="lang-switcher">
            <button class="lang-btn" [class.active]="currentLang() === 'pt'" aria-label="Português" (click)="setLang('pt')">
              <img src="assets/images/flags/br.png" alt="BR" />
            </button>
            <button class="lang-btn" [class.active]="currentLang() === 'es'" aria-label="Español" (click)="setLang('es')">
              <img src="assets/images/flags/es.png" alt="ES" />
            </button>
            <button class="lang-btn" [class.active]="currentLang() === 'en'" aria-label="English" (click)="setLang('en')">
              <img src="assets/images/flags/gb.png" alt="EN" />
            </button>
          </div>
          <button class="login-btn" aria-label="Login" type="button">
            <span class="material-icons">account_circle</span>
          </button>

          @if (config().sections.hero.ctaPrimary.label.pt) {
            <a
              class="nav-cta"
              [href]="waLink()"
              target="_blank"
              rel="noopener"
              aria-label="WhatsApp"
            >{{ config().sections.hero.ctaPrimary.label | translate }}</a>
          }
        </div>

        <!-- Hamburger -->
        <button
          class="hamburger"
          [class.open]="menuOpen()"
          (click)="toggleMenu()"
          aria-label="Menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <!-- Mobile fullscreen overlay -->
      @if (menuOpen()) {
        <div class="mobile-overlay">
          <nav class="mobile-nav" aria-label="Navegação mobile">
            @for (item of navEntries; track item.id) {
              <a
                class="mobile-link"
                [href]="'#' + item.anchor"
                (click)="closeMenu()"
              >{{ config().nav[item.id] | translate }}</a>
            }
          </nav>
          <div class="mobile-lang">
            <button class="lang-btn" [class.active]="currentLang() === 'pt'" aria-label="Português" (click)="setLang('pt')">
              <img src="assets/images/flags/br.png" alt="BR" />
            </button>
            <button class="lang-btn" [class.active]="currentLang() === 'es'" aria-label="Español" (click)="setLang('es')">
              <img src="assets/images/flags/es.png" alt="ES" />
            </button>
            <button class="lang-btn" [class.active]="currentLang() === 'en'" aria-label="English" (click)="setLang('en')">
              <img src="assets/images/flags/gb.png" alt="EN" />
            </button>
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 900;
      transition: background 0.3s, backdrop-filter 0.3s, box-shadow 0.3s;
    }

    .nav.scrolled {
      background: rgba(247,244,239,0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 2px 20px rgba(0,0,0,0.08);
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80px;
      gap: 24px;
      transition: height 0.3s;
    }

    .scrolled .nav-inner { height: 60px; }

    /* Logo */
    .logo { text-decoration: none; flex-shrink: 0; }

    .logo-img {
      height: 56px;
      width: auto;
      object-fit: contain;
      transition: height 0.3s;
    }

    .scrolled .logo-img { height: 40px; }

    /* Desktop links */
    .nav-links {
      display: flex;
      gap: 4px;
      flex: 1;
      justify-content: center;
    }

    .nav-link {
      padding: 6px 16px;
      border-radius: 40px;
      text-decoration: none;
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 0.9rem;
      transition: color 0.2s, background 0.2s;
    }

    .nav-link:hover { color: var(--accent); }

    .nav-link.active {
      background: rgba(201,168,76,0.12);
      color: var(--accent);
    }

    /* Actions */
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }

    .lang-switcher { display: flex; gap: 2px; }

    .lang-btn {
      background: none;
      border: 2px solid transparent;
      cursor: pointer;
      border-radius: 6px;
      width: 34px;
      height: 24px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s, box-shadow 0.2s;
      overflow: hidden;
    }

    .lang-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .lang-btn:hover { border-color: rgba(201,168,76,0.5); }

    .lang-btn.active {
      border-color: var(--accent);
      box-shadow: 0 0 0 1px var(--accent);
    }

    .login-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text);
      border-radius: 50%;
      width: 38px;
      height: 38px;
      transition: color 0.2s, background 0.2s;
      padding: 0;
    }

    .login-btn .material-icons { font-size: 26px; }

    .login-btn:hover {
      color: var(--accent);
      background: rgba(201,168,76,0.08);
    }

    .nav-cta {
      display: inline-flex;
      align-items: center;
      padding: 8px 20px;
      background: var(--accent);
      color: #0D0D0B;
      font-family: 'DM Sans', sans-serif;
      font-weight: 700;
      font-size: 0.85rem;
      border-radius: 40px;
      text-decoration: none;
      transition: background 0.25s, transform 0.2s;
    }

    .nav-cta:hover {
      background: var(--accent-dark);
      transform: translateY(-1px);
    }

    /* Hamburger */
    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 28px;
      height: 20px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
    }

    .hamburger span {
      display: block;
      height: 2px;
      background: var(--text);
      border-radius: 2px;
      transition: transform 0.3s, opacity 0.3s;
      transform-origin: center;
    }

    .hamburger.open span:nth-child(1) { transform: translateY(9px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

    /* Mobile overlay */
    .mobile-overlay {
      position: fixed;
      inset: 0;
      background: #0D0D0B;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 48px;
      z-index: 800;
      animation: fadeInUp 0.25s ease;
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
    }

    .mobile-link {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      color: #fff;
      text-decoration: none;
      transition: color 0.2s;
    }

    .mobile-link:hover { color: var(--accent); }

    .mobile-lang { display: flex; gap: 16px; }

    .mobile-lang .lang-btn { width: 52px; height: 36px; border-radius: 8px; }

    @media (max-width: 768px) {
      .nav-links, .nav-actions { display: none; }
      .hamburger { display: flex; }
      .nav.menu-open .hamburger span { background: #fff; }
    }
  `],
})
export class StickyHeaderComponent {
  @Input() activeSection = '';

  protected readonly config = inject(ConfigService).config;
  private readonly langService = inject(LanguageService);

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly currentLang = this.langService.lang;

  protected readonly navEntries: NavEntry[] = [
    { id: 'imoveis',   anchor: 'imoveis' },
    { id: 'aboutMe',   anchor: 'about-me' },
    { id: 'myProcess', anchor: 'my-process' },
    { id: 'clients',   anchor: 'clients' },
  ];

  protected waLink(): string {
    const phone = this.config().site.agentPhone.replace(/\D/g, '');
    const messages = this.config().sections.hero.ctaPrimary.message;
    const lang = this.langService.lang();
    const msg = encodeURIComponent(messages[lang] ?? messages.pt);
    return `https://wa.me/${phone}?text=${msg}`;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 60);
  }

  protected toggleMenu(): void { this.menuOpen.update(v => !v); }
  protected closeMenu(): void  { this.menuOpen.set(false); }

  protected setLang(lang: 'pt' | 'en' | 'es'): void {
    this.langService.setLang(lang);
  }
}
