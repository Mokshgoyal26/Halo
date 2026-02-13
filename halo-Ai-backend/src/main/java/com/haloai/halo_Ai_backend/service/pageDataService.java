package com.haloai.halo_Ai_backend.service;

import com.haloai.halo_Ai_backend.Model.PageData;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class pageDataService {
    public void processPageData(PageData data){
        System.out.println("page data : "+ data);
    }
}
