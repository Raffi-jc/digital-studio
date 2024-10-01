let counter = {
  value: 0,
};

let loadDuration = 6;

// Check if dark mode is enabled
const isDarkMode = document.documentElement.classList.contains("dark-mode");

if (sessionStorage.getItem("visited") !== null) {
  loadDuration = 4;
  counter = {
    value: 50,
  };
}

sessionStorage.setItem("visited", "true");

function updateLoaderText() {
  console.log("pardner loading");
  let progress = Math.round(counter.value);
  
  // If progress is less than 100, display the current progress
  if (progress <= 100) {
    $(".text-loader").text(progress);
  }

  // Once progress is 100, hold the text at "100" for a bit before showing "open"
  if (progress === 100) {
    // Hold the "100" text for 0.5 seconds before fading out
    gsap.delayedCall(0.5, () => {
      gsap.to(".text-loader", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          // After fading out, show "open"
          $(".text-loader").text("open");
          gsap.to(".text-loader", {
            opacity: 1,
            duration: 0.5,
          });

          // Fade in the .loader_audio-prompt at the same time as the "open" text
          gsap.to(".loader_audio-prompt", {
            opacity: 1,
            duration: 0.5,
            ease: "power.out",
          });
        },
      });
    });

    gsap.to(".loader_button-link", {
      display: "block",
      duration: 0.5,
      ease: "power.out",
      delay: 0.5,
    });
  }
}

let tl = gsap.timeline({});
tl.to(counter, {
  onUpdate: updateLoaderText,
  value: 100,
  duration: loadDuration,
  ease: "power.out",
});
tl.to(
  ".loader_progress",
  {
    transform: "translate(-4%, 20%)",
    duration: loadDuration,
    ease: "power.out",
  },
  0,
);
