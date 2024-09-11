let counter = {
  value: 0,
};

let loadDuration = 5;

// Check if dark mode is enabled
const isDarkMode = document.documentElement.classList.contains("dark-mode");

if (sessionStorage.getItem("visited") !== null) {
  loadDuration = 6;
  counter = {
    value: 75,
  };
}

sessionStorage.setItem("visited", "true");

function updateLoaderText() {
  console.log("pardner loading");
  let progress = Math.round(counter.value);
  if (progress < 100) {
    $(".text-loader").text(progress);
  } else {
    gsap.to(".text-loader", {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        $(".text-loader").text("open");
        gsap.to(".text-loader", {
          opacity: 1,
          duration: 0.5,
        });
      },
    });

    gsap.to(".loader_audio-prompt", {
      opacity: 1,
      duration: 1,
      ease: "power.out",
      delay: 1,
    });
    
    // Set display of .loader_button-link to block when the counter completes
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
