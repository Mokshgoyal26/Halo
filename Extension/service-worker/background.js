chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message in background:", message);

    if(message.type === 'GET_PAGE_CONTEXT'){
        // Forward to content script in the active tab
        chrome.tabs.sendMessage(sender.tab.id, { type: 'GET_PAGE_CONTEXT' }, sendResponse);
        return true;  // important! keeps the port open for async response
    }

    if(message.type === 'CHAT_REQUEST'){
        (async () => {
            try {
                const data = message.payload;
                console.log("prompt:", data);

                const res = await fetch('http://localhost:9090/api/summary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
});
