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
  
  const htmlElement = document.documentElement;
  const computed = getComputedStyle(htmlElement);
  let togglePressed = "false";

  const scriptTag = document.querySelector("[tr-color-vars]");
  if (!scriptTag) {
    console.warn("Script tag with tr-color-vars attribute not found");
    return;
  }

  const colorModeDuration = parseFloat(scriptTag.getAttribute("duration")) || 0.5;
  const colorModeEase = scriptTag.getAttribute("ease") || "power1.out";

  const cssVariables = scriptTag.getAttribute("tr-color-vars");
  if (!cssVariables) {
    console.warn("Value of tr-color-vars attribute not found");
    return;
  }

  const lightColors = {};
  const darkColors = {};
  cssVariables.split(",").forEach(item => {
    const lightValue = computed.getPropertyValue(`--color--${item}`);
    const darkValue = computed.getPropertyValue(`--dark--${item}`) || lightValue;
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
    gsap.to([
      ".splash_hero-dark", ".hero_dark-mode", ".intro_background_dark",
      ".splash_hero-light", ".hero_light-mode", ".intro_background_light"
    ], {
      opacity: (i) => (dark ? (i < 3 ? 1 : 0) : i < 3 ? 0 : 1),
      duration: colorModeDuration,
      ease: colorModeEase,
      onComplete: () => {
        document.querySelector(".intro_background_dark").style.display = dark ? "block" : "none";
      },
    });

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
      if (loadingAnimation) {
        loadingAnimation.style.mixBlendMode = 'darken';
      }
    } else {
      localStorage.setItem("dark-mode", "false");
      htmlElement.classList.remove("dark-mode");
      setColors(lightColors, animate);
      togglePressed = "false";
      if (loadingAnimation) {
        loadingAnimation.style.mixBlendMode = 'screen';
      }
    }
    window.dispatchEvent(new Event('colorModeToggle'));
  }

  const debouncedCheckPreference = debounce((e) => {
    goDark(e.matches, false);
  }, 300);

  const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");
  colorPreference.addEventListener("change", debouncedCheckPreference);

  function simulateHover(button) {
    if (button) {
      button.dispatchEvent(new Event("mouseenter"));
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    const lightButton = document.querySelector(".light-button");
    const darkButton = document.querySelector(".dark-button");

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
      lightButton.addEventListener("click", () => goDark(false, true));
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
      darkButton.addEventListener("click", () => goDark(true, true));
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
  });
}

colorModeToggle();
