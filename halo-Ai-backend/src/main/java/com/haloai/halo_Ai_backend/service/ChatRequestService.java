package com.haloai.halo_Ai_backend.service;

import com.haloai.halo_Ai_backend.AI.Templates.PromptTemplate;
import com.haloai.halo_Ai_backend.AI.Templates.TemplateFactory;
import com.haloai.halo_Ai_backend.Formatter.PageDataFormatter;
import com.haloai.halo_Ai_backend.Model.ChatRequest;
import com.haloai.halo_Ai_backend.Model.PageData.GenericPageContext.GenericPageContext;
import com.haloai.halo_Ai_backend.Model.PageData.PageContext;
import com.haloai.halo_Ai_backend.Model.PageData.YoutubePageContext.YoutubePageContext;
import org.springframework.stereotype.Service;

@Service
public class ChatRequestService {

    private final AiService aiService;
    private final PageDataFormatter<GenericPageContext> genericFormatter;
    private final PageDataFormatter<YoutubePageContext> ytFormatter;
    private final TemplateFactory templateFactory;

    public ChatRequestService(AiService aiService , PageDataFormatter<GenericPageContext> genericFormatter
                              ,PageDataFormatter<YoutubePageContext> ytFormatter
                              ,TemplateFactory templateFactory){

        this.aiService = aiService;
        this.genericFormatter = genericFormatter;
        this.ytFormatter = ytFormatter;
        this.templateFactory = templateFactory;
    }



    public String handleRequest(ChatRequest request){

        PageContext pageData = request.getPageData();
        String userMessage = request.getUserMessage();

        if(pageData == null){
            return "no PageData is provided";
        }

        switch(pageData.getPageType()){
            case "youtube":
                YoutubePageContext ytPageData = (YoutubePageContext) pageData;
                return handleYoutubeDataRequest(userMessage,ytPageData);

            case "generic":
                GenericPageContext genericPageData = (GenericPageContext) pageData;
                return handleGenericDataRequest(userMessage,genericPageData);

            default:
                return "Unsupported Page Type: " + pageData.getPageType();
        }
    }


    private String handleGenericDataRequest(String userMessage , GenericPageContext genericPageData){
        String formattedPageData = genericFormatter.buildPageFormat(genericPageData);
        PromptTemplate template = templateFactory.getTemplate(genericPageData.getPageType());
        String prompt = template.buildPrompt(userMessage,formattedPageData);

        return aiService.getResponse(prompt);
    }

    private String handleYoutubeDataRequest(String userMessage , YoutubePageContext ytPageData){
        String formattedPageData = ytFormatter.buildPageFormat(ytPageData);
        PromptTemplate template = templateFactory.getTemplate(ytPageData.getPageType());
        String prompt = template.buildPrompt(userMessage,formattedPageData);

        return aiService.getResponse(prompt);
    }
}
