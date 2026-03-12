package com.haloai.halo_Ai_backend.Exceptions;


public class UsernameNotFoundException extends RuntimeException{

    public UsernameNotFoundException(String message){
        super(message);
    }
}
