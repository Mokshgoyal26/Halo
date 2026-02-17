package com.haloai.halo_Ai_backend.Formatter;

import com.haloai.halo_Ai_backend.Model.PageData.YoutubePageContext.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class YoutubePageDataFormatter implements PageDataFormatter<YoutubePageContext>{
    @Override
    public String buildPageFormat(YoutubePageContext data){
        if(data == null) return "";

        StringBuilder sb = new StringBuilder();

        YoutubePageIdentity identity = data.getIdentity();

        // video identity
        if(identity != null){
            sb.append("Video Information:\n");
            sb.append("Title: ").append(identity.getTitle()).append("\n");
            sb.append("Author: ").append(identity.getAuthor()).append("\n");
            sb.append("VideoId: ").append(identity.getVideoId()).append("\n");
            sb.append("ChannelId: ").append(identity.getChannelId()).append("\n");
            sb.append("Length(seconds): ").append(identity.getLengthSeconds()).append("\n");
            sb.append("View Count: ").append(identity.getViewCounts()).append("\n");
            sb.append("Live Content: ").append(identity.isLiveContent()).append("\n");
            sb.append("Key Words: ").append(identity.getKeywords()).append("\n");
            sb.append("Description: ").append(identity.getShortDescription()).append("\n");
        }

        // Channel Info
        ChannelData channelData = data.getChannelData();
        if(channelData != null){
            sb.append("Channel Information:\n");
            sb.append("Channel Name: ").append(channelData.getChannelName()).append("\n");
            sb.append("Subsriber Count: ").append(channelData.getSubscribeCount()).append("\n\n");
        }

        // Playback Details
        PlayBackDetails playback = data.getPlayback();
        if(playback != null){
            sb.append("PlayBack State:\n");
            sb.append("Duration: ").append(playback.getDuration()).append("\n");
            sb.append("CurrentTime: ").append(playback.getCurrentTime()).append("\n");
            sb.append("Paused: ").append(playback.isPaused()).append("\n");
            sb.append("PlayBack Rate: ").append(playback.getPlaybackRate()).append("\n");
            sb.append("Volume: ").append(playback.getVolume()).append("\n\n");
        }

        // Thumbnails

        List<ThumbnailsData> thumbs = data.getThumbnails();
        if(thumbs != null && !thumbs.isEmpty()){
            sb.append("Thumbnails:\n");
            for(ThumbnailsData thumbnail : thumbs){
                sb.append("URL: ").append(thumbnail.getUrl()).append("\n");
                sb.append("height: ").append(thumbnail.getHeight()).append("\n");
                sb.append("Width: ").append(thumbnail.getWidth()).append("\n\n");
            }
        }


        // captions
        List<CaptionsData> captions = data.getCaptions();
        if(captions != null && !captions.isEmpty()){
            sb.append("Captions:\n");
            for(CaptionsData caps : captions){
                sb.append("Language Code: ").append(caps.getLanguageCode()).append("\n");
                sb.append("Base URL: ").append(caps.getBaseUrl()).append("\n");
                sb.append("Name: ").append(caps.getName()).append("\n\n");
            }
        }

        return sb.toString().trim();
    }
}
