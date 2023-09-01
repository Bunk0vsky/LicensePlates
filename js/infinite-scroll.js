var currentPage = 1;

const infiniteSCroll = async (plateCount) => {
  const cardCountElem = document.getElementById("card-count");
  const cardTotalElem = document.getElementById("card-total");
  const loader = document.getElementById("scroll-loader");
  let cardLimit = plateCount;
  const cardIncrease = 5;
  const pageCount = Math.ceil(cardLimit / cardIncrease);

  cardTotalElem.innerHTML = cardLimit;

  var throttleTimer;
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
      pageIndex == pageCount ? cardLimit : pageIndex * cardIncrease;
    cardCountElem.innerHTML = endRange;

    if (pageIndex === pageCount) {
      removeInfiniteScroll();
    }
    if (pageIndex > 1) {
      await displayMore();
      currentPage = pageIndex;
    }
  };

  const handleInfiniteScroll = () => {
    throttle(() => {
      const endOfPage =
        window.innerHeight + window.pageYOffset + 360 >=
        document.body.offsetHeight;
      if (endOfPage && currentPage < pageCount) {
        platesStartRange += 5;
        platesEndRange += 5;
        addCards(currentPage + 1);
      }

      if (currentPage === pageCount) {
        removeInfiniteScroll();
      }
    }, 1000);
  };

  const removeInfiniteScroll = () => {
    loader.remove();
    window.removeEventListener("scroll", handleInfiniteScroll);
  };
  window.addEventListener("scroll", handleInfiniteScroll);
  await addCards(currentPage);
};
window.onload = async () => {
  console.log("dupsko");
  window.addEventListener("hashchange", async (e) => {
    if (e.newURL.includes("shop")) {
      platesStartRange = 0;
      platesEndRange = 5;
      currentPage = 1;

      const data = await displayMore();
      infiniteSCroll(data?.count || 0);
    }
  });

  const shopBar = document.getElementById("shop-bar");
  if (shopBar) {
    const data = await displayMore();
    infiniteSCroll(data?.count || 0);
  }
};
