using System.Net;
using System.Text;
using System.Text.Json;
using ImobiliariaApp.Functions.Functions;
using ImobiliariaApp.Functions.Models;
using ImobiliariaApp.Functions.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;
using Moq;

namespace ImobiliariaApp.Functions.Tests;

public class ConfigFunctionTests
{
    private readonly Mock<IConfigFileService> _configServiceMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly ConfigFunction _function;

    public ConfigFunctionTests()
    {
        _configServiceMock = new Mock<IConfigFileService>();
        _configurationMock = new Mock<IConfiguration>();
        _configurationMock.Setup(c => c["ConfigFilePath"]).Returns("config.json");
        _function = new ConfigFunction(_configServiceMock.Object, _configurationMock.Object);
    }

    [Fact]
    public async Task Run_WhenConfigPresent_Returns200WithSiteConfigDto()
    {
        var config = BuildSampleConfig();
        _configServiceMock
            .Setup(s => s.LoadAsync(It.IsAny<string>()))
            .ReturnsAsync(config);

        var request = CreateFakeRequest();
        var response = await _function.Run(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        response.Body.Seek(0, SeekOrigin.Begin);
        var body = await JsonDocument.ParseAsync(response.Body);
        Assert.Equal("Maria Imóveis", body.RootElement.GetProperty("site").GetProperty("agentName").GetString());
    }

    [Fact]
    public async Task Run_WhenConfigMissing_Returns503WithErrorBody()
    {
        _configServiceMock
            .Setup(s => s.LoadAsync(It.IsAny<string>()))
            .ReturnsAsync((SiteConfigDto?)null);

        var request = CreateFakeRequest();
        var response = await _function.Run(request);

        Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);

        response.Body.Seek(0, SeekOrigin.Begin);
        var body = await JsonDocument.ParseAsync(response.Body);
        Assert.Equal("config_unavailable", body.RootElement.GetProperty("error").GetString());
    }

    private static HttpRequestData CreateFakeRequest()
    {
        var context = new Mock<FunctionContext>();
        return new FakeHttpRequestData(context.Object);
    }

    private static SiteConfigDto BuildSampleConfig()
    {
        var pt = new TranslatedStringDto("Olá", "Hello", "Hola");
        var site = new SiteInfoDto(
            Title: new TranslatedStringDto("Site", "Site"),
            Description: new TranslatedStringDto("Desc"),
            AgentName: "Maria Imóveis",
            AgentPhone: "5511999998888"
        );
        var seo = new SeoConfigDto(new TranslatedStringDto("Título"), new TranslatedStringDto("Desc"));
        var whatsapp = new WhatsAppConfigDto(new TranslatedStringDto("Contato"), new TranslatedStringDto("Olá"));
        var aboutMe = new AboutMeSectionDto(true, new TranslatedStringDto("Sobre Mim"), new TranslatedStringDto("Corpo"), whatsapp, seo);
        var myProcess = new MyProcessSectionDto(true, new TranslatedStringDto("Processo"), [], whatsapp, seo);
        var clients = new ClientsSectionDto(true, new TranslatedStringDto("Clientes"), [], seo);
        var contact = new ContactSectionDto(true, new TranslatedStringDto("Contato"), new TranslatedStringDto("Chamar"), new ContactWhatsAppDto(new TranslatedStringDto("Olá")), seo);
        var sections = new SiteSectionsDto(aboutMe, myProcess, clients, contact);
        var nav = new NavLabelsDto(
            new TranslatedStringDto("Sobre Mim"),
            new TranslatedStringDto("Processo"),
            new TranslatedStringDto("Clientes"),
            new TranslatedStringDto("Contato")
        );
        return new SiteConfigDto(site, sections, nav);
    }
}

internal sealed class FakeHttpRequestData : HttpRequestData
{
    public FakeHttpRequestData(FunctionContext functionContext) : base(functionContext) { }

    public override Stream Body => Stream.Null;
    public override HttpHeadersCollection Headers => new();
    public override IReadOnlyCollection<IHttpCookie> Cookies => Array.Empty<IHttpCookie>();
    public override Uri Url => new("http://localhost/api/v1/config");
    public override IEnumerable<ClaimsIdentity> Identities => Array.Empty<ClaimsIdentity>();
    public override string Method => "GET";

    public override HttpResponseData CreateResponse()
    {
        return new FakeHttpResponseData(FunctionContext);
    }
}

internal sealed class FakeHttpResponseData : HttpResponseData
{
    public FakeHttpResponseData(FunctionContext functionContext) : base(functionContext)
    {
        Body = new MemoryStream();
        Headers = new HttpHeadersCollection();
    }

    public override HttpStatusCode StatusCode { get; set; }
    public override HttpHeadersCollection Headers { get; set; }
    public override Stream Body { get; set; }
    public override HttpCookies Cookies => throw new NotImplementedException();
}
