const TEMPLATE = `
  <main class="page-shell">
    <header class="site-header">
      <a class="brand" href="#/" aria-label="返回 FATE 首页"><span>命</span>运</a>
      <p>一局一命 · 不留痕迹</p>
      <button class="text-button" id="restart-button" type="button">重开此局</button>
      <a class="text-button" href="#/">返回总览</a>
    </header>

    <section class="hero">
      <div>
        <p class="eyebrow">FATE / 01</p>
        <h1>酒色财气</h1>
        <p class="intro">翻开藏于八方的牌，收拢命中注定的对子。<br />最终的四处落牌，照见这一局的酒、色、财、气。</p>
      </div>
      <div class="hero-rule">
        <span>本局手牌</span>
        <strong id="hand-count">12</strong>
        <em>张</em>
      </div>
    </section>

    <section class="game-layout" aria-label="酒色财气牌局">
      <aside class="side-panel storage-panel">
        <div class="panel-heading"><span>已收之牌</span><strong id="storage-count">0 对</strong></div>
        <div class="storage-cards" id="storage-cards" aria-label="存牌区"></div>
        <p class="panel-note">按收取顺序，最终轮流落入酒、色、财、气。</p>
      </aside>

      <section class="table-wrap">
        <div class="table-frame">
          <div class="compass-mark north">北</div>
          <div class="compass-mark east">东</div>
          <div class="compass-mark south">南</div>
          <div class="compass-mark west">西</div>
          <div class="table-felt" id="table-felt">
            <div class="station station-n" data-station="north"></div>
            <div class="station station-ne" data-station="northeast"></div>
            <div class="station station-e" data-station="east"></div>
            <div class="station station-se" data-station="southeast"></div>
            <div class="station station-s" data-station="south"></div>
            <div class="station station-sw" data-station="southwest"></div>
            <div class="station station-w" data-station="west"></div>
            <div class="station station-nw" data-station="northwest"></div>
            <div class="center-pile" id="center-pile"></div>
            <div class="hand-zone" id="hand-zone" aria-label="手牌"></div>
            <div class="table-seal">酒色<br />财气</div>
          </div>
        </div>
        <p class="table-caption">八方牌阵 · 从北起顺时针发牌</p>
      </section>

      <aside class="side-panel action-panel">
        <p class="eyebrow">行牌提示</p>
        <h2 id="status-title">正在布阵</h2>
        <p class="status-copy" id="status-copy">牌已布好，正在查看八方明牌。</p>
        <div class="choice-area" id="choice-area" aria-live="polite"></div>
        <div class="legend"><span><i class="legend-up"></i>明牌</span><span><i class="legend-down"></i>暗牌</span></div>
      </aside>
    </section>

    <section class="rules-strip">
      <span>同点数即可成对</span><i></i><span>中央牌仅首尾可配</span><i></i><span>终局仅同堆一明一暗可配</span>
    </section>
  </main>

  <dialog class="result-dialog" id="result-dialog">
    <div class="result-topline" id="result-topline">本局收束</div>
    <h2>酒色财气</h2>
    <p class="lucky-result">你的幸运方位：<strong id="lucky-direction">—</strong></p>
    <div class="fortune-grid" id="fortune-grid"></div>
    <p class="result-note" id="result-note"></p>
    <section class="unresolved-record" id="unresolved-record" hidden aria-label="未收拢的牌">
      <h3>未收拢的牌</h3>
      <p id="unresolved-note"></p>
    </section>
    <details class="game-record" id="game-record">
      <summary>本局牌谱／结算明细</summary>
      <p class="record-intro">按收牌顺序归入酒、色、财、气；同一项凑齐四张同点数牌才计分。</p>
      <div class="record-list" id="record-list"></div>
    </details>
    <button class="primary-button" id="dialog-restart" type="button">再启一局</button>
  </dialog>

  <template id="card-template">
    <div class="card"><span class="rank"></span><span class="suit"></span><span class="card-rank-large"></span></div>
  </template>
`;

