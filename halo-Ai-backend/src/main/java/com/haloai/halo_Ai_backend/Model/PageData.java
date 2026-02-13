package com.haloai.halo_Ai_backend.Model;

import lombok.Data;

@Data
public class PageData {
    private String hostname;
    private String url;
    private String title;
    private String pageType;
    private String content;
    private YoutubeData youtube;
}
