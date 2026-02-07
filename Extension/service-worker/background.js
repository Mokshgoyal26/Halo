
chrome.runtime.onMessage.addListener((message,sender,response) =>{
    if(message.type === 'Page_Context'){
        console.log('Recieved data from the page : ',message.payload);
    }
});
