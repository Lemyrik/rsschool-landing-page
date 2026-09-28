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
