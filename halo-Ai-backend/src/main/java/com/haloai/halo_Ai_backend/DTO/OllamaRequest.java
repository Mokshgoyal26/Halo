package com.haloai.halo_Ai_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OllamaRequest{

    private final String model;
    private final String prompt;
    private final boolean stream;

}
