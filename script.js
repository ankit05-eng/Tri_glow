/* ══════════════════════════════════════
   TRIGLOW – Advanced JS
   All Features: Loader, Cursor, Cart,
   Coins, AI Bot, Cartoon, YouTube, etc.
══════════════════════════════════════ */

// ═══ STATE ═══
let state = {
  coins: parseInt(localStorage.getItem('tg_coins') || '0'),
  coinHistory: JSON.parse(localStorage.getItem('tg_coinHistory') || '[]'),
  cart: JSON.parse(localStorage.getItem('tg_cart') || '[]'),
  user: JSON.parse(localStorage.getItem('tg_user') || 'null'),
  coinDiscount: parseFloat(localStorage.getItem('tg_discount') || '0'),
  reviewRating: 0,
  chatOpen: false,
  reviewsOffset: 0,
};

function saveState() {
  localStorage.setItem('tg_coins', state.coins);
  localStorage.setItem('tg_coinHistory', JSON.stringify(state.coinHistory));
  localStorage.setItem('tg_cart', JSON.stringify(state.cart));
  localStorage.setItem('tg_user', JSON.stringify(state.user));
  localStorage.setItem('tg_discount', state.coinDiscount);
}



// ═══ CURSOR ═══
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
function animateCursor() {
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('button,a,.pcard,.share-btn,.yt-card').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width = '56px'; ring.style.height = '56px'; ring.style.borderColor = 'var(--g)'; });
  el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.borderColor = 'var(--gl)'; });
});

// ═══ DARK MODE ═══
const html = document.documentElement;
let isDark = localStorage.getItem('tg_theme') === 'dark';
applyTheme();
function applyTheme() {
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const btn = document.getElementById('darkToggle');
  if (btn) btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}
document.getElementById('darkToggle').addEventListener('click', () => {
  isDark = !isDark; localStorage.setItem('tg_theme', isDark ? 'dark' : 'light'); applyTheme();
});

// ═══ NAVBAR ═══
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('scrollTopBtn').classList.toggle('show', window.scrollY > 300);
  updateActiveSideNav();
}, { passive: true });

function toggleNav() {
  document.getElementById('mobileNav').classList.toggle('open');
}

function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══ ACTIVE NAV ═══
function updateActiveSideNav() {
  const secs = document.querySelectorAll('section[id]');
  const sideLinks = document.querySelectorAll('.desktop-sidenav a');
  let current = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  sideLinks.forEach(l => {
    l.style.background = '';
    l.style.color = '';
    if (l.getAttribute('href') === '#' + current) {
      l.style.background = 'var(--g)';
      l.style.color = '#fff';
    }
  });
}

// ═══ PARTICLES ═══
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
for (let i = 0; i < 55; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    o: Math.random() * 0.5 + 0.1
  });
}
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDk = document.documentElement.getAttribute('data-theme') === 'dark';
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = isDk ? `rgba(165,214,167,${p.o})` : `rgba(46,139,64,${p.o})`;
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ═══ COUNTER ANIMATION ═══
const counters = document.querySelectorAll('.stat-number');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let count = 0;
      const step = target / 60;
      const t = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = Math.floor(count) + (target === 100 ? '%' : '+');
        if (count >= target) clearInterval(t);
      }, 22);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

// ═══ SCROLL REVEAL ═══
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.pcard,.bcard,.rcard,.ci-item,.stat-card,.gm-item,.yt-card,.math-step,.cb-left,.cb-center,.cb-right').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i % 6) * 60 + 'ms';
  revealObs.observe(el);
});

// ═══ PRODUCT FILTER ═══
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const f = this.dataset.f;
    document.querySelectorAll('.pcard').forEach(c => {
      c.style.display = (f === 'all' || c.dataset.cat === f) ? 'flex' : 'none';
    });
  });
});

// ═══ SEARCH ═══
function doSearch() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  document.getElementById('noResults').style.display = 'none';
  document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.pf-btn[data-f="all"]').classList.add('active');
  if (!q) { document.querySelectorAll('.pcard').forEach(c => c.style.display = 'flex'); return; }
  scrollTo('#products');
  let found = 0;
  document.querySelectorAll('.pcard').forEach(c => {
    const show = c.innerText.toLowerCase().includes(q);
    c.style.display = show ? 'flex' : 'none';
    if (show) found++;
  });
  if (!found) document.getElementById('noResults').style.display = 'block';
}
document.getElementById('searchInput').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

