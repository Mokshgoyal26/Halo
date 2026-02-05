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

