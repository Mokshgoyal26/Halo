let isChatRequestInFlight = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message in background:", message);

    if(message.type === 'GET_PAGE_CONTEXT'){
        // Forward to content script in the active tab
        chrome.tabs.sendMessage(sender.tab.id, { type: 'GET_PAGE_CONTEXT' }, (tabResponse) =>{
            sendResponse(tabResponse);            
        });
        return true;  
    }

    if(message.type === 'CHAT_REQUEST'){
        (async () => {
            try {

                if(isChatRequestInFlight){
                    sendResponse({type:'ASSISTANT_ERROR', locked: true});
                    return;
                }

                isChatRequestInFlight = true;

                const data = message.payload;
                console.log("prompt:", data);

                let {jwtToken} = await chrome.storage.local.get("jwtToken");

                let res = await fetch('http://localhost:9090/api/chatMessage', {
                    method: 'POST',
                    headers: { 
                        
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}` 
                    },
                    body: JSON.stringify(data)
                });


                if(res.status === 401){
                    console.log("Access Token is expired , refreshing....");

                    jwtToken = await refreshAccessTokenFunction(sender.tab.id);

                    res = await fetch('http://localhost:9090/api/chatMessage', {
                        method: 'POST',
                        headers: { 
                            
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwtToken}` 
                        },
                        body: JSON.stringify(data)
                    });
                }

                console.log("sender : ",sender);
                console.log("senderTab : ",sender.tab);

                const reader = res.body.getReader();
                const decoder = new TextDecoder();

                while(true){
                    const {done , value} = await reader.read();

                    if(done){

                        isChatRequestInFlight = false;

                        chrome.tabs.sendMessage(sender.tab.id,{
                            type:'ASSISTANT_STREAM_END'
                        });

                        break;
                    }

                    const chunk = decoder.decode(value , {stream:true});

                    chrome.tabs.sendMessage(sender.tab.id ,{
                        type:'ASSISTANT_STREAM_CHUNK',
                        payload : chunk
                    });
                }

                /*const assistantReply = await res.text();
                console.log("assistant reply:", assistantReply);

                sendResponse({
                    type: 'ASSISTANT_REPLY',
                    payload: assistantReply
                });*/

            } catch(err) {

                console.error("Fetch or backend error:", err);

                isChatRequestInFlight = false;
                sendResponse({
                    type: 'ASSISTANT_ERROR',
                    payload: "Network Error or Backend Error : " + err.message
                });
            }
        })();

        return true; 
    }

    if(message.type === 'SIGN_UP_REQUEST'){
        (async () =>{
            try{
                const data = message.payload;
                console.log('signup credentials : ', data);

                let res = await fetch('http://localhost:9090/auth/signup',{
                    method:'POST',
                    headers:{'Content-Type' : 'application/json'},
                    body: JSON.stringify(data)
                });

                const result = await res.json();

                if(!res.ok){
                    sendResponse({
                        type:'SIGN_UP_ERROR',
                        payload:result
                    });

                    return;
                }
                
                sendResponse({
                    type: 'SIGN_UP_RESULT',
                    payload: result
                });


            }catch(err){

                sendResponse({
                    type:'SIGN_UP_ERROR',
                    payload:"Network Error : " + err.message
                });

            }

        })();

        return true;
    }


    if(message.type === 'LOGIN_REQUEST'){
        (async() =>{

            try {
                const data = message.payload;
                console.log("login_credentials: ", data);

                let res = await fetch('http://localhost:9090/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const login_reply = await res.json();
                console.log("login reply: ", login_reply);

                if(!res.ok){
                    sendResponse({
                        type: 'LOGIN_ERROR',
                        payload: login_reply
                    });

                    return;
                }


                if(login_reply.accessToken && login_reply.refreshToken){

                    chrome.storage.local.set({

                        jwtToken : login_reply.accessToken,
                        refreshToken : login_reply.refreshToken,
                        username : login_reply.username

                    } , () =>{
                        console.log('token is saved to chrome storage');
                            chrome.storage.local.get(null, (all) => {
                                console.log('everything in storage:', all);
                            });
                    });
                }

                sendResponse({
                    type: 'LOGIN_REPLY',
                    payload: login_reply
                });

            } catch(err) {

                sendResponse({
                    type: 'LOGIN_ERROR',
                    payload: "Network Error: "+ err.message
                });
            }
        })();

        return true; 
    }


    if(message.type === 'LOGOUT_REQUEST'){

        (async() =>{
            try{

                const {refreshToken} = await chrome.storage.local.get('refreshToken');

                await fetch("http://localhost:9090/auth/logout",{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({refreshToken}) 
                });


                await chrome.storage.local.remove([
                    'jwtToken',
                    'refreshToken',
                    'conversationId',
                    'username'
                ]);

                console.log('Logged out storgae cleared');

                sendResponse({
                    type:'LOGOUT_SUCCESS',
                });

            } catch(err) {
                
                await chrome.storage.local.remove([
                    'jwtToken',
                    'refreshToken',
                    'username', 
                    'conversationId'
                ]);
    
                sendResponse({ type: 'LOGOUT_SUCCESS' });
            }
            
        })();


        return true;
    }


    if(message.type === 'GET_CONVERSATIONS'){
        (async() =>{
            try{

                let {jwtToken} = await chrome.storage.local.get('jwtToken');
                
                let res = await fetch('http://localhost:9090/api/conversations',{

                                method:'GET',
                                headers: {'Authorization': `Bearer ${jwtToken}`},
                            });
                
                if(res.status === 401){

                    console.log('jwt access token expired , refreshing token....');
                    jwtToken = await refreshAccessTokenFunction(sender.tab.id);
                    
                    res = await fetch('http://localhost:9090/api/conversations',{

                                    method:'GET',
                                    headers: {'Authorization': `Bearer ${jwtToken}`},
                                });
                    
                }

                const data = await res.json();
                console.log('conversations : ',data);

                sendResponse({
                    type:'CONVERSATIONS_SUCCESS',
                    payload:data
                });

            }catch(error){

                sendResponse({
                    type:'CONVERSATIONS_ERROR',
                    payload: error.message
                });
            }

        })();

        return true;
    }

    
    if(message.type === 'GET_CONVERSATION_MESSAGES'){

        (async() =>{

            try{

                let {jwtToken} = await chrome.storage.local.get('jwtToken');
                const conversationId = message.payload;

                let res = await fetch(`http://localhost:9090/api/conversations/${conversationId}/messages`,{

                    method:'GET',
                    headers: {'Authorization':`Bearer ${jwtToken}`}
                });


                if(res.status === 401){

                    jwtToken = await refreshAccessTokenFunction(sender.tab.id);
                    console.log('access token expired , refreshing accessToken....');

                    res = await fetch(`http://localhost:9090/api/conversations/${conversationId}/messages`,{
                            method:'GET',
                            headers: {'Authorization':`Bearer ${jwtToken}`}
                        });
                }

                const data = await res.json();

                sendResponse({
                    type:'MESSAGES_SUCCESS',
                    payload:data
                });
            }catch(err){

                sendResponse({
                    type:'MESSAGES_ERROR',
                    payload: err.message
                });
            }

        })();

        return true;
    }

    
});


async function refreshAccessTokenFunction(tabId){

    const {refreshToken} = await chrome.storage.local.get("refreshToken");

    if(!refreshToken){
        await handleRefreshTokenExpired(tabId);
        throw new Error("No refresh token available");
    }

    let res = await fetch("http://localhost:9090/auth/refresh",{
        
        method : "POST",
        headers : {
            "Content-Type":"application/json" 
        },

        body:JSON.stringify({refreshToken : refreshToken})
    });

    

    const data = await res.json();

    if(!res.ok){
        await handleRefreshTokenExpired(tabId);
        throw new Error(data.message || "Refresh Token Expired , please login again");
    }

    await chrome.storage.local.set({
        jwtToken : data.accessToken
    });

    console.log("new access token is stored");

    return data.accessToken;

}


async function handleRefreshTokenExpired(tabId){
    await chrome.storage.local.remove([
        'jwtToken',
        'refreshToken',
        'conversationId',
        'username'
    ]);


    chrome.tabs.sendMessage(tabId,{
        type:'REFRESH_TOKEN_EXPIRED'
    });
}