package com.haloai.halo_Ai_backend.AI;

import org.springframework.stereotype.Service;

@Service
public class LocalModelProvider implements AiProvider{
    public String generateResponse(String prompt){

        /*
            this is fake response for now ,
            we can add real model later on after checking the workflow
         */

        return "Local AI Output for: "+ (prompt.length()>100 ? prompt.substring(0,100) + "..." : prompt);

    }
}
