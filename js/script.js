const closeSortingMenu = () => {
  const background = document.getElementById("sorting-background");
  background.style = "display:none";
  const optionsContainer = document.getElementById("options-container");
  optionsContainer.style = "display:none";
};

const openSortingMenu = () => {
  const background = document.getElementById("sorting-background");
  background.style = "display:block";
  const optionsContainer = document.getElementById("options-container");
  optionsContainer.style = "display:block";
};

const selectedOption = async (e) => {
  const content = e.textContent;
  const placeHolder = document.querySelector(".select-placeholder");
  placeHolder.textContent = content;
  sortBy = e.id;

  closeSortingMenu();
  resetFilters();
};

const removeElements = () => {
  const element = document.getElementById("shop-bar");
  const loader = document.getElementById("scroll-loader");
  element?.replaceChildren();
  if (!loader && element) {
    element.insertAdjacentHTML(
      "afterend",
      `<div id="scroll-loader">
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
  </div>`
    );
  }
};

const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

const resetFilters = async (countryName, stateName) => {
  removeElements();
  currentPage = 1;
  platesStartRange = 0;
  platesEndRange = 5;

  const data = await displayMore(countryName, stateName);
  infiniteSCroll(data?.count || 0);
  translation();
};

const openShopCard = (e) => {
  const modal = document.getElementById(e.getAttribute("data-modal"));
  modal.classList.add("open");
  translation();
  const exits = modal.querySelectorAll(".modal-exit");
  exits.forEach(function (exit) {
    exit.addEventListener("click", function (event) {
      event.preventDefault();
      modal.classList.remove("open");
    });
  });
};

const onLoadTranslate = () =>
  window.addEventListener("load", () => {
    console.log("ładowanie");
    translation();
  });

window.addEventListener("load", () => {
  console.log("ładowanie");
  translation();
});

window.addEventListener("hashchange", function () {
  onLoadTranslate();
  console.log("zmiana hashu");
});
