let params = new URLSearchParams(document.location.search);

const filterPlates = async (e) => {
  selectState(e?.textContent);
  await resetFilters("Stany Zjednoczone", e?.textContent);
};

// Function for display all countries
const displayAll = async () => {
  selectCategory("");
  selectState("");

  removeElements();
  currentPage = 1;
  platesStartRange = 0;
  platesEndRange = 20;

  const data = await displayMore();

  infiniteSCroll(data?.count || 0);

  url.searchParams.delete("country");
  url.searchParams.delete("state");
  url.searchParams.delete("year");
  window.history.pushState(null, "", url.toString());
};

var sortBy = "country asc, state asc";
var platesStartRange = 0;
var platesEndRange = 20;
var selectedCategory = "";
var selectedState = "";

const displayMore = async (countryName, stateName, sortByYear) => {
  const defaultCountryName = countryName || selectedCategory;
  const isFilterByCountryName =
    defaultCountryName && defaultCountryName !== "null"
      ? `&& country == "${defaultCountryName}"`
      : "";

  const stateNameTemp =
    typeof stateName === "undefined" || stateName === "undefined"
      ? null
      : stateName;
  const defaultStateName = stateNameTemp || selectedState;

  const isFilterByStateName =
    defaultStateName && defaultStateName !== "null"
      ? `&& state == "${defaultStateName}"`
      : "";

  const isSortByYear = sortByYear ? sortByYear : sortBy;

  let QUERY_DISPLAY_MORE_STATES = encodeURIComponent(`{
      "list":*[_type == "plate" ${isFilterByCountryName} ${isFilterByStateName}] {
      ...,
      "imageUrl": src.asset->url
    } | order(${isSortByYear}) [${platesStartRange}...${platesEndRange}],
      "count": count(*[_type == "plate" ${isFilterByCountryName} ${isFilterByStateName}]{
        ...,
      }),
  }
    
  `);

  let URL_to_get_more_states = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_DISPLAY_MORE_STATES}`;

  const response = await fetch(URL_to_get_more_states);

  let { result } = await response.json();

  if (result?.list.length > 0) {
    const loader = document.getElementById("loader");
    loader?.classList?.add("hidden");
    let shopSection = document.getElementById("shop-bar");

    if (shopSection) {
      const shopElements = shopSection.querySelectorAll(".shop");
      const ids = [];
      shopElements.forEach((x) => ids.push(x.getAttribute("data-modal")));
      const filteredResult = result.list.filter(
        (item) => ids.indexOf(item._id) === -1
      );
      filteredResult
        // .filter((x) => !x.isPromo)
        .forEach((plate) => {
          generatePlate(plate, shopSection);
        });
    }
  }
  return result;
};
