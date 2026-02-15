package com.haloai.halo_Ai_backend.Formatter;

import com.haloai.halo_Ai_backend.Model.PageData;
import org.springframework.stereotype.Component;

@Component
public class PageDataFormatter {

    public String buildPageFormat(PageData data){
        return """
                hostname: %s
                url: %s
                title: %s
                pageType: %s
                content: %s
                """.formatted(data.getHostname(),data.getUrl(),data.getTitle(),data.getPageType(),data.getContent());
    }
}
