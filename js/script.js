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

var content = "";
const selectedOption = async (e) => {
  content = e.textContent;

  let params = new URLSearchParams(document.location.search);
  const url = new URL(window.location.href);

  if (selectedCategory === "Reszta Świata") {
    sortBy = "alt asc";
    url.searchParams.delete("year");
    window.history.pushState(null, "", url.toString());
  } else if (e.id === "year asc" || e.id === "year desc") {
    url.searchParams.set("year", e.id);
    sortBy = e.id;
    window.history.pushState(null, "", url.toString());
  } else {
    sortBy = e.id;
  }

  const newParams = new URLSearchParams(document.location.search);

  closeSortingMenu();

  const countryName = params?.get("country");
  const stateName = params?.get("state");
  const yearSort = newParams?.get("year");

  const countryNameURL = decodeURIComponent(countryName);
  const stateNameURL = stateName ? decodeURIComponent(stateName) : null;
  const yearSortURL = yearSort ? decodeURIComponent(yearSort) : null;

  await resetFilters(countryNameURL, stateNameURL, yearSortURL);
  const placeHolder = document.querySelector(".select-placeholder");
  placeHolder.textContent = content;
};

const selectCategory = (parametr) => {
  selectedCategory = parametr;
};

const selectState = (parametr) => {
  selectedState = parametr;
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

const resetFilters = async (countryName, stateName, sortByYear) => {
  removeElements();
  currentPage = 1;
  platesStartRange = 0;
  platesEndRange = 20;

  let params = new URLSearchParams(document.location.search);
  const url = new URL(window.location.href);

  if (countryName && !stateName && !sortByYear) {
    url.searchParams.set("country", countryName);
    url.searchParams.delete("state");
    url.searchParams.delete("year");
  } else if (stateName && !sortByYear) {
    url.searchParams.set("country", countryName);
    url.searchParams.set("state", stateName);
    url.searchParams.delete("year");
  } else if (countryName && !stateName && sortByYear) {
    url.searchParams.set("country", countryName);
    url.searchParams.delete("state");
    url.searchParams.set("year", sortByYear);
  } else if (stateName && sortByYear) {
    url.searchParams.set("country", countryName);
    url.searchParams.set("state", stateName);
    url.searchParams.set("year", sortByYear);
  }

  window.history.pushState(null, "", url.toString());

  const data = await displayMore(countryName, stateName, sortByYear);
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
    translation();
  });

window.addEventListener("load", () => {
  translation();
});

window.addEventListener("hashchange", function () {
  onLoadTranslate();
});

//Make mobile navigation work

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");
btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    // Close mobile naviagtion
    if (link.classList.contains("main-nav-link"))
      headerEl.classList.toggle("nav-open");
  });
});
