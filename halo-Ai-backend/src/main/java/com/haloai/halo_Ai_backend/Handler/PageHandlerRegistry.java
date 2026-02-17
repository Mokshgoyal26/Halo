package com.haloai.halo_Ai_backend.Handler;

import org.hibernate.query.Page;
import org.springframework.stereotype.Component;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class PageHandlerRegistry {

    private final Map<String , PageHandler> handlers;

    public PageHandlerRegistry(List<PageHandler> handlerList){
        this.handlers = handlerList.stream()
                .collect(Collectors.toMap(
                        PageHandler::getPageType,
                        Function.identity()
                ));
    }

    public PageHandler getPageHandler(String type){
        PageHandler handler = handlers.get(type);

        if(handler == null) throw new IllegalArgumentException("Unsupported Type: "+type);

        return handler;
    }


}
