const routes = {
  "/": {
    template: "/templates/index.min.html",
    title: "Home",
    description: "Strona główna",
  },
  promocje: {
    template: "/templates/promo.html",
    title: "Promocje",
    description: "Promocje",
  },
  kontakt: {
    template: "/templates/contact.min.html",
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
  locationHandler("promocje");
  getPromoPlates();
});

elShop.addEventListener("click", async (e) => {
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
  locationHandler("/");
  getPlates();
});
elLogo.addEventListener("click", function () {
  locationHandler("/");
  getPlates();
});

elContact.addEventListener("click", function () {
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
  locationHandler("dostawa");
  getDelivery();
});

locationHandler();

const contentDiv = document.getElementById("content");
contentDiv.innerHTML = routes[window.location.pathname];

window.onpopstate = () => {
  contentDiv.innerHTML = routes[window.location.pathname];
};
