import { CONFIG } from "./constants.js";
import { createDebugger } from "./debug.js";

const createParallaxAd = () => {
  try {
    const debug = createDebugger();
    const elements = document.querySelectorAll(".parallax-element");

    if (!elements.length) {
      throw new Error("No parallax elements found");
    }

    const isValidOrigin = (origin) => {
      return (
        CONFIG.SECURITY.ALLOWED_ORIGINS.includes("*") || CONFIG.SECURITY.ALLOWED_ORIGINS.includes(origin)
      );
    };

    const updateElementPositions = (scrollPosition) => {
      elements.forEach((element) => {
        const speed = parseFloat(element.dataset.speed) || 0;
        const transformY = scrollPosition * speed;
        element.style.transform = `translate3d(${CONFIG.ANIMATION.TRANSFORM_BASE}%, ${transformY}px, 0)`;
      });

      if (debug?.updateStats) {
        debug.updateStats(scrollPosition, elements.length);
      }
    };

    const throttle = (func, limit) => {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    };

    const handleMessage = throttle((event) => {
      if (!isValidOrigin(event.origin)) {
        console.warn(`Message is not valid from origin: ${event.origin}`);
        return;
      }

      if (event.data?.type === "scroll") {
        requestAnimationFrame(() => {
          updateElementPositions(event.data.position);
        });
      }
    }, 16);

    const notifyParentReady = () => {
      window.parent.postMessage(
        {
          type: "parallaxAdReady",
          dimensions: {
            width: CONFIG.DIMENSIONS.WIDTH,
            height: CONFIG.DIMENSIONS.HEIGHT,
          },
        },
        "*"
      );
    };

    const initialize = () => {
      window.addEventListener("message", handleMessage);

      notifyParentReady();

      return function cleanUp() {
        window.removeEventListener("message", handleMessage);
      };
    };

    return {
      initialize,
      updateElementPositions,
    };
  } catch (error) {
    console.error("Failed to initialize:", error);

    return {
      initialize: () => {},
      updateElementPositions: () => {},
    };
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const parallaxAd = createParallaxAd();
  const cleanup = parallaxAd.initialize();

  window._cleanupParallax = cleanup;
});
