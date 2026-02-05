export const getFloatingBtn = async (shadow) =>{

    await mountFloatingBtn(shadow);

    let floatingBtn = shadow.querySelector('.open-sidebar-btn');
    return floatingBtn;
};


// injecting floating.css or attaching it to the shadow dom
async function mountFloatingBtn(shadow){
    
    if (shadow.querySelector('style[data-halo-floating]')) return;
    const [cssText,html] = await Promise.all([
        fetch(
        chrome.runtime.getURL('../ui/floating-button-ui/floating-button.css')
    ).then(r => r.text()),

    fetch(chrome.runtime.getURL('../ui/floating-button-ui/floating-button.html')).then(
        res => res.text())
    ]);

    const template = document.createElement('template');
    template.innerHTML = html.trim();
    shadow.appendChild(template.content.cloneNode(true));


    const baseUrl = chrome.runtime.getURL('assets/');
    const resolvedCss = cssText.replace(/\.\.\/assets\//g, baseUrl);
    const style = document.createElement('style');
    style.textContent = resolvedCss;
    style.setAttribute('data-halo-floating','');
    shadow.appendChild(style);

    loadIcons(shadow);
    dragFloatingBtn(shadow);
}


function loadIcons(shadow){
    const openSidebarIcon = shadow.querySelector('.open-sidebar-btn-icon');
    openSidebarIcon.src = chrome.runtime.getURL('assets/open-sidebar-icon2.png');
    console.log('src:', openSidebarIcon.src);
    openSidebarIcon.onload = () => console.log('IMAGE LOADED');
    openSidebarIcon.onerror = () => console.log('IMAGE FAILED');

    const hideSidebarIcon = shadow.querySelector('.Hide-btn-icon');
    console.log('hide sidebar icon : ',hideSidebarIcon);
    hideSidebarIcon.src = chrome.runtime.getURL('assets/hide-sidebar-icon.svg');

    const summarizeIcon = shadow.querySelector('.summarize-btn-icon');
    console.log('summary icon  : ',summarizeIcon);
    summarizeIcon.src = chrome.runtime.getURL('assets/summarize-icon2.svg');

    const translateIcon = shadow.querySelector('.Translate-page-btn-icon');
    translateIcon.src = chrome.runtime.getURL('assets/translate-icon.svg');
}

function dragFloatingBtn(shadow){
    const container = shadow.querySelector('.main-container');

    let startY = 0; // initial mouse position
    let startTop = 0; // initial element position

    let isDragging = false;
    let hasMoved = false;
    const drag_threshold = 4;

    // converting float button bottom to top 
    const rect = container.getBoundingClientRect();
    container.style.top = `${rect.top}px`;
    container.style.bottom = 'auto';

    container.addEventListener('mousedown',(e) =>{
        if(e.button !== 0) return;

        startY = e.clientY;
        startTop = container.getBoundingClientRect().top;

        hasMoved = false;

        document.body.style.userSelect = 'none';

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup',stopDrag);

    });

    const onDrag = (e) =>{
        const deltaY = e.clientY - startY;

        if(!hasMoved && Math.abs(deltaY) < drag_threshold)  return;

        hasMoved = true;
        isDragging = true;

        let newTop  = startTop + deltaY;
        const maxTop = window.innerHeight - container.offsetHeight - 8 ;

        newTop = Math.max(8 , Math.min(newTop , maxTop));
        container.style.top = `${newTop}px`;
    }


    const stopDrag = (e) =>{
        isDragging = false;
        document.body.style.userSelect = '';

        document.removeEventListener('mousemove',onDrag);
        document.removeEventListener('mouseup',stopDrag);
    }
}