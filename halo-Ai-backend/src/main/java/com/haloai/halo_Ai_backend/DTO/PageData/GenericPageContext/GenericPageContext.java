package com.haloai.halo_Ai_backend.DTO.PageData.GenericPageContext;

import com.haloai.halo_Ai_backend.DTO.PageData.PageContext;
import lombok.Data;

import java.util.List;

@Data
public class GenericPageContext implements PageContext {

    private String pageType;
    private GenericPageIdentity identity;
    private String readableData;
    private List<Media> media;
    private List<String> codeblock;
    private List<ImageData> images;


    @Override
    public String getPageType(){
        return pageType;
    }
}
