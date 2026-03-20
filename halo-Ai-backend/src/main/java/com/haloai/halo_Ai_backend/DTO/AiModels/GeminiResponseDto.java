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
public class GeminiResponseDto {

    private List<Candidate> candidates;


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Candidate{
        private Content content;

        @JsonProperty("finish_reason")
        private String finishReason;

    }


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Content{
        private List<Part> parts;
        private String role;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Part{
        private String text;
    }


    public String getContent(){
        if(candidates != null
        && !candidates.isEmpty()
        && candidates.get(0).getContent() != null
                && candidates.get(0).getContent().getParts() != null
        && !candidates.get(0).getContent().getParts().isEmpty()
        && candidates.get(0).getContent().getParts().get(0).getText() != null){

            return candidates.get(0).getContent().getParts().get(0).getText();
        }

        return "";
    }
}