export function mount(root) {
  root.innerHTML = TEMPLATE;
  const STATIONS = [
  { id: 'north', name: '北' }, { id: 'northeast', name: '东北' }, { id: 'east', name: '东' }, { id: 'southeast', name: '东南' },
  { id: 'south', name: '南' }, { id: 'southwest', name: '西南' }, { id: 'west', name: '西' }, { id: 'northwest', name: '西北' },
  ];
  const SUITS = [{ symbol: '♠', red: false }, { symbol: '♥', red: true }, { symbol: '♣', red: false }, { symbol: '♦', red: true }];
  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const VALUE = Object.fromEntries(RANKS.map((rank, index) => [rank, index + 1]));
  const els = {
    handCount: root.querySelector('#hand-count'), storageCount: root.querySelector('#storage-count'), storageCards: root.querySelector('#storage-cards'),
    centerPile: root.querySelector('#center-pile'), handZone: root.querySelector('#hand-zone'), statusTitle: root.querySelector('#status-title'),
    statusCopy: root.querySelector('#status-copy'), choiceArea: root.querySelector('#choice-area'), restartButton: root.querySelector('#restart-button'),
    dialogRestart: root.querySelector('#dialog-restart'), resultDialog: root.querySelector('#result-dialog'), luckyDirection: root.querySelector('#lucky-direction'),
    fortuneGrid: root.querySelector('#fortune-grid'), resultTopline: root.querySelector('#result-topline'), resultNote: root.querySelector('#result-note'),
    unresolvedRecord: root.querySelector('#unresolved-record'), unresolvedNote: root.querySelector('#unresolved-note'), recordList: root.querySelector('#record-list'),
  };
  let game;
  let terminalTimer = null;

function shuffledDeck() {
  const deck = SUITS.flatMap(suit => RANKS.map(rank => ({ rank, ...suit })));
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  return deck;
}

function startGame() {
  if (terminalTimer) window.clearTimeout(terminalTimer);
  terminalTimer = null;
  const deck = shuffledDeck();
  game = { stations: Object.fromEntries(STATIONS.map(s => [s.id, { ...s, dark: [], face: null }])), hand: [], center: [], storage: [], lucky: null, complete: false, phase: null, selection: null };
  for (let round = 0; round < 4; round++) STATIONS.forEach(s => game.stations[s.id].dark.push(deck.shift()));
  STATIONS.forEach(s => { game.stations[s.id].face = deck.shift(); });
  game.hand = deck;
  if (els.resultDialog.open) els.resultDialog.close();
  evaluate();
}

function cardElement(card, className = '') {
  const node = root.querySelector('#card-template').content.firstElementChild.cloneNode(true);
  if (className) node.classList.add(className);
  if (!card) return node;
  node.classList.toggle('red', card.red);
  node.querySelector('.rank').textContent = card.rank;
  node.querySelector('.suit').textContent = card.symbol;
  node.querySelector('.card-rank-large').textContent = card.rank;
  node.setAttribute('aria-label', `${card.rank}${card.symbol}`);
  return node;
}
function cardBack() { return cardElement(null, 'back'); }
function setStatus(title, copy) { els.statusTitle.textContent = title; els.statusCopy.textContent = copy; }
function setGuide(text) { els.choiceArea.textContent = text; }

function makeClickable(node, action, label) {
  node.classList.add('can-select'); node.setAttribute('role', 'button'); node.setAttribute('tabindex', '0'); node.setAttribute('aria-label', label);
  node.addEventListener('click', action);
  node.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); action(); } });
}

function refresh() {
  STATIONS.forEach(({ id }) => renderStation(game.stations[id]));
  renderCenter(); renderHand(); renderStorage();
  els.handCount.textContent = game.hand.length;
  els.storageCount.textContent = `${game.storage.length} 对`;
}

