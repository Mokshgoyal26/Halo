package com.haloai.halo_Ai_backend.Model.PageData.YoutubePageContext;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class YoutubePageIdentity {
    private String videoId;
    private String title;
    private String shortDescription;
    private String keywords;
    private int lengthSeconds;
    private long viewCounts;
    private boolean isLiveContent;
    private String author;
    private String channelId;
}
