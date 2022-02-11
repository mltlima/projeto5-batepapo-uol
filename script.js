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

    let input = prompt("Qual o seu lindo nome?");

    while (!correctUserInput) {
        
        let user = {name: input}
        const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants ", user);    
        correctUserInput = promise.then(userSucess);
        if (!correctUserInput) {
            input = prompt("Nome já esta em uso, digite um novo nome");
        } else {
            //setTimeout(keepUserActive(user),5000);
            setInterval(() => {
                keepUserActive(user);
            }, 5000);
        }
        promise.catch(errorHandle);
    }
} //enterRoom();

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
//setInterval(() => {
    updateMessages();
//},3000)

function messageSucess(data) {
    console.log(data.data);
    let messages = data.data
    const mainHTML = document.querySelector("main");

    for (let i = 0; i < messages.length; i++) {
        let type = messages[i].type;  
        if (type  === "status") {
            mainHTML.innerHTML += `<div class="container-box">
            <p><span class="time"> (${messages[i].time})</span> <span class="user">${messages[i].from}</span> ${messages[i].text}</p>
            `
        }
        if (type  === "message") {
            
        }
        if (type  === "private_message") {
            
        }
    }
    
}