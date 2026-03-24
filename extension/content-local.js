// 1. Listen for messages from the React app (window.postMessage)
window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data) return;

  if (event.data.type === "START_QUICK_SETUP") {
    // Forward to background script
    chrome.runtime.sendMessage({ type: "START_QUICK_SETUP" });
  }
});

// 2. Listen for messages from the Background Script (forwarded from Target Pages)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CREDENTIALS_FOUND") {
    console.log("Localhost Content Script received forwarded credentials", message.data);
    
    // Forward to the React App
    window.postMessage(
      { type: "EXT_CREDENTIALS", data: message.data },
      "*"
    );
  }
});
