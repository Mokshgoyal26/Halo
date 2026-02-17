package com.haloai.halo_Ai_backend.AI.Templates;


public class YoutubePagePromptTemplate implements PromptTemplate{

    @Override
    public String getPageType() {
        return "youtube";
    }

    @Override
    public String buildPrompt(String userMessage, String formattedPageData) {

        formattedPageData = formattedPageData == null ? "" : formattedPageData;
        userMessage = userMessage == null ? "" : userMessage;

        return """
                You are analyzing YoutubePage Data
                
                Youtube Page Content:
                ----------------------------------------
                  %s
                ----------------------------------------
                
                User Message:
                ----------------------------------------
                  %s
                ----------------------------------------
                
                INSTRUCTIONS:
                - focus only on relevant information
                - ignore advertisements and navigation text
                - provide clear and structured response
                - keep answer meaningful
                
                RESPONSE:
                """.formatted(formattedPageData,userMessage);
    }
}
