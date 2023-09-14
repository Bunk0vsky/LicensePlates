let QUERY_ALL_STATES = encodeURIComponent(
  `*[_type == "state"] {
    ...,
    "count": count(*[_type == "plate" && references(^._id) && isPromo != true ])
  }  | order(name)`
);

let URL_to_get_states = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_ALL_STATES}`;

const getStates = () =>
  fetch(URL_to_get_states)
    .then((res) => res.json())
    .then(({ result }) => {
      let stateList = document.getElementById("usa");

      if (result.length > 0) {
        if (stateList) {
          result
            .filter((x) => x.count)
            .forEach((state) => {
              const list = document.createElement("li");
              list.className = "menu-nav-link";
              list.textContent = `${state.name}`;
              list.setAttribute("onclick", "filterPlates(this);");
              stateList.appendChild(list);
            });
        }
      }
    })

    .catch((err) => console.error(err));

const getOtherCountry = async (e) => {
  selectState("");
  selectCategory(e?.textContent);
  await resetFilters(e?.textContent);
};

window.addEventListener("hashchange", (e) => {
  if (e.newURL.includes("sklep")) {
    getStates();
  }
});
