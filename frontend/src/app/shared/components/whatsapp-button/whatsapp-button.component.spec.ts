import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhatsAppButtonComponent } from './whatsapp-button.component';
import { WhatsAppService } from '../../../core/services/whatsapp.service';

describe('WhatsAppButtonComponent', () => {
  let fixture: ComponentFixture<WhatsAppButtonComponent>;
  let component: WhatsAppButtonComponent;

  function setup(phone: string, message: string, label: string) {
    fixture = TestBed.createComponent(WhatsAppButtonComponent);
    component = fixture.componentInstance;
    component.phone = phone;
    component.message = message;
    component.label = label;
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WhatsAppButtonComponent],
      providers: [WhatsAppService],
    });
  });

  it('should be created', () => {
    setup('5511999998888', 'Olá', 'Fale Comigo');
    expect(component).toBeTruthy();
  });

  it('(a) renders anchor with correct href when phone is present', () => {
    setup('5511999998888', 'Olá', 'Fale Comigo');
    const anchor: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(anchor).toBeTruthy();
    expect(anchor.href).toContain('wa.me/5511999998888');
    expect(anchor.href).toContain('Ol%C3%A1');
  });

  it('(b) renders label text', () => {
    setup('5511999998888', 'Olá', 'Fale Comigo');
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Fale Comigo');
  });

  it('(c) when phone is empty the button is visually disabled and has aria-disabled="true"', () => {
    setup('', 'msg', 'Fale Comigo');
    const disabled = fixture.nativeElement.querySelector('[aria-disabled="true"]');
    expect(disabled).toBeTruthy();
    const anchor = fixture.nativeElement.querySelector('a');
    expect(anchor).toBeNull();
  });
});
