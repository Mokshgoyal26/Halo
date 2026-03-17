package com.haloai.halo_Ai_backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversations")
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class Conversation {

    @Id
    @Column(name="conversation_id" , nullable = false)
    private String conversationId;

    @Column(name="user_id" , nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String title;

    @Column(name="created_at")
    private LocalDateTime createdAt;

}
