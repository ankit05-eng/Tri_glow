// ========== DARK MODE ==========
const darkToggle = document.getElementById('darkToggle');
const html = document.documentElement;

let isDark = localStorage.getItem('triglow-theme') === 'dark';
applyTheme();

function applyTheme() {
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  darkToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

darkToggle.addEventListener('click', () => {
  isDark = !isDark;
  localStorage.setItem('triglow-theme', isDark ? 'dark' : 'light');
  applyTheme();
});

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
    document.getElementById('scrollTop').classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    document.getElementById('scrollTop').classList.remove('visible');
  }
});

// ========== MOBILE MENU ==========
function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('navLinks').classList.remove('open');
}

// ========== SMOOTH NAV SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========== MODAL SYSTEM ==========
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
function closeModalOutside(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}

// ========== LOGIN / SIGNUP TABS ==========
function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  if (tab === 'login') {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
  }
}

function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  if (!user || !pass) { showToast('⚠️ Please fill in all fields.'); return; }
  closeModal('loginModal');
  showToast(`✅ Welcome back, ${user}!`);
}

function doSignup() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const pass = document.getElementById('signupPass').value.trim();
  if (!name || !email || !phone || !pass) { showToast('⚠️ Please fill in all fields.'); return; }
  closeModal('loginModal');
  showToast(`🎉 Welcome to Triglow, ${name}!`);
}

// ========== CART ==========
let cart = [];

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartBadge();
  renderCart();
  showToast(`🛒 "${name}" added to cart!`);
}

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartBadge').textContent = total;
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  const empty = document.getElementById('cartEmpty');
  container.innerHTML = '';
  if (cart.length === 0) {
    footer.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  footer.style.display = 'block';
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span class="cart-item-name">🍄 ${item.name}</span>
      <div class="cart-qty">
        <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
      </div>
      <span class="cart-item-price">₹${item.price * item.qty}</span>
    `;
    container.appendChild(div);
  });
  document.getElementById('cartTotal').textContent = `₹${total}`;
}

function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartBadge();
  renderCart();
}

function openCart() {
  renderCart();
  openModal('cartModal');
}

function checkout() {
  if (cart.length === 0) return;
  showToast('🎉 Order placed! Thank you for choosing Triglow.');
  cart = [];
  updateCartBadge();
  renderCart();
  setTimeout(() => closeModal('cartModal'), 1200);
}

// ========== PRODUCT FILTER ==========
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ========== SEARCH ==========
function doSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!query) {
    document.querySelectorAll('.product-card').forEach(c => c.style.display = 'flex');
    document.getElementById('noResults').style.display = 'none';
    return;
  }
  // Scroll to products
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });

  let found = 0;
  document.querySelectorAll('.product-card').forEach(card => {
    const text = card.innerText.toLowerCase();
    if (text.includes(query)) {
      card.style.display = 'flex';
      found++;
    } else {
      card.style.display = 'none';
    }
  });
  document.getElementById('noResults').style.display = found === 0 ? 'block' : 'none';
  // Reset filter buttons
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
}

document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
});

// ========== STAR RATING ==========
let selectedRating = 0;
function setRating(r) {
  selectedRating = r;
  const stars = document.querySelectorAll('#starSelect span');
  stars.forEach((s, i) => {
    s.classList.toggle('active', i < r);
  });
}

// ========== REVIEW SUBMIT ==========
function submitReview() {
  const name = document.getElementById('reviewName').value.trim();
  const text = document.getElementById('reviewText').value.trim();
  if (!name || !text) { showToast('⚠️ Please fill in your name and review.'); return; }
  if (selectedRating === 0) { showToast('⭐ Please select a star rating.'); return; }
  showToast(`🙏 Thank you ${name}! Your review has been submitted.`);
  document.getElementById('reviewName').value = '';
  document.getElementById('reviewText').value = '';
  setRating(0);
  selectedRating = 0;
}

// ========== CONTACT SUBMIT ==========
function submitContact() {
  const name = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  const msg = document.getElementById('cMessage').value.trim();
  if (!name || !email || !msg) { showToast('⚠️ Please fill in required fields.'); return; }
  showToast(`✅ Message sent! We'll get back to you soon, ${name}.`);
  document.getElementById('cName').value = '';
  document.getElementById('cEmail').value = '';
  document.getElementById('cPhone').value = '';
  document.getElementById('cMessage').value = '';
}

// ========== TOAST ==========
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ========== SCROLL REVEAL ==========
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function setupReveal() {
  const targets = [
    '.product-card', '.benefit-card', '.team-card',
    '.review-card', '.gallery-item', '.contact-item',
    '.about-story', '.feature-item'
  ];
  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 60}ms`;
      revealObserver.observe(el);
    });
  });
}

// ========== ACTIVE NAV HIGHLIGHT ==========
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = '';
    link.style.fontWeight = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--primary)';
      link.style.fontWeight = '600';
    }
  });
}, { passive: true });

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  renderCart();
});
