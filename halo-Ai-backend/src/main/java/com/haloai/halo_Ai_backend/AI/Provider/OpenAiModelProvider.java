package com.haloai.halo_Ai_backend.AI.Provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.haloai.halo_Ai_backend.DTO.AiModels.OpenAIRequestDto;
import com.haloai.halo_Ai_backend.DTO.AiModels.OpenAiResponseDto;
import com.haloai.halo_Ai_backend.DTO.ChatRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.List;

@Component
public class OpenAiModelProvider implements AiProvider{

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.model:gpt-4o}")
    private String model;

    public OpenAiModelProvider(WebClient.Builder webClientBuilder , ObjectMapper objectMapper){
        this.webClient = webClientBuilder
                .baseUrl("https://api/openai.com/v1")
                .build();
        this.objectMapper = objectMapper;
    }


    public Flux<String> generateResponse(String prompt){

        OpenAIRequestDto requestDto = buildRequest(prompt);

        return webClient.post()
                .uri("/chat/completions")

                .header(HttpHeaders.AUTHORIZATION , "Bearer "+apiKey)
                .header(HttpHeaders.CONTENT_TYPE , MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(requestDto)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Open AI API Error: "+ body))
                )
                .bodyToFlux(String.class)
                .filter(chunk -> !chunk.equals("[DONE]"))
                .mapNotNull(this::extractContent);
    }


    private OpenAIRequestDto buildRequest(String prompt){
        OpenAIRequestDto.Message message = new OpenAIRequestDto.Message("user" , prompt);

        return new OpenAIRequestDto(model , List.of(message) ,true);
    }

    private String extractContent(String chunk){
        try{
            OpenAiResponseDto response = objectMapper.readValue(chunk , OpenAiResponseDto.class);

            return response.getChoices().stream()
                    .findFirst()
                    .map(OpenAiResponseDto.Choice::getDelta)
                    .map(OpenAiResponseDto.Delta::getContent)
                    .orElse(null);
        }catch(Exception e){
            return null;
        }
    }

    public ChatRequest.AiModelType getModelType(){
        return ChatRequest.AiModelType.OPENAI;
    }
}
