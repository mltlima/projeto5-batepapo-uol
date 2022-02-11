let lastMessage = null;
let isMessagePrintable = true;
let mainUser = "";

function getDataAPI() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    
    promise.then(sucessHandle);
    promise.catch(errorHandle);
} 

function sucessHandle(data) {
    console.log(data.data);
}

function userSucess() {
    getDataAPI();
    return true;
}

function errorHandle(error) {
    console.log("Status code: " + error.response.status); 
	console.log("Mensagem de erro: " + error.response.data);
}

function enterRoom() {

    let correctUserInput = false;

    mainUser = prompt("Qual o seu lindo nome?");
    
    while (!correctUserInput) {
        
        let user = {name: mainUser}
        const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants ", user);    
        correctUserInput = promise.then(userSucess);
        if (!correctUserInput) {
            mainUser = prompt("Nome já esta em uso, digite um novo nome");
        } else {
            //setTimeout(keepUserActive(user),5000);
            setInterval(() => {
                keepUserActive(user);
            }, 5000);
        }
        promise.catch(errorHandle);
    }
} enterRoom();

function keepUserActive(user) {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status ", user);    
        promise.then(userSucess);
        promise.catch(errorHandle);
}


function updateMessages() {

    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
        promise.then(messageSucess);
        promise.catch(errorHandle);

} 
setInterval(() => {
    updateMessages();
},3000)

function messageSucess(data) {
    //console.log(data.data);
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
            console.log(lastMessage);
        }
    }
    
}