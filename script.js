/* ============ EDIT THIS PART ============ */
const CFG = {
  name: "Kelsey",
  from: "Collins",
  intro: "Incoming transmission for Kelsey",
  code: "0214",
  hint: "Four digits. Each lock tells you if the number should go higher or lower.",
  letter: [
    "Kelsey this is the only way that i can express myself to you😂 in a unique way just as unique you're ⚘😍..........anyway i have nothing much 😂 just thought of you and decided to disturb you 😈 you still running in my mind daily because honestly you made me feel special sometime back😚 and you deserve all the good things in this world 😭 you even made me smile on my phone while texting you😂😂😭 anyway .......😂 have a goodnight sufuria eater😂"
  ],
  sign: "",
  endMsg: "Your wish is up there now, one more star in our sky. I'll be keeping an eye on it."
};
/* ========================================= */

const $ = id => document.getElementById(id), wait = ms => new Promise(r => setTimeout(r, ms));
const KEY = "projectK.wishes";
let cur = 0, skip = false;
const dots = [...document.querySelectorAll("#dots i")];

function save(v){ try{ localStorage.setItem(KEY, JSON.stringify(v)); }catch(e){} }
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || []; }catch(e){ return []; } }
let wishes = load();

function go(n){
  cur = n;
  document.querySelectorAll(".scr").forEach((s, i) => s.classList.toggle("on", i === n));
  dots.forEach((d, i) => d.className = i === n ? "on" : i < n ? "done" : "");
  const f = [null, initLock, initLetter, initWish][n]; if (f) f();
}
function toast(t){ const e = $("toast"); e.textContent = t; e.classList.add("on"); setTimeout(() => e.classList.remove("on"), 3000); }

/* ---- background sky (also draws saved wish stars) ---- */
const bg = $("bg"), bx = bg.getContext("2d"); let S = [], shoot = null;
function sizeBg(){
  const d = devicePixelRatio || 1; bg.width = innerWidth * d; bg.height = innerHeight * d;
  S = Array.from({ length: 110 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.5 + .3, p: Math.random() * 6 }));
}
sizeBg(); addEventListener("resize", sizeBg);
(function draw(t){
  const d = devicePixelRatio || 1;
  bx.clearRect(0, 0, bg.width, bg.height);
  S.forEach(s => { bx.globalAlpha = .35 + .65 * Math.abs(Math.sin(t / 1200 + s.p)); bx.fillStyle = "#f2e9d8"; bx.beginPath(); bx.arc(s.x * bg.width, s.y * bg.height, s.r * d, 0, 7); bx.fill(); });
  wishes.forEach(w => { const a = .6 + .4 * Math.sin(t / 500 + w.x * 9); bx.globalAlpha = a; bx.fillStyle = "#ff6f8e"; bx.shadowColor = "#ff6f8e"; bx.shadowBlur = 14 * d; bx.beginPath(); bx.arc(w.x * bg.width, w.y * bg.height, 3 * d, 0, 7); bx.fill(); bx.shadowBlur = 0; });
  if (!shoot && Math.random() < .003) shoot = { x: Math.random() * bg.width, y: Math.random() * bg.height * .4, l: 0 };
  if (shoot){ bx.globalAlpha = 1 - shoot.l / 60; bx.strokeStyle = "#6ee7d0"; bx.lineWidth = 2; bx.beginPath(); bx.moveTo(shoot.x + shoot.l * 6, shoot.y + shoot.l * 3); bx.lineTo(shoot.x + shoot.l * 6 - 50, shoot.y + shoot.l * 3 - 25); bx.stroke(); if (++shoot.l > 60) shoot = null; }
  requestAnimationFrame(draw);
})(0);

