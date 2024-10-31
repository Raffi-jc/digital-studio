function loadScript(e){return new Promise((t,i)=>{let n=document.createElement("script");n.src=e,n.defer=!0,n.onload=t,n.onerror=i,document.head.appendChild(n)})}function loadRippleAnimation(){let e=window.innerWidth,t=window.innerHeight,i=2*Math.max(e,t);gsap.to(".loading-ripple",{width:i+"px",height:i+"px",duration:8,delay:.5,ease:CustomEase.create("custom","M0,0 C0.086,0.324 0.131,0.631 0.3,0.8 0.437,0.937 0.539,0.987 1,1 "),onStart:function(){gsap.set(".loading-ripple",{xPercent:-50,yPercent:-50,top:"50%",left:"50%",position:"fixed"})}})}function unlockScroll(){document.querySelector(".scroll-unlock-component").style.overflow="visible"}function handleButtonClick(){setTimeout(unlockScroll,1200)}document.addEventListener("DOMContentLoaded",function(){let e=document.querySelector(".loader_button-link"),t=document.querySelector("#section_intro"),i=document.querySelector(".light-button"),n=document.querySelector(".dark-button"),o=document.querySelector(".mode-toggle-btn"),r=document.querySelector(".audio-btn"),l=null,u=null,d=null,a=!1;function s(){return document.documentElement.classList.contains("dark-mode")}function c(e){if(a)return;l||((l=new Audio("https://audio.jukehost.co.uk/El4aSapa2J5MacOiuNeMf9QugdQbE6Qp")).loop=!0,l.volume=.6),u||((u=new Audio("https://audio.jukehost.co.uk/rkhIpQ2LQixuAJlDhsfBfs5vmpVfUCHk")).loop=!0,u.volume=.6);let t=e?u:l;d!==t&&(d&&d.pause(),(d=t).currentTime=0,d.volume=.6,d.play())}e?.addEventListener("click",function(){c(s())},{once:!0});let p;window.addEventListener("scroll",function(){p||(p=setTimeout(()=>{(function e(){let i=t.offsetTop,n=i+t.offsetHeight,o=window.scrollY+window.innerHeight/2;o>=i&&o<=n?d&&(d.volume=Math.max(0,.6*(1-(o-i)/(n-i)))):d&&(d.volume=o<i?.6:0)})(),p=null},100))}),i?.addEventListener("click",()=>c(!1)),n?.addEventListener("click",()=>c(!0)),r?.addEventListener("click",()=>{a=!a,d&&(d.muted=a)}),o?.addEventListener("click",function(){setTimeout(()=>c(s()),100)})}),document.addEventListener("DOMContentLoaded",function(){let e=document.querySelector(".rj-logo_wrapper.is-hero.is-desktop, .rj-logo-overflow"),t=document.querySelector(".trigger-div"),i=e=>{let i=t.getBoundingClientRect(),n=window.innerHeight/2;i.top<=n?(e.style.position="absolute",e.style.top=`${t.offsetTop-e.offsetHeight/2}px`,e.style.left="50%",e.style.transform="translateX(-50%)"):(e.style.position="fixed",e.style.top="50%",e.style.left="50%",e.style.transform="translate(-50%, -50%)")},n=()=>{e&&i(e)};window.addEventListener("scroll",n),window.addEventListener("resize",n),n()}),document.querySelector(".light-button").addEventListener("click",handleButtonClick),document.querySelector(".dark-button").addEventListener("click",handleButtonClick),document.querySelector(".loader_button-link").addEventListener("click",function(){loadRippleAnimation()});const lightButton=document.querySelector(".light-button"),darkButton=document.querySelector(".dark-button"),audioElement=document.getElementById("theme-audio"),audioButton=document.querySelector(".audio-btn");let audioPlayed=!1,isMuted=!1;function playAudio(){audioPlayed||isMuted||(audioElement.play(),audioPlayed=!0)}function isMobileDevice(){return window.innerWidth<=1024}audioElement.volume=.6,audioButton.addEventListener("click",()=>{isMuted=!isMuted,audioElement.muted=isMuted}),lightButton.addEventListener("click",playAudio),darkButton.addEventListener("click",playAudio),$(document).ready(function(){if($(window).width()>991){new Waypoint({element:document.querySelector(".section_intro"),handler:function(e){if("down"===e){var t,i=(t=$(window).width())>1920?{resolution:512,dropRadius:15}:t<=1920&&t>1280?{resolution:256,dropRadius:20}:{resolution:128,dropRadius:25};$("#ripple-light, #ripple-dark").ripples({resolution:i.resolution,dropRadius:i.dropRadius,perturbance:.005}),this.destroy()}},offset:"70%"});var e=[!1,!1,!1],t=[!1,!1,!1],i=new Audio("https://audio.jukehost.co.uk/LETjtyWoLFhSiLBaLOEQGWSUcEGs8VbR"),n=new Audio("https://audio.jukehost.co.uk/hVl07uG02YNOQ6IQL0RUiP6yDsJZJxaG"),o=new Audio("https://audio.jukehost.co.uk/AbDmKPNvkTmbN9CbGWmkcKIVEsGK2FSX");i.volume=.4,n.volume=.4,o.volume=.4;let r=!1;function l(e,t,i){$(e).ripples("drop",t,i,30,.3)}document.addEventListener("DOMContentLoaded",()=>{let e=document.getElementById("audioButton");e&&e.addEventListener("click",()=>{r=!r,i.muted=r,n.muted=r,o.muted=r})}),new Waypoint({element:document.querySelector(".ripple-trigger.is-one"),handler:function(n){console.log("Triggered first drop"),e[0]||setTimeout(function(){console.log("Creating first drop effect");var n=.34*$("#ripple-light").height(),o=$("#ripple-light").width()/2;l("#ripple-light",o,n),l("#ripple-dark",o,n),e[0]=!0,t[0]||r||(i.play(),t[0]=!0)},700)},offset:"70%"}),new Waypoint({element:document.querySelector(".ripple-trigger.is-two"),handler:function(i){e[1]||setTimeout(function(){var i=.58*$("#ripple-light").height(),o=$("#ripple-light").width()/2;l("#ripple-light",o,i),l("#ripple-dark",o,i),e[1]=!0,t[1]||r||(n.play(),t[1]=!0)},700)},offset:"70%"}),new Waypoint({element:document.querySelector(".ripple-trigger.is-three"),handler:function(i){e[2]||setTimeout(function(){var i=.82*$("#ripple-light").height(),n=$("#ripple-light").width()/2;l("#ripple-light",n,i),l("#ripple-dark",n,i),e[2]=!0,t[2]||r||(o.play(),t[2]=!0)},700)},offset:"70%"})}}),$(".svg-filter").each(function(e){$(this).parent().attr("style","filter: url(#svg-filter-"+e+");"),$(this).find("filter").attr("id","svg-filter-"+e)}),$(".title_wrapper").each(function(e){let t=$(this).find(".svg-filter");isMobileDevice()?t.find("[stdDeviation]").attr("stdDeviation","0 0"):gsap.timeline({scrollTrigger:{trigger:$(this),start:"top bottom",end:"top 20%",scrub:!0}}).fromTo(t.find("[stdDeviation]"),{attr:{stdDeviation:18}},{attr:{stdDeviation:.5}})}),$(".ripple-trigger").each(function(e){let t=$(this).find(".svg-filter");isMobileDevice()?t.find("[stdDeviation]").attr("stdDeviation","0 0"):(gsap.set(t.find("[stdDeviation]"),{attr:{stdDeviation:15}}),gsap.timeline({scrollTrigger:{trigger:$(this),start:"top 50%",end:"top 50%",onEnter(){gsap.to(t.find("[stdDeviation]"),{attr:{stdDeviation:0},duration:1.5,ease:"power1.out"})},onLeaveBack(){gsap.to(t.find("[stdDeviation]"),{attr:{stdDeviation:15},duration:1.5,ease:"power1.out"})}}}))}),$(".project_grass-reflection_wrapper").each(function(e){let t=$(this).find(".svg-filter");gsap.timeline({repeat:-1,yoyo:!0,defaults:{duration:20,ease:"sine.inOut"},scrollTrigger:{trigger:$(this),start:"top 80%",toggleActions:"play none none none",once:!1,markers:!1}}).fromTo(t.find("[baseFrequency]"),{attr:{baseFrequency:.01}},{attr:{baseFrequency:.05}})}),$(".about-me_image_reflection").each(function(e){let t=$(this).find(".svg-filter");gsap.timeline({repeat:-1,yoyo:!0,defaults:{duration:20,ease:"sine.inOut"},scrollTrigger:{trigger:$(this),start:"top 80%",toggleActions:"play none none none",once:!1,markers:!1}}).fromTo(t.find("[baseFrequency]"),{attr:{baseFrequency:.01}},{attr:{baseFrequency:.05}})});const prevAudio=new Audio("https://audio.jukehost.co.uk/UZpjpO66lhPtPE56NVTEQ3eXaofVtM4u"),nextAudio=new Audio("https://audio.jukehost.co.uk/qo7Azou328cNF1JuK3P9f457QvG02n4p");prevAudio.volume=.4,nextAudio.volume=.4;const prevButton=document.querySelector(".swiper-prev"),nextButton=document.querySelector(".swiper-next");prevButton&&prevButton.addEventListener("click",()=>{isMuted||prevAudio.play()}),nextButton&&nextButton.addEventListener("click",()=>{isMuted||nextAudio.play()});
