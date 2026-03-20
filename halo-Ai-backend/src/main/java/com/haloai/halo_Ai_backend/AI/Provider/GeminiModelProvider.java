package com.haloai.halo_Ai_backend.AI.Provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.haloai.halo_Ai_backend.DTO.AiModels.GeminiRequestDto;
import com.haloai.halo_Ai_backend.DTO.AiModels.GeminiResponseDto;
import com.haloai.halo_Ai_backend.DTO.ChatRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.List;

@Component
public class GeminiModelProvider implements AiProvider{

    private final ObjectMapper objectMapper;
    private final WebClient webClient;

    private String apiKey;
    private String model;

    public GeminiModelProvider(WebClient.Builder webClientBuilder , ObjectMapper objectMapper){
        this.webClient = webClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .build();

        this.objectMapper = objectMapper;
    }

    @Override
    public Flux<String> generateResponse(String prompt){

        GeminiRequestDto request = buildRequest(prompt);

        return webClient.post()
                .uri("/models/" + model + ":streamGenerateContent?alt=sse&key=" + apiKey)
                .header(HttpHeaders.CONTENT_TYPE , MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Gemini API error: " + body))
                )
                .bodyToFlux(String.class)
                .filter(chunk -> !chunk.isBlank())
                .mapNotNull(this::extractContent);

    }


    private GeminiRequestDto buildRequest(String prompt){

        GeminiRequestDto.Part part = new GeminiRequestDto.Part(prompt);
        GeminiRequestDto.Content content = new GeminiRequestDto.Content("user" , List.of(part));

        return new GeminiRequestDto(List.of(content));

    }

    private String extractContent(String chunk){
        try{
            GeminiResponseDto response = objectMapper.readValue(chunk , GeminiResponseDto.class);

            return response.getCandidates().stream()
                    .findFirst()
                    .map(GeminiResponseDto.Candidate::getContent)
                    .filter(content -> content.getParts() != null)
                    .map(GeminiResponseDto.Content::getParts)
                    .filter(parts -> !parts.isEmpty())
                    .map(parts -> parts.get(0))
                    .map(GeminiResponseDto.Part::getText)
                    .orElse(null);

        }catch(Exception e){
            return null;
        }
    }

    public ChatRequest.AiModelType getModelType(){
        return ChatRequest.AiModelType.GEMINI;
    }
}
