document.body.onload = addElement("coffee");

async function addElement(options = false) {
  let configData = await loadConfig();
  async function loadConfig() {
    return await fetch("products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Сетевая ошибка: " + response.statusText);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Проблема с операцией fetch:", error);
        throw error;
      });
  }
  if (options) {
    configData
      .filter((card) => card.category === options)
      .map((obj) => {
        createCard(obj);
      });
  } else {
    configData.map((obj) => {
      createCard(obj);
    });
  }
}
function closeDetails() {
  let cardDetailsContainer = document.querySelector(".card-ditails-container");
  cardDetailsContainer?.remove();
  document.body.classList.toggle("disable-scroll");
}
function createCard(obj) {
  function cardDitails(obj) {
    document.body.classList.toggle("disable-scroll");

    let cardsContainer = document.querySelector(".cards");
    let cardDetailsContainer = document.createElement(`div`);
    cardDetailsContainer.classList.add("card-ditails-container");

    cardDetailsContainer.addEventListener("click", closeDetails);

    cardsContainer.appendChild(cardDetailsContainer);
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
                    <div class="details-size__buttons"  id="choise-size">
                        ${[...Object.values(obj.sizes)]
                          .map(
                            (size, i) => `
            <button class="details__btn details-size__btn" id="size${i + 1}_btn">
            <span>${i === 0 ? "S" : i === 1 ? "M" : "L"}</span>${size.size}
            </button>
        `,
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
        </button>
      `,
                          )
                          .join("")}
                    </div>
                </div>
                <div class="details-price">
                    <h4>Total:</h4>
                    <h4 id="total-price">$${obj.price}</h4>
                </div>
                <div class="details-warn">
                    <hr>
                    <div class="details-warn__info">
                    <p>i</p>
                    <span>The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</span>
                    </div>
                </div>  
                <button class="details__btn" onclick="closeDetails()" id="details__close-btn">Close</button>           
              </div>`;
    cardDetailsContainer.appendChild(card);

    let sizeButtons = document.getElementById("choise-size").children,
      sizeSBtn = document.getElementById("size1_btn"),
      sizeMBtn = document.getElementById("size2_btn"),
      sizeLBtn = document.getElementById("size3_btn");
    totalPrice = document.getElementById("total-price");
    sygarAddBtn = document.getElementById("addit1_btn");
    cinAddBtn = document.getElementById("addit2_btn");
    syrupAddBtn = document.getElementById("addit3_btn");

    sizeSBtn.addEventListener("click", () => onChangeSize("s", sizeSBtn));
    sizeMBtn.addEventListener("click", () => onChangeSize("m", sizeMBtn));
    sizeLBtn.addEventListener("click", () => onChangeSize("l", sizeLBtn));

    sygarAddBtn.addEventListener("click", () => onChangeAddit(1, sygarAddBtn));
    cinAddBtn.addEventListener("click", () => onChangeAddit(2, cinAddBtn));
    syrupAddBtn.addEventListener("click", () => onChangeAddit(3, syrupAddBtn));
    let addTotal = 0;
    function onChangeAddit(num, button) {
      let oldPrice = totalPrice.textContent.slice(1);
      let priceAdd = Number(obj.additives[num - 1]["add-price"]);
      if (button.classList.contains("active")) {
        button.classList.remove("active");
        totalPrice.textContent = "$" + (Number(oldPrice) - priceAdd).toFixed(2);
        addTotal -= priceAdd;
      } else {
        button.classList.add("active");
        totalPrice.textContent = "$" + (Number(oldPrice) + priceAdd).toFixed(2);
        addTotal += priceAdd;
      }
    }
    function onChangeSize(size, button) {
      for (let i = 0; i < sizeButtons.length; i += 1) {
        if (sizeButtons[i].classList.contains("active")) {
          sizeButtons[i].classList.remove("active");
        }
      }
      button.classList.add("active");
      totalPrice.textContent =
        "$" +
        (
          addTotal +
          Number(obj.price) +
          Number(obj.sizes[size]["add-price"])
        ).toFixed(2);
    }
  }

  let cardsContainer = document.querySelector(".cards");
  let card = document.createElement("div");
  card.classList.add("cards__card");
  card.addEventListener("click", () => cardDitails(obj));

  card.innerHTML = `
            <img class="card__img" src=${obj?.image} alt="coffee" />
            <div class="card__container">
              <h2 class="card__name">${obj?.name}</h2>
              <p class="card__desc">${obj?.description}
              </p>
              <h2 class="card__price">${obj?.price}</h2>
            </div>`;
  cardsContainer.appendChild(card);
}

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
  document.querySelector(".cards").replaceChildren();
  addElement(type);
}

document.addEventListener("keydown", (event) => {
  let cardDetailsContainer = document.querySelector(".card-ditails-container");
  if (event.key === "Escape" && cardDetailsContainer) {
    closeDetails();
  }
});

function onChangePrice(type, button) {
  for (let i = 0; i < categoryButtons.length; i += 1) {
    if (categoryButtons[i].classList.contains("active")) {
      categoryButtons[i].classList.remove("active");
    }
  }
  button.classList.add("active");
}
