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
  platesEndRange = 5;

  const data = await displayMore();

  infiniteSCroll(data?.count || 0);
};

var sortBy = "country.name asc, state.name asc";
var platesStartRange = 0;
var platesEndRange = 5;
var selectedCategory = "";
var selectedState = "";

const displayMore = async (countryName, stateName) => {
  const defaultCountryName = countryName || selectedCategory;
  const isFilterByCountryName = defaultCountryName
    ? `[country.name == "${defaultCountryName}" && isPromo != true ]`
    : "";

<<<<<<< Updated upstream
  const isFilterByRestWorldCountryName =
    defaultCountryName === "Reszta Świata"
      ? `[country.name == "${defaultCountryName}" && isPromo != true ]`
      : "";

  const isFilterByPlateSet =
    defaultCountryName === "Zestawy tablic"
      ? `[country.name == "${defaultCountryName}" && isPromo != true ]`
      : "";

=======
>>>>>>> Stashed changes
  const defaultStateName = stateName || selectedState;

  const isFilterByStateName = defaultStateName
    ? `[state.name == "${defaultStateName}" && isPromo != true ]`
    : "";

  let QUERY_DISPLAY_MORE_STATES = encodeURIComponent(`{
      "list":*[_type == "plate"  && isPromo != true] {
      ...,
      "imageUrl": src.asset->url,
      "state": state->,
      "country": country->,
      "condition": condition->
    } ${isFilterByCountryName} ${isFilterByStateName} ${isFilterByRestWorldCountryName} ${isFilterByPlateSet} | order(${sortBy}) [${platesStartRange}...${platesEndRange}],
      "count": count(*[_type == "plate" && isPromo != true ]{
        ...,
        "state": state->,
        "country": country->,
        "condition": condition->
      } ${isFilterByCountryName} ${isFilterByStateName} ${isFilterByRestWorldCountryName} ${isFilterByPlateSet}),
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
      result.list

        .filter((x) => !x.isPromo)
        .forEach((plate) => {
          generatePlate(plate, shopSection);
        });
    }
  }
  return result;
};
