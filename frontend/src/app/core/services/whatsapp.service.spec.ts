import { TestBed } from '@angular/core/testing';
import { WhatsAppService } from './whatsapp.service';

describe('WhatsAppService', () => {
  let service: WhatsAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [WhatsAppService] });
    service = TestBed.inject(WhatsAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('(a) buildUrl returns correct wa.me URL with encoded message', () => {
    const url = service.buildUrl('5511999998888', 'Olá');
    expect(url).toBe('https://wa.me/5511999998888?text=Ol%C3%A1');
  });

  it('(b) buildUrl returns null when phone is empty', () => {
    expect(service.buildUrl('', 'msg')).toBeNull();
  });

  it('(c) message is encodeURIComponent-encoded', () => {
    const url = service.buildUrl('5511999998888', 'Hello World!');
    expect(url).toBe('https://wa.me/5511999998888?text=Hello%20World!');
  });

  it('getDisplayPhone prepends + to international number', () => {
    expect(service.getDisplayPhone('5511999998888')).toBe('+5511999998888');
  });

  it('getDisplayPhone returns empty string for empty phone', () => {
    expect(service.getDisplayPhone('')).toBe('');
  });
});
