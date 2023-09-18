const translations = {
  pl: {
    mainPage: "Strona główna",
    promo: "Promocje",
    shop: "Sklep",
    delivery: "Dostawa",
    contact: "Kontakt",
    footerHeading: "Znajdziesz nas również!",
    footerContact: "Kontakt",
    headingPrimary: "Tablice rejestracyjne z USA.",
    subheading: "Promocje",
    headingSecondary: "Najlepsze oferty na stronie!",
    shopHeading: "Sklep",
    checkOut: "Sprawdź nasze nowości!",
    viewMore: "Zobacz więcej!",
    promoHeading: "Promocje",
    promoHeadingSecondary: "Najlepsze oferty na stronie!",
    promoCheck: "Sprawdź inne oferty!",
    deliveryPayForm: "Formy dostawy i płatności",
    deliverySendCosts: "Koszt Wysyłki Pocztą Polską:",
    deliveryOptions: "Opcje",
    deliveryCost: "Koszt",
    shopSubheading: "Sklep",
    shopAllBtn: "Wszystkie",
    shopUsaBtn: "Stany Zjednoczone",
    shopMexicoBtn: "Meksyk",
    shopCanadaBtn: "Kanada",
    shopRestBtn: "Reszta Świata",
    shopSetsBtn: "Zestawy tablic",
    shopFramesBtn: "Ramki, tablice motocyklowe",
    shopOthersBtn: "Inne kategorie ",
    shopSortBar: "Sortuj...",
    shopPlateSize: "Wymiary: ",
    shopPlateStatus: "Stan: ",
    modalShopPlateCountry: "Kraj: ",
    modalShopPlateItem: "Przedmiot: ",
    modalShopPlateState: "Stan: ",
    modalShopPlateSize: "Wymiary tablicy: ",
    modalShopPlateStatus: "Stan: ",
    modalShopYear: "Rok wydania: ",
    promoPlateSize: "Wymiary: ",
    promoPlateStatus: "Stan: ",
    promoModalPlateCountry: "Kraj wydania: ",
    promoModalPlateSize: "Wymiary tablicy: ",
    promoModalPlateStatus: "Stan: ",
    promoMiniPlateSize: "Wymiary: ",
    promoMiniPlateStatus: "Stan: ",
    modalPromoPlateCountry: "Kraj: ",
    modalPromoPlateSize: "Wymiary tablicy: ",
    modalPromoYear: "Rok wydania: ",
    modalPromoPlateStatus: "Stan: ",
  },
  cs: {
    mainPage: "Úvodní stránka",
    promo: "Prodej",
    shop: "Obchod",
    delivery: "Doprava",
    contact: "Kontakty",
    footerHeading: "Najdete nás také!",
    footerContact: "Kontakty",
    headingPrimary: "Americké poznávací značky.",
    subheading: "Prodej",
    headingSecondary: "Nejlepší nabídky na webu!",
    shopHeading: "Obchod",
    checkOut: "Podívejte se na naše nové produkty!",
    viewMore: "Vidět víc!",
    promoHeading: "Prodej",
    promoHeadingSecondary: "Nejlepší nabídky na webu!",
    promoCheck: "Podívejte se na další nabídky!",
    deliveryPayForm: "Způsoby doručení a platby",
    deliverySendCosts: "Cena poštovného polskou poštou:",
    deliveryOptions: "Možnosti",
    deliveryCost: "Náklady",
    shopSubheading: "Obchod",
    shopAllBtn: "Všechno",
    shopUsaBtn: "Amerika",
    shopMexicoBtn: "Mexico",
    shopCanadaBtn: "Kanada",
    shopRestBtn: "Zbytek světa",
    shopSetsBtn: "Sady desek",
    shopFramesBtn: "Rámy, motocyklové desky",
    shopOthersBtn: "Ostatní kategorie",
    shopSortBar: "Seřadit...",
    shopPlateSize: "Rozměry: ",
    shopPlateStatus: "Kondice: ",
    modalShopPlateCountry: "Země původu: ",
    modalShopPlateItem: "Položka: ",
    modalShopPlateState: "Stan",
    modalShopPlateSize: "Rozměry desky:",
    modalShopPlateStatus: "Kondice: ",
    modalShopYear: "Datum publikace: ",
    promoPlateSize: "Rozměry: ",
    promoPlateStatus: "Kondice: ",
    promoModalPlateCountry: "Země původu: ",
    promoModalPlateSize: "Rozměry desky: ",
    promoModalPlateStatus: "Kondice: ",
    promoMiniPlateSize: "Rozměry: ",
    promoMiniPlateStatus: "Kondice: ",
    modalPromoPlateCountry: "Země původu: ",
    modalPromoPlateSize: "Rozměry desky: ",
    modalPromoYear: "Datum publikace: ",
    modalPromoPlateStatus: "Kondice: ",
  },
};

// Button language
const flagButton = document.getElementById("flagButton");
let currentLanguage =
  window.navigator.userLanguage || window.navigator.language;

if (currentLanguage === "pl") {
  flagButton.classList.add("poland");
  flagButton.classList.remove("czech");
} else if (currentLanguage === "cs") {
  flagButton.classList.remove("poland");
  flagButton.classList.add("czech");
}

flagButton.addEventListener("click", () => {
  if (currentLanguage === "pl") {
    currentLanguage = "cs";
    flagButton.classList.remove("poland");
    flagButton.classList.add("czech");
    translation();
  } else {
    currentLanguage = "pl";
    flagButton.classList.remove("czech");
    flagButton.classList.add("poland");
    translation();
  }
});

// var languageBrowser =
//   window.navigator.userLanguage || window.navigator.language;

const translation = () => {
  function translatePage(language) {
    const elementsToTranslate = document.querySelectorAll("[data-translate]");
    elementsToTranslate.forEach((element) => {
      const key = element.getAttribute("data-translate");
      if (translations[language] && translations[language][key]) {
        element.textContent = translations[language][key];
      }
    });
  }
  const selectedLanguage = currentLanguage;
  translatePage(selectedLanguage);
};

// const languageSelector = document.getElementById("language-selector");
// languageSelector.addEventListener("change", () => {
//   const selectedLanguage = languageSelector.value;
//   translatePage(selectedLanguage);
// });
