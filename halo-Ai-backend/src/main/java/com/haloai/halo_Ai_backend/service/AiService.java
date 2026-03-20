package com.haloai.halo_Ai_backend.service;

import com.haloai.halo_Ai_backend.AI.Provider.AiModelProviderRegistry;
import com.haloai.halo_Ai_backend.AI.Provider.OllamaModelProvider;
import com.haloai.halo_Ai_backend.DTO.ChatRequest;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class AiService {

    private final AiModelProviderRegistry registry;

    public AiService(AiModelProviderRegistry registry){
        this.registry = registry;
    }

    public Flux<String> getResponse(String prompt , ChatRequest.AiModelType modelType){

        return registry.getProvider(modelType).generateResponse(prompt);
    }

}
