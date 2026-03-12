package com.haloai.halo_Ai_backend.service;

import com.haloai.halo_Ai_backend.Model.User;
import com.haloai.halo_Ai_backend.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomerUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username){
        Optional<User> user = userRepository.findUserByUsername(username);

        User u = user.orElseThrow(() -> new com.haloai.halo_Ai_backend.Exceptions.UsernameNotFoundException(
                "user "+ username + " not found"));

        return org.springframework.security.core.userdetails.User
                .withUsername(u.getUsername())
                .password(u.getPassword())
                .build();
    }
}
