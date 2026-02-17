package com.haloai.halo_Ai_backend.Formatter;

import com.haloai.halo_Ai_backend.Model.PageData.PageContext;

public interface PageDataFormatter<T extends PageContext> {
    String buildPageFormat(T pageData);
}
