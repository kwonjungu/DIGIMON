/*
 * 소리 AI 실험실 (티처블 머신 오디오 경량판)
 * - 소리 인식: TensorFlow.js speech-commands 0.5.4 + BROWSER_FFT 18w 기본 모델 (Apache-2.0, github.com/tensorflow/tfjs-models)
 * - 학생이 녹음한 '배경 소음 / 앞 / 뒤'로 전이 학습한 뒤, 말하면 동물이 앞뒤로 움직인다.
 * - 활동 3: 실제 마이크 소음 측정기와 교실 소음 틀기.
 */
(function () {
  const BASE = (document.currentScript && document.currentScript.src.replace(/[^/]*$/, '')) || 'sc/';
  const WORDS = [
    { key: '_background_noise_', name: '배경 소음', need: 8, tip: '아무 말도 하지 않고 교실 소리만 녹음해요' },
    { key: '앞', name: '앞', need: 8, tip: '"앞" 또는 "앞으로"를 또렷하게 말해요' },
    { key: '뒤', name: '뒤', need: 8, tip: '"뒤" 또는 "뒤로"를 또렷하게 말해요' }
  ];
  const SC = { rec: null, tr: null, trained: false, listening: false, busy: false, x: 50, log: [] };
  window.SC = SC;
  const $ = (id) => document.getElementById(id);
  // 교실 소리를 있는 그대로 듣도록 브라우저의 소리 보정을 끈다
  const RAW = { echoCancellation: false, noiseSuppression: false, autoGainControl: false }; // 소음 측정기용
  const VOICE = { noiseSuppression: false, autoGainControl: false }; // 소리 AI용(에코 제거를 끄면 녹음이 느려진다)
  const say = (t) => { const s = $('sc-status'); if (s) s.textContent = t; };

  function loadScript(src) {
    return new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  }
  let loading = null;
  function ready() {
    if (loading) return loading;
    say('소리 AI 두뇌를 불러오는 중이에요...');
    loading = (async () => {
      if (!window.tf) await loadScript(BASE + '../../vendor/tf.min.js');
      if (!window.speechCommands) await loadScript(BASE + 'speech-commands.min.js');
      SC.rec = speechCommands.create('BROWSER_FFT', undefined, BASE + 'model/model.json', BASE + 'model/metadata.json');
      await SC.rec.ensureModelLoaded();
      SC.tr = SC.rec.createTransfer('digimon-' + Date.now());
      say('준비됐어요. 배경 소음부터 녹음해요. (처음 녹음할 때 마이크 허용을 눌러 주세요)');
    })().catch((e) => { loading = null; say('소리 AI를 불러오지 못했어요. 새로고침해 주세요.'); console.error(e); throw e; });
    return loading;
  }

  function safeCounts() { try { return SC.tr.countExamples(); } catch (e) { return {}; } }
  function render() {
    const c = safeCounts();
    WORDS.forEach((w, i) => {
      const n = c[w.key] || 0;
      $('sc-n-' + i).textContent = n + '번';
      $('sc-bar-' + i).style.width = Math.min(100, (n / w.need) * 100) + '%';
    });
    const ok = WORDS.every((w) => (c[w.key] || 0) >= 2);
    $('sc-train').disabled = !ok || SC.busy;
  }

  async function record(i) {
    if (SC.busy) return;
    SC.busy = true;
    try { await ready(); } catch (e) { SC.busy = false; return; }
    if (SC.listening) await stopListen();
    const btn = $('sc-rec-' + i); btn.classList.add('rec');
    try {
      const w = WORDS[i];
      say(`🎙️ "${w.name}" 녹음 중... (1초)`);
      await SC.tr.collectExample(w.key, { audioTrackConstraints: VOICE });
      SC.trained = false;
      say(`"${w.name}" 녹음 완료. ${w.need}번 넘게 모으면 더 잘 알아들어요.`);
    } catch (e) {
      say('마이크를 쓸 수 없어요. 브라우저 주소창 옆에서 마이크를 허용해 주세요.'); console.error(e);
    } finally { SC.busy = false; btn.classList.remove('rec'); render(); }
  }

  async function train() {
    if (SC.busy) return;
    await ready();
    SC.busy = true; render();
    const bar = $('sc-train-bar'); const EPOCHS = 25;
    try {
      await SC.tr.train({ epochs: EPOCHS, callback: { onEpochEnd: async (e, logs) => {
        bar.style.width = Math.round(((e + 1) / EPOCHS) * 100) + '%';
        say(`${e + 1}/${EPOCHS}번째 학습 중 · 녹음 맞힘 ${Math.round((logs.acc ?? logs.accuracy ?? 0) * 100)}%`);
      } } });
      SC.trained = true;
      say('학습 완료! "듣기 시작"을 누르고 앞, 뒤를 말해 봐요. 🎉');
    } catch (e) { say('학습하지 못했어요. 녹음을 조금 더 모아 주세요.'); console.error(e); }
    SC.busy = false; render();
  }

  function move(word) {
    if (word === '앞') SC.x = Math.min(92, SC.x + 12);
    if (word === '뒤') SC.x = Math.max(8, SC.x - 12);
    const pet = $('sc-pet'); pet.style.left = SC.x + '%';
    pet.classList.remove('hop'); void pet.offsetWidth; pet.classList.add('hop');
  }
  async function listen() {
    if (!SC.trained) { alert('먼저 녹음을 모으고 "학습하기"를 눌러 주세요!'); return; }
    if (SC.listening) { await stopListen(); return; }
    const labels = SC.tr.wordLabels();
    await SC.tr.listen((res) => {
      const s = Array.from(res.scores);
      labels.forEach((k, j) => {
        const i = WORDS.findIndex((w) => w.key === k);
        if (i < 0) return;
        $('sc-score-' + i).style.width = Math.round(s[j] * 100) + '%';
        $('sc-pct-' + i).textContent = Math.round(s[j] * 100) + '%';
      });
      const top = s.indexOf(Math.max(...s)), word = labels[top], conf = s[top];
      if (word !== '_background_noise_' && conf >= 0.8) {
        move(word);
        const hit = `${word} (${Math.round(conf * 100)}%)`;
        $('sc-heard').textContent = hit;
        const m = $('sc-mini-heard'); if (m) m.textContent = hit;
        SC.log.unshift(hit); SC.log = SC.log.slice(0, 6);
        const lg = $('sc-mini-log'); if (lg) lg.textContent = SC.log.join(' · ');
      }
    }, { probabilityThreshold: 0, overlapFactor: 0.5, includeSpectrogram: false, invokeCallbackOnNoiseAndUnknown: true, audioTrackConstraints: VOICE });
    SC.listening = true; setListenUI();
    say('듣는 중이에요. 앞, 뒤를 말해 봐요.');
  }
  async function stopListen() {
    if (SC.tr && SC.tr.isListening()) await SC.tr.stopListening();
    if (SC.listening) say('듣기를 멈췄어요. 다시 누르면 또 들어요.');
    SC.listening = false; setListenUI();
  }
  function setListenUI() {
    ['sc-listen', 'sc-mini-listen'].forEach((id) => {
      const b = $(id); if (!b) return;
      b.setAttribute('aria-pressed', String(SC.listening));
      b.textContent = SC.listening ? '⏹ 듣기 멈추기' : '👂 듣기 시작';
    });
  }

  // ---------- 활동 3: 소음 측정기와 교실 소음 ----------
  const NZ = { ctx: null, an: null, stream: null, raf: 0, noise: null, gain: null };
  async function meter() {
    if (NZ.stream) { stopMeter(); return; }
    try { NZ.stream = await navigator.mediaDevices.getUserMedia({ audio: RAW }); }
    catch (e) { alert('마이크를 쓸 수 없어요. 브라우저에서 마이크를 허용해 주세요.'); return; }
    NZ.ctx = NZ.ctx || new (window.AudioContext || window.webkitAudioContext)();
    const src = NZ.ctx.createMediaStreamSource(NZ.stream);
    NZ.an = NZ.ctx.createAnalyser(); NZ.an.fftSize = 1024; src.connect(NZ.an);
    const buf = new Float32Array(NZ.an.fftSize);
    let peak = 0;
    const tick = () => {
      NZ.an.getFloatTimeDomainData(buf);
      let sum = 0; for (const v of buf) sum += v * v;
      const db = 20 * Math.log10(Math.sqrt(sum / buf.length) + 1e-8); // -100 ~ 0
      const lv = Math.max(0, Math.min(100, Math.round((db + 70) * 1.6)));
      peak = Math.max(lv, peak - 1);
      $('nz-bar').style.width = lv + '%'; $('nz-peak').style.left = peak + '%';
      $('nz-val').textContent = lv;
      $('nz-word').textContent = lv < 25 ? '조용해요' : lv < 50 ? '보통이에요' : lv < 75 ? '시끄러워요' : '아주 시끄러워요!';
      NZ.raf = requestAnimationFrame(tick);
    };
    tick();
    $('nz-meter-btn').textContent = '⏹ 측정 멈추기';
  }
  function stopMeter() {
    cancelAnimationFrame(NZ.raf);
    if (NZ.stream) NZ.stream.getTracks().forEach((t) => t.stop());
    NZ.stream = null; $('nz-meter-btn').textContent = '🎚️ 소음 측정 시작';
  }
  function classroomNoise() {
    NZ.ctx = NZ.ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (NZ.noise) { NZ.noise.stop(); NZ.noise = null; $('nz-play-btn').textContent = '🔊 교실 소음 틀기'; return; }
    // 웅성거림 비슷한 소리: 분홍빛 잡음 + 말소리 대역 필터 + 느린 크기 흔들림
    const len = NZ.ctx.sampleRate * 4, b = NZ.ctx.createBuffer(1, len, NZ.ctx.sampleRate), d = b.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + w * 0.029; b1 = 0.985 * b1 + w * 0.032; b2 = 0.95 * b2 + w * 0.048;
      const env = 0.55 + 0.45 * Math.sin(i / NZ.ctx.sampleRate * 2 * Math.PI * (3 + 2 * Math.sin(i / 9000)));
      d[i] = (b0 + b1 + b2) * env;
    }
    const src = NZ.ctx.createBufferSource(); src.buffer = b; src.loop = true;
    const bp = NZ.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.7;
    const g = NZ.ctx.createGain(); g.gain.value = parseFloat($('nz-vol').value);
    src.connect(bp).connect(g).connect(NZ.ctx.destination); src.start();
    NZ.noise = src; NZ.gain = g;
    $('nz-play-btn').textContent = '⏹ 소음 멈추기';
  }

  window.scRecord = record;
  window.scTrain = train;
  window.scListen = () => ready().then(listen);
  window.scMeter = meter;
  window.scNoise = classroomNoise;
  window.scVol = (v) => { if (NZ.gain) NZ.gain.gain.value = parseFloat(v); };
  window.scReset = async () => { if (!SC.tr) return; await stopListen(); SC.tr.clearExamples(); SC.trained = false; render(); say('녹음을 모두 지웠어요. 다시 모아 봐요.'); };

  const origOpen = window.openTab;
  if (origOpen) window.openTab = function (n) { origOpen.apply(this, arguments); if (n !== '3') { stopMeter(); if (NZ.noise) classroomNoise(); } if (n === '2' && SC.listening) stopListen(); };
  document.addEventListener('DOMContentLoaded', () => { render(); });
})();
