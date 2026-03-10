package com.haloai.halo_Ai_backend.Config.Filter;

import com.haloai.halo_Ai_backend.service.CustomerUserDetailsService;
import com.haloai.halo_Ai_backend.service.JWTService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final CustomerUserDetailsService userDetailsService;

    public JWTAuthenticationFilter(JWTService jwtService , CustomerUserDetailsService userDetailsService){
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {


        String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwtToken = null;

        System.out.println("Auth header: " + authHeader);
        System.out.println(
                "Incoming request: " +
                        request.getMethod() + " " +
                        request.getRequestURI()
        );

        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request , response);
            return;
        }

        jwtToken = authHeader.substring(7);

        try{
            username = jwtService.extractUsername(jwtToken);
        }catch(ExpiredJwtException e){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token expired\"}");

            return;
        }

        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){

            UserDetails  userDetails = userDetailsService.loadUserByUsername(username);

            if(jwtService.isTokenValid(jwtToken , userDetails.getUsername())){
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("Authenticated user set in security context");
            }
        }

        filterChain.doFilter(request,response);

    }
}
