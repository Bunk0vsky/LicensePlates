let PROJECT_ID = "va7p5ydh";
let DATASET = "production";
let lastId = "";
let QUERY_ALL_PLATES_PROMO =
  encodeURIComponent(`*[_type == "plate" && isPromo == true][0...4]{
...,
"imageUrl": src.asset->url,
state->,
country->
} | order(_createdAt asc)`);

let QUERY_ALL_PLATES_NEW =
  encodeURIComponent(`*[_type == "plate" && isPromo != true][0...4]{
...,
"imageUrl": src.asset->url,
state->,
country->
} | order(_createdAt asc)`);

let QUERY_ONLY_PLATES_PROMO =
  encodeURIComponent(`*[_type == "plate" && isPromo == true]{
  ...,
  "imageUrl": src.asset->url,
  state->,
  country->
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
  divImage.appendChild(plateImage);

  const shopContent = document.createElement("div");
  shopContent.className = "shop-content";
  shop.appendChild(shopContent);

  const shopContentWrapper = document.createElement("div");
  shopContent.appendChild(shopContentWrapper);

  const title = document.createElement("p");
  title.className = "shop-title";
  title.textContent = plate.state?.name || plate.country?.name;
  shopContentWrapper.appendChild(title);

  // const text = document.createElement("p");
  // text.className = "shop-text";
  // text.textContent = plate.alt;
  // shopContentWrapper.appendChild(text);

  const size = document.createElement("p");
  size.className = "shop-size";
  size.innerHTML = `<span data-translate="shopPlateSize">Wymiary:</span> ${plate.sizeLength} x ${plate.sizeWidth}`;
  shopContentWrapper.appendChild(size);

  const year = document.createElement("p");
  year.className = "shop-year";
  year.textContent = plate.year && `Rok: ${plate.year}`;
  shopContentWrapper.appendChild(year);

  const condition = document.createElement("p");
  condition.className = "shop-condition";
  condition.innerHTML = `<span data-translate="shopPlateStatus">Stan:</span> ${plate.condition}`;

  shopContentWrapper.appendChild(condition);

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
  modalCardImg.appendChild(modalImg);

  const modalCardContent = document.createElement("div");
  modalCardContent.className = "modal-card";
  modalContainer.appendChild(modalCardContent);

  // const modalText = document.createElement("p");
  // modalCardContent.appendChild(modalText);

  // const modalTextSpan = document.createElement("span");
  // modalTextSpan.textContent = plate.alt;
  // modalText.appendChild(modalTextSpan);

  const modalTitle = document.createElement("p");
  const isState = plate.state?.name;
  modalTitle.innerHTML = `<span data-translate="modalShopPlateCountry">Kraj:</span> ${plate.country?.name}`;
  modalCardContent.appendChild(modalTitle);

  const modalTitleState = document.createElement("p");
  modalTitleState.innerHTML = isState
    ? `<span data-translate="modalShopPlateState">Stan:</span> ${plate.state?.name}`
    : "";
  modalCardContent.appendChild(modalTitleState);

  const modalSize = document.createElement("p");
  modalCardContent.appendChild(modalSize);

  modalSize.innerHTML = `<span data-translate="modalShopPlateSize">Wymiary tablicy:</span> ${plate.sizeLength} x ${plate.sizeWidth}`;

  const modalYear = document.createElement("p");
  modalYear.innerHTML = plate.year
    ? `<span data-translate="modalShopYear">Rok wydania:</span> ${plate.year}`
    : "";
  modalCardContent.appendChild(modalYear);

  const modalCondition = document.createElement("p");
  modalCondition.innerHTML = `<span data-translate="modalShopPlateStatus">Stan:</span> ${plate.condition}`;
  modalCardContent.appendChild(modalCondition);

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

// fetch the content
const getPlates = () => {
  fetch(URL_to_get_plates)
    .then((res) => res.json())
    .then(({ result }) => {
      if (result.length > 0) {
        const promoSection = document.getElementById("promo-bar");
        const loader = document.getElementById("loader");
        loader?.classList?.add("hidden");

        if (promoSection) {
          // Get only promo plates
          result.forEach((plate) => {
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
            divImage.appendChild(plateImage);

            const promoContent = document.createElement("div");
            promoContent.className = "promo-content";
            promo.appendChild(promoContent);

            const promoContentWrapper = document.createElement("div");
            promoContent.appendChild(promoContentWrapper);

            // content -------------------------------
            const title = document.createElement("p");
            title.className = "promo-title";
            title.textContent = plate.state?.name || plate.country?.name;
            promoContentWrapper.appendChild(title);

            // const text = document.createElement("p");
            // text.className = "promo-text";
            // text.textContent = plate.alt;
            // promoContentWrapper.appendChild(text);

            const size = document.createElement("p");
            size.className = "promo-size";
            size.innerHTML = `<span data-translate="promoPlateSize">Wymiary:</span> ${plate.sizeLength} x ${plate.sizeWidth}`;
            promoContentWrapper.appendChild(size);

            const year = document.createElement("p");
            year.className = "promo-year";
            year.textContent = plate.year && `Rok: ${plate.year}`;
            promoContentWrapper.appendChild(year);

            const condition = document.createElement("p");
            condition.className = "promo-condition";
            condition.innerHTML = `<span data-translate="promoPlateStatus">Stan:</span> ${plate.condition}`;

            promoContentWrapper.appendChild(condition);

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
            // content -------------------------------

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
            promoModalCardImg.appendChild(promoModalImg);

            const promoModalCardContent = document.createElement("div");
            promoModalCardContent.className = "modal-card";
            promoModalContainer.appendChild(promoModalCardContent);

            // const promoModalText = document.createElement("p");
            // promoModalCardContent.appendChild(promoModalText);

            // const promoModalTextSpan = document.createElement("span");
            // promoModalTextSpan.textContent = plate.alt;
            // promoModalText.appendChild(promoModalTextSpan);

            const promoModalTitle = document.createElement("p");
            const isState = plate.state?.name;
            promoModalTitle.innerHTML = `<span data-translate="promoModalPlateCountry">Kraj:</span> ${plate.country?.name}`;
            promoModalCardContent.appendChild(promoModalTitle);

            const promoModalTitleState = document.createElement("p");
            promoModalTitleState.textContent = isState
              ? `Stan: ${plate.state?.name}`
              : "";
            promoModalCardContent.appendChild(promoModalTitleState);

            const promoModalSize = document.createElement("p");
            promoModalCardContent.appendChild(promoModalSize);
            promoModalSize.innerHTML = `<span data-translate="promoModalPlateSize">Wymiary tablicy:</span> ${plate.sizeLength} x ${plate.sizeWidth}`;

            const promoModalYear = document.createElement("p");
            promoModalYear.innerHTML = `<span>Rok wydania:</span> ${plate.year}`;
            promoModalCardContent.appendChild(promoModalYear);

            const promoModalCondition = document.createElement("p");
            promoModalCondition.innerHTML = `<span data-translate="promoModalPlateStatus">Stan:</span> ${plate.condition}`;
            promoModalCardContent.appendChild(promoModalCondition);

            const promoModalprice = document.createElement("div");
            promoModalprice.className = "promo-modal-price";
            promoModalCardContent.appendChild(promoModalprice);

            const promoModalpriceOld = document.createElement("p");
            promoModalpriceOld.className = "old-price";
            promoModalpriceOld.style = "font-size: 2.2rem";
            promoModalpriceOld.textContent = `PLN ${plate.oldPrice}`;
            promoModalprice.appendChild(promoModalpriceOld);

            const promoModalpriceCurrent = document.createElement("p");
            promoModalpriceCurrent.className = "current-price";
            promoModalpriceCurrent.textContent = `PLN ${plate.price}`;
            promoModalprice.appendChild(promoModalpriceCurrent);

            const promoModalButton = document.createElement("button");
            promoModalButton.className = "modal-close modal-exit";
            promoModalButton.textContent = "X";
            promoModalContainer.appendChild(promoModalButton);
          });
        }
      }
    })

    .catch((err) => console.error(err));

  fetch(URL_to_get_new_plates)
    .then((res) => res.json())
    .then(({ result }) => {
      if (result?.length > 0) {
        const shopSection = document.getElementById("shop-bar-main");
        if (shopSection) {
          result
            .filter((x) => !x.isPromo)
            .forEach((plate) => {
              if (shopSection) {
                generatePlate(plate, shopSection);
              }
            });
        }
      }
    });
};

getPlates();

const getPromoPlates = () => {
  fetch(URL_to_get_promo_plates)
    .then((res) => res.json())
    .then(({ result }) => {
      if (result.length > 0) {
        const promoSection = document.getElementById("promo-bar-page");
        const loader = document.getElementById("loader");
        loader?.classList?.add("hidden");

        if (promoSection) {
          // Get only promo plates
          result.forEach((plate) => {
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
            divImage.appendChild(plateImage);

            const promoContent = document.createElement("div");
            promoContent.className = "promo-content";
            promo.appendChild(promoContent);

            const promoContentWrapper = document.createElement("div");
            promoContent.appendChild(promoContentWrapper);

            // content -------------------------------
            const title = document.createElement("p");
            title.className = "promo-title";
            title.textContent = plate.state?.name || plate.country?.name;
            promoContentWrapper.appendChild(title);

            // const text = document.createElement("p");
            // text.className = "promo-text";
            // text.textContent = plate.alt;
            // promoContentWrapper.appendChild(text);

            const size = document.createElement("p");
            size.className = "promo-size";
            size.innerHTML = `<span data-translate="promoMiniPlateSize">Wymiary:</span> ${plate.sizeLength} x ${plate.sizeWidth}`;

            promoContentWrapper.appendChild(size);

            const year = document.createElement("p");
            year.className = "promo-year";
            year.textContent = `Rok: ${plate.year}`;
            promoContentWrapper.appendChild(year);

            const condition = document.createElement("p");
            condition.className = "promo-condition";
            condition.innerHTML = `<span data-translate="promoMiniPlateStatus">Stan:</span> ${plate.condition}`;

            promoContentWrapper.appendChild(condition);

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
            // content -------------------------------

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
            promoModalCardImg.appendChild(promoModalImg);

            const promoModalCardContent = document.createElement("div");
            promoModalCardContent.className = "modal-card";
            promoModalContainer.appendChild(promoModalCardContent);

            // const promoModalText = document.createElement("p");
            // promoModalCardContent.appendChild(promoModalText);

            // const promoModalTextSpan = document.createElement("span");
            // promoModalTextSpan.textContent = plate.alt;
            // promoModalText.appendChild(promoModalTextSpan);

            const promoModalTitle = document.createElement("p");
            const isState = plate.state?.name;
            promoModalTitle.innerHTML = `<span data-translate="modalPromoPlateCountry">Kraj:</span> ${plate.country?.name}`;
            promoModalCardContent.appendChild(promoModalTitle);

            const promoModalTitleState = document.createElement("p");
            promoModalTitleState.textContent = isState
              ? `Stan: ${plate.state?.name}`
              : "";
            promoModalCardContent.appendChild(promoModalTitleState);

            const promoModalSize = document.createElement("p");
            promoModalCardContent.appendChild(promoModalSize);
            promoModalSize.innerHTML = `<span data-translate="modalPromoPlateSize">Wymiary tablicy:</span> ${plate.sizeLength} x ${plate.sizeWidth}`;

            const promoModalYear = document.createElement("p");
            promoModalYear.innerHTML = `<span data-translate="modalPromoYear">Rok wydania:</span> ${plate.year}`;
            promoModalCardContent.appendChild(promoModalYear);

            const promoModalCondition = document.createElement("p");
            promoModalCondition.innerHTML = `<span data-translate="modalPromoPlateStatus">Stan:</span> ${plate.condition}`;
            promoModalCardContent.appendChild(promoModalCondition);

            const promoModalprice = document.createElement("div");
            promoModalprice.className = "promo-modal-price";
            promoModalCardContent.appendChild(promoModalprice);

            const promoModalpriceOld = document.createElement("p");
            promoModalpriceOld.className = "old-price";
            promoModalpriceOld.textContent = `PLN ${plate.oldPrice}`;
            promoModalprice.appendChild(promoModalpriceOld);

            const promoModalpriceCurrent = document.createElement("p");
            promoModalpriceCurrent.className = "current-price";
            promoModalpriceCurrent.textContent = `PLN ${plate.price}`;
            promoModalprice.appendChild(promoModalpriceCurrent);

            const promoModalButton = document.createElement("button");
            promoModalButton.className = "modal-close modal-exit";
            promoModalButton.textContent = "X";
            promoModalContainer.appendChild(promoModalButton);
          });
        }
      }
    })

    .catch((err) => console.error(err));
};

window.addEventListener("load", (event) => {
  if (event.currentTarget.location.hash === "#promocje") {
    getPromoPlates();
  }
});
