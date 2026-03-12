package com.haloai.halo_Ai_backend.controller;

import com.haloai.halo_Ai_backend.Exceptions.RefreshTokenNotFoundException;
import com.haloai.halo_Ai_backend.Model.RefreshToken;
import com.haloai.halo_Ai_backend.Repository.RefreshTokenRepository;
import com.haloai.halo_Ai_backend.service.JWTService;
import com.haloai.halo_Ai_backend.service.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class TokenController {

    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JWTService jwtService;

    public TokenController(RefreshTokenService refreshTokenService,
                           RefreshTokenRepository refreshTokenRepository,
                           JWTService jwtService){

        this.refreshTokenService = refreshTokenService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String,String> request){

        String requestToken = request.get("refreshToken");

        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(requestToken)
                .map(refreshTokenService::verifyExpiration)
                .orElseThrow(() ->  new RefreshTokenNotFoundException("Refresh Token not found"));

        String username = refreshToken.getUser().getUsername();

        String accessToken = jwtService.generateToken(username);

        return ResponseEntity.ok(Map.of(
                "accessToken" , accessToken
        ));
    }
}
