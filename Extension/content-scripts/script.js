
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

        const sidebar = document.querySelector('.sidebar-extension-container');
        const header = document.querySelector('.sidebar-header-container');

        console.log('sidebar : ',sidebar);
        console.log('header : ',header);

        initDrag(sidebar,header);
        closeButtonFeature(sidebar);

    });


    function initDrag(sidebar,header){
            

        //console.log('sidebar',sidebar);
        //console.log('header',header);

        let is_dragging = false;

        let startMouseX = 0;
        let startMouseY = 0;

        let startSidebarX = 0;
        let startSidebarY = 0;

        let currentX = 0;
        let currentY = 0;

        let rafId = null;

        header.addEventListener('mousedown' , (e) => {
            is_dragging = true;

            startMouseX = e.clientX;
            startMouseY = e.clientY;

            /*const rect = sidebar.getBoundingClientRect();
            startSidebarX = rect.left;
            startSidebarY = rect.top;

            sidebar.style.left = `${startSidebarX}px`;
            sidebar.style.top = `${startSidebarY}px`;
            sidebar.style.right = 'auto';*/

            sidebar.style.willChange = 'transform';
            document.body.style.userSelect = 'none';
        });

        // moving sidebar while dragging 

        document.addEventListener('mousemove',(e) =>{
            if(!is_dragging) return;

            const deltaX = e.clientX - startMouseX;
            const deltaY = e.clientY - startMouseY;

            currentX += deltaX;
            currentY += deltaY;

            // prevent sidebar going out of viewport from the top
            if(currentY < 0) currentY = 0;

            if(!rafId){
                rafId = requestAnimationFrame(updatePosition);
            }

            /*sidebar.style.left = `${startSidebarX + deltaX}px`;
            sidebar.style.top = `${startSidebarY + deltaY}px`;
            sidebar.style.right = 'auto';*/

            startMouseX  = e.clientX;
            startMouseY = e.clientY;


        });

        // stop the moving sidebar 

        document.addEventListener('mouseup', () =>{
                is_dragging = false;

                sidebar.style.willChange = '';
                document.body.style.userSelect = '';

                cancelAnimationFrame(rafId);
                rafId = null;
        });


        function updatePosition(){
            sidebar.style.transform = `translate(${currentX}px , ${currentY}px)`;
            rafId = null;
        }
    }



function closeButtonFeature(sidebar){

    const closeButton = document.querySelector('.close-btn');
    closeButton.addEventListener('click', () =>{
            sidebar.style.display = 'none';
    })
}