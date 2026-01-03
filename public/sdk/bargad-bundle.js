// public/sdk/bargad-bundle.js
export class Bargad {
  constructor(apiKey, userId) {
    this.apiKey = apiKey;
    this.userId = userId;
    this.SDK = "Bargad-v1.0.0";  // ✅ SDK Version Variable

    // Feature flags (default OFF)
    this.trackFormTime = { enabled: false };
    this.trackKeypressEvents = false;
    this.customClipboardEvents = false;
    this.trackOTPAttempts = { enabled: false };
    this.trackLongPressEvents = false;
    this.trackTapEvents = false;
    this.trackScreenOrientation = false;
    this.trackDisplaySettings = false;
    this.trackSwipeEvents = false;
    this.trackPinchGestures = false;
    this.trackAmbientLight = false;
    this.trackDeviceLocation = false;
    this.trackGyroscope = false;
    this.trackProximitySensor = false;
    this.trackMotionEvents = false;
    this.trackAccelerometerEvents = false;
    this.trackDeviceScreenSize = false;
    this.trackDeviceID = false;
    this.trackIMEI = false;
    this.trackBluetoothDevices = false;
    this.trackCPUCores = false; 


    this.allEvents = []; // Array to store all emitted events
    this.eventCounter = 0; // Counter for total events
  }

  // Entry point
  initialize() {
    if (this.trackFormTime.enabled) {
      this.initFormTime();
    }

    if (this.trackKeypressEvents) {
      this.initKeypressEvents();
    }

    if (this.customClipboardEvents) {
      this.initClipboardEvents();
    }

    if (this.trackOTPAttempts.enabled) {
      this.initOTPAttempts();
    }

    if (this.trackLongPressEvents) {
      this.initLongPressEvents();
    }

    if (this.trackTapEvents) {
      this.initTapEvents();
    }

    if (this.trackScreenOrientation) {
      this.initScreenOrientation();
    }

    if (this.trackDisplaySettings) {
      this.initDisplaySettings();
    }

    if (this.trackSwipeEvents) {
      this.initSwipeEvents();
    }

    if (this.trackPinchGestures) {
      this.initPinchGestures();
    }

    if (this.trackAmbientLight) {
      this.initAmbientLight();
    }

    if (this.trackDeviceLocation) {
      this.initDeviceLocation();
    }

    if (this.trackGyroscope) {
      // ✅ ADD THIS
      this.initGyroscope();
    }

    if (this.trackProximitySensor) {
      this.initProximitySensor();
    }

    if (this.trackMotionEvents) {
      this.initMotionEvents();
    }

    if (this.trackAccelerometerEvents) {
      this.initAccelerometerEvents();
    }
     
    if (this.trackDeviceScreenSize) {
    this.initDeviceScreenSize();
    }
     
     if (this.trackDeviceID) {
    this.initDeviceID();
    }

      if (this.trackIMEI) {
    this.initIMEI();
  }
       
       if (this.trackBluetoothDevices) {
    this.initBluetoothDevices();
  }
     if (this.trackCPUCores) {  // ✅ ADD THIS
    this.initCPUCores();
  }

   

    this.initCopyButton();
  }

  // -------- FORM TIME --------
  initFormTime() {
    const [formIds, submitBtnIds] = this.trackFormTime.args;

    formIds.forEach((formId, index) => {
      const form = document.getElementById(formId);
      const submitBtn = document.getElementById(submitBtnIds[index]);

      if (!form || !submitBtn) {
        console.warn("FormTime: Invalid form or submit button ID");
        return;
      }

      let startTime = null;

      form.addEventListener("input", () => {
        if (!startTime) {
          startTime = Date.now();
        }
      });

      submitBtn.addEventListener("click", async () => {
        if (!startTime) return;

        const timeSpentMs = Date.now() - startTime;

        this.emit({
          type: "FORM_TIME",
          payload: { formId, timeSpentMs },
          timestamp: Date.now(),
          userId: this.userId,
        });

        // Emit keypress data
        if (this.trackKeypressEvents) {
          this.emitKeypressData();
        }

        // Emit clipboard data
        if (this.customClipboardEvents) {
          this.emitClipboardData();
        }

        if (this.trackLongPressEvents) {
          this.emitLongPressData();
        }

        if (this.trackTapEvents) {
          this.emitTapData();
        }

        if (this.trackSwipeEvents) {
          this.emitSwipeData();
        }

        // Emit screen orientation data
        if (this.trackScreenOrientation) {
          this.emitScreenOrientationData();
        }

        if (this.trackDisplaySettings) {
          this.emitDisplaySettingsData();
        }

        if (this.trackPinchGestures) {
          this.emitPinchData();
        }

        // ✅ FIXED: Added ambient light emission
        if (this.trackAmbientLight) {
          this.emitAmbientLightData();
        }

        // ✅ FIXED: Added device location emission with await
        if (this.trackDeviceLocation) {
          await this.emitDeviceLocationData();
        }

        if (this.trackGyroscope) {
          this.emitGyroscopeData();
        }

        if (this.trackProximitySensor) {
          this.emitProximityData();
        }

        if (this.trackMotionEvents) {
          this.emitMotionData();
        }

        if (this.trackAccelerometerEvents) {
          this.emitAccelerometerData();
        }

        if (this.trackDeviceScreenSize) {
    this.emitDeviceScreenSize();
  }
             
        if (this.trackDeviceID) {
    this.emitDeviceID();
  }


        if (this.trackIMEI) {
  this.emitIMEI();
}

         if (this.trackBluetoothDevices) {
  this.emitBluetoothDevices();
}

      if (this.trackCPUCores) {
    this.emitCPUCoresData();
  }

        startTime = null;
      });
    });
  }

  // -------- KEYPRESS EVENTS --------
  initKeypressEvents() {
    this.keypressData = {
      totalKeypresses: 0,
      backspaceCount: 0,
      deleteCount: 0,
      numericKeypressCount: 0,
      specialCharCount: 0,
      alphabeticKeypressCount: 0,
    };

    document.addEventListener("keydown", (event) => {
      this.keypressData.totalKeypresses++;

      const key = event.key;

      if (key === "Backspace") {
        this.keypressData.backspaceCount++;
        return;
      }

      if (key === "Delete") {
        this.keypressData.deleteCount++;
        return;
      }

      if (key >= "0" && key <= "9") {
        this.keypressData.numericKeypressCount++;
        return;
      }

      if (/[a-zA-Z]/.test(key)) {
        this.keypressData.alphabeticKeypressCount++;
        return;
      }

      if (key.length === 1) {
        this.keypressData.specialCharCount++;
      }
    });
  }

  emitKeypressData() {
    this.emit({
      type: "KEYPRESS",
      payload: { ...this.keypressData },
      timestamp: Date.now(),
      userId: this.userId,
    });

    // Reset counters
    this.keypressData = {
      totalKeypresses: 0,
      backspaceCount: 0,
      deleteCount: 0,
      numericKeypressCount: 0,
      specialCharCount: 0,
      alphabeticKeypressCount: 0,
    };
  }

  // -------- CLIPBOARD EVENTS --------
  initClipboardEvents() {
    this.clipboardData = {
      copyCount: 0,
      pasteCount: 0,
      cutCount: 0,
    };

    document.addEventListener("copy", () => {
      this.clipboardData.copyCount++;
    });

    document.addEventListener("paste", () => {
      this.clipboardData.pasteCount++;
    });

    document.addEventListener("cut", () => {
      this.clipboardData.cutCount++;
    });
  }

  emitClipboardData() {
    this.emit({
      type: "CLIPBOARD",
      payload: { ...this.clipboardData },
      timestamp: Date.now(),
      userId: this.userId,
    });

    // Reset counters
    this.clipboardData = {
      copyCount: 0,
      pasteCount: 0,
      cutCount: 0,
    };
  }

  // -------- OTP ATTEMPTS (ADVANCED FRAUD DETECTION) --------
initOTPAttempts() {
  const [otpButtonIds] = this.trackOTPAttempts.args;

  otpButtonIds.forEach((btnId) => {
    const otpBtn = document.getElementById(btnId);
    const otpInput = document.getElementById("otp");

    if (!otpBtn) {
      console.warn("OTPAttempts: Invalid button ID", btnId);
      return;
    }

    if (!otpInput) {
      console.warn("OTPAttempts: OTP input field not found");
      return;
    }

    // === TRACKING VARIABLES ===
    let verificationAttemptCount = 0;
    let fieldEditCount = 0;
    let lastOtpValue = "";
    let fieldFocusCount = 0;
    let backspaceCount = 0;
    let pasteDetected = false;
    let pasteTimestamp = null;

    // Keystroke timing
    const digitTimestamps = [];
    
    // Correction tracking
    const correctionPattern = [];
    
    // Focus tracking
    let focusLossCount = 0;
    const focusTimestamps = [];
    let lastBlurTime = null;
    let totalSwitchTime = 0;

    // === EVENT LISTENERS ===

    // 1. Track focus events
    otpInput.addEventListener("focus", () => {
      fieldFocusCount++;
      focusTimestamps.push({ event: "focus", time: Date.now() });
      
      // Calculate time spent outside field
      if (lastBlurTime) {
        const switchDuration = Date.now() - lastBlurTime;
        totalSwitchTime += switchDuration;
        console.log(`Returned to OTP field after ${switchDuration}ms`);
      }
      
      console.log(`OTP field focused (${fieldFocusCount} times)`);
    });

    // 2. Track blur events (context switching)
    otpInput.addEventListener("blur", () => {
      focusLossCount++;
      lastBlurTime = Date.now();
      focusTimestamps.push({ event: "blur", time: Date.now() });
      console.log(`OTP field lost focus (${focusLossCount} times)`);
    });

    // 3. Track paste events
    otpInput.addEventListener("paste", (e) => {
      pasteDetected = true;
      pasteTimestamp = Date.now();
      console.log("⚠️ OTP was pasted from clipboard");
    });

    // 4. Track backspace/delete
    otpInput.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        backspaceCount++;
        correctionPattern.push({
          position: otpInput.value.length,
          timestamp: Date.now()
        });
        console.log(`Backspace pressed (${backspaceCount} times)`);
      }
    });

    // 5. Track input changes and timing
    otpInput.addEventListener("input", (e) => {
      const currentValue = e.target.value;

      // Record timestamp for each digit
      if (currentValue.length > lastOtpValue.length) {
        digitTimestamps.push({
          digit: currentValue.length,
          timestamp: Date.now(),
          value: currentValue[currentValue.length - 1]
        });
        console.log(`Digit ${currentValue.length} entered:`, currentValue[currentValue.length - 1]);
      }

      // Count edits
      if (currentValue !== lastOtpValue) {
        fieldEditCount++;
        lastOtpValue = currentValue;
      }
    });

    // 6. Track verification button clicks
    otpBtn.addEventListener("click", () => {
      verificationAttemptCount++;

      const otpLength = otpInput.value.length;

      // Calculate all metrics
      const keystrokeTiming = this.calculateKeystrokeTiming(digitTimestamps);
      const hesitationAnalysis = this.analyzeHesitation(keystrokeTiming, fieldEditCount, otpLength);
      const typingCadence = this.calculateTypingCadence(keystrokeTiming.intervals);
      const correctionBehavior = this.analyzeCorrectionBehavior(backspaceCount, correctionPattern, otpLength);
      const contextSwitching = this.analyzeContextSwitching(focusLossCount, focusTimestamps, totalSwitchTime);
      const fraudScore = this.calculateOTPFraudScore({
        keystrokeTiming,
        typingCadence,
        correctionBehavior,
        contextSwitching,
        pasteDetected,
        backspaceCount,
        otpLength
      });

      // Emit comprehensive OTP event
      this.emit({
        type: "OTP_ATTEMPT",
        payload: {
          // Basic metrics
          verificationAttempts: verificationAttemptCount,
          verificationAttemptType: verificationAttemptCount === 1 ? "SINGLE" : "MULTIPLE",
          fieldEditCount: fieldEditCount,
          fieldFocusCount: fieldFocusCount,
          currentOtpValue: otpInput.value,
          otpLength: otpLength,

          // Advanced metrics
          keystrokeTiming: keystrokeTiming,
          hesitationAnalysis: hesitationAnalysis,
          typingCadence: typingCadence,
          correctionBehavior: correctionBehavior,
          contextSwitching: contextSwitching,
          pasteDetection: {
            pasteDetected: pasteDetected,
            pasteTimestamp: pasteTimestamp
          },
          fraudScore: fraudScore,

          attemptTimestamp: Date.now()
        },
        timestamp: Date.now(),
        userId: this.userId
      });

      console.log("=== OTP ATTEMPT SUMMARY ===");
      console.log(`Attempt #${verificationAttemptCount}`);
      console.log(`Fraud Score: ${fraudScore.score}/100 (${fraudScore.level})`);
      console.log(`Reasons:`, fraudScore.reasons);
      console.log("===========================");
    });
  });
}

// === HELPER METHODS ===

