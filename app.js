
let currentLang="ar";
const i18n={ar:{month:"شهر",year:"سنة",months3:"3 أشهر",months6:"6 أشهر",months12:"12 شهر",months15:"15 شهر",months24:"24 شهر",lifetime:"مدى الحياة",price:"سعر",name:"اسمك",details:"أي تفاصيل إضافية",according:"حسب الاتفاق"},fr:{month:"1 mois",year:"1 an",months3:"3 mois",months6:"6 mois",months12:"12 mois",months15:"15 mois",months24:"24 mois",lifetime:"À vie",price:"Prix",name:"Votre nom",details:"Détails supplémentaires",according:"Selon accord"},en:{month:"1 month",year:"1 year",months3:"3 months",months6:"6 months",months12:"12 months",months15:"15 months",months24:"24 months",lifetime:"Lifetime",price:"Price",name:"Your name",details:"Additional details",according:"By agreement"}};
function applyLang(){
 document.documentElement.lang=currentLang; document.documentElement.dir=currentLang==="ar"?"rtl":"ltr";
 document.querySelectorAll("[data-ar]").forEach(el=>{el.textContent=el.dataset[currentLang]||el.dataset.ar});
 const s=document.getElementById("search"); s.placeholder=s.dataset["placeholder-"+currentLang]||s.dataset["placeholder-ar"];
 document.getElementById("orderName").placeholder=i18n[currentLang].name; document.getElementById("orderNote").placeholder=i18n[currentLang].details;
 translateDurations();
}
document.getElementById("langBtn").onchange=e=>{currentLang=e.target.value;applyLang()};
function translateDurations(){document.querySelectorAll(".price span:first-child:not(.no-translate)").forEach(el=>{let t=el.textContent.trim();let k={"شهر":"month","1 شهر":"month","1 mois":"month","1 month":"month","سنة":"year","an":"year","1 an":"year","year":"year","1 year":"year","3 أشهر":"months3","3 mois":"months3","3 months":"months3","6 أشهر":"months6","6 mois":"months6","6 months":"months6","12 شهر":"months12","12 mois":"months12","12 months":"months12","15 شهر":"months15","15 mois":"months15","15 months":"months15","24 شهر":"months24","24 mois":"months24","24 months":"months24","مدى الحياة":"lifetime","Lifetime":"lifetime","À vie":"lifetime","سعر":"price","Prix":"price","Price":"price"}[t];if(k)el.textContent=i18n[currentLang][k]});}
function filterProducts(){let q=document.getElementById("search").value.toLowerCase().trim();document.querySelectorAll("#productGrid .product").forEach(x=>x.style.display=x.dataset.name.includes(q)?"flex":"none")}
function isNoDurationPlan(plan){
 const p=String(plan||"").trim().toLowerCase();
 return p.includes("idoom 4g");
}
function setOrderDurationVisibility(plan){
 const field=document.getElementById("orderDuration")?.closest(".field");
 if(field) field.style.display=isNoDurationPlan(plan)?"none":"";
}
function getOrderPrice(plan,dur){
 const wanted=String(plan).trim().toLowerCase();
 const card=[...document.querySelectorAll(".plan, #productGrid .product")].find(x=>{
   const title=x.querySelector("h3, b");
   return title?.textContent.trim().toLowerCase()===wanted;
 });
 if(!card)return "";
 const prices=[...card.querySelectorAll(".price")];
 if(!dur){return prices[0]?.querySelector("strong")?.textContent.trim()||""}
 const wantedDur=String(dur).trim().toLowerCase();
 const item=prices.find(x=>x.querySelector("span")?.textContent.trim().toLowerCase()===wantedDur);
 return item?.querySelector("strong")?.textContent.trim()||prices[0]?.querySelector("strong")?.textContent.trim()||"";
}
function updateOrderPrice(){
 const plan=document.getElementById("orderPlan")?.value||"";
 const dur=document.getElementById("orderDuration")?.value||"";
 const price=document.getElementById("orderPrice");
 if(price) price.value=getOrderPrice(plan,dur);
}
function openOrder(plan,durations){
 document.getElementById("orderPlan").value=plan;
 setOrderDurationVisibility(plan);
 const select=document.getElementById("orderDuration");
 if(Array.isArray(durations)&&durations.length){
   select.innerHTML="";
   durations.forEach(d=>{const o=document.createElement("option");o.textContent=d;select.appendChild(o)});
 }else{
   setOrderDurationsFromProduct(plan);
 }
 document.getElementById("orderModal").classList.add("show");
 updateOrderPrice();
 updatePaymentInstructions();
}
function openOrderFromProduct(button){const card=button.closest(".product");const name=card.querySelector("b")?.textContent.trim()||card.dataset.name;document.getElementById("orderPlan").value=name;setOrderDurationVisibility(name);const durations=[...card.querySelectorAll(".price span:first-child")].map(x=>x.textContent.trim());const select=document.getElementById("orderDuration");select.innerHTML="";if(durations.length){durations.forEach(d=>{const o=document.createElement("option");o.textContent=d;select.appendChild(o)})}else{const o=document.createElement("option");o.textContent=currentLang==="ar"?"حسب الاتفاق":"Selon accord";select.appendChild(o)}document.getElementById("orderModal").classList.add("show");updateOrderPrice()}
function setOrderDurationsFromProduct(plan){const card=[...document.querySelectorAll("#productGrid .product")].find(x=>{const b=x.querySelector("b");return b&&b.textContent.trim().toLowerCase()===plan.trim().toLowerCase()});if(!card)return;const durations=[...card.querySelectorAll(".price span:first-child")].map(x=>x.textContent.trim());const select=document.getElementById("orderDuration");select.innerHTML="";durations.forEach(d=>{const o=document.createElement("option");o.textContent=d;select.appendChild(o)})}
function closeOrder(){document.getElementById("orderModal").classList.remove("show")}

