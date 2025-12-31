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

    this.allEvents = [];  // Array to store all emitted events
    this.eventCounter = 0;  // Counter for total events
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

    
  if (this.trackSwipeEvents) {
    this.emitSwipeData();
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

      submitBtn.addEventListener("click", () => {
        if (!startTime) return;

        const timeSpentMs = Date.now() - startTime;

        this.emit({
          type: "FORM_TIME",
          payload: {
            formId,
            timeSpentMs
          },
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

        //  Emit screen orientation data
        if (this.trackScreenOrientation) {
          this.emitScreenOrientationData();
        }
    
        if (this.trackDisplaySettings) {
          this.emitDisplaySettingsData();
        }

        if (this.trackPinchGestures) {
        this.emitPinchData();
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

      if (/^[a-zA-Z]$/.test(key)) {
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
      const otpInput = document.getElementById('otp'); // Get the OTP input field

      if (!otpBtn) {
        console.warn("OTPAttempts: Invalid button ID", btnId);
        return;
      }

      // STEP 1: Track verification attempts (button clicks)
      let verificationAttemptCount = 0;

      // STEP 2: Track field edits (input changes)
      let fieldEditCount = 0;
      let lastOtpValue = '';
      let fieldFocusCount = 0;

      // Track when user focuses on OTP field
      if (otpInput) {
        otpInput.addEventListener('focus', () => {
          fieldFocusCount++;
          console.log(`OTP field focused (${fieldFocusCount} times)`);
        });

        // Track when user types/changes OTP value
        otpInput.addEventListener('input', (e) => {
          const currentValue = e.target.value;
          
          // Only count as edit if value actually changed
          if (currentValue !== lastOtpValue) {
            fieldEditCount++;
            lastOtpValue = currentValue;
            console.log(`OTP field edited (${fieldEditCount} times) - Current: "${currentValue}"`);
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
            fieldEditCount: fieldEditCount,           // How many times OTP was typed/changed
            fieldFocusCount: fieldFocusCount,         // How many times field was focused
            currentOtpValue: otpInput ? otpInput.value : null,  // Current OTP value
            otpLength: otpLength,    // OTP length
            
            // ✅ IMPROVED: Use smart hesitation calculation
            hesitationIndicator: this.calculateHesitation(fieldEditCount, verificationAttemptCount, otpLength),
            
            // Timestamp
            attemptTimestamp: Date.now()
          },
          timestamp: Date.now(),
          userId: this.userId
        });

        console.log(`OTP Verification Attempt #${verificationAttemptCount} | Field Edits: ${fieldEditCount} | Hesitation: ${this.calculateHesitation(fieldEditCount, verificationAttemptCount, otpLength)}`);
      });
    });
  }

  // ✅ Helper method to calculate hesitation level (moved outside initOTPAttempts)
  calculateHesitation(fieldEditCount, verificationAttempts, otpLength) {
    // LOGIC:
    // Normal user: Types OTP length + maybe 1-2 corrections = Low hesitation
    // Suspicious user: Many edits, erasing, retyping = High hesitation
    
    // Expected edits for normal user (OTP length + small corrections)
    const expectedEdits = otpLength + 2; // OTP length + 2 correction keystrokes
    
    // Calculate how many extra edits beyond expected
    const extraEdits = fieldEditCount - expectedEdits;
    
    // Decision logic
    if (extraEdits <= 2) {
      return "LOW";        // Normal: typed OTP cleanly
    } else if (extraEdits <= 6) {
      return "MEDIUM";     // Slight hesitation: some corrections
    } else {
      return "HIGH";       // High hesitation: lots of changes/guessing
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

    // Optionally emit immediately for each long press
    console.log(`Long press detected at (${x}, ${y})`);
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

    // DESKTOP TRACKING (Mouse Events)
    // When user presses mouse button down
    const handleMouseDown = (e) => {
      pressStartTime = Date.now();  
      startX = e.clientX;           
      startY = e.clientY;           
    };

    // When user releases mouse button
    const handleMouseUp = (e) => {
      // Calculate how long the press lasted
      const pressDuration = Date.now() - pressStartTime;

      if (pressDuration < TAP_MAX_DURATION) {
        const moveThreshold = 10; // Allow 10 pixels of movement
        const deltaX = Math.abs(e.clientX - startX);
        const deltaY = Math.abs(e.clientY - startY);

        // If mouse didn't move much, it's a TAP!
        if (deltaX < moveThreshold && deltaY < moveThreshold) {
          this.recordTap(e.clientX, e.clientY);
        }
      }

      // Reset for next press
      pressStartTime = null;
    };

    // MOBILE TRACKING (Touch Events)
    // When user touches screen
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        pressStartTime = Date.now();
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    // When user lifts finger from screen
    const handleTouchEnd = (e) => {
      if (!pressStartTime) return;

      const pressDuration = Date.now() - pressStartTime;

      // Only count as tap if quick
      if (pressDuration < TAP_MAX_DURATION) {
        // Use changedTouches to get the finger that was lifted
        if (e.changedTouches.length > 0) {
          const endX = e.changedTouches[0].clientX;
          const endY = e.changedTouches[0].clientY;

          const moveThreshold = 10;
          const deltaX = Math.abs(endX - startX);
          const deltaY = Math.abs(endY - startY);

          // If finger didn't move much, it's a TAP!
          if (deltaX < moveThreshold && deltaY < moveThreshold) {
            this.recordTap(endX, endY);
          }
        }
      }

      pressStartTime = null;
    };

    // ATTACH EVENT LISTENERS
    // Listen to mouse events (desktop)
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Listen to touch events (mobile)
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
  }

  // Helper method to record a tap
  recordTap(x, y) {
    // Increment total tap count
    this.tapData.totalTaps++;

    // Save the coordinates where tap happened
    this.tapData.tapCoordinates.push({ x, y });

    console.log(`Tap #${this.tapData.totalTaps} at (${x}, ${y})`);
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
  console.log('✅ initSwipeEvents() called - Swipe tracking starting...');
  // STEP 1: Create storage for swipe data
  this.swipeData = {
    totalSwipes: 0,           // Total number of swipes
    swipeLeft: 0,             // Swipes to the left ←
    swipeRight: 0,            // Swipes to the right →
    swipeUp: 0,               // Swipes upward ↑
    swipeDown: 0,             // Swipes downward ↓
    swipeDetails: []          // Array of each swipe with details
  };

  console.log('✅ swipeData initialized:', this.swipeData)

  // STEP 2: Variables to track swipe
  let swipeStartX = 0;        // Where did swipe start (X coordinate)?
  let swipeStartY = 0;        // Where did swipe start (Y coordinate)?
  let swipeStartTime = 0;     // When did swipe start (timestamp)?
  let isSwiping = false;      // Is user currently swiping?

  // STEP 3: Swipe detection thresholds
  const SWIPE_MIN_DISTANCE = 50;      // Minimum pixels to travel for swipe
  const SWIPE_MAX_TIME = 1000;        // Maximum time (ms) for swipe to be valid
  const SWIPE_VELOCITY_THRESHOLD = 0.3; // Minimum speed (pixels per ms)

  // ==========================================
  // DESKTOP TRACKING (Mouse Events)
  // ==========================================

  // When user presses mouse button down
  const handleMouseDown = (e) => {
    swipeStartX = e.clientX;      // Record starting X position
    swipeStartY = e.clientY;      // Record starting Y position
    swipeStartTime = Date.now();  // Record when swipe started
    isSwiping = true;             // User might be starting a swipe
  };

  // When user moves mouse while holding button down
  const handleMouseMove = (e) => {
    // Only track if user is actively swiping (mouse button down)
    if (!isSwiping) return;
    // Just tracking, analysis happens on mouseup
  };

  // When user releases mouse button
  const handleMouseUp = (e) => {
    if (!isSwiping) return;  // Not tracking a swipe

    // STEP 4: Calculate swipe metrics
    const swipeEndX = e.clientX;
    const swipeEndY = e.clientY;
    const swipeEndTime = Date.now();

    // Calculate distances
    const deltaX = swipeEndX - swipeStartX;  // Horizontal distance (negative = left, positive = right)
    const deltaY = swipeEndY - swipeStartY;  // Vertical distance (negative = up, positive = down)
    const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);  // Total distance (Pythagorean theorem)
    
    // Calculate time and velocity
    const swipeDuration = swipeEndTime - swipeStartTime;  // How long did swipe take?
    const swipeVelocity = totalDistance / swipeDuration;  // Speed (pixels per millisecond)

    // STEP 5: Check if this qualifies as a swipe
    const isValidSwipe = 
      totalDistance >= SWIPE_MIN_DISTANCE &&      // Moved far enough?
      swipeDuration <= SWIPE_MAX_TIME &&          // Fast enough?
      swipeVelocity >= SWIPE_VELOCITY_THRESHOLD;  // Good velocity?

    if (isValidSwipe) {
      // STEP 6: Determine swipe direction
      // Compare horizontal vs vertical movement to find primary direction
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

      let direction;
      if (isHorizontalSwipe) {
        // Horizontal swipe: left or right?
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        // Vertical swipe: up or down?
        direction = deltaY > 0 ? 'down' : 'up';
      }

      // STEP 7: Record the swipe
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

    // Reset tracking
    isSwiping = false;
  };

  // ==========================================
  // MOBILE TRACKING (Touch Events)
  // ==========================================

  // When user touches screen
  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
      swipeStartTime = Date.now();
      isSwiping = true;
    }
  };

  // When user moves finger on screen
  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    // Just tracking, analysis happens on touchend
  };

  // When user lifts finger from screen
  const handleTouchEnd = (e) => {
    if (!isSwiping) return;

    if (e.changedTouches.length > 0) {
      const swipeEndX = e.changedTouches[0].clientX;
      const swipeEndY = e.changedTouches[0].clientY;
      const swipeEndTime = Date.now();

      // Calculate distances
      const deltaX = swipeEndX - swipeStartX;
      const deltaY = swipeEndY - swipeStartY;
      const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Calculate time and velocity
      const swipeDuration = swipeEndTime - swipeStartTime;
      const swipeVelocity = totalDistance / swipeDuration;

      // Check if valid swipe
      const isValidSwipe = 
        totalDistance >= SWIPE_MIN_DISTANCE &&
        swipeDuration <= SWIPE_MAX_TIME &&
        swipeVelocity >= SWIPE_VELOCITY_THRESHOLD;

      if (isValidSwipe) {
        // Determine direction
        const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

        let direction;
        if (isHorizontalSwipe) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }

        // Record the swipe
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
    }

    isSwiping = false;
  };

  // ==========================================
  // ATTACH EVENT LISTENERS
  // ==========================================

  // Mouse events (desktop)
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  // Touch events (mobile)
  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchmove", handleTouchMove, { passive: true });
  document.addEventListener("touchend", handleTouchEnd);
}

// Helper method to record a swipe
recordSwipe(direction, details) {
  // Increment total swipe counter
  this.swipeData.totalSwipes++;

  // Increment specific direction counter
  switch (direction) {
    case 'left':
      this.swipeData.swipeLeft++;
      break;
    case 'right':
      this.swipeData.swipeRight++;
      break;
    case 'up':
      this.swipeData.swipeUp++;
      break;
    case 'down':
      this.swipeData.swipeDown++;
      break;
  }

  // Save detailed information about this swipe
  this.swipeData.swipeDetails.push({
    direction: direction,
    ...details,
    timestamp: Date.now()
  });

  // Log to console for immediate feedback
  console.log(`Swipe ${direction.toUpperCase()} detected! Distance: ${details.distance}px, Duration: ${details.duration}ms, Velocity: ${details.velocity}px/ms`);
}

// Method to emit swipe data (called on form submit)
emitSwipeData() {
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

    console.log(`Initial orientation: ${initialOrientation}`);

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
        console.log(`Orientation changed: ${oldOrientation} → ${newOrientation}`);
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

  // Method to emit orientation data (called on form submit)
  emitScreenOrientationData() {
    this.emit({
      type: "SCREEN_ORIENTATION",
      payload: { ...this.orientationData },
      timestamp: Date.now(),
      userId: this.userId
    });

    // Note: We DON'T reset orientation data after emit
    // Because we want to track orientation throughout the session
  }

  // -------- DISPLAY SETTINGS --------
  initDisplaySettings() {
    // STEP 1: Collect all display information
    this.displayData = {};

    // SCREEN DIMENSIONS
    // Total screen resolution (entire monitor/display)
    this.displayData.screenWidth = window.screen.width;     
    this.displayData.screenHeight = window.screen.height;      
    
    // Available screen space (minus taskbar, dock, etc.)
    this.displayData.availableWidth = window.screen.availWidth;  
    this.displayData.availableHeight = window.screen.availHeight; 

    // VIEWPORT/WINDOW DIMENSIONS
    // Current browser window size (inner dimensions)
    this.displayData.windowWidth = window.innerWidth;    
    this.displayData.windowHeight = window.innerHeight;  

    // Outer window size (includes browser chrome/UI)
    this.displayData.outerWidth = window.outerWidth;     
    this.displayData.outerHeight = window.outerHeight;   

    // COLOR & PIXEL INFORMATION
    // Color depth: bits per pixel (typically 24 or 32)
    // 24-bit = 16.7 million colors, 32-bit = 24-bit + alpha channel
    this.displayData.colorDepth = window.screen.colorDepth;    // e.g., 24
    
    // Pixel depth (usually same as colorDepth)
    this.displayData.pixelDepth = window.screen.pixelDepth;    // e.g., 24

    // Device pixel ratio: physical pixels vs CSS pixels
    // 1 = standard display, 2 = Retina display, 3 = high-end mobile
    this.displayData.devicePixelRatio = window.devicePixelRatio || 1;

    // CALCULATED METRICS
    // Total pixels on screen
    this.displayData.totalPixels = 
      this.displayData.screenWidth * this.displayData.screenHeight;
    
    // Screen aspect ratio (e.g., 16:9, 16:10, 21:9)
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);  // Greatest common divisor
    const divisor = gcd(this.displayData.screenWidth, this.displayData.screenHeight);
    const aspectWidth = this.displayData.screenWidth / divisor;
    const aspectHeight = this.displayData.screenHeight / divisor;
    this.displayData.aspectRatio = `${aspectWidth}:${aspectHeight}`;

    // Is browser fullscreen?
    this.displayData.isFullscreen = 
      window.innerWidth === window.screen.width && 
      window.innerHeight === window.screen.height;

    // SCREEN ORIENTATION (from screen object)
    if (window.screen.orientation) {
      this.displayData.orientationType = window.screen.orientation.type;  // e.g., "landscape-primary"
      this.displayData.orientationAngle = window.screen.orientation.angle; // e.g., 0, 90, 180, 270
    } else {
      // Fallback for older browsers
      this.displayData.orientationType = "unknown";
      this.displayData.orientationAngle = window.orientation || 0;
    }

    // DISPLAY MODE
    // Detect if running as PWA (Progressive Web App)
    this.displayData.displayMode = "browser";
    
    if (window.matchMedia) {
      if (window.matchMedia('(display-mode: fullscreen)').matches) {
        this.displayData.displayMode = "fullscreen";
      } else if (window.matchMedia('(display-mode: standalone)').matches) {
        this.displayData.displayMode = "standalone"; // PWA
      } else if (window.matchMedia('(display-mode: minimal-ui)').matches) {
        this.displayData.displayMode = "minimal-ui";
      }
    }

    // TOUCH CAPABILITY
    // Can this device handle touch input?
    this.displayData.touchSupport = {
      hasTouchScreen: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      maxTouchPoints: navigator.maxTouchPoints || 0  // How many fingers can touch at once
    };

    // ADDITIONAL METRICS
    // Calculate physical screen size in inches (approximate)
    // This is an estimate based on pixel density
    const diagonalPixels = Math.sqrt(
      Math.pow(this.displayData.screenWidth, 2) + 
      Math.pow(this.displayData.screenHeight, 2)
    );
    
    // Assume 96 DPI as baseline (can be inaccurate)
    const dpi = 96 * this.displayData.devicePixelRatio;
    this.displayData.estimatedScreenSizeInches = (diagonalPixels / dpi).toFixed(2);

    // Device category based on screen width
    if (this.displayData.screenWidth < 768) {
      this.displayData.deviceCategory = "mobile";
    } else if (this.displayData.screenWidth < 1024) {
      this.displayData.deviceCategory = "tablet";
    } else {
      this.displayData.deviceCategory = "desktop";
    }

    // LOG COLLECTED DATA
    console.log("Display Settings Captured:", this.displayData);
  }

  // Method to emit display settings data (called on form submit)
  emitDisplaySettingsData() {
    this.emit({
      type: "DISPLAY_SETTINGS",
      payload: { ...this.displayData },
      timestamp: Date.now(),
      userId: this.userId
    });

    // Note: We DON'T reset display data
    // Display settings don't change during a session (unless window resized)
  }

  // -------- PINCH GESTURES (ZOOM) --------
initPinchGestures() {
  console.log('✅ initPinchGestures() called - Pinch tracking starting...');

  // STEP 1: Create storage for pinch data
  this.pinchData = {
    totalPinches: 0,          // Total number of pinch gestures
    pinchInCount: 0,          // Pinch in (zoom out) count
    pinchOutCount: 0,         // Pinch out (zoom in) count
    pinchDetails: []          // Array of each pinch with details
  };

  console.log('✅ pinchData initialized:', this.pinchData);

  // STEP 2: Variables to track pinch
  let initialDistance = 0;    // Distance between fingers at start
  let isPinching = false;     // Is user currently pinching?
  let pinchStartTime = 0;     // When did pinch start?

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

  // ==========================================
  // TOUCH EVENT HANDLERS
  // ==========================================

  // When user touches screen with fingers
  const handleTouchStart = (e) => {
    // Only track if exactly 2 fingers are touching
    if (e.touches.length === 2) {
      // Prevent default zoom behavior (optional)
      e.preventDefault();

      // Calculate initial distance between two fingers
      initialDistance = getDistance(e.touches[0], e.touches[1]);
      isPinching = true;
      pinchStartTime = Date.now();

      console.log(`Pinch started - Initial distance: ${initialDistance.toFixed(2)}px`);
    }
  };

  // When user moves fingers on screen
  const handleTouchMove = (e) => {
    // Only track if we're in a pinch gesture (2 fingers)
    if (isPinching && e.touches.length === 2) {
      // Prevent default zoom behavior
      e.preventDefault();

      // Calculate current distance between fingers
      const currentDistance = getDistance(e.touches[0], e.touches[1]);

      // Calculate scale factor (how much zoom changed)
      const scale = currentDistance / initialDistance;

      // Optional: Log continuous pinch movement (can be removed for performance)
      // console.log(`Pinching... Scale: ${scale.toFixed(2)}x`);
    }
  };

  // When user lifts fingers from screen
  const handleTouchEnd = (e) => {
    if (!isPinching) return;

    // Check if pinch gesture ended (less than 2 fingers now)
    if (e.touches.length < 2) {
      // Use changedTouches to get the final positions before fingers lifted
      if (e.changedTouches.length > 0) {
        // Reconstruct the two touch points
        // (One finger is still down in e.touches, one is in e.changedTouches)
        let finalDistance;

        if (e.touches.length === 1) {
          // One finger still down, one just lifted
          finalDistance = getDistance(e.touches[0], e.changedTouches[0]);
        } else {
          // Both fingers lifted - use last known distance
          finalDistance = initialDistance; // Fallback
        }

        // Calculate final scale
        const scale = finalDistance / initialDistance;
        const pinchDuration = Date.now() - pinchStartTime;

        // STEP 5: Determine pinch type
        const PINCH_THRESHOLD = 0.1; // 10% change minimum to count as pinch

        if (Math.abs(scale - 1.0) > PINCH_THRESHOLD) {
          let pinchType;
          if (scale > 1.0) {
            pinchType = 'pinch_out'; // Zoom in (fingers moved apart)
          } else {
            pinchType = 'pinch_in';  // Zoom out (fingers moved together)
          }

          // Get center point of pinch
          const centerPoint = e.touches.length === 1 
            ? getCenterPoint(e.touches[0], e.changedTouches[0])
            : { x: 0, y: 0 }; // Fallback if both fingers lifted

          // STEP 6: Record the pinch
          this.recordPinch(pinchType, {
            scale: scale.toFixed(2),
            initialDistance: initialDistance.toFixed(2),
            finalDistance: finalDistance.toFixed(2),
            duration: pinchDuration,
            centerX: Math.round(centerPoint.x),
            centerY: Math.round(centerPoint.y)
          });
        }
      }

      // Reset tracking
      isPinching = false;
      initialDistance = 0;
    }
  };

  // ==========================================
  // ATTACH EVENT LISTENERS
  // ==========================================

  // Touch events (mobile only - pinch doesn't work with mouse)
  document.addEventListener("touchstart", handleTouchStart, { passive: false });
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
  document.addEventListener("touchend", handleTouchEnd);

  console.log('✅ Pinch gesture listeners attached');
}

// Helper method to record a pinch gesture
recordPinch(pinchType, details) {
  // Increment total pinch counter
  this.pinchData.totalPinches++;

  // Increment specific type counter
  if (pinchType === 'pinch_in') {
    this.pinchData.pinchInCount++;
  } else if (pinchType === 'pinch_out') {
    this.pinchData.pinchOutCount++;
  }

  // Save detailed information about this pinch
  this.pinchData.pinchDetails.push({
    type: pinchType,
    ...details,
    timestamp: Date.now()
  });

  // Log to console for immediate feedback
  const direction = pinchType === 'pinch_out' ? 'OUT (Zoom In)' : 'IN (Zoom Out)';
  console.log(`🤏 Pinch ${direction} detected! Scale: ${details.scale}x, Duration: ${details.duration}ms`);
}

// Method to emit pinch data (called on form submit)
emitPinchData() {
  // Safety check - initialize if not exists
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
    const outputElement = document.getElementById('sdk-output');
    const counterElement = document.getElementById('event-counter');

    if (!outputElement) return;  // Element doesn't exist yet

    // Update counter
    if (counterElement) {
      counterElement.textContent = this.eventCounter;
    }

    // Clear previous content
    outputElement.innerHTML = '';

    // If no events, show empty state
    if (this.allEvents.length === 0) {
      outputElement.innerHTML = `
        <div class="empty-state">
          <p>No events yet. Start filling the form!</p>
        </div>
      `;
      return;
    }

    // Display each event
    this.allEvents.forEach((event, index) => {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'event-item';

      eventDiv.innerHTML = `
        <div class="event-type">Event #${index + 1} - ${event.type}</div>
        <pre>${JSON.stringify(event, null, 2)}</pre>
      `;

      outputElement.appendChild(eventDiv);
    });

    // Scroll to bottom to show latest event
    outputElement.scrollTop = outputElement.scrollHeight;
  }

  // Method to copy all JSON to clipboard
  copyAllEventsToClipboard() {
    if (this.allEvents.length === 0) {
      alert('No events to copy yet!');
      return;
    }

    // Convert all events to formatted JSON string
    const jsonString = JSON.stringify(this.allEvents, null, 2);

    // Copy to clipboard
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        // Success feedback
        const btn = document.getElementById('copy-json-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied! ✓';
        btn.style.background = '#e5e5e5';
        
        // Reset button after 2 seconds
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '#f5f5f5';
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please try again.');
      });
  }

  // Initialize copy button listener
  initCopyButton() {
    const copyBtn = document.getElementById('copy-json-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.copyAllEventsToClipboard();
      });
    }
  }
}
