package com.haloai.halo_Ai_backend.AI.Templates;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TemplateFactory {

    private final List<PromptTemplate> template;

    public TemplateFactory(List<PromptTemplate> template){
        this.template = template;
    }

    public PromptTemplate getTemplate(String pageType){

        return template.stream()
                .filter(t -> t.getPageType().equalsIgnoreCase(pageType))
                .findFirst()
                .orElseGet(GenericPageTemplate::new);
    }
}
