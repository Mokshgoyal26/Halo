
let sidebarMounted =  false;

async function mountSidebar(shadow){

    if(sidebarMounted) return;

    const [html,css] = await Promise.all([
        fetch(chrome.runtime.getURL('ui/sidebar-ui/sidebar.html')).then(r => r.text()),
        fetch(chrome.runtime.getURL('ui/sidebar-ui/sidebar.css')).then(r => r.text())
    ]);

    
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    shadow.appendChild(template.content.cloneNode(true));


    // css - resolve relative asset URLs for shadow DOM (inlined CSS resolves relative to page, not extension)
    const baseUrl = chrome.runtime.getURL('assets/');
    const resolvedCss = css.replace(/\.\.\/assets\//g, baseUrl);
    const style = document.createElement('style');
    style.textContent = resolvedCss;
    shadow.appendChild(style);

    sidebarMounted = true;
}

let sidebarE1;

export async function initSidebarUI(shadow){

        await mountSidebar(shadow);
    
        sidebarE1 = shadow.querySelector('.sidebar-extension-container');
        sidebarE1.classList.add('hidden');

        const header = shadow.querySelector('.sidebar-header-container');

        // making border-color changes active while dragging 
        let isDragging = false;

        header.addEventListener('mousedown', () => {
            isDragging = true;
            sidebarE1.classList.add('active');
        });

        document.addEventListener('mouseup', () => {
            if(!isDragging) return;

            isDragging = false;
            sidebarE1.classList.remove('active');
        });

        initDrag(sidebarE1,header);

        const closeBtn = shadow.querySelector('.close-btn');
        closeButtonFeature(sidebarE1, closeBtn);


        const content = shadow.querySelector('.sidebar-content-div');
        const fadeContent = shadow.querySelector('.sidebar-fade-content-div');

        updateFade(content , fadeContent);

        content.addEventListener('scroll',() =>{
            updateFade(content,fadeContent);
        });

        window.addEventListener('resize',() =>{
            updateFade(content,fadeContent);
        });


        // injecting close-btn src
        const closeIcon = shadow.querySelector('.close-btn-icon');
        closeIcon.src = chrome.runtime.getURL("assets/close-button-2.svg");

        // injecting send-btn src 
        const sendIcon = shadow.querySelector('.send-btn-icon');
        sendIcon.src = chrome.runtime.getURL('assets/send-button.svg');

        // injecting upload-btn-src
        const uploadIcon = shadow.querySelector('.upload-btn-icon');
        uploadIcon.src = chrome.runtime.getURL('assets/upload-file-button.svg');

        const container = shadow.querySelector('.suggestions-buttons-div');

        renderSuggestions(container);

        document.addEventListener('selectionchange',() =>{
            renderSuggestions(container);
            requestAnimationFrame(() =>{
                updateFade(content,fadeContent);
            });
        });

        let contentMessages = [];

        const scrollToBottom = () =>{
            const scrollWrapper = shadow.querySelector('.sidebar-scroll-wrapper');

            scrollWrapper.scrollTop = scrollWrapper.scrollHeight;
        }

        const renderUi = () =>{
            const emptyState = shadow.querySelector('.empty-state-container');
            const contentState = shadow.querySelector('.content-state');

            if(contentMessages.length === 0){
                emptyState.style.display = 'flex';
                contentState.style.display = 'none';
            }else{
                emptyState.style.display = 'none';
                contentState.style.display = 'flex';
                renderMessages();
            }
        }

        const userInput = shadow.querySelector('.text-input');
        const sendbtn = shadow.querySelector('.send-btn');

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

            contentMessages.push({
                role:'user',
                text:userMessage
            });

            userInput.value ='';
            userInput.focus();

            renderUi();

            addAssistantMessage();
        }

        const addAssistantMessage = () =>{

            // fake ai response at the moment
            const text = 'i am fine , how about you.'
            contentMessages.push({
                role:'assistant',
                text:'i am fine and what about you?'
            });

            setTimeout(() =>{
                renderUi();
            },2000);
        };


        const renderMessages = () =>{
                const contentState = shadow.querySelector('.content-state');
                contentState.innerHTML = '';

                contentMessages.forEach(msg =>{
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message',msg.role);
                    messageDiv.textContent = msg.text;

                    contentState.appendChild(messageDiv);
                });

                scrollToBottom();
        };
}

    export async function showSidebar(shadow){
        if(!sidebarE1){
            await initSidebarUI(shadow);
        }
        console.log('showsidebar called : ',sidebarE1);
        sidebarE1.classList.remove('hidden');
    }


    export function hideSidebar(){
        console.log('hiddensidebar called : ',sidebarE1);
        sidebarE1.classList.add('hidden');
    }


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



function closeButtonFeature(sidebar,closeBtn){

    closeBtn.addEventListener('click', () =>{
            sidebar.classList.add('hidden');
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