function renderStation(station) {
  const stationRoot = root.querySelector(`[data-station="${station.id}"]`);
  stationRoot.replaceChildren();
  const isTerminalMatch = game.phase === 'terminal' && terminalMatchingStationIds().includes(station.id);
  stationRoot.classList.toggle('terminal-match', isTerminalMatch);
  const name = document.createElement('span'); name.className = 'station-name'; name.textContent = station.name; stationRoot.append(name);
  if (station.dark.length) {
    const dark = cardBack();
    if (isTerminalMatch) dark.classList.add('terminal-card');
    stationRoot.append(dark);
  }
  if (station.face) {
    const face = cardElement(station.face, 'active-card');
    if (isTerminalMatch) face.classList.add('terminal-card');
    if (stationIsSelectable(station.id)) makeClickable(face, () => selectStation(station.id), `${station.name}方 ${station.face.rank}${station.face.symbol}`);
    if ((game.selection?.kind === 'desk' || game.selection?.kind === 'station') && game.selection.station === station.id) face.classList.add('is-selected');
    stationRoot.append(face);
  }
  const count = document.createElement('span'); count.className = 'station-count'; count.textContent = `暗牌 ${station.dark.length}`; stationRoot.append(count);
  if (game.lucky === station.id) { const lucky = document.createElement('span'); lucky.className = 'station-lucky'; lucky.textContent = '✦ 幸运方位'; stationRoot.append(lucky); }
}

function renderCenter() {
  els.centerPile.replaceChildren();
  if (game.center.length) {
    const count = document.createElement('span');
    count.className = 'center-count';
    count.textContent = `中央牌叠 · ${game.center.length} 张`;
    count.title = '仅最上与最下的牌可以参与配对';
    els.centerPile.setAttribute('aria-label', `中央牌叠，共 ${game.center.length} 张；仅最上与最下可配对`);
    els.centerPile.append(count);
  } else {
    els.centerPile.setAttribute('aria-label', '中央牌叠为空');
  }
  game.center.forEach((card, index) => {
    if (index !== 0 && index !== game.center.length - 1) return;
    const node = cardElement(card, 'center-card'); node.dataset.centerIndex = index;
    if (centerIsSelectable(index)) makeClickable(node, () => selectCenterCard(index), `中央${centerPosition(index)} ${card.rank}${card.symbol}`);
    if (game.selection?.kind === 'center' && game.selection.index === index) node.classList.add('is-selected');
    els.centerPile.append(node);
  });
}

function renderHand() {
  els.handZone.replaceChildren();
  if (!game.hand.length) return;
  const label = document.createElement('span'); label.className = 'hand-label'; label.textContent = `手牌 · ${game.hand.length}`; els.handZone.append(label);
  game.hand.forEach((_, index) => {
    const card = cardBack(); card.classList.add('hand-card');
    card.style.zIndex = index + 1; card.style.transform = `translate(${index * 1.45}px, ${-index * .35}px)`;
    if (index === game.hand.length - 1 && game.phase === 'hand') makeClickable(card, drawHand, `翻开一张手牌，剩余 ${game.hand.length} 张`);
    els.handZone.append(card);
  });
}

function renderStorage() {
  els.storageCards.replaceChildren();
  game.storage.forEach(({ cards }) => { const pairEl = document.createElement('div'); pairEl.className = 'mini-pair'; cards.forEach(card => pairEl.append(cardElement(card))); els.storageCards.append(pairEl); });
}

function pairGroups(cards) {
  const groups = new Map();
  cards.forEach(item => { const list = groups.get(item.card.rank) || []; list.push(item); groups.set(item.card.rank, list); });
  return [...groups.entries()].filter(([, list]) => list.length >= 2);
}
function deskGroups() { return pairGroups(STATIONS.flatMap(s => game.stations[s.id].face ? [{ station: s.id, card: game.stations[s.id].face }] : [])); }
function deskPairStationIds() { return new Set(deskGroups().flatMap(([, items]) => items.map(item => item.station))); }
function hasDeskPairs() { return deskGroups().length > 0; }
function matchingCenterIndexes(stationId) {
  const station = game.stations[stationId];
  if (!station?.face || !game.center.length) return [];
  return [0, game.center.length - 1].filter((index, position, list) => list.indexOf(index) === position && game.center[index].rank === station.face.rank);
}
function hasCenterPairs() { return game.center.length > 0 && STATIONS.some(({ id }) => matchingCenterIndexes(id).length > 0); }
function centerPosition(index) { return index === game.center.length - 1 ? '最上' : '最下'; }

function stationIsSelectable(stationId) {
  if (game.phase === 'desk') return deskPairStationIds().has(stationId);
  if (game.phase !== 'center') return false;
  if (game.selection?.kind === 'center') return game.stations[stationId].face?.rank === game.center[game.selection.index].rank;
  return matchingCenterIndexes(stationId).length > 0;
}
function centerIsSelectable(index) {
  if (game.phase !== 'center') return false;
  if (game.selection?.kind === 'station') return matchingCenterIndexes(game.selection.station).includes(index);
  return STATIONS.some(({ id }) => matchingCenterIndexes(id).includes(index));
}

