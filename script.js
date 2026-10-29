// Gelembung naik
const bubbleBox = document.getElementById('bubbles');
for (let i = 0; i < 22; i++) {
  const b = document.createElement('span');
  const size = 6 + Math.random() * 22;
  b.className = 'bubble';
  b.style.cssText =
    `width:${size}px;height:${size}px;left:${Math.random() * 100}%;` +
    `animation-duration:${9 + Math.random() * 14}s;` +
    `animation-delay:${-Math.random() * 20}s;` +
    `--dx:${(Math.random() - 0.5) * 80}px;opacity:${0.35 + Math.random() * 0.5}`;
  bubbleBox.appendChild(b);
}

// Kartu muncul saat di-scroll
const steps = document.querySelectorAll('.step');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });
steps.forEach((s) => io.observe(s));

// Progres tali + penanda kedalaman
const path = document.getElementById('path');
const depthNum = document.getElementById('depthNum');

function update() {
  const rect = path.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - rect.top) / rect.height));
  path.style.setProperty('--p', p.toFixed(4));

  const doc = document.documentElement;
  const total = doc.scrollHeight - window.innerHeight;
  const pct = total > 0 ? window.scrollY / total : 0;
  depthNum.textContent = Math.round(pct * 120);
}
window.addEventListener('scroll', update, { passive: true });
window.addEventListener('resize', update);
update();

// Surat SPS: klik untuk buka / tutup
// (dilewati otomatis kalau elemennya tidak ada di halaman)
const dlg = document.getElementById('spsDialog');
const openSps = document.getElementById('openSps');
const closeSps = document.getElementById('closeSps');
if (dlg && openSps && closeSps) {
  openSps.addEventListener('click', () => dlg.showModal());
  closeSps.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
}

// Kalau kotak.png belum ada, tampilkan ikon sementara
const letterImg = document.getElementById('letterImg');
if (letterImg) {
  const letterFallback = () => {
    const s = document.createElement('span');
    s.className = 'fallback';
    s.textContent = '🧰';
    letterImg.replaceWith(s);
  };
  letterImg.addEventListener('error', letterFallback);
  if (letterImg.complete && letterImg.naturalWidth === 0) letterFallback();
}

// Paus: tetap di layar (tidak ikut scroll), lewat dari kanan & kiri.
// Tiap kali lewat, tinggi renangnya berubah-ubah.
const ocean = document.getElementById('ocean');
const WHALES_PER_SIDE = 1;   // 1 dari kanan + 1 dari kiri = 2 paus

function randomWhaleY(el) {
  el.style.setProperty('--y', (4 + Math.random() * 70).toFixed(0) + '%');
}

function addWhale(dir, index) {
  const el = document.createElement('div');
  el.className = 'whale ' + dir;
  const img = document.createElement('img');
  img.src = 'paus.png';
  img.alt = '';
  el.appendChild(img);

  const w = 150 + Math.random() * 300;            // ukuran beda-beda
  const dur = 38 + Math.random() * 40;            // kecepatan beda-beda
  el.style.setProperty('--w', w.toFixed(0) + 'px');
  el.style.setProperty('--o', (0.6 + Math.random() * 0.35).toFixed(2));
  el.style.setProperty('--dur', dur.toFixed(1) + 's');
  // delay negatif supaya paus sudah tersebar di layar sejak awal
  el.style.setProperty('--delay', (-(index + Math.random()) / WHALES_PER_SIDE * dur).toFixed(1) + 's');
  randomWhaleY(el);

  el.addEventListener('animationiteration', (e) => {
    if (e.animationName.startsWith('swim')) randomWhaleY(el);
  });
  ocean.appendChild(el);
}

for (let i = 0; i < WHALES_PER_SIDE; i++) {
  addWhale('rtl', i);
  addWhale('ltr', i);
}

// Lagu: coba langsung play saat web dibuka.
// Browser sering memblokir autoplay bersuara, jadi kalau diblokir,
// lagu mulai otomatis di sentuhan / klik / tombol keyboard pertama.
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');
if (bgm && musicBtn) {
  bgm.volume = 0.6;

  const syncBtn = () => {
    const on = !bgm.paused;
    musicBtn.classList.toggle('playing', on);
    musicBtn.setAttribute('aria-pressed', String(on));
  };
  bgm.addEventListener('play', syncBtn);
  bgm.addEventListener('pause', syncBtn);

  const tryPlay = () => bgm.play().catch(() => {});
  tryPlay();

  const unlockEvents = ['pointerdown', 'touchend', 'keydown'];
  const unlock = (e) => {
    if (musicBtn.contains(e.target)) return;   // klik tombol diurus tombolnya sendiri
    tryPlay();
  };
  unlockEvents.forEach((t) => window.addEventListener(t, unlock, { passive: true }));
  bgm.addEventListener('playing', () => {
    unlockEvents.forEach((t) => window.removeEventListener(t, unlock));
  });

  musicBtn.addEventListener('click', () => {
    if (bgm.paused) tryPlay(); else bgm.pause();
  });
  syncBtn();
}