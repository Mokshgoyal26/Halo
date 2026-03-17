package com.haloai.halo_Ai_backend.Repository;

import com.haloai.halo_Ai_backend.Model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Long> {

    List<Message> findByConversationConversationIdOrderByTimestampAsc(String conversationId);
}
