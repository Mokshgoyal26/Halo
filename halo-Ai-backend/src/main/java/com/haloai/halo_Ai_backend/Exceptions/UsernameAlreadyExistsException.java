package com.haloai.halo_Ai_backend.Exceptions;

public class UsernameAlreadyExistsException extends RuntimeException{

    public UsernameAlreadyExistsException(String message){
        super(message);
    }
}