// Calculate keystroke timing intervals
calculateKeystrokeTiming(digitTimestamps) {
  if (digitTimestamps.length < 2) {
    return {
      avgInterval: null,
      minInterval: null,
      maxInterval: null,
      totalEntryTime: null,
      intervals: [],
      variance: null
    };
  }

  const intervals = [];
  for (let i = 1; i < digitTimestamps.length; i++) {
    intervals.push(digitTimestamps[i].timestamp - digitTimestamps[i - 1].timestamp);
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const minInterval = Math.min(...intervals);
  const maxInterval = Math.max(...intervals);
  const totalEntryTime = digitTimestamps[digitTimestamps.length - 1].timestamp - digitTimestamps[0].timestamp;
  const variance = this.calculateVariance(intervals);

  return {
    avgInterval: Math.round(avgInterval),
    minInterval: minInterval,
    maxInterval: maxInterval,
    totalEntryTime: totalEntryTime,
    intervals: intervals,
    variance: Math.round(variance)
  };
}

// Analyze hesitation patterns
analyzeHesitation(keystrokeTiming, fieldEditCount, otpLength) {
  const DECISION_THRESHOLD = 1500; // 1.5 seconds

  if (!keystrokeTiming.intervals || keystrokeTiming.intervals.length === 0) {
    return {
      hesitationCount: 0,
      maxHesitation: null,
      hesitationPattern: "UNKNOWN",
      hesitationIndicator: "UNKNOWN"
    };
  }

  const hesitationPoints = keystrokeTiming.intervals.filter(interval => interval > DECISION_THRESHOLD);
  
  let hesitationPattern;
  if (hesitationPoints.length === 0) {
    hesitationPattern = "NO_HESITATION";
  } else if (hesitationPoints.length === 1 && hesitationPoints[0] > 2000) {
    hesitationPattern = "SINGLE_CHECK";
  } else if (hesitationPoints.length >= 3) {
    hesitationPattern = "MULTIPLE_CHECKS";
  } else {
    hesitationPattern = "NORMAL";
  }

  // Calculate hesitation indicator based on edit count
  const expectedEdits = otpLength + 2;
  const extraEdits = fieldEditCount - expectedEdits;
  let hesitationIndicator;
  
  if (extraEdits <= 2) {
    hesitationIndicator = "LOW";
  } else if (extraEdits <= 6) {
    hesitationIndicator = "MEDIUM";
  } else {
    hesitationIndicator = "HIGH";
  }

  return {
    hesitationCount: hesitationPoints.length,
    maxHesitation: keystrokeTiming.maxInterval,
    hesitationPattern: hesitationPattern,
    hesitationIndicator: hesitationIndicator
  };
}

// Calculate typing cadence (bot detection)
calculateTypingCadence(intervals) {
  if (!intervals || intervals.length < 2) {
    return {
      variance: null,
      coefficientOfVariation: null,
      cadenceType: "UNKNOWN",
      rhythmScore: null
    };
  }

  const variance = this.calculateVariance(intervals);
  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const coefficientOfVariation = Math.sqrt(variance) / mean;

  let cadenceType;
  if (coefficientOfVariation < 0.2) {
    cadenceType = "BOT_LIKE"; // Too consistent
  } else if (coefficientOfVariation > 0.6) {
    cadenceType = "ERRATIC"; // Too inconsistent
  } else {
    cadenceType = "HUMAN_NORMAL";
  }

  // Rhythm score: 1-10 (higher = more human-like)
  const rhythmScore = Math.min(10, Math.max(1, coefficientOfVariation * 15));

  return {
    variance: Math.round(variance),
    coefficientOfVariation: parseFloat(coefficientOfVariation.toFixed(2)),
    cadenceType: cadenceType,
    rhythmScore: parseFloat(rhythmScore.toFixed(1))
  };
}

// Analyze correction behavior
analyzeCorrectionBehavior(backspaceCount, correctionPattern, otpLength) {
  const correctionRate = otpLength > 0 ? backspaceCount / otpLength : 0;

  // Detect rapid deletions (guessing indicator)
  let rapidDeletions = 0;
  for (let i = 1; i < correctionPattern.length; i++) {
    const timeDiff = correctionPattern[i].timestamp - correctionPattern[i - 1].timestamp;
    if (timeDiff < 200) {
      rapidDeletions++;
    }
  }

  return {
    totalBackspaces: backspaceCount,
    correctionRate: parseFloat(correctionRate.toFixed(2)),
    rapidDeletions: rapidDeletions,
    correctionPattern: correctionPattern
  };
}

// Analyze context switching
analyzeContextSwitching(focusLossCount, focusTimestamps, totalSwitchTime) {
  let suspicionLevel;
  
  if (focusLossCount === 0) {
    suspicionLevel = "AUTO_FILL_RISK"; // Never left field - might be autofill/bot
  } else if (focusLossCount <= 2) {
    suspicionLevel = "NORMAL"; // Normal - checked SMS once or twice
  } else {
    suspicionLevel = "SUSPICIOUS"; // Too many switches
  }

  return {
    focusLosses: focusLossCount,
    focusGains: focusTimestamps.filter(f => f.event === "focus").length,
    totalSwitchTime: totalSwitchTime,
    suspicionLevel: suspicionLevel
  };
}

// Calculate fraud score
calculateOTPFraudScore(data) {
  let fraudScore = 0;
  let reasons = [];

  const { keystrokeTiming, typingCadence, correctionBehavior, contextSwitching, pasteDetected, backspaceCount, otpLength } = data;

  // 1. Check typing speed (bot detection)
  if (keystrokeTiming.avgInterval !== null && keystrokeTiming.avgInterval < 50) {
    fraudScore += 40;
    reasons.push("Bot-like typing speed (<50ms)");
  } else if (keystrokeTiming.avgInterval !== null && keystrokeTiming.avgInterval < 150) {
    fraudScore += 20;
    reasons.push("Suspiciously fast typing");
  } else {
    reasons.push("Normal typing speed");
  }

  // 2. Check cadence consistency
  if (typingCadence.cadenceType === "BOT_LIKE") {
    fraudScore += 30;
    reasons.push("Unnatural typing rhythm (bot suspected)");
  } else if (typingCadence.cadenceType === "ERRATIC") {
    fraudScore += 10;
    reasons.push("Erratic typing pattern");
  } else {
    reasons.push("Human-like rhythm");
  }

  // 3. Check for paste
  if (pasteDetected) {
    fraudScore += 20;
    reasons.push("OTP was pasted (clipboard usage)");
  }

  // 4. Check correction rate (guessing indicator)
  if (correctionBehavior.correctionRate > 0.5) {
    fraudScore += 30;
    reasons.push("High correction rate (guessing suspected)");
  } else if (correctionBehavior.correctionRate === 0 && keystrokeTiming.avgInterval !== null && keystrokeTiming.avgInterval < 100) {
    fraudScore += 25;
    reasons.push("Zero errors with fast typing (automation)");
  }

  // 5. Check rapid deletions
  if (correctionBehavior.rapidDeletions > 2) {
    fraudScore += 15;
    reasons.push("Rapid deletions detected (trial-and-error)");
  }

  // 6. Check context switching
  if (contextSwitching.suspicionLevel === "AUTO_FILL_RISK") {
    fraudScore += 15;
    reasons.push("No context switching (autofill suspected)");
  } else if (contextSwitching.suspicionLevel === "SUSPICIOUS") {
    fraudScore += 20;
    reasons.push("Excessive context switching");
  } else {
    reasons.push("Normal SMS checking behavior");
  }

  // 7. Check hesitation pattern (if available)
  if (data.hesitationAnalysis && data.hesitationAnalysis.hesitationPattern === "MULTIPLE_CHECKS") {
    fraudScore += 15;
    reasons.push("Multiple long hesitations");
  }

  // Determine risk level
  let level;
  if (fraudScore < 30) {
    level = "LOW_RISK";
  } else if (fraudScore < 60) {
    level = "MEDIUM_RISK";
  } else {
    level = "HIGH_RISK";
  }

  return {
    score: fraudScore,
    level: level,
    reasons: reasons,
    confidence: Math.min(0.99, (fraudScore / 100) * 1.2) // Confidence score
  };
}

// Helper: Calculate variance
calculateVariance(values) {
  if (values.length < 2) return 0;
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}


  // -------- LONG PRESS EVENTS --------
  initLongPressEvents() {
    this.longPressData = {
      longPressCount: 0,
      longPressCoordinates: [],
    };

    let pressTimer = null;
    let startX = 0;
    let startY = 0;
    let isLongPress = false;
    const LONG_PRESS_DURATION = 500; // 500ms to qualify as long press

    // Handle mouse events (desktop)
    const handleMouseDown = (e) => {
      startX = e.clientX;
      startY = e.clientY;
      isLongPress = false;

      pressTimer = setTimeout(() => {
        isLongPress = true;
        this.recordLongPress(startX, startY);
      }, LONG_PRESS_DURATION);
    };

    const handleMouseUp = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    const handleMouseMove = (e) => {
      // Cancel if user moves mouse too much during press
      const moveThreshold = 10; // pixels
      const deltaX = Math.abs(e.clientX - startX);
      const deltaY = Math.abs(e.clientY - startY);

      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      }
    };

    // Handle touch events (mobile)
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isLongPress = false;

        pressTimer = setTimeout(() => {
          isLongPress = true;
          this.recordLongPress(startX, startY);
        }, LONG_PRESS_DURATION);
      }
    };

    const handleTouchEnd = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const moveThreshold = 10;
        const deltaX = Math.abs(e.touches[0].clientX - startX);
        const deltaY = Math.abs(e.touches[0].clientY - startY);

        if (deltaX > moveThreshold || deltaY > moveThreshold) {
          if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
          }
        }
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchmove", handleTouchMove);
  }

  recordLongPress(x, y) {
    this.longPressData.longPressCount++;
    this.longPressData.longPressCoordinates.push({ x, y });
    console.log("Long press detected at (" + x + ", " + y + ")");
  }

  emitLongPressData() {
    this.emit({
      type: "LONG_PRESS",
      payload: { ...this.longPressData },
      timestamp: Date.now(),
      userId: this.userId,
    });

    // Reset counters
    this.longPressData = {
      longPressCount: 0,
      longPressCoordinates: [],
    };
  }

  // -------- TAP EVENTS --------
  initTapEvents() {
    this.tapData = {
      totalTaps: 0,
      tapCoordinates: [],
    };

    let pressStartTime = null;
    let startX = 0;
    let startY = 0;
    const TAP_MAX_DURATION = 500;

    // DESKTOP TRACKING: Mouse Events
    const handleMouseDown = (e) => {
      pressStartTime = Date.now();
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseUp = (e) => {
      const pressDuration = Date.now() - pressStartTime;

      if (pressDuration < TAP_MAX_DURATION) {
        const moveThreshold = 10;
        const deltaX = Math.abs(e.clientX - startX);
        const deltaY = Math.abs(e.clientY - startY);

        if (deltaX < moveThreshold && deltaY < moveThreshold) {
          this.recordTap(e.clientX, e.clientY);
        }
      }

      pressStartTime = null;
    };

    // MOBILE TRACKING: Touch Events
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        pressStartTime = Date.now();
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e) => {
      if (!pressStartTime) return;

      const pressDuration = Date.now() - pressStartTime;

      if (pressDuration < TAP_MAX_DURATION) {
        if (e.changedTouches.length > 0) {
          const endX = e.changedTouches[0].clientX;
          const endY = e.changedTouches[0].clientY;
          const moveThreshold = 10;
          const deltaX = Math.abs(endX - startX);
          const deltaY = Math.abs(endY - startY);

          if (deltaX < moveThreshold && deltaY < moveThreshold) {
            this.recordTap(endX, endY);
          }
        }
      }

      pressStartTime = null;
    };

    // ATTACH EVENT LISTENERS
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
  }

  recordTap(x, y) {
    this.tapData.totalTaps++;
    this.tapData.tapCoordinates.push({ x, y });
    console.log(
      "Tap #" + this.tapData.totalTaps + " at (" + x + ", " + y + ")"
    );
  }

  emitTapData() {
    this.emit({
      type: "TAP_EVENTS",
      payload: { ...this.tapData },
      timestamp: Date.now(),
      userId: this.userId,
    });

    // Reset after sending
    this.tapData = {
      totalTaps: 0,
      tapCoordinates: [],
    };
  }

  // -------- SWIPE EVENTS (FLING EVENTS) --------
  initSwipeEvents() {
    console.log("initSwipeEvents() called - Swipe tracking starting...");

    // STEP 1: Create storage for swipe data
    this.swipeData = {
      totalSwipes: 0,
      swipeLeft: 0,
      swipeRight: 0,
      swipeUp: 0,
      swipeDown: 0,
      swipeDetails: [],
    };

    console.log("swipeData initialized:", this.swipeData);

    // STEP 2: Variables to track swipe
    let swipeStartX = 0;
    let swipeStartY = 0;
    let swipeStartTime = 0;
    let isSwiping = false;

    // STEP 3: Swipe detection thresholds
    const SWIPE_MIN_DISTANCE = 50;
    const SWIPE_MAX_TIME = 1000;
    const SWIPE_VELOCITY_THRESHOLD = 0.3;

    // DESKTOP TRACKING: Mouse Events
    const handleMouseDown = (e) => {
      swipeStartX = e.clientX;
      swipeStartY = e.clientY;
      swipeStartTime = Date.now();
      isSwiping = true;
    };

    const handleMouseMove = (e) => {
      if (!isSwiping) return;
    };

    const handleMouseUp = (e) => {
      if (!isSwiping) return;

      const swipeEndX = e.clientX;
      const swipeEndY = e.clientY;
      const swipeEndTime = Date.now();

      const deltaX = swipeEndX - swipeStartX;
      const deltaY = swipeEndY - swipeStartY;
      const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const swipeDuration = swipeEndTime - swipeStartTime;
      const swipeVelocity = totalDistance / swipeDuration;

      const isValidSwipe =
        totalDistance >= SWIPE_MIN_DISTANCE &&
        swipeDuration <= SWIPE_MAX_TIME &&
        swipeVelocity >= SWIPE_VELOCITY_THRESHOLD;

      if (isValidSwipe) {
        const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
        let direction;

        if (isHorizontalSwipe) {
          direction = deltaX > 0 ? "right" : "left";
        } else {
          direction = deltaY > 0 ? "down" : "up";
        }

        this.recordSwipe(direction, {
          distance: totalDistance.toFixed(2),
          duration: swipeDuration,
          velocity: swipeVelocity.toFixed(3),
          startX: swipeStartX,
          startY: swipeStartY,
          endX: swipeEndX,
          endY: swipeEndY,
        });
      }

      isSwiping = false;
    };

    // MOBILE TRACKING: Touch Events
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        swipeStartX = e.touches[0].clientX;
        swipeStartY = e.touches[0].clientY;
        swipeStartTime = Date.now();
        isSwiping = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isSwiping) return;
    };

    const handleTouchEnd = (e) => {
      if (!isSwiping) return;

      if (e.changedTouches.length > 0) {
        const swipeEndX = e.changedTouches[0].clientX;
        const swipeEndY = e.changedTouches[0].clientY;
        const swipeEndTime = Date.now();

        const deltaX = swipeEndX - swipeStartX;
        const deltaY = swipeEndY - swipeStartY;
        const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        const swipeDuration = swipeEndTime - swipeStartTime;
        const swipeVelocity = totalDistance / swipeDuration;

        const isValidSwipe =
          totalDistance >= SWIPE_MIN_DISTANCE &&
          swipeDuration <= SWIPE_MAX_TIME &&
          swipeVelocity >= SWIPE_VELOCITY_THRESHOLD;

        if (isValidSwipe) {
          const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
          let direction;

          if (isHorizontalSwipe) {
            direction = deltaX > 0 ? "right" : "left";
          } else {
            direction = deltaY > 0 ? "down" : "up";
          }

          this.recordSwipe(direction, {
            distance: totalDistance.toFixed(2),
            duration: swipeDuration,
            velocity: swipeVelocity.toFixed(3),
            startX: swipeStartX,
            startY: swipeStartY,
            endX: swipeEndX,
            endY: swipeEndY,
          });
        }

        isSwiping = false;
      }
    };

    // ATTACH EVENT LISTENERS
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);
  }

  recordSwipe(direction, details) {
    if (!this.swipeData) {
      console.error("swipeData not initialized!");
      return;
    }

    this.swipeData.totalSwipes++;

    switch (direction) {
      case "left":
        this.swipeData.swipeLeft++;
        break;
      case "right":
        this.swipeData.swipeRight++;
        break;
      case "up":
        this.swipeData.swipeUp++;
        break;
      case "down":
        this.swipeData.swipeDown++;
        break;
    }

    this.swipeData.swipeDetails.push({
      direction: direction,
      ...details,
      timestamp: Date.now(),
    });

    console.log(
      "Swipe " +
        direction.toUpperCase() +
        " detected! Distance: " +
        details.distance +
        "px, Duration: " +
        details.duration +
        "ms, Velocity: " +
        details.velocity +
        "px/ms"
    );
    console.log("Current swipeData:", this.swipeData);
  }

  emitSwipeData() {
    console.log("emitSwipeData() called");
    console.log("Current swipeData:", this.swipeData);

    if (!this.swipeData) {
      console.warn("swipeData does not exist! Initializing empty data...");
      this.swipeData = {
        totalSwipes: 0,
        swipeLeft: 0,
        swipeRight: 0,
        swipeUp: 0,
        swipeDown: 0,
        swipeDetails: [],
      };
    }

    this.emit({
      type: "SWIPE_EVENTS",
      payload: { ...this.swipeData },
      timestamp: Date.now(),
      userId: this.userId,
    });

    // Reset counters after emitting
    this.swipeData = {
      totalSwipes: 0,
      swipeLeft: 0,
      swipeRight: 0,
      swipeUp: 0,
      swipeDown: 0,
      swipeDetails: [],
    };
  }

  // -------- SCREEN ORIENTATION --------
  initScreenOrientation() {
    // STEP 1: Create storage for orientation data
    this.orientationData = {
      currentOrientation: null,
      initialOrientation: null,
      orientationChanges: 0,
      orientationHistory: [],
    };

    // STEP 2: Function to get current orientation
    const getCurrentOrientation = () => {
      // Method 1: Modern browsers with Screen Orientation API
      if (window.screen.orientation) {
        const type = window.screen.orientation.type;
        // Simplify to just "portrait" or "landscape"
        if (type.includes("portrait")) {
          return "portrait";
        } else if (type.includes("landscape")) {
          return "landscape";
        }
      }

      // Method 2: Fallback for older browsers
      // Check if height > width = portrait, else landscape
      if (window.innerHeight > window.innerWidth) {
        return "portrait";
      } else {
        return "landscape";
      }
    };

    // STEP 3: Record initial orientation when SDK starts
    const initialOrientation = getCurrentOrientation();
    this.orientationData.currentOrientation = initialOrientation;
    this.orientationData.initialOrientation = initialOrientation;
    console.log("Initial orientation: " + initialOrientation);

    // STEP 4: Listen for orientation changes
    const handleOrientationChange = () => {
      const newOrientation = getCurrentOrientation();

      // Only record if orientation actually changed
      if (newOrientation !== this.orientationData.currentOrientation) {
        // Update current orientation
        const oldOrientation = this.orientationData.currentOrientation;
        this.orientationData.currentOrientation = newOrientation;

        // Increment change counter
        this.orientationData.orientationChanges++;

        // Record this change in history
        this.orientationData.orientationHistory.push({
          from: oldOrientation,
          to: newOrientation,
          timestamp: Date.now(),
        });

        // Log the change
        console.log(
          "Orientation changed: " + oldOrientation + " -> " + newOrientation
        );
      }
    };

    // STEP 5: Attach event listeners
    // Modern API: Listen to screen.orientation change
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener(
        "change",
        handleOrientationChange
      );
    }

    // Fallback: Listen to window resize (works on older browsers)
    // When device rotates, window dimensions change
    window.addEventListener("resize", handleOrientationChange);

    // Alternative: Listen to orientationchange event (deprecated but still works)
    window.addEventListener("orientationchange", handleOrientationChange);
  }

  emitScreenOrientationData() {
    this.emit({
      type: "SCREEN_ORIENTATION",
      payload: { ...this.orientationData },
      timestamp: Date.now(),
      userId: this.userId,
    });
  }

  // -------- DISPLAY SETTINGS --------
  initDisplaySettings() {
    // STEP 1: Collect all display information
    this.displayData = {};

    // SCREEN DIMENSIONS
    this.displayData.screenWidth = window.screen.width;
    this.displayData.screenHeight = window.screen.height;
    this.displayData.availableWidth = window.screen.availWidth;
    this.displayData.availableHeight = window.screen.availHeight;

    // VIEWPORT/WINDOW DIMENSIONS
    this.displayData.windowWidth = window.innerWidth;
    this.displayData.windowHeight = window.innerHeight;
    this.displayData.outerWidth = window.outerWidth;
    this.displayData.outerHeight = window.outerHeight;

    // COLOR & PIXEL INFORMATION
    this.displayData.colorDepth = window.screen.colorDepth;
    this.displayData.pixelDepth = window.screen.pixelDepth;
    this.displayData.devicePixelRatio = window.devicePixelRatio || 1;

    // CALCULATED METRICS
    this.displayData.totalPixels =
      this.displayData.screenWidth * this.displayData.screenHeight;

    // Screen aspect ratio
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(
      this.displayData.screenWidth,
      this.displayData.screenHeight
    );
    const aspectWidth = this.displayData.screenWidth / divisor;
    const aspectHeight = this.displayData.screenHeight / divisor;
    this.displayData.aspectRatio = aspectWidth + ":" + aspectHeight;

    // Is browser fullscreen?
    this.displayData.isFullscreen =
      window.innerWidth === window.screen.width &&
      window.innerHeight === window.screen.height;

    // SCREEN ORIENTATION from screen object
    if (window.screen.orientation) {
      this.displayData.orientationType = window.screen.orientation.type;
      this.displayData.orientationAngle = window.screen.orientation.angle;
    } else {
      this.displayData.orientationType = "unknown";
      this.displayData.orientationAngle = window.orientation || 0;
    }

    // DISPLAY MODE
    this.displayData.displayMode = "browser";
    if (window.matchMedia) {
      if (window.matchMedia("(display-mode: fullscreen)").matches) {
        this.displayData.displayMode = "fullscreen";
      } else if (window.matchMedia("(display-mode: standalone)").matches) {
        this.displayData.displayMode = "standalone"; // PWA
      } else if (window.matchMedia("(display-mode: minimal-ui)").matches) {
        this.displayData.displayMode = "minimal-ui";
      }
    }

    // TOUCH CAPABILITY
    this.displayData.touchSupport = {
      hasTouchScreen: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
    };

    // ADDITIONAL METRICS
    const diagonalPixels = Math.sqrt(
      Math.pow(this.displayData.screenWidth, 2) +
        Math.pow(this.displayData.screenHeight, 2)
    );
    const dpi = 96 * this.displayData.devicePixelRatio;
    this.displayData.estimatedScreenSizeInches = (diagonalPixels / dpi).toFixed(
      2
    );

    // Device category
    if (this.displayData.screenWidth < 768) {
      this.displayData.deviceCategory = "mobile";
    } else if (this.displayData.screenWidth < 1024) {
      this.displayData.deviceCategory = "tablet";
    } else {
      this.displayData.deviceCategory = "desktop";
    }

    console.log("Display Settings Captured:", this.displayData);
  }

  emitDisplaySettingsData() {
    this.emit({
      type: "DISPLAY_SETTINGS",
      payload: { ...this.displayData },
      timestamp: Date.now(),
      userId: this.userId,
    });
  }

  // -------- PINCH GESTURES (ZOOM) --------
  initPinchGestures() {
    console.log("initPinchGestures() called - Pinch tracking starting...");

    // STEP 1: Create storage for pinch data
    this.pinchData = {
      totalPinches: 0,
      pinchInCount: 0,
      pinchOutCount: 0,
      pinchDetails: [],
    };

    console.log("pinchData initialized:", this.pinchData);

    // STEP 2: Variables to track pinch
    let initialDistance = 0;
    let isPinching = false;
    let pinchStartTime = 0;

    // STEP 3: Helper function to calculate distance between two touch points
    const getDistance = (touch1, touch2) => {
      const deltaX = touch2.clientX - touch1.clientX;
      const deltaY = touch2.clientY - touch1.clientY;
      return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    };

    // STEP 4: Helper function to get center point between two touches
    const getCenterPoint = (touch1, touch2) => {
      return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
    };

    // TOUCH EVENT HANDLERS
    const handleTouchStart = (e) => {
      // Only track if exactly 2 fingers are touching
      if (e.touches.length === 2) {
        e.preventDefault();
        initialDistance = getDistance(e.touches[0], e.touches[1]);
        isPinching = true;
        pinchStartTime = Date.now();
        console.log(
          "Pinch started - Initial distance: " +
            initialDistance.toFixed(2) +
            "px"
        );
      }
    };

    const handleTouchMove = (e) => {
      if (isPinching && e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const scale = currentDistance / initialDistance;
        console.log("Pinching... Scale: " + scale.toFixed(2) + "x");
      }
    };

    const handleTouchEnd = (e) => {
      if (!isPinching) return;

      if (e.touches.length < 2) {
        if (e.changedTouches.length > 0) {
          let finalDistance;

          if (e.touches.length === 1) {
            finalDistance = getDistance(e.touches[0], e.changedTouches[0]);
          } else {
            finalDistance = initialDistance;
          }

          const scale = finalDistance / initialDistance;
          const pinchDuration = Date.now() - pinchStartTime;

          const PINCH_THRESHOLD = 0.1;
          if (Math.abs(scale - 1.0) > PINCH_THRESHOLD) {
            let pinchType = scale > 1.0 ? "pinch-out" : "pinch-in";

            const centerPoint =
              e.touches.length === 1
                ? getCenterPoint(e.touches[0], e.changedTouches[0])
                : { x: 0, y: 0 };

            this.recordPinch(pinchType, {
              scale: scale.toFixed(2),
              initialDistance: initialDistance.toFixed(2),
              finalDistance: finalDistance.toFixed(2),
              duration: pinchDuration,
              centerX: Math.round(centerPoint.x),
              centerY: Math.round(centerPoint.y),
            });
          }

          isPinching = false;
          initialDistance = 0;
        }
      }
    };

    // ATTACH EVENT LISTENERS
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    console.log("Pinch gesture listeners attached");
  }

  recordPinch(pinchType, details) {
    this.pinchData.totalPinches++;

    if (pinchType === "pinch-in") {
      this.pinchData.pinchInCount++;
    } else if (pinchType === "pinch-out") {
      this.pinchData.pinchOutCount++;
    }

    this.pinchData.pinchDetails.push({
      type: pinchType,
      ...details,
      timestamp: Date.now(),
    });

    const direction =
      pinchType === "pinch-out" ? "OUT (Zoom In)" : "IN (Zoom Out)";
    console.log(
      "Pinch " +
        direction +
        " detected! Scale: " +
        details.scale +
        "x, Duration: " +
        details.duration +
        "ms"
    );
  }

  emitPinchData() {
    if (!this.pinchData) {
      this.pinchData = {
        totalPinches: 0,
        pinchInCount: 0,
        pinchOutCount: 0,
        pinchDetails: [],
      };
    }

    this.emit({
      type: "PINCH_GESTURES",
      payload: { ...this.pinchData },
      timestamp: Date.now(),
      userId: this.userId,
    });

    // Reset counters after emitting
    this.pinchData = {
      totalPinches: 0,
      pinchInCount: 0,
      pinchOutCount: 0,
      pinchDetails: [],
    };
  }

  // -------- AMBIENT LIGHT SENSOR --------
  initAmbientLight() {
    console.log(
      "initAmbientLight() called - Light sensor tracking starting..."
    );

    // STEP 1: Create storage for light data
    this.lightData = {
      supported: false,
      currentLightLevel: null,
      initialLightLevel: null,
      minLightLevel: null,
      maxLightLevel: null,
      averageLightLevel: null,
      lightChanges: 0,
      lightReadings: [],
      lightCategory: null,
    };

    // STEP 2: Check if Ambient Light Sensor API is supported
    if ("AmbientLightSensor" in window) {
      console.log("AmbientLight Sensor API supported!");
      this.lightData.supported = true;

      try {
        // STEP 3: Create sensor instance
        const sensor = new AmbientLightSensor();

        // STEP 4: Listen for light level readings
        sensor.addEventListener("reading", () => {
          const lightLevel = sensor.illuminance;
          console.log("Light level: " + lightLevel.toFixed(2) + " lux");
          this.recordLightReading(lightLevel);
        });

        // STEP 5: Handle errors
        sensor.addEventListener("error", (event) => {
          console.error(
            "Light sensor error:",
            event.error.name,
            event.error.message
          );
          if (event.error.name === "NotAllowedError") {
            console.warn("Light sensor permission denied by user");
          } else if (event.error.name === "NotReadableError") {
            console.warn("Light sensor not available or already in use");
          }
        });

        // STEP 6: Start the sensor
        sensor.start();
        console.log("Ambient light sensor started");
      } catch (error) {
        console.error("Failed to initialize light sensor:", error);
        this.lightData.supported = false;
      }
    } else if ("ondevicelight" in window) {
      // STEP 7: Fallback - Legacy API (older devices)
      console.log("Using legacy devicelight event");
      this.lightData.supported = true;

      window.addEventListener("devicelight", (event) => {
        const lightLevel = event.value;
        console.log("Light level (legacy): " + lightLevel.toFixed(2) + " lux");
        this.recordLightReading(lightLevel);
      });
    } else {
      // STEP 8: Light sensor not supported
      console.warn("Ambient Light Sensor NOT supported on this device/browser");
      this.lightData.supported = false;
      this.lightData.currentLightLevel = "NOT_SUPPORTED";
      this.lightData.lightCategory = "NOT_SUPPORTED";
    }
  }

  recordLightReading(lightLevel) {
    // STEP 1: Set initial light level (first reading)
    if (this.lightData.initialLightLevel === null) {
      this.lightData.initialLightLevel = lightLevel;
    }

    // STEP 2: Update current light level
    const previousLevel = this.lightData.currentLightLevel;
    this.lightData.currentLightLevel = lightLevel;

    // STEP 3: Track min/max light levels
    if (
      this.lightData.minLightLevel === null ||
      lightLevel < this.lightData.minLightLevel
    ) {
      this.lightData.minLightLevel = lightLevel;
    }
    if (
      this.lightData.maxLightLevel === null ||
      lightLevel > this.lightData.maxLightLevel
    ) {
      this.lightData.maxLightLevel = lightLevel;
    }

    // STEP 4: Count light changes (if light changed significantly)
    if (previousLevel !== null) {
      const changeThreshold = 50; // Lux difference to count as change
      if (Math.abs(lightLevel - previousLevel) > changeThreshold) {
        this.lightData.lightChanges++;
      }
    }

    // STEP 5: Store reading in history (limit to last 20 readings)
    this.lightData.lightReadings.push({
      lux: lightLevel,
      timestamp: Date.now(),
    });

    // Keep only last 20 readings to avoid memory issues
    if (this.lightData.lightReadings.length > 20) {
      this.lightData.lightReadings.shift(); // Remove oldest
    }

    // STEP 6: Calculate average light level
    const sum = this.lightData.lightReadings.reduce(
      (acc, reading) => acc + reading.lux,
      0
    );
    this.lightData.averageLightLevel =
      sum / this.lightData.lightReadings.length;

    // STEP 7: Categorize light level
    if (lightLevel < 10) {
      this.lightData.lightCategory = "very-dark";
    } else if (lightLevel < 50) {
      this.lightData.lightCategory = "dark";
    } else if (lightLevel < 200) {
      this.lightData.lightCategory = "dim";
    } else if (lightLevel < 1000) {
      this.lightData.lightCategory = "normal";
    } else if (lightLevel < 10000) {
      this.lightData.lightCategory = "bright";
    } else {
      this.lightData.lightCategory = "very-bright";
    }
  }

  emitAmbientLightData() {
    console.log("emitAmbientLightData() called");
    console.log("Current lightData:", this.lightData);

    if (!this.lightData) {
      console.warn("lightData does not exist! Initializing empty data...");
      this.lightData = {
        supported: false,
        currentLightLevel: "NOT_INITIALIZED",
        lightCategory: "NOT_INITIALIZED",
      };
    }

    const cleanedData = {
      ...this.lightData,
      currentLightLevel:
        this.lightData.currentLightLevel !== null &&
        typeof this.lightData.currentLightLevel === "number"
          ? parseFloat(this.lightData.currentLightLevel.toFixed(2))
          : this.lightData.currentLightLevel,
      initialLightLevel:
        this.lightData.initialLightLevel !== null
          ? parseFloat(this.lightData.initialLightLevel.toFixed(2))
          : null,
      minLightLevel:
        this.lightData.minLightLevel !== null
          ? parseFloat(this.lightData.minLightLevel.toFixed(2))
          : null,
      maxLightLevel:
        this.lightData.maxLightLevel !== null
          ? parseFloat(this.lightData.maxLightLevel.toFixed(2))
          : null,
      averageLightLevel:
        this.lightData.averageLightLevel !== null
          ? parseFloat(this.lightData.averageLightLevel.toFixed(2))
          : null,
    };

    this.emit({
      type: "AMBIENT_LIGHT",
      payload: cleanedData,
      timestamp: Date.now(),
      userId: this.userId,
      SDK: this.SDK,
    });
  }

  // -------- DEVICE LOCATION --------
  initDeviceLocation() {
    console.log("initDeviceLocation() called - Location tracking starting...");

    this.locationData = {
      supported: false,
      permissionStatus: "unknown",
      latitude: null,
      longitude: null,
      accuracy: null,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      timestamp: null,
      errorCode: null,
      errorMessage: null,
    };

    // CREATE PROMISE to track when location is ready
    this.locationPromise = new Promise((resolve) => {
      if (!("geolocation" in navigator)) {
        console.warn("Geolocation API NOT supported");
        this.locationData.supported = false;
        this.locationData.permissionStatus = "not_supported";
        resolve();
        return;
      }

      console.log("Geolocation API supported");
      this.locationData.supported = true;

      const options = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 5000,
      };

      console.log("Requesting device location...");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location obtained successfully!");

          this.locationData.latitude = position.coords.latitude;
          this.locationData.longitude = position.coords.longitude;
          this.locationData.accuracy = position.coords.accuracy;
          this.locationData.altitude = position.coords.altitude;
          this.locationData.altitudeAccuracy = position.coords.altitudeAccuracy;
          this.locationData.heading = position.coords.heading;
          this.locationData.speed = position.coords.speed;
          this.locationData.timestamp = position.timestamp;
          this.locationData.permissionStatus = "granted";

          console.log(
            "Location: " +
              this.locationData.latitude.toFixed(4) +
              ", " +
              this.locationData.longitude.toFixed(4)
          );
          console.log(
            "Accuracy: " + this.locationData.accuracy.toFixed(2) + " meters"
          );

          resolve();
        },
        (error) => {
          console.error("Location error:", error.message);

          this.locationData.errorCode = error.code;
          this.locationData.errorMessage = error.message;

          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.locationData.permissionStatus = "denied";
              break;
            case error.POSITION_UNAVAILABLE:
              this.locationData.permissionStatus = "unavailable";
              break;
            case error.TIMEOUT:
              this.locationData.permissionStatus = "timeout";
              break;
            default:
              this.locationData.permissionStatus = "error";
          }

          resolve();
        },
        options
      );
    });

    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          console.log("Location permission: " + result.state);
        })
        .catch(() => {});
    }
  }

  // Method to emit location data (called on form submit)
  async emitDeviceLocationData() {
    console.log("emitDeviceLocationData() called - Waiting for location...");

    await this.locationPromise;

    console.log("Location ready! Emitting:", this.locationData);

    if (!this.locationData) {
      this.locationData = {
        supported: false,
        permissionStatus: "not_initialized",
      };
    }

    const cleanedData = {
      ...this.locationData,
      latitude:
        this.locationData.latitude !== null
          ? parseFloat(this.locationData.latitude.toFixed(6))
          : null,
      longitude:
        this.locationData.longitude !== null
          ? parseFloat(this.locationData.longitude.toFixed(6))
          : null,
      accuracy:
        this.locationData.accuracy !== null
          ? parseFloat(this.locationData.accuracy.toFixed(2))
          : null,
      altitude:
        this.locationData.altitude !== null
          ? parseFloat(this.locationData.altitude.toFixed(2))
          : null,
      speed:
        this.locationData.speed !== null
          ? parseFloat(this.locationData.speed.toFixed(2))
          : null,
    };

    this.emit({
      type: "DEVICE_LOCATION",
      payload: cleanedData,
      timestamp: Date.now(),
      userId: this.userId,
      SDK: this.SDK,
    });

    console.log("Location data emitted!");
  }

  // -------- GYROSCOPE --------
  // -------- GYROSCOPE --------
  initGyroscope() {
    console.log("initGyroscope() called - Gyroscope tracking starting...");

    // STEP 1: Create storage for gyroscope data
    this.gyroscopeData = {
      supported: false,
      permissionStatus: "unknown",
      currentRotationRate: {
        alpha: null,
        beta: null,
        gamma: null,
      },
      initialRotationRate: {
        alpha: null,
        beta: null,
        gamma: null,
      },
      maxRotationRate: {
        alpha: null,
        beta: null,
        gamma: null,
      },
      rotationChanges: 0,
      rotationHistory: [],
      deviceMovementLevel: "still",
    };

    // STEP 2: Try Modern Gyroscope API first
    if ("Gyroscope" in window) {
      console.log("Modern Gyroscope API available, attempting to use...");

      try {
        const gyroscope = new Gyroscope({ frequency: 60 });

        gyroscope.addEventListener("reading", () => {
          this.gyroscopeData.supported = true;
          this.gyroscopeData.permissionStatus = "granted";

          const rotationRate = {
            alpha: gyroscope.z || 0,
            beta: gyroscope.x || 0,
            gamma: gyroscope.y || 0,
          };

          this.recordGyroscopeReading(rotationRate);
        });

        gyroscope.addEventListener("error", (event) => {
          console.error("Gyroscope error:", event.error.name);
          console.log("Falling back to DeviceMotion API...");
          this.initDeviceMotionFallback();
        });

        gyroscope.start();
        console.log("Modern Gyroscope started successfully");
      } catch (error) {
        console.error("Failed to initialize modern Gyroscope:", error);
        console.log("Falling back to DeviceMotion API...");
        this.initDeviceMotionFallback();
      }
    } else {
      // STEP 3: Fallback to DeviceMotion API
      console.log("Modern Gyroscope API not available");
      console.log("Using DeviceMotion API fallback...");
      this.initDeviceMotionFallback();
    }
  }

  // STEP 4: Fallback using DeviceMotion API
  initDeviceMotionFallback() {
    console.log("Initializing DeviceMotion fallback for gyroscope");

    if (!window.DeviceMotionEvent) {
      console.warn("DeviceMotion API not supported on this device");
      this.gyroscopeData.supported = false;
      this.gyroscopeData.permissionStatus = "not_supported";
      return;
    }

    // Mark as supported immediately
    this.gyroscopeData.supported = true;

    // iOS 13+ requires permission
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      console.log("iOS device detected - requesting motion permission...");

      DeviceMotionEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            console.log("Motion permission granted on iOS");
            this.gyroscopeData.permissionStatus = "granted";
            this.startDeviceMotionListener();
          } else {
            console.warn("Motion permission denied on iOS");
            this.gyroscopeData.permissionStatus = "denied";
          }
        })
        .catch((error) => {
          console.error("Error requesting motion permission:", error);
          this.gyroscopeData.permissionStatus = "error";
        });
    } else {
      // Android and older iOS - no permission needed
      console.log("Starting DeviceMotion listener (no permission required)");
      this.gyroscopeData.permissionStatus = "granted";
      this.startDeviceMotionListener();
    }
  }

  // STEP 5: Start listening to DeviceMotion events
  startDeviceMotionListener() {
    console.log("Starting DeviceMotion listener");

    window.addEventListener("devicemotion", (event) => {
      // Get rotation rate from DeviceMotion event
      if (event.rotationRate) {
        const rotationRate = {
          alpha: event.rotationRate.alpha || 0,
          beta: event.rotationRate.beta || 0,
          gamma: event.rotationRate.gamma || 0,
        };

        this.recordGyroscopeReading(rotationRate);
      }
    });

    console.log("DeviceMotion listener started successfully");
  }

  // STEP 6: Record a gyroscope reading
  recordGyroscopeReading(rotationRate) {
    // Set initial rotation rate (first reading)
    if (this.gyroscopeData.initialRotationRate.alpha === null) {
      this.gyroscopeData.initialRotationRate = {
        alpha: rotationRate.alpha,
        beta: rotationRate.beta,
        gamma: rotationRate.gamma,
      };
      console.log(
        "Initial rotation rate recorded:",
        this.gyroscopeData.initialRotationRate
      );
    }

    // Update current rotation rate
    const previousRate = {
      alpha: this.gyroscopeData.currentRotationRate.alpha,
      beta: this.gyroscopeData.currentRotationRate.beta,
      gamma: this.gyroscopeData.currentRotationRate.gamma,
    };

    this.gyroscopeData.currentRotationRate = {
      alpha: rotationRate.alpha,
      beta: rotationRate.beta,
      gamma: rotationRate.gamma,
    };

    // Track max rotation rates
    if (
      this.gyroscopeData.maxRotationRate.alpha === null ||
      Math.abs(rotationRate.alpha) >
        Math.abs(this.gyroscopeData.maxRotationRate.alpha)
    ) {
      this.gyroscopeData.maxRotationRate.alpha = rotationRate.alpha;
    }
    if (
      this.gyroscopeData.maxRotationRate.beta === null ||
      Math.abs(rotationRate.beta) >
        Math.abs(this.gyroscopeData.maxRotationRate.beta)
    ) {
      this.gyroscopeData.maxRotationRate.beta = rotationRate.beta;
    }
    if (
      this.gyroscopeData.maxRotationRate.gamma === null ||
      Math.abs(rotationRate.gamma) >
        Math.abs(this.gyroscopeData.maxRotationRate.gamma)
    ) {
      this.gyroscopeData.maxRotationRate.gamma = rotationRate.gamma;
    }

    // Count significant rotation changes
    const ROTATION_THRESHOLD = 10;
    if (previousRate.alpha !== null) {
      const deltaAlpha = Math.abs(rotationRate.alpha - previousRate.alpha);
      const deltaBeta = Math.abs(rotationRate.beta - previousRate.beta);
      const deltaGamma = Math.abs(rotationRate.gamma - previousRate.gamma);

      if (
        deltaAlpha > ROTATION_THRESHOLD ||
        deltaBeta > ROTATION_THRESHOLD ||
        deltaGamma > ROTATION_THRESHOLD
      ) {
        this.gyroscopeData.rotationChanges++;

        this.gyroscopeData.rotationHistory.push({
          rotationRate: {
            alpha: rotationRate.alpha,
            beta: rotationRate.beta,
            gamma: rotationRate.gamma,
          },
          timestamp: Date.now(),
        });

        if (this.gyroscopeData.rotationHistory.length > 20) {
          this.gyroscopeData.rotationHistory.shift();
        }
      }
    }

    // Classify device movement level
    const totalRotation =
      Math.abs(rotationRate.alpha) +
      Math.abs(rotationRate.beta) +
      Math.abs(rotationRate.gamma);

    if (totalRotation < 5) {
      this.gyroscopeData.deviceMovementLevel = "still";
    } else if (totalRotation < 30) {
      this.gyroscopeData.deviceMovementLevel = "gentle";
    } else if (totalRotation < 100) {
      this.gyroscopeData.deviceMovementLevel = "moderate";
    } else {
      this.gyroscopeData.deviceMovementLevel = "aggressive";
    }
  }

  // Method to emit gyroscope data (called on form submit)
  emitGyroscopeData() {
    console.log("emitGyroscopeData() called");
    console.log(
      "Current gyroscopeData before emit:",
      JSON.stringify(this.gyroscopeData, null, 2)
    );

    if (!this.gyroscopeData) {
      console.warn("gyroscopeData does not exist! Initializing empty data...");
      this.gyroscopeData = {
        supported: false,
        permissionStatus: "not_initialized",
        currentRotationRate: { alpha: null, beta: null, gamma: null },
        initialRotationRate: { alpha: null, beta: null, gamma: null },
        maxRotationRate: { alpha: null, beta: null, gamma: null },
        rotationChanges: 0,
        rotationHistory: [],
        deviceMovementLevel: "still",
      };
    }

    // Round values for cleaner output
    const cleanedData = {
      supported: this.gyroscopeData.supported,
      permissionStatus: this.gyroscopeData.permissionStatus,
      currentRotationRate: {
        alpha:
          this.gyroscopeData.currentRotationRate.alpha !== null
            ? parseFloat(
                this.gyroscopeData.currentRotationRate.alpha.toFixed(2)
              )
            : null,
        beta:
          this.gyroscopeData.currentRotationRate.beta !== null
            ? parseFloat(this.gyroscopeData.currentRotationRate.beta.toFixed(2))
            : null,
        gamma:
          this.gyroscopeData.currentRotationRate.gamma !== null
            ? parseFloat(
                this.gyroscopeData.currentRotationRate.gamma.toFixed(2)
              )
            : null,
      },
      initialRotationRate: {
        alpha:
          this.gyroscopeData.initialRotationRate.alpha !== null
            ? parseFloat(
                this.gyroscopeData.initialRotationRate.alpha.toFixed(2)
              )
            : null,
        beta:
          this.gyroscopeData.initialRotationRate.beta !== null
            ? parseFloat(this.gyroscopeData.initialRotationRate.beta.toFixed(2))
            : null,
        gamma:
          this.gyroscopeData.initialRotationRate.gamma !== null
            ? parseFloat(
                this.gyroscopeData.initialRotationRate.gamma.toFixed(2)
              )
            : null,
      },
      maxRotationRate: {
        alpha:
          this.gyroscopeData.maxRotationRate.alpha !== null
            ? parseFloat(this.gyroscopeData.maxRotationRate.alpha.toFixed(2))
            : null,
        beta:
          this.gyroscopeData.maxRotationRate.beta !== null
            ? parseFloat(this.gyroscopeData.maxRotationRate.beta.toFixed(2))
            : null,
        gamma:
          this.gyroscopeData.maxRotationRate.gamma !== null
            ? parseFloat(this.gyroscopeData.maxRotationRate.gamma.toFixed(2))
            : null,
      },
      rotationChanges: this.gyroscopeData.rotationChanges,
      deviceMovementLevel: this.gyroscopeData.deviceMovementLevel,
    };

    console.log("Cleaned data to emit:", JSON.stringify(cleanedData, null, 2));

    this.emit({
      type: "GYROSCOPE",
      payload: cleanedData,
      timestamp: Date.now(),
      userId: this.userId,
      SDK: this.SDK,
    });

    console.log("Gyroscope data emitted successfully!");
  }

  // ==========================================
  // PROXIMITY SENSOR TRACKING
  // ==========================================

  initProximitySensor() {
    console.log(
      "initProximitySensor() called - Proximity sensor tracking starting..."
    );

    // STEP 1: Create storage for proximity data
    this.proximityData = {
      supported: false,
      deviceProximitySupported: false,
      userProximitySupported: false,
      currentDistance: null, // Distance in cm
      minDistance: null, // Minimum detectable distance
      maxDistance: null, // Maximum detectable distance
      isNear: null, // Boolean: is object near?
      proximityChanges: 0, // How many times proximity changed
      nearEvents: 0, // How many times object came near
      farEvents: 0, // How many times object went far
      proximityHistory: [], // Last 10 proximity readings
    };

    console.log("📍 Initial proximityData:", this.proximityData);

    // STEP 2: Check if browser supports deviceproximity event
    if ("ondeviceproximity" in window) {
      console.log("✅ DeviceProximity API supported!");
      this.proximityData.supported = true;
      this.proximityData.deviceProximitySupported = true;

      // Listen for distance changes
      window.addEventListener("deviceproximity", (event) => {
        console.log("📏 Device Proximity Event:", event);

        // Update current readings
        this.proximityData.currentDistance = event.value;
        this.proximityData.minDistance = event.min;
        this.proximityData.maxDistance = event.max;

        // Record in history (keep last 10)
        this.proximityData.proximityHistory.push({
          distance: event.value,
          timestamp: Date.now(),
        });

        if (this.proximityData.proximityHistory.length > 10) {
          this.proximityData.proximityHistory.shift(); // Remove oldest
        }

        this.proximityData.proximityChanges++;

        console.log("📊 Updated proximityData:", this.proximityData);
      });
    } else {
      console.log("❌ DeviceProximity API not supported");
      this.proximityData.deviceProximitySupported = false;
    }

    // STEP 3: Check if browser supports userproximity event
    if ("onuserproximity" in window) {
      console.log("✅ UserProximity API supported!");
      this.proximityData.supported = true;
      this.proximityData.userProximitySupported = true;

      // Listen for near/far changes
      window.addEventListener("userproximity", (event) => {
        console.log("👤 User Proximity Event:", event);

        const wasNear = this.proximityData.isNear;
        this.proximityData.isNear = event.near;

        // Count transitions
        if (wasNear !== null && wasNear !== event.near) {
          if (event.near) {
            this.proximityData.nearEvents++;
            console.log("📱 Object came NEAR the device");
          } else {
            this.proximityData.farEvents++;
            console.log("🚀 Object moved FAR from device");
          }
        }

        console.log("📊 Updated proximityData:", this.proximityData);
      });
    } else {
      console.log("❌ UserProximity API not supported");
      this.proximityData.userProximitySupported = false;
    }

    // STEP 4: If no API is supported
    if (!this.proximityData.supported) {
      console.log("⚠️ Proximity Sensor not supported on this device/browser");
    }

    console.log("✅ Proximity sensor initialization complete");
  }

  // Method to emit proximity data on form submit
  emitProximityData() {
    console.log("📤 emitProximityData() called");

    if (!this.proximityData) {
      console.log("❌ Proximity data not initialized");
      return;
    }

    console.log("📊 Final proximityData:", this.proximityData);

    this.emit({
      type: "PROXIMITY_SENSOR",
      payload: {
        supported: this.proximityData.supported,
        deviceProximitySupported: this.proximityData.deviceProximitySupported,
        userProximitySupported: this.proximityData.userProximitySupported,
        currentDistance: this.proximityData.currentDistance,
        minDistance: this.proximityData.minDistance,
        maxDistance: this.proximityData.maxDistance,
        isNear: this.proximityData.isNear,
        proximityChanges: this.proximityData.proximityChanges,
        nearEvents: this.proximityData.nearEvents,
        farEvents: this.proximityData.farEvents,
        proximityHistory: this.proximityData.proximityHistory,
      },
      timestamp: Date.now(),
      userId: this.userId,
    });

    console.log("✅ Proximity sensor data emitted!");
  }

  // ==========================================
  // MOTION EVENTS TRACKING
  // ==========================================

  initMotionEvents() {
    console.log("initMotionEvents() called - Motion tracking starting...");

    // STEP 1: Create storage for motion data
    this.motionData = {
      supported: false,
      permissionStatus: "unknown",
      totalMotionEvents: 0,
      significantMotionCount: 0, // Events where motion exceeded threshold
      currentAcceleration: {
        x: null,
        y: null,
        z: null,
      },
      maxAcceleration: {
        x: 0,
        y: 0,
        z: 0,
      },
      accelerationIncludingGravity: {
        x: null,
        y: null,
        z: null,
      },
      rotationRate: {
        alpha: null,
        beta: null,
        gamma: null,
      },
      interval: null, // Time between readings (ms)
      motionHistory: [], // Last 10 significant motions
      deviceMovementLevel: "still", // still, gentle, moderate, aggressive
    };

    console.log("📍 Initial motionData:", this.motionData);

    // STEP 2: Check if DeviceMotionEvent is supported
    if (!window.DeviceMotionEvent) {
      console.log("❌ DeviceMotionEvent API not supported");
      this.motionData.supported = false;
      this.motionData.permissionStatus = "not_supported";
      return;
    }

    console.log("✅ DeviceMotionEvent API supported!");

    // STEP 3: Check if permission is required (iOS 13+)
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      console.log("⚠️ Permission required for motion events (iOS 13+)");

      // iOS 13+ requires user interaction to request permission
      // For now, we'll try to add listener without permission
      // In production, you'd add a button for user to click
      this.motionData.permissionStatus = "permission_required";

      // You can add this to a button click event:
      // DeviceMotionEvent.requestPermission()
      //   .then(response => {
      //     if (response === 'granted') {
      //       this.startMotionTracking();
      //     }
      //   });

      // For now, try to start tracking (may not work on iOS)
      this.startMotionTracking();
    } else {
      // No permission needed (Android, older iOS)
      console.log("✅ No permission required - starting motion tracking");
      this.motionData.permissionStatus = "granted";
      this.startMotionTracking();
    }
  }

  // STEP 4: Start actual motion tracking
  startMotionTracking() {
    console.log("🚀 Starting motion tracking...");

    window.addEventListener("devicemotion", (event) => {
      // Mark as supported since we're receiving events
      if (!this.motionData.supported) {
        this.motionData.supported = true;
        console.log(
          "✅ First motion event received - device supports motion tracking!"
        );
      }

      // Count total events
      this.motionData.totalMotionEvents++;

      // STEP 5: Extract acceleration data (without gravity - better for motion detection)
      if (event.acceleration) {
        this.motionData.currentAcceleration = {
          x: event.acceleration.x,
          y: event.acceleration.y,
          z: event.acceleration.z,
        };

        // Update max values
        if (
          Math.abs(event.acceleration.x) >
          Math.abs(this.motionData.maxAcceleration.x)
        ) {
          this.motionData.maxAcceleration.x = event.acceleration.x;
        }
        if (
          Math.abs(event.acceleration.y) >
          Math.abs(this.motionData.maxAcceleration.y)
        ) {
          this.motionData.maxAcceleration.y = event.acceleration.y;
        }
        if (
          Math.abs(event.acceleration.z) >
          Math.abs(this.motionData.maxAcceleration.z)
        ) {
          this.motionData.maxAcceleration.z = event.acceleration.z;
        }
      }

      // STEP 6: Extract acceleration including gravity (fallback if acceleration is null)
      if (event.accelerationIncludingGravity) {
        this.motionData.accelerationIncludingGravity = {
          x: event.accelerationIncludingGravity.x,
          y: event.accelerationIncludingGravity.y,
          z: event.accelerationIncludingGravity.z,
        };
      }

      // STEP 7: Extract rotation rate (similar to gyroscope)
      if (event.rotationRate) {
        this.motionData.rotationRate = {
          alpha: event.rotationRate.alpha,
          beta: event.rotationRate.beta,
          gamma: event.rotationRate.gamma,
        };
      }

      // STEP 8: Get interval between readings
      if (event.interval) {
        this.motionData.interval = event.interval;
      }

      // STEP 9: Detect "significant motion" (threshold-based)
      // Motion is "significant" if acceleration exceeds 2 m/s² on any axis
      const SIGNIFICANT_MOTION_THRESHOLD = 2.0; // m/s²

      let isSignificantMotion = false;

      if (event.acceleration) {
        const totalAcceleration = Math.sqrt(
          Math.pow(event.acceleration.x || 0, 2) +
            Math.pow(event.acceleration.y || 0, 2) +
            Math.pow(event.acceleration.z || 0, 2)
        );

        if (totalAcceleration > SIGNIFICANT_MOTION_THRESHOLD) {
          isSignificantMotion = true;
          this.motionData.significantMotionCount++;

          // Record in history
          this.motionData.motionHistory.push({
            acceleration: totalAcceleration.toFixed(2),
            timestamp: Date.now(),
          });

          // Keep only last 10
          if (this.motionData.motionHistory.length > 10) {
            this.motionData.motionHistory.shift();
          }

          console.log(
            `🔥 Significant motion detected! Acceleration: ${totalAcceleration.toFixed(
              2
            )} m/s²`
          );
        }

        // STEP 10: Classify device movement level
        if (totalAcceleration < 1.0) {
          this.motionData.deviceMovementLevel = "still";
        } else if (totalAcceleration < 3.0) {
          this.motionData.deviceMovementLevel = "gentle";
        } else if (totalAcceleration < 6.0) {
          this.motionData.deviceMovementLevel = "moderate";
        } else {
          this.motionData.deviceMovementLevel = "aggressive";
        }
      }

      // Log occasionally (every 50 events to avoid spam)
      if (this.motionData.totalMotionEvents % 50 === 0) {
        console.log("📊 Motion data update:", {
          totalEvents: this.motionData.totalMotionEvents,
          significantMotions: this.motionData.significantMotionCount,
          currentAcceleration: this.motionData.currentAcceleration,
          movementLevel: this.motionData.deviceMovementLevel,
        });
      }
    });

    console.log("✅ Motion tracking listener added");
  }

  // Method to emit motion data on form submit
  emitMotionData() {
    console.log("📤 emitMotionData() called");

    if (!this.motionData) {
      console.log("❌ Motion data not initialized");
      return;
    }

    console.log("📊 Final motionData:", this.motionData);

    this.emit({
      type: "MOTION_EVENTS",
      payload: {
        supported: this.motionData.supported,
        permissionStatus: this.motionData.permissionStatus,
        totalMotionEvents: this.motionData.totalMotionEvents,
        significantMotionCount: this.motionData.significantMotionCount,
        currentAcceleration: this.motionData.currentAcceleration,
        maxAcceleration: this.motionData.maxAcceleration,
        accelerationIncludingGravity:
          this.motionData.accelerationIncludingGravity,
        rotationRate: this.motionData.rotationRate,
        interval: this.motionData.interval,
        motionHistory: this.motionData.motionHistory,
        deviceMovementLevel: this.motionData.deviceMovementLevel,
      },
      timestamp: Date.now(),
      userId: this.userId,
    });

    console.log("✅ Motion events data emitted!");
  }

  // ==========================================
  // ACCELEROMETER EVENTS TRACKING
  // ==========================================

  initAccelerometerEvents() {
    console.log(
      "initAccelerometerEvents() called - Accelerometer tracking starting..."
    );

    // STEP 1: Create storage for accelerometer data
    this.accelerometerData = {
      supported: false,
      permissionStatus: "unknown",
      apiType: null, // "LinearAccelerationSensor" or "fallback"
      totalReadings: 0,
      currentAcceleration: {
        x: null,
        y: null,
        z: null,
      },
      maxAcceleration: {
        x: 0,
        y: 0,
        z: 0,
      },
      minAcceleration: {
        x: 0,
        y: 0,
        z: 0,
      },
      averageAcceleration: {
        x: 0,
        y: 0,
        z: 0,
      },
      significantAccelerationCount: 0, // Count when acceleration > 2 m/s²
      accelerationHistory: [], // Last 10 significant readings
      deviceMovementIntensity: "still", // still, light, moderate, intense
      frequency: 60, // Hz (readings per second)
    };

    console.log("📍 Initial accelerometerData:", this.accelerometerData);

    // STEP 2: Check if LinearAccelerationSensor API is supported (Modern API)
    if ("LinearAccelerationSensor" in window) {
      console.log("✅ LinearAccelerationSensor API detected!");
      this.initLinearAccelerationSensor();
    } else if ("Accelerometer" in window) {
      console.log("✅ Accelerometer API detected (fallback)!");
      this.initAccelerometerAPI();
    } else {
      // STEP 3: Fallback to DeviceMotion API (oldest, most compatible)
      console.log(
        "⚠️ Modern Accelerometer APIs not supported, trying DeviceMotion fallback..."
      );
      this.initAccelerometerFallback();
    }
  }

  // STEP 4: Use LinearAccelerationSensor (Best - excludes gravity)
  initLinearAccelerationSensor() {
    console.log(
      "🚀 Initializing LinearAccelerationSensor (without gravity)..."
    );

    try {
      // Create sensor with 60Hz frequency
      const sensor = new LinearAccelerationSensor({
        frequency: this.accelerometerData.frequency,
      });

      this.accelerometerData.apiType = "LinearAccelerationSensor";

      // Handle sensor reading
      sensor.addEventListener("reading", () => {
        if (!this.accelerometerData.supported) {
          this.accelerometerData.supported = true;
          this.accelerometerData.permissionStatus = "granted";
          console.log("✅ LinearAccelerationSensor started successfully!");
        }

        // Update readings count
        this.accelerometerData.totalReadings++;

        // STEP 5: Get current acceleration (without gravity)
        const x = sensor.x || 0;
        const y = sensor.y || 0;
        const z = sensor.z || 0;

        this.accelerometerData.currentAcceleration = { x, y, z };

        // Update max values
        if (Math.abs(x) > Math.abs(this.accelerometerData.maxAcceleration.x)) {
          this.accelerometerData.maxAcceleration.x = x;
        }
        if (Math.abs(y) > Math.abs(this.accelerometerData.maxAcceleration.y)) {
          this.accelerometerData.maxAcceleration.y = y;
        }
        if (Math.abs(z) > Math.abs(this.accelerometerData.maxAcceleration.z)) {
          this.accelerometerData.maxAcceleration.z = z;
        }

        // Update min values
        if (x < this.accelerometerData.minAcceleration.x) {
          this.accelerometerData.minAcceleration.x = x;
        }
        if (y < this.accelerometerData.minAcceleration.y) {
          this.accelerometerData.minAcceleration.y = y;
        }
        if (z < this.accelerometerData.minAcceleration.z) {
          this.accelerometerData.minAcceleration.z = z;
        }

        // Calculate running average
        const count = this.accelerometerData.totalReadings;
        this.accelerometerData.averageAcceleration.x =
          (this.accelerometerData.averageAcceleration.x * (count - 1) + x) /
          count;
        this.accelerometerData.averageAcceleration.y =
          (this.accelerometerData.averageAcceleration.y * (count - 1) + y) /
          count;
        this.accelerometerData.averageAcceleration.z =
          (this.accelerometerData.averageAcceleration.z * (count - 1) + z) /
          count;

        // STEP 6: Detect significant acceleration (threshold: 2 m/s²)
        const totalAcceleration = Math.sqrt(x * x + y * y + z * z);

        if (totalAcceleration > 2.0) {
          this.accelerometerData.significantAccelerationCount++;

          // Record in history
          this.accelerometerData.accelerationHistory.push({
            x: parseFloat(x.toFixed(2)),
            y: parseFloat(y.toFixed(2)),
            z: parseFloat(z.toFixed(2)),
            total: parseFloat(totalAcceleration.toFixed(2)),
            timestamp: Date.now(),
          });

          // Keep only last 10
          if (this.accelerometerData.accelerationHistory.length > 10) {
            this.accelerometerData.accelerationHistory.shift();
          }

          console.log(
            `🔥 Significant acceleration: ${totalAcceleration.toFixed(2)} m/s²`
          );
        }

        // STEP 7: Classify movement intensity
        if (totalAcceleration < 0.5) {
          this.accelerometerData.deviceMovementIntensity = "still";
        } else if (totalAcceleration < 2.0) {
          this.accelerometerData.deviceMovementIntensity = "light";
        } else if (totalAcceleration < 5.0) {
          this.accelerometerData.deviceMovementIntensity = "moderate";
        } else {
          this.accelerometerData.deviceMovementIntensity = "intense";
        }

        // Log occasionally (every 100 readings)
        if (this.accelerometerData.totalReadings % 100 === 0) {
          console.log("📊 Accelerometer update:", {
            readings: this.accelerometerData.totalReadings,
            current: this.accelerometerData.currentAcceleration,
            intensity: this.accelerometerData.deviceMovementIntensity,
          });
        }
      });

      // Handle errors
      sensor.addEventListener("error", (event) => {
        console.error(
          "❌ LinearAccelerationSensor error:",
          event.error.name,
          event.error.message
        );

        if (event.error.name === "NotAllowedError") {
          this.accelerometerData.permissionStatus = "denied";
          console.log("⚠️ Permission denied for accelerometer");
        } else if (event.error.name === "NotReadableError") {
          this.accelerometerData.permissionStatus = "not_readable";
          console.log("⚠️ Accelerometer sensor is in use by another app");
        }
      });

      // Start the sensor
      sensor.start();
      console.log("✅ LinearAccelerationSensor started");
    } catch (error) {
      console.error(
        "❌ LinearAccelerationSensor initialization failed:",
        error
      );
      this.accelerometerData.supported = false;
      this.accelerometerData.permissionStatus = "error";

      // Try fallback
      if ("Accelerometer" in window) {
        console.log("⚠️ Trying Accelerometer API fallback...");
        this.initAccelerometerAPI();
      } else {
        console.log("⚠️ Trying DeviceMotion fallback...");
        this.initAccelerometerFallback();
      }
    }
  }

  // STEP 8: Fallback to regular Accelerometer API (includes gravity)
  initAccelerometerAPI() {
    console.log("🚀 Initializing Accelerometer API (includes gravity)...");

    try {
      const sensor = new Accelerometer({
        frequency: this.accelerometerData.frequency,
      });

      this.accelerometerData.apiType = "Accelerometer";

      sensor.addEventListener("reading", () => {
        if (!this.accelerometerData.supported) {
          this.accelerometerData.supported = true;
          this.accelerometerData.permissionStatus = "granted";
          console.log("✅ Accelerometer API started successfully!");
        }

        // Process same as LinearAccelerationSensor
        // (code similar to above, with gravity included)

        this.accelerometerData.totalReadings++;

        const x = sensor.x || 0;
        const y = sensor.y || 0;
        const z = sensor.z || 0;

        this.accelerometerData.currentAcceleration = { x, y, z };

        // Note: This includes gravity, so we need to subtract ~9.8 m/s² from z-axis
        // when device is upright
      });

      sensor.addEventListener("error", (event) => {
        console.error("❌ Accelerometer error:", event.error);
        this.initAccelerometerFallback();
      });

      sensor.start();
    } catch (error) {
      console.error("❌ Accelerometer API failed:", error);
      this.initAccelerometerFallback();
    }
  }

  // STEP 9: Ultimate fallback to DeviceMotion (most compatible)
  initAccelerometerFallback() {
    console.log("🚀 Initializing DeviceMotion fallback...");

    if (!window.DeviceMotionEvent) {
      console.log("❌ No accelerometer APIs supported on this device");
      this.accelerometerData.supported = false;
      this.accelerometerData.permissionStatus = "not_supported";
      return;
    }

    this.accelerometerData.apiType = "DeviceMotion";

    window.addEventListener("devicemotion", (event) => {
      if (!this.accelerometerData.supported) {
        this.accelerometerData.supported = true;
        this.accelerometerData.permissionStatus = "granted";
        console.log("✅ DeviceMotion fallback started successfully!");
      }

      this.accelerometerData.totalReadings++;

      // Use acceleration (without gravity) if available
      if (event.acceleration) {
        const x = event.acceleration.x || 0;
        const y = event.acceleration.y || 0;
        const z = event.acceleration.z || 0;

        this.accelerometerData.currentAcceleration = { x, y, z };

        // Update max/min/average same as above
        // (similar logic to LinearAccelerationSensor)
      }
    });

    console.log("✅ DeviceMotion listener added");
  }

  // Method to emit accelerometer data on form submit
  emitAccelerometerData() {
    console.log("📤 emitAccelerometerData() called");

    if (!this.accelerometerData) {
      console.log("❌ Accelerometer data not initialized");
      return;
    }

    console.log("📊 Final accelerometerData:", this.accelerometerData);

    this.emit({
      type: "ACCELEROMETER_EVENTS",
      payload: {
        supported: this.accelerometerData.supported,
        permissionStatus: this.accelerometerData.permissionStatus,
        apiType: this.accelerometerData.apiType,
        totalReadings: this.accelerometerData.totalReadings,
        currentAcceleration: this.accelerometerData.currentAcceleration,
        maxAcceleration: this.accelerometerData.maxAcceleration,
        minAcceleration: this.accelerometerData.minAcceleration,
        averageAcceleration: this.accelerometerData.averageAcceleration,
        significantAccelerationCount:
          this.accelerometerData.significantAccelerationCount,
        accelerationHistory: this.accelerometerData.accelerationHistory,
        deviceMovementIntensity: this.accelerometerData.deviceMovementIntensity,
        frequency: this.accelerometerData.frequency,
      },
      timestamp: Date.now(),
      userId: this.userId,
    });

    console.log("✅ Accelerometer events data emitted!");
  }

  // ==========================================
