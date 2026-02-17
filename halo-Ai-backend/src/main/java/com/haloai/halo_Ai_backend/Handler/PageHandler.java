package com.haloai.halo_Ai_backend.Handler;

import com.haloai.halo_Ai_backend.Model.PageData.PageContext;

public interface PageHandler {

    String getPageType();
    String handlePageType(PageContext context , String userMessage);
}
