package com.haloai.halo_Ai_backend.service;
import com.haloai.halo_Ai_backend.Handler.PageHandler;
import com.haloai.halo_Ai_backend.Handler.PageHandlerRegistry;
import com.haloai.halo_Ai_backend.Model.ChatRequest;
import com.haloai.halo_Ai_backend.Model.PageData.PageContext;
import org.springframework.stereotype.Service;

@Service
public class ChatRequestService {

    private final PageHandlerRegistry handlerRegistry;

    public ChatRequestService(PageHandlerRegistry handlerRegistry){
        this.handlerRegistry = handlerRegistry;
    }

    public String handleRequest(ChatRequest request){
        PageContext context = request.getPageData();

        if(context == null){
            return "No Data is Provided";
        }

        PageHandler handler = handlerRegistry.getPageHandler(context.getPageType());

        return handler.handlePageType(context , request.getUserMessage());
    }
}
