package com.haloai.halo_Ai_backend.service;

import com.haloai.halo_Ai_backend.AI.Templates.PromptTemplate;
import com.haloai.halo_Ai_backend.AI.Templates.TemplateFactory;
import com.haloai.halo_Ai_backend.Model.ChatRequest;
import com.haloai.halo_Ai_backend.Model.PageData;
import com.haloai.halo_Ai_backend.Formatter.PageDataFormatter;
import org.springframework.stereotype.Service;

@Service
public class ChatRequestService {

    private final AiService aiService;
    private final PageDataFormatter formatter;
    private final TemplateFactory factory;

    public ChatRequestService(AiService aiService , PageDataFormatter formatter , TemplateFactory factory){
        this.aiService = aiService;
        this.formatter = formatter;
        this.factory = factory;
    }

    public String handleRequest(ChatRequest request){

        PageData data = request.getPageData();

        String formattedPageData = formatter.buildPageFormat(data);
        PromptTemplate template = factory.getTemplate(data.getPageType());

        String prompt = template.buildPrompt(request.getUserMessage(), formattedPageData);

        return aiService.getResponse(prompt);
    }
}
