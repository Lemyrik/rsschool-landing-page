(function () {
  const toggle = document.querySelector(".theme-toggle");
  const buttons = document.querySelectorAll(".theme-toggle__button");
  const html = document.documentElement;

  // Применяем сохранённую тему при загрузке
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark");
  }

  // Клик по кнопкам
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setTheme(button.dataset.theme);
    });
  });

  function setTheme(theme) {
    // Ставим data-theme на <html> — так CSS-переменные применятся глобально
    if (theme === "dark") {
      html.setAttribute("data-theme", "dark");
    } else {
      html.removeAttribute("data-theme");
    }

    // Обновляем активную кнопку
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === theme);
    });

    // Сохраняем выбор
    localStorage.setItem("theme", theme);
  }
})();
