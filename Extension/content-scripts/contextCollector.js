function extractYoutubeData(){
    const title = document.querySelector('h1')?.innerText;
    const channel = document.querySelector('ytd-channel-name')?.innerText;

    return {videoTitle :title , channel};
}


function pageInferType(){
    if(document.querySelector('video')) return 'video';
    if(document.querySelector('article')) return 'article';
    if(location.hostname.includes('youtube')) return 'youtube';

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


setupYoutubeListener((data) =>{
    chrome.runtime.sendMessage({
        type:'Page_Context',
        payload: data
    });
});