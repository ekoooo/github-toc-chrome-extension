function initSource(url) {
    if(/(https|http)?:\/\/*.github.com\/*/.test(url)) {
        chrome.tabs.insertCSS(null, {"file": "css/toc.css"});
        chrome.tabs.executeScript(null, {"file": "js/jquery-1.8.0.min.js"});
        chrome.tabs.executeScript(null, {"file": "js/toc.js"});
    }
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status === 'complete') {
        initSource(tab.url);
    }
});