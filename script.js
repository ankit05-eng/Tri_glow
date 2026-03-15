// ═══ STATE ═══
const S = {
  coins: +localStorage.getItem('tg_coins')||0,
  history: JSON.parse(localStorage.getItem('tg_hist')||'[]'),
  cart: JSON.parse(localStorage.getItem('tg_cart')||'[]'),
  user: JSON.parse(localStorage.getItem('tg_user')||'null'),
  discount: +localStorage.getItem('tg_disc')||0,
  rvStar: 0,
  chatOpen: false,
  tyMsgIdx: 0,
  reviewsCount: 5
};
const tyMessages = [
  '"We grow every mushroom with love and dedication. Your health is our mission. Thank you so much for choosing Triglow — it means the world to our family!" 🙏',
  '"From Amulya\'s planning, to Ankit\'s marketing, to Amit\'s farming — every mushroom is a team effort made with love just for you." 💚',
  '"From our small farm in Pokatunga, Angul, Odisha — to your kitchen table. Thank you for trusting us with your health and happiness!" 🍄',
  '"We started with nothing but a dream and one shed. Your support made Triglow what it is today. We are forever grateful!" 🌿'
];
function save(){ localStorage.setItem('tg_coins',S.coins); localStorage.setItem('tg_hist',JSON.stringify(S.history)); localStorage.setItem('tg_cart',JSON.stringify(S.cart)); localStorage.setItem('tg_user',JSON.stringify(S.user)); localStorage.setItem('tg_disc',S.discount); }

// ═══ CURSOR ═══
const dot=document.getElementById('cursorDot'),ring=document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function animC(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animC)})();
document.querySelectorAll('button,a,.pcard,.shr-btn,.ytc,.swc,.bro-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.width='52px';ring.style.height='52px'});
  el.addEventListener('mouseleave',()=>{ring.style.width='36px';ring.style.height='36px'});
});

// ═══ PARTICLES ═══
const cvs=document.getElementById('particleCanvas'),ctx2=cvs.getContext('2d');
function resizeCvs(){cvs.width=window.innerWidth;cvs.height=window.innerHeight}
resizeCvs(); window.addEventListener('resize',resizeCvs);
const pts=Array.from({length:55},()=>({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,r:Math.random()*2+.5,dx:(Math.random()-.5)*.35,dy:(Math.random()-.5)*.35,o:Math.random()*.45+.08}));
(function drawPts(){ctx2.clearRect(0,0,cvs.width,cvs.height);const dk=document.documentElement.getAttribute('data-theme')==='dark';pts.forEach(p=>{ctx2.beginPath();ctx2.arc(p.x,p.y,p.r,0,Math.PI*2);ctx2.fillStyle=dk?`rgba(165,214,167,${p.o})`:`rgba(46,125,50,${p.o})`;ctx2.fill();p.x+=p.dx;p.y+=p.dy;if(p.x<0||p.x>cvs.width)p.dx*=-1;if(p.y<0||p.y>cvs.height)p.dy*=-1});requestAnimationFrame(drawPts)})();

// ═══ DARK MODE ═══
let isDark=localStorage.getItem('tg_theme')==='dark';
function applyTheme(){document.documentElement.setAttribute('data-theme',isDark?'dark':'light');document.getElementById('darkToggle').innerHTML=isDark?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>';}
applyTheme();
document.getElementById('darkToggle').addEventListener('click',()=>{isDark=!isDark;localStorage.setItem('tg_theme',isDark?'dark':'light');applyTheme();});

// ═══ NAVBAR ═══
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{navbar.classList.toggle('scrolled',scrollY>40);document.getElementById('stb').classList.toggle('show',scrollY>300);updateSideNav();},{passive:true});
function toggleMob(){document.getElementById('mobMenu').classList.toggle('open')}
function goTo(sel){const el=document.querySelector(sel);if(el)el.scrollIntoView({behavior:'smooth'})}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});document.getElementById('mobMenu').classList.remove('open')}}));

// ═══ SIDE NAV ═══
function updateSideNav(){const secs=document.querySelectorAll('section[id]');let cur='';secs.forEach(s=>{if(scrollY>=s.offsetTop-120)cur=s.id});document.querySelectorAll('.sidenav a').forEach(a=>{a.style.background='';a.style.color='';if(a.getAttribute('href')==='#'+cur){a.style.background='var(--g)';a.style.color='#fff'}})}

