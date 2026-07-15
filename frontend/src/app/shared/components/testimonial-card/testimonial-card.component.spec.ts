import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestimonialCardComponent } from './testimonial-card.component';
import { LanguageService } from '../../../core/services/language.service';
import { Testimonial } from '../../../core/models/site-config.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const TESTIMONIAL: Testimonial = {
  quote: { pt: 'Excelente atendimento!', en: 'Excellent service!' },
  clientName: 'João Silva',
  photoUrl: 'https://example.com/photo.jpg',
};

const TESTIMONIAL_NO_PHOTO: Testimonial = {
  quote: { pt: 'Muito bom!' },
  clientName: 'Maria',
};

describe('TestimonialCardComponent', () => {
  let fixture: ComponentFixture<TestimonialCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestimonialCardComponent, NoopAnimationsModule],
      providers: [LanguageService],
    });
    fixture = TestBed.createComponent(TestimonialCardComponent);
    fixture.componentInstance.testimonial = TESTIMONIAL;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('(a) renders the quote text in current language (pt)', () => {
    expect(fixture.nativeElement.textContent).toContain('Excelente atendimento!');
  });

  it('(b) renders the quote in English when lang is en', () => {
    TestBed.inject(LanguageService).setLang('en');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Excellent service!');
  });

  it('(c) renders the client name', () => {
    expect(fixture.nativeElement.textContent).toContain('João Silva');
  });

  it('(d) renders photo img when photoUrl is provided', () => {
    const img = fixture.nativeElement.querySelector('.client-photo');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/photo.jpg');
    expect(img.getAttribute('alt')).toContain('João Silva');
  });

  it('(e) does not render photo img when photoUrl is absent', () => {
    fixture.componentInstance.testimonial = TESTIMONIAL_NO_PHOTO;
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('.client-photo');
    expect(img).toBeNull();
  });
});
