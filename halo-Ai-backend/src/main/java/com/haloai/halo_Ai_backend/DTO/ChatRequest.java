package com.haloai.halo_Ai_backend.DTO;
import com.haloai.halo_Ai_backend.DTO.PageData.PageContext;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ChatRequest {
    private String conversationId;
    private PageContext pageData;
    private String userMessage;
    private AiModelType modelType;

    public enum AiModelType{
        OPENAI,
        CLAUDE,
        GEMINI
    }
}