// ═══ HERO COUNTER ═══
const cObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const el=e.target,t=+el.dataset.t;let c=0;const st=t/60,iv=setInterval(()=>{c=Math.min(c+st,t);el.textContent=Math.floor(c);if(c>=t)clearInterval(iv)},20);cObs.unobserve(el)}})},{threshold:.5});
document.querySelectorAll('.hcount').forEach(c=>cObs.observe(c));

// ═══ SCROLL REVEAL ═══
const rObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');rObs.unobserve(e.target)}})},{threshold:.1});
document.querySelectorAll('.pcard,.bcard,.rvc,.swc,.cti,.bro-card,.estep,.ytc').forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=(i%6)*55+'ms';rObs.observe(el)});

// ═══ PRODUCT FILTER ═══
document.querySelectorAll('.pfb').forEach(b=>b.addEventListener('click',function(){document.querySelectorAll('.pfb').forEach(x=>x.classList.remove('active'));this.classList.add('active');const f=this.dataset.f;document.querySelectorAll('.pcard').forEach(c=>c.style.display=(f==='all'||c.dataset.cat===f)?'flex':'none')}));

// ═══ SEARCH ═══
function doSearch(){const q=document.getElementById('searchInput').value.toLowerCase().trim();document.getElementById('noRes').style.display='none';document.querySelectorAll('.pfb').forEach(b=>b.classList.remove('active'));document.querySelector('.pfb[data-f="all"]').classList.add('active');if(!q){document.querySelectorAll('.pcard').forEach(c=>c.style.display='flex');return}goTo('#products');let found=0;document.querySelectorAll('.pcard').forEach(c=>{const show=c.innerText.toLowerCase().includes(q);c.style.display=show?'flex':'none';if(show)found++});if(!found)document.getElementById('noRes').style.display='block'}
document.getElementById('searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')doSearch()});

// ═══ FLOATING WINDOWS ═══
function openWin(id){document.querySelectorAll('.fwin').forEach(w=>{if(w.id!==id)w.classList.remove('open')});const w=document.getElementById(id);if(w){w.classList.toggle('open');if(id==='cartWin')renderCart();if(id==='coinsWin')renderCoinsWin()}}
function closeWin(id){const w=document.getElementById(id);if(w)w.classList.remove('open')}
function fwinOut(e,id){if(e.target===e.currentTarget)closeWin(id)}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.fwin').forEach(w=>w.classList.remove('open'));closeLb();if(S.chatOpen)toggleChat()}});

// ═══ AUTH ═══
function authSwitch(t){const lf=document.getElementById('loginForm'),sf=document.getElementById('signupForm'),al=document.getElementById('atbL'),as=document.getElementById('atbS');lf.style.display=t==='login'?'block':'none';sf.style.display=t==='signup'?'block':'none';al.classList.toggle('active',t==='login');as.classList.toggle('active',t==='signup')}
function doLogin(){const u=document.getElementById('liUser').value.trim(),p=document.getElementById('liPass').value.trim();if(!u||!p){toast('⚠️ Please fill in all fields');return}S.user={name:u};save();document.getElementById('navUser').textContent=u;closeWin('authWin');toast(`✅ Welcome back, ${u}! 🍄`)}
function doSignup(){const n=document.getElementById('suName').value.trim(),e=document.getElementById('suEmail').value.trim(),ph=document.getElementById('suPhone').value.trim(),p=document.getElementById('suPass').value.trim();if(!n||!e||!ph||!p){toast('⚠️ Please fill in all fields');return}S.user={name:n};S.coins+=50;addHist('🎁 Welcome Bonus',50);save();document.getElementById('navUser').textContent=n;closeWin('authWin');updateCoinsUI();toast(`🎉 Welcome, ${n}! +50 bonus coins earned! 🪙`)}

