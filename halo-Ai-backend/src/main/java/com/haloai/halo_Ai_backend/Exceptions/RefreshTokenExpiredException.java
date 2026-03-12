package com.haloai.halo_Ai_backend.Exceptions;

public class RefreshTokenExpiredException extends RuntimeException{

    public RefreshTokenExpiredException(String message){
        super(message);
    }
}
