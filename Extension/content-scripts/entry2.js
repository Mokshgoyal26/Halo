// entry2.js
// Content script (must be declared with "type": "module" in manife

// Wrap in async function to control execution flow
async function bootstrap() {
    try {

        const { SidebarApp } = await import(
            chrome.runtime.getURL('ui/sidebar-ui/sidebar/SidebarApp.js')
        );
        
        const { getFloatingBtn } = await import(
            chrome.runtime.getURL('ui/floating-button-ui/floating-button.js')
        );
        
        // Prevent duplicate injection
        let host = document.getElementById('halo-shadow-dom');

        if (!host) {
            host = document.createElement('div');
            host.id = 'halo-shadow-dom';

            Object.assign(host.style, {
                position: 'fixed',
                top: '0',
                right: '0',
                width: '100%',
                height: '100%',
                zIndex: '2147483647',
                pointerEvents: 'auto'
            });

            document.documentElement.appendChild(host);
        }

        const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });

        // Initialize Sidebar
        const sidebarApp = new SidebarApp(shadow);
        await sidebarApp.init();

        // Initialize Floating Button
        const openSidebarBtn = await getFloatingBtn(shadow);

        openSidebarBtn.addEventListener('click', () => {
            sidebarApp.showSidebar();
        });

        console.log('[Halo] UI initialized successfully');

    } catch (error) {
        console.error('[Halo] Failed to bootstrap UI:', error);
    }
}

bootstrap();