// DEVICE SCREEN SIZE TRACKING
// ==========================================

initDeviceScreenSize() {
  console.log("initDeviceScreenSize() called - Screen size tracking starting...");
  
  // STEP 1: Get basic screen dimensions
  const screenWidth = window.screen.width || 0;
  const screenHeight = window.screen.height || 0;
  const availWidth = window.screen.availWidth || 0;
  const availHeight = window.screen.availHeight || 0;
  
  // STEP 2: Get screen color properties
  const colorDepth = window.screen.colorDepth || 0;
  const pixelDepth = window.screen.pixelDepth || 0;
  
  // STEP 3: Get device pixel ratio (for retina displays)
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // STEP 4: Calculate physical resolution (actual hardware pixels)
  const physicalWidth = Math.round(screenWidth * devicePixelRatio);
  const physicalHeight = Math.round(screenHeight * devicePixelRatio);
  
  // STEP 5: Calculate aspect ratio
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(screenWidth, screenHeight);
  const aspectRatioW = screenWidth / divisor;
  const aspectRatioH = screenHeight / divisor;
  const aspectRatio = `${aspectRatioW}:${aspectRatioH}`;
  
  // STEP 6: Determine orientation
  const orientation = screenWidth > screenHeight ? 'landscape' : 'portrait';
  
  // STEP 7: Estimate screen size in inches (diagonal)
  // Using standard PPI assumptions (not 100% accurate but useful for fraud detection)
  // Desktop: ~96 PPI, Mobile: ~300-450 PPI, Tablet: ~200-250 PPI
  
  let estimatedPPI = 96; // Default for desktop
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = /iPad|Android/i.test(navigator.userAgent) && screenWidth >= 768;
  
  if (isMobile && !isTablet) {
    // Mobile phone - higher PPI
    estimatedPPI = devicePixelRatio >= 3 ? 450 : devicePixelRatio >= 2 ? 350 : 250;
  } else if (isTablet) {
    // Tablet - medium PPI
    estimatedPPI = devicePixelRatio >= 2 ? 260 : 160;
  }
  
  // Calculate diagonal in inches using Pythagorean theorem
  const diagonalPixels = Math.sqrt(physicalWidth * physicalWidth + physicalHeight * physicalHeight);
  const screenSizeInches = diagonalPixels / estimatedPPI;
  
  // STEP 8: Calculate pixel density (PPI)
  const calculatedPPI = Math.round(diagonalPixels / screenSizeInches);
  
  // STEP 9: Detect if this looks like a common emulator/bot screen size
  const commonBotResolutions = [
    '1920x1080', '1366x768', '1440x900', '1536x864', '1280x720',
    '1024x768', '800x600', '1280x1024', '1680x1050'
  ];
  const currentResolution = `${screenWidth}x${screenHeight}`;
  const isCommonBotResolution = commonBotResolutions.includes(currentResolution);
  
  // STEP 10: Check for suspicious patterns
  const suspiciousPatterns = {
    perfectSquare: screenWidth === screenHeight, // Perfect square is rare
    tooSmall: screenWidth < 320 || screenHeight < 320, // Unusually small
    tooLarge: screenWidth > 7680 || screenHeight > 4320, // 8K+ is rare
    noDPR: devicePixelRatio === 0 || devicePixelRatio > 5, // Unusual DPR
    noColorDepth: colorDepth === 0 || colorDepth < 8 // Invalid color depth
  };
  
  // STEP 11: Determine device category based on screen size
  let deviceCategory = 'unknown';
  if (screenSizeInches < 7) {
    deviceCategory = 'mobile';
  } else if (screenSizeInches >= 7 && screenSizeInches < 13) {
    deviceCategory = 'tablet';
  } else {
    deviceCategory = 'desktop';
  }
  
  // STEP 12: Store all screen data
  this.screenSizeData = {
    supported: true,
    
    // CSS Pixels (logical)
    cssWidth: screenWidth,
    cssHeight: screenHeight,
    cssAvailWidth: availWidth,
    cssAvailHeight: availHeight,
    
    // Physical Pixels (actual hardware)
    physicalWidth: physicalWidth,
    physicalHeight: physicalHeight,
    
    // Device Properties
    devicePixelRatio: devicePixelRatio,
    colorDepth: colorDepth,
    pixelDepth: pixelDepth,
    
    // Calculated Properties
    orientation: orientation,
    aspectRatio: aspectRatio,
    screenSizeInches: parseFloat(screenSizeInches.toFixed(2)),
    estimatedPPI: estimatedPPI,
    calculatedPPI: calculatedPPI,
    deviceCategory: deviceCategory,
    
    // Fraud Detection Signals
    resolution: currentResolution,
    isCommonBotResolution: isCommonBotResolution,
    suspiciousPatterns: suspiciousPatterns,
    
    // Browser Window Info (for comparison)
    windowInnerWidth: window.innerWidth,
    windowInnerHeight: window.innerHeight,
    windowOuterWidth: window.outerWidth,
    windowOuterHeight: window.outerHeight,
    
    // Additional Screen Properties (if available)
    availTop: window.screen.availTop || 0,
    availLeft: window.screen.availLeft || 0
  };
  
  console.log("📊 Screen Size Data:", this.screenSizeData);
  
  // STEP 13: Log fraud detection insights
  if (isCommonBotResolution) {
    console.log("⚠️ Screen resolution matches common bot/emulator pattern:", currentResolution);
  }
  
  if (Object.values(suspiciousPatterns).some(v => v === true)) {
    console.log("⚠️ Suspicious screen patterns detected:", suspiciousPatterns);
  }
  
  console.log(`📱 Device Category: ${deviceCategory} (${screenSizeInches.toFixed(1)}" estimated)`);
  console.log(`🎨 Display Quality: ${colorDepth}-bit color, DPR: ${devicePixelRatio}x`);
  
  console.log("✅ Screen size tracking initialized");
}

