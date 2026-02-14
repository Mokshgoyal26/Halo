package com.haloai.halo_Ai_backend.controller;

import com.haloai.halo_Ai_backend.Model.PageData;
import com.haloai.halo_Ai_backend.service.PageDataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.ResponseEntity.ok;

@Slf4j
@RestController
@RequestMapping("/api")
public class pageController{

    private final PageDataService dataService;
    public pageController(PageDataService dataService){
        this.dataService = dataService;
    }

    @PostMapping("/pageData")
    public ResponseEntity<String> logPageData(@RequestBody PageData payload){
        log.info("page data received : {}",payload);
        dataService.processPageData(payload);
        return ok("data received");
    }

    @PostMapping("/summary")
    public String PageSummary(@RequestBody  PageData data){


        System.out.println("data : " +data);

        String response =  dataService.getPageSummary(data);
        log.info("response : {}",response);
        System.out.println("response : "+response);
        return response;
    }

}