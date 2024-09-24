// Debounce function
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function colorModeToggle() {
  console.log('testing A');
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
  let togglePressed = "false";

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

  function setColors(colorObject, animate) {
    if (typeof gsap !== "undefined" && animate) {
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

  function animateHeroElements(dark) {
    gsap.to(
      [
        ".splash_hero-dark",
        ".hero_dark-mode",
        ".intro_background_dark",
        ".splash_hero-light",
        ".hero_light-mode",
        ".intro_background_light",
      ],
      {
        opacity: (i) => (dark ? (i < 3 ? 1 : 0) : i < 3 ? 0 : 1),
        duration: colorModeDuration,
        ease: colorModeEase,
        onComplete: () => {
          if (dark) {
            document.querySelector(".intro_background_dark").style.display =
              "block";
          } else {
            document.querySelector(".intro_background_dark").style.display =
              "none";
          }
        },
      }
    );
    
    // Handle .is-glow elements
    gsap.to(".is-glow", {
      opacity: dark ? 1 : 0,
      duration: colorModeDuration,
      ease: colorModeEase,
    });
  }

  function goDark(dark, animate) {
    animateHeroElements(dark);
    const loadingAnimation = document.querySelector('.loading_animation');

    if (dark) {
      localStorage.setItem("dark-mode", "true");
      htmlElement.classList.add("dark-mode");
      setColors(darkColors, animate);
      togglePressed = "true";

      // Change mix-blend-mode to 'darken' in dark mode
      if (loadingAnimation) {
        loadingAnimation.style.mixBlendMode = 'darken';
      }

    } else {
      localStorage.setItem("dark-mode", "false");
      htmlElement.classList.remove("dark-mode");
      setColors(lightColors, animate);
      togglePressed = "false";

      // Reset mix-blend-mode to default in light mode
      if (loadingAnimation) {
        loadingAnimation.style.mixBlendMode = 'screen'; // Adjust if you want a different mode for light mode
      }
    }
    window.dispatchEvent(new Event('colorModeToggle'));
  }

  // Debounced function for handling media query changes
  const debouncedCheckPreference = debounce((e) => {
    goDark(e.matches, false);
  }, 300);

  const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");
  colorPreference.addEventListener("change", debouncedCheckPreference);

  function simulateHover(button) {
    if (button) {
      const mouseEnterEvent = new Event("mouseenter");
      button.dispatchEvent(mouseEnterEvent);
    }
  }

  window.addEventListener("DOMContentLoaded", (event) => {
    const lightButton = document.querySelector(".light-button");
    const darkButton = document.querySelector(".dark-button");
    const modeToggleBtn = document.querySelector(".mode-toggle-btn"); // New toggle button

    let storagePreference = localStorage.getItem("dark-mode");
    if (storagePreference !== null) {
      if (storagePreference === "true") {
        goDark(true, false);
        simulateHover(darkButton);
      } else {
        goDark(false, false);
        simulateHover(lightButton);
      }
    } else {
      goDark(colorPreference.matches, false);
    }

    if (lightButton) {
      lightButton.addEventListener("click", () => {
        goDark(false, true);
      });

      lightButton.addEventListener("mouseenter", () => {
        setColors(lightColors, true);
        gsap.to(".splash_hero-light, .intro_background_light", {
          opacity: 1,
          duration: colorModeDuration,
          ease: colorModeEase,
        });
        gsap.to(".splash_hero-dark, .intro_background_dark", {
          opacity: 0,
          duration: colorModeDuration,
          ease: colorModeEase,
        });
      });

      lightButton.addEventListener("mouseleave", () => {
        const darkClass = htmlElement.classList.contains("dark-mode");
        if (darkClass) {
          setColors(darkColors, true);
          gsap.to(".splash_hero-light, .intro_background_light", {
            opacity: 0,
            duration: colorModeDuration,
            ease: colorModeEase,
          });
          gsap.to(".splash_hero-dark, .intro_background_dark", {
            opacity: 1,
            duration: colorModeDuration,
            ease: colorModeEase,
          });
        } else {
          setColors(lightColors, true);
        }
      });
    }

    if (darkButton) {
      darkButton.addEventListener("click", () => {
        goDark(true, true);
      });

      darkButton.addEventListener("mouseenter", () => {
        setColors(darkColors, true);
        gsap.to(".splash_hero-dark, .intro_background_dark", {
          opacity: 1,
          duration: colorModeDuration,
          ease: colorModeEase,
        });
        gsap.to(".splash_hero-light, .intro_background_light", {
          opacity: 0,
          duration: colorModeDuration,
          ease: colorModeEase,
        });
      });

      darkButton.addEventListener("mouseleave", () => {
        const darkClass = htmlElement.classList.contains("dark-mode");
        if (darkClass) {
          setColors(darkColors, true);
        } else {
          setColors(lightColors, true);
          gsap.to(".splash_hero-dark, .intro_background_dark", {
            opacity: 0,
            duration: colorModeDuration,
            ease: colorModeEase,
          });
          gsap.to(".splash_hero-light, .intro_background_light", {
            opacity: 1,
            duration: colorModeDuration,
            ease: colorModeEase,
          });
        }
      });
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
