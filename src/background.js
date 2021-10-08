/*chrome.runtime.onInstalled.addListener(function(){
    chrome.tabs.create({
        url: "https://sapiens.agu.gov.br/"
    });
});*/


var paraEnviar = "teste de comunicao";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>{

    if(message === 'get-variabe'){
        sendResponse(paraEnviar);
    }
});

