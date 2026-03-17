package com.haloai.halo_Ai_backend.AI.Provider;

import com.haloai.halo_Ai_backend.DTO.OllamaRequest;
import com.haloai.halo_Ai_backend.DTO.OllamaResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

@Service
public class OllamaModelProvider implements AiProvider {

    private final WebClient webClient ;

    public OllamaModelProvider(WebClient.Builder builder){
        this.webClient = builder
                .baseUrl("http://localhost:11434")
                .build();
    }


    @Override
    public Flux<String> generateResponse(String prompt){

        OllamaRequest request = new OllamaRequest(
                "llama3.2",
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
}
