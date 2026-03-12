package com.haloai.halo_Ai_backend.service;

import com.haloai.halo_Ai_backend.Exceptions.RefreshTokenExpiredException;
import com.haloai.halo_Ai_backend.Exceptions.UserNotFoundException;
import com.haloai.halo_Ai_backend.Model.RefreshToken;
import com.haloai.halo_Ai_backend.Model.User;
import com.haloai.halo_Ai_backend.Repository.RefreshTokenRepository;
import com.haloai.halo_Ai_backend.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(UserRepository userRepository ,
                               RefreshTokenRepository refreshTokenRepository){

        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public RefreshToken createRefreshToken(Long id){

        User user = userRepository.findById(id).orElseThrow(() ->
                new UserNotFoundException("user by id : "+ id + " not found"));

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(1000 * 60 * 5));


        return refreshTokenRepository.save(refreshToken);

    }

    public RefreshToken verifyExpiration(RefreshToken refreshToken){

        if(refreshToken.getExpiryDate().compareTo(Instant.now()) < 0){
            refreshTokenRepository.delete(refreshToken);

            throw new RefreshTokenExpiredException("Refresh Token is Expired");
        }

        return refreshToken;
    }
}
