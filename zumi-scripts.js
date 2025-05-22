console.log("v0.0.5-zs-script: loaded");

// Override console.error to send errors to parent
const originalConsoleError = console.error;
console.error = (...args) => {
  window.parent.postMessage(
    {
      type: "zs-console-error",
      data: args,
    },
    "*",
  );
  console.log("ZS-CONSOLE-Error: ", args);
  originalConsoleError.apply(console, args);
};

// Error handlers
window.addEventListener("error", (event) => {
  window.parent.postMessage(
    {
      type: "zs-window-error",
      error: {
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    },
    "*",
  );
  console.log("ZS-WINDOW-Error: ", event);
});

window.addEventListener("unhandledrejection", (event) => {
  window.parent.postMessage(
    {
      type: "zs-unhandled-rejection",
      reason: event.reason?.toString(),
    },
    "*",
  );
  console.log("ZS-unhandled-Error: ", event);
});

// Enhanced askzumi function
window.askzumi = (...args) => {
  // Send message to parent
  window.parent.postMessage(
    {
      type: "ask-zumi",
      data: args,
      timestamp: new Date().toISOString(),
    },
    "*",
  );

  console.log("[askzumi] Called with args:", args);

  // Return promise for future async support
  return null;
};

// Double-load protection
if (window._askzumiLoaded) {
  console.warn("askzumi already loaded!");
} else {
  window._askzumiLoaded = true;
}
