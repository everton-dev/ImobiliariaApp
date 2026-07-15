import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WhatsAppService {
  buildUrl(phone: string, message: string): string | null {
    if (!phone) return null;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  getDisplayPhone(phone: string): string {
    if (!phone) return '';
    return `+${phone}`;
  }
}
