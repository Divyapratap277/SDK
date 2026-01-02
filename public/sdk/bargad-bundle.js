// public/sdk/bargad-bundle.js
export class Bargad {
  constructor(apiKey, userId) {
    this.apiKey = apiKey;
    this.userId = userId;

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
    permissionsAPI: 'permissions' in navigator ? 'supported' : 'unsupported'
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
