// Listener that runs when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("Chrome Extension successfully installed.");
});
