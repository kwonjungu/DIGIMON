/*
 * 나도 어린이 통계청: 우리 반 그래프 만들기
 * 표에 항목과 수를 넣거나 손을 든 친구 수를 +로 세면, 막대·가로 막대·원·꺾은선·그림그래프가 바로 그려진다.
 * 그래프: Chart.js 4 (MIT, 페이지에 이미 있음). 저장: html2canvas (MIT, 페이지에 이미 있음).
 */
(function () {
  const KEY = 'digimon-1-2-chartlab';
  const COLORS = ['#0B8F78', '#E2525B', '#D98806', '#4B6BD6', '#8A55E6', '#2FAE3A', '#C2410C', '#0E7490'];
  const PRESETS = {
    wish: { title: '우리 반이 키우고 싶은 반려동물', unit: '명', source: '우리 반 손들기 조사', type: 'bar', icon: '🙋',
      rows: [['🐶', '강아지', 0], ['🐱', '고양이', 0], ['🐰', '토끼', 0], ['🐹', '햄스터', 0], ['🐠', '물고기', 0], ['🦜', '앵무새', 0]] },
    have: { title: '우리 반 친구들이 키우는 반려동물', unit: '명', source: '우리 반 손들기 조사', type: 'pict', icon: '🙋',
      rows: [['🐶', '강아지', 0], ['🐱', '고양이', 0], ['🐠', '물고기', 0], ['🐹', '햄스터', 0], ['🚫', '안 키워요', 0]] },
    kosis: { title: '우리나라 반려가구가 키우는 동물(2025)', unit: '%', source: '농림축산식품부·검역본부 「2025년 반려동물 양육현황 조사」', type: 'hbar', icon: '🏠',
      rows: [['🐶', '개', 80.5], ['🐱', '고양이', 14.4], ['🐠', '어류', 4.1], ['🐹', '설치류·포유류', 1.0], ['🦜', '조류', 0.7], ['🦎', '파충류', 0.5]] },
    trend: { title: '강아지 검색 관심도 변화', unit: '점', source: 'Google Trends(연도별 평균, 가장 큰 값을 100으로 환산)', type: 'line', icon: '🔍',
      rows: [['', '2021년', 43], ['', '2022년', 51], ['', '2023년', 60], ['', '2024년', 55]] },
    rescue: { title: '구조된 유실·유기동물 수', unit: '만 마리', source: '농림축산식품부 「2024년 반려동물 보호·복지 실태조사」(2025.5.27. 발표)', type: 'bar', icon: '🐾',
      rows: [['', '2022년', 11.34], ['', '2023년', 11.31], ['', '2024년', 10.68]] },
    registered: { title: '등록된 반려견·반려묘 수(누적)', unit: '만 마리', source: '농림축산식품부 「2024년 반려동물 보호·복지 실태조사」(2025.5.27. 발표)', type: 'bar', icon: '🐾',
      rows: [['', '2022년', 305.4], ['', '2023년', 328.6], ['', '2024년', 349.2]] }
  };

  // ---------- CSV 불러오기 (구글 트렌드에서 내려받은 파일도 그대로) ----------
  function parseCSV(text) {
    const rows = [];
    for (const line of text.replace(/^﻿/, '').split(/\r?\n/)) {
      if (!line.trim()) continue;
      const cells = []; let cur = '', q = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (q) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
        else if (ch === '"') q = true; else if (ch === ',') { cells.push(cur.trim()); cur = ''; } else cur += ch;
      }
      cells.push(cur.trim()); rows.push(cells);
    }
    return rows;
  }
  const num = (v) => { if (v == null) return NaN; const t = String(v).replace(/,/g, '').replace('%', '').trim(); return t === '<1' ? 0.5 : parseFloat(t); };
  function importCSV(text, fileName) {
    const rows = parseCSV(text);
    // 머리줄: 바로 아래 줄들의 둘째 칸부터 숫자가 나오는 첫 줄
    let h = -1;
    for (let i = 0; i < rows.length - 1 && h < 0; i++) {
      if (rows[i].length < 2) continue;
      const next = rows.slice(i + 1, i + 4).filter((r) => r.length === rows[i].length);
      if (next.length && next.every((r) => r.slice(1).some((c) => !isNaN(num(c))))) h = i;
    }
    if (h < 0) return alert('그래프로 만들 수 있는 표를 찾지 못했어요. 첫 칸은 항목, 다음 칸은 숫자인 CSV를 넣어 주세요.');
    const head = rows[h];
    const all = rows.slice(h + 1).filter((r) => r.length === head.length);
    const isNumCol = (j) => all.filter((r) => !isNaN(num(r[j]))).length >= Math.max(1, all.length * 0.6);
    let lab = 0; while (lab + 1 < head.length && !isNumCol(lab + 1)) lab++; // 숫자 열 바로 앞 글자 열을 항목으로
    const cols = head.map((name, j) => ({ name: name || `값 ${j}`, j })).filter((c) => c.j > lab && isNumCol(c.j));
    const body = all.filter((r) => cols.some((c) => !isNaN(num(r[c.j])))).map((r) => { const c = r.slice(); c[0] = r[lab]; return c; });
    if (!body.length || !cols.length) return alert('숫자가 들어 있는 줄을 찾지 못했어요.');
    // 항목 앞에 '분류' 열이 있으면 분류를 고르게 한다
    const cats = lab > 0 ? [...new Set(body.map((r) => all.find((x) => x[lab] === r[0])?.[0]).filter(Boolean))] : [];
    CSV.cat = cats.length > 1 ? cats[cats.length - 1] : null; CSV.catOf = (r) => (all.find((x) => x[lab] === r[0]) || [])[0];
    const cs = $('cl-cat');
    cs.innerHTML = cats.map((c) => `<option ${c === CSV.cat ? 'selected' : ''}>${esc(c)}</option>`).join('');
    $('cl-cat-wrap').hidden = cats.length < 2;
    CSV.head = head; CSV.body = body; CSV.cols = cols; CSV.file = fileName;
    const sel = $('cl-col');
    sel.innerHTML = cols.map((c) => `<option value="${c.j}">${esc(c.name)}</option>`).join('');
    $('cl-col-wrap').hidden = cols.length < 2;
    useColumn(cols[0].j);
  }
  const CSV = { head: null, body: null, cols: null, file: '' };
  function useColumn(j) {
    let pairs = CSV.body.filter((r) => !CSV.cat || CSV.catOf(r) === CSV.cat).map((r) => [/^\d{4}$/.test(r[0]) ? r[0] + '년' : r[0], num(r[j])]).filter((p) => !isNaN(p[1]));
    // 날짜가 많으면(구글 트렌드 주·월 단위) 해마다 평균으로 묶는다
    const dated = pairs.every((p) => /^\d{4}[-./]/.test(p[0]));
    let note = '';
    if (dated && pairs.length > 24) {
      const by = {}, per = pairs.length / new Set(pairs.map((p) => p[0].slice(0, 4))).size;
      pairs.forEach(([d, v]) => { const y = d.slice(0, 4); (by[y] = by[y] || []).push(v); });
      const full = Math.round(per) >= 40 ? 52 : 12; // 주 단위면 52, 달 단위면 12
      pairs = Object.keys(by).sort().map((y) => {
        const n = by[y].length, part = n < full * 0.9 ? `(${full === 12 ? n + '개월' : n + '주'})` : '';
        return [y + '년' + part, Math.round((by[y].reduce((a, b) => a + b, 0) / n) * 10) / 10];
      });
      note = '(해마다 평균)';
    }
    if (pairs.length > 30) { pairs = pairs.slice(-30); note += ' 마지막 30개만'; }
    const colName = (CSV.cols.find((c) => c.j === +j) || {}).name || '';
    const unitM = colName.match(/\(([^()]*(?:%|명|마리|원|점|개|가구)[^()]*)\)\s*$/);
    const base = colName.replace(/\s*:\s*\(.*\)$/, '').replace(/\s*\([^()]*\)\s*$/, '');
    S = clone({ title: (CSV.cat && CSV.cat !== base ? CSV.cat + ' ' : '') + (base === '값' ? '' : base) + ' ' + note.trim(), unit: unitM ? unitM[1].replace(/^값/, '').trim() : '', source: CSV.file + ' 파일', type: pairs.length > 8 ? 'line' : 'bar', icon: '📊',
      rows: pairs.map(([l, v]) => ['', l, v]) });
    syncForm();
  }
  let S = load();
  let chart = null;
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function load() {
    try { const v = JSON.parse(localStorage.getItem(KEY)); if (v && v.rows) return v; } catch (e) {}
    return clone(PRESETS.wish);
  }
  function clone(p) { return JSON.parse(JSON.stringify(Object.assign({ per: 1, note: '' }, p))); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  // ---------- 표 ----------
  function renderTable() {
    const tb = $('cl-rows'); tb.innerHTML = '';
    S.rows.forEach((r, i) => {
      const tr = document.createElement('div'); tr.className = 'cl-row';
      tr.innerHTML = `<input class="cl-emo" value="${esc(r[0])}" aria-label="${i + 1}번 그림" maxlength="4">
        <input class="cl-name" value="${esc(r[1])}" aria-label="${i + 1}번 항목 이름" placeholder="항목 이름">
        <button type="button" class="cl-pm" aria-label="${esc(r[1])} 하나 빼기">−</button>
        <input class="cl-val" type="number" inputmode="decimal" min="0" step="any" value="${r[2]}" aria-label="${esc(r[1])} 값">
        <button type="button" class="cl-pm cl-plus" aria-label="${esc(r[1])} 하나 더하기">+</button>
        <button type="button" class="cl-del" aria-label="${esc(r[1])} 줄 지우기">×</button>`;
      const [emo, name, minus, val, plus, del] = tr.children;
      emo.oninput = () => { r[0] = emo.value; update(); };
      name.oninput = () => { r[1] = name.value; update(); };
      val.oninput = () => { r[2] = parseFloat(val.value) || 0; update(); };
      minus.onclick = () => { r[2] = Math.max(0, +(r[2] - 1).toFixed(2)); val.value = r[2]; update(); };
      plus.onclick = () => { r[2] = +(r[2] + 1).toFixed(2); val.value = r[2]; update(); plus.classList.remove('pop'); void plus.offsetWidth; plus.classList.add('pop'); };
      del.onclick = () => { S.rows.splice(i, 1); renderTable(); update(); };
      tb.appendChild(tr);
    });
  }

  // ---------- 그래프 ----------
  function draw() {
    const labels = S.rows.map((r) => (r[0] ? r[0] + ' ' : '') + r[1]);
    const vals = S.rows.map((r) => r[2]);
    const isPict = S.type === 'pict';
    $('cl-canvas-wrap').hidden = isPict; $('cl-pict').hidden = !isPict;
    $('cl-per-wrap').hidden = !isPict;
    if (isPict) { if (chart) { chart.destroy(); chart = null; } drawPict(); return; }
    const type = { bar: 'bar', hbar: 'bar', pie: 'pie', line: 'line' }[S.type];
    const cfg = {
      type,
      data: { labels, datasets: [{ label: S.unit, data: vals, backgroundColor: type === 'line' ? 'rgba(75,107,214,.15)' : labels.map((_, i) => COLORS[i % COLORS.length]),
        borderColor: type === 'line' ? '#4B6BD6' : '#fff', borderWidth: type === 'line' ? 3 : 1, fill: type === 'line', tension: 0.25, pointRadius: 5, borderRadius: type === 'bar' ? 8 : 0 }] },
      options: {
        responsive: true, maintainAspectRatio: false, animation: { duration: 350 }, indexAxis: S.type === 'hbar' ? 'y' : 'x',
        plugins: { legend: { display: type === 'pie', position: 'right', labels: { font: { size: 14 } } },
          tooltip: { callbacks: { label: (c) => ` ${c.formattedValue}${S.unit}` } } },
        scales: type === 'pie' ? {} : (() => { const intOnly = vals.every((v) => Number.isInteger(v)); const t = { font: { size: 14 } }; const tv = intOnly ? { font: { size: 14 }, precision: 0, stepSize: Math.max(1, Math.ceil(Math.max(...vals, 1) / 10)) } : t; return S.type === 'hbar' ? { x: { ticks: tv, beginAtZero: true }, y: { ticks: t } } : { x: { ticks: t }, y: { ticks: tv, beginAtZero: true } }; })()
      }
    };
    if (chart && chart.config.type === type) { chart.data = cfg.data; chart.options = cfg.options; chart.update(); }
    else { if (chart) chart.destroy(); chart = new Chart($('cl-canvas'), cfg); }
  }
  function drawPict() {
    const per = Math.max(0.1, parseFloat(S.per) || 1);
    const box = $('cl-pict'); box.innerHTML = '';
    S.rows.forEach((r) => {
      const n = r[2] / per, full = Math.floor(n), half = n - full >= 0.5;
      const line = document.createElement('div'); line.className = 'cl-pline';
      const icons = (S.icon || '🙋').repeat(Math.min(full, 60)) + (half ? `<span class="cl-half">${esc(S.icon || '🙋')}</span>` : '');
      line.innerHTML = `<span class="cl-plabel">${esc((r[0] ? r[0] + ' ' : '') + r[1])}</span><span class="cl-picons">${icons || '<i>0</i>'}</span><b>${r[2]}${esc(S.unit)}</b>`;
      box.appendChild(line);
    });
    const legend = document.createElement('p'); legend.className = 'cl-plegend';
    legend.innerHTML = `${esc(S.icon || '🙋')} 하나 = ${per}${esc(S.unit)}${per > 1 ? ' · 반쪽 그림은 그 절반' : ''}`;
    box.appendChild(legend);
  }

  // ---------- 알게 된 점 ----------
  // 단위 끝 글자에 받침이 있으면 '이에요', 없으면 '예요'
  function cop(w, n) {
    if (!w) return /[136780]$/.test(String(n)) ? '이에요' : '예요'; // 단위가 없으면 숫자 끝소리(일·삼·육·칠·팔·십)로 고른다
    const c = w.slice(-1).charCodeAt(0); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 ? '이에요' : '예요';
  }
  const bat = (w) => { const c = String(w).trim().slice(-1).charCodeAt(0); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 > 0; };
  const eun = (w) => esc(w) + (bat(w) ? '은' : '는');
  function insight() {
    const rs = S.rows.filter((r) => r[1]);
    if (!rs.length) { $('cl-facts').innerHTML = ''; return; }
    if (rs.every((r) => !r[2])) { $('cl-facts').innerHTML = '<li>아직 수가 없어요. 손을 든 친구 수를 <b>+</b>로 세거나 숫자를 넣어 봐요.</li>'; return; }
    const sum = rs.reduce((a, r) => a + r[2], 0);
    const max = rs.reduce((a, r) => (r[2] > a[2] ? r : a)), min = rs.reduce((a, r) => (r[2] < a[2] ? r : a));
    const avg = sum / rs.length;
    const f = (x) => (Math.round(x * 100) / 100).toLocaleString('ko-KR');
    const u = esc(S.unit);
    // 연도·날짜 순서 자료는 더하지 않고 '변화'를 말한다
    if (rs.length >= 2 && rs.every((r) => /^\d{4}/.test(r[1]))) {
      const a = rs[0], b = rs[rs.length - 1], d = b[2] - a[2];
      let up = null, down = null;
      for (let i = 1; i < rs.length; i++) {
        const g = rs[i][2] - rs[i - 1][2];
        if (!up || g > up[0]) up = [g, rs[i - 1][1], rs[i][1]];
        if (!down || g < down[0]) down = [g, rs[i - 1][1], rs[i][1]];
      }
      const ts = [
        `${esc(a[1])}(${f(a[2])}${u})에서 ${esc(b[1])}(${f(b[2])}${u})까지 <b>${f(Math.abs(d))}${u} ${d > 0 ? '늘었어요' : d < 0 ? '줄었어요' : '그대로예요'}</b>.`,
        `가장 높은 때: <b>${esc(max[1])}</b> (${f(max[2])}${u}), 가장 낮은 때: <b>${esc(min[1])}</b> (${f(min[2])}${u})`
      ];
      if (up[0] > 0) ts.push(`가장 많이 늘어난 때: ${esc(up[1])}에서 ${esc(up[2])} 사이 (${f(up[0])}${u})`);
      if (down[0] < 0) ts.push(`가장 많이 줄어든 때: ${esc(down[1])}에서 ${esc(down[2])} 사이 (${f(-down[0])}${u})`);
      $('cl-facts').innerHTML = ts.map((t) => `<li>${t}</li>`).join('');
      return;
    }
    const facts = [
      `가장 많은 것: <b>${esc(max[1])}</b> (${f(max[2])}${esc(S.unit)})`,
      `가장 적은 것: <b>${esc(min[1])}</b> (${f(min[2])}${esc(S.unit)})`,
      S.unit === '%' ? `모두 더하면 ${f(sum)}%예요. 여러 개를 고를 수 있는 조사라면 100%가 넘을 수도 있어요.` : `모두 더하면 <b>${f(sum)}${esc(S.unit)}</b>, 평균은 ${f(avg)}${esc(S.unit)}${cop(S.unit, f(avg))}.`
    ];
    if (max[2] > 0 && min[2] > 0) facts.push(`${eun(max[1])} ${esc(min[1])}의 약 <b>${f(max[2] / min[2])}배</b>예요.`);
    $('cl-facts').innerHTML = facts.map((t) => `<li>${t}</li>`).join('');
  }

  function update() {
    $('cl-out-title').textContent = S.title || '제목을 붙여 주세요';
    $('cl-out-source').textContent = S.source ? '출처: ' + S.source : '출처를 꼭 적어요';
    draw(); insight(); save();
  }
  function syncForm() {
    $('cl-title').value = S.title; $('cl-unit').value = S.unit; $('cl-source').value = S.source;
    $('cl-icon').value = S.icon || '🙋'; $('cl-per').value = S.per || 1; $('cl-note').value = S.note || '';
    document.querySelectorAll('[data-cl-type]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.clType === S.type)));
    renderTable(); update();
  }

  function init() {
    if (!$('chartlab')) return;
    $('cl-title').oninput = (e) => { S.title = e.target.value; update(); };
    $('cl-unit').oninput = (e) => { S.unit = e.target.value; update(); };
    $('cl-source').oninput = (e) => { S.source = e.target.value; update(); };
    $('cl-icon').oninput = (e) => { S.icon = e.target.value; update(); };
    $('cl-per').oninput = (e) => { S.per = parseFloat(e.target.value) || 1; update(); };
    $('cl-note').oninput = (e) => { S.note = e.target.value; save(); };
    document.querySelectorAll('[data-cl-type]').forEach((b) => (b.onclick = () => { S.type = b.dataset.clType; syncForm(); }));
    document.querySelectorAll('[data-cl-preset]').forEach((b) => (b.onclick = () => {
      if (S.rows.some((r) => r[2] > 0) && !confirm('지금 만든 그래프를 지우고 새로 시작할까요?')) return;
      S = clone(PRESETS[b.dataset.clPreset]); syncForm();
    }));
    $('cl-csv').onchange = async (e) => {
      const f = e.target.files[0]; if (!f) return;
      const buf = await f.arrayBuffer();
      let text = new TextDecoder('utf-8').decode(buf);
      if (text.includes('�')) text = new TextDecoder('euc-kr').decode(buf); // 엑셀에서 저장한 한글 CSV
      importCSV(text, f.name); e.target.value = '';
    };
    $('cl-col').onchange = (e) => useColumn(e.target.value);
    $('cl-cat').onchange = (e) => { CSV.cat = e.target.value; useColumn($('cl-col').value); };
    $('cl-add').onclick =() => { S.rows.push(['', '', 0]); renderTable(); update(); const ns = document.querySelectorAll('.cl-name'); ns[ns.length - 1].focus(); };
    $('cl-zero').onclick = () => { S.rows.forEach((r) => (r[2] = 0)); renderTable(); update(); };
    $('cl-save').onclick = async () => {
      const el = $('cl-out');
      if (chart) { chart.stop(); chart.options.animation = false; chart.update('none'); }
      const cv = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2 });
      const a = document.createElement('a'); a.download = (S.title || '우리반그래프') + '.png'; a.href = cv.toDataURL('image/png'); a.click();
    };
    syncForm();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.CL = { get state() { return S; } };
})();
