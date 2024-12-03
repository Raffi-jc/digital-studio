const loadDuration = sessionStorage.getItem("visited") ? 4 : 6,
    counter = { value: sessionStorage.getItem("visited") ? 50 : 0 };
sessionStorage.setItem("visited", "true");

const $textLoader = $(".text-loader"),
    $loaderButtonLink = $(".loader_button-link"),
    $loaderAudioPrompt = $(".loader_audio-prompt");

const updateLoaderText = () => {
    let t = Math.round(counter.value);
    if (t <= 100 && $textLoader.text() !== t.toString()) $textLoader.text(t);
    if (t === 100) {
        gsap.timeline()
            .to($textLoader, { opacity: 0, duration: 0.5, delay: 0.5 })
            .add(() => $textLoader.text("open"))
            .to($textLoader, { opacity: 1, duration: 0.5 })
            .to($loaderAudioPrompt, { opacity: 1, duration: 0.5, ease: "power.out" })
            .to($loaderButtonLink, { display: "block", duration: 0.5, ease: "power.out" });
    }
};

const tl = gsap.timeline();

function loadRippleAnimation() {
    let t,
        e = 2 * Math.max(window.innerWidth, window.innerHeight);
    gsap.to(".loading-ripple", {
        width: e + "px",
        height: e + "px",
        duration: 8,
        delay: 0.5,
        ease: CustomEase.create(
            "custom",
            "M0,0 C0.086,0.324 0.131,0.631 0.3,0.8 0.437,0.937 0.539,0.987 1,1 "
        ),
        onStart: function () {
            gsap.set(".loading-ripple", {
                xPercent: -50,
                yPercent: -50,
                top: "50%",
                left: "50%",
                position: "fixed",
            });
        },
    });
}

tl.to(counter, { onUpdate: updateLoaderText, value: 100, duration: loadDuration, ease: "power.out" })
    .to(".loader_progress", { transform: "translate(-4%, 20%)", duration: loadDuration, ease: "power.out" }, 0);

document.querySelector(".loader_button-link").addEventListener("click", function () {
    loadRippleAnimation();
});

// Programmatically trigger a resize event to fix the issue
window.dispatchEvent(new Event('resize'));
