import { Component, inject, computed, signal } from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-agent-highlight',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    @if (site().agentName) {
      <div class="agent-strip">
        <div class="agent-strip-inner container">
          <div class="agent-photo-wrap">
            @if (site().agentPhotoUrl) {
              <img
                [src]="site().agentPhotoUrl"
                [alt]="site().agentName"
                class="agent-photo"
                (click)="openModal()"
              />
            } @else {
              <div class="agent-photo-placeholder">
                {{ site().agentName.charAt(0) }}
              </div>
            }
          </div>

          <div class="agent-info">
            <span class="agent-tag">Seu corretor</span>
            <h2 class="agent-name">{{ site().agentName }}</h2>
            @if (site().agentCredential) {
              <p class="agent-credential">{{ site().agentCredential }}</p>
            }
            @if (site().agentTagline) {
              <p class="agent-tagline">{{ site().agentTagline | translate }}</p>
            }
          </div>

          @if (site().agentBio1 || site().agentBio2) {
            <div class="agent-bio">
              @if (site().agentBio1) {
                <p>{{ site().agentBio1 | translate }}</p>
              }
              @if (site().agentBio2) {
                <p>{{ site().agentBio2 | translate }}</p>
              }
            </div>
          }
        </div>
      </div>

      @if (modalOpen()) {
        <div class="photo-modal-backdrop" (click)="closeModal()">
          <div class="photo-modal" (click)="$event.stopPropagation()">
            <button class="photo-modal-close" (click)="closeModal()" aria-label="Fechar">
              <span class="material-icons">close</span>
            </button>
            <img
              [src]="site().agentPhotoUrl"
              [alt]="site().agentName"
              class="photo-modal-img"
            />
            <div class="photo-modal-caption">
              <strong>{{ site().agentName }}</strong>
              @if (site().agentCredential) {
                <span>{{ site().agentCredential }}</span>
              }
            </div>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .agent-strip {
      background: var(--bg-elevated);
      padding: 56px 0;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }

    .agent-strip-inner {
      display: grid;
      grid-template-columns: auto 1fr 1fr;
      align-items: center;
      gap: 40px;
    }

    .agent-photo-wrap {
      flex-shrink: 0;
    }

    .agent-photo,
    .agent-photo-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--accent);
      box-shadow: 0 0 0 6px rgba(201,168,76,0.12);
    }

    .agent-photo-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      color: var(--accent);
    }

    .agent-info {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .agent-tag {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--accent);
      background: rgba(201,168,76,0.1);
      padding: 4px 12px;
      border-radius: 40px;
      align-self: flex-start;
    }

    .agent-name {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.4rem, 3vw, 2rem);
      color: var(--text);
      margin: 0;
    }

    .agent-credential {
      font-size: 0.85rem;
      color: var(--muted);
      margin: 0;
    }

    .agent-tagline {
      font-size: 1rem;
      color: var(--text);
      font-style: italic;
      margin: 0;
    }

    .agent-bio {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .agent-bio p {
      color: var(--muted);
      line-height: 1.7;
      font-size: 0.95rem;
    }

    @media (max-width: 768px) {
      .agent-strip-inner {
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
      }

      .agent-bio {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 480px) {
      .agent-strip-inner {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .agent-photo-wrap { justify-self: center; }
      .agent-tag { align-self: center; }
    }

    .agent-photo {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .agent-photo:hover {
      transform: scale(1.05);
      box-shadow: 0 0 0 8px rgba(201,168,76,0.22);
    }

    /* Modal */
    .photo-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9000;
      background: rgba(13,13,11,0.75);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
    }

    .photo-modal {
      position: relative;
      background: var(--bg);
      border-radius: 16px;
      padding: 32px 32px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.4);
      animation: scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
      max-width: min(480px, 90vw);
      width: 100%;
    }

    .photo-modal-close {
      position: absolute;
      top: 12px;
      right: 12px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--muted);
      line-height: 1;
      padding: 4px;
      border-radius: 50%;
      transition: color 0.2s, background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .photo-modal-close:hover {
      color: var(--text);
      background: rgba(13,13,11,0.08);
    }

    .photo-modal-img {
      width: 280px;
      height: 280px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid var(--accent);
      box-shadow: 0 8px 32px rgba(201,168,76,0.25);
    }

    .photo-modal-caption {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      text-align: center;
    }
    .photo-modal-caption strong {
      font-family: 'Playfair Display', serif;
      font-size: 1.3rem;
      color: var(--text);
    }
    .photo-modal-caption span {
      font-size: 0.85rem;
      color: var(--muted);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.88); }
      to   { opacity: 1; transform: scale(1); }
    }
  `],
})
export class AgentHighlightComponent {
  private readonly configSvc = inject(ConfigService);
  protected readonly site = computed(() => this.configSvc.config().site);
  protected readonly modalOpen = signal(false);

  protected openModal(): void  { this.modalOpen.set(true); }
  protected closeModal(): void { this.modalOpen.set(false); }
}
