chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message in background:", message);

    if(message.type === 'GET_PAGE_CONTEXT'){
        // Forward to content script in the active tab
        chrome.tabs.sendMessage(sender.tab.id, { type: 'GET_PAGE_CONTEXT' }, (tabResponse) =>{
            sendResponse(tabResponse);            
        });
        return true;  // important! keeps the port open for async response
    }

    if(message.type === 'CHAT_REQUEST'){
        (async () => {
            try {
                const data = message.payload;
                console.log("prompt:", data);

                const {jwtToken} = await chrome.storage.local.get("jwtToken");

                const res = await fetch('http://localhost:9090/api/chatMessage', {
                    method: 'POST',
                    headers: { 
                        
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}` 
                    },
                    body: JSON.stringify(data)
                });

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
                    payload: err.message
                });
            }
        })();

        return true; // keeps message port open for async response
    }

    if(message.type === 'SIGN_UP_REQUEST'){
        (async () =>{
            try{
                const data = message.payload;
                console.log('signup credentials : ', data);

                const res = await fetch('http://localhost:9090/auth/signup',{
                    method:'POST',
                    headers:{'Content-Type' : 'application/json'},
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                
                sendResponse({
                    type: 'SIGN_UP_RESULT',
                    payload: result
                });
            }catch(err){

                sendResponse({
                    type:'SIGN_UP_ERROR',
                    payload:err.message
                })

            }
        })();

        return true;
    }


    if(message.type === 'LOGIN_REQUEST'){
        (async() =>{

            try {
                const data = message.payload;
                console.log("login_credentials: ", data);

                const res = await fetch('http://localhost:9090/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const login_reply = await res.json();
                console.log("login reply: ", login_reply);

                if(login_reply.token){
                    chrome.storage.local.set({jwtToken : login_reply.token} , () =>{
                        console.log('toke is saved to chrome storage');
                    });
                }

                sendResponse({
                    type: 'LOGIN_REPLY',
                    payload: login_reply
                });

            } catch(err) {
                console.error("Fetch or backend error:", err);
                sendResponse({
                    type: 'LOGIN_ERROR',
                    payload: err.message
                });
            }
        })();

        return true; 
    }

    
});
