package com.haloai.halo_Ai_backend.AI.Provider;

import com.haloai.halo_Ai_backend.DTO.ChatRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class AiModelProviderRegistry {

    private final Map<ChatRequest.AiModelType , AiProvider> registry;

    public AiModelProviderRegistry(List<AiProvider> providers){
        this.registry = providers.stream()
                .collect(Collectors.toMap(
                        AiProvider::getModelType,
                        provider -> provider
                ));
    }

    public AiProvider getProvider(ChatRequest.AiModelType modelType){
        AiProvider provider = registry.get(modelType);

        if (provider == null) {
            throw new IllegalArgumentException("No provider found for model: " + modelType);
        }

        return provider;
    }
}
