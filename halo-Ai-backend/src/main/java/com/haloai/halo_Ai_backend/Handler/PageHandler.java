package com.haloai.halo_Ai_backend.Handler;

import com.haloai.halo_Ai_backend.Model.PageData.PageContext;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface PageHandler {

    String getPageType();
    Flux<String> handlePageType(PageContext context , String userMessage);
}
