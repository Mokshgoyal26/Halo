package com.haloai.halo_Ai_backend.DTO.AiModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClaudeRequestDto {

    private String model;
    private int max_tokens;
    private List<Message> messages;
    private boolean stream;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Message{
        private String role;
        private String content;
    }
}
