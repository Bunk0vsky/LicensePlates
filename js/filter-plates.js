const filterPlates = async (e) => {
  await resetFilters("", e?.textContent);
};

// ==============================================================
// function displayAll

let plateLastId = "";

let QUERY_DISPLAY_ALL_STATES = encodeURIComponent(`*[_type == "plate"][0...2]{
    ...,
state->,
country->
  }`);

// Compose the URL for your project's endpoint and add the query
let URL_to_get_all_states = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_DISPLAY_ALL_STATES}`;

// fetch the content
const displayAll = async () => {
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

const displayMore = async (countryName, stateName) => {
  const isFilterByCountryName = countryName
    ? `[country.name == "${countryName}" && isPromo != true ]`
    : "";
  const isFilterByStateName = stateName
    ? `[state.name == "${stateName}" && isPromo != true ]`
    : "";

  let QUERY_DISPLAY_MORE_STATES = encodeURIComponent(`{
      "list":*[_type == "plate"  && isPromo != true] {
      ...,
      "state": state->,
      "country": country->
    } ${isFilterByCountryName} ${isFilterByStateName} | order(${sortBy}) [${platesStartRange}...${platesEndRange}],
      "count": count(*[_type == "plate" && isPromo != true ]{
        ...,
        "state": state->,
        "country": country->
      } ${isFilterByCountryName} ${isFilterByStateName}),
  }
    
  `);

  // Compose the URL for your project's endpoint and add the query
  let URL_to_get_more_states = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_DISPLAY_MORE_STATES}`;

  const response = await fetch(URL_to_get_more_states);

  let { result } = await response.json();
  if (result?.list.length > 0) {
    const loader = document.getElementById("loader");
    loader.classList.add("hidden");
    console.log(result.list);
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

// displayMore();