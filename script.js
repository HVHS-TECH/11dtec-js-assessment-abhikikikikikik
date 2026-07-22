window.onload = function () {
  document.querySelectorAll(".card-info").forEach((card) => {
    let name = card.dataset.name;
    let qty = sessionStorage.getItem(name + "_qty");
    if (qty !== null) card.querySelector(".quantity").innerText = qty;
    updateItemTotal(card);
  });
  updateGrandTotalDisplay();
  if (document.getElementById("checkout-items")) {
    let type = sessionStorage.getItem("orderType");
    if (type) setOrderType(type);
    renderCheckout();
  }
};

function updateQuantity(button, change) {
  let card = button.closest(".card-info");
  let quantity = card.querySelector(".quantity");
  let itemName = card.dataset.name;
  let price = card.dataset.price;

  let currentQty = Math.max(
    0,
    Math.min(9, parseInt(quantity.innerText) + change),
  );

  quantity.innerText = currentQty;

  sessionStorage.setItem(itemName + "_qty", currentQty);
  sessionStorage.setItem(itemName + "_price", price);

  updateItemTotal(card);
  updateGrandTotalDisplay();
}

function updateItemTotal(card) {
  let total =
    parseInt(card.querySelector(".quantity").innerText) *
    parseFloat(card.dataset.price);
  card.querySelector(".item-total").innerText = "Total: $" + total.toFixed(2);
}

function updateGrandTotalDisplay() {
  let grandTotal = 0;

  for (let i = 0; i < sessionStorage.length; i++) {
    let key = sessionStorage.key(i);

    if (key.endsWith("_qty")) {
      let itemName = key.replace("_qty", "");
      let quantity = parseInt(sessionStorage.getItem(key));
      let price = parseFloat(sessionStorage.getItem(itemName + "_price") || 0);

      grandTotal += quantity * price;
    }
  }

  document
    .querySelectorAll(".global-total-display")
    .forEach(function (display) {
      display.innerText = "Grand Total: $" + grandTotal.toFixed(2);
    });
}

function renderCheckout() {
  let container = document.getElementById("checkout-items");
  container.innerHTML = "";
  let grandTotal = 0;

  for (let i = 0; i < sessionStorage.length; i++) {
    let key = sessionStorage.key(i);

    if (key.endsWith("_qty")) {
      let itemName = key.replace("_qty", "");
      let quantity = parseInt(sessionStorage.getItem(key));
      let price = parseFloat(sessionStorage.getItem(itemName + "_price") || 0);

      if (quantity > 0) {
        grandTotal += quantity * price;
        container.innerHTML += `
          <div class="checkout-row">
            <h3>${itemName}</h3>
            <div class="quantity-wrapper">
              <button class="qty-btn" onclick="changeQty('${itemName}', -1)">-</button>
              <span class="quantity">${quantity}</span>
              <button class="qty-btn" onclick="changeQty('${itemName}', 1)">+</button>
            </div>
          </div>`;
      }
    }
  }

  document.getElementById("grand-total").innerText =
    "Total: $" + grandTotal.toFixed(2);

  let checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm)
    checkoutForm.style.display = grandTotal > 0 ? "flex" : "none";
}

function changeQty(name, change) {
  let currentQty = Math.max(
    0,
    Math.min(9, parseInt(sessionStorage.getItem(name + "_qty")) + change),
  );

  sessionStorage.setItem(name + "_qty", currentQty);
  renderCheckout();
}

function setOrderType(type) {
  sessionStorage.setItem("orderType", type);
  let statusElement = document.getElementById("order-status");

  if (statusElement) {
    statusElement.innerText =
      type === "dine-in" ? "Setting up for dine in" : "Setting up for take out";
  }
}

function confirmCheckout() {
  let name = document.getElementById("customer-name").value.trim();
  let moneyGiven = parseFloat(document.getElementById("money-given").value);
  let errorDiv = document.getElementById("error-message");
  let totalCost = parseFloat(
    document.getElementById("grand-total").innerText.replace("Total: $", ""),
  );

  if (!name) {
    errorDiv.innerText = "Please enter your name!";
    errorDiv.style.display = "block";
    return;
  }
  if (isNaN(moneyGiven) || moneyGiven < totalCost) {
    errorDiv.innerText = "Warning: Not enough money!";
    errorDiv.style.display = "block";
    return;
  }

  errorDiv.style.display = "none";
  document.getElementById("checkout-form").style.display = "none";
  document.getElementById("confirm-btn").style.display = "none";
  document.getElementById("order-confirmation").style.display = "block";
  document.getElementById("confirm-name").innerText =
    `${name}. Your change is $${(moneyGiven - totalCost).toFixed(2)}`;

  setTimeout(clearCart, 5000);
}

function showConfirm() {
  let confirmMsg = document.getElementById("confirm-msg");
  if (confirmMsg) confirmMsg.style.display = "block";
}

function hideConfirm() {
  let confirmMsg = document.getElementById("confirm-msg");
  if (confirmMsg) confirmMsg.style.display = "none";
}

function clearCart() {
  sessionStorage.clear();
  window.location.href = "index.html";
}
