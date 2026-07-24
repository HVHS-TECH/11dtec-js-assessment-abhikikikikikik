// Runs when the webpage finishes loading
window.onload = function () {
  // Finds every food card item
  const cards = document.querySelectorAll(".card-info");
  // Goes through each card 1 by 1
  for (let i = 0; i < cards.length; i++) {
    // Gets the current card
    const card = cards[i];
    // Gets the food name from HTML pages
    const name = card.getAttribute("data-name"); // Grabs the item name from the HTML attribute
    const qty = sessionStorage.getItem(name + "_qty"); // Pulls the previously saved quantity from browser session storage
    if (qty !== null) {
      card.querySelector(".quantity").innerText = qty;
    }
    updateItemTotal(card);
  }
  updateGrandTotalDisplay();

  // Updates the cards for the checkout page
  const checkoutItems = document.getElementById("checkout-items");
  if (checkoutItems) {
    const type = sessionStorage.getItem("orderType");
    if (type) {
      setOrderType(type);
    }
    renderCheckout();
  }
};

// Function : Update quantity
function updateQuantity(button, change) {
  // Find the food card the button belongs to
  const card = button.closest(".card-info"); // Searches in the DOM to find the parent container with this class
  // Finds the quantity display
  const quantity = card.querySelector(".quantity");
  const itemName = card.getAttribute("data-name"); // Grabs the item name from the HTML attribute
  const price = card.getAttribute("data-price"); // Grabs the item price from the HTML attribute

  // Math calculation logic
  let currentQty = parseInt(quantity.innerText) + change; // Converts the text string into a whole number so arithmetic works properly
  if (currentQty < 0) currentQty = 0;
  if (currentQty > 9) currentQty = 9;

  quantity.innerText = currentQty;

  sessionStorage.setItem(itemName + "_qty", currentQty); // Saves the newly updated quantity into  browser memory
  sessionStorage.setItem(itemName + "_price", price); // Saves the item price into browser memory

  updateItemTotal(card);
  updateGrandTotalDisplay();
}

// Function : Update item totals
function updateItemTotal(card) {
  // Math calculation logic
  const qty = parseInt(card.querySelector(".quantity").innerText); // Converts quantity text into a whole number for math
  const price = parseFloat(card.getAttribute("data-price")); // Converts price text into a decimal number so cents are not lost
  let total = qty * price;
  card.querySelector(".item-total").innerText = "Total: $" + total.toFixed(2); // Forces the final price to display exactly two decimal places
}

// Function : Update grand total
function updateGrandTotalDisplay() {
  let grandTotal = 0;
  const cartArray = []; // Array

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i); // Loops through every single key stored in the browser's session storage

    if (key.endsWith("_qty")) {
      // Filters keys to only look at ones that finish with '_qty'
      const itemName = key.replace("_qty", ""); // Strips away '_qty' to isolate just the plain item name
      const quantity = parseInt(sessionStorage.getItem(key)); // Converts the stored text quantity into a whole number
      const price = parseFloat(
        sessionStorage.getItem(itemName + "_price") || 0,
      ); // Converts stored price text into a decimal, or defaults it to 0

      // This code adds an object into an array
      cartArray.push({ name: itemName, qty: quantity, price: price });

      // Math calculation logic
      grandTotal += quantity * price; // Multiplies item quantity by price and adds it to the running grand total
    }
  }

  const displays = document.querySelectorAll(".global-total-display");
  for (let i = 0; i < displays.length; i++) {
    displays[i].innerText = "Grand Total: $" + grandTotal.toFixed(2);
  }
}

// Function : Render checkout code
function renderCheckout() {
  const container = document.getElementById("checkout-items");
  container.innerHTML = "";
  let grandTotal = 0;
  const cartArray = []; // Making an array

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);

    if (key.endsWith("_qty")) {
      const itemName = key.replace("_qty", "");
      const quantity = parseInt(sessionStorage.getItem(key)); // Converts the stored text quantity into a whole number
      const price = parseFloat(
        sessionStorage.getItem(itemName + "_price") || 0,
      ); // Converts the stored price text into a decimal number

      // USING .push() TO ADD AN OBJECT INTO THE ARRAY
      cartArray.push({ name: itemName, qty: quantity, price: price });

      if (quantity > 0) {
        // Math calculation logic
        grandTotal += quantity * price;
        container.innerHTML += //  Generates HTML code onto the page
          '<div class="checkout-row">' +
          "<h3>" +
          itemName +
          "</h3>" +
          '<div class="quantity-wrapper">' +
          '<button class="qty-btn" onclick="changeQty(\'' +
          itemName +
          "', -1)\">-</button>" +
          '<span class="quantity">' +
          quantity +
          "</span>" +
          '<button class="qty-btn" onclick="changeQty(\'' +
          itemName +
          "', 1)\">+</button>" +
          "</div>" +
          "</div>";
      }
    }
  }

  document.getElementById("grand-total").innerText =
    "Total: $" + grandTotal.toFixed(2);

  // Checks if the cart has any items
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    if (grandTotal > 0) {
      checkoutForm.style.display = "flex";
    } else {
      checkoutForm.style.display = "none";
    }
  }
}

