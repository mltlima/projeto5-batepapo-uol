let lastMessage = null;
let mainUser = "";



function sucessHandle(data) {
    //console.log(data.data);
}

function remove(className) {
    className.classList.remove("hide");
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
    },3000);
    

    setInterval(() => {
        keepUserActive();
    }, 5000);

    setInterval(() => {
        updateMessages();
    },3000)
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

    let message = {
        from: mainUser,
        to: "Todos",
        text: footer.value,
        type: "message"
    }
    let promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", message);
    promise.then(sucessHandle);
    promise.catch(messageErrorHandle);
    footer.value = "";
}