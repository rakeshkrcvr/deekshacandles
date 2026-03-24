console.log("Deeksha Candles Integration Extension Loaded");

function scrapeCredentials() {
  const url = window.location.href;

  // --- Razorpay API Keys Scraper ---
  if (url.includes("dashboard.razorpay.com")) {
    console.log("Scanning Razorpay Dashboard...");
    // Razorpay often has inputs or text elements containing 'rzp_test_' or 'rzp_live_'
    // Let's find any text matching the format or inputs
    const inputs = document.querySelectorAll("input");
    let keyId = "";
    let keySecret = "";

    inputs.forEach((input) => {
      const val = input.value || input.placeholder;
      if (val && val.startsWith("rzp_")) {
        keyId = val;
      }
    });

    // Often secret is next to it or in a password field that gets revealed. 
    // We try catching it by looking at adjacent elements or any input that doesn't look like Key ID but is inside the same modal
    const pwdInputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    pwdInputs.forEach((pwd) => {
      if (!pwd.value.startsWith("rzp_") && pwd.value.length > 10) {
        if (!keySecret) keySecret = pwd.value;
      }
    });

    // Optional heuristic for reading text content if no inputs found
    if (!keyId) {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      let node;
      while ((node = walker.nextNode())) {
         const txt = node.nodeValue.trim();
         if (txt.startsWith("rzp_test_") || txt.startsWith("rzp_live_")) {
            keyId = txt;
         }
      }
    }

    if (keyId) {
      chrome.runtime.sendMessage({
        type: "CREDENTIALS_FOUND",
        data: {
          source: "Razorpay",
          razorpayKeyId: keyId,
          razorpaySecret: keySecret || "Secret not visible, please copy manually."
        }
      });
      console.log("Sent Razorpay keys to background.");
    }
  }

  // --- Shiprocket Credentials Scraper ---
  if (url.includes("app.shiprocket.in")) {
    console.log("Scanning Shiprocket Dashboard...");
    // Shiprocket API settings usually have the email/password config
    // Actually, in Shiprocket API section, they show the "Email" used to generate the API user
    // They don't typically show passwords in plain text, but we try anyway.
    let email = "";
    
    // Look for generic email strings in the page
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const bodyText = document.body.innerText;
    const matches = bodyText.match(emailRegex);
    
    if (matches && matches.length > 0) {
      // Pick the first email found that looks like a user email
      email = matches[0];
      
      chrome.runtime.sendMessage({
        type: "CREDENTIALS_FOUND",
        data: {
          source: "Shiprocket",
          shiprocketEmail: email,
          shiprocketPassword: "Enter manually (Cannot scrape hidden passwords)"
        }
      });
      console.log("Sent Shiprocket details to background.");
    }
  }
}

// Run the scraper every 3 seconds to catch elements that load dynamically / after clicks
setInterval(scrapeCredentials, 3000);