// ═══ CART ═══
function addToCart(name,price,emoji){const ex=S.cart.find(i=>i.name===name);if(ex)ex.qty++;else S.cart.push({name,price,emoji,qty:1});save();updateCartBadge();toast(`🛒 ${emoji} "${name}" added!`);const cb=document.querySelector('.cart-chip');cb.style.transform='scale(1.3)';setTimeout(()=>cb.style.transform='',280)}
function updateCartBadge(){document.getElementById('cartPip').textContent=S.cart.reduce((s,i)=>s+i.qty,0)}
function renderCart(){const ci=document.getElementById('cartItems'),ce=document.getElementById('cartEmpty'),cs=document.getElementById('cartSummary');ci.innerHTML='';if(!S.cart.length){ce.style.display='block';cs.style.display='none';return}ce.style.display='none';cs.style.display='block';let sub=0;const div=document.createElement('div');div.className='cart-items';S.cart.forEach((item,i)=>{sub+=item.price*item.qty;const r=document.createElement('div');r.className='cart-row';r.innerHTML=`<span class="cr-em">${item.emoji}</span><span class="cr-nm">${item.name}</span><div class="cr-qty"><button class="cqb" onclick="chQty(${i},-1)">−</button><span>${item.qty}</span><button class="cqb" onclick="chQty(${i},1)">+</button></div><span class="cr-pr">₹${item.price*item.qty}</span>`;div.appendChild(r)});ci.appendChild(div);document.getElementById('cSub').textContent='₹'+sub;const dr=document.getElementById('discRow'),da=document.getElementById('discAmt'),note=document.getElementById('csNote'),cd=Math.floor(S.coins/100)*5,total=Math.max(0,sub-(S.discount||0));document.getElementById('cTotal').textContent='₹'+total;if(S.discount>0){dr.style.display='flex';da.textContent='-₹'+S.discount}else dr.style.display='none';note.textContent=S.discount>0?`✅ ₹${S.discount} coin discount applied!`:(cd>0?`🪙 You have ${S.coins} coins = ₹${cd} discount available!`:'')}
function chQty(i,d){S.cart[i].qty+=d;if(S.cart[i].qty<=0)S.cart.splice(i,1);save();updateCartBadge();renderCart()}
function checkout(){if(!S.cart.length)return;const total=S.cart.reduce((s,i)=>s+i.price*i.qty,0)-(S.discount||0);if(S.discount>0)S.coins-=Math.floor(S.discount/5)*100;S.discount=0;S.cart=[];save();updateCartBadge();updateCoinsUI();closeWin('cartWin');toast(`🎉 Order placed for ₹${Math.max(0,total)}! Thank you for choosing Triglow! 🍄`)}

// ═══ COINS ═══
function shareOn(platform){const urls={whatsapp:'https://wa.me/?text='+encodeURIComponent('🍄 Check out Triglow — fresh organic mushrooms from Odisha! 🌿'),facebook:'https://www.facebook.com/sharer/sharer.php?u=https://triglow.in',instagram:'https://instagram.com',twitter:'https://twitter.com/intent/tweet?text='+encodeURIComponent('🍄 Fresh mushrooms from Triglow Farm, Odisha! 🌿 #Triglow'),telegram:'https://t.me/share/url?url=https://triglow.in'};window.open(urls[platform]||'#','_blank');S.coins+=10;addHist('📣 Shared on '+cap(platform),10);save();updateCoinsUI();toast(`🪙 +10 coins for sharing on ${cap(platform)}!`);coinBurst()}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function addHist(label,amount){S.history.unshift({label,amount,time:new Date().toLocaleTimeString()});if(S.history.length>20)S.history.pop()}
function updateCoinsUI(){document.getElementById('navCoins').textContent=S.coins;const wb=document.getElementById('walletNum');if(wb){wb.textContent=S.coins;document.getElementById('walletRs').textContent=(S.coins/100*5).toFixed(2);const p=S.coins%100;document.getElementById('cwFill').style.width=p+'%';document.getElementById('cwText').textContent=`${p}/100 to next ₹5`;const rb=document.getElementById('redeemBtn');if(rb)rb.disabled=S.coins<100}}
function redeemCoins(){if(S.coins<100){toast('⚠️ Need at least 100 coins');return}const d=Math.floor(S.coins/100)*5;S.discount=d;save();updateCoinsUI();toast(`✅ ₹${d} discount applied to cart! 🎉`);openWin('cartWin')}
function renderCoinsWin(){document.getElementById('cwinNum').textContent=S.coins;document.getElementById('cwinWorth').textContent=(S.coins/100*5).toFixed(2);const p=S.coins%100;document.getElementById('cwpFill').style.width=p+'%';document.getElementById('cwpText').textContent=`${p} / 100 coins`;const h=document.getElementById('cwinHist');h.innerHTML=!S.history.length?'<p class="ch-empty">No activity yet. Share to earn!</p>':S.history.map(x=>`<div class="ch-item"><span>${x.label}</span><span class="ch-earn">+${x.amount}🪙</span></div>`).join('')}
function coinBurst(){const el=document.createElement('div');el.style.cssText='position:fixed;top:50%;left:50%;z-index:9999;font-size:2.8rem;pointer-events:none;animation:cBurst .8s ease forwards';el.textContent='🪙';const st=document.createElement('style');st.textContent='@keyframes cBurst{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-160%) scale(2)}}';document.head.appendChild(st);document.body.appendChild(el);setTimeout(()=>el.remove(),850)}

