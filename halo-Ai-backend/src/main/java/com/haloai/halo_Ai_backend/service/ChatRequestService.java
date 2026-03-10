package com.haloai.halo_Ai_backend.service;
import com.haloai.halo_Ai_backend.Handler.PageHandler;
import com.haloai.halo_Ai_backend.Handler.PageHandlerRegistry;
import com.haloai.halo_Ai_backend.DTO.ChatRequest;
import com.haloai.halo_Ai_backend.DTO.PageData.PageContext;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ChatRequestService {

    private final PageHandlerRegistry handlerRegistry;

    public ChatRequestService(PageHandlerRegistry handlerRegistry){
        this.handlerRegistry = handlerRegistry;
    }

    public Flux<String> handleRequest(ChatRequest request){
        PageContext context = request.getPageData();

        if(context == null){
            return Flux.just("No Data is Provided");
        }

        PageHandler handler = handlerRegistry.getPageHandler(context.getPageType());

        return handler.handlePageType(context , request.getUserMessage())
                .doOnSubscribe(sub -> System.out.println("Stream Started"))
                .doOnNext(token -> System.out.println("Token: "+token))
                .doOnError(err -> {
                    System.out.println("Stream Error : "+ err);
                            err.printStackTrace();
                })
                .doOnComplete(() -> System.out.println("Stream pipeline is complete"));
    }
}
