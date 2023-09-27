let QUERY_ALL_STATES = encodeURIComponent(
  `*[_type == "plate" && isPromo != true && country == "Stany Zjednoczone"] {
    state,
  }  | order(state)`
);

let URL_to_get_states = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_ALL_STATES}`;

const getStates = () =>
  fetch(URL_to_get_states)
    .then((res) => res.json())
    .then(({ result }) => {
      let stateList = document.getElementById("usa");

      if (result.length > 0) {
        const filteredResult = [
          ...new Map(result.map((item) => [item.state, item])).values(),
        ];
        if (stateList) {
          filteredResult.forEach((value) => {
            const list = document.createElement("li");
            list.className = "menu-nav-link";
            list.textContent = `${value.state}`;
            list.setAttribute("onclick", "filterPlates(this);");
            stateList.appendChild(list);
          });
        }
      }
    })

    .catch((err) => console.error(err));

const getOtherCountry = async (e) => {
  selectState("");
  selectCategory(e?.id);
  await resetFilters(e?.id);
};

// window.addEventListener("hashchange", (e) => {
//   if (e.newURL.includes("sklep")) {
//     // getStates();
//   }
// });
