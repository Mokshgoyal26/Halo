package com.haloai.halo_Ai_backend.controller;

import com.haloai.halo_Ai_backend.DTO.ChatRequest;
import com.haloai.halo_Ai_backend.DTO.ConversationHistory.ConversationResponseDto;
import com.haloai.halo_Ai_backend.DTO.ConversationHistory.MessageDto;
import com.haloai.halo_Ai_backend.service.ChatRequestService;
import com.haloai.halo_Ai_backend.service.Conversations.ConversationServiceImp;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api")
public class ChatMessageController {

    private final ChatRequestService dataService;
    private final ConversationServiceImp conversationService;

    public ChatMessageController(ChatRequestService dataService , ConversationServiceImp  conversationService){

        this.dataService = dataService;
        this.conversationService = conversationService;
    }


    @PostMapping(value = "/chatMessage" , produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<String> aiResponse(@RequestBody ChatRequest request , @AuthenticationPrincipal UserDetails userDetails){
        System.out.println("request : " + request);
        System.out.println("pageType: "+request.getPageData().getPageType());

        Flux<String> responseStream =  dataService.handleRequest(request).cache();

        responseStream
                .collect(Collectors.joining())
                        .flatMap(fullResponse ->
                            conversationService.save(
                                    userDetails.getUsername(),
                                    request.getConversationId(),
                                    request.getUserMessage(),
                                    fullResponse
                            )
                        )
                .subscribe();


        log.info("response : {}",responseStream);
        System.out.println("response : "+responseStream);

        return responseStream;
    }


    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponseDto>> ChatHistory(@AuthenticationPrincipal UserDetails userDetails){

        List<ConversationResponseDto> history = conversationService.getChatHistory(userDetails.getUsername());

        return ResponseEntity.ok(history);
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(@PathVariable String conversationId , @AuthenticationPrincipal
                                                        UserDetails userDetails){

        List<MessageDto> messages = conversationService.getAllMessages(conversationId ,
                userDetails.getUsername());


        return ResponseEntity.ok(messages);
    }

}