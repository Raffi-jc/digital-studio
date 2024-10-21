const loadDuration = sessionStorage.getItem("visited") ? 4 : 6;
const counter = { value: sessionStorage.getItem("visited") ? 50 : 0 };

// Mark as visited
sessionStorage.setItem("visited", "true");

// Cache jQuery selectors for better performance
const $textLoader = $(".text-loader");
const $loaderButtonLink = $(".loader_button-link");
const $loaderAudioPrompt = $(".loader_audio-prompt");

// Store the DOM manipulation for loader text update in a variable
const updateLoaderText = () => {
  const progress = Math.round(counter.value);
  
  // Update text loader progress only if it is changing
  if (progress <= 100 && $textLoader.text() !== progress.toString()) {
    $textLoader.text(progress);
  }

  if (progress === 100) {
    // Use a single GSAP timeline to handle animations together
    gsap.timeline()
      .to($textLoader, { opacity: 0, duration: 0.5, delay: 0.5 })
      .add(() => $textLoader.text("open"))
      .to($textLoader, { opacity: 1, duration: 0.5 })
      .to($loaderAudioPrompt, { opacity: 1, duration: 0.5, ease: "power.out" })
      .to($loaderButtonLink, { display: "block", duration: 0.5, ease: "power.out" });
  }
};

// Main timeline for loading animations
const tl = gsap.timeline();
tl.to(counter, { onUpdate: updateLoaderText, value: 100, duration: loadDuration, ease: "power.out" })
  .to(".loader_progress", { transform: "translate(-4%, 20%)", duration: loadDuration, ease: "power.out" }, 0);
