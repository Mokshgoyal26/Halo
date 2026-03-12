package com.haloai.halo_Ai_backend.Error;

import com.haloai.halo_Ai_backend.Exceptions.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({EmailAlreadyExistsException.class , UsernameAlreadyExistsException.class})
    public ResponseEntity<ApiError> handleConflictExceptions(RuntimeException exception,
                                                      HttpServletRequest request){

        ApiError apiError = new ApiError(
                409,
                "CONFLICT",
                exception.getMessage(),
                request.getRequestURI(),
                LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(apiError);

    }


    @ExceptionHandler(RefreshTokenExpiredException.class)
    public ResponseEntity<ApiError> handleRefreshTokenExpireException(RefreshTokenExpiredException
                                                                      refreshTokenExpiredException,
                                                                      HttpServletRequest request){

        ApiError apiError =  new ApiError(
                401,
                "UNAUTHORIZED",
                refreshTokenExpiredException.getMessage(),
                request.getRequestURI(),
                LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiError);
    }

    @ExceptionHandler({RefreshTokenNotFoundException.class , UserNotFoundException.class , UsernameNotFoundException.class})
    public ResponseEntity<ApiError> handleNotFoundExceptions(RuntimeException exception,
                                                                        HttpServletRequest request){

        ApiError apiError =  new ApiError(
                404,
                "NOT_FOUND",
                exception.getMessage(),
                request.getRequestURI(),
                LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiError);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentialsException(BadCredentialsException badCredentialsException,
                                                                  HttpServletRequest request){

        ApiError apiError = new ApiError(
                401,
                "UNAUTHORIZED",
                "Invalid Username or Password",
                request.getRequestURI(),
                LocalDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiError);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleMethodArgumentValidException(MethodArgumentNotValidException exception,
                                                                       HttpServletRequest request){

        Map<String , String> errors = new HashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField() , error.getDefaultMessage());
        });

        ApiError  apiError = new ApiError(
                400,
                "BAD_REQUEST",
                "validation failed",
                request.getRequestURI(),
                LocalDateTime.now(),
                errors
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }
}
