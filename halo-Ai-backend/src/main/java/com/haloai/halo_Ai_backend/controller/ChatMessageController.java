package com.haloai.halo_Ai_backend.controller;

import com.haloai.halo_Ai_backend.Model.ChatRequest;
import com.haloai.halo_Ai_backend.service.ChatRequestService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api")
public class ChatMessageController {

    private final ChatRequestService dataService;
    public ChatMessageController(ChatRequestService dataService){
        this.dataService = dataService;
    }


    @PostMapping("/chatMessage")
    public Flux<String> aiResponse(@RequestBody ChatRequest request){
        System.out.println("request : " + request);
        System.out.println("pageType: "+request.getPageData().getPageType());

        Flux<String> response =  dataService.handleRequest(request);
        log.info("response : {}",response);
        System.out.println("response : "+response);
        return response;
    }

}