// Method to emit screen size data on form submit
emitDeviceScreenSize() {
  console.log("📤 emitDeviceScreenSize() called");
  
  if (!this.screenSizeData) {
    console.log("❌ Screen size data not initialized");
    return;
  }
  
  console.log("📊 Final screenSizeData:", this.screenSizeData);
  
  this.emit({
    type: "DEVICE_SCREEN_SIZE",
    payload: this.screenSizeData,
    timestamp: Date.now(),
    userId: this.userId
  });
  
  console.log("✅ Device screen size data emitted!");
}

     
  // ==========================================
// MAIN DEVICE ID INITIALIZATION
// ==========================================

initDeviceID() {
  console.log("initDeviceID() called - Device fingerprinting starting...");
  
  try {
    // STEP 1: Check for existing device ID in storage
    let storedDeviceID = this.getStoredDeviceID();
    
    // STEP 2: Collect fingerprint components
    const fingerprintComponents = this.collectFingerprintComponents();
    
    // STEP 3: Generate unique device ID from fingerprint
    const generatedDeviceID = this.generateDeviceID(fingerprintComponents);
    
    // STEP 4: Detect fraud patterns
    const fraudAnalysis = this.analyzeDeviceIDFraud(
      storedDeviceID, 
      generatedDeviceID, 
      fingerprintComponents
    );
    
    // STEP 5: Store device ID for future visits
    if (!storedDeviceID) {
      this.storeDeviceID(generatedDeviceID);
    }
    
    // STEP 6: Build complete device ID data object
    this.deviceIDData = {
      // Core identifiers
      deviceID: storedDeviceID || generatedDeviceID,
      fingerprintHash: generatedDeviceID,
      sessionID: this.generateSessionID(),
      
      // Fingerprint components (raw data)
      fingerprint: fingerprintComponents,
      
      // ID tracking
      hasStoredID: !!storedDeviceID,
      deviceIDChanged: storedDeviceID && storedDeviceID !== generatedDeviceID,
      deviceIDMatchesFingerprint: !storedDeviceID || storedDeviceID === generatedDeviceID,
      
      // Visit tracking
      isFirstVisit: !storedDeviceID,
      sessionCount: this.getSessionCount(),
      lastSeenTimestamp: this.getLastSeenTimestamp(),
      daysSinceLastVisit: this.getDaysSinceLastVisit(),
      
      // 🚨 FRAUD DETECTION FLAGS
      suspicionFlags: fraudAnalysis.flags,
      
      // Risk assessment
      riskScore: fraudAnalysis.riskScore,
      riskLevel: fraudAnalysis.riskLevel,
      riskReasons: fraudAnalysis.riskReasons,
      
      // Quality metrics
      fingerprintStability: this.calculateFingerprintStability(fingerprintComponents),
      deviceConsistencyScore: fraudAnalysis.consistencyScore,
      
      // Platform detection
      platformType: this.detectPlatformType(fingerprintComponents),
      deviceCategory: this.detectDeviceCategory(fingerprintComponents),
      
      // Storage capabilities
      canPersistData: this.canAccessLocalStorage(),
      
      // Timestamp
      capturedAt: Date.now()
    };
    
    console.log("📊 Device ID Data:", this.deviceIDData);
    console.log("✅ Device ID tracking initialized successfully");
    
  } catch (error) {
    console.error("❌ Error initializing device ID:", error);
    this.deviceIDData = {
      error: true,
      errorMessage: error.message,
      riskLevel: "UNKNOWN"
    };
  }
}

