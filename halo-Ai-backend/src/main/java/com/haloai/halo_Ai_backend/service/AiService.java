package com.haloai.halo_Ai_backend.service;

import com.haloai.halo_Ai_backend.AI.Provider.OllamaModelProvider;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class AiService {

    private OllamaModelProvider localModel;

    public AiService(OllamaModelProvider localModel){
        this.localModel = localModel;
    }

    public Flux<String> getResponse(String prompt){

        return localModel.generateResponse(prompt);
    }

}
