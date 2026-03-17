package com.haloai.halo_Ai_backend.Exceptions;

public class ConversationNotFoundException extends RuntimeException{

    public ConversationNotFoundException(String message){
        super(message);
    }
}
