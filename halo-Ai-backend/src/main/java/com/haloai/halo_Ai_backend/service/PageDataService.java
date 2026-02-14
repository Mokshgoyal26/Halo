package com.haloai.halo_Ai_backend.service;

import com.haloai.halo_Ai_backend.Model.PageData;
import org.springframework.stereotype.Service;

@Service
public class PageDataService {

    private final AiService aiService;

    public PageDataService(AiService aiService){
        this.aiService = aiService;
    }

    public void processPageData(PageData data){
        System.out.println("page data : "+ data);
    }

    public String getPageSummary(PageData data){
        String prompt = data.getContent();
        return aiService.getResponse(prompt);
    }
}
