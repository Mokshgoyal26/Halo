package com.haloai.halo_Ai_backend.controller;

import com.haloai.halo_Ai_backend.Model.PageData;
import com.haloai.halo_Ai_backend.service.pageDataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
public class pageController{

    private final pageDataService service;
    public pageController(pageDataService service){
        this.service = service;
    }

    @PostMapping("/pageData")
    public ResponseEntity<String> logPageData(@RequestBody PageData payload){
        log.info("page data received : {}",payload);
        service.processPageData(payload);
        return ResponseEntity.ok("data received");
    }

}