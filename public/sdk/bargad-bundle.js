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

    if (this.trackGyroscope) {  // ✅ ADD THIS
    this.initGyroscope();
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
          userId: this.userId
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
      alphabeticKeypressCount: 0
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
      userId: this.userId
    });

    // Reset counters
    this.keypressData = {
      totalKeypresses: 0,
      backspaceCount: 0,
      deleteCount: 0,
      numericKeypressCount: 0,
      specialCharCount: 0,
      alphabeticKeypressCount: 0
    };
  }

  // -------- CLIPBOARD EVENTS --------
  initClipboardEvents() {
    this.clipboardData = {
      copyCount: 0,
      pasteCount: 0,
      cutCount: 0
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
      userId: this.userId
    });

    // Reset counters
    this.clipboardData = {
      copyCount: 0,
      pasteCount: 0,
      cutCount: 0
    };
  }

  // -------- OTP ATTEMPTS (ENHANCED) --------
  initOTPAttempts() {
    const [otpButtonIds] = this.trackOTPAttempts.args;

    otpButtonIds.forEach((btnId) => {
      const otpBtn = document.getElementById(btnId);
      const otpInput = document.getElementById("otp");

      if (!otpBtn) {
        console.warn("OTPAttempts: Invalid button ID", btnId);
        return;
      }

      // STEP 1: Track verification attempts (button clicks)
      let verificationAttemptCount = 0;

      // STEP 2: Track field edits (input changes)
      let fieldEditCount = 0;
      let lastOtpValue = "";
      let fieldFocusCount = 0;

      // Track when user focuses on OTP field
      if (otpInput) {
        otpInput.addEventListener("focus", () => {
          fieldFocusCount++;
          console.log("OTP field focused " + fieldFocusCount + " times");
        });

        // Track when user types/changes OTP value
        otpInput.addEventListener("input", (e) => {
          const currentValue = e.target.value;

          // Only count as edit if value actually changed
          if (currentValue !== lastOtpValue) {
            fieldEditCount++;
            lastOtpValue = currentValue;
            console.log("OTP field edited " + fieldEditCount + " times - Current: " + currentValue);
          }
        });
      }

      // Track verification button clicks
      otpBtn.addEventListener("click", () => {
        verificationAttemptCount++;

        const otpLength = otpInput ? otpInput.value.length : 0;

        this.emit({
          type: "OTP_ATTEMPT",
          payload: {
            // Verification attempts (button clicks)
            verificationAttempts: verificationAttemptCount,
            verificationAttemptType: verificationAttemptCount === 1 ? "SINGLE" : "MULTIPLE",

            // Field interaction metrics
            fieldEditCount: fieldEditCount,
            fieldFocusCount: fieldFocusCount,
            currentOtpValue: otpInput ? otpInput.value : null,
            otpLength: otpLength,

            // IMPROVED: Use smart hesitation calculation
            hesitationIndicator: this.calculateHesitation(fieldEditCount, verificationAttemptCount, otpLength),

            // Timestamp
            attemptTimestamp: Date.now()
          },
          timestamp: Date.now(),
          userId: this.userId
        });

        console.log("OTP Verification Attempt #" + verificationAttemptCount + " | Field Edits: " + fieldEditCount + " | Hesitation: " + this.calculateHesitation(fieldEditCount, verificationAttemptCount, otpLength));
      });
    });
  }

  // Helper method to calculate hesitation level (moved outside initOTPAttempts)
  calculateHesitation(fieldEditCount, verificationAttempts, otpLength) {
    // LOGIC:
    // Normal user: Types OTP length + maybe 1-2 corrections = Low hesitation
    // Suspicious user: Many edits, erasing, retyping = High hesitation

    // Expected edits for normal user = OTP length + small corrections
    const expectedEdits = otpLength + 2; // OTP length + ~2 correction keystrokes

    // Calculate how many extra edits beyond expected
    const extraEdits = fieldEditCount - expectedEdits;

    // Decision logic
    if (extraEdits <= 2) {
      return "LOW"; // Normal - typed OTP cleanly
    } else if (extraEdits <= 6) {
      return "MEDIUM"; // Slight hesitation, some corrections
    } else {
      return "HIGH"; // High hesitation, lots of changes/guessing
    }
  }

  // -------- LONG PRESS EVENTS --------
  initLongPressEvents() {
    this.longPressData = {
      longPressCount: 0,
      longPressCoordinates: []
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
      userId: this.userId
    });

    // Reset counters
    this.longPressData = {
      longPressCount: 0,
      longPressCoordinates: []
    };
  }

  // -------- TAP EVENTS --------
  initTapEvents() {
    this.tapData = {
      totalTaps: 0,
      tapCoordinates: []
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
    console.log("Tap #" + this.tapData.totalTaps + " at (" + x + ", " + y + ")");
  }

  emitTapData() {
    this.emit({
      type: "TAP_EVENTS",
      payload: { ...this.tapData },
      timestamp: Date.now(),
      userId: this.userId
    });

    // Reset after sending
    this.tapData = {
      totalTaps: 0,
      tapCoordinates: []
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
      swipeDetails: []
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
          endY: swipeEndY
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
            endY: swipeEndY
          });
        }

        isSwiping = false;
      }
    };

    // ATTACH EVENT LISTENERS
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
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
      timestamp: Date.now()
    });

    console.log("Swipe " + direction.toUpperCase() + " detected! Distance: " + details.distance + "px, Duration: " + details.duration + "ms, Velocity: " + details.velocity + "px/ms");
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
        swipeDetails: []
      };
    }

    this.emit({
      type: "SWIPE_EVENTS",
      payload: { ...this.swipeData },
      timestamp: Date.now(),
      userId: this.userId
    });

    // Reset counters after emitting
    this.swipeData = {
      totalSwipes: 0,
      swipeLeft: 0,
      swipeRight: 0,
      swipeUp: 0,
      swipeDown: 0,
      swipeDetails: []
    };
  }

  // -------- SCREEN ORIENTATION --------
  initScreenOrientation() {
    // STEP 1: Create storage for orientation data
    this.orientationData = {
      currentOrientation: null,
      initialOrientation: null,
      orientationChanges: 0,
      orientationHistory: []
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
          timestamp: Date.now()
        });

        // Log the change
        console.log("Orientation changed: " + oldOrientation + " -> " + newOrientation);
      }
    };

    // STEP 5: Attach event listeners
    // Modern API: Listen to screen.orientation change
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener("change", handleOrientationChange);
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
      userId: this.userId
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
    this.displayData.totalPixels = this.displayData.screenWidth * this.displayData.screenHeight;

    // Screen aspect ratio
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(this.displayData.screenWidth, this.displayData.screenHeight);
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
      maxTouchPoints: navigator.maxTouchPoints || 0
    };

    // ADDITIONAL METRICS
    const diagonalPixels = Math.sqrt(
      Math.pow(this.displayData.screenWidth, 2) +
        Math.pow(this.displayData.screenHeight, 2)
    );
    const dpi = 96 * this.displayData.devicePixelRatio;
    this.displayData.estimatedScreenSizeInches = (diagonalPixels / dpi).toFixed(2);

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
      userId: this.userId
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
      pinchDetails: []
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
        y: (touch1.clientY + touch2.clientY) / 2
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
        console.log("Pinch started - Initial distance: " + initialDistance.toFixed(2) + "px");
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
              centerY: Math.round(centerPoint.y)
            });
          }

          isPinching = false;
          initialDistance = 0;
        }
      }
    };

    // ATTACH EVENT LISTENERS
    document.addEventListener("touchstart", handleTouchStart, { passive: false });
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
      timestamp: Date.now()
    });

    const direction = pinchType === "pinch-out" ? "OUT (Zoom In)" : "IN (Zoom Out)";
    console.log("Pinch " + direction + " detected! Scale: " + details.scale + "x, Duration: " + details.duration + "ms");
  }

  emitPinchData() {
    if (!this.pinchData) {
      this.pinchData = {
        totalPinches: 0,
        pinchInCount: 0,
        pinchOutCount: 0,
        pinchDetails: []
      };
    }

    this.emit({
      type: "PINCH_GESTURES",
      payload: { ...this.pinchData },
      timestamp: Date.now(),
      userId: this.userId
    });

    // Reset counters after emitting
    this.pinchData = {
      totalPinches: 0,
      pinchInCount: 0,
      pinchOutCount: 0,
      pinchDetails: []
    };
  }

  // -------- AMBIENT LIGHT SENSOR --------
  initAmbientLight() {
    console.log("initAmbientLight() called - Light sensor tracking starting...");

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
      lightCategory: null
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
          console.error("Light sensor error:", event.error.name, event.error.message);
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
    if (this.lightData.minLightLevel === null || lightLevel < this.lightData.minLightLevel) {
      this.lightData.minLightLevel = lightLevel;
    }
    if (this.lightData.maxLightLevel === null || lightLevel > this.lightData.maxLightLevel) {
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
      timestamp: Date.now()
    });

    // Keep only last 20 readings to avoid memory issues
    if (this.lightData.lightReadings.length > 20) {
      this.lightData.lightReadings.shift(); // Remove oldest
    }

    // STEP 6: Calculate average light level
    const sum = this.lightData.lightReadings.reduce((acc, reading) => acc + reading.lux, 0);
    this.lightData.averageLightLevel = sum / this.lightData.lightReadings.length;

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
        lightCategory: "NOT_INITIALIZED"
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
          : null
    };

    this.emit({
      type: "AMBIENT_LIGHT",
      payload: cleanedData,
      timestamp: Date.now(),
      userId: this.userId
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
      errorMessage: null
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
        maximumAge: 5000
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

          console.log("Location: " + this.locationData.latitude.toFixed(4) + ", " + this.locationData.longitude.toFixed(4));
          console.log("Accuracy: " + this.locationData.accuracy.toFixed(2) + " meters");

          resolve();
        },
        (error) => {
          console.error("Location error:", error.message);

          this.locationData.errorCode = error.code;
          this.locationData.errorMessage = error.message;

          switch(error.code) {
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
      navigator.permissions.query({ name: "geolocation" })
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
        permissionStatus: "not_initialized"
      };
    }

    const cleanedData = {
      ...this.locationData,
      latitude: this.locationData.latitude !== null 
        ? parseFloat(this.locationData.latitude.toFixed(6))
        : null,
      longitude: this.locationData.longitude !== null 
        ? parseFloat(this.locationData.longitude.toFixed(6))
        : null,
      accuracy: this.locationData.accuracy !== null 
        ? parseFloat(this.locationData.accuracy.toFixed(2))
        : null,
      altitude: this.locationData.altitude !== null 
        ? parseFloat(this.locationData.altitude.toFixed(2))
        : null,
      speed: this.locationData.speed !== null 
        ? parseFloat(this.locationData.speed.toFixed(2))
        : null
    };

    this.emit({
      type: "DEVICE_LOCATION",
      payload: cleanedData,
      timestamp: Date.now(),
      userId: this.userId
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
      gamma: null
    },
    initialRotationRate: {
      alpha: null,
      beta: null,
      gamma: null
    },
    maxRotationRate: {
      alpha: null,
      beta: null,
      gamma: null
    },
    rotationChanges: 0,
    rotationHistory: [],
    deviceMovementLevel: "still"
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
          gamma: gyroscope.y || 0
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
        gamma: event.rotationRate.gamma || 0
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
      gamma: rotationRate.gamma
    };
    console.log("Initial rotation rate recorded:", this.gyroscopeData.initialRotationRate);
  }

  // Update current rotation rate
  const previousRate = {
    alpha: this.gyroscopeData.currentRotationRate.alpha,
    beta: this.gyroscopeData.currentRotationRate.beta,
    gamma: this.gyroscopeData.currentRotationRate.gamma
  };

  this.gyroscopeData.currentRotationRate = {
    alpha: rotationRate.alpha,
    beta: rotationRate.beta,
    gamma: rotationRate.gamma
  };

  // Track max rotation rates
  if (this.gyroscopeData.maxRotationRate.alpha === null ||
      Math.abs(rotationRate.alpha) > Math.abs(this.gyroscopeData.maxRotationRate.alpha)) {
    this.gyroscopeData.maxRotationRate.alpha = rotationRate.alpha;
  }
  if (this.gyroscopeData.maxRotationRate.beta === null ||
      Math.abs(rotationRate.beta) > Math.abs(this.gyroscopeData.maxRotationRate.beta)) {
    this.gyroscopeData.maxRotationRate.beta = rotationRate.beta;
  }
  if (this.gyroscopeData.maxRotationRate.gamma === null ||
      Math.abs(rotationRate.gamma) > Math.abs(this.gyroscopeData.maxRotationRate.gamma)) {
    this.gyroscopeData.maxRotationRate.gamma = rotationRate.gamma;
  }

  // Count significant rotation changes
  const ROTATION_THRESHOLD = 10;
  if (previousRate.alpha !== null) {
    const deltaAlpha = Math.abs(rotationRate.alpha - previousRate.alpha);
    const deltaBeta = Math.abs(rotationRate.beta - previousRate.beta);
    const deltaGamma = Math.abs(rotationRate.gamma - previousRate.gamma);

    if (deltaAlpha > ROTATION_THRESHOLD || 
        deltaBeta > ROTATION_THRESHOLD || 
        deltaGamma > ROTATION_THRESHOLD) {
      this.gyroscopeData.rotationChanges++;

      this.gyroscopeData.rotationHistory.push({
        rotationRate: {
          alpha: rotationRate.alpha,
          beta: rotationRate.beta,
          gamma: rotationRate.gamma
        },
        timestamp: Date.now()
      });

      if (this.gyroscopeData.rotationHistory.length > 20) {
        this.gyroscopeData.rotationHistory.shift();
      }
    }
  }

  // Classify device movement level
  const totalRotation = Math.abs(rotationRate.alpha) + 
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
  console.log("Current gyroscopeData before emit:", JSON.stringify(this.gyroscopeData, null, 2));

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
      deviceMovementLevel: "still"
    };
  }

  // Round values for cleaner output
  const cleanedData = {
    supported: this.gyroscopeData.supported,
    permissionStatus: this.gyroscopeData.permissionStatus,
    currentRotationRate: {
      alpha: this.gyroscopeData.currentRotationRate.alpha !== null
        ? parseFloat(this.gyroscopeData.currentRotationRate.alpha.toFixed(2))
        : null,
      beta: this.gyroscopeData.currentRotationRate.beta !== null
        ? parseFloat(this.gyroscopeData.currentRotationRate.beta.toFixed(2))
        : null,
      gamma: this.gyroscopeData.currentRotationRate.gamma !== null
        ? parseFloat(this.gyroscopeData.currentRotationRate.gamma.toFixed(2))
        : null
    },
    initialRotationRate: {
      alpha: this.gyroscopeData.initialRotationRate.alpha !== null
        ? parseFloat(this.gyroscopeData.initialRotationRate.alpha.toFixed(2))
        : null,
      beta: this.gyroscopeData.initialRotationRate.beta !== null
        ? parseFloat(this.gyroscopeData.initialRotationRate.beta.toFixed(2))
        : null,
      gamma: this.gyroscopeData.initialRotationRate.gamma !== null
        ? parseFloat(this.gyroscopeData.initialRotationRate.gamma.toFixed(2))
        : null
    },
    maxRotationRate: {
      alpha: this.gyroscopeData.maxRotationRate.alpha !== null
        ? parseFloat(this.gyroscopeData.maxRotationRate.alpha.toFixed(2))
        : null,
      beta: this.gyroscopeData.maxRotationRate.beta !== null
        ? parseFloat(this.gyroscopeData.maxRotationRate.beta.toFixed(2))
        : null,
      gamma: this.gyroscopeData.maxRotationRate.gamma !== null
        ? parseFloat(this.gyroscopeData.maxRotationRate.gamma.toFixed(2))
        : null
    },
    rotationChanges: this.gyroscopeData.rotationChanges,
    deviceMovementLevel: this.gyroscopeData.deviceMovementLevel
  };

  console.log("Cleaned data to emit:", JSON.stringify(cleanedData, null, 2));

  this.emit({
    type: "GYROSCOPE",
    payload: cleanedData,
    timestamp: Date.now(),
    userId: this.userId
  });

  console.log("Gyroscope data emitted successfully!");
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
      outputElement.innerHTML = '<div class="empty-state"><p>No events yet. Start filling the form!</p></div>';
      return;
    }

    // Display each event
    this.allEvents.forEach((event, index) => {
      const eventDiv = document.createElement("div");
      eventDiv.className = "event-item";
      eventDiv.innerHTML = '<div class="event-type">Event #' + (index + 1) + ' - ' + event.type + '</div><pre>' + JSON.stringify(event, null, 2) + '</pre>';
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
    navigator.clipboard.writeText(jsonString)
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