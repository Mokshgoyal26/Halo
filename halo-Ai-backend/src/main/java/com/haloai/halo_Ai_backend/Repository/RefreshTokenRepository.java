package com.haloai.halo_Ai_backend.Repository;

import com.haloai.halo_Ai_backend.Model.RefreshToken;
import com.haloai.halo_Ai_backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken , Long> {

    Optional<RefreshToken> findByToken(String refreshToken);
}
