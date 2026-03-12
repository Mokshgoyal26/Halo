package com.haloai.halo_Ai_backend.Exceptions;

public class RefreshTokenNotFoundException extends RuntimeException{

    public RefreshTokenNotFoundException(String message){
        super(message);
    }
}
