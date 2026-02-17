package com.haloai.halo_Ai_backend.Model.PageData.GenericPageContext;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Media {
    private String src;
    private double duration;
    private double currentTime;
    private Boolean paused;
}
