// Function to load a script by URL
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.defer = true; // Ensure this script is deferred
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadRippleAnimation() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Set size to be larger than the viewport dimensions
  const size = Math.max(viewportWidth, viewportHeight) * 2; // Adjust multiplier as needed

  // Apply GSAP animation to width and height
  gsap.to(".loading-ripple", {
    width: size + "px",  // Set width to the calculated size
    height: size + "px", // Set height to the calculated size
    duration: 8,
    delay: 0.5,
    ease: CustomEase.create("custom", "M0,0 C0.086,0.324 0.131,0.631 0.3,0.8 0.437,0.937 0.539,0.987 1,1 "),
    onStart: function() {
      // Ensure the circle stays centered while resizing
      gsap.set(".loading-ripple", {
        xPercent: -50, 
        yPercent: -50,
        top: "50%",
        left: "50%",
        position: "fixed"
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  // Cache DOM elements
  const loaderButton = document.querySelector('.loader_button-link');
  const sectionIntro = document.querySelector('#section_intro');
  const lightButton = document.querySelector(".light-button");
  const darkButton = document.querySelector(".dark-button");
  const modeToggleButton = document.querySelector('.mode-toggle-btn'); // Mode toggle button
  const audioButton = document.querySelector('.audio-btn'); // Audio mute button
  
  let ambientAudioLight = null;
  let ambientAudioDark = null;
  const defaultVolume = 0.6;

  let currentAudio = null; // Track the current playing audio
  let isMuted = false; // Track mute state

  // Utility function to check if dark mode is active
  function isDarkMode() {
    return document.documentElement.classList.contains('dark-mode');
  }

  // Lazy load the audio only when it's needed
  function loadAudio() {
    if (!ambientAudioLight) {
      ambientAudioLight = new Audio('https://audio.jukehost.co.uk/El4aSapa2J5MacOiuNeMf9QugdQbE6Qp');
      ambientAudioLight.loop = true;
      ambientAudioLight.volume = defaultVolume;
    }
    
    if (!ambientAudioDark) {
      ambientAudioDark = new Audio('https://audio.jukehost.co.uk/rkhIpQ2LQixuAJlDhsfBfs5vmpVfUCHk');
      ambientAudioDark.loop = true;
      ambientAudioDark.volume = defaultVolume;
    }
  }

  // Play the correct audio based on mode
  function switchMode(isDark) {
    if (isMuted) return; // Do not play audio if muted
    loadAudio(); // Ensure audio is loaded when switching modes
    
    const newAudio = isDark ? ambientAudioDark : ambientAudioLight;

    if (currentAudio !== newAudio) {
      if (currentAudio) {
        currentAudio.pause();
      }
      currentAudio = newAudio;
      currentAudio.currentTime = 0;
      currentAudio.volume = defaultVolume;
      currentAudio.play();
    }
  }

  // Handle loader button click (one-time event)
  loaderButton?.addEventListener('click', function() {
    switchMode(isDarkMode()); // Check mode before playing audio
  }, { once: true });

  // Debounced scroll event for better performance
  let scrollTimeout;
  function adjustAudioVolume() {
    const sectionTop = sectionIntro.offsetTop;
    const sectionBottom = sectionTop + sectionIntro.offsetHeight;
    const scrollY = window.scrollY + window.innerHeight / 2;

    if (scrollY >= sectionTop && scrollY <= sectionBottom) {
      const sectionProgress = (scrollY - sectionTop) / (sectionBottom - sectionTop);
      if (currentAudio) {
        currentAudio.volume = Math.max(0, defaultVolume * (1 - sectionProgress));
      }
    } else {
      if (currentAudio) {
        currentAudio.volume = scrollY < sectionTop ? defaultVolume : 0;
      }
    }
  }

  window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        adjustAudioVolume();
        scrollTimeout = null;
      }, 100); // Adjust debounce delay (100ms) for performance tuning
    }
  });

  // Mode switching buttons
  lightButton?.addEventListener('click', () => switchMode(false));
  darkButton?.addEventListener('click', () => switchMode(true));

  // Mute toggle button
  audioButton?.addEventListener('click', () => {
    isMuted = !isMuted; // Toggle mute state
    if (currentAudio) {
      currentAudio.muted = isMuted; // Mute/unmute the current audio
    }
  });

  // Add event listener to mode toggle button to detect changes
  modeToggleButton?.addEventListener('click', function() {
    // Add a small delay to ensure the mode is fully toggled before switching the audio
    setTimeout(() => switchMode(isDarkMode()), 100);
  });
});


