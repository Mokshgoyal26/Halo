package com.haloai.halo_Ai_backend.Exceptions;


public class EmailAlreadyExistsException extends RuntimeException{

    public EmailAlreadyExistsException(String message){
        super(message);
    }
}
