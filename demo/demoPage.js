const scrollPositionElement = document.getElementById("scroll-position");
const adVisibilityElement = document.getElementById("ad-visibility");
const adFrame = document.getElementById("parallax-ad");

const isElementInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0;
};

window.addEventListener(
  "scroll",
  () => {
    scrollPositionElement.textContent = window.scrollY;
    adVisibilityElement.textContent = isElementInViewport(adFrame) ? "Visible" : "Not visible";

    adFrame.contentWindow.postMessage(
      {
        type: "scroll",
        position: window.scrollY,
      },
      "*"
    );
  },
  { passive: true }
);

window.addEventListener("message", (event) => {
  if (event.data.type === "parallaxAdReady") {
    console.log("Parallax ad is ready:", event.data);
  }
});