// rj-logo position scroll trigger
document.addEventListener("DOMContentLoaded", function() {
  const logoWrapperDesktop = document.querySelector('.rj-logo_wrapper.is-hero.is-desktop');
  const triggerDiv = document.querySelector('.trigger-div');

  const togglePosition = (logoWrapper) => {
      const triggerRect = triggerDiv.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;

      

      // Trigger when the top of the trigger div is at or above the center of the viewport
      if (triggerRect.top <= viewportCenter) {
          
          logoWrapper.style.position = 'absolute';
          logoWrapper.style.top = `${triggerDiv.offsetTop - (logoWrapper.offsetHeight / 2)}px`; // Position it above the trigger div
          logoWrapper.style.left = '50%';
          logoWrapper.style.transform = 'translateX(-50%)';
          
      } else {
          console.log("Switching to fixed positioning");
          logoWrapper.style.position = 'fixed';
          logoWrapper.style.top = '50%';
          logoWrapper.style.left = '50%';
          logoWrapper.style.transform = 'translate(-50%, -50%)';
          
      }
  };

  const checkPositions = () => {
      if (logoWrapperDesktop) {
          togglePosition(logoWrapperDesktop);
      }
  };

  window.addEventListener('scroll', checkPositions);
  window.addEventListener('resize', checkPositions);
  checkPositions();
});



 // Function to unlock scrolling
    function unlockScroll() {
        document.querySelector('.scroll-unlock-component').style.overflow = 'visible';
    }

    // Function to handle button click with delay
    function handleButtonClick() {
        setTimeout(unlockScroll, 1200); // 1200ms delay
    }
        // Add event listeners to buttons
        document.querySelector('.light-button').addEventListener('click', handleButtonClick);
        document.querySelector('.dark-button').addEventListener('click', handleButtonClick);

// Add event listener to the button
document.querySelector(".loader_button-link").addEventListener("click", function() {
  loadRippleAnimation(); // Start the animation when the button is clicked
});

// Get the buttons and audio element
const lightButton = document.querySelector('.light-button');
const darkButton = document.querySelector('.dark-button');
const audioElement = document.getElementById('theme-audio');
const audioButton = document.querySelector('.audio-btn'); // Mute button

let audioPlayed = false; // Flag to ensure audio only plays once
let isMuted = false; // Track mute state

audioElement.volume = 0.6;

// Function to play the audio on the first button press
function playAudio() {
  if (!audioPlayed && !isMuted) { // Check if not muted
    audioElement.play();
    audioPlayed = true;
  }
}


// Mute toggle button functionality
audioButton.addEventListener('click', () => {
  isMuted = !isMuted; // Toggle mute state
  audioElement.muted = isMuted; // Mute/unmute the audio
});

// Add event listeners to both buttons
lightButton.addEventListener('click', playAudio);
darkButton.addEventListener('click', playAudio);

