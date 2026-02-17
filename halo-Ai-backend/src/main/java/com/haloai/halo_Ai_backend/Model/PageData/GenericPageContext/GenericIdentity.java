package com.haloai.halo_Ai_backend.Model.PageData.GenericPageContext;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenericIdentity {
    private String url;
    private String hostname;
    private String  title;
    private String description;
    private String siteName;
    private String ogTitle;
}
