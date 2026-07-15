using System.Net;
using System.Text.Json;
using ImobiliariaApp.Functions.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;

namespace ImobiliariaApp.Functions.Functions;

public class ConfigFunction
{
    private readonly IConfigFileService _configFileService;
    private readonly IConfiguration _configuration;

    public ConfigFunction(IConfigFileService configFileService, IConfiguration configuration)
    {
        _configFileService = configFileService;
        _configuration = configuration;
    }

    [Function("GetConfig")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/config")] HttpRequestData req)
    {
        var path = _configuration["ConfigFilePath"] ?? "config.json";
        var config = await _configFileService.LoadAsync(path);

        if (config is null)
        {
            var errorResponse = req.CreateResponse(HttpStatusCode.ServiceUnavailable);
            errorResponse.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await errorResponse.WriteStringAsync(
                JsonSerializer.Serialize(new { error = "config_unavailable", message = "The site configuration could not be loaded." })
            );
            return errorResponse;
        }

        var okResponse = req.CreateResponse(HttpStatusCode.OK);
        okResponse.Headers.Add("Content-Type", "application/json; charset=utf-8");
        okResponse.Headers.Add("Cache-Control", "public, max-age=300");
        await okResponse.WriteStringAsync(
            JsonSerializer.Serialize(config, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase })
        );
        return okResponse;
    }
}
