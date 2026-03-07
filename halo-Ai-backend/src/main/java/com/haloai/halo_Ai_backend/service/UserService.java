package com.haloai.halo_Ai_backend.service;

import com.haloai.halo_Ai_backend.Model.SignUpRequest;
import com.haloai.halo_Ai_backend.Model.User;
import com.haloai.halo_Ai_backend.Repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public void signUpUser(SignUpRequest request){

        String username = request.getUser();
        String rawPassword = request.getPassword();

        if(userRepository.existsByUsername(username)){
            throw new RuntimeException("user already exists");
        }

        String hashedPassword = passwordEncoder.encode(rawPassword);

        User user = new User();
        user.setUsername(username);
        user.setPassword(hashedPassword);

        userRepository.save(user);
    }
}
