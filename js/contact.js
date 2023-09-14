let QUERY_ALL_CONTACT = encodeURIComponent(`*[_type == "contact"]{
  ...,
  
  } `);

let URL_to_get_contact = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY_ALL_CONTACT}`;

const getContact = () => {
  fetch(URL_to_get_contact)
    .then((res) => res.json())
    .then(({ result }) => {
      if (result.length > 0) {
        const sectionContact = document.getElementById("contact-col");
        if (sectionContact) {
          result.forEach((contact) => {
            const isStreet = contact?.street;
            const street = document.createElement("p");
            street.className = "address";
            street.innerHTML = isStreet ? `ul. ${contact.street}` : "";
            sectionContact.appendChild(street);

            const isCity = contact?.city;
            const city = document.createElement("p");
            city.className = "address";
            city.innerHTML = isCity ? ` ${contact.city}` : "";
            sectionContact.appendChild(city);

            const isPhone = contact?.phone;
            const phone = document.createElement("p");
            phone.className = "footer-link";
            phone.innerHTML = isPhone ? `Tel: ${contact.phone}` : "";
            sectionContact.appendChild(phone);

            const isEmail = contact?.email;
            const email = document.createElement("p");
            email.className = "footer-link";
            email.innerHTML = isEmail ? `E-mail: ${contact.email}` : "";
            sectionContact.appendChild(email);
          });
        }
      }
    });
};

getContact();
