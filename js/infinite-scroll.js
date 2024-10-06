var currentPage = 1;
var pageDisplay = 20;
var cardLimit;

const infiniteSCroll = async (plateCount) => {
  const cardCountElem = document.getElementById("card-count");
  const cardTotalElem = document.getElementById("card-total");
  const cardActions = document.querySelector(".card-actions");
  let scrollLoader = document.getElementById("scroll-loader");
  cardLimit = plateCount;
  const cardIncrease = pageDisplay;
  const pageCount = Math.ceil(cardLimit / cardIncrease);

  if (cardTotalElem) {
    cardTotalElem.innerHTML = cardLimit ?? 0;
  }

  let throttleTimer;
  const throttle = (callback, time) => {
    if (throttleTimer) return;

    throttleTimer = true;
    setTimeout(() => {
      callback();
      throttleTimer = false;
    }, time);
  };

  const addCards = async (pageIndex) => {
    const endRange =
      pageIndex === pageCount ? cardLimit : pageIndex * cardIncrease;
    cardCountElem.innerHTML = endRange;

    if (pageIndex > 1 && pageIndex <= pageCount) {
      const items = await displayMore();
      translation();
      if (items.list.length === 0) {
        removeInfiniteScroll();
      } else {
        currentPage = pageIndex;
      }
    }
    if (pageIndex === pageCount) {
      removeInfiniteScroll();
    }
  };

  const handleInfiniteScroll = (e) => {
    throttle(() => {
      // window.innerHeight + window.pageYOffset + 400 >=
      // document.body.offsetHeight;
      const cardsCoords = cardActions.getBoundingClientRect();
      const endOfPage = cardsCoords.top < window.innerHeight;

      const pageMax = Math.ceil(cardLimit / cardIncrease);

      if (endOfPage && currentPage < pageMax) {
        platesStartRange += pageDisplay;
        platesEndRange += pageDisplay;
        addCards(currentPage + 1);
      }

      if (currentPage === pageMax) {
        removeInfiniteScroll();
      }
    }, 1000);
  };

  const removeInfiniteScroll = () => {
    scrollLoader?.remove();
    window.removeEventListener("scroll", handleInfiniteScroll);
  };
  window.addEventListener("scroll", handleInfiniteScroll);

  await addCards(currentPage);
};

const shopActions = async () => {
  let params = new URLSearchParams(url.search);

  const countryName = params?.get("country");
  const stateName = params?.get("state");
  const yearSort = params?.get("year");

  const countryNameURL = decodeURIComponent(countryName);
  const stateNameURL = stateName ? decodeURIComponent(stateName) : null;
  const yearSortURL = yearSort ? decodeURIComponent(yearSort) : null;

  const data = await displayMore(countryNameURL, stateNameURL, yearSortURL);
  translation();

  infiniteSCroll(data?.count || 0);
  getStates();
};

if (window.location.hash === "#sklep") {
  shopActions();
}

window.addEventListener("load", async (event) => {
  if (event.currentTarget.location.hash === "#sklep") {
    await shopActions();
  }
});
