(function () {
  const toggle = document.querySelector(".theme-toggle");
  const buttons = document.querySelectorAll(".theme-toggle__button");
  const html = document.documentElement;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark");
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setTheme(button.dataset.theme);
    });
  });

  function setTheme(theme) {
    if (theme === "dark") {
      html.setAttribute("data-theme", "dark");
    } else {
      html.removeAttribute("data-theme");
    }

    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === theme);
    });

    localStorage.setItem("theme", theme);
  }
})();

function toggleMenu() {
  const menu = document.querySelector(".burger__links");
  const menuBurger = document.querySelector(".burger");
  menuBurger.classList.toggle("active");

  menu.classList.toggle("active");
  document.body.classList.toggle("disable-scroll");
}

document.getElementById("burger").addEventListener("click", function () {
  window.scrollTo(0, 0);
  toggleMenu();
});

const menuItems = document.querySelector(".burger__links").children;

for (let i = 0; i < menuItems.length; i++) {
  menuItems[i].addEventListener("click", toggleMenu);
}
document.addEventListener("keydown", (event) => {
  const menuBurger = document.querySelector(".burger");
  if (event.key === "Escape" && menuBurger.classList.contains("active")) {
    toggleMenu();
  }
});

const slidesData = [
  {
    img: "./img/home/coffee-slider-1.png",
    title: "S’mores Frappuccino",
    text: "This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.",
    price: "$5.50",
  },
  {
    img: "./img/home/coffee-slider-2.png",
    title: "Caramel Macchiato",
    text: "Fragrant and unique classic espresso with rich caramel-peanut syrup, with cream under whipped thick foam.",
    price: "$5.00",
  },
  {
    img: "./img/home/coffee-slider-3.png",
    title: "Ice coffee",
    text: "A popular summer drink that tones and invigorates. Prepared from coffee, milk and ice.",
    price: "$4.50",
  },
];

const sliderContent = document.querySelector(".slider__content");
const indicators = document.querySelectorAll(".slider__hr");
const btnLeft = document.getElementById("slider-button-left");
const btnRight = document.getElementById("slider-button-right");

let currentIndex = 0;
const total = slidesData.length;

function renderSlides() {
  sliderContent.innerHTML = "";
  slidesData.forEach((slide, i) => {
    const el = document.createElement("div");
    el.className = "slide";
    el.dataset.index = i;
    el.innerHTML = `
      <img src="${slide.img}" alt="${slide.title}" />
      <h3>${slide.title}</h3>
      <p>${slide.text}</p>
      <h3>${slide.price}</h3>
    `;
    sliderContent.appendChild(el);
  });
}

function updateSlider() {
  const slides = sliderContent?.querySelectorAll(".slide");
  slides.forEach((slide, i) => {
    slide.classList.remove("active", "left", "right");

    if (i === currentIndex) {
      slide.classList.add("active");
    } else if (i < currentIndex) {
      slide.classList.add("left");
    } else {
      slide.classList.add("right");
    }
  });

  indicators.forEach((indicator, i) => {
    indicator.classList.toggle("active", i === currentIndex);
  });
}

function next() {
  currentIndex = (currentIndex + 1) % total;
  updateSlider();
}

function prev() {
  currentIndex = (currentIndex - 1 + total) % total;
  updateSlider();
}

function goTo(index) {
  if (index === currentIndex) return;
  currentIndex = index;
  updateSlider();
}

btnRight.addEventListener("click", next);
btnLeft.addEventListener("click", prev);

renderSlides();
updateSlider();

let touchStartX = 0;

sliderContent.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.touches[0].clientX;
  },
  { passive: true },
);

sliderContent.addEventListener(
  "touchend",
  (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    diff > 0 ? next() : prev();
  },
  { passive: true },
);