// INTRO WATER SCENE
$(document).ready(function() {
  // Check if the screen width is greater than a mobile breakpoint (e.g., 512px)
  if ($(window).width() > 991) {
  
    // Initialize the ripple effect when .section_intro scrolls into view
    new Waypoint({
      element: document.querySelector('.section_intro'),
      handler: function(direction) {
        if (direction === 'down') {
          
          // Remove the inline background image style
          document.getElementById("ripple-dark").style.backgroundImage = "";
    
          // Function to get the appropriate resolution and dropRadius based on the viewport width
          function getRippleSettings() {
            var width = $(window).width();
            if (width > 1920) {
              return { resolution: 768, dropRadius: 15 };
            } else if (width <= 1920 && width > 1280) {
              return { resolution: 512, dropRadius: 20 };
            } else {
              return { resolution: 256, dropRadius: 25 };
            }
          }
    
          // Get the settings based on the current viewport width
          var rippleSettings = getRippleSettings();
    
          // Initialize the ripple effect with dynamic resolution and dropRadius
          $('#ripple-light, #ripple-dark').ripples({
            resolution: rippleSettings.resolution,
            dropRadius: rippleSettings.dropRadius,
            perturbance: 0.005,
          });
    
          this.destroy(); // Remove the Waypoint after initializing the ripple effect
        }
      },
      offset: '70%' 
    });
    

    var dropTriggered = [false, false, false]; // Flags to check if drops have been triggered
    var audioTriggered = [false, false, false]; // Flags to prevent audio from playing multiple times

    // Audio files for each drop
    var audioDrop1 = new Audio('https://audio.jukehost.co.uk/LETjtyWoLFhSiLBaLOEQGWSUcEGs8VbR');
    var audioDrop2 = new Audio('https://audio.jukehost.co.uk/hVl07uG02YNOQ6IQL0RUiP6yDsJZJxaG');
    var audioDrop3 = new Audio('https://audio.jukehost.co.uk/AbDmKPNvkTmbN9CbGWmkcKIVEsGK2FSX');

    audioDrop1.volume = 0.4;
    audioDrop2.volume = 0.4;
    audioDrop3.volume = 0.4;

    let isMuted = false; // Track mute state

    // Function to create a drop effect
    function createDrop(elementId, x, y) {
      $(elementId).ripples('drop', x, y, 30, 0.3);
    }

    // Mute toggle button functionality
    document.addEventListener('DOMContentLoaded', () => {
      const audioButton = document.getElementById('audioButton');
      if (audioButton) {
        audioButton.addEventListener('click', () => {
          isMuted = !isMuted; // Toggle mute state
          audioDrop1.muted = isMuted;
          audioDrop2.muted = isMuted;
          audioDrop3.muted = isMuted;
        });
      }
    });

    // Waypoint for first drop
    new Waypoint({
      element: document.querySelector('.ripple-trigger.is-one'),
      handler: function(direction) {
        console.log("Triggered first drop"); // Debugging line
        if (!dropTriggered[0]) {
          setTimeout(function() {
            console.log("Creating first drop effect"); // Debugging line
            var rippleLightHeight = $('#ripple-light').height();
            var dropPositionY = rippleLightHeight * 0.34;
            var dropPositionX = $('#ripple-light').width() / 2;
    
            createDrop('#ripple-light', dropPositionX, dropPositionY);
            createDrop('#ripple-dark', dropPositionX, dropPositionY);
    
            dropTriggered[0] = true;
    
            if (!audioTriggered[0] && !isMuted) {
              audioDrop1.play();
              audioTriggered[0] = true;
            }
          }, 700);
        }
      },
      offset: '70%'
    });
    

    // Waypoint for second drop
    new Waypoint({
      element: document.querySelector('.ripple-trigger.is-two'),
      handler: function(direction) {
        if (!dropTriggered[1]) {
          setTimeout(function() {
            var rippleLightHeight = $('#ripple-light').height();
            var dropPositionY = rippleLightHeight * 0.58;
            var dropPositionX = $('#ripple-light').width() / 2;

            createDrop('#ripple-light', dropPositionX, dropPositionY);
            createDrop('#ripple-dark', dropPositionX, dropPositionY);

            dropTriggered[1] = true;

            if (!audioTriggered[1] && !isMuted) {
              audioDrop2.play();
              audioTriggered[1] = true;
            }
          }, 700);
        }
      },
      offset: '70%'
    });

    // Waypoint for third drop
    new Waypoint({
      element: document.querySelector('.ripple-trigger.is-three'),
      handler: function(direction) {
        if (!dropTriggered[2]) {
          setTimeout(function() {
            var rippleLightHeight = $('#ripple-light').height();
            var dropPositionY = rippleLightHeight * 0.82;
            var dropPositionX = $('#ripple-light').width() / 2;

            createDrop('#ripple-light', dropPositionX, dropPositionY);
            createDrop('#ripple-dark', dropPositionX, dropPositionY);

            dropTriggered[2] = true;

            if (!audioTriggered[2] && !isMuted) {
              audioDrop3.play();
              audioTriggered[2] = true;
            }
          }, 700);
        }
      },
      offset: '70%'
    });
  }
});


// Give unique IDs to each filter
$(".svg-filter").each(function (index) {
  $(this).parent().attr("style", "filter: url(#svg-filter-" + index + ");");
  $(this).find("filter").attr("id", "svg-filter-" + index);
});

// Function to detect mobile devices
function isMobileDevice() {
  return window.innerWidth <= 1024;  // Adjust width for tablet/mobile breakpoints
}

// Title scroll trigger for animating the filter effect
$(".title_wrapper").each(function (index) {
  let svg = $(this).find(".svg-filter");

  if (isMobileDevice()) {
    // Disable the filter for mobile devices by setting stdDeviation to 0
    svg.find("[stdDeviation]").attr("stdDeviation", "0 0");
  } else {
    // Desktop: animate the filter's stdDeviation value as you scroll
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top bottom",  // When the element comes into view
        end: "top 20%",       // When the element reaches 10% from the top
        scrub: true           // Smooth scrolling animation
      }
    });
    tl.fromTo(svg.find("[stdDeviation]"),
      { attr: { stdDeviation: 18 } }, // Start with a higher blur
      { attr: { stdDeviation: 0.5 } } // Reduce blur as you scroll
    );
  }
});

