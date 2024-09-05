let counter = {
  value: 0,
};

let loadDuration = 5;

if (sessionStorage.getItem("visited") !== null) {
  loadDuration = 2;
  counter = {
    value: 75,
  };
}

sessionStorage.setItem("visited", "true");

function updateLoaderText() {
  let progress = Math.round(counter.value);
  if (progress < 100) {
    $(".text-loader").text(progress);
  } else {
    gsap.to(".text-loader", {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        $(".text-loader").text("enter");
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
    transform: "translate(-4%, 29%)",
    duration: loadDuration,
    ease: "power.out",
  },
  0,
);
