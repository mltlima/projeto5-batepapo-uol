function getDataAPI() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");

    promise.then(sucessHandle);
    promise.catch(errorHandle);
} 

function sucessHandle(data) {
    console.log(data.data);
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
            setTimeout(keepUserActive(promise),5000);
        }
        promise.catch(errorHandle);
    }
} enterRoom();

function userSucess(data) {
    //console.log(data);
    getDataAPI();
    return true;
}

function keepUserActive(promise) {
    
    setInterval(() => {
        promise.then(userSucess);
        promise.catch(errorHandle);
    },5000)   
    
}