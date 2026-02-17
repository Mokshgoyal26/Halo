const getMainContent = () =>{
    const article = document.querySelector('article') ||
                    document.querySelector('main') ||
                    document.body;


    return article.innerText
                    .replace(/\s+/g, ' ')
                    .trim()
                    .slice(0, 8000);

}

const extractVideoData = () =>{
    const videoElement = document.querySelector('video');

    if(!videoElement) return null;

    return {
        src : videoElement.currentSrc || videoElement.src,
        duration : videoElement.duration || null,
        currentTime : videoElement.currentTime || 0,
        paused : videoElement.paused 
    };
}

const youtubePage = () =>{
    return location.hostname.includes('youtube.com') && 
                    location.pathname ==="/watch";
}


const extractYoutubePageData = () =>{
    if(!youtubePage()) return{};

    const video = document.querySelector('video');
    const playerData = window.ytInitialPlayerResponse;
    const initialData = window.ytInitialData;

    const videoDetails = playerData ?.videoDetails || {};

    return {
        identity:{
            videoId : videoDetails.videoId,
            title: videoDetails.title,
            shortDescription: videoDetails.shortDescription,
            keywords: videoDetails.keywords,
            lengthSeconds: videoDetails.lengthSeconds,
            viewCount: videoDetails.viewCount,
            isLiveContent: videoDetails.isLiveContent,
            author: videoDetails.author,
            channelId: videoDetails.channelId
        },

        playBack: video ? {
            duration: video.duration,
            currentTime: video.currentTime,
            paused: video.paused,
            playbackRate: video.playbackRate,
            volume: video.volume
        }: null,

        thumbnails: videoDetails.thumbnail?. thumbnails || [],

        streamingData: playerData ?. streamingData?.formats || [],

        captions: playerData?.captions || null

    };

};


const extractChannelData = () =>{
    const channelName = document.querySelector('#channel-name a')?.innerText;
    const subscriberCount = document.querySelector('#owner-sub-count')?.innerText;

    return {
        channelName,
        subscriberCount
    };
};

const collectData = () =>{

    if(youtubePage()){

        return {

            type:'youtube',
            pageType:'youtube',
            ...extractYoutubePageData(),
            channel:extractChannelData()
        };
    }
    
    return {
        
            type:'generic',
            pageType :'generic',
            identity: {
                url:location.href,
                hostname: location.hostname,
                title: document.title,
                description:document.querySelector('meta[name="description"]')?.content,
                siteName: document.querySelector('meta[property="og:site_name"]')?.content,
                ogTitle: document.querySelector('meta[property="og:title"]')?.content
            },
        
            readableData : getMainContent(),
        
            media : extractVideoData(),
        
            codeBlocks : Array.from(document.querySelectorAll('pre, code'))
                                                        .slice(0, 20)
                                                        .map(c => c.innerText),
        
            images : Array.from(document.querySelectorAll('img'))
                                                        .slice(0, 20)
                                                        .map(img => ({
                                                            src: img.src,
                                                            alt: img.alt
                                                        }))
    };

}

console.log("content script is loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if(msg.type === 'GET_PAGE_CONTEXT'){
        setTimeout(() => sendResponse(collectData()), 0);
        return true; 
    }
});