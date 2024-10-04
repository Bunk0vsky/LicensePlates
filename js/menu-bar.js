const toggleButton = (e) => {
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

  if (windowWidth < 636) {
    states.forEach(function (element) {
      element.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "instant" });
        e.classList.toggle("active");
        panel.style.maxHeight = null;
      });
    });
  } else if (windowWidth > 636) {
    states.forEach(function (element) {
      element.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
        // e.classList.toggle("active");
        // panel.style.maxHeight = null;
      });
    });
  }
};
