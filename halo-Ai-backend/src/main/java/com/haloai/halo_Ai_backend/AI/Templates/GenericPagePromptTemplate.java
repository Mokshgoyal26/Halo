package com.haloai.halo_Ai_backend.AI.Templates;

public class GenericPagePromptTemplate implements PromptTemplate {

    @Override
    public String getPageType(){
        return "generic";
    }

    @Override
    public String buildPrompt(String userMessage , String formattedPageData){

        formattedPageData = formattedPageData == null ?  "" : formattedPageData;
        userMessage = userMessage == null ? "" : userMessage;

        return """
                SYSTEM:
                you are browser sidebar assistant.
                
                RULES:
                1. Answer normally
                2. Use page context only when it is relevant
                3. Do not summarize page context until asked
                
                PAGE CONTEXT:
                ------------------------------------------
                 %s
                ------------------------------------------
                
                USER MESSAGE:
                ------------------------------------------
                 %s
                ------------------------------------------
                
                INSTRUCTIONS:
                - focus only on relevant information
                - ignore advertisements and navigation text
                - provide clear and structured response
                - keep answer meaningful
                
                RESPONSE:
                """.formatted(formattedPageData,userMessage);
    }
}
