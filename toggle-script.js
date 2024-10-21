// Debounce function
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function (...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
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
  if (!cssVariables.length) {
    console.warn("Value of tr-color-vars attribute not found");
    return;
  }

  let lightColors = {};
  let darkColors = {};
  cssVariables.split(",").forEach((item) => {
    let lightValue = computed.getPropertyValue(`--color--${item}`);
    let darkValue = computed.getPropertyValue(`--dark--${item}`) || lightValue; // Default to lightValue if darkValue is not found
    lightColors[`--color--${item}`] = lightValue;
    darkColors[`--color--${item}`] = darkValue;
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
      Object.keys(colorObject).forEach((key) => {
        htmlElement.style.setProperty(key, colorObject[key]);
      });
    }
  }

  function animateHeroElements(dark) {
    const elements = [
      ".splash_hero-dark", ".hero_dark-mode", ".intro_background_dark",
      ".splash_hero-light", ".hero_light-mode", ".intro_background_light"
    ];

    gsap.to(elements, {
      opacity: (i) => (dark ? (i < 3 ? 1 : 0) : i < 3 ? 0 : 1),
      duration: colorModeDuration,
      ease: colorModeEase,
      onComplete: () => {
        if (!dark) {
          document.querySelector(".intro_background_dark").style.display = "none";
        }
      },
    });

    gsap.to(".is-glow", {
      opacity: dark ? 1 : 0,
      duration: colorModeDuration,
      ease: colorModeEase,
    });
  }

  function goDark(dark, animate) {
    const loadingAnimation = document.querySelector('.loading_animation');
    if (dark) {
      localStorage.setItem("dark-mode", "true");
      htmlElement.classList.add("dark-mode");
      setColors(darkColors, animate);
      if (loadingAnimation) {
        loadingAnimation.style.mixBlendMode = 'darken';
      }
    } else {
      localStorage.setItem("dark-mode", "false");
      htmlElement.classList.remove("dark-mode");
      setColors(lightColors, animate);
      if (loadingAnimation) {
        loadingAnimation.style.mixBlendMode = 'screen';
      }
    }
    window.dispatchEvent(new Event('colorModeToggle'));
    animateHeroElements(dark);
  }

  const debouncedCheckPreference = debounce((e) => {
    goDark(e.matches, false);
  }, 300);

  const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");
  colorPreference.addEventListener("change", throttle(debouncedCheckPreference, 300));

  window.addEventListener("DOMContentLoaded", () => {
    const lightButton = document.querySelector(".light-button");
    const darkButton = document.querySelector(".dark-button");
    const modeToggleBtn = document.querySelector(".mode-toggle-btn"); // New toggle button
    let storagePreference = localStorage.getItem("dark-mode");
    
    if (storagePreference !== null) {
      goDark(storagePreference === "true", false);
      simulateHover(storagePreference === "true" ? darkButton : lightButton);
    } else {
      goDark(colorPreference.matches, false);
    }

    const handleLightButtonClick = () => goDark(false, true);
    const handleDarkButtonClick = () => goDark(true, true);

    if (lightButton) {
      lightButton.addEventListener("click", handleLightButtonClick);
      lightButton.addEventListener("mouseenter", () => setColors(lightColors, true));
      lightButton.addEventListener("mouseleave", () => setColors(lightColors, true));
    }

    if (darkButton) {
      darkButton.addEventListener("click", handleDarkButtonClick);
      darkButton.addEventListener("mouseenter", () => setColors(darkColors, true));
      darkButton.addEventListener("mouseleave", () => setColors(darkColors, true));
    }

    // New mode-toggle-btn functionality
    if (modeToggleBtn) {
      modeToggleBtn.addEventListener("click", () => {
        const isDarkMode = localStorage.getItem("dark-mode") === "true";
        goDark(!isDarkMode, true);
      });
    }
  });
}

colorModeToggle();