// Intro ripple scroll trigger
$(".ripple-trigger").each(function (index) {
  let svg = $(this).find(".svg-filter");

  if (isMobileDevice()) {
    // Disable filter for mobile by setting stdDeviation to 0
    svg.find("[stdDeviation]").attr("stdDeviation", "0 0");
  } else {
    // Set initial state: stdDeviation is 15
    gsap.set(svg.find("[stdDeviation]"), { attr: { stdDeviation: 15 } });

    // Animate the filter based on scroll position
    gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top 50%",    // Trigger when element is centered in the viewport
        end: "top 50%",      // Keep trigger action centered
        onEnter: () => {
          // Animate from stdDeviation 15 (blur) to 0 (clear) when entering
          gsap.to(svg.find("[stdDeviation]"), {
            attr: { stdDeviation: 0 },
            duration: 1.5,
            ease: "power1.out"
          });
        },
        onLeaveBack: () => {
          // Animate from stdDeviation 0 (clear) to 15 (blur) when scrolling back up
          gsap.to(svg.find("[stdDeviation]"), {
            attr: { stdDeviation: 15 },
            duration: 1.5,
            ease: "power1.out"
          });
        }
      }
    });
  }
});

// Image reflection loop for .project_grass-reflection_wrapper
$(".project_grass-reflection_wrapper").each(function (index) {
  let svg = $(this).find(".svg-filter");

  let tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: {
      duration: 20,
      ease: "sine.inOut"
    },
    scrollTrigger: {
      trigger: $(this),   // the element that triggers the animation
      start: "top 80%",   // when the top of the element reaches 80% of the viewport height
      toggleActions: "play none none none",  // play the animation when it enters the viewport
      once: false, // If you want it to trigger again on scroll up and down
      markers: false // Set to true if you want to debug ScrollTrigger
    }
  });

  tl.fromTo(svg.find("[baseFrequency]"),
    { attr: { baseFrequency: 0.01 } },
    { attr: { baseFrequency: 0.05 } });
});

// Image reflection loop for .about-me_image_reflection
$(".about-me_image_reflection").each(function (index) {
  let svg = $(this).find(".svg-filter");

  let tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: {
      duration: 20,
      ease: "sine.inOut"
    },
    scrollTrigger: {
      trigger: $(this),   // the element that triggers the animation
      start: "top 80%",   // when the top of the element reaches 80% of the viewport height
      toggleActions: "play none none none",  // play the animation when it enters the viewport
      once: false, // Ensures it triggers again on scroll
      markers: false // Set to true for debugging
    }
  });

  tl.fromTo(svg.find("[baseFrequency]"),
    { attr: { baseFrequency: 0.01 } },
    { attr: { baseFrequency: 0.05 } });
});

// Image reflection loop for .program_item_reflection
$(".program_item_reflection").each(function (index) {
  let svg = $(this).find(".svg-filter");

  let tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: {
      duration: 10,
      ease: "sine.inOut"
    },
    scrollTrigger: {
      trigger: $(this),   // the element that triggers the animation
      start: "top 80%",   // when the top of the element reaches 80% of the viewport height
      toggleActions: "play none none none",  // play the animation when it enters the viewport
      once: false, // Ensures it triggers again on scroll
      markers: false // Set to true for debugging
    }
  });

  tl.fromTo(svg.find("[baseFrequency]"),
    { attr: { baseFrequency: 0.01 } },
    { attr: { baseFrequency: 0.05 } });
});

 // Define the audio files
const prevAudio = new Audio('https://audio.jukehost.co.uk/UZpjpO66lhPtPE56NVTEQ3eXaofVtM4u');
const nextAudio = new Audio('https://audio.jukehost.co.uk/qo7Azou328cNF1JuK3P9f457QvG02n4p');

prevAudio.volume = 0.4;
nextAudio.volume = 0.4;

// Get the buttons
const prevButton = document.querySelector('.swiper-prev');
const nextButton = document.querySelector('.swiper-next');

// Play audio when the prev button is clicked, only if not muted
if (prevButton) {
  prevButton.addEventListener('click', () => {
    if (!isMuted) {  // Check if the audio is not muted
      prevAudio.play();
    }
  });
}

// Play audio when the next button is clicked, only if not muted
if (nextButton) {
  nextButton.addEventListener('click', () => {
    if (!isMuted) {  // Check if the audio is not muted
      nextAudio.play();
    }
  });
}

