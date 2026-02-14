function extractYoutubeData(){
    const title = document.querySelector('h1')?.innerText;
    const channel = document.querySelector('ytd-channel-name')?.innerText;

    return {videoTitle :title , channel};
}


function pageInferType(){
    if(location.hostname.includes('youtube')) return 'youtube';
    if(document.querySelector('video')) return 'video';
    if(document.querySelector('article')) return 'article';
    

    return 'generic';
}

function collectGenericText(){
    const rawText = document.body.innerText || '';

    return rawText.replace(/\s+/g, ' ')
        .trim()
        .slice(0,3000);
}

const collectData = () =>{
    return{
        hostname : location.hostname,
        url : location.href,
        title : document.title,
        pageType : pageInferType(),
        content : collectGenericText(),
        youtube : null
    };
}

function setupYoutubeListener(sendData){
    if(location.hostname.includes('youtube.com') && location.pathname ==='/watch'){
        const sendYoutubeData = () =>{
            const metaData = collectData();
            metaData.youtube = extractYoutubeData();
            sendData(metaData);
        };

        sendYoutubeData();

        window.addEventListener('yt-navigate-finish',sendYoutubeData);
    }
}


/*const sendData = (data) =>{
    chrome.runtime.sendMessage({
        type:'Page_Context',
        payload: data
    });
};*/


/*const data = collectData();

if(data.pageType === 'youtube'){
    setupYoutubeListener(sendData);
}else{
    sendData(data);
}*/


console.log("content script is loaded");


// sending pageContext to the sidebar.js to chatRequest method 
chrome.runtime.onMessage.addListener((msg , sender , sendResponse) =>{
    if(msg.type === 'GET_PAGE_CONTEXT'){
        console.log("content script received get_page_context");
        sendResponse(collectData());
    };
});

