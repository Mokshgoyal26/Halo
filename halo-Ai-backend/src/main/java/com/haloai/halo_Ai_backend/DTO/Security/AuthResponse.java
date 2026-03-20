package com.haloai.halo_Ai_backend.DTO.Security;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private final String accessToken;
    private final String refreshToken;
    private final String username;
}
