Contents

[Purpose and Objective 2](#_Toc201595065)

[Purpose: 2](#_Toc201595066)

[Objectives: 2](#_Toc201595067)

[Installation 3](#_Toc201595068)

[Getting Started 3](#_Toc201595069)

[Event List Information 5](#_Toc201595070)

**Bargad.AI Web SDK v1.0**

## Purpose and Objective

The **Bargad.AI Web SDK** is designed to seamlessly integrate advanced user behavior and risk analysis tracking into web applications with minimal setup effort. This SDK empowers developers and organizations to enhance the security, usability, and analytical capabilities of their digital platforms by capturing a wide range of user interaction and device-level data points.

## Purpose:

The primary purpose of the Bargad.AI Web SDK is to enable real-time behavioural intelligence and bot-risk detection within any client-facing web interface. By offering modular and easily configurable tracking options, the SDK serves as a plug-and-play tool for developers aiming to:

*   Monitor user interaction patterns such as mouse events, form usage, and key events.
*   Detect fraudulent or automated activities using bot risk analysis algorithms.
*   Collect environmental and device metadata (e.g., GPU info, memory, permissions).
*   Understand engagement through features like OTP attempt tracking and time spent on forms.

## Objectives:

*   **Ease of Integration**: Provide a lightweight and developer-friendly SDK that can be integrated with a few lines of code.
*   **Modular Feature Control**: Allow developers to selectively enable or disable tracking features based on privacy, compliance, or product requirements.
*   **Data-Rich Insights**: Capture granular details across hardware, browser, network, and user interaction vectors to feed into risk scoring engines or analytics dashboards.
*   **Security & Fraud Detection**: Equip digital platforms with advanced behavioral fingerprinting and bot detection mechanisms.
*   **Extensibility**: Offer scalable integration options to support diverse web frameworks and custom implementation needs.

With robust tracking capabilities and a simple API key-based configuration, the Bargad.AI Web SDK acts as a foundational layer for any platform seeking to balance usability, analytics, and security.

## Installation

Add the Bargad package provided to you to your project directory

## Getting Started

1.Importing the Bargad Package

Import the package from the path where the 'bargad-bundle.js' file is located.

import {Bargad} from './build-folder-name/bargad-bundle.js';

2\. Instantiate the Bargad object:

    let apiKey = "your-api-key ";

let isEnabled = true;

    let submitId = "submit-button-id";

let emailId = "email-input-id";

    let mobileId = "mobile-input -d";

    let capchaId = "checkbox-id"; (Can be given to any tag which interact with user);

    let otpAttempts = "verify-button-id";

const bargadInstance = new Bargad(apiKey, isEnabled, submitId, emailId, mobileId, capchaId, otpAttempts ); // send all the parameters in same order

3\. Once the BARGAD Object is instantiated, all the events as listed in the [below given documentation](#_Event_List_Information) are enabled.

In order to disable any feature, you may follow this procedure bargadInstance.customClipboardEvents = false;

The above example disables the clipboard events detection.

5\. After you are done customizing the features that you want disabled/enabled , you must call the following function in order to begin tracking :

bargadInstance.initialize()

6\. Finally, you must integrate this JS file as part of your HTML code, as per your project's framework allowance. For reference, given below is integration of the file 'test.js' is done in the HTML file's head tag :

<script type="module" src="test.js"></script>

## Event List Information

bargadInstance.trackOTPAttempts=true

bargadInstance.trackFormTime = true

bargadInstance.trackBotRiskAnalysis= true

bargadInstance.trackAllHTMLEvents = true;

bargadInstance.customClipboardEvents = true;

bargadInstance.trackDoNotTrack = true;

bargadInstance.trackKeyEvents = true;

bargadInstance.listAllElements = true;

bargadInstance.trackMouseEvents = true;

bargadInstance.trackAudio = true;

bargadInstance.trackCanvas = true;

bargadInstance.trackCookiesEnabled = true; bargadInstance.trackDeviceMemory = true;

bargadInstance.trackDisplaySettings = true; bargadInstance.trackDynamicScripts = true; bargadInstance.trackFonts = true;

bargadInstance.trackGraphicCard = true; bargadInstance.trackIP = true;

bargadInstance.trackBrowserLanguages = true; bargadInstance.trackLocalStorageChanges = true; bargadInstance.trackSessionStorageChanges = true; bargadInstance.trackLocation = true;

bargadInstance.trackLongPressEvents = true; bargadInstance.trackMediaDevices = true; bargadInstance.trackNetInfo = true;

bargadInstance.trackNumberOfCores = true; bargadInstance.trackOrientation = true; bargadInstance.trackOS = true;

bargadInstance.trackPermissionsEnabled = true; bargadInstance.trackPinchZoom = true; bargadInstance.trackBrowserPlugins = true; bargadInstance.trackPrintDialog = true; bargadInstance.trackPrivateBrowsing = true; bargadInstance.trackSpecialKeyEvents = true; bargadInstance.trackTabEvents = true; bargadInstance.trackTimeOnAllPages = true; bargadInstance.trackTouchEvents = true; bargadInstance.trackTimezone = true;

bargadInstance.trackUserAgent = true;

bargadInstance.trackWindowEvents = true;

bargadInstance.trackGyroEvents = true;

bargadInstance.trackLinearAcceleration = true;