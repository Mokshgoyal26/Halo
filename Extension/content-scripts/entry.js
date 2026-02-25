// Content scripts may run as "classic scripts" in some browsers/versions.
// To avoid "Cannot use import statement outside a module", use dynamic import.
(async () => {
    const { initSidebarUI ,showSidebar} = await import(
        chrome.runtime.getURL('ui/sidebar-ui/sidebar.js')
    );

    const {  getFloatingBtn } = await import(
        chrome.runtime.getURL('ui/floating-button-ui/floating-button.js')
    ) ;

    const {getSignUpPage} = await import(
        chrome.runtime.getURL('ui/sign-up-page-ui/signUp.js')
    );

    const host = document.createElement('div');
    host.id = 'halo-shadow-dom';
    Object.assign(host.style, {
        position: 'fixed',
        top:0,
        right:0,
        zIndex: '2147483647',
        pointerEvents: 'none'
    });
    document.documentElement.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    await initSidebarUI(shadow); // async inside handles mounting HTML/CSS

    const openSidebar = await getFloatingBtn(shadow);

    openSidebar.addEventListener('click',() =>{
        showSidebar();
    });


})();


