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
  console.log(data?.count);
  infiniteSCroll(data?.count || 0);
};

const openShopCard = (e) => {
  console.log(e.getAttribute("data-modal"));
  const modals = document.querySelector(
    `[data-modal="${e.getAttribute("data-modal")}"]`
  );
  console.log("modals", modals);
  const modal = document.getElementById(e.getAttribute("data-modal"));
  modal.classList.add("open");
  const exits = modal.querySelectorAll(".modal-exit");
  exits.forEach(function (exit) {
    exit.addEventListener("click", function (event) {
      event.preventDefault();
      modal.classList.remove("open");
    });
  });
};
