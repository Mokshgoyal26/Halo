package com.haloai.halo_Ai_backend.service.Conversations;

import com.haloai.halo_Ai_backend.DTO.ConversationHistory.ConversationResponseDto;
import com.haloai.halo_Ai_backend.DTO.ConversationHistory.MessageDto;
import com.haloai.halo_Ai_backend.Exceptions.ConversationNotFoundException;
import com.haloai.halo_Ai_backend.Exceptions.MessageNotFoundException;
import com.haloai.halo_Ai_backend.Exceptions.UsernameNotFoundException;
import com.haloai.halo_Ai_backend.Model.Conversation;
import com.haloai.halo_Ai_backend.Model.Message;
import com.haloai.halo_Ai_backend.Model.User;
import com.haloai.halo_Ai_backend.Repository.ConversationRepository;
import com.haloai.halo_Ai_backend.Repository.MessageRepository;
import com.haloai.halo_Ai_backend.Repository.UserRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConversationServiceImp implements ConversationService{

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public ConversationServiceImp(ConversationRepository conversationRepository,
                                  MessageRepository messageRepository,
                                  UserRepository userRepository){

        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Mono<Void> save(String username, String conversationId, String userMessage , String aiResponse) {
        return Mono.fromRunnable(() ->{

            User user = userRepository.findUserByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("user not found : "+ username));


            Conversation conversation;

            if(!conversationRepository.existsByConversationId(conversationId)){
                // if conversation dont exists
                // first message -> creating new conversation
                // auto generating title from first message

                String title = userMessage.length() > 50 ? userMessage.substring(0,50) : userMessage;

                conversation = Conversation.builder()
                        .conversationId(conversationId)
                        .userId(user.getId())
                        .title(title)
                        .createdAt(LocalDateTime.now())
                        .build();

                conversationRepository.save(conversation);
            }else{
                conversation = conversationRepository.findById(conversationId)
                        .orElseThrow(() -> new ConversationNotFoundException("conversation not found"));
            }


            Message userMsg = Message.builder()
                    .conversation(conversation)
                    .role("user")
                    .text(userMessage)
                    .timestamp(LocalDateTime.now())
                    .build();

            Message aiMsg = Message.builder()
                    .conversation(conversation)
                    .role("ai")
                    .text(aiResponse)
                    .timestamp(LocalDateTime.now())
                    .build();

            messageRepository.save(userMsg);
            messageRepository.save(aiMsg);

        });


    }

    @Override
    public List<ConversationResponseDto> getChatHistory(String username){
        User user = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found : "+username));

        return conversationRepository.
                findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(conv -> ConversationResponseDto.builder()
                        .conversationId(conv.getConversationId())
                        .title(conv.getTitle())
                        .createdAt(LocalDateTime.now())
                        .build()
                ).collect(Collectors.toList());
    }

    public List<MessageDto> getAllMessages(String conversationId , String username){

        User user = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("user not found"));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException("conversation not found"));

        if(!conversation.getUserId().equals(user.getId())){
            throw new RuntimeException("Unauthorized");
        }

        return messageRepository.findByConversationConversationIdOrderByTimestampAsc(conversationId)
                .stream()
                .map(
                        msg -> MessageDto.builder()
                                .role(msg.getRole())
                                .text(msg.getText())
                                .timestamp(LocalDateTime.now())
                                .build()
                ).collect(Collectors.toList());
    }



}
