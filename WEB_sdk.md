Bargad.AI Web SDK
package:
Installation
Add the Bargad package provided to you to your project directory
Getting Started
1. Import the package from the path where the 'bargad-bundle.js' file is located.
import {Bargad} from './build-folder-name/bargad-bundle.js';

2. Instantiate the Bargad object :
//Your API Key
const apiKey = "your-api-key";

//Unique ID e.g mobile number
const uniqueId = "your-unique-Id"

const bargadInstance = new Bargad(apiKey,uniqueId);

3. Once the bargadInstance is instantiated, all the features as listed in the Data Points Documentation are enabled.
In order to disable any feature, you may follow this procedure
bargadInstance.customClipboardEvents = false;

The above example disables the clipboard events detection.
4. For OTP Attempt tracking, Form Time tracking and Bot Risk Analysis Score Tracking features, the implementation
is as follows:
OTP Attempt Tracking :
bargadInstance.trackOTPAttempts={
enabled : true,
args : [["buttonId1", "buttonId2",..."buttonIdN"]]
}
Here, enabled is true by default. However, the args field is an empty array of arguments by default. Hence, in order to
track OTP Attempts you must populate it with an array of the IDs of the all buttons linked with OTP attempts that you
would like to track.

Form Time tracking :
bargadInstance.trackFormTime = {
enabled : true,
args :
[
['formId1','formId2',..."formIdN"],
['submitId1','submitId2',..."submitIdN"]
]
}
Here, enabled is true by default. However, the args field is an empty array of arguments by default. Hence, in order to
track the time spent on forms, you must populate args with an array of form IDs and another array of corresponding
submit button IDs of those forms.

Bot Risk Analysis Tracking :
bargadInstance.trackBotRiskAnalysis= {
enabled : true,
args : ["buttonId"]
}
Here, enabled is true by default. However, the args field is an empty array of arguments by default. Hence, in order to
track the bot risk, you must populate args with the ID of the button which, on clicking, would trigger bot risk analysis.

5. After you are done customizing the features that you want disabled/enabled , you must call the following function
in order to begin tracking :
bargadInstance.initialize()
6. Finally, you must integrate this JS file as part of your HTML code, as per your project's framework allowance. For
reference, given below is integration of the file 'test.js' is done in the HTML file's head tag :
List of all feature implementations:
bargadInstance.trackOTPAttempts={
enabled : true,
args : [["buttonId1", "buttonId2",..."buttonIdN"]]
}

bargadInstance.trackFormTime = {
enabled : true,
args :
[["formId1","formId2",..."formIdN"],
["submitId1","submitId2",..."submitIdN"]]
}

bargadInstance.trackBotRiskAnalysis= {
enabled : true,
args : ["buttonId"]
}

bargadInstance.trackAllHTMLEvents = true;

bargadInstance.customClipboardEvents = true;

bargadInstance.trackDoNotTrack = true;

bargadInstance.trackKeyEvents = true;

bargadInstance.listAllElements = true;

bargadInstance.trackMouseEvents = true;

bargadInstance.trackAudio = true;

bargadInstance.trackCanvas = true;

bargadInstance.trackCookiesEnabled = true;

bargadInstance.trackDeviceMemory = true;

bargadInstance.trackDisplaySettings = true;

bargadInstance.trackDynamicScripts = true;

bargadInstance.trackFonts = true;

bargadInstance.trackGraphicCard = true;

bargadInstance.trackIP = true;

bargadInstance.trackBrowserLanguages = true;

bargadInstance.trackLocalStorageChanges = true;

bargadInstance.trackSessionStorageChanges = true;

bargadInstance.trackLocation = true;

bargadInstance.trackLongPressEvents = true;

bargadInstance.trackMediaDevices = true;

bargadInstance.trackNetInfo = true;

bargadInstance.trackNumberOfCores = true;

bargadInstance.trackOrientation = true;

bargadInstance.trackOS = true;

bargadInstance.trackPermissionsEnabled = true;

bargadInstance.trackPinchZoom = true;

bargadInstance.trackBrowserPlugins = true;

bargadInstance.trackPrintDialog = true;

bargadInstance.trackPrivateBrowsing = true;

bargadInstance.trackSpecialKeyEvents = true;

bargadInstance.trackTabEvents = true;

bargadInstance.trackTimeOnAllPages = true;

bargadInstance.trackTouchEvents = true;

bargadInstance.trackTimezone = true;

bargadInstance.trackUserAgent = true;
bargadInstance.trackWindowEvents = true;
bargadInstance.trackGyroEvents = true;
bargadInstance.trackLinearAcceleration = true;
VistorId can be fetched using the visitorId attribute in Bargad class instance
const visitorId = bargadInstance.visitorId;
console.log(visitorId);
Steps to build the package from source
code
1. Navigate to the code repository via terminal and install the NPM packages using the below command
$ npm install
2. Next run the below command to generate the webpack bundle
$ npx webpack