import { CONFIG } from "./constants.js";

export const createDebugger = () => {
  let debugOverlay = document.getElementById("debug-overlay");
  let scrollElement = null;
  let elementsCounter = null;

  const isDebugMode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(CONFIG.DEBUG.ENABLED_PARAM);
  };

  if (!debugOverlay || !isDebugMode()) {
    return {
      updateStats: () => {},
    };
  }

  debugOverlay.style.display = "block";
  scrollElement = document.getElementById("parent-scroll");
  elementsCounter = document.getElementById("elements-active");

  return {
    updateStats: (scrollPosition, activeElements) => {
      if (!scrollElement) return;

      scrollElement.textContent = Math.round(scrollPosition);
      elementsCounter.textContent = activeElements;
    },
  };
};