function updatePaymentInstructions(){
  const method=document.getElementById("orderPaymentMethod");
  const box=document.getElementById("paymentInstructions");
  if(!method||!box)return;
  const v=method.value;
  if(v==="ccp"){
    box.innerHTML=currentLang==="ar"
      ?"CCP: <b>41704125</b> — المفتاح: <b>81</b><br>بعد التحويل احتفظ بالوصل وتواصل معنا لتأكيد الطلب."
      :currentLang==="fr"
      ?"CCP : <b>41704125</b> — Clé : <b>81</b><br>Après le virement, gardez le reçu et contactez-nous pour confirmer."
      :"CCP: <b>41704125</b> — Key: <b>81</b><br>After the transfer, keep the receipt and contact us to confirm.";
  }else if(v==="baridi"){
    box.innerHTML=currentLang==="ar"
      ?"Baridi Mob: <b>00799999004170412580</b><br>بعد التحويل احتفظ بالوصل وتواصل معنا لتأكيد الطلب."
      :currentLang==="fr"
      ?"Baridi Mob : <b>00799999004170412580</b><br>Après le paiement, gardez le reçu et contactez-nous pour confirmer."
      :"Baridi Mob: <b>00799999004170412580</b><br>After payment, keep the receipt and contact us to confirm.";
  }else if(v==="chargily"){
    box.textContent=currentLang==="ar"
      ?"الدفع الإلكتروني الآمن عبر Chargily Pay. بعد الضغط على إرسال الطلب ستنتقل إلى صفحة الدفع."
      :currentLang==="fr"
      ?"Paiement électronique sécurisé via Chargily Pay. Après avoir envoyé la commande, vous serez redirigé vers la page de paiement."
      :"Secure online payment via Chargily Pay. After submitting the order, you will be redirected to the payment page.";
  }else{
    box.textContent=currentLang==="ar"?"الدفع عند الاستلام. سيتم تأكيد الطلب عبر واتساب."
      :currentLang==="fr"?"Paiement à la livraison. La commande sera confirmée via WhatsApp."
      :"Cash on delivery. The order will be confirmed via WhatsApp.";
  }
}
document.addEventListener("change",e=>{
  if(e.target && e.target.id==="orderPaymentMethod") updatePaymentInstructions();
  if(e.target && e.target.id==="orderDuration") updateOrderPrice();
});

