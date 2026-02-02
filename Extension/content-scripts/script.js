
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
            

const dataCollected = collectText();
console.log('page data : ',dataCollected);

// sending our page context to the background file
chrome.runtime.sendMessage({
    type:'Page_Context_Ready',
    payload:dataCollected
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


        const content = document.querySelector('.sidebar-content-div');
        const fadeContent = document.querySelector('.sidebar-fade-content-div');

        updateFade(content , fadeContent);

        content.addEventListener('scroll',() =>{
            updateFade(content,fadeContent);
        });

        window.addEventListener('resize',() =>{
            updateFade(content,fadeContent);
        });


        // injecting close-btn src
        const closeIcon = document.querySelector('.btn-icon');
        closeIcon.src = chrome.runtime.getURL("assets/close-button-2.svg");


        const container = document.querySelector('.suggestions-buttons-div');

        renderSuggestions(container);

        document.addEventListener('selectionchange',() =>{
            renderSuggestions(container);
            requestAnimationFrame(() =>{
                updateFade(content,fadeContent);
            })
        });

        let contentMessages = [];

        function render(){
            if(contentMessages.length === 0){
                renderEmptyState();
            }else{
                renderContent();
            }
        }


        const userInput = document.querySelector('.text-input');
        const sendbtn = document.querySelector('.send-btn');

        sendbtn.addEventListener('click',() =>{
            handleSend();
        });

        userInput.addEventListener('keydown',(e) =>{
                if(e.key === 'Enter' && !e.shiftKey){
                    e.preventDefault();
                    handleSend();    
                }
        })


        const handleSend = () =>{
            const userMessage = userInput.value.trim();

            if(!userMessage) return;

            renderMessage('user',userMessage);

            contentMessages.push({
                'user': userMessage
            });


            contentMessages.forEach(message =>{
                console.log(message);
            });


            userInput.value ='';
            userInput.focus();

            addAssistantMessage();
        }

        const addAssistantMessage = () =>{

            // fake ai response at the moment
            const text = 'i am fine , how about you.'
            contentMessages.push({
                'assistant': text
            });

            setTimeout(() =>{
                renderMessage('assistant',text);
            });
        }


        const renderMessage = (role , userMessage) =>{
                const message = document.createElement('div');

                message.classList.add('message',role);

                message.textContent = userMessage;

                document.querySelector('.content-state').appendChild(message);
        }

        

    });


    function initDrag(sidebar,header){
            

        //console.log('sidebar',sidebar);
        //console.log('header',header);

        let is_dragging = false;

        let startMouseX = 0;
        let startMouseY = 0;

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


function updateFade(content , fadeContent){

    const canScroll = content.scrollHeight > content.clientHeight;

    const isBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;

    fadeContent.style.opacity = (canScroll && !isBottom) ? 1 : 0;
}

const CAPABILITIES =  [
    {id:'selection',label:'explain selected text'},
    {id:'video-summarizer',label:'summarize video'},
    {id:'web-page',label:'explain this webpage'},
    {id:'general',label:'Ask anything'}
];


const isYoutubePage = () =>{
    return location.hostname.includes('youtube.com') && location.pathname.includes('/watch');
};

const hasContextSelection = () =>{
        const selection = window.getSelection();
        return selection && selection.toString().trim().length > 0;
};

const contextResolver = (cap,context) =>{

    if(cap.id === 'selection'){
        
        return context.hasSelection ? 'explain selected text' : null;
    }

    if(cap.id === 'video-summarizer'){
        return context.hasYoutubePage ? 'summarize video' : 'Boost my day';
    }

    if(cap.id === 'web-page'){
        return 'explain this webpage';
    }

    return null;
}

const getContext = () =>{
    return{
        hasYoutubePage : isYoutubePage(),
        hasSelection : hasContextSelection()
    };
}


function renderSuggestions(container){
        if(!container) return;

        container.innerHTML = '';
        const context = getContext();
        
        CAPABILITIES.forEach(cap =>{
            const label = contextResolver(cap,context);

            if(!label) return;

            const btn = document.createElement('button');
            btn.className = 'suggestion-btn';
            btn.textContent = label;

            if(cap.id === 'selection' && !context.hasSelection){
                btn.disabled = 'true';
            }

            container.appendChild(btn);


        });
}


  




