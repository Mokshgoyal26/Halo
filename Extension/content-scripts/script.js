
function extractYoutubeData(){
    const title = document.querySelector('h1')?.innerText;
    const channel = document.querySelector('ytd-channel-name')?.innerText;

    return {videoTitle : title , channel};
}

//console.log(extractYoutubeExtras());

/*function waitForYoutubeData(){
            const observer = new MutationObserver(() =>{
                const data = extractYoutubeExtras();
                if(data.videoTitle && data.channel){
                    console.log('youtube data: ',data);
                    observer.disconnect();
                }
            
            });
    
            observer.observe(document.body,{
                childList:true,
                subtree:true
            });    
}

waitForYoutubeData();*/

function pageInferType(){
    if(document.querySelector('video')) return 'video';
    if(document.querySelector('article')) return 'article';
    if(location.hostname.includes('youtube')) return 'video';

    return 'generic';
}

//const rawText = document.body.innerText;

//const content = rawText.split()

function collectGenericText(){
    const rawText = document.body.innerText ||'';
            
    return rawText.replace(/\s+/g, ' ')
            .trim()
            .slice(0,3000);
}

const collectText = () =>{
    const metadata = {
        url:location.href,
        hostname:location.hostname,
        title:document.title,
        page:pageInferType(),
        content:collectGenericText(),
        youtube:null
    };
    
    if(metadata.hostname.includes('youtube')){
        const observer = new MutationObserver(() =>{
            const data = extractYoutubeData();

            if(data.videoTitle && data.channel){
                metadata.youtube = data;
                console.log('youtube-data: ',data);
                observer.disconnect();
            }
        });

        observer.observe(document.body,{childList:true ,subtree:true});

    }

    return metadata;
}
            

const dataCollected = collectText;
console.log('page data : ',dataCollected);

// sending our page context to the background file
chrome.runtime.sendMessage({
    type:'Page_Context_Ready',
    payload:collectText
})


// inject html , css into webpages 
fetch(chrome.runtime.getURL('content-scripts/sidebar.html'))
    .then(res => res.text())
    .then(html => {
        console.log('html fetched', html);
        const wrapper = document.createElement('template');
        wrapper.innerHTML = html.trim();

        document.body.appendChild(wrapper.content.firstChild);

        // inject css
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL('content-scripts/sidebar.css');
        document.head.appendChild(link);

        /*const sidebarLogo = document.querySelector('.logo');
        sidebarLogo.style.backgroundImage = `url(${chrome.runtime.getURL('assets/sidebar-logo(2).png')})`;*/

        /*const sidebarLogo = document.querySelector('.logo');

        sidebarLogo.style.setProperty(
            'background-image',
            `url(${chrome.runtime.getURL('assets/logo.png')})`,
            'important'
        );

        sidebarLogo.style.setProperty('background-color', 'red');*/

    });