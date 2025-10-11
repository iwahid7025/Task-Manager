using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace TaskApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ChatController> _logger;
        private const string OllamaApiUrl = "http://localhost:11434/api/generate";

        public ChatController(IHttpClientFactory httpClientFactory, ILogger<ChatController> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { error = "Message cannot be empty" });
            }

            try
            {
                var client = _httpClientFactory.CreateClient();

                // Prepare the prompt with travel context
                var prompt = $@"You are a helpful travel assistant. Provide concise, practical travel suggestions.
User question: {request.Message}

Provide a brief, helpful response (2-3 sentences maximum).";

                var ollamaRequest = new
                {
                    model = "llama3.2:1b",
                    prompt = prompt,
                    stream = false,
                    options = new
                    {
                        temperature = 0.7,
                        max_tokens = 200
                    }
                };

                var jsonContent = JsonSerializer.Serialize(ollamaRequest);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                var response = await client.PostAsync(OllamaApiUrl, content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Ollama API returned status code: {response.StatusCode}");
                    return StatusCode((int)response.StatusCode,
                        new { error = "Failed to get response from AI model" });
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var ollamaResponse = JsonSerializer.Deserialize<OllamaResponse>(responseContent);

                return Ok(new ChatResponse
                {
                    Message = ollamaResponse?.Response ?? "No response generated",
                    Model = ollamaResponse?.Model ?? "unknown"
                });
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Failed to connect to Ollama");
                return StatusCode(503, new { error = "AI service unavailable. Please ensure Ollama is running." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing chat request");
                return StatusCode(500, new { error = "An error occurred processing your request" });
            }
        }

        [HttpGet("health")]
        public async Task<IActionResult> CheckHealth()
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var response = await client.GetAsync("http://localhost:11434/api/tags");

                if (response.IsSuccessStatusCode)
                {
                    return Ok(new { status = "Ollama is running", available = true });
                }

                return Ok(new { status = "Ollama not responding", available = false });
            }
            catch
            {
                return Ok(new { status = "Ollama not available", available = false });
            }
        }
    }

    public class ChatRequest
    {
        public string Message { get; set; } = string.Empty;
    }

    public class ChatResponse
    {
        public string Message { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
    }

    public class OllamaResponse
    {
        public string Model { get; set; } = string.Empty;
        public string Response { get; set; } = string.Empty;
        public bool Done { get; set; }
    }
}