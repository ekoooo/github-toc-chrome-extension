chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(tab.id, {
            message: {
                event: 'onUpdated',
                url: tab.url
            }
        });
    }
});