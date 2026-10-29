/*
 * 3~4차시 진짜 AI 두 가지
 * 1) AI 그림 맞히기: 짝꿍 그림판(#paint)을 DoodleNet(ml5js/ml5-data-and-models, MIT, Quick, Draw! 345종)으로 맞힌다.
 * 2) 손가락으로 그리기: MediaPipe Hands(tfjs-models hand-pose-detection, Apache-2.0)로 검지 끝을 따라 강아지가 선을 그린다.
 * 텐서플로는 ../vendor/tf.min.js 를 함께 쓴다. 웹캠 영상은 기기 밖으로 나가지 않는다.
 */
(function () {
  const BASE = (document.currentScript && document.currentScript.src.replace(/[^/]*$/, '')) || 'ai/';
  const $ = (id) => document.getElementById(id);
  function loadScript(src) {
    return new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  }
  let tfReady = null;
  // 그래픽 가속(WebGL)을 먼저 쓰고, 안 되면 CPU로 돈다(CPU면 손 인식이 많이 느리다)
  const tfjs = () => (tfReady = tfReady || (window.tf ? Promise.resolve() : loadScript(BASE + '../../vendor/tf.min.js'))
    .then(() => tf.setBackend('webgl').catch(() => false)).then(() => tf.ready()));
  const SLOW_TIP = '이 컴퓨터는 그래픽 가속이 꺼져 있어 손 인식이 느릴 수 있어요. 크롬 설정 > 시스템 > ‘그래픽 가속 사용’을 켜 주세요.';

  // ---------- 1) AI 그림 맞히기 ----------
  const DN = { model: null, names: null, loading: null };
  function doodleReady() {
    if (DN.loading) return DN.loading;
    DN.loading = (async () => {
      await tfjs();
      if (!window.DOODLE_KO) await loadScript(BASE + 'doodle/ko.js');
      const [m, txt] = await Promise.all([tf.loadLayersModel(BASE + 'doodle/model.json'), fetch(BASE + 'doodle/class_names.txt').then((r) => r.text())]);
      DN.model = m; DN.names = txt.split('\n').map((t) => t.trim()).filter(Boolean);
    })().catch((e) => { DN.loading = null; throw e; });
    return DN.loading;
  }
  // 그림이 있는 부분만 잘라 280×280 가운데에 놓는다(ml5 DoodleNet 예제와 같은 크기)
  function cropDrawing(src) {
    const w = src.width, h = src.height, g = src.getContext('2d');
    const d = g.getImageData(0, 0, w, h).data;
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
      const i = (y * w + x) * 4;
      if (d[i + 3] > 20 && d[i] + d[i + 1] + d[i + 2] < 600) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    if (x1 < 0) return null;
    const side = Math.max(x1 - x0, y1 - y0) * 1.15 + 4;
    const c = document.createElement('canvas'); c.width = c.height = 280;
    const cg = c.getContext('2d');
    cg.fillStyle = '#fff'; cg.fillRect(0, 0, 280, 280);
    cg.drawImage(src, (x0 + x1) / 2 - side / 2, (y0 + y1) / 2 - side / 2, side, side, 0, 0, 280, 280);
    return c;
  }
  async function guess() {
    const out = $('ai-guess-out'), btn = $('ai-guess-btn');
    const src = $('paint');
    btn.disabled = true; out.innerHTML = '<p class="ai-wait">AI가 그림을 보는 중이에요...</p>';
    try {
      await doodleReady();
      const c = cropDrawing(src);
      if (!c) { out.innerHTML = '<p class="ai-wait">아직 그림이 없어요. 먼저 그려 주세요.</p>'; return; }
      const p = tf.tidy(() => {
        // 검은 선 = 1. 학습 그림처럼 선을 굵게(9칸) 만든 뒤 28×28로 줄인다
        let x = tf.scalar(1).sub(tf.browser.fromPixels(c).toFloat().div(255)).mean(2, true).expandDims(0);
        x = tf.maxPool(x.greater(0.3).toFloat(), 9, 1, 'same');
        x = tf.image.resizeBilinear(x, [28, 28]).greaterEqual(0.99).toFloat();
        return DN.model.predict(x).dataSync().slice();
      });
      const skip = new Set(window.DOODLE_SKIP || []);
      const list = DN.names.map((n, i) => [n, skip.has(n) ? 0 : p[i]]);
      const sum = list.reduce((a, r) => a + r[1], 0) || 1;
      const top = list.sort((a, b) => b[1] - a[1]).slice(0, 3);
      out.innerHTML = '<ol class="ai-top">' + top.map(([n, v]) =>
        `<li><span>${(window.DOODLE_KO || {})[n] || n.replace(/_/g, ' ')}</span><i style="width:${Math.round((v / sum) * 100)}%"></i><b>${Math.round((v / sum) * 100)}%</b></li>`).join('') +
        '</ol><p class="ai-hint">A가 생각한 동물과 같나요? 다르다면 그림 실력 탓일까요, 프롬프트에 빠진 말 탓일까요?</p>';
    } catch (e) {
      console.error(e); out.innerHTML = '<p class="ai-wait">AI를 불러오지 못했어요. 새로고침해 주세요.</p>';
    } finally { btn.disabled = false; }
  }

  // ---------- 2) 손가락으로 그리기 ----------
  const HD = { det: null, stream: null, on: false, last: null, color: '#E2525B', loading: null, raf: 0 };
  function handReady() {
    if (HD.loading) return HD.loading;
    HD.loading = (async () => {
      await tfjs();
      if (!window.handPoseDetection) await loadScript(BASE + 'hand-pose-detection.min.js');
      HD.det = await handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands, {
        runtime: 'tfjs', modelType: 'lite', maxHands: 1,
        detectorModelUrl: BASE + 'hand/detector/model.json', landmarkModelUrl: BASE + 'hand/landmark/model.json'
      });
    })().catch((e) => { HD.loading = null; throw e; });
    return HD.loading;
  }
  function say(t) { const s = $('hd-status'); if (s) s.textContent = t; }
  async function handStart() {
    if (HD.on) { handStop(); return; }
    say('손 인식 AI를 불러오는 중이에요...');
    try {
      await handReady();
      HD.stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }, audio: false });
    } catch (e) { console.error(e); say('카메라나 AI를 켤 수 없어요. 카메라 허용을 확인해 주세요.'); return; }
    const v = $('hd-video'); v.srcObject = HD.stream; await v.play();
    // 카메라마다 실제 크기가 다르다(640×480, 1280×720 등). 그 크기 그대로 그림판과 화면 비율을 맞춘다
    const W = v.videoWidth || 640, H = v.videoHeight || 480;
    v.width = W; v.height = H; // 손 인식 라이브러리는 영상 크기를 이 속성에서 읽는다(비어 있으면 좌표가 NaN)
    const cv = $('hd-ink'); cv.width = W; cv.height = H;
    $('hd-stage').style.aspectRatio = W + ' / ' + H;
    Object.assign(HD, { W, H, last: null, sm: null, miss: 0, on: true });
    $('hd-start').textContent = '⏹ 카메라 끄기'; $('hd-start').setAttribute('aria-pressed', 'true');
    HD.slow = tf.getBackend() !== 'webgl';
    say(HD.slow ? SLOW_TIP : '검지를 펴고 움직여 보세요. 주먹을 쥐면 붓이 멈춰요.');
    loop();
  }
  function handStop() {
    HD.on = false; cancelAnimationFrame(HD.raf);
    if (HD.stream) HD.stream.getTracks().forEach((t) => t.stop());
    HD.stream = null; $('hd-start').textContent = '📷 카메라 켜고 그리기'; $('hd-start').setAttribute('aria-pressed', 'false');
    $('hd-pet').style.opacity = 0;
    say('카메라를 껐어요. 다시 그리려면 카메라를 켜 주세요.');
  }
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  // 손을 기울여도 되도록 '손목에서 얼마나 멀리 뻗었나'로 판단한다
  function isPointing(k) {
    const w = k[0];
    const indexOut = dist(w, k[8]) > dist(w, k[6]) * 1.12;
    const middleIn = dist(w, k[12]) < dist(w, k[10]) * 1.08;
    return indexOut && middleIn;
  }
  async function loop() {
    if (!HD.on) return;
    const v = $('hd-video'), cv = $('hd-ink'), g = cv.getContext('2d'), pet = $('hd-pet'), stage = $('hd-stage');
    if (v.readyState < 2) { HD.raf = requestAnimationFrame(loop); return; }
    let hands = [];
    try { hands = await HD.det.estimateHands(v, { flipHorizontal: true }); } catch (e) { console.error(e); }
    if (hands.length) {
      const k = hands[0].keypoints, tip = k[8];
      // 떨림을 줄이려고 위치를 부드럽게 따라간다
      HD.sm = HD.sm ? { x: HD.sm.x * 0.45 + tip.x * 0.55, y: HD.sm.y * 0.45 + tip.y * 0.55 } : { x: tip.x, y: tip.y };
      const { x, y } = HD.sm;
      const sx = stage.clientWidth / HD.W, sy = stage.clientHeight / HD.H;
      pet.style.opacity = 1; pet.style.transform = `translate(${x * sx - 28}px, ${y * sy - 28}px)`;
      // 엔트리 무대 좌표(가로 -240~240, 세로 -135~135)로 바꿔 보여 준다
      $('hd-xy').textContent = `x ${Math.round((x - HD.W / 2) * (480 / HD.W))}, y ${Math.round((HD.H / 2 - y) * (270 / HD.H))}`;
      if (isPointing(k)) {
        HD.miss = 0;
        say(HD.slow ? SLOW_TIP : '그리는 중이에요. 주먹을 쥐면 붓이 멈춰요.');
        if (HD.last) { g.strokeStyle = HD.color; g.lineWidth = Math.max(6, HD.W / 70); g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(HD.last.x, HD.last.y); g.lineTo(x, y); g.stroke(); }
        HD.last = { x, y };
      } else if (++HD.miss > 2) { HD.last = null; say('붓을 멈췄어요. 검지만 펴면 다시 그려요.'); }
    } else {
      // 한두 장면 놓친 것은 기다려 주고, 오래 안 보이면 멈춘다
      if (++HD.miss > 4) { HD.last = null; HD.sm = null; pet.style.opacity = 0; say('손이 화면에 보이게 해 주세요.'); }
    }
    HD.raf = requestAnimationFrame(loop);
  }

  // 그림판을 비우거나 다음 판으로 넘어가면 맞히기 결과도 처음으로
  const GUESS_TIP = '<p class="ai-wait">B가 다 그리면 눌러 봐요. 구글 ‘Quick, Draw!’ 낙서 그림으로 배운 AI가 345가지 가운데에서 맞혀요.</p>';
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('button'); if (!b) return;
    if (b.id === 'saveRound' || b.id === 'redraw' || (b.closest('#tools') && b.textContent.includes('모두 지우기'))) { const o = $('ai-guess-out'); if (o) o.innerHTML = GUESS_TIP; }
  });
  window.aiGuessDrawing = guess;
  window.hdStart = handStart;
  window.hdClear = () => { const cv = $('hd-ink'); cv.getContext('2d').clearRect(0, 0, cv.width, cv.height); };
  window.hdColor = (c, btn) => { HD.color = c; document.querySelectorAll('.hd-colors button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn))); };
  window.hdSave = () => {
    const src = $('hd-ink'), c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(src, 0, 0);
    const a = document.createElement('a'); a.download = '손가락그림.png'; a.href = c.toDataURL('image/png'); a.click();
  };
  // 다른 탭으로 가면 카메라를 끈다
  document.addEventListener('click', (e) => { const t = e.target.closest && e.target.closest('.tab'); if (t && HD.on && t.dataset.t !== 'act3') handStop(); });
})();
