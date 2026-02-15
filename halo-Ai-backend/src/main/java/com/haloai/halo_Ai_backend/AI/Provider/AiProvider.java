package com.haloai.halo_Ai_backend.AI.Provider;

public interface AiProvider {
    /*
        Generate Ai output based on input/prompt
        @Param prompt input prompt to process
        @return Ai generated response
     */
    String generateResponse(String prompt);
}


