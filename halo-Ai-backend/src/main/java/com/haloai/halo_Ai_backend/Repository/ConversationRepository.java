package com.haloai.halo_Ai_backend.Repository;

import com.haloai.halo_Ai_backend.Model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation , String> {

    List<Conversation> findByUserIdOrderByCreatedAtDesc(Long userId);
    Boolean existsByConversationId(String conversationId);
}
