const routes = {
  "/": {
    template: "/templates/index.html",
    title: "Home",
    description: "Strona główna",
  },
  promo: {
    template: "/templates/promo.html",
    title: "Promocje",
    description: "Promocje",
  },
  contact: {
    template: "/templates/contact.html",
    title: "Skontaktuj się",
    description: "Strona kontaktowa",
  },
  shop: {
    template: "/templates/shop.html",
    title: "Sklep",
    description: "Sklep",
  },
  delivery: {
    template: "/templates/delivery.html",
    title: "Dostawa",
    description: "Dostawa",
  },
};

const locationHandler = async () => {
  // get the url path, replace hash with empty string
  var location = window.location.hash.replace("#", "");

  // if the path length is 0, set it to primary page route
  if (location.length == 0) {
    location = "/";
  }
  // get the route object from the routes object
  const route = routes[location] || routes["404"];
  // get the html from the template
  const html = await fetch(route.template).then((response) => response.text());
  // set the content of the content div to the html
  document.getElementById("content").innerHTML = html;
  // set the title of the document to the title of the route
  document.title = route.title;
  // set the description of the document to the description of the route
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", route.description);
};

// create a function that watches the hash and calls the urlLocationHandler
// window.addEventListener("hashchange", locationHandler);

window.addEventListener("hashchange", function () {
  locationHandler();
});

const elMain = document.getElementById("main-nav-main");
const elPromo = document.getElementById("main-nav-promo");
const elShop = document.getElementById("main-nav-shop");

elPromo.addEventListener("click", function (e) {
  locationHandler();
  getPlates();
});

elShop.addEventListener("click", async (e) => {
  locationHandler();
  getStates();
  removeElements();
  currentPage = 1;
  platesStartRange = 0;
  platesEndRange = 5;

  const data = await displayMore();

  infiniteSCroll(data?.count || 0);
});

elMain.addEventListener("click", function (e) {
  locationHandler();
  getPlates();
});

// call the urlLocationHandler to load the page
locationHandler();

const contentDiv = document.getElementById("content");
contentDiv.innerHTML = routes[window.location.pathname];

window.onpopstate = () => {
  contentDiv.innerHTML = routes[window.location.pathname];
};