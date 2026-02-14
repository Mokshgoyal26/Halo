package com.haloai.halo_Ai_backend.service;

import com.haloai.halo_Ai_backend.AI.LocalModelProvider;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private LocalModelProvider localModel;

    public AiService(LocalModelProvider localModel){
        this.localModel = localModel;
    }

    public String getResponse(String prompt){

        String cleanPrompt = preprocess(prompt);

        String response = localModel.generateResponse(cleanPrompt);

        return postProcess(response);
    }


    private String preprocess(String prompt){
        if(prompt == null || prompt.isEmpty()){
            return "no input provided";
        }

        return prompt.trim();
    }

    private String postProcess(String output){

        /*
               its dummy output for now but this method is useful for making response more
               structured .
         */

        return output + "(processed by ai service)";
    }
}