function evaluate() {
  if (game.complete) return;
  if (hasDeskPairs()) {
    game.phase = 'desk'; game.selection = null;
    setStatus('桌面可成对', '请直接点击桌上两张同点数的明牌，将它们收入存牌区。');
    setGuide('发光的明牌可被选择；先点一张，再点同点数的另一张。'); refresh(); return;
  }
  if (hasCenterPairs()) {
    game.phase = 'center'; game.selection = null;
    setStatus('中央牌可成对', '中央牌叠仅最上与最下的牌可以参与配对。');
    setGuide('依次点击中央发光牌与同点数的桌面明牌，顺序不限。'); refresh(); return;
  }
  if (game.hand.length) {
    game.phase = 'hand'; game.selection = null;
    setStatus('暂无可配之牌', '请翻开一张手牌，置入中央牌叠。');
    setGuide('点击牌桌下方发光的手牌牌叠，即可翻开下一张。'); refresh(); return;
  }
  beginTerminalCheck();
}

function selectStation(stationId) {
  if (game.phase === 'desk') {
    if (game.selection?.kind === 'desk' && game.selection.station === stationId) { game.selection = null; setGuide('已取消选择。请点击两张同点数的明牌。'); refresh(); return; }
    if (game.selection?.kind === 'desk' && game.stations[game.selection.station].face.rank === game.stations[stationId].face.rank) { collectDeskPair(game.selection.station, stationId); return; }
    game.selection = { kind: 'desk', station: stationId };
    setGuide(`已选择${game.stations[stationId].name}方 ${game.stations[stationId].face.rank}，请点击另一张同点数明牌。`); refresh(); return;
  }
  if (game.phase === 'center') {
    if (game.selection?.kind === 'center' && game.center[game.selection.index].rank === game.stations[stationId].face.rank) { collectCenterPair(game.selection.index, stationId); return; }
    game.selection = { kind: 'station', station: stationId };
    setGuide(`已选择${game.stations[stationId].name}方 ${game.stations[stationId].face.rank}，请点击中央同点数牌。`); refresh();
  }
}

function selectCenterCard(index) {
  if (game.phase !== 'center') return;
  if (game.selection?.kind === 'station' && game.center[index].rank === game.stations[game.selection.station].face.rank) { collectCenterPair(index, game.selection.station); return; }
  if (game.selection?.kind === 'center' && game.selection.index === index) { game.selection = null; setGuide('已取消选择。请点击中央发光牌与同点数的桌面明牌。'); refresh(); return; }
  game.selection = { kind: 'center', index };
  setGuide(`已选择中央${centerPosition(index)} ${game.center[index].rank}，请点击桌上同点数明牌。`); refresh();
}

function sourceCard(stationId) { return root.querySelector(`[data-station="${stationId}"] .active-card`); }
function sourceCenterCard(index) { return root.querySelector(`.center-card[data-center-index="${index}"]`); }

function animateCollection(cards, sourceNodes) {
  const destination = els.storageCards.getBoundingClientRect();
  const storageIsVisible = destination.width > 0 && destination.height > 0;
  const table = root.querySelector('#table-felt').getBoundingClientRect();
  const destinationX = storageIsVisible ? destination.left + 16 : table.left + 18;
  const destinationY = storageIsVisible ? destination.top + 18 : table.top + table.height * .68;
  const nextFrame = window.requestAnimationFrame || (callback => window.setTimeout(callback, 0));

  sourceNodes.filter(Boolean).forEach((sourceNode, index) => {
    const source = sourceNode.getBoundingClientRect();
    if (!source.width || !source.height) return;
    const ghost = cardElement(cards[index], 'collection-ghost');
    ghost.setAttribute('aria-hidden', 'true');
    ghost.style.left = `${source.left}px`;
    ghost.style.top = `${source.top}px`;
    ghost.style.width = `${source.width}px`;
    ghost.style.height = `${source.height}px`;
    document.body.append(ghost);
    nextFrame(() => {
      ghost.classList.add('is-flying');
      ghost.style.transform = `translate(${destinationX + index * 11 - source.left}px, ${destinationY + index * 4 - source.top}px) scale(.54) rotate(${index ? 7 : -7}deg)`;
    });
    window.setTimeout(() => ghost.remove(), 720);
  });

  els.storageCount.classList.remove('is-updated');
  nextFrame(() => els.storageCount.classList.add('is-updated'));
  window.setTimeout(() => els.storageCount.classList.remove('is-updated'), 560);
}

