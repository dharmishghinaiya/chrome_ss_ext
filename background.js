chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.windows.create({
    url: chrome.extension.getURL("popup.html"),
    type: "popup",
    width: 300,
    height: 200
  });
});
