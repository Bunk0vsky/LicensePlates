const filterPlates = (e) => {
  const stateName = e.textContent;
  let QUERY_STATE = encodeURIComponent(
    `*[_type == "plate"]{
    ...,
    country->,
    state->
    }
    [state.name == "${stateName}"]`
  );

  // Compose the URL for your project's endpoint and add the query
  let URL_to_get_state = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_STATE}`;
  fetch(URL_to_get_state)
    .then((res) => res.json())
    .then(({ result }) => {
      let shopSection = document.getElementById("shop-bar");
      shopSection.replaceChildren();

      if (result.length > 0) {
        if (shopSection) {
          result.forEach((plate) => {
            generatePlate(plate, shopSection);
            // create a div element for each promo
          });
        }
      }
    })

    .catch((err) => console.error(err));
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
const displayAll = () =>
  fetch(URL_to_get_all_states)
    .then((res) => res.json())
    .then(({ result }) => {
      console.log("======================================================D");
      let shopSection = document.getElementById("shop-bar");
      shopSection.replaceChildren();

      if (result.length > 0) {
        plateLastId = result[result.length - 1]._id;

        if (shopSection) {
          // Get only promo plates
          result

            .filter((x) => !x.isPromo)
            .forEach((plate) => {
              generatePlate(plate, shopSection);
            });
        }
      }
    })

    .catch((err) => console.error(err));

var sortBy = "country.name asc, state.name asc";

// fetch the content
// && _id > "${
//   plateLastId || ""
// }"

var platesStartRange = 0;
var platesEndRange = 5;

const displayMore = async () => {
  let QUERY_DISPLAY_MORE_STATES = encodeURIComponent(`{
      "list":*[_type == "plate"  && isPromo != true] {
      ...,
      "state": state->,
      "country": country->
    } | order(${sortBy}) [${platesStartRange}...${platesEndRange}],

      "count": count(*[_type == "plate" && isPromo != true ]),
  
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
