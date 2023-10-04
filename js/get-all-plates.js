function getConditionStatus(condition) {
  let conditionStatus = "";

  switch (condition) {
    case "Roadkill":
      conditionStatus = "road-kill";
      break;
    case "Słaby":
      conditionStatus = "poor";
      break;
    case "Dostateczny":
      conditionStatus = "sufficent";
      break;
    case "Dobry":
      conditionStatus = "good";
      break;
    case "Bardzo dobry":
      conditionStatus = "very-good";
      break;
    default:
  }
  return conditionStatus;
}

const conditionElement = `<div class="element"></div> 
<div class="element"></div>
<div class="element"></div>
<div class="element"></div> 
<div class="element"></div>`;

let PROJECT_ID = "3gobi7i4";
let DATASET = "production";
let lastId = "";
let QUERY_ALL_PLATES_PROMO =
  encodeURIComponent(`*[_type == "plate" && isPromo == true][0...4]{
...,
"imageUrl": src.asset->url
} | order(_createdAt asc)`);

let QUERY_ALL_PLATES_NEW =
  encodeURIComponent(`*[_type == "plate" && isPromo != true][0...4]{
...,
"imageUrl": src.asset->url
} | order(_createdAt asc)`);

let QUERY_ONLY_PLATES_PROMO =
  encodeURIComponent(`*[_type == "plate" && isPromo == true]{
  ...,
  "imageUrl": src.asset->url
  } | order(_createdAt asc)`);

