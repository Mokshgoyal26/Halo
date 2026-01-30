chrome.runtime.onMessage.addListener((message,sender,response) =>{
    if(message.type === 'Page_Context_Ready'){
        console.log('Recieved data from the page : ',message.payload);
    }
});

console.log('hello');