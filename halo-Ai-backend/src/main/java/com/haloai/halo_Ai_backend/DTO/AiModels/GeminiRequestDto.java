package com.haloai.halo_Ai_backend.DTO.AiModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeminiRequestDto {

    private List<Content> contents;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Content{
        private String role;
        private List<Part> parts;

    }


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Part{
        private String text;
    }
}