// ═══ FLOATING WINDOWS ═══
function openWindow(id) {
  document.querySelectorAll('.fwindow').forEach(w => { if (w.id !== id) w.classList.remove('open'); });
  const w = document.getElementById(id);
  if (w) { w.classList.toggle('open'); if (id === 'cartWindow') renderCart(); if (id === 'coinsWindow') renderCoinWindow(); }
}
function closeWindow(id) {
  const w = document.getElementById(id);
  if (w) w.classList.remove('open');
}
document.querySelectorAll('.fwindow').forEach(w => {
  w.addEventListener('click', e => { if (e.target === w) w.classList.remove('open'); });
});

// ═══ AUTH ═══
function authTab(tab) {
  document.getElementById('authLoginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('authSignupForm').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('atLogin').classList.toggle('active', tab === 'login');
  document.getElementById('atSignup').classList.toggle('active', tab === 'signup');
}
function doLogin() {
  const u = document.getElementById('liUser').value.trim();
  const p = document.getElementById('liPass').value.trim();
  if (!u || !p) { toast('⚠️ Please fill in all fields'); return; }
  state.user = { name: u };
  saveState();
  document.getElementById('navUserLabel').textContent = u;
  closeWindow('authWindow');
  toast(`✅ Welcome back, ${u}! 🍄`);
}
function doSignup() {
  const n = document.getElementById('suName').value.trim();
  const e = document.getElementById('suEmail').value.trim();
  const ph = document.getElementById('suPhone').value.trim();
  const p = document.getElementById('suPass').value.trim();
  if (!n || !e || !ph || !p) { toast('⚠️ Please fill in all fields'); return; }
  state.user = { name: n };
  state.coins += 50;
  addCoinHistory('🎁 Welcome Bonus', 50);
  saveState();
  document.getElementById('navUserLabel').textContent = n;
  closeWindow('authWindow');
  updateCoinsUI();
  toast(`🎉 Welcome to Triglow, ${n}! You earned 50 bonus coins! 🪙`);
}

// ═══ CART ═══
function addToCart(name, price, emoji) {
  const ex = state.cart.find(i => i.name === name);
  if (ex) ex.qty++;
  else state.cart.push({ name, price, emoji, qty: 1 });
  saveState();
  updateCartBadge();
  toast(`🛒 ${emoji} "${name}" added to cart!`);
  // Animate cart button
  const cartFab = document.querySelector('.cart-fab');
  cartFab.style.transform = 'scale(1.25)';
  setTimeout(() => cartFab.style.transform = '', 300);
}
function updateCartBadge() {
  const total = state.cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartPip').textContent = total;
}
function renderCart() {
  const list = document.getElementById('cartItemsList');
  const empty = document.getElementById('cartEmptyMsg');
  const summary = document.getElementById('cartSummary');
  list.innerHTML = '';
  if (!state.cart.length) { empty.style.display = 'block'; summary.style.display = 'none'; return; }
  empty.style.display = 'none'; summary.style.display = 'block';
  let sub = 0;
  state.cart.forEach((item, i) => {
    sub += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item-row';
    div.innerHTML = `
      <span class="cir-emoji">${item.emoji}</span>
      <span class="cir-name">${item.name}</span>
      <div class="cir-qty">
        <button class="cqb" onclick="changeQty(${i},-1)">−</button>
        <span>${item.qty}</span>
        <button class="cqb" onclick="changeQty(${i},1)">+</button>
      </div>
      <span class="cir-price">₹${item.price * item.qty}</span>
    `;
    list.appendChild(div);
  });
  document.getElementById('cSubtotal').textContent = '₹' + sub;
  const discountRow = document.getElementById('discountRow');
  const discAmt = document.getElementById('discountAmt');
  const notice = document.getElementById('csCoinsNotice');
  const coinDisc = Math.floor(state.coins / 100) * 5;
  const total = Math.max(0, sub - (state.coinDiscount || 0));
  document.getElementById('cTotal').textContent = '₹' + total;
  if (state.coinDiscount > 0) {
    discountRow.style.display = 'flex';
    discAmt.textContent = '-₹' + state.coinDiscount;
  } else {
    discountRow.style.display = 'none';
  }
  if (coinDisc > 0 && !state.coinDiscount) {
    notice.textContent = `🪙 You have ${state.coins} coins = ₹${coinDisc} discount available! Click "Redeem Coins" in Earn section.`;
  } else if (state.coinDiscount) {
    notice.textContent = `✅ ₹${state.coinDiscount} coin discount applied!`;
  } else {
    notice.textContent = '';
  }
}
function changeQty(i, d) {
  state.cart[i].qty += d;
  if (state.cart[i].qty <= 0) state.cart.splice(i, 1);
  saveState(); updateCartBadge(); renderCart();
}
function checkout() {
  if (!state.cart.length) return;
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0) - (state.coinDiscount || 0);
  const redeemed = state.coinDiscount > 0 ? Math.floor(state.coinDiscount / 5) * 100 : 0;
  if (redeemed > 0) { state.coins -= redeemed; }
  state.coinDiscount = 0;
  state.cart = [];
  saveState(); updateCartBadge(); updateCoinsUI();
  closeWindow('cartWindow');
  toast(`🎉 Order placed for ₹${Math.max(0,total)}! Thank you for choosing Triglow! 🍄`);
}

