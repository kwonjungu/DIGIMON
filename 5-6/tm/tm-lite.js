/*
 * 먹이 분류 AI (티처블 머신 경량판)
 * - 특징 추출: 티처블 머신과 같은 MobileNet v2(0.35, 224) 기본 모델 (Apache-2.0, ./model)
 * - 분류: 그 위에 작은 신경망(Dense 100 → 2)을 브라우저에서 직접 학습
 * - 텐서플로: TensorFlow.js 4.22 (Apache-2.0, ./tf.min.js)
 * 페이지의 활동 2 함수(trainModel, runClassification 등)를 진짜 동작으로 바꿔 끼운다.
 */
(function () {
  const BASE = (document.currentScript && document.currentScript.src.replace(/[^/]*$/, '')) || 'tm/';
  const SIZE = 224;
  const SEED = { 1: ['🥩', '🥕', '🍎', '🥬'], 2: ['🍫', '🍇', '🧅', '☕'] };
  const SEED_NAME = { '🥩': '고기', '🥕': '당근', '🍎': '사과', '🥬': '채소', '🍫': '초콜릿', '🍇': '포도', '🧅': '양파', '☕': '커피' };
  const PER_SEED = 3; // 예시 그림 하나를 각도·크기·바탕을 바꿔 3장으로
  const TM = { tf: null, base: null, head: null, data: { 1: [], 2: [] }, trained: false, busy: false,
               test: null, stream: null, live: false, hold: 0 };
  window.TM = TM;

  const $ = (id) => document.getElementById(id);
  // 페이지의 const state 는 window 속성이 아니라서 이름으로 찾는다
  const S = () => (typeof state !== 'undefined' ? state : null);
  const label = (k) => (document.querySelector(k === 1 ? '.class1-label' : '.class2-label') || {}).innerText || (k === 1 ? '안전한 먹이' : '위험한 음식');
  const setStatus = (t) => { const s = $('train-status'); if (s) s.innerText = t; };

  // ---------- 불러오기 ----------
  let loading = null;
  function loadScript(src) {
    return new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  }
  function ready() {
    if (loading) return loading;
    setStatus('AI 두뇌(MobileNet)를 불러오는 중이에요...');
    loading = (async () => {
      if (!window.tf) await loadScript(BASE + '../../vendor/tf.min.js');
      const tf = (TM.tf = window.tf);
      const mobilenet = await tf.loadLayersModel(BASE + 'model/model.json');
      const out = mobilenet.getLayer('out_relu');
      const trunc = tf.model({ inputs: mobilenet.inputs, outputs: out.output });
      const base = tf.sequential();
      base.add(trunc);
      base.add(tf.layers.globalAveragePooling2d({}));
      TM.base = base;
      tf.tidy(() => base.predict(tf.zeros([1, SIZE, SIZE, 3]))); // 첫 계산 예열
      if (!TM.data[1].length && !TM.data[2].length) await seed();
      if (!TM.test) defaultTest();
      setStatus('준비됐어요. 학습 데이터를 모으고 학습을 시작해요.');
    })().catch((e) => { loading = null; setStatus('AI 두뇌를 불러오지 못했어요. 새로고침해 주세요.'); console.error(e); throw e; });
    return loading;
  }

  // ---------- 이미지 → 특징 ----------
  function toCanvas(src) {
    const c = document.createElement('canvas'); c.width = c.height = SIZE;
    const g = c.getContext('2d');
    const w = src.videoWidth || src.naturalWidth || src.width, h = src.videoHeight || src.naturalHeight || src.height;
    const s = Math.min(w, h); // 가운데를 정사각형으로 잘라 씀(티처블 머신과 같음)
    g.drawImage(src, (w - s) / 2, (h - s) / 2, s, s, 0, 0, SIZE, SIZE);
    return c;
  }
  function embed(canvas) {
    const tf = TM.tf;
    return tf.tidy(() => {
      const x = tf.browser.fromPixels(canvas).toFloat().div(127.5).sub(1).expandDims(0);
      return TM.base.predict(x).dataSync().slice();
    });
  }
  function emojiCanvas(emo, variant) {
    const c = document.createElement('canvas'); c.width = c.height = SIZE;
    const g = c.getContext('2d');
    const bgs = ['#ffffff', '#f6f1e7', '#eef6f3', '#f3f0fa', '#fff4e6'];
    g.fillStyle = bgs[variant % bgs.length]; g.fillRect(0, 0, SIZE, SIZE);
    g.save();
    g.translate(SIZE / 2 + (variant % 3 - 1) * 14, SIZE / 2 + ((variant + 1) % 3 - 1) * 12);
    g.rotate(((variant * 37) % 50 - 25) * Math.PI / 180);
    const fs = 120 + (variant % 3) * 22;
    g.font = fs + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(emo, 0, fs * 0.06);
    g.restore();
    return c;
  }

  // ---------- 학습 데이터 ----------
  function add(k, canvas, name) {
    TM.data[k].push({ thumb: canvas.toDataURL('image/jpeg', 0.7), feat: embed(canvas), name: name || '' });
    TM.trained = false;
  }
  async function seed() {
    TM.data = { 1: [], 2: [] };
    render(); setStatus('예시 사진을 만드는 중이에요...');
    for (const k of [1, 2]) for (const e of SEED[k]) for (let v = 0; v < PER_SEED; v++) {
      add(k, emojiCanvas(e, v + k), SEED_NAME[e]);
      await new Promise((r) => setTimeout(r)); // 화면이 멈추지 않게
      if (TM.data[k].length % 3 === 0) render();
    }
    render(); setStatus('예시 사진 24장을 넣었어요. 사진을 더 모으거나 바로 학습해 봐요.');
  }
  function render() {
    for (const k of [1, 2]) {
      const box = $('c' + k + '-gallery'); if (!box) continue;
      box.innerHTML = '';
      TM.data[k].forEach((d, i) => {
        const cell = document.createElement('div');
        cell.className = 'tm-cell';
        cell.innerHTML = `<button type="button" class="tm-pick" aria-label="${d.name ? d.name + ' 사진' : '학습 사진 ' + (i + 1)} 고르기"><img src="${d.thumb}" alt=""></button><button type="button" class="tm-del">빼기</button>`;
        const [pick, del] = cell.children;
        pick.onclick = () => { const on = !cell.classList.contains('sel'); box.querySelectorAll('.sel').forEach((c) => c.classList.remove('sel')); cell.classList.toggle('sel', on); if (on) del.focus(); };
        del.onclick = () => { TM.data[k].splice(i, 1); TM.trained = false; render(); setStatus('학습 데이터가 바뀌었어요. 다시 학습해 주세요!'); };
        box.appendChild(cell);
      });
      $('c' + k + '-count').innerText = TM.data[k].length;
    }
  }

  // ---------- 학습 ----------
  async function train() {
    await ready();
    const tf = TM.tf;
    const n1 = TM.data[1].length, n2 = TM.data[2].length;
    if (n1 < 2 || n2 < 2) { alert('두 클래스 모두 사진이 2장 이상 있어야 학습할 수 있어요.'); return; }
    const btn = $('btn-train'), bar = $('train-progress-bar');
    btn.disabled = true; $('train-progress-container').classList.remove('hidden'); bar.style.width = '0%';
    const feats = [...TM.data[1], ...TM.data[2]].map((d) => d.feat);
    const ys = [...Array(n1).fill(0), ...Array(n2).fill(1)];
    const X = tf.tensor2d(feats), Y = tf.oneHot(tf.tensor1d(ys, 'int32'), 2);
    if (TM.head) TM.head.dispose();
    const head = tf.sequential();
    head.add(tf.layers.dense({ inputShape: [feats[0].length], units: 100, activation: 'relu' }));
    head.add(tf.layers.dropout({ rate: 0.2 }));
    head.add(tf.layers.dense({ units: 2, activation: 'softmax' }));
    head.compile({ optimizer: tf.train.adam(0.001), loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
    const EPOCHS = 50;
    await head.fit(X, Y, {
      epochs: EPOCHS, batchSize: 16, shuffle: true,
      callbacks: { onEpochEnd: (e, logs) => {
        bar.style.width = Math.round(((e + 1) / EPOCHS) * 100) + '%';
        setStatus(`${e + 1}/${EPOCHS}번째 학습 중 · 오차 ${logs.loss.toFixed(3)} · 학습 사진 맞힘 ${Math.round((logs.acc ?? logs.accuracy) * 100)}%`);
      } }
    });
    X.dispose(); Y.dispose();
    TM.head = head; TM.trained = true; S() && (S().isTrained = true);
    btn.disabled = false;
    setStatus(`학습 완료! 사진 ${n1 + n2}장으로 배웠어요. 이제 처음 보는 사진으로 시험해 봐요. 🎉`);
  }

  // ---------- 판별 ----------
  function cos(a, b) { let d = 0, x = 0, y = 0; for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; x += a[i] * a[i]; y += b[i] * b[i]; } return d / Math.sqrt(x * y); }
  function predict(canvas) {
    const tf = TM.tf, f = embed(canvas);
    const p = tf.tidy(() => TM.head.predict(tf.tensor2d([f])).dataSync().slice());
    let best = 0; for (const k of [1, 2]) for (const d of TM.data[k]) best = Math.max(best, cos(f, d.feat));
    return { p1: p[0], p2: p[1], dup: best > 0.985 };
  }
  function show(r) {
    const a = Math.round(r.p1 * 100), b = 100 - a;
    $('result-c1-percentage').innerText = a + '%'; $('result-c1-bar').style.width = a + '%';
    $('result-c2-percentage').innerText = b + '%'; $('result-c2-bar').style.width = b + '%';
    const note = $('result-note'); if (!note) return;
    const win = a >= b ? label(1) : label(2), conf = Math.max(a, b);
    if (r.dup) note.textContent = '이 사진은 학습에 쓴 사진과 거의 같아요. 이미 본 사진으로는 AI의 진짜 실력을 알 수 없어요. 처음 보는 사진으로 시험해 봐요.';
    else if (conf < 70) note.textContent = `AI가 헷갈려해요(${conf}%). 이런 사진을 학습 데이터에 더 넣으면 더 정확해져요.`;
    else note.textContent = `AI는 '${win}'(으)로 판단했어요(${conf}%). 정말 맞는지 우리가 한 번 더 확인해요.`;
    note.classList.remove('hidden');
  }
  function setTest(canvas, emoji, name) {
    TM.test = canvas;
    const pv = $('tm-test-preview'); if (pv) { pv.src = canvas.toDataURL('image/jpeg', 0.8); pv.hidden = false; }
    $('test-food-emoji').innerText = emoji || '📷';
    $('test-food-name').innerText = name;
    if (S()) S().currentTestFood = { emoji: emoji || '📷', name };
  }
  function defaultTest() { setTest(emojiCanvas('🍌', 4), '🍌', '바나나 (기본값)'); }
  function clearResult() {
    ['1', '2'].forEach((k) => { $('result-c' + k + '-percentage').innerText = '0%'; $('result-c' + k + '-bar').style.width = '0%'; });
    const note = $('result-note'); if (note) { note.textContent = ''; note.classList.add('hidden'); }
  }
  async function classify() {
    if (!TM.trained) { alert('먼저 1단계 "모델 학습 시작하기" 버튼을 눌러 인공지능을 학습시킨 후 시험해 주세요!'); return; }
    if (!TM.test) { alert('2단계에서 시험할 사진을 골라 주세요.'); return; }
    show(predict(TM.test));
  }

  // ---------- 사진 올리기 ----------
  function pickFiles(multiple) {
    return new Promise((ok) => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = multiple;
      inp.onchange = async () => {
        const out = [];
        for (const f of inp.files) {
          const img = new Image(); img.src = URL.createObjectURL(f);
          await img.decode().catch(() => null);
          if (img.naturalWidth) out.push(toCanvas(img));
          URL.revokeObjectURL(img.src);
        }
        ok(out);
      };
      inp.click();
    });
  }
  async function upload(k) {
    await ready();
    const cs = await pickFiles(true);
    cs.forEach((c) => add(k, c, '올린 사진'));
    render(); if (cs.length) setStatus(`사진 ${cs.length}장을 넣었어요. 다시 학습해 주세요!`);
  }

  // ---------- 웹캠 ----------
  async function camOn() {
    await ready();
    if (TM.stream) return true;
    try {
      TM.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 320, facingMode: 'user' }, audio: false });
    } catch (e) { alert('카메라를 켤 수 없어요. 브라우저의 카메라 허용을 확인해 주세요.'); return false; }
    const v = $('tm-video'); v.srcObject = TM.stream; await v.play();
    $('tm-cam').hidden = false;
    return true;
  }
  function camOff() {
    TM.live = false; clearInterval(TM.hold);
    if (TM.stream) TM.stream.getTracks().forEach((t) => t.stop());
    TM.stream = null; $('tm-cam').hidden = true;
    liveUI();
  }
  function liveUI() {
    const lb = $('tm-live-btn'); if (!lb) return;
    lb.setAttribute('aria-pressed', String(TM.live));
    lb.innerHTML = TM.live ? '<i class="fa-solid fa-stop"></i> 실시간 판별 멈추기' : '<i class="fa-solid fa-video"></i> 웹캠으로 실시간 판별';
  }
  function holdCapture(k, btn) {
    const start = (e) => {
      e.preventDefault();
      if (!TM.stream) { camOn().then((ok) => ok && setStatus('웹캠을 켰어요. 이제 촬영 버튼을 누르고 있으면 사진이 담겨요.')); return; }
      const shot = () => { add(k, toCanvas($('tm-video')), '웹캠 사진'); render(); };
      shot(); TM.hold = setInterval(shot, 180);
    };
    const stop = () => { if (TM.hold) { clearInterval(TM.hold); TM.hold = 0; setStatus('웹캠 사진을 넣었어요. 다시 학습해 주세요!'); } };
    btn.addEventListener('pointerdown', start); ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, stop));
  }
  async function liveTest() {
    if (!TM.trained) { alert('먼저 모델을 학습시켜 주세요!'); return; }
    if (!(await camOn())) return;
    TM.live = !TM.live;
    liveUI();
    const loop = () => {
      if (!TM.live || !TM.stream) return;
      const c = toCanvas($('tm-video'));
      setTest(c, '📷', '웹캠 실시간');
      show(predict(c));
      setTimeout(loop, 250);
    };
    loop();
  }

  // ---------- 페이지 함수 바꿔 끼우기 ----------
  window.renderTrainingGalleries = render;
  window.trainModel = () => { if (!TM.busy) { TM.busy = true; train().finally(() => (TM.busy = false)); } };
  window.runClassification = () => ready().then(classify);
  window.selectTestFood = (emoji, name) => ready().then(() => { TM.live = false; liveUI(); setTest(emojiCanvas(emoji, 4), emoji, name); });
  window.triggerCustomTest = () => ready().then(async () => { TM.live = false; liveUI(); const [c] = await pickFiles(false); if (c) setTest(c, '🖼️', '내가 올린 사진'); });
  window.tmUpload = upload;
  window.tmCamOn = camOn;
  window.tmCamOff = camOff;
  window.tmLiveTest = liveTest;
  window.tmReseed = () => ready().then(seed);

  const origReset = window.resetActivity;
  if (origReset) window.resetActivity = function () {
    const before = S() && S().c1Data;
    origReset.apply(this, arguments);
    if (S() && S().c1Data !== before) { camOff(); TM.trained = false; TM.test = null; clearResult(); const pv = $('tm-test-preview'); if (pv) pv.hidden = true; ready().then(seed).then(defaultTest); }
  };
  const origSwitch = window.switchActivity;
  if (origSwitch) window.switchActivity = function (n) { origSwitch.apply(this, arguments); if (n === 2) ready(); else camOff(); };

  document.addEventListener('DOMContentLoaded', () => {
    holdCapture(1, $('tm-cap-1')); holdCapture(2, $('tm-cap-2'));
    render();
  });
})();
