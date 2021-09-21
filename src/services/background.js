chrome.runtime.onMessage.addListener((message, sendr, sendResponse) => {
    if (message.type === 'search'){
        //sendResponse('COMUNICACAO FUNCIONADNO');
            var req = new XMLHttpRequest();
            req.responseType = 'json';
            req.open('GET', "https://api.github.com/users/" + message.username, true);
            req.onload = function(){
                var response = req.response;
                sendResponse(response);
                    
                
            };
            req.send(null);

    }
    if (message.type === 'list-repositories'){
        //sendResponse('COMUNICACAO FUNCIONADNO');
            var req = new XMLHttpRequest();
            req.responseType = 'json';
            req.open('GET', "https://api.github.com/users/" + message.username +"/repos" , true);
            req.onload = function(){
                var response = req.response;
                sendResponse(response);
                    
                
            };
            req.send(null);

    }
    return true;
}); 