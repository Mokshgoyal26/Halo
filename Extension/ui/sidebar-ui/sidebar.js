import { getSignUpPage  } from "../sign-up-page-ui/signUp.js";


let sidebarMounted =  false;
let contentMessages = [];
let shadowRootRef = null;
let userInput;


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

        console.log('initSIdebarUi is called.....')
        await mountSidebar(shadow);

        shadowRootRef = shadow;
    
        sidebarE1 = shadow.querySelector('.sidebar-extension-container');
        sidebarE1.classList.add('hidden');

        blockPageShortcuts(sidebarE1);

        const openSignUpPageBtn = shadow.querySelector('.open-signup-page');

        openSignUpPageBtn.addEventListener('click', async () => {
            await getSignUpPage(shadow);
        });

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


        userInput = shadow.querySelector('.text-input');
        const sendbtn = shadow.querySelector('.send-btn');


        sendbtn.addEventListener('click',() =>{
            handleSend();
        });

        userInput.addEventListener('keydown',(e) =>{
                e.stopPropagation();

                if(e.key === 'Enter' && !e.shiftKey){
                    e.preventDefault();
                    handleSend();    
                }
        });


        await MountUsernameOnEmptyStateTitle(shadow);
        
}


    const handleSend = () =>{

        const userMessage = userInput.value.trim();

        if(!userMessage) return;

        contentMessages.push({
            role:'USER_MESSAGE',
            text:userMessage
        });

        userInput.value ='';
        userInput.focus();

        renderUi();

        /* this is for showing loading until ai response gets*/
        const placeholderId = Date.now();
        contentMessages.push({
            role:'ASSISTANT_LOADING',
            id: placeholderId
        });

        renderUi();

        sendChatRequest(userMessage)
                    .then(response =>{
                        console.log('assistant reply received : ',response);
                        addAssistantMessage(response.payload , placeholderId);
                    })
                    .catch(err =>{
                        console.log('Error sending chat request: ',err);
                    });

    };

    function sendChatRequest(userMessage){
        return new Promise((resolve , reject) =>{

            // ask collectContext content-script for pageContext
            chrome.runtime.sendMessage({type:'GET_PAGE_CONTEXT'}, (pageData) =>{
                console.log("Sending GET_PAGE_CONTEXT...");
                if(chrome.runtime.lastError){
                    console.log("GET_PAGE_CONTEXT error:", chrome.runtime.lastError);
                    return reject(chrome.runtime.lastError);
                }

                console.log("PageData received:", pageData);

                // combining userMessage and pageContext as payload
                const payload = {
                    userMessage,
                    pageData
                };

                console.log("Sending CHAT_REQUEST with payload:", payload);

                // sending payload to background eventually move to the backend 
                chrome.runtime.sendMessage({
                    type:'CHAT_REQUEST',
                    payload
                }, (response) =>{
                    if(chrome.runtime.lastError){
                        console.log("CHAT_REQUEST error:", chrome.runtime.lastError);
                        return reject(chrome.runtime.lastError);
                    }

                    if(response.type === 'ASSISTANT_ERROR'){
                        return reject(response.payload);
                    }

                    console.log("CHAT_REQUEST response:", response);
                    resolve(response);
                });
            });
        });
    };

    const scrollToBottom = () =>{
        const scrollWrapper = shadowRootRef.querySelector('.sidebar-scroll-wrapper');

        if(scrollWrapper){
            setTimeout(() => {
                scrollWrapper.scrollTop = scrollWrapper.scrollHeight;
            }, 10);

        }
    }


    const renderUi = () =>{
        const emptyState = shadowRootRef.querySelector('.empty-state-container');
        const contentState = shadowRootRef.querySelector('.content-state');

        if(contentMessages.length === 0){
            emptyState.style.display = 'flex';
            contentState.style.display = 'none';
        }else{
            emptyState.style.display = 'none';
            contentState.style.display = 'flex';
            renderMessages();
        }
    }

    const addAssistantMessage = (response , placeholderId) =>{

        const index = contentMessages.findIndex(msg => msg.id === placeholderId);

        if(index !== -1){
            contentMessages[index] = {
                role:'ASSISTANT_MESSAGE',
                text: response
            };

        }else{
            contentMessages.push({
                role:'ASSISTANT_MESSAGE',
                text: response
            });
        }
        
        renderUi();
    };


    const renderMessages = () =>{
            const contentState = shadowRootRef.querySelector('.content-state');
            contentState.innerHTML = '';

            contentMessages.forEach(msg =>{
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message',msg.role);

                if(msg.role === 'USER_MESSAGE'){
                    messageDiv.classList.add('message',msg.role);
                    messageDiv.textContent = msg.text;
                }else if(msg.role === 'ASSISTANT_LOADING'){
                    messageDiv.classList.add('message',msg.role);
                    messageDiv.innerHTML = `
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    `;
                }else if(msg.role === 'ASSISTANT_MESSAGE'){
                    messageDiv.classList.add('message',msg.role);
                    messageDiv.innerHTML = parseMarkdown(msg.text);
                }

                //messageDiv.textContent = msg.text;

                contentState.appendChild(messageDiv);
            });

            requestAnimationFrame(scrollToBottom);
    };

    export async function showSidebar(){
        /*if(!sidebarE1){
            await initSidebarUI(shadowRootRef);
        }*/
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

            btn.addEventListener('click', () =>{
                userInput.value = label;
                handleSend();
            });

            if(cap.id === 'selection' && !context.hasSelection){
                btn.disabled = true;
            }

            container.appendChild(btn);
        });
}


const blockPageShortcuts = (root) =>{
    const events = [
        "keydown",
        "keypress",
        "keyup"
    ];

    events.forEach(type =>{
        root.addEventListener(type, (e) =>{

            e.stopPropagation();

        });
    });
}


function parseMarkdown(text) {
    return text
        // code blocks
        .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        // inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // headings
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        // unordered lists
        .replace(/^\s*[-*] (.+)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        // ordered lists
        .replace(/^\d+\. (.+)/gm, '<li>$1</li>')
        // line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        // wrap in paragraph
        .replace(/^(?!<[a-z])/gm, '')
}


async function MountUsernameOnEmptyStateTitle(shadow){

    console.log('mount username called....');

    const result = await chrome.storage.local.get('username');
    console.log('chrome storage result : ',result);
    console.log('username : ',result.username);

    const titleElement = shadow.querySelector('.empty-state-title');

        if(titleElement && result.username){

            titleElement.textContent = `Hi ${result.username} 👋`;
        }

    window.addEventListener('halo:login' ,(e) =>{

        const titleElement = shadow.querySelector('.empty-state-title'); 

        if(titleElement && e.detail.username){
            titleElement.textContent = `Hi ${e.detail.username} 👋`;
        }

    });


}



