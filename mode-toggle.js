function colorModeToggle() {
  console.log("Color mode toggle initialized");

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

  // Split and process each CSS variable
  cssVariables.split(",").forEach(function (item) {
    let trimmedItem = item.trim();
    let lightValue = computed.getPropertyValue(`--color--${trimmedItem}`).trim();
    let darkValue = computed.getPropertyValue(`--dark--${trimmedItem}`).trim();

    // Debugging logs to see the fetched values
    console.log(`Processing variable: ${trimmedItem}`);
    console.log(`Light value: ${lightValue}`);
    console.log(`Dark value: ${darkValue}`);

    if (lightValue.length) {
      if (!darkValue.length) darkValue = lightValue;
      lightColors[`--color--${trimmedItem}`] = lightValue;
      darkColors[`--color--${trimmedItem}`] = darkValue;
    } else {
      console.warn(`Light value for --color--${trimmedItem} not found!`);
    }
  });

  if (!Object.keys(lightColors).length) {
    console.warn("No variables found matching tr-color-vars attribute value");
    return;
  }

  function setColors(colorObject, animate) {
    console.log("Setting colors:", colorObject); // Logging colors for debugging

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
            document.querySelector(".intro_background_dark").style.display = "block";
          } else {
            document.querySelector(".intro_background_dark").style.display = "none";
          }
        },
      }
    );

    gsap.to(".is-glow", {
      opacity: dark ? 1 : 0,
      duration: colorModeDuration,
      ease: colorModeEase,
    });
  }

  function goDark(dark, animate) {
    console.log(dark ? "Switching to dark mode" : "Switching to light mode");

    animateHeroElements(dark);

    if (dark) {
      localStorage.setItem("dark-mode", "true");
      htmlElement.classList.add("dark-mode");
      setColors(darkColors, animate);
    } else {
      localStorage.setItem("dark-mode", "false");
      htmlElement.classList.remove("dark-mode");
      setColors(lightColors, animate);
    }

    window.dispatchEvent(new Event("colorModeToggle"));
  }

  window.addEventListener("DOMContentLoaded", () => {
    const lightButton = document.querySelector(".light-button");
    const darkButton = document.querySelector(".dark-button");

    let storagePreference = localStorage.getItem("dark-mode");
    if (storagePreference !== null) {
      goDark(storagePreference === "true", false);
    } else {
      goDark(false, false); // Default to light mode
    }

    if (lightButton) {
      lightButton.addEventListener("click", () => goDark(false, true));
    }

    if (darkButton) {
      darkButton.addEventListener("click", () => goDark(true, true));
    }
  });
}

// Initialize color mode toggle
colorModeToggle();
