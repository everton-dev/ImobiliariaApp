import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WhatsAppService } from '../../../core/services/whatsapp.service';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    @if (url) {
      <a
        [href]="url"
        target="_blank"
        rel="noopener noreferrer"
        mat-raised-button
        color="primary"
        [attr.aria-label]="label"
      >
        <mat-icon>chat</mat-icon>
        {{ label }}
      </a>
    } @else {
      <span
        aria-disabled="true"
        class="wa-button-disabled"
        [attr.aria-label]="label"
      >
        <mat-icon>chat</mat-icon>
        {{ displayPhone || label }}
      </span>
    }
  `,
  styles: [`
    :host { display: inline-block; }
    .wa-button-disabled {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      opacity: 0.5;
      cursor: not-allowed;
    }
  `],
})
export class WhatsAppButtonComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) phone = '';
  @Input({ required: true }) message = '';

  private readonly whatsapp = inject(WhatsAppService);

  get url(): string | null {
    return this.whatsapp.buildUrl(this.phone, this.message);
  }

  get displayPhone(): string {
    return this.whatsapp.getDisplayPhone(this.phone);
  }
}