async function startChargilyPayment(plan,dur,price,name,note){
  const amount=Number(String(price).replace(/[^0-9.]/g,""));
  if(!Number.isFinite(amount)||amount<=0){
    alert(currentLang==="ar"?"تعذر قراءة سعر الطلب.":currentLang==="fr"?"Impossible de lire le prix de la commande.":"Unable to read the order price.");
    return;
  }
  const endpoint=SUPABASE_URL+"/functions/v1/chargily-payment";
  try{
    const response=await fetch(endpoint,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "apikey":SUPABASE_ANON_KEY,
        "Authorization":"Bearer "+SUPABASE_ANON_KEY
      },
      body:JSON.stringify({amount:Math.round(amount)})
    });
    const data=await response.json();
    if(!response.ok || !data.checkout_url){
      console.error("Chargily payment error",data);
      throw new Error(data?.error||"Payment creation failed");
    }
    window.location.href=data.checkout_url;
  }catch(error){
    console.error(error);
    alert(currentLang==="ar"?"تعذر إنشاء عملية الدفع. حاول مرة أخرى.":currentLang==="fr"?"Impossible de créer le paiement. Réessayez.":"Could not create the payment. Please try again.");
  }
}

function sendOrder(){
 let plan=document.getElementById("orderPlan").value,dur=document.getElementById("orderDuration").value,price=document.getElementById("orderPrice")?.value||getOrderPrice(plan,dur),name=document.getElementById("orderName").value||"-",note=document.getElementById("orderNote").value||"-",payment=document.getElementById("orderPaymentMethod")?.value||"ccp";
 const noDuration=isNoDurationPlan(plan);
 if(payment==="chargily"){
   startChargilyPayment(plan,dur,price,name,note);
   return;
 }
 let msg=currentLang==="ar"?`السلام عليكم، أريد طلب:
الباقة: ${plan}${noDuration?"":"\nالمدة: "+dur}
السعر: ${price}
الاسم: ${name}
طريقة الدفع: ${payment==="ccp"?"CCP":"Baridi Mob"}
ملاحظة: ${note}`:currentLang==="fr"?`Bonjour, je souhaite commander:
Offre: ${plan}${noDuration?"":"\nDurée: "+dur}
Prix: ${price}
Nom: ${name}
Mode de paiement: ${payment==="ccp"?"CCP":"Baridi Mob"}
Note: ${note}`:`Hello, I would like to place an order:
Offer: ${plan}${noDuration?"":"\nDuration: "+dur}
Price: ${price}
Name: ${name}
Payment: ${payment==="ccp"?"CCP":"Baridi Mob"}
Note: ${note}`;
 window.open("https://wa.me/213797951989?text="+encodeURIComponent(msg),"_blank");
}
window.addEventListener("click",e=>{if(e.target.id==="orderModal")closeOrder()});
/* ===== Supabase reviews =====
   ضع بيانات مشروعك هنا من Supabase > Project Settings > API
   لا تستخدم service_role key داخل الموقع؛ استخدم Publishable/anon key فقط. */
const SUPABASE_URL = "https://klpjryycefmisisurpnw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gGrv8T2NuLTwGvMvido5hw_pUKQOzVm";

