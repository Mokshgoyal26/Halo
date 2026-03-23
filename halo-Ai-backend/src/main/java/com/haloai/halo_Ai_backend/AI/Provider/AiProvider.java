package com.haloai.halo_Ai_backend.AI.Provider;

import com.haloai.halo_Ai_backend.DTO.ChatRequest;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface AiProvider {
    /*
        Generate Ai output based on input/prompt
        @Param prompt input prompt to process
        @return Ai generated response
     */
    Flux<String> generateResponse(String prompt , String apiKey , String model);

    ChatRequest.AiModelType getModelType();
}


