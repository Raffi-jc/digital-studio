let counter = {
  value: 0,
};

let loadDuration = 5;

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

  // Once progress is 100, display "100" and then transition to "open" after a slight delay
  if (progress === 100) {
    gsap.to(".text-loader", {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        // Slight delay before showing "open"
        gsap.to(".text-loader", {
          delay: 0.3, // 0.3 seconds delay
          onComplete: () => {
            $(".text-loader").text("open");
            gsap.to(".text-loader", {
              opacity: 1,
              duration: 0.5,
            });
          },
        });
      },
    });

    gsap.to(".loader_audio-prompt", {
      opacity: 1,
      duration: 1,
      ease: "power.out",
      delay: 1,
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
