package com.haloai.halo_Ai_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class AuthResponse {

    private final String accessToken;
    private final String refreshToken;
}
