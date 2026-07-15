using System.Text.Json;
using ImobiliariaApp.Functions.Models;
using Microsoft.Extensions.Logging;

namespace ImobiliariaApp.Functions.Services;

public interface IConfigFileService
{
    Task<SiteConfigDto?> LoadAsync(string path);
}

public class ConfigFileService : IConfigFileService
{
    private readonly ILogger<ConfigFileService> _logger;

    public ConfigFileService(ILogger<ConfigFileService> logger)
    {
        _logger = logger;
    }

    public async Task<SiteConfigDto?> LoadAsync(string path)
    {
        if (!File.Exists(path))
        {
            _logger.LogWarning("config.json not found at {Path}", path);
            return null;
        }

        try
        {
            var json = await File.ReadAllTextAsync(path);
            return JsonSerializer.Deserialize<SiteConfigDto>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to parse config.json at {Path}", path);
            return null;
        }
    }
}
