document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const mobileThemeToggle = document.getElementById("mobileThemeToggle");
  const htmlElement = document.documentElement;

  const themeCheckbox = themeToggle ? themeToggle.querySelector("input[type='checkbox']") : null;
  const mobileThemeCheckbox = mobileThemeToggle ? mobileThemeToggle.querySelector("input[type='checkbox']") : null;

  function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark" || 
      (savedTheme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    if (isDark) {
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    updateCheckboxes(isDark);
  }

  function updateCheckboxes(isDark) {
    if (themeCheckbox) themeCheckbox.checked = isDark;
    if (mobileThemeCheckbox) mobileThemeCheckbox.checked = isDark;
  }

  function toggleTheme() {
    const isDark = !htmlElement.classList.contains("dark");
    
    if (isDark) {
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    updateCheckboxes(isDark);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function(e) {
      if (e.target !== themeCheckbox) {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener("click", function(e) {
      if (e.target !== mobileThemeCheckbox) {
        e.preventDefault();
        toggleTheme();
      }
    });
  }
  if (themeCheckbox) {
    themeCheckbox.addEventListener("change", function() {
      if (this.checked !== htmlElement.classList.contains("dark")) {
        toggleTheme();
      }
    });
  }
  
  if (mobileThemeCheckbox) {
    mobileThemeCheckbox.addEventListener("change", function() {
      if (this.checked !== htmlElement.classList.contains("dark")) {
        toggleTheme();
      }
    });
  }

  loadTheme();
});
