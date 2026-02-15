package com.haloai.halo_Ai_backend.controller;

import com.haloai.halo_Ai_backend.Model.ChatRequest;
import com.haloai.halo_Ai_backend.Model.PageData;
import com.haloai.halo_Ai_backend.service.ChatRequestService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.ResponseEntity.ok;

@Slf4j
@RestController
@RequestMapping("/api")
public class ChatMessageController {

    private final ChatRequestService dataService;
    public ChatMessageController(ChatRequestService dataService){
        this.dataService = dataService;
    }

    @PostMapping("/chatMessage")
    public String aiResponse(@RequestBody ChatRequest request){
        System.out.println("chat request from the user : " + request);

        String response =  dataService.handleRequest(request);
        log.info("response : {}",response);
        System.out.println("response : "+response);
        return response;
    }

}