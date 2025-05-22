// Override console.error to send errors to parent

console.log("zs-script: loadded");

const originalConsoleError = console.error;
console.error = (...args) => {
  // Send to parent window
  window.parent.postMessage(
    {
      type: "zs-console-error",
      data: args,
    },
    "*",
  ); // Replace '*' with target origin for security

  // Still log to browser console
  originalConsoleError.apply(console, args);
};

// Also catch uncaught errors
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
});

// Catch unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  window.parent.postMessage(
    {
      type: "zs-unhandled-rejection",
      reason: event.reason?.toString(),
    },
    "*",
  );
});
