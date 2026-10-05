const totalStoryPages = 15;
const pages = Array.from({length: totalStoryPages}, (_,i) => "./story/" + String(i+1).padStart(2,"0") + ".txt");

let current = 0;
const page = document.querySelector("#storyPage");
const next = document.querySelector("#nextBtn");
const prev = document.querySelector("#prevBtn");
const progress = document.querySelector("#progressBar");
const counter = document.querySelector("#pageCounter");
const dots = document.querySelector("#dots");
const book = document.querySelector("#book");
const cache = {};

async function getPage(n){
  if(cache[n]) return cache[n];
  const r = await fetch(pages[n]);
  cache[n] = await r.text();
  return cache[n];
}

async function paint(direction=0){
  page.classList.remove("enter-left","enter-right");
  void page.offsetWidth;
  if(direction>0) page.classList.add("enter-left");
  if(direction<0) page.classList.add("enter-right");

  if(current === totalStoryPages){
    page.innerHTML = '<div class="end-page"><span class="small-label">نهاية الليلة الأولى</span><h3>وهكذا بدأت الحكاية.</h3><p>في الليلة التالية، نقترب خطوة أخرى من الطفل الذي بدأ يكتشف العالم.</p><a href="#reader" class="text-link">الليلة الثانية قريباً ←</a></div>';
    counter.textContent = "النهاية";
  }else{
    const text = await getPage(current);
    page.innerHTML = '<div class="page-number">'+(current+1)+'</div><div class="story-text">'+text.split("\n\n").map(p=>"<p>"+p+"</p>").join("")+'</div>';
    counter.textContent = (current+1) + " / " + totalStoryPages;
  }
  prev.disabled = current===0;
  next.disabled = current===totalStoryPages;
  progress.style.width = (((current+1)/(totalStoryPages+1))*100)+"%";
  dots.innerHTML = Array.from({length:totalStoryPages+1},(_,i)=>'<span class="dot '+(i===current?"active":"")+'"></span>').join("");
  document.title = current===totalStoryPages ? "ستون ليلة — نهاية الليلة الأولى" : "ستون ليلة — الليلة الأولى — "+(current+1);
}

async function move(step){
  const target=current+step;
  if(target<0 || target>totalStoryPages) return;
  current=target;
  await paint(step);
  clickSound();
}
next.onclick=()=>move(1);
prev.onclick=()=>move(-1);

document.querySelector("#startBtn").onclick=()=>document.querySelector("#reader").scrollIntoView({behavior:"smooth",block:"start"});
document.querySelector("#shareBtn").onclick=async()=>{try{await navigator.share({title:"ستون ليلة — الليلة الأولى",text:"رحلة عمر في ستين ليلة.",url:location.href})}catch(e){try{await navigator.clipboard.writeText(location.href);alert("تم نسخ رابط القراءة.")}catch(_){} }};
let soundOn=true;
document.querySelector("#soundBtn").onclick=()=>{soundOn=!soundOn;document.querySelector("#soundBtn").style.opacity=soundOn?1:.4};
function clickSound(){if(!soundOn)return;const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const a=new A(),o=a.createOscillator(),g=a.createGain();o.type="triangle";o.frequency.value=170;g.gain.setValueAtTime(.0001,a.currentTime);g.gain.exponentialRampToValueAtTime(.025,a.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.12);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.13)}
let sx=0;
book.addEventListener("touchstart",e=>sx=e.changedTouches[0].clientX,{passive:true});
book.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)move(dx<0?1:-1)},{passive:true});
document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")move(1);if(e.key==="ArrowRight")move(-1)});
paint();