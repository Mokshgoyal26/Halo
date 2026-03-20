export async function  getSignUpPage(sidebarContainer){

    await mountSignUpPage(sidebarContainer);
}


async function mountSignUpPage(sidebarContainer){

    let signupPageElement = sidebarContainer.querySelector('.auth-page');

    if(!signupPageElement){

        const[cssText , html] = await Promise.all([

            fetch(chrome.runtime.getURL('../ui/sign-up-page-ui/signUp.css')).then(res => res.text()),

            fetch(chrome.runtime.getURL('../ui/sign-up-page-ui/signUp.html')).then(res => res.text())
        ]);


        const template = document.createElement('template');
        template.innerHTML = html.trim();

        sidebarContainer.appendChild(template.content.cloneNode(true));


        const baseUrl = chrome.runtime.getURL('assets/');
        const resolvedCss = cssText.replace(/\.\.\/assets\//g, baseUrl);

        const scopedCss = resolvedCss.replace(
            /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g,
            (match, selector, separator) => {
                // skip already scoped, keyframes, and html/body selectors
                if (selector.trim().startsWith('.auth-page') ||
                    selector.trim().startsWith('@') ||
                    selector.trim().startsWith('from') ||
                    selector.trim().startsWith('to')) {
                    return match;
                }
                return `.auth-page ${selector.trim()}${separator}`;
            }
        );
        
        const style = document.createElement('style');
        //style.innerText = resolvedCss;
        style.innerText = scopedCss;
        style.setAttribute('halo-signup-page','');
        sidebarContainer.appendChild(style);


        signupPageElement = sidebarContainer.querySelector('.auth-page');
        console.log('signup-page existed: ', signupPageElement);

        closeButtonFeature(signupPageElement);
        handleSignupRequest(signupPageElement);
        handleLoginRequest(signupPageElement);
        handleAuthFormToggle(signupPageElement);
        //handleAuthPageDrag(signupPageElement);
            
    }else{
        signupPageElement.classList.remove('hidden');
        console.log('signup-page already exists, unhidden');
    }

}


function closeButtonFeature(signupPage){

    signupPage.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    const closebtn = signupPage.querySelector('.auth-close-btn');

    if(!closebtn){
        console.warn('signupPage and closebtn elements not exists yet');
        return;
    }

    closebtn.addEventListener('click' ,(e) =>{
        e.stopPropagation();
        signupPage.classList.add('hidden');
    });
}


function handleSignupRequest(signupPage){

    const usernameInput = signupPage.querySelector('#signup-username');
    const emailInput = signupPage.querySelector('#signup-email');
    const passwordInput = signupPage.querySelector('#signup-password');
    const signUpBtn = signupPage.querySelector('.signup-submit-btn');

    const signupErrorDiv = signupPage.querySelector('#signup-error');

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
        const email = emailInput.value; 
        const password = passwordInput.value;

        if(!user || !password || !email){
            console.warn('user or password or mail is empty');
            return;
        }

        chrome.runtime.sendMessage({
            type: 'SIGN_UP_REQUEST',
            payload:{
                user,
                email,
                password
            }
        }, (response) =>{
            handleAuthMessageOnUi(response,signupErrorDiv);
        }); 
    });
} 


function handleLoginRequest(signupPage){

    console.log('handlelogin function is initialized ... ');

    const usernameInput = signupPage.querySelector('#login-username');
    const passwordInput = signupPage.querySelector('#login-password');
    const loginBtn = signupPage.querySelector('.login-submit-btn');


    const loginErrorDiv = signupPage.querySelector('#login-error'); 

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
            
            handleAuthMessageOnUi(response, loginErrorDiv);

            if(response.type === 'LOGIN_REPLY' && response.payload.username){
                console.log('username recieved from login_reply : ',response.payload.username);

                window.dispatchEvent(new CustomEvent('halo:login' , {
                    detail: {'username':response.payload.username}
                }));
            }
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


/*function handleAuthPageDrag(signupPage){

    const header = signupPage.querySelector('.auth-name-logo');

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.style.cursor = 'grab';

    header.addEventListener('mousedown' , (e) =>{

        isDragging = true;

        const rect = signupPage.getBoundingClientRect();
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
}*/


function handleAuthMessageOnUi(response , authMessageDiv){

    if(!authMessageDiv) return;

    let isError = response.type.includes('ERROR');
    let isSuccess = response.type.includes('RESULT');

    let message = '';

    if(isError){

        const payload = response.payload;

        if(payload && payload.validationErrors){
            message = Object.values(payload.validationErrors).join(', ');

        }else if(payload && payload.message){
            message = payload.message;

        }else{
            message = payload || 'unknown error occurred';
        }

        authMessageDiv.textContent = message;

        authMessageDiv.classList.remove('hidden','success');
        authMessageDiv.classList.add('error');

    }else if(isSuccess){

        authMessageDiv.textContent = response.payload || 'success!';

        authMessageDiv.classList.remove('hidden','error');
        authMessageDiv.classList.add('success');
    }

    setTimeout(() =>{
        authMessageDiv.classList.add('hidden');
    }, 5000);
}


