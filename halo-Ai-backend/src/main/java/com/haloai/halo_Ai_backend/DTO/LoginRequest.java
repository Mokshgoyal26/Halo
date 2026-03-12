package com.haloai.halo_Ai_backend.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 4 , max = 20 , message = "username must be between 4 and 20 characters")
    private String user;

    @NotBlank(message = "password cannot be empty")
    @Size(min = 6 , message = "password must be at least 6 characters")
    private String password;
}
