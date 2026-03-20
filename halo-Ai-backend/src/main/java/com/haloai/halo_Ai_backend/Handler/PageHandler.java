package com.haloai.halo_Ai_backend.Handler;

import com.haloai.halo_Ai_backend.DTO.ChatRequest;
import com.haloai.halo_Ai_backend.DTO.PageData.PageContext;
import reactor.core.publisher.Flux;

public interface PageHandler {

    String getPageType();
    Flux<String> handlePageType(PageContext context , String userMessage , ChatRequest.AiModelType modelType);
}
