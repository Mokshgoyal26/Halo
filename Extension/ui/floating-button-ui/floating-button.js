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
    ).then(res => res.text()),

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

    // initial mouse position 
    let startX = 0;
    let startY = 0; 

    // initial container position
    let startTop = 0; 
    let startLeft = 0;

    let isDragging = false;
    let hasMoved = false;
    const drag_threshold = 4;

    
    const rect = container.getBoundingClientRect();
    container.style.top = `${rect.top}px`;
    container.style.left = `${rect.left}px`;
    container.style.right = 'auto';
    container.style.bottom ='auto';

    container.addEventListener('mousedown',(e) =>{

        if(e.button !== 0) return;

        startX = e.clientX;
        startY = e.clientY;

        const rect = container.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;

        hasMoved = false;
        isDragging = true;

        container.style.transition = 'none';
        document.body.style.userSelect = 'none';

        document.addEventListener('mousemove',onDrag);
        document.addEventListener('mouseup',stopDrag);

    });

    const onDrag = (e) =>{

        container.classList.add('dragging');

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        if(!hasMoved && Math.abs(deltaY) < drag_threshold  &&  Math.abs(deltaX) < drag_threshold)  return;

        hasMoved = true;

        let newLeft = startLeft + deltaX;
        let newTop  = startTop + deltaY;

        const maxTop = window.innerHeight - container.offsetHeight - 8 ;
        newTop = Math.max(8 , Math.min(newTop , maxTop));

        container.style.top = `${newTop}px`;
        container.style.left = `${newLeft}px`;
    }


    const stopDrag = (e) =>{
        isDragging = false;
        container.classList.remove('dragging');

        document.body.style.userSelect = '';

        document.removeEventListener('mousemove',onDrag);
        document.removeEventListener('mouseup',stopDrag);

        if(!hasMoved) return;

        snapToEdge();
    }

    const snapToEdge = () =>{
        const rect = container.getBoundingClientRect();
        const midpoint = window.innerWidth/2;

        container.style.transition = 'left 160ms cubic-bezier(0.2, 0, 0.38, 0.9)';

        if(rect.left + rect.width / 2 < midpoint){
            container.style.left = '0px';
            container.classList.add('left');
            container.classList.remove('right');
        }else{
            container.style.left = `${window.innerWidth - rect.width}px`;
            container.classList.add('right');
            container.classList.remove('left');
        }
    }
}



