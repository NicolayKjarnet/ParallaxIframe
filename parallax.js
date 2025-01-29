const parentScrollElement = document.getElementById("parent-scroll");
const elementsActiveElement = document.getElementById("elements-active");
const debugOverlay = document.getElementById("debug-overlay");

if (window.location.search.includes("debug=true")) {
  debugOverlay.style.display = "block";
}

const updateParallax = (scrollPosition) => {
  const elements = document.querySelectorAll(".parallax-element");
  let activeElements = 0;

  elements.forEach((element) => {
    const speed = parseFloat(element.dataset.speed) || 0;
    const yPosistion = scrollPosition * speed;

    if (element.classList.contains("image")) {
      element.style.transform = `translate3d(-50%, ${yPosistion}px, 0)`;
    } else {
      element.style.transform = `translate3d(-50%, ${yPosistion}px, 0)`;
    }

    activeElements++;
  });

  if (parentScrollElement) {
    parentScrollElement.textContent = Math.round(scrollPosition);
    elementsActiveElement.textContent = activeElements;
  }
};

window.addEventListener("message", (event) => {
  if (event.data.type === "scroll") {
    requestAnimationFrame(() => {
      updateParallax(event.data.position);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  window.parent.postMessage(
    {
      type: "parallaxAdReady",
      height: document.documentElement.scrollHeight,
    },
    "*"
  );
});
