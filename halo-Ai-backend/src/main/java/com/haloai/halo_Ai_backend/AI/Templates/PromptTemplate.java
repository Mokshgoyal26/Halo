package com.haloai.halo_Ai_backend.AI.Templates;


public interface PromptTemplate {

    String getPageType();
    String buildPrompt(String userMessage , String formattedPageData);
}
