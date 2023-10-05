const toggleButton = (e) => {
  console.log("nacisnał");
  e.classList.toggle("active");
  let panel = e.nextElementSibling;
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
    selectCategory("");
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
    selectCategory("Stany Zjednoczone");
  }

  // MOJE
  const windowWidth = document.documentElement.scrollWidth;
  let states = document.querySelectorAll(".menu-nav-link");
  states.forEach(function (element) {
    element.addEventListener("click", function () {
      e.classList.toggle("active");
      panel.style.maxHeight = null;
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  });
  // }
};
