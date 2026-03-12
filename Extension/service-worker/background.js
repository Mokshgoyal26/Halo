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

                    jwtToken = await refreshAccessTokenFunction();

                    res = await fetch('http://localhost:9090/api/chatMessage', {
                        method: 'POST',
                        headers: { 
                            
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwtToken}` 
                        },
                        body: JSON.stringify(data)
                    });
                }

                const assistantReply = await res.text();
                console.log("assistant reply:", assistantReply);

                sendResponse({
                    type: 'ASSISTANT_REPLY',
                    payload: assistantReply
                });

            } catch(err) {

                console.error("Fetch or backend error:", err);

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

    
});


async function refreshAccessTokenFunction(){

    const {refreshToken} = await chrome.storage.local.get("refreshToken");

    if(!refreshToken){
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
        throw new Error(data.message || "Refresh Token Expired , please login again");
    }

    await chrome.storage.local.set({
        jwtToken : data.accessToken
    });

    console.log("new access token is stored");

    return data.accessToken;

}