// public/sdk/bargad-bundle.js

export class Bargad {
  constructor(apiKey, userId) {
    this.apiKey = apiKey;
    this.userId = userId;

    // Feature flags (default OFF)
    this.trackFormTime = { enabled: false };
    this.trackKeypressEvents = false;
    this.customClipboardEvents = false;

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
  let copyCount = 0;
  let pasteCount = 0;
  let cutCount = 0;

  document.addEventListener("copy", () => {
    copyCount++;
  });

  document.addEventListener("paste", () => {
    pasteCount++;
  });

  document.addEventListener("cut", () => {
    cutCount++;
  });

  // Emit clipboard data on form submit
  document.addEventListener("submit", (event) => {
    event.preventDefault(); // keep page from reloading

    this.emit({
      type: "CLIPBOARD",
      payload: {
        copyCount,
        pasteCount,
        cutCount
      },
      timestamp: Date.now(),
      userId: this.userId
    });
  });
}


  // -------- EMIT --------
  emit(event) {
    console.log("SDK EVENT:", event);
  }
}
