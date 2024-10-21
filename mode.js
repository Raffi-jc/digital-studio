// Debounce function
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

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
  const scriptTag = document.querySelector("[tr-color-vars]");

  if (!scriptTag) {
    console.warn("Script tag with tr-color-vars attribute not found");
    return;
  }

  let colorModeDuration = attr(0.5, scriptTag.getAttribute("duration"));
  let colorModeEase = attr("power1.out", scriptTag.getAttribute("ease"));
  const cssVariables = scriptTag.getAttribute("tr-color-vars");

  if (!cssVariables) {
    console.warn("Value of tr-color-vars attribute not found");
    return;
  }

  let lightColors = {};
  let darkColors = {};
  cssVariables.split(",").forEach(item => {
    let lightValue = computed.getPropertyValue(`--color--${item}`);
    let darkValue = computed.getPropertyValue(`--dark--${item}`) || lightValue;

    if (lightValue) {
      lightColors[`--color--${item}`] = lightValue;
      darkColors[`--color--${item}`] = darkValue;
    }
  });

  if (!Object.keys(lightColors).length) {
    console.warn("No variables found matching tr-color-vars attribute value");
    return;
  }

  function setColors(colorObject, animate) {
    if (typeof gsap !== "undefined" && animate) {
      gsap.to(htmlElement, {
        ...colorObject,
        duration: colorModeDuration,
        ease: colorModeEase,
      });
    } else {
      Object.keys(colorObject).forEach(key => {
        htmlElement.style.setProperty(key, colorObject[key]);
      });
    }
  }

  function animateHeroElements(dark) {
    const lightHeroElements = document.querySelectorAll(".splash_hero-light, .intro_background_light");
    const darkHeroElements = document.querySelectorAll(".splash_hero-dark, .intro_background_dark");

    // Animate light and dark elements based on the current mode
    if (dark) {
      gsap.to(lightHeroElements, {
        opacity: 0,
        duration: colorModeDuration,
        ease: colorModeEase,
        onComplete: () => {
          lightHeroElements.forEach(el => el.style.display = "none"); // Hide light elements
        },
      });
      gsap.to(darkHeroElements, {
        opacity: 1,
        duration: colorModeDuration,
        ease: colorModeEase,
      });
    } else {
      gsap.to(darkHeroElements, {
        opacity: 0,
        duration: colorModeDuration,
        ease: colorModeEase,
        onComplete: () => {
          darkHeroElements.forEach(el => el.style.display = "none"); // Hide dark elements
        },
      });
      gsap.to(lightHeroElements, {
        opacity: 1,
        duration: colorModeDuration,
        ease: colorModeEase,
      });
    }

    // Handle .is-glow elements
    gsap.to(".is-glow", {
      opacity: dark ? 1 : 0,
      duration: colorModeDuration,
      ease: colorModeEase,
    });
  }

  function goDark(dark, animate) {
    localStorage.setItem("dark-mode", dark);
    htmlElement.classList.toggle("dark-mode", dark);
    setColors(dark ? darkColors : lightColors, animate);
    const loadingAnimation = document.querySelector('.loading_animation');

    if (loadingAnimation) {
      loadingAnimation.style.mixBlendMode = dark ? 'darken' : 'screen';
    }
    animateHeroElements(dark);
    window.dispatchEvent(new Event('colorModeToggle'));
  }

  // Debounced function for handling media query changes
  const debouncedCheckPreference = debounce((e) => {
    goDark(e.matches, false);
  }, 300);

  const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");
  colorPreference.addEventListener("change", debouncedCheckPreference);

  window.addEventListener("DOMContentLoaded", () => {
    const lightButton = document.querySelector(".light-button");
    const darkButton = document.querySelector(".dark-button");
    const modeToggleBtn = document.querySelector(".mode-toggle-btn");

    const storagePreference = localStorage.getItem("dark-mode");
    const initialDarkMode = storagePreference !== null ? storagePreference === "true" : colorPreference.matches;
    goDark(initialDarkMode, false);

    if (lightButton) {
      lightButton.addEventListener("click", () => goDark(false, true));
      lightButton.addEventListener("mouseenter", () => {
        setColors(lightColors, true);
        gsap.to(".splash_hero-light, .intro_background_light", { opacity: 1, duration: colorModeDuration, ease: colorModeEase });
        gsap.to(".splash_hero-dark, .intro_background_dark", { opacity: 0, duration: colorModeDuration, ease: colorModeEase });
      });

      lightButton.addEventListener("mouseleave", () => {
        if (htmlElement.classList.contains("dark-mode")) {
          setColors(darkColors, true);
        } else {
          setColors(lightColors, true);
          gsap.to(".splash_hero-light, .intro_background_light", { opacity: 1, duration: colorModeDuration, ease: colorModeEase });
          gsap.to(".splash_hero-dark, .intro_background_dark", { opacity: 0, duration: colorModeDuration, ease: colorModeEase });
        }
      });
    }

    if (darkButton) {
      darkButton.addEventListener("click", () => goDark(true, true));
      darkButton.addEventListener("mouseenter", () => {
        setColors(darkColors, true);
        gsap.to(".splash_hero-dark, .intro_background_dark", { opacity: 1, duration: colorModeDuration, ease: colorModeEase });
        gsap.to(".splash_hero-light, .intro_background_light", { opacity: 0, duration: colorModeDuration, ease: colorModeEase });
      });

      darkButton.addEventListener("mouseleave", () => {
        if (htmlElement.classList.contains("dark-mode")) {
          setColors(darkColors, true);
        } else {
          setColors(lightColors, true);
          gsap.to(".splash_hero-dark, .intro_background_dark", { opacity: 0, duration: colorModeDuration, ease: colorModeEase });
          gsap.to(".splash_hero-light, .intro_background_light", { opacity: 1, duration: colorModeDuration, ease: colorModeEase });
        }
      });
    }

    // New mode-toggle-btn functionality
    if (modeToggleBtn) {
      modeToggleBtn.addEventListener("click", () => {
        goDark(!htmlElement.classList.contains("dark-mode"), true);
      });
    }
  });
}

colorModeToggle();