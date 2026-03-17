package com.haloai.halo_Ai_backend.DTO.ConversationHistory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConversationResponseDto {
    private String conversationId;
    private String title;
    private LocalDateTime createdAt;
    private List<MessageDto> messages;
}
