package com.haloai.halo_Ai_backend.Error;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@Data
public class ApiError {

    private int status;
    private String error;
    private String message;
    private String path;
    private LocalDateTime createdAt;
    private Map<String , String> validationErrors;

    // using overloaded constructor for adding new field to apiError

    public ApiError(int status , String error , String message , String path ,
                    LocalDateTime createdAt){
        this.status = status;
        this.message = message;
        this.error = error;
        this.createdAt = createdAt;
        this.path = path;
    }

    public ApiError(int status , String error , String message , String path ,
                    LocalDateTime createdAt , Map<String , String> validationErrors){
        this.status = status;
        this.message = message;
        this.error = error;
        this.createdAt = createdAt;
        this.path = path;
        this.validationErrors = validationErrors;
    }
}
