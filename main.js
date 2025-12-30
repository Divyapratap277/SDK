// main.js (SDK consumer / demo file)

import { Bargad } from "./public/sdk/bargad-bundle.js";

console.log("Initializing Bargad SDK demo...");

const bargad = new Bargad("test-api-key", "test-user-1");

// Enable features (ONLY CONFIG)
bargad.trackFormTime = {
  enabled: true,
  args: 
  [["test-form"], 
  ["form-submit-btn"]]
};

bargad.trackOTPAttempts = {
  enabled: true,
  args: [["otp-btn"]]
};

bargad.trackKeypressEvents = true;
bargad.customClipboardEvents = true;


// Start SDK
bargad.initialize();

console.log("Bargad SDK initialized for testing.");
