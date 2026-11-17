/* EcoTrim — общие декоративные эффекты для ВСЕХ страниц:
   падающие листья, кнопка паузы и панда, которая едет вдоль страницы при скролле.
   Один файл = один источник правды: правка здесь меняет эффект на всём сайте.
   Скрипт самодостаточный (не зависит от AOS/Alpine/CDN) и подключается сразу после </footer>. */
(function () {
  if (window.__ecoDecor) return; window.__ecoDecor = true;
  // путь к картинкам считаем от адреса самого скрипта — работает и на 404-странице с любой вложенностью
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/js\/eco-decor\.js.*$/, '');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = window.innerWidth < 768;                 // телефон: листьев меньше, панда скрыта
  var paused = false;
  try { paused = localStorage.getItem('ecoDecorPaused') === '1'; } catch (e) {}
  if (reduce) paused = true;                           // уважаем системную настройку «меньше движения»
  window.ecoDecorPaused = paused;

  var css =
    '#leaves-layer{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}' +
    '.eco-leaf{position:absolute;top:-80px;pointer-events:none;animation:ecoLeafFall linear forwards;will-change:transform,opacity}' +
    '@keyframes ecoLeafFall{0%{opacity:0;transform:translateY(0) rotate(0) translateX(0)}8%{opacity:.9}85%{opacity:.75}' +
    '100%{opacity:0;transform:translateY(110vh) rotate(var(--rot)) translateX(var(--sway))}}' +
    '#anim-btn{position:fixed;bottom:1.5rem;left:1.5rem;z-index:10000;width:36px;height:36px;border-radius:50%;border:none;' +
    'background:rgba(26,92,56,.85);cursor:pointer;display:flex;align-items:center;justify-content:center;' +
    'box-shadow:0 2px 8px rgba(0,0,0,.3);transition:background .2s}' +
    '#anim-btn:hover{background:rgba(26,92,56,1)}' +
    '#rope-scene{position:fixed;right:6px;top:0;bottom:0;width:56px;pointer-events:none;z-index:100}' +
    '#climber-fig{position:absolute;right:0;top:90px;width:52px;height:52px;display:block;' +
    'filter:drop-shadow(0 3px 6px rgba(0,0,0,.35));transition:top .12s cubic-bezier(.25,.46,.45,.94)}' +
    '@media(max-width:767px){#rope-scene{display:none}#anim-btn{bottom:1rem;left:1rem}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- листья ---------- */
  var layer = document.createElement('div'); layer.id = 'leaves-layer'; layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  var SHAPES = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 48"><path d="M20 1C14 7 3 9 2 17c5-1 10-2 13 2-5 3-9 8-7 14 4-3 8-7 10-5-1 5-2 12 2 19 4-7 3-14 2-19 2-2 6 2 10 5 2-6-2-11-7-14 3-4 8-3 13-2C25 9 26 7 20 1z" fill="COL"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44"><ellipse cx="18" cy="22" rx="16" ry="20" fill="COL"/><line x1="18" y1="2" x2="18" y2="42" stroke="COL2" stroke-width="1.5"/><path d="M18 11Q8 17 6 26M18 11Q28 17 30 26M18 23Q10 29 8 38M18 23Q26 29 28 38" stroke="COL2" stroke-width="1" fill="none"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 52"><path d="M14 1c4 7 8 12 6 19 3-2 6-1 4 4 3-2 5 1 2 5 2-1 3 3-1 5 1 0 1 4-3 4-2 5-2 9-2 14-2-5 0-9-2-14-4 0-4-4-3-4-4-2-3-6-1-5-3-4-1-7 2-5-2-5 1-6 4-4C6 13 10 8 14 1z" fill="COL"/></svg>'
  ];
  var C1 = ['#2d5a27', '#4caf50', '#81c784', '#aed581', '#388e3c'], C2 = ['#1a4020', '#2e7d32', '#558b2f'];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  var MAX = small ? 9 : 22;                            // потолок одновременно летящих листьев

  function spawn() {
    if (paused || document.hidden || layer.childElementCount >= MAX) return;
    var d = document.createElement('div'); d.className = 'eco-leaf';
    var sz = (small ? 14 : 18) + Math.random() * (small ? 16 : 24), dur = 7 + Math.random() * 9;
    d.innerHTML = pick(SHAPES).replace(/COL2/g, pick(C2)).replace(/COL/g, pick(C1));
    d.style.cssText = 'left:' + (Math.random() * 100) + '%;width:' + sz + 'px;height:' + sz + 'px;--rot:' +
      (360 + Math.floor(Math.random() * 360)) + 'deg;--sway:' + ((Math.random() - .5) * (small ? 90 : 220)) +
      'px;animation-duration:' + dur + 's';
    d.addEventListener('animationend', function () { d.remove(); }, { once: true });
    layer.appendChild(d);
  }
  for (var i = 0; i < (small ? 4 : 10); i++) setTimeout(spawn, i * 220);
  setInterval(spawn, small ? 1500 : 800);

  /* ---------- кнопка паузы (одна на листья и панду) ---------- */
  var btn = document.createElement('button'); btn.id = 'anim-btn'; btn.type = 'button';
  var ICO_PAUSE = '<svg width="14" height="14" viewBox="0 0 14 14" fill="white"><rect x="2" y="1" width="4" height="12" rx="1"/><rect x="8" y="1" width="4" height="12" rx="1"/></svg>';
  var ICO_PLAY = '<svg width="14" height="14" viewBox="0 0 14 14" fill="white"><polygon points="2,1 12,7 2,13"/></svg>';
  function paint() {
    btn.innerHTML = paused ? ICO_PLAY : ICO_PAUSE;
    var t = paused ? 'Включить анимацию листьев' : 'Остановить анимацию листьев';
    btn.title = t; btn.setAttribute('aria-label', t);
  }
  paint();
  btn.addEventListener('click', function () {
    paused = !paused; window.ecoDecorPaused = paused;
    try { localStorage.setItem('ecoDecorPaused', paused ? '1' : '0'); } catch (e) {}
    if (paused) layer.innerHTML = ''; else spawn();
    paint();
  });
  document.body.appendChild(btn);

  /* ---------- панда, едущая вдоль страницы при скролле (планшет и десктоп) ---------- */
  if (small) return;
  var scene = document.createElement('div'); scene.id = 'rope-scene'; scene.setAttribute('aria-hidden', 'true');
  var fig = document.createElement('img'); fig.id = 'climber-fig'; fig.src = BASE + 'img/panda.svg'; fig.alt = '';
  scene.appendChild(fig); document.body.appendChild(scene);
  var footer = document.querySelector('footer'), header = document.querySelector('header'), ticking = false;
  function upd() {
    ticking = false;
    var minTop = (header ? header.offsetHeight : 80) + 8;
    var maxTop = window.innerHeight - 82 - 52;         // не наезжать на кнопку «наверх»
    if (footer) { var ft = footer.getBoundingClientRect().top; if (ft < window.innerHeight) maxTop = Math.min(maxTop, ft - 62); }
    var total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    fig.style.top = (minTop + Math.min(1, window.scrollY / total) * Math.max(0, maxTop - minTop)) + 'px';
  }
  upd();
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
})();
