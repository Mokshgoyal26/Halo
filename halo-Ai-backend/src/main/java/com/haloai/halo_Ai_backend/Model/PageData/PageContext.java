package com.haloai.halo_Ai_backend.Model.PageData;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.haloai.halo_Ai_backend.Model.PageData.GenericPageContext.GenericPageContext;
import com.haloai.halo_Ai_backend.Model.PageData.YoutubePageContext.YoutubePageContext;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "pageType"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = YoutubePageContext.class, name = "youtube"),
        @JsonSubTypes.Type(value = GenericPageContext.class, name = "generic")
})
public interface PageContext {
    String getPageType();
}
