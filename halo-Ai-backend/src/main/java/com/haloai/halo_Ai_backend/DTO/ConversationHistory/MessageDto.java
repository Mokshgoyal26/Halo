package com.haloai.halo_Ai_backend.DTO.ConversationHistory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageDto {
    private String role;
    private String text;
    private LocalDateTime timestamp;
}
