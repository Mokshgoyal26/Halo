package com.haloai.halo_Ai_backend.DTO.AiModels;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ClaudeResponseDto {

    private String type;
    private Delta delta;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Delta{
        private String type;
        private String text;
    }

    public String getContent(){

        if("content_block_delta".equals(type) &&
                        delta != null &&
                        delta.getText() != null){

            return delta.getText();
        }

        return "";
    }
}