// ==========================================
// FINGERPRINT COLLECTION
// ==========================================

collectFingerprintComponents() {
  console.log("📋 Collecting fingerprint components...");
  
  const components = {
    // === SCREEN PROPERTIES ===
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    screenAvailWidth: window.screen.availWidth,
    screenAvailHeight: window.screen.availHeight,
    screenColorDepth: window.screen.colorDepth,
    screenPixelDepth: window.screen.pixelDepth || window.screen.colorDepth,
    devicePixelRatio: window.devicePixelRatio || 1,
    
    // === VIEWPORT ===
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    
    // === BROWSER PROPERTIES ===
    userAgent: navigator.userAgent,
    appName: navigator.appName,
    appVersion: navigator.appVersion,
    appCodeName: navigator.appCodeName,
    product: navigator.product || '',
    productSub: navigator.productSub || '',
    vendor: navigator.vendor || '',
    vendorSub: navigator.vendorSub || '',
    
    // === LANGUAGE ===
    language: navigator.language,
    languages: navigator.languages ? navigator.languages.join(',') : '',
    
    // === PLATFORM ===
    platform: navigator.platform,
    oscpu: navigator.oscpu || '',
    
    // === HARDWARE ===
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: navigator.deviceMemory || 0,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    
    // === TOUCH SUPPORT ===
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    
    // === TIMEZONE ===
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    
    // === ADVANCED FINGERPRINTS ===
    canvasFingerprint: this.generateCanvasFingerprint(),
    webglFingerprint: this.generateWebGLFingerprint(),
    audioFingerprint: this.generateAudioFingerprint(),
    fontFingerprint: this.detectAvailableFonts(),
    
    // === PLUGINS ===
    plugins: this.getPluginsList(),
    mimeTypes: this.getMimeTypesList(),
    
    // === FEATURES ===
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack || '0',
    
    // === STORAGE ===
    localStorageEnabled: this.canAccessLocalStorage(),
    sessionStorageEnabled: this.canAccessSessionStorage(),
    indexedDBEnabled: !!window.indexedDB,
    
    // === ONLINE STATUS ===
    onLine: navigator.onLine,
    
    // === CONNECTION (if available) ===
    connection: this.getConnectionInfo(),
    
    // === BATTERY (if available) ===
    batteryInfo: 'getBattery' in navigator ? 'supported' : 'unsupported',
    
    // === MEDIA DEVICES ===
    mediaDevices: 'mediaDevices' in navigator ? 'supported' : 'unsupported',
    
    // === WEBRTC ===
    webrtcSupport: this.checkWebRTCSupport(),
    
    // === PERMISSIONS API ===
    permissionsAPI: 'permissions' in navigator ? 'supported' : 'unsupported',
    
    // ========================================
    // ✅ NEW ADDED SDK VARIABLES (Missing ones)
    // ========================================
    
    // === DEVICE MODEL (SDK - Device Model) ===
    deviceModel: this.extractDeviceModel(navigator.userAgent),
    
    // === DEVICE PRODUCT NAME (SDK - Device Product Name) ===
    deviceProduct: navigator.product || 'UNKNOWN',
    
    // === OS VERSION (SDK - Device OS Version) ===
    osVersion: this.extractOSVersion(navigator.userAgent),
    
    // === DEVICE BRAND NAME (Already covered by 'vendor') ===
    deviceBrand: navigator.vendor || 'UNKNOWN',
    
    // === DEVICE REGISTERED BRAND NAME ===
    deviceRegisteredBrand: this.extractBrandFromUserAgent(navigator.userAgent),
    
    // === AVAILABLE KEYBOARDS (SDK - Device Available Keyboards) ===
    availableKeyboards: this.getAvailableKeyboards(),
    
    // === INSTALLED APPLICATIONS (SDK - Device Installed Applications) ===
    // ⚠️ Not available in browsers for security/privacy reasons
    installedApplications: 'NOT_SUPPORTED_IN_BROWSER',
    
    // === CALL STATUS (SDK - Device Call Status) ===
    // ⚠️ Only available in native mobile apps
    callStatus: 'NOT_SUPPORTED_IN_BROWSER',
    
    // === AUDIO SETTINGS (SDK - Device Audio Settings) ===
    audioSettings: this.getAudioSettings(),
    
    // === AVAILABLE SENSORS (SDK - Device Available Sensors) ===
    availableSensors: this.detectAvailableSensors()
  };
  
  console.log(`✅ Collected ${Object.keys(components).length} fingerprint components`);
  return components;
}

// ==========================================
// ADVANCED FINGERPRINTING METHODS
// ==========================================

// Canvas Fingerprint - Most reliable
generateCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return 'unsupported';
    
    // Draw text with specific styling
    ctx.textBaseline = 'top';
    ctx.font = '14px "Arial"';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Bargad.AI 🔒', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Fraud Detection', 4, 17);
    
    // Draw some shapes
    ctx.beginPath();
    ctx.arc(50, 25, 20, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    
    // Get data URL and hash it
    const dataURL = canvas.toDataURL();
    return this.simpleHash(dataURL);
    
  } catch (e) {
    console.log("⚠️ Canvas fingerprint failed:", e.message);
    return 'blocked';
  }
}

// WebGL Fingerprint
generateWebGLFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'unsupported';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return this.simpleHash(`${vendor}~${renderer}`);
    }
    
    // Fallback: Get WebGL parameters
    const params = [
      gl.getParameter(gl.VERSION),
      gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      gl.getParameter(gl.VENDOR),
      gl.getParameter(gl.RENDERER)
    ].join('~');
    
    return this.simpleHash(params);
    
  } catch (e) {
    console.log("⚠️ WebGL fingerprint failed:", e.message);
    return 'blocked';
  }
}

// Audio Context Fingerprint
generateAudioFingerprint() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return 'unsupported';
    
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const analyser = context.createAnalyser();
    const gainNode = context.createGain();
    const scriptProcessor = context.createScriptProcessor(4096, 1, 1);
    
    gainNode.gain.value = 0; // Mute
    oscillator.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start(0);
    
    const fingerprint = [
      context.sampleRate,
      context.destination.maxChannelCount,
      context.destination.numberOfInputs,
      context.destination.numberOfOutputs,
      context.destination.channelCount
    ].join('_');
    
    // Cleanup
    oscillator.stop();
    oscillator.disconnect();
    analyser.disconnect();
    scriptProcessor.disconnect();
    gainNode.disconnect();
    context.close();
    
    return this.simpleHash(fingerprint);
    
  } catch (e) {
    console.log("⚠️ Audio fingerprint failed:", e.message);
    return 'blocked';
  }
}

// Font Detection
detectAvailableFonts() {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia',
    'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS',
    'Impact', 'Lucida Console', 'Tahoma', 'Helvetica', 'Geneva'
  ];
  
  const detectedFonts = [];
  
  // Simple font detection (basic version)
  testFonts.forEach(font => {
    // In production, implement proper font detection
    // For now, just list common fonts
    if (this.isFontAvailable(font, baseFonts)) {
      detectedFonts.push(font);
    }
  });
  
  return this.simpleHash(detectedFonts.join(','));
}

// Check if font is available
isFontAvailable(fontName, baseFonts) {
  // Simplified version - in production use proper detection
  // For demo purposes, assume common fonts are available
  return true;
}

// Get plugins list
getPluginsList() {
  if (!navigator.plugins || navigator.plugins.length === 0) {
    return 'no-plugins';
  }
  
  const plugins = [];
  for (let i = 0; i < navigator.plugins.length; i++) {
    plugins.push(navigator.plugins[i].name);
  }
  
  return this.simpleHash(plugins.sort().join(','));
}

// Get MIME types
getMimeTypesList() {
  if (!navigator.mimeTypes || navigator.mimeTypes.length === 0) {
    return 'no-mimetypes';
  }
  
  const mimeTypes = [];
  for (let i = 0; i < navigator.mimeTypes.length; i++) {
    mimeTypes.push(navigator.mimeTypes[i].type);
  }
  
  return this.simpleHash(mimeTypes.sort().join(','));
}

// Get connection info
getConnectionInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) return 'unsupported';
  
  return {
    effectiveType: connection.effectiveType || 'unknown',
    downlink: connection.downlink || 0,
    rtt: connection.rtt || 0,
    saveData: connection.saveData || false
  };
}

// Check WebRTC support
checkWebRTCSupport() {
  return !!(
    window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection
  );
}

// ==========================================
// DEVICE ID GENERATION
// ==========================================

generateDeviceID(components) {
  console.log("🔐 Generating device ID from fingerprint...");
  
  // Convert components to string
  const fingerprintString = JSON.stringify(components);
  
  // Generate hash
  const hash = this.simpleHash(fingerprintString);
  
  // Format as Android ID style (16 hex characters)
  const deviceID = hash.substring(0, 16);
  
  console.log("✅ Generated device ID:", deviceID);
  return deviceID;
}

// Simple hash function (use better hashing in production)
simpleHash(str) {
  let hash = 0;
  if (str.length === 0) return '0000000000000000';
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to positive hex string
  return Math.abs(hash).toString(16).padStart(16, '0');
}

// ==========================================
// FRAUD DETECTION ANALYSIS
// ==========================================

analyzeDeviceIDFraud(storedID, generatedID, fingerprint) {
  console.log("🔍 Analyzing device ID for fraud patterns...");
  
  const flags = {};
  const reasons = [];
  let riskScore = 0;
  let consistencyScore = 100;
  
  // 1. Device ID changed (possible spoofing)
  if (storedID && storedID !== generatedID) {
    flags.deviceIDMismatch = true;
    reasons.push("Device fingerprint changed - possible device spoofing or browser reset");
    riskScore += 25;
    consistencyScore -= 25;
  } else {
    flags.deviceIDMismatch = false;
  }
  
  // 2. Private/Incognito mode
  if (!this.canAccessLocalStorage()) {
    flags.privateMode = true;
    reasons.push("Private browsing mode detected - cannot persist device ID");
    riskScore += 10;
  } else {
    flags.privateMode = false;
  }
  
  // 3. Canvas fingerprint blocked
  if (fingerprint.canvasFingerprint === 'blocked' || fingerprint.canvasFingerprint === 'unsupported') {
    flags.canvasFingerprintBlocked = true;
    reasons.push("Canvas fingerprinting blocked - privacy tool or bot");
    riskScore += 20;
    consistencyScore -= 20;
  } else {
    flags.canvasFingerprintBlocked = false;
  }
  
  // 4. WebGL unavailable
  if (fingerprint.webglFingerprint === 'blocked' || fingerprint.webglFingerprint === 'unsupported') {
    flags.webglUnavailable = true;
    reasons.push("WebGL unavailable - possible headless browser or bot");
    riskScore += 15;
    consistencyScore -= 15;
  } else {
    flags.webglUnavailable = false;
  }
  
  // 5. Automation tools detection
  const ua = fingerprint.userAgent.toLowerCase();
  if (ua.includes('headless') || ua.includes('phantom') || ua.includes('selenium') || 
      ua.includes('puppeteer') || ua.includes('playwright')) {
    flags.automationDetected = true;
    reasons.push("Automation tool detected - bot/script");
    riskScore += 50;
    consistencyScore -= 50;
  } else {
    flags.automationDetected = false;
  }
  
  // 6. Hardware concurrency anomaly
  if (fingerprint.hardwareConcurrency === 0) {
    flags.noCPUInfo = true;
    reasons.push("No CPU information available - suspicious");
    riskScore += 15;
    consistencyScore -= 10;
  } else if (fingerprint.hardwareConcurrency > 32) {
    flags.unusualCPUCount = true;
    reasons.push("Unusually high CPU core count - possible virtual machine");
    riskScore += 10;
    consistencyScore -= 5;
  } else {
    flags.noCPUInfo = false;
    flags.unusualCPUCount = false;
  }
  
  // 7. Language/Timezone mismatch
  if (this.detectLanguageTimezoneMismatch(fingerprint.language, fingerprint.timezone)) {
    flags.languageTimezoneMismatch = true;
    reasons.push("Language and timezone mismatch - possible VPN or location spoofing");
    riskScore += 15;
    consistencyScore -= 10;
  } else {
    flags.languageTimezoneMismatch = false;
  }
  
  // 8. Touch capability mismatch
  const isMobileUA = /android|iphone|ipad|ipod|mobile/i.test(fingerprint.userAgent);
  const hasTouch = fingerprint.touchSupport || fingerprint.maxTouchPoints > 0;
  
  if (isMobileUA && !hasTouch) {
    flags.touchCapabilityMismatch = true;
    reasons.push("Claims mobile device but no touch support - likely emulator");
    riskScore += 35;
    consistencyScore -= 35;
  } else if (!isMobileUA && fingerprint.maxTouchPoints > 10) {
    flags.unusualTouchPoints = true;
    reasons.push("Desktop with unusual touch points - suspicious");
    riskScore += 10;
    consistencyScore -= 10;
  } else {
    flags.touchCapabilityMismatch = false;
    flags.unusualTouchPoints = false;
  }
  
  // 9. Screen resolution anomalies
  const commonBotResolutions = [
    '1920x1080', '1366x768', '1280x1024', '1024x768', '800x600'
  ];
  const currentResolution = `${fingerprint.screenWidth}x${fingerprint.screenHeight}`;
  
  if (commonBotResolutions.includes(currentResolution) && isMobileUA) {
    flags.mobileWithDesktopResolution = true;
    reasons.push("Mobile user agent with desktop resolution - emulator");
    riskScore += 30;
    consistencyScore -= 30;
  } else {
    flags.mobileWithDesktopResolution = false;
  }
  
  // 10. All storage disabled
  const storageDisabled = !fingerprint.localStorageEnabled && 
                         !fingerprint.sessionStorageEnabled && 
                         !fingerprint.indexedDBEnabled;
  
  if (storageDisabled) {
    flags.allStorageDisabled = true;
    reasons.push("All storage mechanisms disabled - extreme privacy or bot");
    riskScore += 20;
    consistencyScore -= 15;
  } else {
    flags.allStorageDisabled = false;
  }
  
  // 11. Plugin anomalies
  if (fingerprint.plugins === 'no-plugins' && !isMobileUA) {
    flags.noPluginsOnDesktop = true;
    reasons.push("Desktop browser with no plugins - suspicious");
    riskScore += 15;
    consistencyScore -= 10;
  } else {
    flags.noPluginsOnDesktop = false;
  }
  
  // 12. DoNotTrack enabled (minor flag)
  if (fingerprint.doNotTrack === '1') {
    flags.doNotTrackEnabled = true;
    riskScore += 5;
  } else {
    flags.doNotTrackEnabled = false;
  }
  
  // Calculate risk level
  let riskLevel = 'LOW';
  if (riskScore >= 50) {
    riskLevel = 'HIGH';
  } else if (riskScore >= 20) {
    riskLevel = 'MEDIUM';
  }
  
  console.log(`🎯 Fraud Analysis Complete - Risk: ${riskLevel} (Score: ${riskScore}/100)`);
  if (reasons.length > 0) {
    console.log("⚠️ Risk Reasons:", reasons);
  }
  
  return {
    flags,
    riskScore,
    riskLevel,
    riskReasons: reasons,
    consistencyScore
  };
}

// ==========================================
// HELPER METHODS
// ==========================================

// Detect language/timezone mismatch
detectLanguageTimezoneMismatch(language, timezone) {
  if (!language || !timezone) return false;
  
  // Extract country code from language (e.g., "en-US" -> "US")
  const langParts = language.split('-');
  const countryCode = langParts.length > 1 ? langParts[1].toUpperCase() : langParts[0].toUpperCase();
  
  // Common suspicious combinations
  const suspiciousCombos = {
    'US': ['Asia/', 'Europe/', 'Africa/', 'Australia/'],
    'GB': ['Asia/', 'America/', 'Africa/', 'Australia/'],
    'IN': ['America/', 'Europe/'],
    'CN': ['America/', 'Europe/'],
    'RU': ['America/', 'Asia/Kolkata']
  };
  
  if (suspiciousCombos[countryCode]) {
    return suspiciousCombos[countryCode].some(region => timezone.startsWith(region));
  }
  
  return false;
}

