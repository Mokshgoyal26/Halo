package com.haloai.halo_Ai_backend.Model.PageData.YoutubePageContext;

import com.haloai.halo_Ai_backend.Model.PageData.PageContext;
import lombok.Data;

import java.util.List;

@Data
public class YoutubePageContext implements PageContext {

    private String pageType;
    private YoutubeIdentity identity;
    private PlayBackDetails playback;
    private List<ThumbnailsData> thumbnails;
    private List<CaptionsData> captions;
    private List<StreamingFormat> streamingData;
    private ChannelData channelData;

    @Override
    public String getPageType(){
        return pageType;
    }
}