// Function : Change quantity for how many you want to buy
function changeQty(name, change) {
  // Math calculation logic
  const savedQty = parseInt(sessionStorage.getItem(name + "_qty")); // Converts the stored quantity into a whole number
  let currentQty = savedQty + change;
  if (currentQty < 0) currentQty = 0;
  if (currentQty > 9) currentQty = 9;

  // Allows user to take out items in the checkout phase
  sessionStorage.setItem(name + "_qty", currentQty);
  renderCheckout();
}

// Function : Dine in or Take out
function setOrderType(type) {
  sessionStorage.setItem("orderType", type);
  const statusElement = document.getElementById("order-status");

  // Checks if the user clicked dine in or take out
  if (statusElement) {
    if (type === "dine-in") {
      // Displays the dine in message
      statusElement.innerText = "Setting up for dine in";
    } else {
      // Displays the take out message
      statusElement.innerText = "Setting up for take out";
    }
  }
}

// Function: Confirm Checkout
function confirmCheckout() {
  // This will trim whitespace from both ends of the input string
  const name = document.getElementById("customer-name").value.trim();
  // Converts the text input into a decimal number
  const moneyGiven = parseFloat(document.getElementById("money-given").value);
  const errorDiv = document.getElementById("error-message");

  const totalText = document.getElementById("grand-total").innerText;
  // Cleans the text string to get just the number value for comparison
  const totalCost = parseFloat(totalText.replace("Total: $", ""));

  if (name === "") {
    errorDiv.innerText = "Please enter your name!";
    errorDiv.style.display = "block";
    return;
  }
  if (isNaN(moneyGiven) || moneyGiven < totalCost) {
    // This checks if the input is not a valid number or is less than the total cost
    errorDiv.innerText = "Warning: Not enough money!";
    errorDiv.style.display = "block";
    return;
  }

  errorDiv.style.display = "none";
  document.getElementById("checkout-form").style.display = "none";
  document.getElementById("confirm-btn").style.display = "none";
  document.getElementById("order-confirmation").style.display = "block";

  // Math calculation logic for change
  // Calculates how much much money user should get back
  let change = moneyGiven - totalCost;
  document.getElementById("confirm-name").innerText =
    name + ". Your change is $" + change.toFixed(2);

  // This displays customer name when you press confirm for the receipt
  const receiptHeader = document.getElementById("receipt-customer-name");
  if (receiptHeader) {
    receiptHeader.innerText = "Customer: " + name;
  }

  // Generate receipt items with simple text
  const receiptContainer = document.getElementById("receipt-items-list");
  // Clears any previous receipt items before adding more
  receiptContainer.innerHTML = "";
  const cartArray = []; // Creating an array

  // Loops through every saved item in sessionStorage

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);

    // This code only uses keys that store quantities
    if (key.endsWith("_qty")) {
      // Gets the original item by removing "_qty"
      let itemName = key.replace("_qty", "");
      // This reads the quantity that was saved for an item
      let quantity = parseInt(sessionStorage.getItem(key)); // Converts the stored text quantity into a whole number

      // This code stores the users receipt info in an array
      cartArray.push({ name: itemName, qty: quantity });

      //Keeps track of your orders, quantity ordered, and price totals
      //This piece of code displays only the items users ordered and put in their cart
      if (quantity > 0) {
        //Adds each ordered item into the receipt
        receiptContainer.innerHTML +=
          '<div class="checkout-row">' +
          "<h3>" +
          itemName +
          "</h3>" +
          '<div class="quantity-wrapper">' +
          '<span class="quantity">x' +
          quantity +
          "</span>" +
          "</div>" +
          "</div>";
      }
    }
  }

  // Extra details for your receipt (Prices, change)
  //Shows the users final receipt total
  document.getElementById("receipt-total").innerText =
    "Grand Total: $" + totalCost.toFixed(2);
  //Shows how much much money the customer entered

  document.getElementById("receipt-money-given").innerText =
    "Money Given: $" + moneyGiven.toFixed(2);

  // Shows the users change
  document.getElementById("receipt-change").innerText =
    "Change: $" + change.toFixed(2);

  // Style for the receipt
  let receiptBox = document.getElementById("receipt-box");
  //Makes the receipt visible and follows the css to show the receipt after checkout is complete.
  if (receiptBox) {
    receiptBox.style.display = "block";
  }

  // Has a delay of 5 seconds before running clearCart code
  setTimeout(clearCart, 5000);
}

// Function : Shows confirmation
function showConfirm() {
  //Finds the confirmation message
  let confirmMsg = document.getElementById("confirm-msg");
  //Makes the confirmation message visible for users
  if (confirmMsg) confirmMsg.style.display = "block";
}

// Function: Hides confirmation
function hideConfirm() {
  //Finds the confirmation message
  let confirmMsg = document.getElementById("confirm-msg");
  if (confirmMsg) confirmMsg.style.display = "none";
}

// Function : Clears cart and takes you back to homepage
function clearCart() {
  // This code wipes out all stored data inside the browser's session storage
  sessionStorage.clear();
  //  This change the browser window location to redirect back to the home page
  window.location.href = "index.html";
}
