package com.haloai.halo_Ai_backend.Handler;
import com.haloai.halo_Ai_backend.AI.Templates.PromptTemplate;
import com.haloai.halo_Ai_backend.AI.Templates.TemplateFactory;
import com.haloai.halo_Ai_backend.Formatter.PageDataFormatter;
import com.haloai.halo_Ai_backend.Model.PageData.PageContext;
import com.haloai.halo_Ai_backend.Model.PageData.YoutubePageContext.YoutubePageContext;
import com.haloai.halo_Ai_backend.service.AiService;
import org.springframework.stereotype.Component;

@Component
public class YoutubePageHandler implements PageHandler{

    private final PageDataFormatter<YoutubePageContext> formatter;
    private final TemplateFactory factory;
    private final AiService aiService;

    public YoutubePageHandler(PageDataFormatter<YoutubePageContext> formatter,
                              TemplateFactory factory,
                              AiService aiService){

        this.formatter = formatter;
        this.factory = factory;
        this.aiService = aiService;
    }

    @Override
    public String getPageType(){
        return "youtube";
    }

    @Override
    public String handlePageType(PageContext context , String userMessage){

        YoutubePageContext pageData = (YoutubePageContext) context;
        String formattedPageData = formatter.buildPageFormat(pageData);
        PromptTemplate template = factory.getTemplate(pageData.getPageType());
        String prompt = template.buildPrompt(userMessage,formattedPageData);

        return aiService.getResponse(prompt);
    }
}
