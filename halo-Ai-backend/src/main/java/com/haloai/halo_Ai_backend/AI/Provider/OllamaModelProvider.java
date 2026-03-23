package com.haloai.halo_Ai_backend.AI.Provider;

import com.haloai.halo_Ai_backend.DTO.AiModels.OllamaRequest;
import com.haloai.halo_Ai_backend.DTO.AiModels.OllamaResponse;
import com.haloai.halo_Ai_backend.DTO.ChatRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

@Service
public class OllamaModelProvider{

    private final WebClient webClient ;

    public OllamaModelProvider(WebClient.Builder builder){
        this.webClient = builder
                .baseUrl("http://localhost:11434")
                .build();
    }




    public Flux<String> generateResponse(String prompt , String apiKey , String model){

        OllamaRequest request = new OllamaRequest(
                model,
                prompt,
                true
        );

        return webClient.post()
                    .uri("/api/generate")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToFlux(OllamaResponse.class)
                    .map(OllamaResponse::getResponse);
    }


    public ChatRequest.AiModelType getModelType() {
        return ChatRequest.AiModelType.OLLAMA;
    }
}
