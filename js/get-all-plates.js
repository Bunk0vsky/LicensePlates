let PROJECT_ID = "va7p5ydh";
let DATASET = "production";
let lastId = "";
let QUERY_ALL_PLATES_PROMO =
  encodeURIComponent(`*[_type == "plate" && isPromo == true][0...5]{
...,
state->,
country->
} | order(_createdAt asc)`);

let QUERY_ALL_PLATES_NEW =
  encodeURIComponent(`*[_type == "plate" && isPromo != true][0...5]{
...,
state->,
country->
} | order(_createdAt asc)`);

// Compose the URL for your project's endpoint and add the query
let URL_to_get_plates = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_ALL_PLATES_PROMO}`;
let URL_to_get_new_plates = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_ALL_PLATES_NEW}`;

const generatePlate = (plate, shopSection) => {
  const shopWrapper = document.createElement("div");
  shopWrapper.className = "shop-wrapper";
  shopSection.appendChild(shopWrapper);

  const shop = document.createElement("div");
  shop.className = "shop";
  // add the item to the list
  shopWrapper.appendChild(shop);

  const plateImage = document.createElement("img");
  plateImage.className = "shop-img";
  plateImage.src = "/img/promo/plate-1.jpg";

  plateImage.alt = plate.alt;
  shop.appendChild(plateImage);

  const shopContent = document.createElement("div");
  shopContent.className = "shop-content";
  shop.appendChild(shopContent);

  const title = document.createElement("p");
  title.className = "shop-title";
  title.textContent = plate.state?.name || plate.country?.name;
  shopContent.appendChild(title);

  const text = document.createElement("p");
  text.className = "shop-text";
  text.textContent = plate.alt;
  shopContent.appendChild(text);

  const size = document.createElement("p");
  size.className = "shop-size";
  size.textContent = `Wymiary: ${plate.sizeLength} x ${plate.sizeWidth}`;
  shopContent.appendChild(size);

  const year = document.createElement("p");
  year.className = "shop-year";
  year.textContent = `Rok: ${plate.year}`;
  shopContent.appendChild(year);

  const condition = document.createElement("p");
  condition.className = "shop-condition";
  condition.textContent = `Stan: ${plate.condition}`;
  shopContent.appendChild(condition);

  const price = document.createElement("p");
  price.className = "shop-pricing";
  shopContent.appendChild(price);

  const currentPrice = document.createElement("span");
  currentPrice.textContent = `PLN ${plate.price}`;
  price.appendChild(currentPrice);
};

// fetch the content
const getPlates = () => {
  fetch(URL_to_get_plates)
    .then((res) => res.json())
    .then(({ result }) => {
      if (result.length > 0) {
        const promoSection = document.getElementById("promo-bar");
        const loader = document.getElementById("loader");
        loader.classList.add("hidden");

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
            promoWrapper.appendChild(promo);

            const plateImage = document.createElement("img");
            plateImage.className = "promo-img";
            plateImage.src = "/img/promo/plate-1.jpg";

            plateImage.alt = plate.alt;
            promo.appendChild(plateImage);

            const promoContent = document.createElement("div");
            promoContent.className = "promo-content";
            promo.appendChild(promoContent);

            // content -------------------------------
            const title = document.createElement("p");
            title.className = "promo-title";
            title.textContent = plate.state?.name || plate.country?.name;
            promoContent.appendChild(title);

            const text = document.createElement("p");
            text.className = "promo-text";
            text.textContent = plate.alt;
            promoContent.appendChild(text);

            const size = document.createElement("p");
            size.className = "promo-size";
            size.textContent = `Wymiary: ${plate.sizeLength} x ${plate.sizeWidth}`;
            promoContent.appendChild(size);

            const condition = document.createElement("p");
            condition.className = "promo-condition";
            condition.textContent = `Stan: ${plate.condition}`;
            promoContent.appendChild(condition);

            const price = document.createElement("p");
            price.className = "promo-pricing";
            promoContent.appendChild(price);

            const oldPrice = document.createElement("span");
            oldPrice.className = "old-price";
            oldPrice.textContent = `PLN${plate.oldPrice}`;
            price.appendChild(oldPrice);

            const currentPrice = document.createElement("span");
            currentPrice.textContent = `PLN${plate.price}`;
            price.appendChild(currentPrice);
            // content -------------------------------
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
