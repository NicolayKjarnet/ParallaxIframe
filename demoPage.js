const scrollPosElement = document.getElementById("scroll-pos");
const adVisibilityElement = document.getElementById("ad-visibility");
const adFrame = document.getElementById("parallax-ad");

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0;
}

window.addEventListener(
  "scroll",
  () => {
    scrollPosElement.textContent = window.scrollY;
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