let selectedRating=0;
const likedReviewKey="zouhirhd_liked_reviews_v1";
function escapeReviewText(v){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function stars(n){n=Math.max(0,Math.min(5,Number(n)||0));return "★★★★★".slice(0,n)+"☆☆☆☆☆".slice(0,5-n)}
function supabaseReady(){return SUPABASE_URL.startsWith("http")&&!SUPABASE_URL.includes("PUT_YOUR")&&SUPABASE_ANON_KEY&&!SUPABASE_ANON_KEY.includes("PUT_YOUR")}
async function supabaseRequest(path,options={}){
  if(!supabaseReady()) throw new Error("Supabase configuration is missing");
  const headers={"apikey":SUPABASE_ANON_KEY,"Authorization":"Bearer "+SUPABASE_ANON_KEY,"Content-Type":"application/json","Accept":"application/json",...(options.headers||{})};
  const res=await fetch(SUPABASE_URL+"/rest/v1/"+path,{...options,headers});
  if(!res.ok){let msg=await res.text();throw new Error(msg||("HTTP "+res.status));}
  if(res.status===204 || res.status===205) return null;
  const text=await res.text();
  return text ? JSON.parse(text) : null;
}
async function loadReviews(){
  try{return await supabaseRequest("comments?select=id,created_at,name,comment,rating&order=created_at.desc");}
  catch(e){console.error("Supabase load reviews error:",e);return [];}
}
function setRating(n){selectedRating=n;document.querySelectorAll("#ratingInput button").forEach(b=>b.classList.toggle("active",Number(b.dataset.rating)<=n))}
document.querySelectorAll("#ratingInput button").forEach(b=>b.addEventListener("click",()=>setRating(Number(b.dataset.rating))));
async function addReview(){
  let n=document.getElementById("reviewName").value.trim(),t=document.getElementById("reviewText").value.trim();
  if(!n||!t||!selectedRating){alert("يرجى إدخال الاسم والتعليق واختيار التقييم.");return}
  if(!supabaseReady()){alert("لم يتم إعداد Supabase داخل الملف بعد. ضع SUPABASE_URL و SUPABASE_ANON_KEY في الكود.");return}
  const btn=document.querySelector('.review-form button[onclick="addReview()"]');
  if(btn){btn.disabled=true;btn.textContent="جاري النشر..."}
  try{
    await supabaseRequest("comments",{method:"POST",headers:{"Prefer":"return=minimal"},body:JSON.stringify({name:n.slice(0,40),comment:t.slice(0,500),rating:selectedRating})});
    document.getElementById("reviewName").value="";document.getElementById("reviewText").value="";setRating(0);
    await renderReviews();
    alert("تم نشر تقييمك بنجاح ⭐");
  }catch(e){console.error(e);alert("تعذر حفظ التقييم في Supabase. تأكد من RLS والسياسات ثم حاول مرة أخرى.");}
  finally{if(btn){btn.disabled=false;btn.textContent="نشر التقييم"}}
}
function getLikedReviews(){try{return JSON.parse(localStorage.getItem(likedReviewKey)||"[]")}catch(e){return[]}}
function toggleLike(id){let l=getLikedReviews();if(l.includes(id))return;l.push(id);localStorage.setItem(likedReviewKey,JSON.stringify(l));renderReviews()}
async function renderReviews(){
  let a=await loadReviews(),c=a.length,avg=c?a.reduce((x,r)=>x+Number(r.rating||0),0)/c:0;
  document.getElementById("reviewScore").textContent=avg.toFixed(1);document.getElementById("reviewStars").textContent=stars(Math.round(avg));document.getElementById("reviewCount").textContent=c;
  let l=getLikedReviews(),box=document.getElementById("reviewItems");
  if(!c){box.innerHTML='<div class="empty-reviews">لا توجد تقييمات بعد. كن أول من يشارك تجربته ⭐</div>';return}
  box.innerHTML=a.map(r=>{let d=new Date(r.created_at).toLocaleDateString("ar-DZ"),liked=l.includes(r.id);return `<div class="review-item"><div class="review-top"><div><span class="review-name">${escapeReviewText(r.name)}</span><div class="review-stars">${stars(Number(r.rating))}</div></div><span class="review-date">${d}</span></div><div class="review-text">${escapeReviewText(r.comment).replace(/\n/g,"<br>")}</div><button class="like-btn ${liked?"liked":""}" ${liked?"disabled":""} onclick="toggleLike(${r.id})">👍 ${liked?1:0}</button></div>`}).join("")
}
renderReviews();


// Downloader codes
const downloaderCodes = [{'name': 'DINO IBO', 'code': '7443806'},{"name":"KDmax Silver Android APK V3.5","code":"219264"},{"name":"KDmax Player Android APK V3.0","code":"867870"},{"name":"KDmax Pro Android APK V1.5","code":"558997"}, {'name': 'iron max', 'code': '347824'}, {'name': 'DINO VIP', 'code': '8374888'}, {'name': 'blue 4k ultra', 'code': '974504'}, {'name': 'DINO Active code', 'code': '908282'}, {'name': 'BLUE TV', 'code': '453645'}, {'name': '+ BLUE 4k', 'code': '1945877'}, {'name': 'BLUE PRO', 'code': '989805'}, {'name': 'BLUE 4K', 'code': '587678'}, {'name': 'Dar Stor', 'code': '994105'}, {'name': 'ES PRO TV MAX', 'code': '6113894'}, {'name': 'Dar Player', 'code': '207194'}, {'name': 'Dar Player (Old)', 'code': '552798'}, {'name': 'Dar Pro', 'code': '7824144'}, {'name': 'Dar Plus', 'code': '101651'}, {'name': 'Dar Mate', 'code': '1275750'}, {'name': 'Dar Go', 'code': '409601'}, {'name': 'Dar Super', 'code': '533598'}, {'name': 'Dar Smart', 'code': '970653'}, {'name': 'V12 MAX', 'code': '6404519'}, {'name': 'Dar Pro Max', 'code': '861844'}, {'name': 'Eagle 4k', 'code': '4809299'}, {'name': 'V12 Maxott Active code', 'code': '378164'}, {'name': 'Eagle 4k User - Pass Smarters', 'code': '495709'}, {'name': 'Eagle 4K Player 3.8', 'code': '237718'}, {'name': 'EAGLE_4K_Ott-activecode-V1.3.0', 'code': '282619'}, {'name': 'Eagle 4k Smarters Active Code', 'code': '208488'}, {'name': 'EAGLE IPTV(3.0).apk', 'code': '343182'}, {'name': 'Eagle active code stalker_ v1.1.apk', 'code': '853836'}, {'name': 'Tv_Stalker_V30.apk', 'code': '116417'}, {'name': 'EAGLE IPTV_user-pass.apk', 'code': '166927'}, {'name': 'EagleTv_Stalker_V30.apk', 'code': '116417'}, {'name': 'EAGLE_4K_V1.2.0', 'code': '921617'}, {'name': 'EAGLE 4k_Smarters-V3.0.1', 'code': '122547'}, {'name': 'Neo 4K Prime', 'code': '1213853'}, {'name': 'EagleTv_Platinum Active code_v3.5.8.apk', 'code': '955028'}, {'name': 'Neo 4K Plus', 'code': '8014414'}, {'name': 'Neo 4K Vip', 'code': '3424420'}, {'name': 'NEO 4K VOD', 'code': '9448097'}, {'name': 'NEO 4K PRO', 'code': '8692982'}, {'name': 'NEO 4K XC', 'code': '8320225'}, {'name': 'NEO 4K TiviMate', 'code': '6539657'}, {'name': 'Neo 4k P', 'code': '2100698'}, {'name': 'ORCA plus', 'code': '741298'}, {'name': 'Orca Pro plus', 'code': '699461'}, {'name': 'RedFoxx Pro', 'code': '7451056'}, {'name': 'RedFoxx 4K', 'code': '5290623'}, {'name': 'Megaott Smarters V5', 'code': '94065'}, {'name': 'MEGA IBO', 'code': '5042260'}, {'name': 'PLUS TV V3.8_ibo (UserPass)', 'code': '3029184'}, {'name': 'MEGA TIVI', 'code': '4264561'}, {'name': 'B1G Player', 'code': '5060514'}, {'name': 'PLUS TV V3_Smarters(ActiveCode)', 'code': '6525443'}, {'name': 'Promax TiViMate', 'code': '459878'}, {'name': 'B1G StbEmu', 'code': '4342542'}, {'name': 'Promax STB Emu stalker', 'code': '894834'}, {'name': 'Promax Smarters', 'code': '869196'}, {'name': 'KING365 V3', 'code': '283367'}, {'name': 'DLTA 4K NEW', 'code': '334600'}, {'name': '+Strong 8K Player Vip', 'code': '6883465'}, {'name': 'Strong 8K Player Prime', 'code': '1050263'}, {'name': 'Strong 8K Player vip', 'code': '405663'}, {'name': 'Strong 8K Player Plus', 'code': '1240465'}, {'name': '8k Player vip', 'code': '439873'}, {'name': 'Strong 8K Fast 8k Player', 'code': '948558'}, {'name': 'Strong 4k 6.2', 'code': '726885'}, {'name': 'Strong 4k', 'code': '695473'}, {'name': 'Promax Mac Edition', 'code': '965262'}, {'name': 'Promax STB Only', 'code': '541003'}, {'name': 'Temu ViP PRO', 'code': '7594862'}, {'name': 'Promax Ibo Edition', 'code': '921397'}, {'name': 'Temu ViP XC', 'code': '3114361'}, {'name': 'Temu ViP V6', 'code': '8305122'}, {'name': 'DLTA INTRO V4', 'code': '265593'}, {'name': 'DLTA XC TV', 'code': '623201'}, {'name': 'TREX PRO', 'code': '8206369'}, {'name': 'Strong 8K Power', 'code': '109173'}, {'name': 'TREX IBO', 'code': '8571260'}, {'name': 'TREX VIP', 'code': '3668373'}, {'name': 'Trex STALKER/STB', 'code': '5335157'}, {'name': 'Trex PLATINIUM 4K', 'code': '4907473'}, {'name': 'Trex IPTV SMARTER', 'code': '5563604'}, {'name': 'Trex XCIPTV', 'code': '2094883'}, {'name': 'ULTRA8K XC', 'code': '4923851'}, {'name': 'ULTRA8K IBO', 'code': '4927309'}, {'name': 'Pluton+ V4 THEME 3D COSMIC COBALT', 'code': '6705758'}, {'name': 'Ultra8k UserPass', 'code': '9631999'}, {'name': 'Smarter Pluton-Ott', 'code': '8020563'}, {'name': 'Pluton+ V4 THEME BLACK / DAINTREE', 'code': '9091863'}, {'name': 'Pluton-ott Old version', 'code': '5670494'}, {'name': 'TVMITE Pluton-Ott', 'code': '209852'}, {'name': 'INFINITY OTT PLAYER V3.0.2', 'code': '322246'}, {'name': '8K PRO', 'code': '8988162'}, {'name': 'INFINITY V IBO', 'code': '7308696'}, {'name': 'INFINITY VU PLAYER PRO', 'code': '218533'}, {'name': 'Bob Player', 'code': '815778'}, {'name': 'ATLAS PRO 4.0.2', 'code': '8465095'}, {'name': 'IBO PLAYER PRO', 'code': '923441'}, {'name': 'IBO PLAYER', 'code': '1171959'}, {'name': 'iboss iptv', 'code': '967528'}, {'name': 'King4kPlayer', 'code': '862414'}, {'name': 'Hot Player', 'code': '395800'}, {'name': 'IBo Xplayer', 'code': '991372'}, {'name': 'Revolut Player', 'code': '5097293'}, {'name': 'Relax Player', 'code': '1459769'}, {'name': 'Netfly for Mobile', 'code': '6001502'}, {'name': 'Arox vod', 'code': '5046642'}, {'name': 'Netfly for TV', 'code': '6375545'}];
function normalizeDownloader(v){return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"").trim()}
function renderDownloader(q=""){const box=document.getElementById("downloaderResults"),count=document.getElementById("downloaderCount");if(!box)return;const query=normalizeDownloader(q);const matches=query?downloaderCodes.filter(x=>normalizeDownloader(x.name).includes(query)):[];if(!query){box.innerHTML='<div class="downloader-empty">اكتب اسم التطبيق للبحث عن الكود.</div>';count.textContent="";return}if(!matches.length){box.innerHTML='<div class="downloader-empty">لم يتم العثور على التطبيق. تأكد من الاسم وحاول مرة أخرى.</div>';count.textContent="";return}count.textContent=`تم العثور على ${matches.length} نتيجة`;box.innerHTML=matches.map(x=>`<div class="downloader-result"><b>${x.name}</b><span class="downloader-code">${x.code}</span></div>`).join("")}
const downloaderSearch=document.getElementById("downloaderSearch");if(downloaderSearch){downloaderSearch.addEventListener("input",e=>renderDownloader(e.target.value));}

