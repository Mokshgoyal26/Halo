package com.haloai.halo_Ai_backend.Handler;

import com.haloai.halo_Ai_backend.AI.Templates.PromptTemplate;
import com.haloai.halo_Ai_backend.AI.Templates.TemplateFactory;
import com.haloai.halo_Ai_backend.Formatter.PageDataFormatter;
import com.haloai.halo_Ai_backend.DTO.PageData.GenericPageContext.GenericPageContext;
import com.haloai.halo_Ai_backend.DTO.PageData.PageContext;
import com.haloai.halo_Ai_backend.service.AiService;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class GenericPageHandler implements PageHandler{

    private final PageDataFormatter<GenericPageContext> formatter;
    private final TemplateFactory factory;
    private final AiService aiService;

    public GenericPageHandler(PageDataFormatter<GenericPageContext> formatter,
                              TemplateFactory factory,
                              AiService aiService){

        this.formatter = formatter;
        this.factory = factory;
        this.aiService = aiService;
    }

    @Override
    public String getPageType(){
        return "generic";
    }

    @Override
    public Flux<String> handlePageType(PageContext context , String userMessage){
        GenericPageContext pageData = (GenericPageContext) context;

        String formattedPageData = formatter.buildPageFormat(pageData);
        PromptTemplate template = factory.getTemplate(pageData.getPageType());
        String prompt = template.buildPrompt(userMessage,formattedPageData);

        return aiService.getResponse(prompt);
    }

}
