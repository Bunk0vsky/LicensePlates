const toggleButton = (e) => {
  e.classList.toggle("active");
  let panel = e.nextElementSibling;
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
};
