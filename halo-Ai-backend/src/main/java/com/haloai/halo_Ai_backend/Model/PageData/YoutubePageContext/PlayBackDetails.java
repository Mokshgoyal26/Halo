package com.haloai.halo_Ai_backend.Model.PageData.YoutubePageContext;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayBackDetails {
    private long duration;
    private double currentTime;
    private boolean paused;
    private double playbackRate;
    private double volume;
}