applyLang();



/* ===== Page views =====
   Uses the page_views table created with your SQL. */
async function updateSiteViews(){
  const countEl=document.getElementById("siteViewsCount");
  if(!countEl || typeof supabaseRequest!=="function" || !supabaseReady()) return;

  try{
    const rows=await supabaseRequest("page_views?page=eq.home&select=page,views");
    let current=Array.isArray(rows)&&rows.length ? Number(rows[0].views||0) : 0;

    if(!Array.isArray(rows)||!rows.length){
      await supabaseRequest("page_views",{method:"POST",headers:{"Prefer":"return=minimal"},body:JSON.stringify({page:"home",views:0})});
      current=0;
    }

    const next=current+1;
    await supabaseRequest("page_views?page=eq.home",{method:"PATCH",headers:{"Prefer":"return=minimal"},body:JSON.stringify({views:next})});
    countEl.textContent=next.toLocaleString("ar-DZ");
  }catch(e){
    console.error("Supabase page views error:",e);
    try{
      const rows=await supabaseRequest("page_views?page=eq.home&select=views");
      const current=Array.isArray(rows)&&rows.length ? Number(rows[0].views||0) : 0;
      countEl.textContent=current.toLocaleString("ar-DZ");
    }catch(_){}
  }
}
document.addEventListener("DOMContentLoaded",updateSiteViews);