// ═══ YOUTUBE ═══
function loadYT(ph,id){const iframe=document.createElement('iframe');iframe.src=`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;iframe.allowFullscreen=true;iframe.allow='accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture';iframe.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:none;';ph.parentElement.appendChild(iframe);ph.remove()}
function swapYT(id,title){const w=document.querySelector('.yt-wrap');w.innerHTML=`<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" style="position:absolute;inset:0;width:100%;height:100%;border:none;" allowfullscreen allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"></iframe>`;w.scrollIntoView({behavior:'smooth',block:'center'})}

// ═══ GALLERY LIGHTBOX ═══
function lb(emoji,cap){document.getElementById('lbEmoji').textContent=emoji;document.getElementById('lbCap').textContent=cap;document.getElementById('lbox').classList.add('open')}
function closeLb(){document.getElementById('lbox').classList.remove('open')}

// ═══ REVIEWS ═══
function rvFilter(f,btn){document.querySelectorAll('.rvfb').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.rvc').forEach(c=>{if(f==='all')c.style.display='block';else if(f==='verified')c.style.display=c.dataset.v==='1'?'block':'none';else c.style.display=c.dataset.s===f?'block':'none'})}
function likeRv(btn){btn.classList.toggle('liked');const span=btn.querySelector('span'),n=+span.textContent;span.textContent=btn.classList.contains('liked')?n+1:n-1}
function setRvStar(n){S.rvStar=n;document.querySelectorAll('#rvStars span').forEach((s,i)=>s.classList.toggle('lit',i<n))}
function postReview(){const name=document.getElementById('rvName').value.trim(),loc=document.getElementById('rvLoc').value.trim(),text=document.getElementById('rvText').value.trim();if(!name||!text){toast('⚠️ Name and review required');return}if(!S.rvStar){toast('⭐ Please select a star rating');return}const stars='★'.repeat(S.rvStar)+'☆'.repeat(5-S.rvStar);const colors=['#1565C0','#B71C1C','#1B5E20','#4A148C','#E65100','#00695C'];const col=colors[Math.floor(Math.random()*colors.length)];const card=document.createElement('div');card.className='rvc reveal visible';card.dataset.s=String(S.rvStar);card.dataset.v='0';card.innerHTML=`<div class="rvc-top"><div class="rvu" style="background:${col}">${name[0].toUpperCase()}</div><div><strong>${name}</strong><span>${loc||'Odisha'}</span></div></div><div class="rvc-stars">${stars}</div><p>"${text}"</p><div class="rvc-ft"><span>Just now</span><button class="rv-lk" onclick="likeRv(this)"><i class="fas fa-thumbs-up"></i> <span>0</span></button></div>`;document.getElementById('rvGrid').insertBefore(card,document.getElementById('rvGrid').firstChild);S.reviewsCount++;document.getElementById('rvCount').textContent=S.reviewsCount;S.coins+=5;addHist('⭐ Left a review',5);save();updateCoinsUI();document.getElementById('rvName').value='';document.getElementById('rvLoc').value='';document.getElementById('rvText').value='';setRvStar(0);S.rvStar=0;toast(`🙏 Thank you ${name}! +5 coins earned! 🪙`);spawnHearts()}

// ═══ CONTACT ═══
function sendMsg(){const n=document.getElementById('cfName').value.trim(),e=document.getElementById('cfEmail').value.trim(),m=document.getElementById('cfMsg').value.trim();if(!n||!e||!m){toast('⚠️ Please fill required fields');return}document.getElementById('cfName').value='';document.getElementById('cfEmail').value='';document.getElementById('cfPhone').value='';document.getElementById('cfMsg').value='';toast(`✅ Message sent! We'll reply soon, ${n} 🍄`)}

// ═══ THANK YOU ANIMATION ═══
const tyMsgs = [
  '"We grow every mushroom with love and dedication. Your health is our mission. Thank you so much for choosing Triglow — it means the world to our family!" 🙏',
  '"From Amulya\'s leadership, Ankit\'s passion, and Amit\'s farming — every mushroom is a team effort made with love just for you." 💚',
  '"From our small farm in Pokatunga, Angul, Odisha — to your kitchen table. Thank you for trusting us!" 🍄',
  '"We started with nothing but a dream. Your support made Triglow what it is today. Forever grateful!" 🌿'
];
function tyMsg(idx){S.tyMsgIdx=idx;const el=document.getElementById('tyMsg');el.style.opacity='0';setTimeout(()=>{el.textContent=tyMsgs[idx];el.style.opacity='1'},350);document.querySelectorAll('.tyd').forEach((d,i)=>d.classList.toggle('on',i===idx))}
let tyInterval=null;
function startTyRotation(){if(tyInterval)clearInterval(tyInterval);tyInterval=setInterval(()=>{const next=(S.tyMsgIdx+1)%tyMsgs.length;tyMsg(next)},4000)}

// Bubble rotation for cartoon
function rotateBubbles(){const msgs=[['Namaste! 🙏','Amulya here','Managing business!'],["Thank you! 🍄","Ankit – Founder","Share & earn coins!"],["Fresh Farm! 🌿","Amit here","Best mushrooms!"]];const ids=['tybb1','tybb2','tybb3'];let cycle=0;ids.forEach((id,i)=>{const el=document.getElementById(id);if(el){el.style.animation='none';void el.offsetWidth;el.innerHTML=`${msgs[i][0]}<br><b>${msgs[i][1]}</b>`;el.style.animation='bubPop .5s ease both'}});cycle++;return setInterval(()=>{ids.forEach((id,i)=>{const el=document.getElementById(id);if(el){el.style.animation='none';void el.offsetWidth;el.innerHTML=`${msgs[i][cycle%msgs[i].length]}<br><b>${i===0?'Amulya':i===1?'Ankit':'Amit'}</b>`;el.style.animation='bubPop .5s ease both'}});cycle++},3500)}

// ═══ HEARTS ANIMATION ═══
function spawnHearts(){const container=document.getElementById('tyHearts');for(let i=0;i<8;i++){setTimeout(()=>{const h=document.createElement('span');const hearts=['❤️','💚','🍄','✨','🌿','💛'];h.textContent=hearts[Math.floor(Math.random()*hearts.length)];h.style.cssText=`position:absolute;left:${10+Math.random()*80}%;bottom:0;font-size:${1.2+Math.random()*.8}rem;animation:heartFloat ${1.5+Math.random()*1}s ease forwards;pointer-events:none;`;document.head.appendChild(Object.assign(document.createElement('style'),{textContent:`@keyframes heartFloat{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-80px) scale(1.4) rotate(${Math.random()*40-20}deg)}}`}));container.appendChild(h);setTimeout(()=>h.remove(),2800)},i*150)}}

// ═══ AI CHATBOT ═══
const KB = {
  'mushroom|product|sell|buy': 'We sell: 🍄 Fresh White Button (₹45/250g), Premium Button (₹85/500g), 🫧 Oyster Mushroom (₹55/200g), 🍃 Milky Mushroom (₹65/250g), and 🧺 Family Combo Pack (₹160/1kg). All fresh from our farm daily!',
  'price|cost|rate|₹|rs': 'Our prices: Button 250g = ₹45 | Button 500g = ₹85 | Oyster 200g = ₹55 | Milky 250g = ₹65 | Family Combo 1kg = ₹160. All organic with amazing discounts!',
  'order|how to buy|purchase|shop': 'To order: 1️⃣ Browse Products section ↑ 2️⃣ Click the + button on any product 3️⃣ Open your Cart 🛒 4️⃣ Click Place Order! You can also call us: +91 XXXXX XXXXX.',
  'deliver|shipping|dispatch': 'We offer same-day delivery in Angul area! For other areas in Odisha, please call us at +91 XXXXX XXXXX. We dispatch fresh mushrooms every morning from Pokatunga!',
  'amulya': 'Amulya is the Elder Brother and Business Manager of Triglow. He handles all business operations, financial planning, supplier relationships and daily management. His leadership keeps the farm running profitably!',
  'ankit': 'Ankit is the Founder and Owner of Triglow! He also manages all Marketing — including social media, branding and customer outreach. He started Triglow from scratch and built this very website!',
  'amit': 'Amit is the Production Manager and youngest brother. He manages all cultivation at the Pokatunga farm — from substrate preparation, spawn inoculation, daily care, to final harvesting and quality checking. His hands grow every mushroom!',
  'brother|team|founder|family|who': 'Triglow is run by three brothers from Pokatunga, Angul, Odisha: 👨‍💼 Amulya (Business Manager) | 👨‍💻 Ankit (Owner & Marketing) | 👨‍🌾 Amit (Production Manager). Together they make Triglow the best mushroom farm in Odisha!',
  'coin|earn|reward|discount|redeem': 'Share Triglow on social media = +10 🪙 coins per share! Write a review = +5 coins. New signup = +50 bonus coins! Every 100 coins = ₹5 discount on your order. Click "Earn Coins" section to start!',
  'benefit|health|nutrition|protein|vitamin': 'Mushrooms are a superfood! 💪 High in protein (all amino acids) | ❤️ Heart healthy (potassium & fibre) | 🧠 Boosts immunity (beta-glucans) | ⚖️ Weight friendly | ☀️ Natural Vitamin D | 🌱 Zero chemicals. Great for vegetarians!',
  'organic|chemical|pesticide|natural': 'Yes! All Triglow mushrooms are 100% organic. We use substrate-based cultivation with absolutely NO pesticides or chemicals. Our mushrooms are grown in controlled environments for maximum purity and safety!',
  'farm|location|where|address|pokatunga|angul|odisha': 'Our farm is at Pokatunga, Bantala, Angul, Odisha — PIN 759129. Open Mon–Sat 7AM–7PM, Sunday 8AM–2PM. You can visit our farm anytime! Use Google Maps to find us.',
  'contact|phone|email|call|whatsapp': 'Contact us: 📞 +91 XXXXX XXXXX | 📧 triglow.farm@gmail.com | 📍 Pokatunga, Bantala, Angul, Odisha 759129. We are available Mon–Sat 7AM–7PM!',
  'youtube|video|watch|channel': 'Watch us on YouTube! 🎬 We post farm tours, harvesting videos, cultivation guides and behind-the-scenes content. Check the Watch section above and subscribe to our channel for weekly farm updates!',
  'social|instagram|facebook|post|feature': 'Order from us, receive your mushrooms, post a photo on Instagram or Facebook, tag @TriglowFarm and use #Triglow — we will feature you on our Customer Posts wall and send a special discount code!',
  'thank|great|awesome|good|love': 'Thank you so much! 🙏 Amulya, Ankit and Amit are truly grateful for your kind words and support. Your love keeps us going every single day! 🍄❤️',
  'hello|hi|hey|namaste': 'Hello! 👋 Welcome to Triglow! I\'m your AI assistant. Ask me about our products, prices, the three brothers, delivery, health benefits, coin rewards, or how to order. How can I help you? 🍄',
};
function getBotReply(msg){const m=msg.toLowerCase();for(const[keys,reply] of Object.entries(KB)){if(keys.split('|').some(k=>m.includes(k)))return reply}return "Thanks for your message! 🍄 I\'m not sure about that specific query. Please contact us directly at 📞 +91 XXXXX XXXXX or 📧 triglow.farm@gmail.com — Amulya, Ankit or Amit will personally help you!"}
function toggleChat(){S.chatOpen=!S.chatOpen;document.getElementById('chatWin').classList.toggle('open',S.chatOpen)}
function sendChat(){const inp=document.getElementById('chatIn'),msg=inp.value.trim();if(!msg)return;inp.value='';addChatMsg(msg,'user');const t=addTyping();setTimeout(()=>{t.remove();addChatMsg(getBotReply(msg),'bot')},700+Math.random()*500)}
function qChat(msg){document.getElementById('chatIn').value=msg;sendChat()}
function addChatMsg(text,who){const msgs=document.getElementById('chatMsgs'),d=document.createElement('div');d.className=`cmsg ${who}`;d.innerHTML=`<div class="cmsg-b">${text}</div>`;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d}
function addTyping(){const msgs=document.getElementById('chatMsgs'),d=document.createElement('div');d.className='cmsg bot';d.innerHTML='<div class="cmsg-b"><div class="typing-dots"><span></span><span></span><span></span></div></div>';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d}

// ═══ TOAST ═══
function toast(msg,dur=3200){const stack=document.getElementById('toastStack'),el=document.createElement('div');el.className='toast-item';el.textContent=msg;stack.appendChild(el);setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),350)},dur)}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded',()=>{
  if(S.user)document.getElementById('navUser').textContent=S.user.name;
  updateCoinsUI();updateCartBadge();
  startTyRotation();
  rotateBubbles();
  // Spawn hearts periodically in ty section
  const tyObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){spawnHearts();setInterval(spawnHearts,3500)}})},{threshold:.3});
  const tyS=document.getElementById('thankyou');if(tyS)tyObs.observe(tyS);
});
