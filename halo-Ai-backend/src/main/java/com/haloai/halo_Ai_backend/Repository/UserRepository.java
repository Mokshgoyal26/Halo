package com.haloai.halo_Ai_backend.Repository;

import com.haloai.halo_Ai_backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findUserByUsername(String username);

    Boolean existsByUsername(String username);

}