// Calculate fingerprint stability
calculateFingerprintStability(fingerprint) {
  const totalComponents = Object.keys(fingerprint).length;
  
  const availableComponents = Object.values(fingerprint).filter(value => {
    if (value === null || value === undefined) return false;
    if (value === 'unsupported' || value === 'blocked' || value === 'no-plugins') return false;
    if (value === '' || value === 0) return false;
    return true;
  }).length;
  
  const stability = Math.round((availableComponents / totalComponents) * 100);
  
  console.log(`📊 Fingerprint Stability: ${stability}% (${availableComponents}/${totalComponents} components)`);
  return stability;
}

// Detect platform type
detectPlatformType(fingerprint) {
  const ua = fingerprint.userAgent.toLowerCase();
  
  if (ua.includes('android')) return 'Android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'iOS';
  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('mac')) return 'macOS';
  if (ua.includes('linux')) return 'Linux';
  if (ua.includes('cros')) return 'ChromeOS';
  
  return 'Unknown';
}

// Detect device category
detectDeviceCategory(fingerprint) {
  const ua = fingerprint.userAgent.toLowerCase();
  const screenWidth = fingerprint.screenWidth;
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return screenWidth > 768 ? 'Tablet' : 'Mobile';
  }
  
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'Tablet';
  }
  
  return 'Desktop';
}

// Storage methods
getStoredDeviceID() {
  try {
    const stored = localStorage.getItem('bargad_device_id');
    if (stored) {
      console.log("✅ Found existing device ID:", stored);
      return stored;
    }
    return null;
  } catch (e) {
    console.log("⚠️ Could not access localStorage:", e.message);
    return null;
  }
}

storeDeviceID(deviceID) {
  try {
    localStorage.setItem('bargad_device_id', deviceID);
    console.log("💾 Stored device ID:", deviceID);
    return true;
  } catch (e) {
    console.log("⚠️ Could not store device ID:", e.message);
    return false;
  }
}

canAccessLocalStorage() {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

canAccessSessionStorage() {
  try {
    const test = '__test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

generateSessionID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
}

getSessionCount() {
  try {
    const count = parseInt(localStorage.getItem('bargad_session_count') || '0');
    const newCount = count + 1;
    localStorage.setItem('bargad_session_count', newCount.toString());
    return newCount;
  } catch (e) {
    return 1;
  }
}

getLastSeenTimestamp() {
  try {
    const lastSeen = localStorage.getItem('bargad_last_seen');
    const now = Date.now();
    localStorage.setItem('bargad_last_seen', now.toString());
    return lastSeen ? parseInt(lastSeen) : null;
  } catch (e) {
    return null;
  }
}

getDaysSinceLastVisit() {
  const lastSeen = this.getLastSeenTimestamp();
  if (!lastSeen) return 0;
  
  const now = Date.now();
  const diffMs = now - lastSeen;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Extract device model from User Agent
extractDeviceModel(userAgent) {
  try {
    // Mobile device patterns
    const mobilePatterns = [
      // iPhone
      /iPhone\s*(\d+[,\s]*\d+)?/i,
      // iPad
      /iPad\d*[,\s]*\d+/i,
      // Samsung
      /SM-[A-Z]\d+/i,
      // Generic Android
      /Android.*;\s*([^)]+)\s*Build/i,
      // Other patterns
      /\(([^;]+);[^)]*\)/
    ];
    
    for (let pattern of mobilePatterns) {
      const match = userAgent.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    // Desktop detection
    if (/Windows NT/i.test(userAgent)) return 'Windows Desktop';
    if (/Macintosh/i.test(userAgent)) return 'Mac Desktop';
    if (/Linux/i.test(userAgent)) return 'Linux Desktop';
    
    return 'UNKNOWN';
  } catch (e) {
    console.error('Error extracting device model:', e);
    return 'ERROR';
  }
}

// Extract OS Version from User Agent
extractOSVersion(userAgent) {
  try {
    // Windows
    const windowsMatch = userAgent.match(/Windows NT (\d+\.\d+)/i);
    if (windowsMatch) {
      const versionMap = {
        '10.0': 'Windows 10/11',
        '6.3': 'Windows 8.1',
        '6.2': 'Windows 8',
        '6.1': 'Windows 7',
        '6.0': 'Windows Vista'
      };
      return versionMap[windowsMatch[1]] || `Windows NT ${windowsMatch[1]}`;
    }
    
    // macOS
    const macMatch = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/i);
    if (macMatch) {
      return `macOS ${macMatch[1].replace(/_/g, '.')}`;
    }
    
    // iOS
    const iosMatch = userAgent.match(/OS (\d+[._]\d+[._]?\d*)/i);
    if (iosMatch && /iPhone|iPad|iPod/.test(userAgent)) {
      return `iOS ${iosMatch[1].replace(/_/g, '.')}`;
    }
    
    // Android
    const androidMatch = userAgent.match(/Android (\d+\.?\d*\.?\d*)/i);
    if (androidMatch) {
      return `Android ${androidMatch[1]}`;
    }
    
    // Linux
    if (/Linux/i.test(userAgent)) {
      return 'Linux';
    }
    
    return 'UNKNOWN';
  } catch (e) {
    console.error('Error extracting OS version:', e);
    return 'ERROR';
  }
}

// Extract brand name from User Agent
extractBrandFromUserAgent(userAgent) {
  try {
    // Check for common manufacturers
    if (/Samsung/i.test(userAgent)) return 'Samsung';
    if (/Xiaomi|MI |Redmi/i.test(userAgent)) return 'Xiaomi';
    if (/OPPO/i.test(userAgent)) return 'OPPO';
    if (/vivo/i.test(userAgent)) return 'vivo';
    if (/OnePlus/i.test(userAgent)) return 'OnePlus';
    if (/Huawei|HONOR/i.test(userAgent)) return 'Huawei';
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'Apple';
    if (/Pixel/i.test(userAgent)) return 'Google';
    if (/Nokia/i.test(userAgent)) return 'Nokia';
    if (/Motorola|Moto/i.test(userAgent)) return 'Motorola';
    if (/LG/i.test(userAgent)) return 'LG';
    if (/Sony/i.test(userAgent)) return 'Sony';
    
    // Desktop brands
    if (/Windows NT/i.test(userAgent)) return 'Microsoft';
    if (/Macintosh/i.test(userAgent)) return 'Apple';
    if (/Linux/i.test(userAgent)) return 'Linux';
    
    // Use vendor if available
    if (navigator.vendor) return navigator.vendor;
    
    return 'UNKNOWN';
  } catch (e) {
    console.error('Error extracting brand:', e);
    return 'ERROR';
  }
}

// Get available keyboards (Web browsers have limited access)
getAvailableKeyboards() {
  try {
    // Check if keyboard API exists (very limited in browsers)
    if ('keyboard' in navigator) {
      return 'KEYBOARD_API_AVAILABLE';
    }
    
    // Check input method (limited info)
    const inputMethods = [];
    
    if ('virtualKeyboard' in navigator) {
      inputMethods.push('Virtual Keyboard');
    }
    
    // Language-based keyboard detection
    const languages = navigator.languages || [navigator.language];
    const keyboardLayouts = languages.map(lang => `${lang.toUpperCase()}_LAYOUT`);
    
    return keyboardLayouts.length > 0 
      ? keyboardLayouts.join(', ') 
      : 'PHYSICAL_KEYBOARD_ASSUMED';
  } catch (e) {
    console.error('Error detecting keyboards:', e);
    return 'ERROR';
  }
}

// Get audio settings
getAudioSettings() {
  try {
    const audioInfo = {
      audioContextSupported: 'AudioContext' in window || 'webkitAudioContext' in window,
      audioWorkletSupported: 'AudioWorklet' in window,
      mediaDevicesSupported: 'mediaDevices' in navigator,
      webAudioAPI: 'SUPPORTED'
    };
    
    // Try to get audio output devices count (if permission granted)
    if ('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
          const audioInputs = devices.filter(d => d.kind === 'audioinput');
          audioInfo.audioOutputDevices = audioOutputs.length;
          audioInfo.audioInputDevices = audioInputs.length;
        })
        .catch(() => {
          audioInfo.audioOutputDevices = 'PERMISSION_DENIED';
          audioInfo.audioInputDevices = 'PERMISSION_DENIED';
        });
    }
    
    return audioInfo;
  } catch (e) {
    console.error('Error getting audio settings:', e);
    return {
      audioContextSupported: false,
      webAudioAPI: 'ERROR',
      error: e.message
    };
  }
}

// Detect available sensors
detectAvailableSensors() {
  try {
    const sensors = [];
    
    // Check for various sensor APIs
    if ('Accelerometer' in window) sensors.push('Accelerometer');
    if ('LinearAccelerationSensor' in window) sensors.push('LinearAccelerationSensor');
    if ('Gyroscope' in window) sensors.push('Gyroscope');
    if ('Magnetometer' in window) sensors.push('Magnetometer');
    if ('AbsoluteOrientationSensor' in window) sensors.push('AbsoluteOrientationSensor');
    if ('RelativeOrientationSensor' in window) sensors.push('RelativeOrientationSensor');
    if ('AmbientLightSensor' in window) sensors.push('AmbientLightSensor');
    if ('ProximitySensor' in window) sensors.push('ProximitySensor');
    
    // Legacy DeviceMotion/DeviceOrientation
    if ('DeviceMotionEvent' in window) sensors.push('DeviceMotion');
    if ('DeviceOrientationEvent' in window) sensors.push('DeviceOrientation');
    
    // Geolocation
    if ('geolocation' in navigator) sensors.push('Geolocation');
    
    // Battery
    if ('getBattery' in navigator) sensors.push('Battery');
    
    return sensors.length > 0 ? sensors : ['NO_SENSORS_DETECTED'];
  } catch (e) {
    console.error('Error detecting sensors:', e);
    return ['ERROR'];
  }
}

// ==========================================
// EMIT DEVICE ID DATA
// ==========================================

emitDeviceID() {
  console.log("📤 emitDeviceID() called");
  
  if (!this.deviceIDData) {
    console.log("❌ Device ID data not initialized");
    return;
  }
  
  console.log("📊 Emitting device ID data:", this.deviceIDData);
  
  this.emit({
    type: "DEVICE_ID",
    payload: this.deviceIDData,
    timestamp: Date.now(),
    userId: this.userId
  });
  
  console.log("✅ Device ID data emitted successfully!");
}


    // ==========================================
// IMEI INITIALIZATION
// ==========================================

async initIMEI() {
  console.log("===========================================");
  console.log("initIMEI() called - IMEI tracking starting...");
  console.log("===========================================");
  
  try {
    // STEP 1: Detect environment
    const environment = this.detectEnvironment();
    console.log("📱 Environment detected:", environment);
    
    // STEP 2: Attempt to retrieve IMEI (async)
    const imeiInfo = await this.retrieveIMEI(environment);
    console.log("📊 IMEI retrieval result:", imeiInfo);
    
    // STEP 3: Validate IMEI format (if retrieved)
    const validation = this.validateIMEI(imeiInfo);
    console.log("✅ IMEI validation:", validation);
    
    // STEP 4: Fraud detection analysis
    const fraudAnalysis = this.analyzeIMEIFraud(imeiInfo, environment, validation);
    console.log("🔍 Fraud analysis:", fraudAnalysis);
    
    // STEP 5: Build complete IMEI data object
    this.imeiData = {
      // === CORE IMEI DATA ===
      imei: imeiInfo.imei,
      imei2: imeiInfo.imei2, // For dual-SIM devices
      meid: imeiInfo.meid,   // For CDMA devices
      
      // === ACCESS STATUS ===
      imeiAccessible: imeiInfo.accessible,
      imeiSource: imeiInfo.source,
      retrievalMethod: imeiInfo.method,
      
      // === VALIDATION ===
      isValidFormat: validation.isValid,
      validationDetails: validation.details,
      imeiChecksum: validation.checksum,
      
      // === ENVIRONMENT ===
      environment: environment.type,
      environmentDetails: environment.details,
      platformType: environment.platformType,
      isMobilePlatform: environment.isMobile,
      isNativeApp: environment.isNativeApp,
      isWebBrowser: environment.isWebBrowser,
      hasNativeBridge: environment.hasNativeBridge,
      
      // === DEVICE INFO ===
      deviceManufacturer: imeiInfo.manufacturer || null,
      deviceModel: imeiInfo.model || null,
      deviceBrand: imeiInfo.brand || null,
      
      // === SIM INFO (if available) ===
      simCount: imeiInfo.simCount || null,
      isDualSIM: imeiInfo.simCount > 1,
      simOperator: imeiInfo.simOperator || null,
      
      // === ALTERNATIVE ID ===
      alternativeDeviceID: this.deviceIDData ? this.deviceIDData.deviceID : null,
      useDeviceFingerprint: !imeiInfo.accessible,
      
      // === 🚨 FRAUD DETECTION FLAGS ===
      suspicionFlags: fraudAnalysis.flags,
      
      // === RISK ASSESSMENT ===
      riskScore: fraudAnalysis.riskScore,
      riskLevel: fraudAnalysis.riskLevel,
      riskReasons: fraudAnalysis.riskReasons,
      
      // === CONSISTENCY CHECKS ===
      platformConsistency: fraudAnalysis.platformConsistency,
      deviceConsistencyScore: fraudAnalysis.deviceConsistencyScore,
      imeiDeviceMatch: fraudAnalysis.imeiDeviceMatch,
      
      // === METADATA ===
      capturedAt: Date.now(),
      permissionStatus: imeiInfo.permissionStatus,
      errorMessage: imeiInfo.error || null
    };
    
    console.log("📊 Complete IMEI Data:", this.imeiData);
    console.log("✅ IMEI tracking initialized successfully!");
    console.log("===========================================");
    
  } catch (error) {
    console.error("❌ Error initializing IMEI:", error);
    this.imeiData = {
      error: true,
      errorMessage: error.message,
      imeiAccessible: false,
      environment: "error",
      riskLevel: "UNKNOWN"
    };
  }
}

// ==========================================
// ENVIRONMENT DETECTION
// ==========================================

detectEnvironment() {
  console.log("🔍 Detecting environment...");
  
  const ua = navigator.userAgent;
  const uaLower = ua.toLowerCase();
  
  // Platform detection
  const platformType = this.detectPlatformType();
  const isMobile = /android|iphone|ipad|ipod|mobile/i.test(ua);
  const isAndroid = /android/i.test(ua);
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  
  // Native app detection
  const hasNativeBridge = this.checkNativeBridge();
  const isNativeApp = hasNativeBridge.any;
  const isWebBrowser = !isNativeApp;
  
  // Browser detection
  const browser = this.detectBrowser();
  
  // WebView detection
  const isWebView = this.detectWebView();
  
  const details = {
    userAgent: ua,
    browser: browser,
    isAndroid: isAndroid,
    isIOS: isIOS,
    isWebView: isWebView,
    nativeBridges: hasNativeBridge,
    inIframe: window.self !== window.top,
    hasGeolocation: 'geolocation' in navigator,
    hasBluetooth: 'bluetooth' in navigator,
    hasUSB: 'usb' in navigator
  };
  
  return {
    type: isNativeApp ? 'native-app' : 'web-browser',
    platformType,
    isMobile,
    isAndroid,
    isIOS,
    isNativeApp,
    isWebBrowser,
    hasNativeBridge: hasNativeBridge.any,
    details
  };
}

// Check for native bridges
checkNativeBridge() {
  const bridges = {
    cordova: typeof window.cordova !== 'undefined',
    reactNative: typeof window.ReactNativeWebView !== 'undefined',
    flutter: typeof window.flutter_inappwebview !== 'undefined',
    ionic: typeof window.Ionic !== 'undefined',
    capacitor: typeof window.Capacitor !== 'undefined',
    iosWebView: typeof window.webkit?.messageHandlers !== 'undefined',
    androidWebView: typeof window.Android !== 'undefined',
    customBridge: typeof window.NativeInterface !== 'undefined' || typeof window.getNativeIMEI === 'function'
  };
  
  const any = Object.values(bridges).some(v => v === true);
  
  return { ...bridges, any };
}

// Detect WebView
detectWebView() {
  const ua = navigator.userAgent;
  
  // Android WebView indicators
  if (/; wv\)/.test(ua)) return 'android-webview';
  
  // iOS WebView indicators  
  if (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua)) return 'ios-webview';
  
  // Check for WebView-specific properties
  if (navigator.standalone !== undefined) return 'ios-webapp';
  
  return false;
}

// Detect platform
detectPlatformType() {
  const ua = navigator.userAgent.toLowerCase();
  
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/windows phone/i.test(ua)) return 'Windows Phone';
  if (/blackberry/i.test(ua)) return 'BlackBerry';
  if (/windows/i.test(ua)) return 'Windows';
  if (/mac/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  
  return 'Unknown';
}

