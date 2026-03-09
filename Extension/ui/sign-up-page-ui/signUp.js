export async function  getSignUpPage(shadow){

    await mountSignUpPage(shadow);
}


async function mountSignUpPage(shadow){

    let signupPageElement = shadow.querySelector('.signup-page');

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


        signupPageElement = shadow.querySelector('.signup-page');
        console.log('signup-page existed: ', signupPageElement);
        
    }else{
        signupPageElement.classList.remove('hidden');
        console.log('signup-page already exists, unhidden');
    }


    
    closeButtonFeature(signupPageElement);
    handleSignupRequest(signupPageElement);
    handleLoginRequest(signupPageElement);
    

}


function closeButtonFeature(signupPage){

    const closebtn = signupPage.querySelector('.signup-close-btn');

    if(!closebtn){
        console.warn('signupPage and closebtn elements not exists yet');
        return;
    }

    closebtn.addEventListener('click' ,() =>{
        signupPage.classList.add('hidden');
    });
}


function handleSignupRequest(signupPage){

    const userInput = signupPage.querySelector('#auth-email');
    const passwordInput = signupPage.querySelector('#auth-password');
    const signUpBtn = signupPage.querySelector('.auth-submit-btn');

    console.log('userInput : ',userInput);
    console.log('passwordInput : ',passwordInput);
    

    if(!userInput || !passwordInput || !signUpBtn){
        console.warn('sign up inputs not found');
        return ;
    }

    signUpBtn.addEventListener('click' , async () =>{
        console.log('signupBtn clicked ... ');
        const user = userInput.value;
        const password = passwordInput.value;

        if(!user || !password){
            console.warn('user or password is empty');
            return;
        }

        chrome.runtime.sendMessage({
            type: 'SIGN_UP_REQUEST',
            payload:{
                user,
                password
            }
        }, (response) =>{
            console.log('Signup Result : ', response);
        }); 
    });
} 


function handleLoginRequest(signupPage){

    console.log('handlelogin function is initialized ... ');

    const userInput = signupPage.querySelector('#auth-email');
    const passwordInput = signupPage.querySelector('#auth-password');
    const loginBtn = signupPage.querySelector('.login-btn');

    console.log('userInput : ',userInput);
    console.log('passwordInput : ',passwordInput);
    

    if(!userInput || !passwordInput || !loginBtn){
        console.warn('login inputs not found');
        return ;
    }

    loginBtn.addEventListener('click' , async () =>{
        console.log('login button  clicked ... ');
        const user = userInput.value;
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


