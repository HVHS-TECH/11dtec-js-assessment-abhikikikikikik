/****************************
Header
****************************/

// Variables

const welcomeMessage = document.querySelector(".container p");
let orderType = sessionStorage.getItem("savedOrderType");

/******************************
 Main code
 ******************************/

if (orderType) {
  welcomeMessage.textContent = "Setting up your menu for: " + orderType + "!";
}

/******************************
Functions
 ******************************/

function getFormInput() {
  const ORDER_FIELD = document.getElementById("orderField");
  let userChoice = ORDER_FIELD.value;

  if (userChoice) {
    sessionStorage.setItem("savedOrderType", userChoice);
    welcomeMessage.textContent =
      "Setting up your menu for: " + userChoice + "!";
  }
}