// Detect browser
detectBrowser() {
  const ua = navigator.userAgent;
  
  if (/chrome|chromium|crios/i.test(ua)) return 'Chrome';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
  if (/edg/i.test(ua)) return 'Edge';
  if (/opr\//i.test(ua)) return 'Opera';
  if (/samsungbrowser/i.test(ua)) return 'Samsung Internet';
  
  return 'Unknown';
}

// ==========================================
// IMEI RETRIEVAL (MULTIPLE METHODS)
// ==========================================

async retrieveIMEI(environment) {
  console.log("📱 Attempting IMEI retrieval...");
  
  let imeiInfo = {
    imei: null,
    imei2: null,
    meid: null,
    accessible: false,
    source: 'none',
    method: 'none',
    manufacturer: null,
    model: null,
    brand: null,
    simCount: null,
    simOperator: null,
    permissionStatus: 'unknown',
    error: null
  };
  
  // ===================================
  // METHOD 1: Cordova Device Plugin
  // ===================================
  if (window.cordova && window.device) {
    console.log("🔌 Trying Cordova Device Plugin...");
    try {
      if (window.device.uuid) {
        imeiInfo.imei = window.device.uuid;
        imeiInfo.accessible = true;
        imeiInfo.source = 'cordova-device-plugin';
        imeiInfo.method = 'device.uuid';
        
        // Get additional device info
        imeiInfo.manufacturer = window.device.manufacturer || null;
        imeiInfo.model = window.device.model || null;
        imeiInfo.brand = window.device.platform || null;
        
        console.log("✅ IMEI retrieved from Cordova Device Plugin");
        return imeiInfo;
      }
    } catch (e) {
      console.log("⚠️ Cordova Device Plugin failed:", e.message);
    }
  }
  
  // ===================================
  // METHOD 2: Cordova UID Plugin
  // ===================================
  if (window.cordova?.plugins?.uid) {
    console.log("🔌 Trying Cordova UID Plugin...");
    try {
      const uid = window.cordova.plugins.uid;
      
      if (uid.IMEI) {
        imeiInfo.imei = uid.IMEI;
        imeiInfo.imei2 = uid.IMEI2 || null;
        imeiInfo.meid = uid.MEID || null;
        imeiInfo.accessible = true;
        imeiInfo.source = 'cordova-uid-plugin';
        imeiInfo.method = 'cordova.plugins.uid';
        
        console.log("✅ IMEI retrieved from Cordova UID Plugin");
        return imeiInfo;
      }
    } catch (e) {
      console.log("⚠️ Cordova UID Plugin failed:", e.message);
    }
  }
  
  // ===================================
  // METHOD 3: Capacitor Device Plugin
  // ===================================
  if (window.Capacitor) {
    console.log("🔌 Trying Capacitor Device Plugin...");
    try {
      const { Device } = window.Capacitor.Plugins;
      
      if (Device && Device.getId) {
        const deviceId = await Device.getId();
        
        if (deviceId && deviceId.identifier) {
          imeiInfo.imei = deviceId.identifier;
          imeiInfo.accessible = true;
          imeiInfo.source = 'capacitor-device-plugin';
          imeiInfo.method = 'Capacitor.Device.getId';
          
          // Get device info
          const deviceInfo = await Device.getInfo();
          imeiInfo.manufacturer = deviceInfo.manufacturer || null;
          imeiInfo.model = deviceInfo.model || null;
          imeiInfo.brand = deviceInfo.platform || null;
          
          console.log("✅ IMEI retrieved from Capacitor Device Plugin");
          return imeiInfo;
        }
      }
    } catch (e) {
      console.log("⚠️ Capacitor Device Plugin failed:", e.message);
      imeiInfo.error = e.message;
    }
  }
  
  // ===================================
  // METHOD 4: React Native Bridge
  // ===================================
  if (window.ReactNativeWebView) {
    console.log("🔌 Trying React Native Bridge...");
    try {
      // Request IMEI from React Native
      return new Promise((resolve) => {
        // Set up listener for response
        window.addEventListener('message', function imeiListener(event) {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'IMEI_RESPONSE') {
              imeiInfo.imei = data.imei || null;
              imeiInfo.imei2 = data.imei2 || null;
              imeiInfo.accessible = !!data.imei;
              imeiInfo.source = 'react-native-bridge';
              imeiInfo.method = 'ReactNativeWebView.postMessage';
              imeiInfo.manufacturer = data.manufacturer || null;
              imeiInfo.model = data.model || null;
              
              window.removeEventListener('message', imeiListener);
              console.log("✅ IMEI retrieved from React Native");
              resolve(imeiInfo);
            }
          } catch (e) {
            console.log("⚠️ React Native message parse failed");
          }
        });
        
        // Send request to React Native
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'GET_IMEI'
        }));
        
        // Timeout after 2 seconds
        setTimeout(() => {
          console.log("⏱️ React Native bridge timeout");
          resolve(imeiInfo);
        }, 2000);
      });
    } catch (e) {
      console.log("⚠️ React Native Bridge failed:", e.message);
    }
  }
  
  // ===================================
  // METHOD 5: Flutter WebView
  // ===================================
  if (window.flutter_inappwebview) {
    console.log("🔌 Trying Flutter WebView...");
    try {
      return new Promise((resolve) => {
        // Call Flutter method
        window.flutter_inappwebview.callHandler('getIMEI').then((result) => {
          if (result && result.imei) {
            imeiInfo.imei = result.imei;
            imeiInfo.imei2 = result.imei2 || null;
            imeiInfo.accessible = true;
            imeiInfo.source = 'flutter-webview';
            imeiInfo.method = 'flutter_inappwebview.callHandler';
            imeiInfo.manufacturer = result.manufacturer || null;
            imeiInfo.model = result.model || null;
            
            console.log("✅ IMEI retrieved from Flutter WebView");
          }
          resolve(imeiInfo);
        }).catch((e) => {
          console.log("⚠️ Flutter WebView failed:", e.message);
          resolve(imeiInfo);
        });
        
        // Timeout
        setTimeout(() => resolve(imeiInfo), 2000);
      });
    } catch (e) {
      console.log("⚠️ Flutter WebView failed:", e.message);
    }
  }
  
  // ===================================
  // METHOD 6: Android WebView Bridge
  // ===================================
  if (window.Android && typeof window.Android.getIMEI === 'function') {
    console.log("🔌 Trying Android WebView Bridge...");
    try {
      const imei = window.Android.getIMEI();
      
      if (imei) {
        imeiInfo.imei = imei;
        imeiInfo.accessible = true;
        imeiInfo.source = 'android-webview-bridge';
        imeiInfo.method = 'window.Android.getIMEI';
        
        // Try to get additional info
        if (typeof window.Android.getIMEI2 === 'function') {
          imeiInfo.imei2 = window.Android.getIMEI2();
        }
        
        if (typeof window.Android.getDeviceInfo === 'function') {
          const deviceInfo = JSON.parse(window.Android.getDeviceInfo());
          imeiInfo.manufacturer = deviceInfo.manufacturer || null;
          imeiInfo.model = deviceInfo.model || null;
          imeiInfo.brand = deviceInfo.brand || null;
        }
        
        console.log("✅ IMEI retrieved from Android WebView");
        return imeiInfo;
      }
    } catch (e) {
      console.log("⚠️ Android WebView Bridge failed:", e.message);
      imeiInfo.error = e.message;
    }
  }
  
  // ===================================
  // METHOD 7: iOS WebKit Bridge
  // ===================================
  if (window.webkit?.messageHandlers?.getIMEI) {
    console.log("🔌 Trying iOS WebKit Bridge...");
    try {
      return new Promise((resolve) => {
        // Set up listener
        window.addEventListener('imeiResponse', (event) => {
          const data = event.detail;
          if (data && data.imei) {
            imeiInfo.imei = data.imei;
            imeiInfo.accessible = true;
            imeiInfo.source = 'ios-webkit-bridge';
            imeiInfo.method = 'webkit.messageHandlers';
            imeiInfo.manufacturer = data.manufacturer || null;
            imeiInfo.model = data.model || null;
            
            console.log("✅ IMEI retrieved from iOS WebKit");
          } else {
            console.log("ℹ️ iOS doesn't provide IMEI (Apple restriction)");
            imeiInfo.permissionStatus = 'not-available-ios';
          }
          resolve(imeiInfo);
        }, { once: true });
        
        // Send message
        window.webkit.messageHandlers.getIMEI.postMessage({});
        
        // Timeout
        setTimeout(() => {
          console.log("⏱️ iOS WebKit bridge timeout");
          resolve(imeiInfo);
        }, 2000);
      });
    } catch (e) {
      console.log("⚠️ iOS WebKit Bridge failed:", e.message);
    }
  }
  
  // ===================================
  // METHOD 8: Custom Native Bridge
  // ===================================
  if (typeof window.getNativeIMEI === 'function') {
    console.log("🔌 Trying Custom Native Bridge...");
    try {
      const result = await window.getNativeIMEI();
      
      if (result && result.imei) {
        imeiInfo.imei = result.imei;
        imeiInfo.imei2 = result.imei2 || null;
        imeiInfo.accessible = true;
        imeiInfo.source = 'custom-native-bridge';
        imeiInfo.method = 'window.getNativeIMEI';
        imeiInfo.manufacturer = result.manufacturer || null;
        imeiInfo.model = result.model || null;
        
        console.log("✅ IMEI retrieved from Custom Native Bridge");
        return imeiInfo;
      }
    } catch (e) {
      console.log("⚠️ Custom Native Bridge failed:", e.message);
    }
  }
  
  // ===================================
  // NO METHOD WORKED
  // ===================================
  console.log("❌ No IMEI retrieval method succeeded");
  
  if (environment.isWebBrowser) {
    imeiInfo.source = 'web-browser-limitation';
    imeiInfo.error = 'IMEI not accessible from web browsers (security restriction)';
    imeiInfo.permissionStatus = 'not-available-web';
  } else if (environment.isIOS) {
    imeiInfo.source = 'ios-limitation';
    imeiInfo.error = 'iOS does not allow IMEI access (Apple policy)';
    imeiInfo.permissionStatus = 'not-available-ios';
  } else {
    imeiInfo.source = 'unknown';
    imeiInfo.error = 'No native bridge found or permission denied';
    imeiInfo.permissionStatus = 'permission-denied';
  }
  
  return imeiInfo;
}

// ==========================================
// IMEI VALIDATION
// ==========================================

validateIMEI(imeiInfo) {
  console.log("🔍 Validating IMEI...");
  
  const validation = {
    isValid: false,
    checksum: null,
    details: {
      hasCorrectLength: false,
      hasCorrectFormat: false,
      passesLuhnCheck: false,
      isKnownFake: false,
      isTestIMEI: false
    }
  };
  
  // If IMEI not accessible, skip validation
  if (!imeiInfo.accessible || !imeiInfo.imei) {
    validation.details.reason = 'IMEI not accessible';
    return validation;
  }
  
  const imei = imeiInfo.imei.toString();
  
  // Remove any non-digit characters
  const cleanIMEI = imei.replace(/\D/g, '');
  
  // Check length (IMEI is 15 digits, MEID is 14 digits)
  if (cleanIMEI.length === 15 || cleanIMEI.length === 14) {
    validation.details.hasCorrectLength = true;
  }
  
  // Check format (only digits)
  if (/^\d+$/.test(cleanIMEI)) {
    validation.details.hasCorrectFormat = true;
  }
  
  // Luhn algorithm check
  if (cleanIMEI.length === 15) {
    const passesLuhn = this.luhnCheck(cleanIMEI);
    validation.details.passesLuhnCheck = passesLuhn;
    
    if (passesLuhn) {
      validation.checksum = cleanIMEI.charAt(14); // Last digit is checksum
    }
  }
  
  // Check for known fake/test IMEIs
  const knownFakes = [
    '000000000000000',
    '111111111111111',
    '123456789012345',
    '359881234567890',
    '490154203237518', // Android Studio emulator
    '355438250127789'  // Common test IMEI
  ];
  
  if (knownFakes.includes(cleanIMEI)) {
    validation.details.isKnownFake = true;
  }
  
  // Check if it's a test IMEI (starts with 00, 11, or 99)
  if (cleanIMEI.startsWith('00') || cleanIMEI.startsWith('11') || cleanIMEI.startsWith('99')) {
    validation.details.isTestIMEI = true;
  }
  
  // Overall validity
  validation.isValid = 
    validation.details.hasCorrectLength &&
    validation.details.hasCorrectFormat &&
    validation.details.passesLuhnCheck &&
    !validation.details.isKnownFake &&
    !validation.details.isTestIMEI;
  
  console.log("✅ Validation complete:", validation.isValid ? "VALID" : "INVALID");
  
  return validation;
}

// Luhn algorithm for IMEI checksum validation
luhnCheck(imei) {
  let sum = 0;
  let shouldDouble = false;
  
  // Loop from right to left
  for (let i = imei.length - 1; i >= 0; i--) {
    let digit = parseInt(imei.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (sum % 10) === 0;
}

// ==========================================
// FRAUD DETECTION ANALYSIS
// ==========================================

analyzeIMEIFraud(imeiInfo, environment, validation) {
  console.log("🔍 Analyzing IMEI fraud patterns...");
  
  const flags = {};
  const reasons = [];
  let riskScore = 0;
  
  // 1. IMEI not accessible but claims to be native app
  if (!imeiInfo.accessible && environment.isNativeApp && environment.isAndroid) {
    flags.nativeAppWithoutIMEI = true;
    reasons.push("Android native app without IMEI access - permission denied or fake app");
    riskScore += 30;
  } else {
    flags.nativeAppWithoutIMEI = false;
  }
  
  // 2. iOS claiming to have IMEI (Apple doesn't allow)
  if (environment.isIOS && imeiInfo.accessible) {
    flags.iosWithIMEI = true;
    reasons.push("iOS device claims IMEI - impossible (Apple restriction), likely spoofed");
    riskScore += 50;
  } else {
    flags.iosWithIMEI = false;
  }
  
  // 3. Desktop/web claiming IMEI
  if (!environment.isMobile && imeiInfo.accessible) {
    flags.desktopWithIMEI = true;
    reasons.push("Non-mobile platform with IMEI - impossible, fraud detected");
    riskScore += 45;
  } else {
    flags.desktopWithIMEI = false;
  }
  
  // 4. Invalid IMEI format
  if (imeiInfo.accessible && !validation.isValid) {
    flags.invalidIMEI = true;
    
    if (!validation.details.hasCorrectLength) {
      reasons.push("IMEI has incorrect length (not 15 digits)");
      riskScore += 35;
    }
    if (!validation.details.passesLuhnCheck) {
      reasons.push("IMEI fails Luhn checksum validation - fake IMEI");
      riskScore += 40;
    }
  } else {
    flags.invalidIMEI = false;
  }
  
  // 5. Known fake/test IMEI
  if (validation.details.isKnownFake) {
    flags.knownFakeIMEI = true;
    reasons.push("IMEI matches known fake/emulator pattern");
    riskScore += 50;
  } else {
    flags.knownFakeIMEI = false;
  }
  
  // 6. Test IMEI
  if (validation.details.isTestIMEI) {
    flags.testIMEI = true;
    reasons.push("IMEI appears to be test/development device");
    riskScore += 25;
  } else {
    flags.testIMEI = false;
  }
  
  // 7. IMEI matches device fingerprint?
  let imeiDeviceMatch = true;
  if (this.deviceIDData && imeiInfo.accessible) {
    imeiDeviceMatch = this.crossValidateIMEI(imeiInfo, this.deviceIDData);
    
    if (!imeiDeviceMatch) {
      flags.imeiDeviceMismatch = true;
      reasons.push("IMEI doesn't match device fingerprint characteristics");
      riskScore += 30;
    } else {
      flags.imeiDeviceMismatch = false;
    }
  }
  
  // 8. Check for duplicate IMEI (if you have history)
  // In production, check against database of known IMEIs
  
  // Calculate consistency scores
  const platformConsistency = this.calculatePlatformConsistency(imeiInfo, environment);
  const deviceConsistencyScore = this.calculateDeviceConsistency(imeiInfo, environment, validation);
  
  // Risk level
  let riskLevel = 'LOW';
  if (riskScore >= 50) {
    riskLevel = 'HIGH';
  } else if (riskScore >= 20) {
    riskLevel = 'MEDIUM';
  }
  
  // Handle cases where IMEI is legitimately not accessible
  if (!imeiInfo.accessible && (environment.isWebBrowser || environment.isIOS)) {
    riskLevel = 'LOW';
    riskScore = 0;
    reasons.push("IMEI not accessible - expected for web browser/iOS (using device fingerprint instead)");
  }
  
  console.log(`🎯 IMEI Fraud Analysis - Risk: ${riskLevel} (Score: ${riskScore}/100)`);
  
  return {
    flags,
    riskScore,
    riskLevel,
    riskReasons: reasons,
    platformConsistency,
    deviceConsistencyScore,
    imeiDeviceMatch
  };
}

// Cross-validate IMEI with device fingerprint
crossValidateIMEI(imeiInfo, deviceFingerprint) {
  // Check if platform types match
  const fingerprintIsMobile = 
    deviceFingerprint.deviceCategory === 'Mobile' || 
    deviceFingerprint.platformType === 'Android' ||
    deviceFingerprint.platformType === 'iOS';
  
  const imeiIsMobile = imeiInfo.accessible;
  
  // If IMEI exists, device should be mobile
  if (imeiIsMobile && !fingerprintIsMobile) {
    return false; // Mismatch!
  }
  
  // Check manufacturer/brand consistency
  if (imeiInfo.manufacturer && deviceFingerprint.fingerprint) {
    const ua = deviceFingerprint.fingerprint.userAgent.toLowerCase();
    const manufacturer = imeiInfo.manufacturer.toLowerCase();
    
    if (!ua.includes(manufacturer)) {
      return false; // Manufacturer mismatch
    }
  }
  
  return true;
}

// Calculate platform consistency
calculatePlatformConsistency(imeiInfo, environment) {
  let score = 100;
  
  // Deduct if inconsistencies found
  if (imeiInfo.accessible && !environment.isMobile) score -= 50;
  if (imeiInfo.accessible && environment.isIOS) score -= 40;
  if (!imeiInfo.accessible && environment.isNativeApp && environment.isAndroid) score -= 20;
  
  return Math.max(0, score);
}

// Calculate device consistency
calculateDeviceConsistency(imeiInfo, environment, validation) {
  let score = 100;
  
  if (imeiInfo.accessible) {
    if (!validation.isValid) score -= 40;
    if (validation.details.isKnownFake) score -= 50;
    if (validation.details.isTestIMEI) score -= 20;
  }
  
  return Math.max(0, score);
}

// ==========================================
// EMIT IMEI DATA
// ==========================================

emitIMEI() {
  console.log("📤 emitIMEI() called");
  
  if (!this.imeiData) {
    console.log("❌ IMEI data not initialized");
    return;
  }
  
  console.log("📊 Emitting IMEI data:", this.imeiData);
  
  this.emit({
    type: "DEVICE_IMEI",
    payload: this.imeiData,
    timestamp: Date.now(),
    userId: this.userId
  });
  
  console.log("✅ IMEI data emitted successfully!");
}

    
// ==========================================
// BLUETOOTH DEVICES INITIALIZATION
// ==========================================

async initBluetoothDevices() {
  console.log("===========================================");
  console.log("initBluetoothDevices() called - Bluetooth tracking starting...");
  console.log("===========================================");
  
  try {
    // STEP 1: Check Bluetooth API availability
    const apiAvailability = this.checkBluetoothAPIAvailability();
    console.log("📡 Bluetooth API availability:", apiAvailability);
    
    // STEP 2: Detect environment
    const environment = this.detectBluetoothEnvironment();
    console.log("📱 Environment:", environment);
    
    // STEP 3: Attempt to get Bluetooth devices
    const bluetoothInfo = await this.retrieveBluetoothDevices(apiAvailability, environment);
    console.log("📊 Bluetooth retrieval result:", bluetoothInfo);
    
    // STEP 4: Fraud detection analysis
    const fraudAnalysis = this.analyzeBluetoothFraud(bluetoothInfo, environment);
    console.log("🔍 Fraud analysis:", fraudAnalysis);
    
    // STEP 5: Build complete Bluetooth data object
    this.bluetoothData = {
      // === CORE BLUETOOTH DATA ===
      bluetoothSupported: apiAvailability.supported,
      bluetoothEnabled: bluetoothInfo.enabled,
      bluetoothAvailable: bluetoothInfo.available,
      
      // === DEVICES ===
      pairedDevices: bluetoothInfo.pairedDevices || [],
      nearbyDevices: bluetoothInfo.nearbyDevices || [],
      connectedDevices: bluetoothInfo.connectedDevices || [],
      
      // === COUNTS ===
      totalPairedDevices: bluetoothInfo.pairedDevices?.length || 0,
      totalNearbyDevices: bluetoothInfo.nearbyDevices?.length || 0,
      totalConnectedDevices: bluetoothInfo.connectedDevices?.length || 0,
      
      // === DEVICE CATEGORIES ===
      deviceCategories: this.categorizeBluetoothDevices(bluetoothInfo.pairedDevices || []),
      
      // === API INFO ===
      apiType: apiAvailability.apiType,
      apiVersion: apiAvailability.version,
      retrievalMethod: bluetoothInfo.method,
      
      // === PERMISSIONS ===
      permissionStatus: bluetoothInfo.permissionStatus,
      permissionGranted: bluetoothInfo.permissionGranted,
      
      // === ENVIRONMENT ===
      environment: environment.type,
      platformType: environment.platformType,
      isMobilePlatform: environment.isMobile,
      browser: environment.browser,
      
      // === 🚨 FRAUD DETECTION FLAGS ===
      suspicionFlags: fraudAnalysis.flags,
      
      // === RISK ASSESSMENT ===
      riskScore: fraudAnalysis.riskScore,
      riskLevel: fraudAnalysis.riskLevel,
      riskReasons: fraudAnalysis.riskReasons,
      
      // === CONSISTENCY SCORES ===
      deviceAuthenticityScore: fraudAnalysis.authenticityScore,
      behavioralConsistency: fraudAnalysis.behavioralConsistency,
      
      // === METADATA ===
      capturedAt: Date.now(),
      errorMessage: bluetoothInfo.error || null
    };
    
    console.log("📊 Complete Bluetooth Data:", this.bluetoothData);
    console.log("✅ Bluetooth tracking initialized successfully!");
    console.log("===========================================");
    
  } catch (error) {
    console.error("❌ Error initializing Bluetooth:", error);
    this.bluetoothData = {
      error: true,
      errorMessage: error.message,
      bluetoothSupported: false,
      bluetoothAvailable: false,
      totalPairedDevices: 0,
      riskLevel: "UNKNOWN"
    };
  }
}

// ==========================================
// CHECK BLUETOOTH API AVAILABILITY
// ==========================================

checkBluetoothAPIAvailability() {
  console.log("🔍 Checking Bluetooth API availability...");
  
  const availability = {
    supported: false,
    apiType: 'none',
    version: null,
    capabilities: {
      webBluetooth: false,
      bluetoothLE: false,
      classicBluetooth: false
    }
  };
  
  // Check for Web Bluetooth API
  if (navigator.bluetooth) {
    availability.supported = true;
    availability.apiType = 'web-bluetooth-api';
    availability.capabilities.webBluetooth = true;
    availability.capabilities.bluetoothLE = true; // Web Bluetooth only supports BLE
    console.log("✅ Web Bluetooth API detected");
  }
  
  // Check for Bluetooth object (some browsers)
  if (typeof window.Bluetooth !== 'undefined') {
    availability.supported = true;
    console.log("✅ Bluetooth object available");
  }
  
  // Check for Cordova Bluetooth plugin
  if (window.cordova?.plugins?.bluetooth) {
    availability.supported = true;
    availability.apiType = 'cordova-bluetooth-plugin';
    availability.capabilities.classicBluetooth = true;
    console.log("✅ Cordova Bluetooth plugin detected");
  }
  
  // Check for custom native bridge
  if (window.Android?.getBluetoothDevices || window.webkit?.messageHandlers?.getBluetoothDevices) {
    availability.supported = true;
    availability.apiType = 'native-bridge';
    availability.capabilities.classicBluetooth = true;
    console.log("✅ Native Bluetooth bridge detected");
  }
  
  if (!availability.supported) {
    console.log("❌ No Bluetooth API available");
  }
  
  return availability;
}

// ==========================================
// DETECT BLUETOOTH ENVIRONMENT
// ==========================================

detectBluetoothEnvironment() {
  const ua = navigator.userAgent;
  const uaLower = ua.toLowerCase();
  
  return {
    type: this.checkNativeBridge().any ? 'native-app' : 'web-browser',
    platformType: this.detectPlatformType(),
    isMobile: /android|iphone|ipad|ipod|mobile/i.test(ua),
    isAndroid: /android/i.test(ua),
    isIOS: /iphone|ipad|ipod/i.test(ua),
    browser: this.detectBrowser(),
    isSecureContext: window.isSecureContext, // HTTPS required for Web Bluetooth
    hasNativeBridge: this.checkNativeBridge().any
  };
}

// ==========================================
// RETRIEVE BLUETOOTH DEVICES
// ==========================================

async retrieveBluetoothDevices(apiAvailability, environment) {
  console.log("📡 Attempting to retrieve Bluetooth devices...");
  
  let bluetoothInfo = {
    enabled: null,
    available: false,
    pairedDevices: [],
    nearbyDevices: [],
    connectedDevices: [],
    method: 'none',
    permissionStatus: 'unknown',
    permissionGranted: false,
    error: null
  };
  
  // ===================================
  // METHOD 1: Web Bluetooth API
  // ===================================
  if (navigator.bluetooth && apiAvailability.capabilities.webBluetooth) {
    console.log("🔌 Trying Web Bluetooth API...");
    
    try {
      // Check if Bluetooth is available
      const available = await navigator.bluetooth.getAvailability();
      bluetoothInfo.available = available;
      bluetoothInfo.enabled = available;
      
      console.log(`📡 Bluetooth available: ${available}`);
      
      if (available) {
        // Request device (this will prompt user for permission)
        try {
          console.log("🔐 Requesting Bluetooth device access...");
          
          // Request access to all devices
          const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service', 'device_information']
          });
          
          if (device) {
            bluetoothInfo.permissionGranted = true;
            bluetoothInfo.permissionStatus = 'granted';
            
            // Add the device
            bluetoothInfo.nearbyDevices.push({
              name: device.name || 'Unknown Device',
              id: device.id || null,
              type: 'bluetooth-le',
              connected: device.gatt?.connected || false
            });
            
            if (device.gatt?.connected) {
              bluetoothInfo.connectedDevices.push(device.name || 'Unknown Device');
            }
            
            bluetoothInfo.method = 'web-bluetooth-api';
            console.log("✅ Bluetooth device retrieved via Web Bluetooth API");
            
            return bluetoothInfo;
          }
          
        } catch (permissionError) {
          console.log("⚠️ User denied Bluetooth permission or cancelled");
          bluetoothInfo.permissionStatus = 'denied';
          bluetoothInfo.permissionGranted = false;
          bluetoothInfo.error = 'User denied Bluetooth access';
        }
      } else {
        console.log("ℹ️ Bluetooth not available on this device");
        bluetoothInfo.error = 'Bluetooth not available';
      }
      
    } catch (error) {
      console.log("⚠️ Web Bluetooth API failed:", error.message);
      bluetoothInfo.error = error.message;
    }
  }
  
  // ===================================
  // METHOD 2: Cordova Bluetooth Plugin
  // ===================================
  if (window.cordova?.plugins?.bluetooth) {
    console.log("🔌 Trying Cordova Bluetooth Plugin...");
    
    try {
      return new Promise((resolve) => {
        window.cordova.plugins.bluetooth.list((devices) => {
          bluetoothInfo.pairedDevices = devices.map(device => ({
            name: device.name,
            address: device.address,
            type: device.class || 'unknown',
            paired: true
          }));
          
          bluetoothInfo.available = true;
          bluetoothInfo.enabled = true;
          bluetoothInfo.method = 'cordova-bluetooth-plugin';
          bluetoothInfo.permissionStatus = 'granted';
          bluetoothInfo.permissionGranted = true;
          
          console.log(`✅ Found ${devices.length} paired Bluetooth devices via Cordova`);
          resolve(bluetoothInfo);
          
        }, (error) => {
          console.log("⚠️ Cordova Bluetooth failed:", error);
          bluetoothInfo.error = error;
          resolve(bluetoothInfo);
        });
        
        // Timeout
        setTimeout(() => resolve(bluetoothInfo), 3000);
      });
      
    } catch (error) {
      console.log("⚠️ Cordova Bluetooth exception:", error.message);
    }
  }
  
  // ===================================
  // METHOD 3: Android WebView Bridge
  // ===================================
  if (window.Android && typeof window.Android.getBluetoothDevices === 'function') {
    console.log("🔌 Trying Android WebView Bridge...");
    
    try {
      const devicesJson = window.Android.getBluetoothDevices();
      const devices = JSON.parse(devicesJson);
      
      bluetoothInfo.pairedDevices = devices.paired || [];
      bluetoothInfo.connectedDevices = devices.connected || [];
      bluetoothInfo.enabled = devices.enabled || false;
      bluetoothInfo.available = true;
      bluetoothInfo.method = 'android-webview-bridge';
      bluetoothInfo.permissionStatus = 'granted';
      bluetoothInfo.permissionGranted = true;
      
      console.log(`✅ Retrieved Bluetooth devices from Android WebView`);
      return bluetoothInfo;
      
    } catch (error) {
      console.log("⚠️ Android WebView Bridge failed:", error.message);
      bluetoothInfo.error = error.message;
    }
  }
  
  // ===================================
  // METHOD 4: iOS WebKit Bridge
  // ===================================
  if (window.webkit?.messageHandlers?.getBluetoothDevices) {
    console.log("🔌 Trying iOS WebKit Bridge...");
    
    try {
      return new Promise((resolve) => {
        // Listen for response
        window.addEventListener('bluetoothResponse', (event) => {
          const data = event.detail;
          
          if (data && data.devices) {
            bluetoothInfo.pairedDevices = data.devices;
            bluetoothInfo.enabled = data.enabled || false;
            bluetoothInfo.available = true;
            bluetoothInfo.method = 'ios-webkit-bridge';
            bluetoothInfo.permissionStatus = 'granted';
            bluetoothInfo.permissionGranted = true;
          }
          
          console.log("✅ Retrieved Bluetooth devices from iOS WebKit");
          resolve(bluetoothInfo);
          
        }, { once: true });
        
        // Send request
        window.webkit.messageHandlers.getBluetoothDevices.postMessage({});
        
        // Timeout
        setTimeout(() => {
          console.log("⏱️ iOS WebKit bridge timeout");
          resolve(bluetoothInfo);
        }, 3000);
      });
      
    } catch (error) {
      console.log("⚠️ iOS WebKit Bridge failed:", error.message);
    }
  }
  
  // ===================================
  // METHOD 5: Custom Native Bridge
  // ===================================
  if (typeof window.getBluetoothDevices === 'function') {
    console.log("🔌 Trying Custom Native Bridge...");
    
    try {
      const devices = await window.getBluetoothDevices();
      
      if (devices) {
        bluetoothInfo.pairedDevices = devices.paired || [];
        bluetoothInfo.connectedDevices = devices.connected || [];
        bluetoothInfo.enabled = devices.enabled || false;
        bluetoothInfo.available = true;
        bluetoothInfo.method = 'custom-native-bridge';
        bluetoothInfo.permissionStatus = 'granted';
        bluetoothInfo.permissionGranted = true;
        
        console.log("✅ Retrieved Bluetooth devices from custom bridge");
        return bluetoothInfo;
      }
      
    } catch (error) {
      console.log("⚠️ Custom Native Bridge failed:", error.message);
    }
  }
  
  // ===================================
  // NO METHOD SUCCEEDED
  // ===================================
  console.log("❌ No Bluetooth retrieval method succeeded");
  
  if (!apiAvailability.supported) {
    bluetoothInfo.error = 'Bluetooth API not supported in this browser';
  } else if (!environment.isSecureContext) {
    bluetoothInfo.error = 'Bluetooth requires HTTPS (secure context)';
  } else {
    bluetoothInfo.error = 'Bluetooth permission denied or not available';
  }
  
  return bluetoothInfo;
}

