const pages=[
["١",["لا أعرف اسمي.","لا أعرف أين أنا، ولا من أين جئت.","أفتح عينيّ على ضوءٍ يملأ المكان. أغمضهما سريعاً، ثم أفتحهما من جديد.","أمامي سقف، ووجوه، وأصوات لا أفهمها.","لكنني أعرف شيئاً واحداً:","هناك وجهٌ أحبّه."]],
["٢",["لا أعرف أنه أمي. لا أعرف حتى معنى الأم.","لكن حين تقترب مني، أشعر بالأمان.","وحين تبتعد، أشعر بشيء يشبه الخوف.","أحرّك يدي أمام عيني.","أفتح أصابعي وأغلقها.","أكتشف أن هذا الشيء الصغير يتحرك حين أريده."]],
["٣",["أحاول أن أقف.","أسقط.","ثم أحاول ثانية.","لا أعرف معنى الفشل، ولذلك لا أخاف منه.","أبكي حين أجوع، وأضحك حين أشعر بالفرح.","لا أملك لغة، لكنني أملك كل المشاعر."]],
["٤",["كل شيء جديد.","الضوء جديد.","الصوت جديد.","الوجه جديد.","حتى يدي جديدة.","أنا لا أعرف أن هذا العالم كان موجوداً قبلي، ولا أعرف أنه سيستمر بعدي."]],
["٥",["بالنسبة إليّ، العالم يبدأ حين أفتح عينيّ…","وينتهي حين أغمضهما.","وفي الليل، حين أحاول النوم، لا أعرف أنني أبدأ أول ليلة من رحلة ستستمر ستين عاماً.","لا أعرف أن هذا الجسد الصغير سيكبر."]],
["٦",["ولا أعرف أن هذا الطفل الذي لا يعرف شيئاً عن الحياة سيعود يوماً، بعد ستين سنة، يبحث عن نفسه في ذاكرته.","أنا فقط أغمض عينيّ…","وأترك العالم يغيب.","وغداً، حين أفتحهما، سيولد العالم من جديد."]],
["٧",["وهكذا بدأت الحكاية.","ليس في اليوم الذي تعلمت فيه الكلام.","ولا في اليوم الذي عرفت فيه اسمي.","بل في اللحظة الأولى التي فتحت فيها عينيّ…","ورأيت العالم."]],
["٨",["وكان العالم، بالنسبة إليّ، كل شيء.","وربما لم يكن الطفل يعرف أن السؤال الذي بدأ معه سيبقى معه ستين عاماً:","ما هذا العالم؟","ومن أنا داخله؟"]]
];
let i=0;
const front=document.querySelector(".page-front"), inner=document.querySelector(".page-inner"), next=document.querySelector("#nextBtn"), prev=document.querySelector("#prevBtn"), bar=document.querySelector("#progressBar"), dots=document.querySelector("#dots"), book=document.querySelector("#book");
function render(n,animate=false){
 i=Math.max(0,Math.min(pages.length-1,n));
 if(animate){front.classList.add("turn");setTimeout(()=>{paint();front.classList.remove("turn")},260)}else paint();
}
function paint(){
 const [num,txt]=pages[i];
 inner.innerHTML='<div class="page-number">'+num+'</div>'+txt.map((p,k)=>'<p class="'+(k===txt.length-2&&i===0?'drop':'')+'">'+p+'</p>').join("");
 prev.disabled=i===0; next.disabled=i===pages.length-1;
 bar.style.width=((i+1)/pages.length*100)+"%";
 dots.innerHTML=pages.map((_,k)=>'<span class="dot '+(k===i?'active':'')+'"></span>').join("");
 document.title="ستون ليلة — الليلة الأولى — "+num;
}
function flip(dir){ if((dir>0&&i<pages.length-1)||(dir<0&&i>0)){render(i+dir,true); clickSound()} }
next.onclick=()=>flip(1); prev.onclick=()=>flip(-1);
document.querySelector("#startBtn").onclick=()=>document.querySelector("#reader").scrollIntoView({behavior:"smooth"});
document.querySelector("#shareBtn").onclick=async()=>{try{await navigator.share({title:"ستون ليلة — الليلة الأولى",text:"رحلة عمر في ستين ليلة.",url:location.href})}catch(e){await navigator.clipboard?.writeText(location.href);alert("تم نسخ رابط القراءة.")}};
let soundOn=true;
document.querySelector("#soundBtn").onclick=()=>{soundOn=!soundOn;document.querySelector("#soundBtn").style.opacity=soundOn?1:.4};
function clickSound(){if(!soundOn)return;const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const a=new A(),o=a.createOscillator(),g=a.createGain();o.type="triangle";o.frequency.value=170;g.gain.setValueAtTime(.0001,a.currentTime);g.gain.exponentialRampToValueAtTime(.025,a.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.12);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.13)}
let sx=0;book.addEventListener("touchstart",e=>sx=e.changedTouches[0].clientX,{passive:true});book.addEventListener("touchend",e=>{let dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)flip(dx<0?1:-1)},{passive:true});document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")flip(1);if(e.key==="ArrowRight")flip(-1)});
paint();