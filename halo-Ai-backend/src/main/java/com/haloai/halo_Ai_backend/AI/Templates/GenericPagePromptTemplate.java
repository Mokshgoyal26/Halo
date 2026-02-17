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
                you are analyzing general website content.
                
                PAGE CONTENT:
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
