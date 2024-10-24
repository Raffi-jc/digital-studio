function colorModeToggle() {
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }

  const htmlElement = document.documentElement;
  const computed = getComputedStyle(htmlElement);
  let toggleEl;
  let togglePressed = "false"; // default to false for light mode

  const scriptTag = document.querySelector("[tr-color-vars]");
  if (!scriptTag) {
    console.warn("Script tag with tr-color-vars attribute not found");
    return;
  }

  // Reading attributes from the script tag
  let colorModeDuration = attr(0.5, scriptTag.getAttribute("duration"));
  let colorModeEase = attr("power1.out", scriptTag.getAttribute("ease"));

  const cssVariables = scriptTag.getAttribute("tr-color-vars");
  if (!cssVariables || !cssVariables.length) {
    console.warn("Value of tr-color-vars attribute not found");
    return;
  }

  // Set up light and dark color objects for variables
  let lightColors = {};
  let darkColors = {};
  cssVariables.split(",").forEach(function (item) {
    let lightValue = computed.getPropertyValue(`--color--${item}`);
    let darkValue = computed.getPropertyValue(`--dark--${item}`);
    if (lightValue.length) {
      if (!darkValue.length) darkValue = lightValue;
      lightColors[`--color--${item}`] = lightValue;
      darkColors[`--color--${item}`] = darkValue;
    }
  });

  if (!Object.keys(lightColors).length) {
    console.warn("No variables found matching tr-color-vars attribute value");
    return;
  }

  // Function to set colors, optionally animate with GSAP
  function setColors(colorObject, animate) {
    if (typeof gsap !== "undefined" && gsap.to && animate) {
      gsap.to(htmlElement, {
        ...colorObject,
        duration: colorModeDuration,
        ease: colorModeEase,
      });
    } else {
      Object.keys(colorObject).forEach(function (key) {
        htmlElement.style.setProperty(key, colorObject[key]);
      });
    }
  }

  // Function to switch to dark or light mode
  function goDark(dark, animate) {
    if (dark) {
      localStorage.setItem("dark-mode", "true");
      htmlElement.classList.add("dark-mode");
      setColors(darkColors, animate);
      togglePressed = "true"; // update pressed status
    } else {
      localStorage.setItem("dark-mode", "false");
      htmlElement.classList.remove("dark-mode");
      setColors(lightColors, animate);
      togglePressed = "false"; // update pressed status
    }

    // Update the `aria-pressed` attribute on toggle elements
    if (typeof toggleEl !== "undefined") {
      toggleEl.forEach(function (element) {
        element.setAttribute("aria-pressed", togglePressed);
      });
    }
  }

  // Function to check system color preference
  function checkPreference(e) {
    goDark(e.matches, false); // change without animation based on system preference
  }

  // Handle color preference from the system
  const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");
  if (colorPreference.addEventListener) {
    colorPreference.addEventListener("change", (e) => checkPreference(e));
  } else if (colorPreference.addListener) {
    colorPreference.addListener((e) => checkPreference(e));
  }

  // Handle color mode from localStorage
  let storagePreference = localStorage.getItem("dark-mode");
  if (storagePreference !== null && (storagePreference === "true" || storagePreference === "false")) {
    storagePreference === "true" ? goDark(true, false) : goDark(false, false);
  } else {
    checkPreference(colorPreference);
  }

  // When DOM content is fully loaded, setup the toggle elements
  window.addEventListener("DOMContentLoaded", (event) => {
    toggleEl = document.querySelectorAll("[tr-color-toggle]"); // query the toggle elements
    toggleEl.forEach(function (element) {
      element.setAttribute("aria-label", "Toggle Dark Mode");
      element.setAttribute("role", "button");
      element.setAttribute("aria-pressed", togglePressed);
    });

    // Set up event listener for toggling dark mode on button click
    document.addEventListener("click", function (e) {
      const targetElement = e.target.closest("[tr-color-toggle]"); // detect closest button
      if (targetElement) {
        let darkClass = htmlElement.classList.contains("dark-mode");
        darkClass ? goDark(false, true) : goDark(true, true); // toggle dark mode
      }
    });
  });
}

// Initialize the color mode toggle
colorModeToggle();
