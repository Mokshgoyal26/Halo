package com.haloai.halo_Ai_backend.service;

import com.haloai.halo_Ai_backend.DTO.SignUpRequest;
import com.haloai.halo_Ai_backend.Model.User;
import com.haloai.halo_Ai_backend.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository , PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void signUpUser(SignUpRequest request){

        String username = request.getUser();
        String rawPassword = request.getPassword();

        if(userRepository.existsByUsername(username)){
            throw new ResponseStatusException(HttpStatus.CONFLICT , "User already exists");
        }

        String hashedPassword = passwordEncoder.encode(rawPassword);

        User user = new User();
        user.setUsername(username);
        user.setPassword(hashedPassword);

        userRepository.save(user);
    }

    public User findByUsername(String username){
        return userRepository.findUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("user not found"));
    }
}
