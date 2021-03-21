const https = require('https');
var request = require('sync-request');

var closedUrl = "https://api.github.com/search/issues?q=repo:wso2/product-apim+type:issue+state:closed+label%3A%22API-M+4.0.0%22+closed%3A%3E";
var openedUrl = "https://api.github.com/search/issues?q=repo:wso2/product-apim+type:issue+label%3A%22API-M+4.0.0%22+created%3A%3E";
var openedTotalUrl = "https://api.github.com/search/issues?q=repo:wso2/product-apim+type:issue+state:open+label%3A%22API-M+4.0.0%22";
var closedUrlMI = "https://api.github.com/search/issues?q=repo:wso2/micro-integrator+state:closed+label%3A%224.0.0%22+closed%3A%3E";
var openedUrlMI = "https://api.github.com/search/issues?q=repo:wso2/micro-integrator+type:issue+label%3A%224.0.0%22+created%3A%3E";
var closedUrlIS = "https://api.github.com/search/issues?q=repo:wso2/integration-studio+state:closed+label%3A%228.0.0%22+closed%3A%3E";
var openedUrlIS = "https://api.github.com/search/issues?q=repo:wso2/integration-studio+type:issue+label%3A%228.0.0%22+created%3A%3E";
var d = new Date();
d.setDate(d.getDate() - 1);
var yesterday = d.toISOString().slice(0,10);

d.setDate(d.getDate() - 1);
var dayBeforeYesterday = d.toISOString().slice(0,10);

closedUrl = closedUrl + dayBeforeYesterday;
console.log("===============" + closedUrl);

openedUrl = openedUrl + dayBeforeYesterday;
console.log("===============" + openedUrl);

closedUrlMI = closedUrlMI + dayBeforeYesterday;
console.log("===============" + closedUrlMI);

openedUrlMI = openedUrlMI + dayBeforeYesterday;
console.log("===============" + openedUrlMI);

closedUrlIS = closedUrlIS + dayBeforeYesterday;
console.log("===============" + closedUrlIS);

openedUrlIS = openedUrlIS + dayBeforeYesterday;
console.log("===============" + openedUrlIS);

var optionsGet = {
    headers: {
        'user-agent': 'node.js',
    }
};

var textMsg = "";
callGitOpenedGet(openedUrl, "----API Manager----");
callGitOpenedGet(openedUrlMI, "----Micro Integrator----");
callGitOpenedGet(openedUrlIS, "----Integration Studio----");
console.log("=======Final Log======== " + textMsg);
postWebhook();

function callGitOpenedGet(url, product) {
    var res = request('GET', url, optionsGet);
    var totalCount = JSON.parse(res.getBody('utf8')).total_count;
    
    textMsg = textMsg + product + "\n";
    if (product == "----API Manager----") {
        callGitTotalGet(openedTotalUrl);
    }
    if (totalCount != null) {
        textMsg = textMsg + "Number of GIT issues opened on " + yesterday + " - " + totalCount + "\n";
    } else {
        textMsg = textMsg + "No opened issues on " + yesterday;
    }

    if (product == "----API Manager----") {
        callGitClosedGet(closedUrl);
    } else if (product == "----Micro Integrator----") {
        callGitClosedGet(closedUrlMI);
    } else if (product == "----Integration Studio----") {
        callGitClosedGet(closedUrlIS);
    }
    
}

function callGitClosedGet(url) {
    var res = request('GET', url, optionsGet);
    var totalCount = JSON.parse(res.getBody('utf8')).total_count;
    if (totalCount != null) {
        textMsg = textMsg + "Number of GIT issues resolved on " + yesterday + " - " + totalCount + "\n\n";
    } else {
        textMsg = "No closed issues on " + yesterday + "\n\n";
    }
}

function callGitTotalGet(url) {
    var res = request('GET', url, optionsGet);
    var totalCount = JSON.parse(res.getBody('utf8')).total_count;
    if (totalCount != null) {
        textMsg = textMsg + "Total Number of open GIT issues - " + totalCount + "\n";
    } else {
        textMsg = "No closed issues on " + yesterday + "\n\n";
    }
}

function postWebhook() {
    var webhookUrl = 'https://chat.googleapis.com/v1/spaces/AAAAdxwFenw/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=oCHPaF32lRjxpMmTRVnogbVCC6Y1YAi6E6MAg7Zm0Dw%3D';
    //var webhookUrl = 'https://chat.googleapis.com/v1/spaces/AAAA7KUbG2g/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=VSHdFhA8DfkarEjT9EfAR-nQEwgKWNcVp9AP3eSd5UU%3D';
    var res = request('POST', webhookUrl, {
        json: {
                text: textMsg, 
                thread: {
                     name: "spaces/AAAAdxwFenw/threads/5mSDiGrh6n0"
                }
              },
    });
    var responseMsg = res.getBody('utf8');
    console.log("=======Response Log======== " + responseMsg);
}
