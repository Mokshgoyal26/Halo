package com.haloai.halo_Ai_backend.Exceptions;

public class MessageNotFoundException extends RuntimeException{

    public MessageNotFoundException(String message){
        super(message);
    }
}
