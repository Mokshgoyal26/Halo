package com.haloai.halo_Ai_backend.service;

import com.haloai.halo_Ai_backend.AI.PromptBuilder;
import com.haloai.halo_Ai_backend.Model.ChatRequest;
import com.haloai.halo_Ai_backend.Model.PageData;
import org.springframework.stereotype.Service;

@Service
public class ChatRequestService {

    private final AiService aiService;
    private final PromptBuilder promptBuilder;

    public ChatRequestService(AiService aiService , PromptBuilder promptBuilder){
        this.aiService = aiService;
        this.promptBuilder = promptBuilder;
    }

    public String handleRequest(ChatRequest request){

        PageData data = request.getPageData();

        String formattedPageData = """
                hostname: %s
                url: %s
                title: %s
                pageType: %s
                content: %s
                """.formatted(data.getHostname(),data.getUrl(),data.getTitle(),data.getPageType(),data.getContent());

        String prompt = promptBuilder.buildPrompt(request.getUserMessage(),formattedPageData);

        return aiService.getResponse(prompt);
    }
}
