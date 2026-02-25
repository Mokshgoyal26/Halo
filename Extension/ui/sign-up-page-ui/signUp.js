export async function  getSignUpPage(shadow){

    await mountSignUpPage(shadow);
}


async function mountSignUpPage(shadow){

    const existingSignupPage = shadow.querySelector('.signup-page');

    if(existingSignupPage){
        existingSignupPage.classList.remove('hidden');
    }


    if(shadow.querySelector('style[halo-signUp-page]')) return;

    const[cssText , html] = await Promise.all([

        fetch(chrome.runtime.getURL('../ui/sign-up-page-ui/signUp.css')).then(res => res.text()),

        fetch(chrome.runtime.getURL('../ui/sign-up-page-ui/signUp.html')).then(res => res.text())
    ]);


    const template = document.createElement('template');
    template.innerHTML = html.trim();
    shadow.appendChild(template.content.cloneNode(true));


    const baseUrl = chrome.runtime.getURL('/assets');
    const resolvedCss = cssText.replace(/\.\.\/assets\//g, baseUrl);
    const style = document.createElement('style');
    style.innerText = resolvedCss;
    style.setAttribute('halo-signup-page','');
    shadow.appendChild(style);


    const signuppageelement = document.querySelector('.signup-page');
    console.log('signup-page existed: ', signuppageelement);


    closeButtonFeature(shadow);

}


function closeButtonFeature(shadow){

    const signupPage = shadow.querySelector('.signup-page');
    const closebtn = shadow.querySelector('.signup-close-btn');

    if(!signupPage || !closebtn){
        console.warn('signupPage and closebtn elements not exists yet');
        return;
    }

    closebtn.addEventListener('click' ,() =>{
        signupPage.classList.add('hidden');
    });
}