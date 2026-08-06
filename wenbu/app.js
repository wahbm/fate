import { CHARACTER_IMAGES, HEXAGRAM_DATA, LOTS, TRIGRAMS, getHexagram } from './fortune-data.js';

const ritual = document.querySelector('#ritual');
const historyList = document.querySelector('#history-list');
const storageKey = 'wenbu-history-v1';
let coinLines = [];

const esc = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const readHistory = () => { try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; } };
const writeHistory = records => localStorage.setItem(storageKey, JSON.stringify(records.slice(0, 10)));
const formatDate = stamp => new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(stamp));

function renderHexagram(lines, moving = []) {
  const node = document.querySelector('#hexagram-template').content.firstElementChild.cloneNode(true);
  [...lines].reverse().forEach((line, reversedIndex) => {
    const index = lines.length - 1 - reversedIndex;
    const row = document.createElement('span');
    row.className = `yao ${line ? 'yang' : 'yin'}${moving.includes(index) ? ' moving' : ''}`;
    row.innerHTML = line ? '<i></i>' : '<i></i><i></i>';
    node.append(row);
  });
  return node.outerHTML;
}

function addHistory(record) { writeHistory([{ ...record, timestamp: Date.now() }, ...readHistory()]); renderHistory(); }
function renderHistory() {
  const records = readHistory();
  historyList.innerHTML = records.length ? records.map((record, index) => `<button type="button" class="history-item" data-history-index="${index}"><span>${esc(record.type)}</span><strong>${esc(record.title)}</strong><small>${formatDate(record.timestamp)}</small></button>`).join('') : '<p class="history-empty">还没有留下问卜记录。</p>';
}
function openRecord(record) { ritual.classList.remove('hidden'); ritual.innerHTML = `${resultHeader(record.type, record.title)}<div class="record-result"><p class="result-lead">${esc(record.lead)}</p><p>${esc(record.body)}</p><button class="seal-button small" type="button" data-home>再启一问</button></div>`; ritual.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function resultHeader(type, title) { return `<div class="ritual-top"><button class="back" type="button" data-home>← 返回三法</button><p class="eyebrow">${esc(type)} · 结果已现</p><h2>${esc(title)}</h2></div>`; }
function showMethod(name) { ritual.classList.remove('hidden'); ritual.scrollIntoView({ behavior: 'smooth', block: 'start' }); if (name === 'coin') renderCoinStart(); if (name === 'lot') renderLotStart(); if (name === 'character') renderCharacterStart(); }

function renderCoinStart() {
  coinLines = [];
  ritual.innerHTML = `<div class="ritual-top"><button class="back" type="button" data-home>← 返回三法</button><p class="eyebrow">掷铜钱 · 起卦</p><h2>先静心，再起一卦</h2><p>按三钱法自下而上成六爻。结果引《周易》卦辞，不另作吉凶断语。</p></div><div class="coin-stage"><div class="coin-sigil">☯</div><p>无需写下问题。将所问默念三遍，待心绪稍定后开始。</p><button class="seal-button" type="button" id="toss-coin">开始掷钱</button></div>`;
}
function tossCoin() {
  if (coinLines.length >= 6) return;
  const coins = Array.from({ length: 3 }, () => Math.random() > 0.5 ? 1 : 0);
  const value = coins.reduce((sum, item) => sum + item, 0);
  const line = { yang: value >= 2, moving: value === 0 || value === 3, coins };
  coinLines.push(line);
  const count = coinLines.length;
  ritual.innerHTML = `<div class="ritual-top"><button class="back" type="button" data-home>← 舍此一问</button><p class="eyebrow">掷铜钱 · 第 ${count} 爻</p><h2>${count < 6 ? '铜钱已落' : '卦象已成'}</h2></div><div class="coin-stage toss-result"><div class="coin-row">${coins.map(coin => `<span class="coin ${coin ? 'face' : ''}">${coin ? '乾' : '坤'}</span>`).join('')}</div><p>${line.moving ? (line.yang ? '老阳变爻：动中有变。' : '老阴变爻：静处将动。') : (line.yang ? '少阳：一线明朗。' : '少阴：宜藏其锋。')}</p><div class="line-progress">${coinLines.map(item => `<i class="${item.yang ? 'yang' : 'yin'}${item.moving ? ' moving' : ''}"></i>`).join('')}<span>${count}/6</span></div>${count < 6 ? '<button class="seal-button" type="button" id="toss-coin">再掷一次</button>' : '<button class="seal-button" type="button" id="reveal-hexagram">观卦</button>'}</div>`;
}
function revealHexagram() {
  const lines = coinLines.map(item => item.yang ? 1 : 0);
  const moving = coinLines.flatMap((item, index) => item.moving ? [index] : []);
  const changedLines = lines.map((line, index) => moving.includes(index) ? 1 - line : line);
  const base = getHexagram(lines); const changed = getHexagram(changedLines);
  const lineNames = lines.map((line, index) => `${index === 0 ? '初' : index === 5 ? '上' : ['二', '三', '四', '五'][index - 1]}${line ? '九' : '六'}`);
  const motion = moving.length ? `动爻：${moving.map(index => lineNames[index]).join('、')}；变卦为「${changed.name}」。` : '本卦六爻皆静。';
  const lead = `《周易·${base.name}》卦辞：${base.judgement}`;
  const body = `${motion} 本页仅呈现经文与卦变，不以现代语言替代或推演具体事务。`;
  ritual.innerHTML = `${resultHeader('掷铜钱', `${base.name}卦`)}<div class="oracle-result"><div class="hex-pair"><div><p>本卦</p>${renderHexagram(lines, moving)}<strong>${base.name}</strong><small>${base.image}</small></div>${moving.length ? `<span class="transform">→</span><div><p>变卦</p>${renderHexagram(changedLines)}<strong>${changed.name}</strong><small>${changed.image}</small></div>` : ''}</div><article class="reading"><p class="source-label">周易经文</p><p class="result-lead">${lead}</p><p>${body}</p><a class="source-link" href="https://ctext.org/book-of-changes" target="_blank" rel="noreferrer">查阅《周易》原文来源 ↗</a></article><button class="seal-button" type="button" data-save-coin>收下此卦</button><button class="quiet-button" type="button" id="restart-coin">重新起卦</button></div>`;
  ritual.querySelector('[data-save-coin]').addEventListener('click', () => { addHistory({ type: '掷铜钱', title: `${base.name}卦`, lead, body }); ritual.querySelector('[data-save-coin]').textContent = '已收下此卦'; ritual.querySelector('[data-save-coin]').disabled = true; });
}

function renderLotStart() {
  ritual.innerHTML = `<div class="ritual-top"><button class="back" type="button" data-home>← 返回三法</button><p class="eyebrow">抽易签 · 观卦</p><h2>摇一摇签筒</h2><p>此处所抽为六十四卦中的一卦，以其卦辞为签，不冒充任何寺观灵签。</p></div><div class="lot-stage"><div class="lot-tube" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><button class="seal-button" id="draw-lot" type="button">摇签观卦</button></div>`;
}
function drawLot() {
  const lot = LOTS[Math.floor(Math.random() * LOTS.length)];
  const lead = `《周易·${lot.name}》卦辞：${lot.judgement}`;
  const body = `第 ${String(lot.id).padStart(2, '0')} 卦，${lot.image}。此签保留经文原义，不设“上吉/下签”或自创宜忌。`;
  ritual.innerHTML = `${resultHeader('抽易签', `第 ${String(lot.id).padStart(2, '0')} 卦 · ${lot.name}`)}<div class="lot-result"><div class="lot-paper"><span>周易 · 易签</span><strong>${String(lot.id).padStart(2, '0')}</strong><em>${esc(lot.name)}卦</em><p>${esc(lot.judgement)}</p></div><article class="reading"><p class="source-label">周易经文</p><p class="result-lead">${lead}</p><p>${body}</p><a class="source-link" href="https://ctext.org/book-of-changes" target="_blank" rel="noreferrer">查阅《周易》原文来源 ↗</a></article><button class="seal-button" type="button" data-save-lot>收下此签</button><button class="quiet-button" type="button" id="restart-lot">再抽一卦</button></div>`;
  ritual.querySelector('[data-save-lot]').addEventListener('click', () => { addHistory({ type: '抽易签', title: `第${lot.id}卦·${lot.name}`, lead, body }); ritual.querySelector('[data-save-lot]').textContent = '已收下此签'; ritual.querySelector('[data-save-lot]').disabled = true; });
}

function renderCharacterStart() {
  ritual.innerHTML = `<div class="ritual-top"><button class="back" type="button" data-home>← 返回三法</button><p class="eyebrow">算一字 · 取象</p><h2>写下一个字</h2><p>从心中浮现的第一个汉字取意。此为意象测字，并非字形拆解。</p></div><form class="character-form" id="character-form"><label for="character-input">心中所见</label><input id="character-input" name="character" inputmode="text" autocomplete="off" maxlength="1" placeholder="写一个字" aria-describedby="character-error" /><p id="character-error" class="form-error"></p><button class="seal-button" type="submit">以字观心</button></form>`;
  ritual.querySelector('#character-input').focus();
}
function readCharacter(character) {
  const code = character.codePointAt(0); const image = CHARACTER_IMAGES[code % CHARACTER_IMAGES.length];
  const hex = HEXAGRAM_DATA[code % HEXAGRAM_DATA.length];
  const [symbol, element, theme, advice] = image;
  const lead = `「${character}」落于${symbol}象，${theme}。`;
  const body = `此字取${element}之意，与「${hex.name}」卦相应。${advice} 所问不必急求定论，先让心与行动回到同一处。`;
  ritual.innerHTML = `${resultHeader('算一字', `「${esc(character)}」字之象`)}<div class="character-result"><div class="character-glyph"><span>${esc(character)}</span><small>${symbol}象 · ${element}</small></div><article class="reading"><p class="result-lead">${lead}</p><p>${body}</p></article><button class="seal-button" type="button" data-save-character>收下此字</button><button class="quiet-button" type="button" id="restart-character">另测一字</button></div>`;
  ritual.querySelector('[data-save-character]').addEventListener('click', () => { addHistory({ type: '算一字', title: `「${character}」字之象`, lead, body }); ritual.querySelector('[data-save-character]').textContent = '已收下此字'; ritual.querySelector('[data-save-character]').disabled = true; });
}

document.addEventListener('click', event => {
  const method = event.target.closest('[data-method]'); if (method) showMethod(method.dataset.method);
  if (event.target.closest('[data-home]')) { ritual.classList.add('hidden'); document.querySelector('#home').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  if (event.target.closest('#toss-coin')) tossCoin();
  if (event.target.closest('#reveal-hexagram')) revealHexagram();
  if (event.target.closest('#restart-coin')) renderCoinStart();
  if (event.target.closest('#draw-lot')) drawLot();
  if (event.target.closest('#restart-lot')) renderLotStart();
  if (event.target.closest('#restart-character')) renderCharacterStart();
  const history = event.target.closest('[data-history-index]'); if (history) openRecord(readHistory()[Number(history.dataset.historyIndex)]);
  if (event.target.closest('#clear-history')) { localStorage.removeItem(storageKey); renderHistory(); }
});
document.addEventListener('submit', event => {
  if (event.target.id !== 'character-form') return;
  event.preventDefault(); const input = event.target.elements.character; const value = input.value.trim(); const error = ritual.querySelector('#character-error');
  if (!/^[\u3400-\u9fff\uf900-\ufaff]$/u.test(value)) { error.textContent = '请只写下一个汉字。'; input.focus(); return; }
  readCharacter(value);
});
renderHistory();
