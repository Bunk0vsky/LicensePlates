let QUERY_ALL_DELIVERY = encodeURIComponent(`*[_type == "delivery"]{
...,

} `);

let URL_to_get_delivery = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_ALL_DELIVERY}`;

const getDelivery = () => {
  fetch(URL_to_get_delivery)
    .then((res) => res.json())
    .then(({ result }) => {
      if (result.length > 0) {
        const sectionDelivery = document.getElementById("delivery-table-body");
        if (sectionDelivery && !document.querySelector(".price-column")) {
          result.forEach((delivery) => {
            const tr = document.createElement("tr");
            // table.className = "table-delivery";
            sectionDelivery.appendChild(tr);

            const tdOption = document.createElement("td");
            tdOption.textContent = delivery.options;
            tr.appendChild(tdOption);

            const tdPrice = document.createElement("td");
            tdPrice.className = "price-column";
            tdPrice.textContent = `${delivery.price} zł`;
            tr.appendChild(tdPrice);
          });
        }
      }
    });
};

const handleModal = () => {
  const modals = document.querySelectorAll("[data-modal]");
  modals.forEach(function (event) {
    const modal = document.getElementById(event.dataset.modal);
    modal.classList.add("open");
    const exits = modal.querySelectorAll(".modal-exit");
    exits.forEach(function (exit) {
      exit.addEventListener("click", function (event) {
        event.preventDefault();
        modal.classList.remove("open");
      });
    });
  });
};

window.addEventListener("hashchange", (e) => {
  if (e.newURL.includes("dostawa")) {
    getDelivery();
    handleModal();
  }
});

window.addEventListener("load", (e) => {
  if (e.currentTarget.location.hash === "#dostawa") {
    getDelivery();
    handleModal();
  }
});

window.addEventListener("load", (e) => {
  if (e.currentTarget.location.hash === "#kontakt") {
    const footer = document.querySelector("footer");
    footer.classList.add("no-border");
  }
});
