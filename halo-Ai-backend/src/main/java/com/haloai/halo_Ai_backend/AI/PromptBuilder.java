package com.haloai.halo_Ai_backend.AI;

import org.springframework.stereotype.Component;

@Component
public class PromptBuilder {

    public String buildPrompt(String userMessage , String pageData){
        return """
                User Instruction:
                   %s
                
                Page Data:
                   %s
               
                please respond according to the User Instruction using the Page Data.
                """. formatted(userMessage,pageData);
    }
}
