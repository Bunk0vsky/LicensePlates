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
    if (pageIndex > 1 && pageIndex <= pageCount) {
      await displayMore();
      currentPage = pageIndex;
    }
    if (pageIndex === pageCount) {
      removeInfiniteScroll();
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

window.addEventListener("load", async (event) => {
  if (event.currentTarget.location.hash === "#sklep") {
    const data = await displayMore();
    infiniteSCroll(data?.count || 0);
    getStates();
  }
});