// Compose the URL for your project's endpoint and add the query
let URL_to_get_plates = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_ALL_PLATES_PROMO}`;
let URL_to_get_new_plates = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_ALL_PLATES_NEW}`;
let URL_to_get_promo_plates = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_ONLY_PLATES_PROMO}`;

const generatePlate = (plate, shopSection) => {
  const shopWrapper = document.createElement("div");
  shopWrapper.className = "shop-wrapper";
  shopSection.appendChild(shopWrapper);

  const shop = document.createElement("div");
  shop.className = "shop";
  // add the item to the list
  shop.setAttribute("onclick", "openShopCard(this);");
  shop.setAttribute("data-modal", plate._id);

  shopWrapper.appendChild(shop);

  const divImage = document.createElement("div");
  divImage.className = "image-wrapper";
  shop.appendChild(divImage);

  const plateImage = document.createElement("img");
  plateImage.className = "shop-img";
  plateImage.src = plate.imageUrl || "/img/no-image.svg";
  plateImage.alt = plate.alt;
  plateImage.loading = "lazy";
  divImage.appendChild(plateImage);

  const shopContent = document.createElement("div");
  shopContent.className = "shop-content";
  shop.appendChild(shopContent);

  const shopContentWrapper = document.createElement("div");
  shopContent.appendChild(shopContentWrapper);

  let isRestCountry = plate.country === "Reszta Świata" ? plate.alt : "";
  let isPlateSet = plate.country === "Zestawy tablic" ? plate.alt : "";
  let isFrame = plate.country === "Ramki" ? plate.alt : "";
  let isNormalCountry =
    plate.country !== "Reszta Świata" &&
    plate.country !== "Zestawy tablic" &&
    plate.country !== "Ramki"
      ? plate.country
      : "";
  const title = document.createElement("p");
  title.className = "shop-title";
  title.innerHTML =
    plate.state || isNormalCountry || isRestCountry || isPlateSet || isFrame;

  shopContentWrapper.appendChild(title);

  const size = document.createElement("p");
  size.className = "shop-size";
  size.innerHTML = plate.sizeLength
    ? `<span data-translate="shopPlateSize">Wymiary:</span> ${plate.sizeLength} x ${plate.sizeWidth}`
    : "";
  shopContentWrapper.appendChild(size);

  const year = document.createElement("p");
  year.className = "shop-year";
  year.textContent = plate.year && `Rok: ${plate.year}`;
  shopContentWrapper.appendChild(year);

  const condition = document.createElement("p");
  condition.className = "shop-condition";
  condition.innerHTML = `<span data-translate="shopPlateStatus">Status: </span>`;
  shopContentWrapper.appendChild(condition);

  const conditionBar = document.createElement("div");

  const conditionStatus = getConditionStatus(plate.condition);

  conditionBar.classList = `condition-bar ${conditionStatus}`;
  conditionBar.innerHTML = conditionElement;
  condition.appendChild(conditionBar);

  const price = document.createElement("p");
  price.className = "shop-pricing";
  shopContent.appendChild(price);

  const currentPrice = document.createElement("span");
  currentPrice.textContent = `PLN ${plate.price}`;
  price.appendChild(currentPrice);

  // =====================MODAL============================
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = plate._id;
  shopWrapper.appendChild(modal);

  const modalBg = document.createElement("div");
  modalBg.className = "modal-bg modal-exit";
  modal.appendChild(modalBg);

  const modalContainer = document.createElement("div");
  modalContainer.className = "modal-container";
  modal.appendChild(modalContainer);

  const modalCardImg = document.createElement("div");
  modalCardImg.className = "modal-card";
  modalContainer.appendChild(modalCardImg);

  const modalImg = document.createElement("img");
  modalImg.className = "modal-img";
  modalImg.src = plate.imageUrl || "/img/no-image.svg";
  modalImg.alt = plate.alt;
  modalImg.loading = "lazy";
  modalCardImg.appendChild(modalImg);

  const modalCardContent = document.createElement("div");
  modalCardContent.className = "modal-card";
  modalContainer.appendChild(modalCardContent);
  const restWorldCountry =
    plate.country === "Reszta Świata"
      ? ` <span data-translate="modalShopPlateCountry">Kraj: </span>${plate.alt}`
      : "";
  const setPlates =
    plate.country === "Zestawy tablic"
      ? `<span data-translate="modalShopPlateItem">Przedmiot: </span>${plate.alt}`
      : "";

  const frames =
    plate.country === "Ramki"
      ? `<span data-translate="modalShopPlateItem">Przedmiot: </span>${plate.alt}`
      : "";

  const normalCountryName =
    plate.country !== "Reszta Świata" &&
    plate.country !== "Zestawy tablic" &&
    plate.country !== "Ramki"
      ? ` <span data-translate="modalShopPlateCountry">Kraj: </span>${plate.country}`
      : "";

  const modalTitle = document.createElement("p");
  modalTitle.innerHTML = `${restWorldCountry} ${setPlates} ${frames} ${normalCountryName}`;
  modalCardContent.appendChild(modalTitle);

  const isState = plate.state;
  const modalTitleState = document.createElement("p");
  modalTitleState.innerHTML = isState
    ? `<span data-translate="modalShopPlateState">Stan: </span> ${plate.state}`
    : "";
  modalCardContent.appendChild(modalTitleState);

  const modalSize = document.createElement("p");

  modalSize.innerHTML = plate.sizeLength
    ? `<span data-translate="modalShopPlateSize">Wymiary tablicy: </span> ${plate.sizeLength} x ${plate.sizeWidth}`
    : "";
  modalCardContent.appendChild(modalSize);

  const modalYear = document.createElement("p");
  modalYear.innerHTML = plate.year
    ? `<span data-translate="modalShopYear">Rok wydania:</span> ${plate.year}`
    : "";
  modalCardContent.appendChild(modalYear);

  const modalCondition = document.createElement("p");
  modalCondition.style = "display: flex; align-items: center; ";
  modalCondition.innerHTML = `<span data-translate="modalShopPlateStatus">Status: </span>`;
  modalCardContent.appendChild(modalCondition);

  const modalConditionBar = document.createElement("div");

  const modalConditionStatus = getConditionStatus(plate.condition);

  modalConditionBar.classList = `condition-bar ${modalConditionStatus}`;
  modalConditionBar.innerHTML = conditionElement;
  modalCondition.appendChild(modalConditionBar);

  const modalprice = document.createElement("div");
  modalprice.className = "modal-price";
  modalCardContent.appendChild(modalprice);

  const modalpriceContent = document.createElement("p");
  modalpriceContent.textContent = `PLN ${plate.price}`;
  modalprice.appendChild(modalpriceContent);

  const modalButton = document.createElement("button");
  modalButton.className = "modal-close modal-exit";
  modalButton.textContent = "X";
  modalContainer.appendChild(modalButton);
};

function generatePromoPlate(plate, promoSection) {
  // create a div element for each promo
  const promoWrapper = document.createElement("div");
  promoWrapper.className = "promo-wrapper";
  promoSection.appendChild(promoWrapper);

  const promo = document.createElement("div");
  promo.className = "promo";
  // add the item to the list
  promo.setAttribute("onclick", "openShopCard(this);");
  promo.setAttribute("data-modal", plate._id);
  promoWrapper.appendChild(promo);

  const divImage = document.createElement("div");
  divImage.className = "image-wrapper";
  promo.appendChild(divImage);

  const plateImage = document.createElement("img");
  plateImage.className = "promo-img";
  plateImage.src = plate.imageUrl || "/img/no-image.svg";
  plateImage.alt = plate.alt;
  plateImage.loading = "lazy";
  divImage.appendChild(plateImage);

  const promoContent = document.createElement("div");
  promoContent.className = "promo-content";
  promo.appendChild(promoContent);

  const promoContentWrapper = document.createElement("div");
  promoContent.appendChild(promoContentWrapper);

  // content -------------------------------

  const isRestCountry = plate.country === "Reszta Świata" ? plate.alt : "";
  const isPlateSet = plate.country === "Zestawy tablic" ? plate.alt : "";
  const isFrame = plate.country === "Ramki" ? plate.alt : "";
  const isNormalCountry =
    plate.country !== "Reszta Świata" &&
    plate.country !== "Zestawy tablic" &&
    plate.country !== "Ramki"
      ? plate.country
      : "";

  const title = document.createElement("p");
  title.className = "promo-title";
  title.innerHTML =
    plate.state || isNormalCountry || isRestCountry || isPlateSet || isFrame;
  promoContentWrapper.appendChild(title);

  const size = document.createElement("p");
  size.className = "promo-size";
  size.innerHTML = plate.sizeLength
    ? `<span data-translate="promoPlateSize">Wymiary:</span> ${plate.sizeLength} x ${plate.sizeWidth}`
    : "";
  promoContentWrapper.appendChild(size);

  const year = document.createElement("p");
  year.className = "promo-year";
  year.textContent = plate.year && `Rok: ${plate.year}`;
  promoContentWrapper.appendChild(year);

  const condition = document.createElement("p");
  condition.style = "display: flex; align-items: center; ";
  condition.className = "promo-condition";
  condition.innerHTML = `<span data-translate="promoPlateStatus">Status: </span>`;
  promoContentWrapper.appendChild(condition);

  const conditionBar = document.createElement("div");

  const conditionStatus = getConditionStatus(plate.condition);

  conditionBar.classList = `condition-bar ${conditionStatus}`;
  conditionBar.innerHTML = conditionElement;
  condition.appendChild(conditionBar);

  const price = document.createElement("p");
  price.className = "promo-pricing";
  promoContent.appendChild(price);

  const oldPrice = document.createElement("span");
  oldPrice.className = "old-price";
  oldPrice.textContent = `PLN ${plate.oldPrice}`;
  price.appendChild(oldPrice);

  const currentPrice = document.createElement("span");
  currentPrice.textContent = `PLN ${plate.price}`;
  price.appendChild(currentPrice);

  // =====================MODAL============================
  const promoModal = document.createElement("div");
  promoModal.className = "modal";
  promoModal.id = plate._id;
  promoWrapper.appendChild(promoModal);

  const promoModalBg = document.createElement("div");
  promoModalBg.className = "modal-bg modal-exit";
  promoModal.appendChild(promoModalBg);

  const promoModalContainer = document.createElement("div");
  promoModalContainer.className = "modal-container";
  promoModal.appendChild(promoModalContainer);

  const promoModalCardImg = document.createElement("div");
  promoModalCardImg.className = "modal-card";
  promoModalContainer.appendChild(promoModalCardImg);

  const promoModalImg = document.createElement("img");
  promoModalImg.className = "modal-img";
  promoModalImg.src = plate.imageUrl || "/img/no-image.svg";
  promoModalImg.alt = plate.alt;
  promoModalImg.loading = "lazy";
  promoModalCardImg.appendChild(promoModalImg);

  const promoModalCardContent = document.createElement("div");
  promoModalCardContent.className = "modal-card";
  promoModalContainer.appendChild(promoModalCardContent);

  const restWorldCountry =
    plate.country === "Reszta Świata"
      ? ` <span data-translate="promoModalShopPlateCountry">Kraj: </span>${plate.alt}`
      : "";
  const setPlates =
    plate.country === "Zestawy tablic"
      ? `<span data-translate="promoModalodalShopPlateItem">Przedmiot: </span>${plate.alt}`
      : "";

  const frames =
    plate.country === "Ramki"
      ? `<span data-translate="promoModalodalShopPlateItem">Przedmiot: </span>${plate.alt}`
      : "";

  const normalCountryName =
    plate.country !== "Reszta Świata" &&
    plate.country !== "Zestawy tablic" &&
    plate.country !== "Ramki"
      ? ` <span data-translate="promoModalPlateCountry">Kraj: </span>${plate.country}`
      : "";

  const promoModalTitle = document.createElement("p");
  const isState = plate.state;
  promoModalTitle.innerHTML = `${restWorldCountry} ${setPlates} ${frames} ${normalCountryName}`;

  promoModalCardContent.appendChild(promoModalTitle);

  const promoModalTitleState = document.createElement("p");
  promoModalTitleState.innerHTML = isState
    ? `<span data-translate="promoModalPlateState">Stan: </span> ${plate.state}`
    : "";
  promoModalCardContent.appendChild(promoModalTitleState);

  const promoModalSize = document.createElement("p");
  promoModalSize.innerHTML = plate.sizeLength
    ? `<span data-translate="promoModalPlateSize">Wymiary tablicy:</span> ${plate.sizeLength} x ${plate.sizeWidth}`
    : "";
  promoModalCardContent.appendChild(promoModalSize);

  const promoModalYear = document.createElement("p");
  promoModalYear.innerHTML = plate.year
    ? `<span>Rok wydania:</span> ${plate.year}`
    : "";
  promoModalCardContent.appendChild(promoModalYear);

  const promoModalCondition = document.createElement("p");
  promoModalCondition.style = "display: flex; align-items: center; ";
  promoModalCondition.innerHTML = `<span data-translate="promoModalPlateStatus">Status: </span>`;
  promoModalCardContent.appendChild(promoModalCondition);

  const promoModalConditionBar = document.createElement("div");

  const promoModalConditionStatus = getConditionStatus(plate.condition);

  promoModalConditionBar.classList = `condition-bar ${promoModalConditionStatus}`;
  promoModalConditionBar.innerHTML = conditionElement;
  promoModalCondition.appendChild(promoModalConditionBar);

  const promoModalprice = document.createElement("div");
  promoModalprice.className = "promo-modal-price";
  promoModalCardContent.appendChild(promoModalprice);

  const promoModalpriceOld = document.createElement("p");
  promoModalpriceOld.className = "old-price";
  promoModalpriceOld.style = "font-size: 1.4rem";
  promoModalpriceOld.textContent = `PLN ${plate.oldPrice}`;
  promoModalprice.appendChild(promoModalpriceOld);

  const promoModalpriceCurrent = document.createElement("p");
  promoModalpriceCurrent.className = "current-price";
  promoModalpriceCurrent.style = "font-size: 2.0rem";
  promoModalpriceCurrent.textContent = `PLN ${plate.price}`;
  promoModalprice.appendChild(promoModalpriceCurrent);

  const promoModalButton = document.createElement("button");
  promoModalButton.className = "modal-close modal-exit";
  promoModalButton.textContent = "X";
  promoModalContainer.appendChild(promoModalButton);
}
// fetch the content
const getPlates = () => {
  fetch(URL_to_get_plates)
    .then((res) => res.json())
    .then(({ result }) => {
      const banner = document.getElementById("banner-index");
      const loader = document.getElementById("loader-index");
      if (result.length > 0) {
        const promoSection = document.getElementById("promo-bar");
        loader?.classList?.add("hidden");
        banner?.classList.remove("visible");

        if (promoSection) {
          // Get only promo plates
          result.forEach((plate) => {
            generatePromoPlate(plate, promoSection);
          });
        }
      } else if (result.length === 0 && banner) {
        banner?.classList.add("visible");
        loader?.classList?.add("hidden");
      }
    })

    .catch((err) => console.error(err));

  fetch(URL_to_get_new_plates)
    .then((res) => res.json())
    .then(({ result }) => {
      const banner = document.getElementById("banner");
      if (result?.length > 0) {
        const shopSection = document.getElementById("shop-bar-main");
        banner?.classList?.remove("visible");

        if (shopSection) {
          result
            .filter((x) => !x.isPromo)
            .forEach((plate) => {
              if (shopSection) {
                generatePlate(plate, shopSection);
              }
            });
        }
      } else if (result.length === 0) {
        banner?.classList?.add("visible");
      }
    });
};

getPlates();

function waitForElementToExist(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });
  });
}

const getPromoPlates = () => {
  fetch(URL_to_get_promo_plates)
    .then((res) => res.json())
    .then(({ result }) => {
      console.log("Wyświetlam resulta", result);
      if (result.length > 0) {
        const promoSection = document.getElementById("promo-bar-page");

        if (promoSection) {
          result.forEach((plate) => {
            generatePromoPlate(plate, promoSection);
          });
        }
      } else {
        waitForElementToExist("#banner-promo").then((element) => {
          console.log(element);
          elem.style.display = "block";
          element.classList.add("visible");
        });
      }
      waitForElementToExist("#loader-promo").then((element) => {
        elem.style.display = "none";
        element.classList.add("hidden");
      });
    })
    .catch((err) => console.error(err));
};

window.addEventListener("load", (event) => {
  if (event.currentTarget.location.hash === "#promocje") {
    console.log("Z załadowania");
    getPromoPlates();
  }
});
