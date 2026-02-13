
chrome.runtime.onMessage.addListener((message,sender,response) =>{
    if(message.type === 'Page_Context'){
        const data = message.payload;

        fetch('http://localhost:9090/api/pageData',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },

            body:JSON.stringify(data)

        }).then(res => res.text())
        .then(result => console.log('Backend Response:',result))
        .catch(err => console.error("error sending data ",err));
    }
});
