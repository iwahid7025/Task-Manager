using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace TaskApi.Controllers
{
    /// <summary>
    /// API Controller for handling chat interactions with Ollama AI
    /// Provides endpoints for sending messages to the AI and checking service health
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ChatController> _logger;
        private readonly IConfiguration _configuration;

        // Ollama API configuration loaded from environment variables
        private readonly string _ollamaApiUrl;      // URL for generating AI responses
        private readonly string _ollamaTagsUrl;     // URL for checking Ollama service health
        private readonly string _ollamaModel;       // AI model name to use (e.g., llama3.2:1b)

        /// <summary>
        /// Constructor with dependency injection
        /// Loads Ollama configuration from environment variables set in .env file
        /// </summary>
        public ChatController(IHttpClientFactory httpClientFactory, ILogger<ChatController> logger, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
            _configuration = configuration;

            // Load Ollama configuration from environment variables
            // These values are set from the .env file in Program.cs
            _ollamaApiUrl = Environment.GetEnvironmentVariable("OLLAMA_API_URL") ?? string.Empty;
            _ollamaTagsUrl = Environment.GetEnvironmentVariable("OLLAMA_TAGS_URL") ?? string.Empty;
            _ollamaModel = Environment.GetEnvironmentVariable("OLLAMA_MODEL") ?? string.Empty;
        }

        /// <summary>
        /// POST endpoint to send a message to the AI and get a response
        /// </summary>
        /// <param name="request">The chat request containing the user's message</param>
        /// <returns>AI-generated response or error message</returns>
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
        {
            // Validate incoming message
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { error = "Message cannot be empty" });
            }

            try
            {
                var client = _httpClientFactory.CreateClient();

                // Prepare the prompt with travel assistant context
                // This system prompt guides the AI to act as a travel assistant
                var prompt = $@"You are a helpful travel assistant. Provide concise, practical travel suggestions.
User question: {request.Message}

Provide a brief, helpful response (2-3 sentences maximum).";

                // Build request payload for Ollama API
                // Stream is disabled for simpler response handling
                var ollamaRequest = new
                {
                    model = _ollamaModel,           // AI model from environment variable
                    prompt = prompt,                 // User message with context
                    stream = false,                  // Get complete response at once
                    options = new
                    {
                        temperature = 0.7,           // Creativity level (0.0 = deterministic, 1.0 = creative)
                        max_tokens = 500             // Maximum response length
                    }
                };

                // Serialize and send request to Ollama
                var jsonContent = JsonSerializer.Serialize(ollamaRequest);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                var response = await client.PostAsync(_ollamaApiUrl, content);

                // Handle non-success HTTP status codes
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Ollama API returned status code: {response.StatusCode}");
                    return StatusCode((int)response.StatusCode,
                        new { error = "Failed to get response from AI model" });
                }

                // Parse and return the AI response
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
                // Handle network/connection errors (Ollama not running, network issues)
                _logger.LogError(ex, "Failed to connect to Ollama");
                return StatusCode(503, new { error = "AI service unavailable. Please ensure Ollama is running." });
            }
            catch (Exception ex)
            {
                // Handle any other unexpected errors
                _logger.LogError(ex, "Error processing chat request");
                return StatusCode(500, new { error = "An error occurred processing your request" });
            }
        }

        /// <summary>
        /// GET endpoint to check if Ollama service is running and available
        /// Used by the frontend to display service status
        /// </summary>
        /// <returns>Service availability status</returns>
        [HttpGet("health")]
        public async Task<IActionResult> CheckHealth()
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                // Attempt to connect to Ollama's tags endpoint (lightweight check)
                var response = await client.GetAsync(_ollamaTagsUrl);

                if (response.IsSuccessStatusCode)
                {
                    return Ok(new { status = "Ollama is running", available = true });
                }

                return Ok(new { status = "Ollama not responding", available = false });
            }
            catch
            {
                // Catch any connection errors (service down, wrong URL, etc.)
                return Ok(new { status = "Ollama not available", available = false });
            }
        }
    }

    /// <summary>
    /// Request model for incoming chat messages from the frontend
    /// </summary>
    public class ChatRequest
    {
        public string Message { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response model sent back to the frontend with AI-generated message
    /// </summary>
    public class ChatResponse
    {
        public string Message { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for deserializing responses from Ollama API
    /// Matches the structure of Ollama's JSON response format
    /// </summary>
    public class OllamaResponse
    {
        public string Model { get; set; } = string.Empty;
        public string Response { get; set; } = string.Empty;
        public bool Done { get; set; }
    }
}