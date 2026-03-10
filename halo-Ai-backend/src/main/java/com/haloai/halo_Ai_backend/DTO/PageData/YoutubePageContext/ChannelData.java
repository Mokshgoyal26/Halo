package com.haloai.halo_Ai_backend.DTO.PageData.YoutubePageContext;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelData {
    private String channelName;
    private long subscribeCount;
}
