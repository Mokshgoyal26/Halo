package com.haloai.halo_Ai_backend.controller;

import com.haloai.halo_Ai_backend.Model.SignUpRequest;
import com.haloai.halo_Ai_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class SignUpController {

    private final UserService userService;

    public SignUpController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody SignUpRequest request){
        System.out.println("user credentials : "+ request);
           userService.signUpUser(request);

           return ResponseEntity.ok("user is registered");
    }
}