function collectPair(cards, source, sourceNodes = []) {
  game.storage.push({ cards, source });
  animateCollection(cards, sourceNodes);
}
function collectDeskPair(firstId, secondId) {
  const first = game.stations[firstId], second = game.stations[secondId];
  collectPair([first.face, second.face], `桌面配对：${first.name}方与${second.name}方`, [sourceCard(firstId), sourceCard(secondId)]);
  revealNext(first); revealNext(second); evaluate();
}
function collectCenterPair(centerIndex, stationId) {
  const station = game.stations[stationId]; const centralNode = sourceCenterCard(centerIndex); const stationNode = sourceCard(stationId); const central = game.center.splice(centerIndex, 1)[0];
  collectPair([central, station.face], `中央${centerPosition(centerIndex)}牌与${station.name}方`, [centralNode, stationNode]);
  revealNext(station); evaluate();
}
function revealNext(station) { station.face = station.dark.shift() || null; if (!station.face && !game.lucky) game.lucky = station.id; }
function drawHand() { if (game.phase === 'hand' && game.hand.length) { game.center.push(game.hand.pop()); evaluate(); } }

function unresolvedCards() {
  const stations = STATIONS.flatMap(({ id, name }) => {
    const station = game.stations[id];
    return [
      ...(station.face ? [{ card: station.face, place: `${name}方明牌` }] : []),
      ...station.dark.map(card => ({ card, place: `${name}方暗牌` })),
    ];
  });
  return [...stations, ...game.center.map(card => ({ card, place: '中央牌叠' }))];
}

function terminalMatchingStationIds() {
  return STATIONS.filter(({ id }) => {
    const station = game.stations[id];
    return station.face && station.dark.length === 1 && station.face.rank === station.dark[0].rank;
  }).map(({ id }) => id);
}

function beginTerminalCheck() {
  if (game.phase === 'terminal' || game.complete) return;
  const matches = terminalMatchingStationIds();
  game.phase = 'terminal';
  game.selection = null;
  setStatus('终局检查', '手牌已尽，正在逐堆检查是否恰好剩下一明一暗。');
  setGuide(matches.length
    ? `高亮的 ${matches.map(id => game.stations[id].name).join('、')}方牌堆符合条件，将自动收入存牌区；其余牌堆保持原状。`
    : '没有牌堆符合“一明一暗且同点数”的终局配对条件，未收拢的牌将保留在结算明细中。');
  refresh();
  terminalTimer = window.setTimeout(() => {
    terminalTimer = null;
    if (game.phase === 'terminal' && !game.complete) finishGame();
  }, matches.length ? 1600 : 1000);
}

function settleTerminalStationPairs() {
  terminalMatchingStationIds().forEach(id => {
    const station = game.stations[id];
    if (station) {
      collectPair([station.face, station.dark[0]], `终局配对：${station.name}方`, [sourceCard(id), root.querySelector(`[data-station="${id}"] .back`)]);
      station.face = null;
      station.dark = [];
      if (!game.lucky) game.lucky = id;
    }
  });
}

