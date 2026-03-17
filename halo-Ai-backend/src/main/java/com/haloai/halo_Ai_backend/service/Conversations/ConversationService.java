package com.haloai.halo_Ai_backend.service.Conversations;

import com.haloai.halo_Ai_backend.DTO.ConversationHistory.ConversationResponseDto;
import com.haloai.halo_Ai_backend.DTO.ConversationHistory.MessageDto;
import reactor.core.publisher.Mono;

import java.util.List;

public interface ConversationService {

    Mono<Void> save(String username , String conversationId , String userMessage ,String aiResponse);
    List<ConversationResponseDto> getChatHistory(String username);
    List<MessageDto> getAllMessages(String conversationId , String username);

}
