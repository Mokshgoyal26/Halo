export async function  getSignUpPage(shadow){

    await mountSignUpPage(shadow);
}


async function mountSignUpPage(shadow){

    let signupPageElement = shadow.querySelector('.auth-page');

    if(!signupPageElement){

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


        signupPageElement = shadow.querySelector('.auth-page');
        console.log('signup-page existed: ', signupPageElement);
        
    }else{
        signupPageElement.classList.remove('hidden');
        console.log('signup-page already exists, unhidden');
    }


    
    closeButtonFeature(signupPageElement);
    handleSignupRequest(signupPageElement);
    handleLoginRequest(signupPageElement);
    handleAuthFormToggle(signupPageElement);
    handleAuthPageDrag(signupPageElement);
    

}


function closeButtonFeature(signupPage){

    const closebtn = signupPage.querySelector('.auth-close-btn');

    if(!closebtn){
        console.warn('signupPage and closebtn elements not exists yet');
        return;
    }

    closebtn.addEventListener('click' ,() =>{
        signupPage.classList.add('hidden');
    });
}


function handleSignupRequest(signupPage){

    const usernameInput = signupPage.querySelector('#signup-username');
    const emailInput = signupPage.querySelector('#signup-email');
    const passwordInput = signupPage.querySelector('#signup-password');
    const signUpBtn = signupPage.querySelector('.signup-submit-btn');

    console.log('username : ',usernameInput);
    console.log('email : ',emailInput);
    console.log('password : ',passwordInput);
    

    if(!usernameInput || !passwordInput || !emailInput || !signUpBtn){
        console.warn('sign up inputs not found');
        return ;
    }

    signUpBtn.addEventListener('click' , async () =>{
        console.log('signupBtn clicked ... ');
        const user = usernameInput.value;
        const mail = emailInput.value; 
        const password = passwordInput.value;

        if(!user || !password || !mail){
            console.warn('user or password or mail is empty');
            return;
        }

        chrome.runtime.sendMessage({
            type: 'SIGN_UP_REQUEST',
            payload:{
                user,
                mail,
                password
            }
        }, (response) =>{
            console.log('Signup Result : ', response);
        }); 
    });
} 


function handleLoginRequest(signupPage){

    console.log('handlelogin function is initialized ... ');

    const usernameInput = signupPage.querySelector('#login-username');
    const passwordInput = signupPage.querySelector('#login-password');
    const loginBtn = signupPage.querySelector('.login-submit-btn');

    console.log('userInput : ',usernameInput);
    console.log('passwordInput : ',passwordInput);
    

    if(!usernameInput || !passwordInput || !loginBtn){
        console.warn('login inputs not found');
        return ;
    }

    loginBtn.addEventListener('click' , async () =>{
        console.log('login button  clicked ... ');
        const user = usernameInput.value;
        const password = passwordInput.value;

        if(!user || !password){
            console.warn('user or password is empty');
            return;
        }

        chrome.runtime.sendMessage({
            type: 'LOGIN_REQUEST',
            payload:{
                user,
                password
            }
        }, (response) =>{
            console.log('login Result : ', response);
        }); 
    });
}


function handleAuthFormToggle(signupPage){

    const loginForm = signupPage.querySelector('.login-form');
    const signupForm = signupPage.querySelector('.signup-form');

    const showLoginPageBtn = signupPage.querySelector('.show-login-page-btn');
    const showSignupPageBtn = signupPage.querySelector('.show-signup-page-btn');


    if(!loginForm || !signupForm){
        console.warn('auth forms are missing');
        return;
    }

    showLoginPageBtn?.addEventListener('click',() => {
        
            console.log('show login page btn is clicked .....');
            loginForm.style.display = 'flex';
            signupForm.style.display = 'none';
    });


    showSignupPageBtn?.addEventListener('click', () =>{

        console.log('show signup page btn is clicked .....');
        loginForm.style.display = 'none';
        signupForm.style.display = 'flex';
    });
}


function handleAuthPageDrag(signupPage){

    const header = signupPage.querySelector('.auth-name-logo');

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.style.cursor = 'grab';

    header.addEventListener('mousedown' , (e) =>{

        isDragging = true;

        const rect = getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        header.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove' , (e) =>{

        if(!isDragging){
            return;
        }

        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        // keeping it in within viewports 

        const maxX  = window.innerWidth - signupPage.offsetWidth;
        const maxY = window.innerHeight - signupPage.offsetHeight;

        newLeft = Math.max(0 , Math.min(newLeft , maxX));
        newTop = Math.max(0 , Math.min(newTop , maxY));


        signupPage.style.right = 'auto';
        signupPage.style.left = newLeft + 'px';
        signupPage.style.top = newTop + 'px';
    });

    document.addEventListener('mouseup' , ()=>{

        if(!isDragging) return;

        isDragging = false;
        header.style.cursor = 'grab';
    });
}


