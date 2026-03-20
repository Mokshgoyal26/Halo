package com.haloai.halo_Ai_backend.AI.Provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.haloai.halo_Ai_backend.DTO.AiModels.ClaudeRequestDto;
import com.haloai.halo_Ai_backend.DTO.AiModels.ClaudeResponseDto;
import com.haloai.halo_Ai_backend.DTO.ChatRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.List;

@Component
public class ClaudeModelProvider implements AiProvider{

    private final ObjectMapper objectMapper;
    private final WebClient webClient;

    private String apiKey;
    private String model;

    public ClaudeModelProvider(WebClient.Builder webClientBuilder , ObjectMapper objectMapper ){
        this.webClient = webClientBuilder
                .baseUrl("https://api/anthropic.com/v1")
                .build();

        this.objectMapper = objectMapper;
    }


    public Flux<String> generateResponse(String prompt){

        ClaudeRequestDto request  = buildRequest(prompt);

        return webClient.post()
                .uri("/messages")
                .header(HttpHeaders.CONTENT_TYPE , MediaType.APPLICATION_JSON_VALUE)
                .header("x-api-key" , apiKey)
                .header("anthropic-version", "2023-06-01")
                .bodyValue(request)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                                  clientResponse -> clientResponse.bodyToMono(String.class)
                                          .map(body -> new RuntimeException("Claude API Error : "+ body))

                )
                .bodyToFlux(String.class)
                .filter(chunk -> !chunk.isBlank())
                .mapNotNull(this::extractContent);
    }

    private ClaudeRequestDto buildRequest(String prompt){

        ClaudeRequestDto.Message message  = new ClaudeRequestDto.Message("user",prompt);

        return new ClaudeRequestDto(model , 1024 , List.of(message) , true);
    }

    private String extractContent(String chunk){
        try{
            ClaudeResponseDto response = objectMapper.readValue(chunk , ClaudeResponseDto.class);

            if("content-block-delta".equals(response.getType()) && response.getDelta() != null
            && "text-delta".equals(response.getDelta().getType())){

                return response.getDelta().getText();
            }

            return null;
        }catch(Exception e){
            return null;
        }
    }

    @Override
    public ChatRequest.AiModelType getModelType(){
        return ChatRequest.AiModelType.CLAUDE;
    }
}
