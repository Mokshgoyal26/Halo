package com.haloai.halo_Ai_backend.Formatter;

import com.haloai.halo_Ai_backend.Model.PageData.GenericPageContext.GenericPageIdentity;
import com.haloai.halo_Ai_backend.Model.PageData.GenericPageContext.GenericPageContext;
import com.haloai.halo_Ai_backend.Model.PageData.GenericPageContext.ImageData;
import com.haloai.halo_Ai_backend.Model.PageData.GenericPageContext.Media;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class GenericPageDataFormatter implements PageDataFormatter<GenericPageContext>{

    @Override
    public String buildPageFormat(GenericPageContext data){
        if(data == null) return "";

        StringBuilder sb = new StringBuilder();

        GenericPageIdentity identity = data.getIdentity();

        // identity section
        if(identity != null){
            sb.append("Page Identity:\n");
            sb.append("URL: ").append(identity.getUrl()).append("\n");
            sb.append("Hostname: ").append(identity.getHostname()).append("\n");
            sb.append("Title: ").append(identity.getTitle()).append("\n");
            sb.append("Description").append(identity.getDescription()).append("\n");
            sb.append("Site Name: ").append(identity.getSiteName()).append("\n");
            sb.append("OG Title: ").append(identity.getOgTitle()).append("\n\n");
        }

        // readable content
        if(data.getReadableData() != null && !data.getReadableData().isEmpty()){
            sb.append("Page Content:\n");
            sb.append(data.getReadableData()).append("\n\n");
        }

        // media
        List<Media> mediaList = data.getMedia();
        if(mediaList != null && !mediaList.isEmpty()){
            sb.append("Media:\n");
            for(Media media : mediaList){
                sb.append("- Source: ").append(media.getSrc()).append("\n");
                sb.append("- Duration: ").append(media.getDuration()).append("\n");
                sb.append("- CurrentTime: ").append(media.getCurrentTime()).append("\n");
                sb.append("- Paused: ").append(media.getPaused()).append("\n");
            }
        }

        // Code Blocks
        List<String> codeBlocks = data.getCodeblock();
        if(codeBlocks != null && !codeBlocks.isEmpty()){
            sb.append("Code Block:\n");
            int cnt = 1;
            for(String code : codeBlocks){
                sb.append(cnt++).append(". ").append(code).append("\n\n");
            }
        }

        // images
        List<ImageData> images = data.getImages();
        if(images != null && !images.isEmpty()){
            sb.append("Images:\n");
            for(ImageData img : images){
                sb.append("- Src: ").append(img.getSrc()).append("\n");
                sb.append("- Alt: ").append(img.getAlt()).append("\n");
            }
        }

        return sb.toString().trim();
    }
}
