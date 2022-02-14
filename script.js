let lastMessage = null;
let mainUser = "";
let visibility = null;
let sendTo = null;
//let users = document.querySelectorAll('.user');

function sucessHandle(data) {
    //console.log(data.data);
}

function remove(className) {
    if(!className.innerHTML.includes("nav")){
        className.classList.remove("hide");
    }
}

function userSucess() {

    document.querySelector(".input-screen input").remove();
    document.querySelector(".input-screen button").remove();
    document.querySelector(".input-screen").innerHTML += 
        `<img class="loading" src="/images/loading.gif">
        <p>Entrando...</p>
        `
    setTimeout(() =>{
        document.querySelectorAll(".hide").forEach(remove);
        document.querySelector(".input-screen").classList.add("hide");
    },5000);//verificar tempo ###############################################################################
    

    setInterval(() => {
        keepUserActive();
    }, 5000);

    setInterval(() => {
        updateMessages();
    },3000)

    setInterval(() => {
        getOnlineUsers();
        
    },10000)
}

function userError() {
    alert("Nome já esta em uso, digite um novo nome");
    console.log("Status code: " + error.response.status); 
	console.log("Mensagem de erro: " + error.response.data);
}

function errorHandle(error) {
    console.log("Status code: " + error.response.status); 
	console.log("Mensagem de erro: " + error.response.data);
}

function messageErrorHandle() {
    window.location.reload();
}

let user = document.querySelector(".input-screen input");
user.addEventListener("keyup", function(event) {
    if (event.keyCode == 13) {
        event.preventDefault()
        enterUserName()
    }
})

function enterUserName() {
    mainUser = user.value;

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants ", {name: mainUser});
        promise.then(userSucess);
        promise.catch(userError);
}
   

function keepUserActive() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status ", {name: mainUser});    
        promise.then(sucessHandle);
        promise.catch(errorHandle);
}


function updateMessages() {

    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
        promise.then(messageSucess);
        promise.catch(errorHandle);
}


function messageSucess(data) {
    let messages = data.data
    const mainHTML = document.querySelector("main");

    for (let i = 0; i < messages.length; i++) {

        if (lastMessage != null) {
            if (lastMessage.time == messages[i].time && lastMessage.from == messages[i].from && lastMessage.to == messages[i].to && lastMessage.text == messages[i].text && messages.length-1 != i) {
                lastMessage = null;
                continue;
            }
            continue;
        }    

        let type = messages[i].type;  
        if (type  === "status") {
            mainHTML.innerHTML += `<div class="container-box">
            <p><span class="time"> (${messages[i].time})</span> <span class="user">${messages[i].from}</span> ${messages[i].text}</p>
            `
        }
        if (type  === "message") {
            mainHTML.innerHTML += `<div class="container-box normal-messages">
            <p><span class="time"> (${messages[i].time})</span> <span class="strong">${messages[i].from}</span> para <span class="strong">Todos:</span> ${messages[i].text}</p>
            `
        }
        if (type  === "private_message" && messages[i].to === mainUser) {
            mainHTML.innerHTML += `<div class="container-box private-messages">
            <p><span class="time"> (${messages[i].time})</span> <span class="strong">${messages[i].from}</span> reservadamente para <span class="strong">${messages[i].to}</span> ${messages[i].text}</p>
            `
        }

        document.querySelector(".container-box:last-child").scrollIntoView();

        if (i === messages.length - 1) {
            lastMessage = messages[i];
        }
    }
    
}

let footer = document.querySelector("footer input");
footer.addEventListener("keyup", function(event) {
    if (event.keyCode == 13) {
        event.preventDefault()
        sendMessage()
    }
})

function sendMessage() {
    let message = {};
    
    if (sendTo != null && visibility.innerText.includes("Reservadamente")) {        
        message = {
            from: mainUser,
            to: sendTo.innerText,
            text: footer.value,
            type: "private_message"
        } 
    } else if (sendTo != null){
        message = {
            from: mainUser,
            to: sendTo.innerText,
            text: footer.value,
            type: "message"
        } 
    } else {
        message = {
            from: mainUser,
            to: "Todos",
            text: footer.value,
            type: "message"
        }
    }
    
    let promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", message);
    promise.then(sucessHandle);
    promise.catch(messageErrorHandle);
    footer.value = "";
}

function getOnlineUsers() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
        promise.then(usersOnline);
        promise.catch(errorHandle);
} 

function usersOnline(data) {
    const usersOn = document.querySelector(".users-online");

    usersOn.innerHTML = "";

    for (let i = 0; i < data.data.length; i++) {
        const user = data.data[i];
        usersOn.innerHTML += `  <div class="nav-link user" onclick="selectUser(this)">
                                        <ion-icon name="person-circle"></ion-icon>
                                        <p>${user.name}</p>
                                        <ion-icon class="check hide-check" name="checkmark-sharp"></ion-icon>
                                    </div>  
        `
        if (sendTo != null) {
            if (sendTo.innerHTML.includes(user.name)) {
                usersOn.lastElementChild.querySelector(".check").classList.remove("hide-check");
                sendTo = usersOn.lastElementChild;
            }
        }
    }
}


/*window.addEventListener("load", () => {
    document.body.classList.remove("preload");
});
*/
document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".nav");

    document.querySelector(".menu").addEventListener("click", () => {
        nav.classList.remove("hide");
    });

    document.querySelector(".nav-overlay").addEventListener("click", () => {
        nav.classList.add("hide");
    });
});
/*
users.forEach(user => user.addEventListener('click', () =>{
    if (sendTo != null) {
        sendTo.querySelector(".check").classList.add("hide-check");
    }
    sendTo = user;
    //console.log(user.querySelector(".check"));
    user.querySelector(".check").classList.remove("hide-check");
}))*/

function selectUser(user) {
    if (sendTo != null) {
        sendTo.querySelector(".check").classList.add("hide-check");
    }
    sendTo = user;
    user.querySelector(".check").classList.remove("hide-check");
    messageVisibity(1)
}

function selectVisibility(selectedVisibility) {
    if (visibility != null) {
        visibility.querySelector(".check").classList.add("hide-check");
    }
    visibility = selectedVisibility;
    selectedVisibility.querySelector(".check").classList.remove("hide-check");
    messageVisibity(0)
}

function messageVisibity(condition) {
    const sendMessageTo = document.querySelector(".Send-message-to")

    if (condition) {
        sendMessageTo.innerHTML = 
        `Enviando para ${sendTo.innerText}`
    }else {
        sendMessageTo.innerHTML = 
        `Enviando para ${sendTo.innerText}  (${visibility.innerText})`
    }
}