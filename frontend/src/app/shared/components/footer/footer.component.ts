import { Component, inject, computed } from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <footer class="footer">
      <div class="footer-inner container">
        <div class="footer-logo">
          <img src="assets/images/logo.png" [alt]="site().agentName" class="footer-logo-img" />
        </div>

        <nav class="footer-nav" aria-label="Footer navigation">
          <a href="#about-me" class="footer-link">{{ nav().aboutMe | translate }}</a>
          <a href="#my-process" class="footer-link">{{ nav().myProcess | translate }}</a>
          <a href="#clients" class="footer-link">{{ nav().clients | translate }}</a>
          <a
            href="https://instagram.com/apepvoce"
            target="_blank"
            rel="noopener"
            class="footer-link footer-link--ig"
          >
            <svg class="ig-icon-sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            APE P VOCE
          </a>
        </nav>

        <div class="footer-right">
          <p class="footer-copy">
            &copy; {{ year }} {{ footer().copyrightName || site().agentName }}
          </p>
          <p class="footer-dev">
            {{ ui().madeBy }}
            <a
              href="https://www.instagram.com/blacktechdigital?igsh=MXN5ZXNvYTN3YThxdQ=="
              target="_blank"
              rel="noopener"
              class="footer-dev-link"
            >
              <svg class="ig-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Black Tech Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #E8E4DC;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      padding: 40px 0;
    }

    .footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      flex-wrap: wrap;
    }

    .footer-logo {
      display: flex;
      align-items: center;
    }

    .footer-logo-img {
      height: 64px;
      width: auto;
      object-fit: contain;
    }

    .footer-nav {
      display: flex;
      gap: 28px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .footer-link {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--muted);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-link:hover { color: var(--accent); }

    .footer-link--ig {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .ig-icon-sm {
      width: 13px;
      height: 13px;
      fill: currentColor;
      flex-shrink: 0;
    }

    .footer-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .footer-copy {
      font-size: 0.8rem;
      color: var(--muted);
    }

    .footer-dev {
      font-size: 0.75rem;
      color: var(--muted);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .footer-dev-link {
      color: var(--accent);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 600;
      transition: color 0.2s;
    }

    .footer-dev-link:hover { color: var(--accent-dark); }

    .ig-icon {
      width: 14px;
      height: 14px;
      fill: currentColor;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .footer-inner {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .footer-right { align-items: center; }
    }
  `],
})
export class FooterComponent {
  private readonly configSvc = inject(ConfigService);
  private readonly langSvc   = inject(LanguageService);
  protected readonly site = computed(() => this.configSvc.config().site);
  protected readonly nav = computed(() => this.configSvc.config().nav);
  protected readonly footer = computed(() => this.configSvc.config().sections.footer);
  protected readonly year = new Date().getFullYear();

  protected readonly ui = computed((): { madeBy: string } => {
    const lang = this.langSvc.lang();
    if (lang === 'en') return { madeBy: 'Made by' };
    if (lang === 'es') return { madeBy: 'Hecho por' };
    return { madeBy: 'Desenvolvido por' };
  });

  protected devDomain(): string {
    const url = this.footer().developerUrl;
    if (!url) return '';
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
  }
}