// ═══ COINS ═══
function shareOn(platform) {
  const urls = {
    whatsapp: 'https://wa.me/?text=' + encodeURIComponent('🍄 Check out Triglow — fresh organic mushrooms from Odisha! 🌿 https://triglow.in'),
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=https://triglow.in',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('🍄 Fresh mushrooms from Triglow Farm, Odisha! Organic & farm-fresh. 🌿 https://triglow.in'),
    telegram: 'https://t.me/share/url?url=https://triglow.in&text=' + encodeURIComponent('Check out Triglow Farm!')
  };
  window.open(urls[platform] || '#', '_blank');
  state.coins += 10;
  addCoinHistory(`📣 Shared on ${capitalize(platform)}`, 10);
  saveState(); updateCoinsUI();
  toast(`🪙 +10 coins earned for sharing on ${capitalize(platform)}!`);
  coinBurst();
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function addCoinHistory(label, amount) {
  state.coinHistory.unshift({ label, amount, time: new Date().toLocaleTimeString() });
  if (state.coinHistory.length > 20) state.coinHistory.pop();
}

function updateCoinsUI() {
  // Nav
  document.getElementById('navCoins').textContent = state.coins;
  // Wallet card
  if (document.getElementById('walletBal')) {
    document.getElementById('walletBal').textContent = state.coins;
    const rs = (state.coins / 100 * 5).toFixed(2);
    document.getElementById('walletRs').textContent = rs;
    const prog = (state.coins % 100);
    document.getElementById('walletBarFill').style.width = prog + '%';
    document.getElementById('walletBarText').textContent = `${prog} / 100 to next ₹5`;
    const redeemBtn = document.getElementById('redeemBtn');
    if (redeemBtn) redeemBtn.disabled = state.coins < 100;
  }
}

function redeemCoins() {
  if (state.coins < 100) { toast('⚠️ You need at least 100 coins to redeem'); return; }
  const redeemable = Math.floor(state.coins / 100) * 100;
  const discount = (redeemable / 100) * 5;
  state.coinDiscount = discount;
  saveState(); updateCoinsUI();
  toast(`✅ ₹${discount} discount applied to your cart! 🎉`);
  openWindow('cartWindow');
}

function renderCoinWindow() {
  document.getElementById('cwBalNum').textContent = state.coins;
  document.getElementById('cwWorth').textContent = (state.coins / 100 * 5).toFixed(2);
  const prog = (state.coins % 100);
  document.getElementById('cwProgFill').style.width = prog + '%';
  document.getElementById('cwProgText').textContent = `${prog} / 100 coins`;
  const hist = document.getElementById('cwHistory');
  if (!state.coinHistory.length) {
    hist.innerHTML = '<div class="cwh-empty">No coins earned yet. Start sharing!</div>';
    return;
  }
  hist.innerHTML = state.coinHistory.map(h => `
    <div class="cwh-item">
      <span>${h.label}</span>
      <span class="cwh-earn">+${h.amount} 🪙</span>
    </div>
  `).join('');
}

function coinBurst() {
  const btn = document.querySelector('.coins-wallet') || document.body;
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;z-index:9999;pointer-events:none;animation:coinBurstAnim .8s ease forwards;';
  el.textContent = '🪙';
  const style = document.createElement('style');
  style.textContent = '@keyframes coinBurstAnim{0%{opacity:1;transform:translate(-50%,-50%) scale(1);}100%{opacity:0;transform:translate(-50%,-150%) scale(2);}}';
  document.head.appendChild(style);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// ═══ YOUTUBE ═══
function loadYT(placeholder, videoId) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  iframe.allowFullscreen = true;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;border-radius:16px 16px 0 0;';
  placeholder.parentElement.appendChild(iframe);
  placeholder.remove();
}
function loadYTMain(videoId, title) {
  const mainWrap = document.querySelector('.yt-embed-wrap');
  mainWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" style="position:absolute;inset:0;width:100%;height:100%;border:none;" allowfullscreen allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"></iframe>`;
  mainWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ═══ GALLERY LIGHTBOX ═══
function openLightbox(emoji, caption) {
  document.getElementById('lbEmoji').textContent = emoji;
  document.getElementById('lbCaption').textContent = caption;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

// ═══ REVIEWS SLIDER ═══
function scrollReviews(dir) {
  const track = document.getElementById('reviewsTrack');
  const cardW = 300;
  state.reviewsOffset = Math.max(0, Math.min(state.reviewsOffset + dir, 4));
  track.style.transform = `translateX(-${state.reviewsOffset * cardW}px)`;
}

// ═══ STAR RATING ═══
function pickStar(n) {
  state.reviewRating = n;
  document.querySelectorAll('#starPicker span').forEach((s, i) => {
    s.classList.toggle('lit', i < n);
  });
}

function submitReview() {
  const name = document.getElementById('rvName').value.trim();
  const text = document.getElementById('rvText').value.trim();
  if (!name || !text) { toast('⚠️ Please fill in name and review'); return; }
  if (!state.reviewRating) { toast('⭐ Please select a star rating'); return; }
  // Add to track
  const track = document.getElementById('reviewsTrack');
  const stars = '★'.repeat(state.reviewRating) + '☆'.repeat(5 - state.reviewRating);
  const card = document.createElement('div');
  card.className = 'rcard reveal visible';
  card.innerHTML = `<div class="rcard-stars">${stars}</div><p>"${text}"</p><div class="rcard-user"><div class="rcu-av">${name[0].toUpperCase()}</div><div><strong>${name}</strong><span>Just now</span></div></div>`;
  track.appendChild(card);
  // Reward coins
  state.coins += 5;
  addCoinHistory('⭐ Left a review', 5);
  saveState(); updateCoinsUI();
  document.getElementById('rvName').value = '';
  document.getElementById('rvText').value = '';
  pickStar(0); state.reviewRating = 0;
  toast(`🙏 Thank you ${name}! Review posted & +5 coins earned! 🪙`);
}

// ═══ CONTACT ═══
function sendContact() {
  const n = document.getElementById('cfName').value.trim();
  const e = document.getElementById('cfEmail').value.trim();
  const m = document.getElementById('cfMsg').value.trim();
  if (!n || !e || !m) { toast('⚠️ Please fill in required fields'); return; }
  document.getElementById('cfName').value = '';
  document.getElementById('cfEmail').value = '';
  document.getElementById('cfPhone').value = '';
  document.getElementById('cfMsg').value = '';
  toast(`✅ Message sent! We'll get back to you soon, ${n} 🍄`);
}

// ═══ AI CHATBOT ═══
const botKB = {
  'mushroom': 'We grow 🍄 Fresh White Button, Premium Button, Oyster, Milky mushrooms + combo packs. All fresh from our Pokatunga farm!',
  'product': 'We sell: 🍄 Button Mushrooms (₹45–₹85), 🫧 Oyster Mushrooms (₹55), 🍃 Milky Mushrooms (₹65), and 🧺 Family Combos (₹160).',
  'price': 'Our prices: Button 250g = ₹45, Button 500g = ₹85, Oyster 200g = ₹55, Milky 250g = ₹65, Family Combo 1kg = ₹160. All at discount!',
  'order': 'To order: Browse our Products section → Click Add button → Open Cart 🛒 → Place Order! You can also call us at +91 XXXXX XXXXX.',
  'deliver': 'We offer same-day delivery in Angul area! For other areas please call us. We dispatch fresh mushrooms daily from our farm.',
  'benefit': 'Mushrooms are a superfood! 💪