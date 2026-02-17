package com.haloai.halo_Ai_backend.Model;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.haloai.halo_Ai_backend.Model.PageData.PageContext;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ChatRequest {
    private PageContext pageData;
    private String userMessage;
}
