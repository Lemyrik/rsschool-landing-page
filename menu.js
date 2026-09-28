let allCards = [];
let shownCount = 0;
let currentStep = 4;

const cardsEl = document.querySelector(".cards");
const moreBtn = document.getElementById("more-btn");

function debounce(fn, delay = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function getVisibleCount() {
  const w = window.innerWidth;
  if (w >= 1426) return 4;
  if (w >= 1081) return 3;
  if (w >= 736) return 2;
  return 1;
}

async function loadConfig() {
  const response = await fetch("products.json");
  if (!response.ok) {
    throw new Error("Сетевая ошибка: " + response.statusText);
  }
  return response.json();
}

async function addElement(options = false) {
  const configData = await loadConfig();

  const filtered = options
    ? configData.filter((card) => card.category === options)
    : configData;

  initCategory(filtered);
}

function initCategory(cardsArray) {
  allCards = cardsArray;
  currentStep = getVisibleCount();
  shownCount = Math.min(currentStep, allCards.length);
  renderCards();
}

function renderCards() {
  cardsEl.replaceChildren();
  allCards.slice(0, shownCount).forEach((obj) => createCard(obj));

  const remaining = allCards.length - shownCount;
  moreBtn.hidden = remaining <= 0;
}

moreBtn.addEventListener("click", () => {
  currentStep = getVisibleCount();
  shownCount = Math.min(shownCount + currentStep, allCards.length);
  renderCards();
});

window.addEventListener(
  "resize",
  debounce(() => {
    if (!allCards.length) return;

    const shownGroups = Math.ceil(shownCount / currentStep) || 1;
    currentStep = getVisibleCount();
    shownCount = Math.min(shownGroups * currentStep, allCards.length);

    renderCards();
  }, 200),
);

let categoryButtons = document.getElementsByClassName("categories__category"),
  dessertButton = document.getElementById("dessert-button"),
  coffeeButton = document.getElementById("coffee-button"),
  teaButton = document.getElementById("tea-button");

coffeeButton.addEventListener("click", () =>
  onChangeType("coffee", coffeeButton),
);
teaButton.addEventListener("click", () => onChangeType("tea", teaButton));
dessertButton.addEventListener("click", () =>
  onChangeType("dessert", dessertButton),
);

function onChangeType(type, button) {
  for (let i = 0; i < categoryButtons.length; i += 1) {
    if (categoryButtons[i].classList.contains("active")) {
      categoryButtons[i].classList.remove("active");
    }
  }
  button.classList.add("active");
  addElement(type);
}

function createCard(obj) {
  let card = document.createElement("div");
  card.classList.add("cards__card");
  card.addEventListener("click", () => cardDitails(obj));

  card.innerHTML = `
    <img class="card__img" src=${obj?.image} alt=${obj?.category} />
    <div class="card__container">
      <h2 class="card__name">${obj?.name}</h2>
      <p class="card__desc">${obj?.description}</p>
      <h2 class="card__price">${obj?.price}</h2>
    </div>`;

  cardsEl.appendChild(card);
}

function closeDetails() {
  let cardDetailsContainer = document.querySelector(".card-ditails-container");
  cardDetailsContainer?.remove();
  document.body.classList.toggle("disable-scroll");
}

function cardDitails(obj) {
  document.body.classList.toggle("disable-scroll");

  let cardDetailsContainer = document.createElement(`div`);
  cardDetailsContainer.classList.add("card-ditails-container");

  cardDetailsContainer.addEventListener("click", closeDetails);

  cardsEl.appendChild(cardDetailsContainer);

  let card = document.createElement("div");
  card.classList.add("card-details");
  card.addEventListener("click", (e) => e.stopPropagation());

  card.innerHTML = `
    <img src=${obj?.image} alt=${obj?.category} />

    <div class="details-info">
      <h4>${obj?.name}</h4>
      <p>${obj?.description}</p>

      <div class="details-size">
        <p>Size</p>
        <div class="details-size__buttons" id="choise-size">
          ${[...Object.values(obj.sizes)]
            .map(
              (size, i) => `
            <button class="details__btn details-size__btn" id="size${i + 1}_btn">
              <span>${i === 0 ? "S" : i === 1 ? "M" : "L"}</span>${size.size}
            </button>`,
            )
            .join("")}
        </div>
      </div>

      <div class="details-size">
        <p>Additives</p>
        <div class="details-size__buttons">
          ${obj.additives
            .map(
              (add, i) => `
            <button class="details__btn details-size__btn" id="addit${i + 1}_btn">
              <span>${i + 1}</span>${add.name}
            </button>`,
            )
            .join("")}
        </div>
      </div>

      <div class="details-price">
        <h4>Total:</h4>
        <h4 id="total-price">$${Number(obj.price).toFixed(2)}</h4>
      </div>

      <div class="details-warn">
        <hr>
        <div class="details-warn__info">
          <p>i</p>
          <span>The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</span>
        </div>
      </div>

      <button class="details__btn" id="details__close-btn">Close</button>
    </div>`;

  cardDetailsContainer.appendChild(card);

  let sizeButtons = document.getElementById("choise-size").children,
    sizeSBtn = document.getElementById("size1_btn"),
    sizeMBtn = document.getElementById("size2_btn"),
    sizeLBtn = document.getElementById("size3_btn");

  let totalPrice = document.getElementById("total-price");
  let sygarAddBtn = document.getElementById("addit1_btn");
  let cinAddBtn = document.getElementById("addit2_btn");
  let syrupAddBtn = document.getElementById("addit3_btn");

  let addTotal = 0;
  let currentSize = "s";

  sizeSBtn.addEventListener("click", () => onChangeSize("s", sizeSBtn));
  sizeMBtn.addEventListener("click", () => onChangeSize("m", sizeMBtn));
  sizeLBtn.addEventListener("click", () => onChangeSize("l", sizeLBtn));

  sygarAddBtn.addEventListener("click", () => onChangeAddit(1, sygarAddBtn));
  cinAddBtn.addEventListener("click", () => onChangeAddit(2, cinAddBtn));
  syrupAddBtn.addEventListener("click", () => onChangeAddit(3, syrupAddBtn));

  document
    .getElementById("details__close-btn")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      closeDetails();
    });

  function onChangeSize(size, button) {
    for (let i = 0; i < sizeButtons.length; i += 1) {
      if (sizeButtons[i].classList.contains("active")) {
        sizeButtons[i].classList.remove("active");
      }
    }
    button.classList.add("active");
    currentSize = size;
    updateTotal();
  }

  function onChangeAddit(num, button) {
    const priceAdd = Number(obj.additives[num - 1]["add-price"]);

    if (button.classList.contains("active")) {
      button.classList.remove("active");
      addTotal -= priceAdd;
    } else {
      button.classList.add("active");
      addTotal += priceAdd;
    }

    updateTotal();
  }

  function updateTotal() {
    const sizePrice = Number(obj.sizes[currentSize]["add-price"]) || 0;
    const total = Number(obj.price) + addTotal + sizePrice;
    totalPrice.textContent = "$" + total.toFixed(2);
  }
}

document.addEventListener("keydown", (event) => {
  let cardDetailsContainer = document.querySelector(".card-ditails-container");
  if (event.key === "Escape" && cardDetailsContainer) {
    closeDetails();
  }
});

document.body.onload = () => addElement("coffee");
