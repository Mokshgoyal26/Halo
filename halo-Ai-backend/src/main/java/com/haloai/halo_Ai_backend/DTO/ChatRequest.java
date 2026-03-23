package com.haloai.halo_Ai_backend.DTO;
import com.haloai.halo_Ai_backend.DTO.PageData.PageContext;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ChatRequest {
    private String conversationId;
    private PageContext pageData;

    @NotBlank(message = "UserMessage cannot be empty")
    private String userMessage;

    @NotNull(message = "modelType cannot be null")
    private AiModelType modelType;

    private String model;

    @NotBlank(message = "apiKey cannot be empty")
    private String apiKey;

    public enum AiModelType{
        OPENAI,
        CLAUDE,
        GEMINI,
        OLLAMA
    }
}
