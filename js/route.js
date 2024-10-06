const routes = {
  "/": {
    template: "/templates/index.min.html",
    title:
      "Kupuj autentyczne Tablice Rejestracyjne z USA w tabliceusa.sklep.pl",
    description: "Strona główna",
  },
  promocje: {
    template: "/templates/promo.html",
    title: "Promocje",
    description: "Promocje",
  },
  kontakt: {
    template: "/templates/contact.html",
    title: "Skontaktuj się",
    description: "Strona kontaktowa",
  },
  sklep: {
    template: "/templates/shop.min.html",
    script: "/js/infinite-scroll.js",
    title: "Sklep",
    description: "Sklep",
  },
  dostawa: {
    template: "/templates/delivery.min.html",
    title: "Dostawa",
    description: "Dostawa",
  },
};

const locationHandler = async (hash, isEval = true) => {
  // get the url path, replace hash with empty string
  var location = hash || window.location.hash.replace("#", "");
  // if the path length is 0, set it to primary page route

  if (location.length == 0) {
    location = "/";
  }
  // get the route object from the routes object
  const route = routes[location];
  const routeScript = routes[location]?.script || "";
  // get the html from the template
  const html = await fetch(route.template).then((response) => response.text());
  const script =
    routeScript &&
    (await fetch(routeScript).then((response) => response.text()));
  // set the content of the content div to the html
  document.getElementById("content").innerHTML = html;
  translation();
  // set the title of the document to the title of the route
  document.title = route.title;
  // set the description of the document to the description of the route
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", route.description);
  if (script && isEval) {
    eval(script);
  }
};

// Funkcja usuwająca konkretny parametr z query stringa
function removeURLParameter(...parameters) {
  // Pobierz aktualne parametry
  const urlParams = new URLSearchParams(window.location.search);

  // Usuń każdy z podanych parametrów
  parameters.forEach((param) => urlParams.delete(param));

  // Zaktualizuj URL bez przeładowania strony
  const newUrl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?" +
    urlParams.toString();

  // Usuń query string, jeśli jest pusty
  if (!urlParams.toString()) {
    window.history.replaceState(
      null,
      "",
      window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname
    );
  } else {
    window.history.replaceState(null, "", newUrl);
  }
}

const url = new URL(window.location.href);

const [countryNameURL, stateNameURL] = url.search
  .replace("?country=", "")
  .replace("state=", "")
  .replaceAll("+", " ")
  .split("&");

window.addEventListener("hashchange", function () {
  locationHandler();
  translation();
});

const elLogo = document.getElementById("main-nav-logo");
const elMain = document.getElementById("main-nav-main");
const elPromo = document.getElementById("main-nav-promo");
const elShop = document.getElementById("main-nav-shop");
const elDelivery = document.getElementById("main-nav-delivery");
const elContact = document.getElementById("main-nav-contact");

elPromo.addEventListener("click", function (e) {
  removeURLParameter("country", "state", "year");
  locationHandler("promocje");
  getPromoPlates();
});

elShop.addEventListener("click", async (e) => {
  removeURLParameter("country", "state", "year");
  selectedCategory = "";
  selectedState = "";
  locationHandler("sklep");

  getStates();
  removeElements();

  currentPage = 1;
  platesStartRange = 0;
  platesEndRange = 20;

  const data = await displayMore();

  infiniteSCroll(data?.count || 0);
});

elMain.addEventListener("click", function () {
  removeURLParameter("country", "state", "year");
  locationHandler("/");
  getPlates();
});
elLogo.addEventListener("click", function () {
  removeURLParameter("country", "state", "year");
  locationHandler("/");
  getPlates();
});

elContact.addEventListener("click", function () {
  removeURLParameter("country", "state", "year");
  locationHandler("kontakt");
  const footer = document.querySelector("footer");
  footer.classList.add("no-border");
});

const addBorder = () => {
  window.addEventListener("hashchange", (e) => {
    if (e.currentTarget.location.hash !== "#kontakt") {
      const footer = document.querySelector("footer");
      footer.classList.remove("no-border");
    }
  });
};
addBorder();

elDelivery.addEventListener("click", function () {
  removeURLParameter("country", "state", "year");
  locationHandler("dostawa");
  getDelivery();
});

const getFromLink = async () => {
  if (url.hash === "#sklep") {
    locationHandler("sklep");
    getStates();
    removeElements();

    currentPage = 1;
    platesStartRange = 0;
    platesEndRange = 20;

    try {
      const data = await displayMore(countryNameURL, stateNameURL);

      // Przetwórz dane, jeśli to konieczne
      infiniteSCroll(data?.count || 0);
    } catch (error) {
      console.error("Błąd podczas pobierania danych: ", error);
    }
  }
};

window.addEventListener("load", (event) => {
  getFromLink();
});

locationHandler();

// const data = await displayMore(countryNameURL, stateNameURL);

// infiniteSCroll(data?.count || 0);

const contentDiv = document.getElementById("content");
contentDiv.innerHTML = routes[window.location.pathname];

window.onpopstate = () => {
  contentDiv.innerHTML = routes[window.location.pathname];
};
