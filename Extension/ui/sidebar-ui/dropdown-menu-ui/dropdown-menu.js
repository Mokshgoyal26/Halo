
export async function mountDropdownMenuPage(triggerBtn){

    console.log('dropdwon menu page mount function called...');

    const dropdownPage = triggerBtn.querySelector('.dropdown-page-wrapper');

    if(!dropdownPage){

        try{
            const [css , html] = await Promise.all([

                fetch(chrome.runtime.getURL('ui/sidebar-ui/dropdown-menu-ui/dropdown-menu.css')).then(res => res.text()),
                fetch(chrome.runtime.getURL('ui/sidebar-ui/dropdown-menu-ui/dropdown-menu.html')).then(res => res.text())
            ]);
    
    
            const template = document.createElement('template');
            template.innerHTML = html.trim();
            triggerBtn.appendChild(template.content.cloneNode(true));
    
            const baseUrl = chrome.runtime.getURL('/assets');
            const resolvedCss = css.replace(/\.\.\/assets\//g, baseUrl);
            const style = document.createElement('style');
            style.innerText = resolvedCss;
            style.setAttribute('halo-dropdown-menu-page','');
            triggerBtn.appendChild(style);

        }catch(error){
            console.error('failed to mount dropdown-menu-page : ',error);
        }
    }


    
}



export function initDropdownMenuEvents(triggerBtn , onConversationSelect){

    console.log("init dropdown menu function called ....");

    const wrapper = triggerBtn.querySelector('.dropdown-page-wrapper');
    const menuPage = wrapper.querySelector('.dropdown-menu-container');
    const historyPage = wrapper.querySelector('.dropdown-chatHistory-page');
    const chatHistoryBtn = wrapper.querySelector('.menu-items.chat-history');
    const backBtn = wrapper.querySelector('.back-btn');


    window.addEventListener('halo:login', () => {
        logoutBtn.style.display = 'flex';
    });

    chrome.storage.local.get('jwtToken', ({ jwtToken }) => {
        logoutBtn.style.display = jwtToken ? 'flex' : 'none';
    });


    triggerBtn.addEventListener('click',(e) =>{

        e.stopPropagation();
        wrapper.classList.toggle('open');
    });

    document.addEventListener('click' ,(e) =>{
        if(e.composedPath().includes(triggerBtn)) return;
        wrapper.classList.remove('open');

        historyPage.classList.add('hidden');
        menuPage.classList.remove('hidden');
    });


    chatHistoryBtn.addEventListener('click' , async (e) =>{

        e.stopPropagation();
        menuPage.classList.add('hidden');
        historyPage.classList.remove('hidden');

        const chatHistoryList = wrapper.querySelector('.chatHistory-list');

        const {jwtToken} =  chrome.storage.local.get('jwtToken');

        if(!jwtToken){
            showSigninChatHistory(wrapper);
            return;
        }

        await loadChatHistory(chatHistoryList , onConversationSelect , () =>{

            if(typeof onConversationSelect !== 'function'){
                console.error('initDropdownMenuEvents: onConversationSelect callback is missing!');
                return;
            }

            wrapper.classList.remove('open');
            historyPage.classList.add('hidden');
            menuPage.classList.remove('hidden');
        });
    });

    backBtn.addEventListener('click',(e) =>{

        e.stopPropagation();
        historyPage.classList.add('hidden');
        menuPage.classList.remove('hidden');
    });


    const logoutBtn = wrapper.querySelector('.menu-items.logout');

    logoutBtn.addEventListener('click' , () =>{

        chrome.runtime.sendMessage({
            type:'LOGOUT_REQUEST'
        } , (response) =>{

            if(chrome.runtime.lastError){
                console.error('Logout message error:', chrome.runtime.lastError.message);
                return;
            }
        
            if(!response){
                console.error('No response received from background');
                return;
            }

            if(response.type === 'LOGOUT_SUCCESS'){
                logoutBtn.style.display = 'none';

                showSigninChatHistory(wrapper);

                window.dispatchEvent(new CustomEvent('halo:Logout'));
            }
        });
    });
}



function fetchConversations(){

    return new Promise((resolve,reject) => {

        chrome.runtime.sendMessage({type:'GET_CONVERSATIONS'} , (response) =>{

            if(chrome.runtime.lastError) return reject(chrome.runtime.lastError);

            if(response.type === 'CONVERSATIONS_ERROR') return reject(response.payload);

            resolve(response.payload);
            console.log('conversations: ',response.payload);
        });
    });
}


function fetchConversationMessages(conversationId){

    return new Promise((resolve , reject) =>{

        chrome.runtime.sendMessage({type:'GET_CONVERSATION_MESSAGES' , payload:conversationId} ,
        (response) =>{
            
            if(chrome.runtime.lastError) return reject(chrome.runtime.lastError);

            if(response.type === 'MESSAGES_ERROR') return reject(response.payload);

            console.log('raw response from background:', response);
            console.log('payload:', response.payload);

            resolve(response.payload);
        });
    });
}


async function loadChatHistory(chatHistoryList , onConversationSelect , onclose){

    chatHistoryList.innerHTML = '<p class="chat-history-loading"> Loading... </p>';

    try{

        const conversations = await fetchConversations();

        if(!conversations.length){
            chatHistoryList.innerHTML = '<p class="conversations-history-empty">No conversations yet.</p>';
            return;
        }

        chatHistoryList.innerHTML = '';

        conversations.forEach(convo =>{
            const item = document.createElement('div');
            item.classList.add('history-item');

            const text = document.createElement('span');
            text.classList.add('history-item-text');
            text.textContent = convo.title || 'Untitled Conversation';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('history-delete-btn');
            deleteBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                </svg>
            `;

            item.addEventListener('click', async () =>{
                try{
                    const messages = await fetchConversationMessages(convo.conversationId);

                    if(typeof onConversationSelect !== 'function'){
                        console.error('initDropdownMenuEvents: onConversationSelect callback is missing!');
                        return;
                    }

                    onConversationSelect({
                        id:convo.conversationId,
                        messages
                    });

                    onclose();

                }catch(err){
                    console.error('failed to load messages : ',err);
                }
            });

            deleteBtn.addEventListener('click' ,(e) =>{
                e.stopPropagation();
            });

            item.appendChild(text);
            item.appendChild(deleteBtn);

            chatHistoryList.appendChild(item);

        });

    }catch(error){

        chatHistoryList.innerHTML = '<p class="chat-history-eror">Failed to load Conversations. </p>';
        console.log('failed to load chat history: ',error);

    }


}


function showSigninChatHistory(wrapper){

    const chatHistoryList = wrapper.querySelector('.chatHistory-list');

    if(!chatHistoryList) return;

    chatHistoryList.innerHTML = `<div class="history-signin-prompt">
            <div class="history-signin-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" 
                        width="32" height="32">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            </div>
            <div class="history-signin-text">Sign in to see your chats</div>
        </div>`;
}

