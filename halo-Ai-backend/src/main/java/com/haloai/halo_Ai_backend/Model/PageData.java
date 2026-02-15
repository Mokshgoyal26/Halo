package com.haloai.halo_Ai_backend.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageData {
    private String hostname;
    private String url;
    private String title;
    private String pageType;
    private String content;
    private YoutubeData youtube;
}
