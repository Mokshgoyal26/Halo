package com.haloai.halo_Ai_backend.controller;

import com.haloai.halo_Ai_backend.DTO.AuthResponse;
import com.haloai.halo_Ai_backend.DTO.LoginRequest;
import com.haloai.halo_Ai_backend.DTO.SignUpRequest;
import com.haloai.halo_Ai_backend.Model.RefreshToken;
import com.haloai.halo_Ai_backend.Model.User;
import com.haloai.halo_Ai_backend.service.JWTService;
import com.haloai.halo_Ai_backend.service.RefreshTokenService;
import com.haloai.halo_Ai_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class SignUpController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final RefreshTokenService refreshTokenService;

    public SignUpController(UserService userService ,
                            AuthenticationManager authenticationManager,
                            JWTService jwtService,
                            RefreshTokenService refreshTokenService){

        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@Valid @RequestBody SignUpRequest request){
        System.out.println("user credentials : "+ request);
           userService.signUpUser(request);

        Map<String,String> response = new HashMap<>();
        response.put("message","User is registered");

           return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request){

        System.out.println("login request : "+request);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUser(),
                        request.getPassword()
                )
        );

        System.out.println("login successful for the user : " + authentication.getName());


        User user = userService.findByUsername(authentication.getName());

        String accessToken = jwtService.generateToken(request.getUser());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.ok(new AuthResponse(accessToken , refreshToken.getToken()));
    }
}