/* ---- sparkles on tap ---- */
function burst(x, y, n = 8, set = ["✦", "♥", "✧"]){
  for (let i = 0; i < n; i++){
    const e = document.createElement("i"); e.className = "p"; e.textContent = set[i % set.length];
    const a = Math.random() * 6.28, r = 40 + Math.random() * 80;
    e.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * r}px;--dy:${Math.sin(a) * r - 30}px;color:${i % 2 ? "#ff6f8e" : "#6ee7d0"}`;
    document.body.appendChild(e); setTimeout(() => e.remove(), 1000);
  }
}
addEventListener("pointerdown", e => burst(e.clientX, e.clientY, 3, ["✦", "·"]));

/* ---- music (generated in the browser, no files) ---- */
let ac, master, on = true;
const SC = [0, 3, 7, 10, 12, 15, 19], PROG = [0, -4, -2, -5];
function note(f, d, v){
  const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
  o.type = "sine"; o.frequency.value = f;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .04); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + d + .05);
}
function startAudio(){
  if (ac){ ac.resume(); return; }
  ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = .5;
  const d = ac.createDelay(), fb = ac.createGain(); d.delayTime.value = .33; fb.gain.value = .38;
  d.connect(fb); fb.connect(d); master.connect(d); d.connect(ac.destination); master.connect(ac.destination);
  let i = 0;
  setInterval(() => {
    if (!on) return;
    const b = Math.floor(i / 8) % 4, n = SC[(i * 3 + (i >> 2)) % 7] + PROG[b];
    note(220 * 2 ** (n / 12), 1.1, .07); if (i % 8 === 0) note(110 * 2 ** (PROG[b] / 12), 3.2, .09); i++;
  }, 430);
}
function sfx(k){ if (ac && on) note(660 * 2 ** (SC[k % 7] / 12), .8, .18); }
$("snd").onclick = () => { startAudio(); on = !on; master.gain.value = on ? .5 : 0; $("snd").textContent = on ? "♪ music" : "♪ muted"; };

/* ---- 0 intro (tap the K five times for a secret) ---- */
$("t0").textContent = CFG.intro;
let taps = 0;
$("k").onclick = () => { if (++taps === 5){ toast("You found the hidden signal. Tell Collins the code word: starlight."); burst(innerWidth / 2, 200, 16); taps = 0; } };
$("go0").onclick = () => { startAudio(); go(1); };

/* ---- 1 number lock puzzle ---- */
let dg = [0, 0, 0, 0], tries = 0;
function initLock(){
  dg = CFG.code.split("").map(() => 0); tries = 0;
  $("qq").textContent = CFG.hint; $("fb").textContent = ""; $("try").hidden = false; $("go1").hidden = true;
  $("lock").innerHTML = dg.map((_, i) => `<div class="col"><button class="ar" data-i="${i}" data-d="1">▲</button><div class="num serif" id="n${i}">0</div><button class="ar" data-i="${i}" data-d="-1">▼</button><div class="st" id="st${i}">&nbsp;</div></div>`).join("");
  document.querySelectorAll(".ar").forEach(b => b.onclick = () => {
    const i = +b.dataset.i; dg[i] = (dg[i] + +b.dataset.d + 10) % 10; $("n" + i).textContent = dg[i];
    $("st" + i).innerHTML = "&nbsp;"; sfx(dg[i]);
  });
}
$("try").onclick = () => {
  const code = CFG.code.split("").map(Number); tries++; let ok = 0;
  dg.forEach((d, i) => {
    const st = $("st" + i), c = code[i];
    if (d === c){ ok++; st.textContent = "✓"; st.className = "st good"; }
    else { st.textContent = d < c ? "▲ higher" : "▼ lower"; st.className = "st"; }
  });
  if (ok === code.length){
    $("try").hidden = true; $("go1").hidden = false; $("fb").textContent = `Unlocked in ${tries} ${tries === 1 ? "try" : "tries"}. Nice work, agent.`;
    burst(innerWidth / 2, 260, 22); [0, 2, 4, 6].forEach(k => setTimeout(() => sfx(k), k * 110));
  } else { sfx(0); $("fb").textContent = `${ok} of ${code.length} right. Try ${tries}.`; }
};
$("go1").onclick = () => go(2);

/* ---- 2 sealed letter ---- */
let opened = false;
function initLetter(){
  opened = false; $("env").className = ""; $("paper").hidden = true; $("go2").hidden = true;
  $("lhint").hidden = false; $("lh").textContent = "A letter, sealed";
}
$("env").onclick = async () => {
  if (opened) return; opened = true; sfx(6);
  $("env").classList.add("open"); const r = $("env").getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 60, 14);
  $("lhint").hidden = true; await wait(900); $("env").classList.add("gone"); await wait(400);
  $("lh").textContent = "For " + CFG.name;
  const p = $("paper"); p.hidden = false; p.innerHTML = ""; skip = false;
  p.onclick = () => skip = true;
  for (const t of CFG.letter){
    const e = document.createElement("p"); p.appendChild(e);
    for (const c of t){ if (skip){ e.textContent = t; break; } e.textContent += c; p.scrollTop = p.scrollHeight; await wait(26); }
    await wait(skip ? 0 : 250);
  }
  if (CFG.sign){ const sg = document.createElement("p"); sg.className = "sg"; sg.textContent = CFG.sign; p.appendChild(sg); }
  $("go2").hidden = false;
};
$("go2").onclick = () => go(3);

/* ---- 3 make a wish ---- */
const fx = $("fx"), fc = fx.getContext("2d");
function initWish(){
  $("wish").value = ""; $("wc").textContent = "0 / 140"; $("end").hidden = true; $("launch").hidden = false;
  $("wish").hidden = false; $("wc").hidden = false; $("wh").textContent = "Make a wish"; $("wsub").hidden = false;
  const last = wishes[wishes.length - 1];
  $("wsaved").textContent = last ? `Your last wish is still up there: "${last.text}"` : "";
}
$("wish").oninput = () => $("wc").textContent = $("wish").value.length + " / 140";
$("launch").onclick = () => {
  const text = $("wish").value.trim();
  if (!text){ toast("Write a wish first."); return; }
  $("launch").hidden = true; $("wish").hidden = true; $("wc").hidden = true; $("wsub").hidden = true; $("wsaved").textContent = "";
  $("wh").textContent = "Launching…";
  const w = { text, x: .1 + Math.random() * .8, y: .08 + Math.random() * .28 };
  launch(w);
};
function launch(w){
  fx.width = innerWidth; fx.height = innerHeight;
  const sx = fx.width / 2, sy = fx.height * .72, tx = w.x * fx.width, ty = w.y * fx.height, T = 1800, t0 = performance.now(), trail = [];
  sfx(0);
  (function f(now){
    const k = Math.min(1, (now - t0) / T), e = 1 - Math.pow(1 - k, 3);
    const x = sx + (tx - sx) * e + Math.sin(k * 9) * 14 * (1 - k), y = sy + (ty - sy) * e;
    trail.push({ x, y, a: 1 });
    fc.clearRect(0, 0, fx.width, fx.height);
    trail.forEach(p => { p.a -= .03; if (p.a > 0){ fc.globalAlpha = p.a; fc.fillStyle = "#ffe29a"; fc.beginPath(); fc.arc(p.x, p.y, 3 * p.a + 1, 0, 7); fc.fill(); } });
    fc.globalAlpha = 1; fc.fillStyle = "#fff"; fc.shadowColor = "#ffe29a"; fc.shadowBlur = 20; fc.beginPath(); fc.arc(x, y, 5, 0, 7); fc.fill(); fc.shadowBlur = 0;
    if (k < 1) return requestAnimationFrame(f);
    fc.clearRect(0, 0, fx.width, fx.height);
    wishes.push(w); save(wishes); burst(tx, ty, 18); [0, 2, 4, 6].forEach(i => setTimeout(() => sfx(i), i * 110));
    $("wh").textContent = "Wish sent"; $("endmsg").textContent = CFG.endMsg; $("end").hidden = false;
  })(t0);
}
$("again").onclick = () => go(0);

go(0);
