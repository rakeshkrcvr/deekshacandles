chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "START_QUICK_SETUP") {
    // Open the tabs
    chrome.tabs.create({ url: "https://dashboard.razorpay.com/app/keys" });
    chrome.tabs.create({ url: "https://app.shiprocket.in/api-settings" });
  }

  if (message.type === "CREDENTIALS_FOUND") {
    console.log("Credentials received in background:", message.data);
    // Find the localhost tab to forward the message
    chrome.tabs.query({ url: "*://localhost/*" }, (tabs) => {
      // If no exact match (sometimes ports get missed in strict queries), try a wider approach
      if (tabs.length === 0) {
         chrome.tabs.query({ title: "Create Next App" }, (t) => { // Next.js default title
             t.forEach(tab => chrome.tabs.sendMessage(tab.id, message));
         });
         // Also query active window tabs
         chrome.tabs.query({}, (allTabs) => {
           allTabs.forEach(tab => {
             if (tab.url && tab.url.includes("localhost:3000")) {
                chrome.tabs.sendMessage(tab.id, message);
             }
           });
         });
      } else {
         tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, message));
      }
    });
  }
});
