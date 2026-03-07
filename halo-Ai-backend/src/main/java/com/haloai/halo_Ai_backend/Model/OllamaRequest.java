package com.haloai.halo_Ai_backend.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class OllamaRequest{

    private final String model;
    private final String prompt;
    private final boolean stream;

}
