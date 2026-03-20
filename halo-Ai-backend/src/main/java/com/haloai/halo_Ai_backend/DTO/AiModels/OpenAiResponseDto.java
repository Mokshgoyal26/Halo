package com.haloai.halo_Ai_backend.DTO.AiModels;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenAiResponseDto {

    private List<Choice> choices;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Choice{
        private Delta delta;

        @JsonProperty("finish_reason")
        private String finalReason;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Delta{
        private String content;
    }


    public String getContent(){

        if(choices != null &&
                !choices.isEmpty() &&
                choices.get(0).getDelta() != null &&
                choices.get(0).getDelta().getContent() != null){

            return choices.get(0).getDelta().getContent();
        }

        return "";
    }

    public boolean isFinished(){
        if(choices != null && !choices.isEmpty()){
            return "stop".equals(choices.get(0).getFinalReason());
        }

        return false;
    }


}
