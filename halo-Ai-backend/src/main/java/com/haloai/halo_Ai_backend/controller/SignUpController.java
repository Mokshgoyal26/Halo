package com.haloai.halo_Ai_backend.controller;

import com.haloai.halo_Ai_backend.Model.SignUpRequest;
import com.haloai.halo_Ai_backend.service.JWTService;
import com.haloai.halo_Ai_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
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

    public SignUpController(UserService userService ,
                            AuthenticationManager authenticationManager,
                            JWTService jwtService){

        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody SignUpRequest request){
        System.out.println("user credentials : "+ request);
           userService.signUpUser(request);

        Map<String,String> response = new HashMap<>();
        response.put("message","User is registered");

           return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody SignUpRequest request){

        System.out.println("login request : "+request);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUser(),
                        request.getPassword()
                )
        );

        System.out.println("login successful for the user : " + authentication.getName());

        String token = jwtService.generateToken(request.getUser());

        Map<String , String> response = new HashMap<>();
        response.put("token" , token);

        return ResponseEntity.ok(response);
    }
}
