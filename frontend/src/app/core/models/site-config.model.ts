export type LangCode = 'pt' | 'en' | 'es';

export interface TranslatedString {
  pt: string;
  en?: string;
  es?: string;
}

export interface WhatsAppConfig {
  label: TranslatedString;
  message: TranslatedString;
}

export interface SeoConfig {
  title: TranslatedString;
  description: TranslatedString;
}

export interface Stat {
  value: string;
  label: TranslatedString;
}

export interface HeroSection {
  enabled: boolean;
  eyebrow: TranslatedString;
  heading: TranslatedString;
  headingEmphasis: TranslatedString;
  subheading: TranslatedString;
  backgroundImageUrl?: string;
  ctaPrimary: WhatsAppConfig;
  ctaSecondaryLabel: TranslatedString;
  ctaSecondaryAnchor: string;
  stats: Stat[];
  seo: SeoConfig;
}

export interface ProcessStep {
  number: string;
  heading: TranslatedString;
  body: TranslatedString;
  icon: string;
}

export interface Testimonial {
  quote: TranslatedString;
  clientName: string;
  location?: TranslatedString;
  score?: number;
  avatarColor?: string;
  photoUrl?: string;
}

export interface FeatureCard {
  icon: string;
  iconBg: string;
  heading: TranslatedString;
  body: TranslatedString;
}

export interface SiteInfo {
  title: TranslatedString;
  description: TranslatedString;
  ogImage?: string;
  agentName: string;
  agentCredential?: string;
  agentPhone: string;
  agentPhotoUrl?: string;
  agentTagline?: TranslatedString;
  agentBio1?: TranslatedString;
  agentBio2?: TranslatedString;
  instagramUrl?: string;
  defaultLanguage?: LangCode;
}

export interface AboutMeSection {
  enabled: boolean;
  eyebrow: TranslatedString;
  heading: TranslatedString;
  intro: TranslatedString;
  cards: FeatureCard[];
  photoUrl?: string;
  whatsapp: WhatsAppConfig;
  seo: SeoConfig;
}

export interface MyProcessSection {
  enabled: boolean;
  eyebrow: TranslatedString;
  heading: TranslatedString;
  headingEmphasis: TranslatedString;
  steps: ProcessStep[];
  whatsapp: WhatsAppConfig;
  seo: SeoConfig;
}

export interface ClientsSection {
  enabled: boolean;
  eyebrow: TranslatedString;
  heading: TranslatedString;
  testimonials: Testimonial[];
  seo: SeoConfig;
}

export interface ContactSection {
  enabled: boolean;
  heading: TranslatedString;
  body: TranslatedString;
  buttonLabel: TranslatedString;
  whatsapp: { message: TranslatedString };
  seo: SeoConfig;
}

export interface PropertyListing {
  id: string;
  type: TranslatedString;
  address: string;
  neighborhood: string;
  areaM2: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots?: number;
  modality: TranslatedString;
  price: number;
  images: string[];
  description?: TranslatedString;
  amenities?: string[];
}

export interface ImoveisSection {
  enabled: boolean;
  eyebrow: TranslatedString;
  heading: TranslatedString;
  ctaAllLabel: TranslatedString;
  ctaPortfolioLabel: TranslatedString;
  whatsapp: { message: TranslatedString };
  listings: PropertyListing[];
}

export interface FooterSection {
  copyrightName: string;
  developerLabel?: TranslatedString;
  developerUrl?: string;
}

export interface SiteSections {
  hero: HeroSection;
  imoveis?: ImoveisSection;
  aboutMe: AboutMeSection;
  myProcess: MyProcessSection;
  clients: ClientsSection;
  contact: ContactSection;
  footer: FooterSection;
}

export interface NavLabels {
  imoveis?: TranslatedString;
  aboutMe: TranslatedString;
  myProcess: TranslatedString;
  clients: TranslatedString;
  contact: TranslatedString;
}

export interface SiteConfig {
  site: SiteInfo;
  sections: SiteSections;
  nav: NavLabels;
}