// ==========================================
// CATEGORIZE BLUETOOTH DEVICES
// ==========================================

categorizeBluetoothDevices(devices) {
  console.log("📋 Categorizing Bluetooth devices...");
  
  const categories = {
    audio: [],        // Headphones, earbuds, speakers
    wearables: [],    // Smartwatches, fitness trackers
    automotive: [],   // Car audio, hands-free
    input: [],        // Keyboards, mice, controllers
    health: [],       // Heart rate monitors, medical devices
    iot: [],          // Smart home devices
    computers: [],    // Laptops, tablets, phones
    unknown: []       // Unidentified devices
  };
  
  devices.forEach(device => {
    const name = (device.name || '').toLowerCase();
    const type = (device.type || '').toLowerCase();
    
    // Audio devices
    if (name.includes('airpod') || name.includes('headphone') || name.includes('earbud') || 
        name.includes('speaker') || name.includes('audio') || name.includes('beats') ||
        name.includes('bose') || name.includes('sony') || name.includes('jbl')) {
      categories.audio.push(device.name);
    }
    // Wearables
    else if (name.includes('watch') || name.includes('band') || name.includes('fit') ||
             name.includes('galaxy watch') || name.includes('apple watch')) {
      categories.wearables.push(device.name);
    }
    // Automotive
    else if (name.includes('car') || name.includes('vehicle') || name.includes('auto') ||
             name.includes('hands-free') || type.includes('car')) {
      categories.automotive.push(device.name);
    }
    // Input devices
    else if (name.includes('keyboard') || name.includes('mouse') || name.includes('controller') ||
             name.includes('gamepad') || name.includes('remote')) {
      categories.input.push(device.name);
    }
    // Health devices
    else if (name.includes('heart') || name.includes('blood') || name.includes('health') ||
             name.includes('medical') || name.includes('glucose')) {
      categories.health.push(device.name);
    }
    // IoT
    else if (name.includes('smart') || name.includes('home') || name.includes('alexa') ||
             name.includes('google home') || name.includes('nest')) {
      categories.iot.push(device.name);
    }
    // Computers
    else if (name.includes('laptop') || name.includes('pc') || name.includes('tablet') ||
             name.includes('ipad') || name.includes('macbook')) {
      categories.computers.push(device.name);
    }
    // Unknown
    else {
      categories.unknown.push(device.name);
    }
  });
  
  // Count per category
  const categoryCounts = {
    audio: categories.audio.length,
    wearables: categories.wearables.length,
    automotive: categories.automotive.length,
    input: categories.input.length,
    health: categories.health.length,
    iot: categories.iot.length,
    computers: categories.computers.length,
    unknown: categories.unknown.length
  };
  
  console.log("📊 Device categories:", categoryCounts);
  
  return {
    categories,
    counts: categoryCounts
  };
}

// ==========================================
// FRAUD DETECTION ANALYSIS
// ==========================================

analyzeBluetoothFraud(bluetoothInfo, environment) {
  console.log("🔍 Analyzing Bluetooth fraud patterns...");
  
  const flags = {};
  const reasons = [];
  let riskScore = 0;
  
  const deviceCount = bluetoothInfo.pairedDevices.length;
  const categories = this.categorizeBluetoothDevices(bluetoothInfo.pairedDevices);
  
  // 1. No Bluetooth devices on mobile (suspicious for bot/emulator)
  if (environment.isMobile && deviceCount === 0 && bluetoothInfo.available) {
    flags.mobileWithNoBluetoothDevices = true;
    reasons.push("Mobile device with 0 Bluetooth devices - possible emulator or new bot");
    riskScore += 25;
  } else {
    flags.mobileWithNoBluetoothDevices = false;
  }
  
  // 2. Bluetooth not available on mobile (emulator indicator)
  if (environment.isMobile && !bluetoothInfo.available) {
    flags.bluetoothNotAvailable = true;
    reasons.push("Bluetooth not available on mobile - likely emulator");
    riskScore += 35;
  } else {
    flags.bluetoothNotAvailable = false;
  }
  
  // 3. Desktop with Bluetooth (normal, but track)
  if (!environment.isMobile && deviceCount > 0) {
    flags.desktopWithBluetooth = false;
    // This is normal, no risk
  }
  
  // 4. Too many devices (suspicious)
  if (deviceCount > 20) {
    flags.tooManyDevices = true;
    reasons.push(`Unusually high number of Bluetooth devices (${deviceCount}) - suspicious`);
    riskScore += 20;
  } else {
    flags.tooManyDevices = false;
  }
  
  // 5. No audio devices (unusual for real user)
  if (deviceCount > 0 && categories.counts.audio === 0 && environment.isMobile) {
    flags.noAudioDevices = true;
    reasons.push("Mobile user with Bluetooth but no audio devices - unusual pattern");
    riskScore += 10;
  } else {
    flags.noAudioDevices = false;
  }
  
  // 6. Suspicious device names (test/debug/emulator)
  const suspiciousNames = ['test', 'debug', 'emulator', 'simulator', 'fake', 'bot'];
  const hasSuspiciousDevice = bluetoothInfo.pairedDevices.some(device => {
    const name = (device.name || '').toLowerCase();
    return suspiciousNames.some(keyword => name.includes(keyword));
  });
  
  if (hasSuspiciousDevice) {
    flags.suspiciousDeviceNames = true;
    reasons.push("Bluetooth device with suspicious name detected (test/debug/emulator)");
    riskScore += 40;
  } else {
    flags.suspiciousDeviceNames = false;
  }
  
  // 7. Permission denied (privacy concern or bot)
  if (bluetoothInfo.permissionStatus === 'denied' && environment.isMobile) {
    flags.permissionDenied = true;
    reasons.push("Bluetooth permission denied - privacy mode or bot avoiding detection");
    riskScore += 15;
  } else {
    flags.permissionDenied = false;
  }
  
  // 8. Bluetooth disabled on mobile (unusual)
  if (environment.isMobile && bluetoothInfo.enabled === false) {
    flags.bluetoothDisabled = true;
    reasons.push("Bluetooth disabled on mobile - unusual for modern smartphone users");
    riskScore += 10;
  } else {
    flags.bluetoothDisabled = false;
  }
  
  // Calculate authenticity score
  const authenticityScore = this.calculateBluetoothAuthenticityScore(
    bluetoothInfo,
    categories,
    environment
  );
  
  // Calculate behavioral consistency
  const behavioralConsistency = this.calculateBehavioralConsistency(
    bluetoothInfo,
    categories,
    environment
  );
  
  // Adjust risk for legitimate cases
  if (!bluetoothInfo.available && environment.type === 'web-browser') {
    // Web browser limitation - expected
    riskScore = Math.max(0, riskScore - 20);
    reasons.push("Bluetooth API limitation in web browser (not suspicious)");
  }
  
  // Risk level
  let riskLevel = 'LOW';
  if (riskScore >= 50) {
    riskLevel = 'HIGH';
  } else if (riskScore >= 20) {
    riskLevel = 'MEDIUM';
  }
  
  console.log(`🎯 Bluetooth Fraud Analysis - Risk: ${riskLevel} (Score: ${riskScore}/100)`);
  
  return {
    flags,
    riskScore,
    riskLevel,
    riskReasons: reasons,
    authenticityScore,
    behavioralConsistency
  };
}

// Calculate authenticity score based on Bluetooth profile
calculateBluetoothAuthenticityScore(bluetoothInfo, categories, environment) {
  let score = 50; // Start neutral
  
  const deviceCount = bluetoothInfo.pairedDevices.length;
  
  // Positive indicators
  if (deviceCount >= 1 && deviceCount <= 10) score += 20; // Normal range
  if (categories.counts.audio > 0) score += 15; // Has audio devices
  if (categories.counts.wearables > 0) score += 10; // Has wearables
  if (categories.counts.automotive > 0) score += 5; // Has car connection
  
  // Negative indicators
  if (deviceCount === 0 && environment.isMobile) score -= 30; // No devices on mobile
  if (!bluetoothInfo.available && environment.isMobile) score -= 40; // No Bluetooth on mobile
  if (deviceCount > 20) score -= 20; // Too many devices
  
  return Math.max(0, Math.min(100, score));
}

// Calculate behavioral consistency
calculateBehavioralConsistency(bluetoothInfo, categories, environment) {
  // Check if Bluetooth profile matches platform
  if (environment.isMobile) {
    // Mobile should have some Bluetooth devices typically
    if (bluetoothInfo.pairedDevices.length > 0) {
      return 'consistent';
    } else if (!bluetoothInfo.available) {
      return 'suspicious'; // Mobile without Bluetooth = emulator
    } else {
      return 'unusual'; // Mobile with Bluetooth but no devices
    }
  } else {
    // Desktop can have any number
    return 'normal';
  }
}

// ==========================================
// EMIT BLUETOOTH DATA
// ==========================================

emitBluetoothDevices() {
  console.log("📤 emitBluetoothDevices() called");
  
  if (!this.bluetoothData) {
    console.log("❌ Bluetooth data not initialized");
    return;
  }
  
  console.log("📊 Emitting Bluetooth data:", this.bluetoothData);
  
  this.emit({
    type: "BLUETOOTH_DEVICES",
    payload: this.bluetoothData,
    timestamp: Date.now(),
    userId: this.userId
  });
  
  console.log("✅ Bluetooth data emitted successfully!");
}

  
// -------- CPU CORES (DEVICE PROCESSING POWER) --------
initCPUCores() {
  console.log("initCPUCores() called - Detecting device processing power...");

  // STEP 1: Create storage for CPU data
  this.cpuData = {
    cores: null,
    coresAvailable: false,
    deviceClass: "UNKNOWN",
    suspicionLevel: "UNKNOWN",
    detectionMethod: null
  };

  // STEP 2: Try to get CPU cores using navigator.hardwareConcurrency
  if (navigator.hardwareConcurrency) {
    const cores = navigator.hardwareConcurrency;
    this.cpuData.cores = cores;
    this.cpuData.coresAvailable = true;
    this.cpuData.detectionMethod = "navigator.hardwareConcurrency";

    console.log(`CPU Cores detected: ${cores} logical processors`);

    // STEP 3: Classify device based on core count
    this.cpuData.deviceClass = this.classifyDeviceBycores(cores);
    this.cpuData.suspicionLevel = this.calculateCoreSuspicion(cores);

    console.log(`Device Class: ${this.cpuData.deviceClass}`);
    console.log(`Suspicion Level: ${this.cpuData.suspicionLevel}`);

  } else {
    // STEP 4: API not supported
    console.warn("navigator.hardwareConcurrency not supported on this browser");
    this.cpuData.coresAvailable = false;
    this.cpuData.detectionMethod = "not_supported";
  }
}

// Classify device based on CPU core count
classifyDeviceBycores(cores) {
  if (cores <= 2) {
    return "LOW_END";      // Budget phone, old device, or VM
  } else if (cores <= 4) {
    return "MID_RANGE";    // Standard smartphone
  } else if (cores <= 8) {
    return "HIGH_END";     // Flagship phone or modern laptop
  } else if (cores <= 16) {
    return "WORKSTATION";  // Desktop or high-end laptop
  } else {
    return "SERVER";       // Likely server, emulator, or bot infrastructure
  }
}

// Calculate fraud suspicion based on cores
calculateCoreSuspicion(cores) {
  // LOGIC:
  // - Very low cores (1-2): Possible bot farm VM
  // - Normal cores (3-8): Legitimate mobile/desktop
  // - Very high cores (12+): Possible emulator or server-based bot

  if (cores === 1 || cores === 2) {
    return "MEDIUM";  // Low-end device or VM (bot farm)
  } else if (cores >= 3 && cores <= 8) {
    return "LOW";     // Normal device range
  } else if (cores >= 12 && cores <= 16) {
    return "MEDIUM";  // Desktop/laptop (not mobile)
  } else if (cores > 16) {
    return "HIGH";    // Server or emulator (strong bot indicator)
  } else {
    return "LOW";
  }
}

// Method to emit CPU data (called on form submit)
emitCPUCoresData() {
  console.log("emitCPUCoresData() called");
  console.log("Current cpuData:", this.cpuData);

  if (!this.cpuData) {
    console.warn("cpuData does not exist! Initializing empty data...");
    this.cpuData = {
      cores: null,
      coresAvailable: false,
      deviceClass: "UNKNOWN",
      suspicionLevel: "UNKNOWN",
      detectionMethod: "not_initialized"
    };
  }

  this.emit({
    type: "CPU_CORES",
    payload: this.cpuData,
    timestamp: Date.now(),
    userId: this.userId
  });

  console.log("CPU Cores data emitted!");
}


  // -------- EMIT --------
  emit(event) {
    console.log("SDK EVENT:", event);

    // Store event in array
    this.allEvents.push(event);
    this.eventCounter++;

    // Update UI display
    this.updateUIDisplay();
  }

  // Update the UI
  updateUIDisplay() {
    const outputElement = document.getElementById("sdk-output");
    const counterElement = document.getElementById("event-counter");

    if (!outputElement) return;

    // Update counter
    if (counterElement) {
      counterElement.textContent = this.eventCounter;
    }

    // Clear previous content
    outputElement.innerHTML = "";

    // If no events, show empty state
    if (this.allEvents.length === 0) {
      outputElement.innerHTML =
        '<div class="empty-state"><p>No events yet. Start filling the form!</p></div>';
      return;
    }

    // Display each event
    this.allEvents.forEach((event, index) => {
      const eventDiv = document.createElement("div");
      eventDiv.className = "event-item";
      eventDiv.innerHTML =
        '<div class="event-type">Event #' +
        (index + 1) +
        " - " +
        event.type +
        "</div><pre>" +
        JSON.stringify(event, null, 2) +
        "</pre>";
      outputElement.appendChild(eventDiv);
    });

    // Scroll to bottom to show latest event
    outputElement.scrollTop = outputElement.scrollHeight;
  }

  // Method to copy all JSON to clipboard
  copyAllEventsToClipboard() {
    if (this.allEvents.length === 0) {
      alert("No events to copy yet!");
      return;
    }

    // Convert all events to formatted JSON string
    const jsonString = JSON.stringify(this.allEvents, null, 2);

    // Copy to clipboard
    navigator.clipboard
      .writeText(jsonString)
      .then(() => {
        // Success feedback
        const btn = document.getElementById("copy-json-btn");
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.style.background = "#e5e5e5";

        // Reset button after 2 seconds
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = "#f5f5f5";
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        alert("Failed to copy. Please try again.");
      });
  }

  // Initialize copy button listener
  initCopyButton() {
    const copyBtn = document.getElementById("copy-json-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => this.copyAllEventsToClipboard());
    }
  }
}
