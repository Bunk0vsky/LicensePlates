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

var sortBy = "country asc, state asc";
var platesStartRange = 0;
var platesEndRange = 5;
var selectedCategory = "";
var selectedState = "";

const displayMore = async (countryName, stateName) => {
  const defaultCountryName = countryName || selectedCategory;
  const isFilterByCountryName = defaultCountryName
    ? `&& country == "${defaultCountryName}"`
    : "";

  // const isFilterByRestWorldCountryName =
  //   defaultCountryName === "Reszta Świata"
  //     ? `&& country == "${defaultCountryName}"`
  //     : "";

  // const isFilterByPlateSet =
  //   defaultCountryName === "Zestawy tablic"
  //     ? `&& country == "${defaultCountryName}"`
  //     : "";

  const defaultStateName = stateName || selectedState;

  const isFilterByStateName = defaultStateName
    ? `&& state == "${defaultStateName}"`
    : "";

  let QUERY_DISPLAY_MORE_STATES = encodeURIComponent(`{
      "list":*[_type == "plate" && isPromo != true ${isFilterByCountryName} ${isFilterByStateName}] {
      ...,
      "imageUrl": src.asset->url
    } | order(${sortBy}) [${platesStartRange}...${platesEndRange}],
      "count": count(*[_type == "plate" && isPromo != true ${isFilterByCountryName} ${isFilterByStateName}]{
        ...,
      }),
  }
    
  `);

  let URL_to_get_more_states = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_DISPLAY_MORE_STATES}`;

  const response = await fetch(URL_to_get_more_states);

  let { result } = await response.json();
  if (result?.list.length > 0) {
    const loader = document.getElementById("loader");
    loader.classList.add("hidden");
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