function finishGame() {
  if (terminalTimer) window.clearTimeout(terminalTimer);
  terminalTimer = null;
  // 手牌耗尽后仅逐堆检查一明一暗；不翻开、也不跨堆组合其他暗牌。
  settleTerminalStationPairs();
  game.complete = true; refresh(); showResult();
}
function showResult() {
  const remaining = unresolvedCards();
  const fortunes = [{ name: '酒', meaning: '日常应酬' }, { name: '色', meaning: '桃花运' }, { name: '财', meaning: '财运' }, { name: '气', meaning: '是非' }]
    .map((item, index) => ({ ...item, pairs: game.storage.filter((_, pairIndex) => pairIndex % 4 === index) }))
    .map(item => ({ ...item, cards: item.pairs.flatMap(pair => pair.cards) }));
  els.fortuneGrid.replaceChildren();
  fortunes.forEach(fortune => {
    const counts = fortune.cards.reduce((map, card) => map.set(card.rank, (map.get(card.rank) || 0) + 1), new Map());
    const score = [...counts.entries()].reduce((total, [rank, amount]) => total + Math.floor(amount / 4) * VALUE[rank], 0);
    const node = document.createElement('div'); node.className = 'fortune-item'; node.innerHTML = `<span>${fortune.name}</span><strong>${score}</strong><small>${fortune.meaning}</small>`; els.fortuneGrid.append(node);
  });
  els.luckyDirection.textContent = game.lucky ? `${game.stations[game.lucky].name}方` : '本局未显';
  els.resultTopline.textContent = remaining.length ? '牌局收束' : '本局圆满';
  els.resultNote.textContent = remaining.length
    ? `本局共收得 ${game.storage.length} 对牌；当前没有可继续行的牌，余下 ${remaining.length} 张未收拢。分数由同一位置的四张同点数牌累加而成。`
    : `本局共收得 ${game.storage.length} 对牌，所有牌均已收拢。分数由同一位置的四张同点数牌累加而成。`;
  renderUnresolvedRecord(remaining);
  renderGameRecord(fortunes);
  setStatus('牌局已收束', remaining.length ? '已无可行的配对，未收拢的牌已列入结算。' : '所有牌均已收拢，结果已在弹窗中呈现。'); setGuide(''); els.resultDialog.showModal();
}

function renderUnresolvedRecord(cards) {
  if (!cards.length) {
    els.unresolvedRecord.hidden = true;
    els.unresolvedNote.textContent = '';
    return;
  }
  const byPlace = new Map();
  cards.forEach(({ card, place }) => {
    const list = byPlace.get(place) || [];
    list.push(`${card.rank}${card.symbol}`);
    byPlace.set(place, list);
  });
  els.unresolvedNote.textContent = [...byPlace.entries()].map(([place, labels]) => `${place}：${labels.join('、')}`).join('；');
  els.unresolvedRecord.hidden = false;
}

function renderGameRecord(fortunes) {
  els.recordList.replaceChildren();
  if (!game.storage.length) {
    const empty = document.createElement('p'); empty.className = 'record-empty'; empty.textContent = '本局未收得成对牌。'; els.recordList.append(empty); return;
  }
  fortunes.forEach(fortune => {
    const section = document.createElement('section'); section.className = 'record-fortune';
    const counts = fortune.cards.reduce((map, card) => map.set(card.rank, (map.get(card.rank) || 0) + 1), new Map());
    const scoring = [...counts.entries()].filter(([, amount]) => amount >= 4).map(([rank, amount]) => {
      const sets = Math.floor(amount / 4);
      return `${rank} × ${sets * 4}，计 ${VALUE[rank] * sets} 分`;
    });
    const heading = document.createElement('div'); heading.className = 'record-heading';
    heading.innerHTML = `<strong>${fortune.name}</strong><span>${fortune.meaning}</span><em>${scoring.length ? `成局：${scoring.join('、')}` : '未成局'}</em>`;
    section.append(heading);
    const pairs = document.createElement('div'); pairs.className = 'record-pairs';
    fortune.pairs.forEach(pair => {
      const row = document.createElement('div'); row.className = 'record-pair';
      const cards = document.createElement('div'); cards.className = 'record-cards';
      pair.cards.forEach(card => { const badge = document.createElement('span'); badge.className = card.red ? 'red' : ''; badge.textContent = `${card.rank}${card.symbol}`; cards.append(badge); });
      const source = document.createElement('small'); source.textContent = pair.source;
      row.append(cards, source); pairs.append(row);
    });
    if (!fortune.pairs.length) { const none = document.createElement('p'); none.className = 'record-empty'; none.textContent = '本局没有归入此项的牌对。'; pairs.append(none); }
    section.append(pairs); els.recordList.append(section);
  });
}

els.restartButton.addEventListener('click', startGame);
els.dialogRestart.addEventListener('click', startGame);
startGame();
return () => {
  if (terminalTimer) window.clearTimeout(terminalTimer);
  root.replaceChildren();
};
}
