namespace ImobiliariaApp.Functions.Models;

public record TranslatedStringDto(
    string Pt,
    string? En = null,
    string? Es = null
);

public record SeoConfigDto(
    TranslatedStringDto Title,
    TranslatedStringDto Description
);

public record WhatsAppConfigDto(
    TranslatedStringDto Label,
    TranslatedStringDto Message
);

public record TestimonialDto(
    TranslatedStringDto Quote,
    string ClientName,
    string? PhotoUrl = null
);

public record ProcessStepDto(
    TranslatedStringDto Heading,
    TranslatedStringDto Body
);

public record SiteInfoDto(
    TranslatedStringDto Title,
    TranslatedStringDto Description,
    string AgentName,
    string AgentPhone,
    string? OgImage = null,
    string? DefaultLanguage = null
);

public record NavLabelsDto(
    TranslatedStringDto AboutMe,
    TranslatedStringDto MyProcess,
    TranslatedStringDto Clients,
    TranslatedStringDto Contact
);

public record AboutMeSectionDto(
    bool Enabled,
    TranslatedStringDto Heading,
    TranslatedStringDto Body,
    WhatsAppConfigDto Whatsapp,
    SeoConfigDto Seo,
    string? PhotoUrl = null
);

public record MyProcessSectionDto(
    bool Enabled,
    TranslatedStringDto Heading,
    IReadOnlyList<ProcessStepDto> Steps,
    WhatsAppConfigDto Whatsapp,
    SeoConfigDto Seo
);

public record ClientsSectionDto(
    bool Enabled,
    TranslatedStringDto Heading,
    IReadOnlyList<TestimonialDto> Testimonials,
    SeoConfigDto Seo
);

public record ContactSectionDto(
    bool Enabled,
    TranslatedStringDto Heading,
    TranslatedStringDto ButtonLabel,
    ContactWhatsAppDto Whatsapp,
    SeoConfigDto Seo
);

public record ContactWhatsAppDto(TranslatedStringDto Message);

public record SiteSectionsDto(
    AboutMeSectionDto AboutMe,
    MyProcessSectionDto MyProcess,
    ClientsSectionDto Clients,
    ContactSectionDto Contact
);

public record SiteConfigDto(
    SiteInfoDto Site,
    SiteSectionsDto Sections,
    NavLabelsDto Nav
);
