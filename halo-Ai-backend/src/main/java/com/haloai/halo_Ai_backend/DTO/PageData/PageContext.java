package com.haloai.halo_Ai_backend.DTO.PageData;


import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.haloai.halo_Ai_backend.DTO.PageData.GenericPageContext.GenericPageContext;
import com.haloai.halo_Ai_backend.DTO.PageData.YoutubePageContext.YoutubePageContext;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = GenericPageContext.class, name = "generic"),
        @JsonSubTypes.Type(value = YoutubePageContext.class, name = "youtube")})
public interface PageContext {
    String getPageType();
}
