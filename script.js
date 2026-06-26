/****************************
Header
****************************/

// Variables

const welcomeMessage = document.querySelector(".container p");
let guestName = localStorage.getItem("savedName");

/******************************
 Main code
 ******************************/

if (!guestName) {
  guestName = prompt("Welcome to Masa & Lime! What is your name?");
  if (guestName) {
    localStorage.setItem("savedName", guestName);
  }
}

if (guestName) {
  welcomeMessage.textContent = "Welcome, " + guestName + "!";
}

/******************************
Functions
 ******************************/
