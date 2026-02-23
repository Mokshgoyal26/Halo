package com.haloai.halo_Ai_backend.AI.Provider;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface AiProvider {
    /*
        Generate Ai output based on input/prompt
        @Param prompt input prompt to process
        @return Ai generated response
     */
    Flux<String> generateResponse(String prompt);
}


