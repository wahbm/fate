import { mount as mountWenbu } from './wenbu/app.js';
import { mount as mountEightGates } from './eight-gates/app.js';

const app = document.querySelector('#app');
let activeCleanup = () => {};
let activeRouteStyle = null;

const HOME_TEMPLATE = `
  <div class="fate-home">
    <header class="fate-header fate-shell">
      <a class="fate-brand" href="#/" aria-label="返回 FATE 首页">
        <span class="fate-brand-seal">命</span>
        <span class="fate-brand-name">FATE</span>
        <small>观心 · 见势</small>
      </a>
      <nav class="fate-nav" aria-label="主导航">
        <a href="#algorithms">诸法</a>
        <a href="#about">关于</a>
      </nav>
      <span class="fate-header-note">一念入局</span>
    </header>

    <main>
      <section class="fate-hero fate-shell" id="home">
        <div class="fate-hero-copy">
          <p class="fate-kicker">FATE / 命运簿</p>
          <h1>一念入局<br /><em>万象有回应</em></h1>
          <p class="fate-hero-lead">以古意为引，以交互为舟。<br />在一枚钱、一支签、一方牌局之间，照见此刻的心。</p>
          <a class="fate-primary-button" href="#algorithms">入诸法 <span>↓</span></a>
        </div>
        <div class="fate-hero-mark" aria-hidden="true">
          <span>F</span>
          <i>命</i>
          <small>心有所问 · 万象可观</small>
        </div>
      </section>

      <section class="fate-section fate-shell" id="algorithms" aria-labelledby="algorithms-title">
        <div class="fate-section-heading">
          <div>
            <p class="fate-kicker">SUPPORTED METHODS / 已支持的算法</p>
            <h2 id="algorithms-title">选择一条入局之路</h2>
          </div>
          <p>四种入口，四种观法。<br />无需注册，结果只留在你的浏览器里。</p>
        </div>
        <div class="fate-algorithm-grid">
          <a class="fate-algorithm-card fate-card-coin" href="#/wenbu/coin">
            <span class="fate-card-index">壹 · WENBU</span>
            <strong>掷铜钱</strong>
            <p>三钱六掷，起一卦而观动静。</p>
            <span class="fate-card-action">开始起卦 <b>↗</b></span>
          </a>
          <a class="fate-algorithm-card fate-card-lot" href="#/wenbu/lot">
            <span class="fate-card-index">贰 · WENBU</span>
            <strong>抽易签</strong>
            <p>随机一卦，直接阅读《周易》卦辞。</p>
            <span class="fate-card-action">摇签观卦 <b>↗</b></span>
          </a>
          <a class="fate-algorithm-card fate-card-character" href="#/wenbu/character">
            <span class="fate-card-index">叁 · WENBU</span>
            <strong>算一字</strong>
            <p>写下一个汉字，取其象而照见心意。</p>
            <span class="fate-card-action">以字观心 <b>↗</b></span>
          </a>
          <a class="fate-algorithm-card fate-card-game" href="#/eight-gates">
            <span class="fate-card-index">肆 · EIGHT GATES</span>
            <strong>八方牌局</strong>
            <p>翻开藏于八方的牌，收拢命中注定的对子。</p>
            <span class="fate-card-action">布一局牌 <b>↗</b></span>
          </a>
        </div>
      </section>

      <section class="fate-about fate-shell" id="about" aria-labelledby="about-title">
        <div class="fate-about-seal" aria-hidden="true">观</div>
        <div>
          <p class="fate-kicker">ABOUT FATE / 关于</p>
          <h2 id="about-title">不是预言，是一次与自己的相遇。</h2>
          <p>FATE 将传统意象做成轻盈的数字仪式：不问生辰，不留姓名，也不替你决定现实。每一种结果都只是一个停顿，让问题重新回到你自己手中。</p>
          <p class="fate-about-note">所有内容仅供娱乐与自我反思，请勿用作医疗、法律、金融或重大人生决定的依据。</p>
        </div>
      </section>
    </main>

    <footer class="fate-footer fate-shell">
      <span>FATE · 命运簿</span>
      <span>一念入局，万象有回应。</span>
    </footer>
  </div>
`;

function parseRoute() {
  const raw = window.location.hash.slice(1);
  if (!raw || raw === '/') return { name: 'home' };
  if (!raw.startsWith('/')) return { name: 'home', anchor: raw };
  const segments = raw.split('/').filter(Boolean);
  if (segments[0] === 'wenbu') return { name: 'wenbu', method: segments[1] || null };
  if (segments[0] === 'eight-gates') return { name: 'eight-gates' };
  return { name: 'home' };
}

function setRouteStyle(href) {
  if (activeRouteStyle) activeRouteStyle.remove();
  activeRouteStyle = null;
  if (!href) return;
  activeRouteStyle = document.createElement('link');
  activeRouteStyle.rel = 'stylesheet';
  activeRouteStyle.href = href;
  activeRouteStyle.dataset.routeStyle = 'true';
  document.head.append(activeRouteStyle);
}

function mountHome(root) {
  root.innerHTML = HOME_TEMPLATE;
  return () => root.replaceChildren();
}

function renderRoute() {
  const route = parseRoute();
  activeCleanup();
  activeCleanup = () => {};
  rootReplace();
  document.body.dataset.route = route.name;

  if (route.name === 'wenbu') {
    document.title = '问卜 · 一问观心 | FATE';
    setRouteStyle('./wenbu/styles.css');
    activeCleanup = mountWenbu(app, route.method);
  } else if (route.name === 'eight-gates') {
    document.title = '命运 · 酒色财气 | FATE';
    setRouteStyle('./eight-gates/styles.css');
    activeCleanup = mountEightGates(app);
  } else {
    document.title = 'FATE · 观心见势';
    setRouteStyle(null);
    activeCleanup = mountHome(app);
    if (route.anchor) requestAnimationFrame(() => document.getElementById(route.anchor)?.scrollIntoView({ behavior: 'smooth' }));
  }
}

function rootReplace() {
  app.replaceChildren();
}

window.addEventListener('hashchange', renderRoute);
renderRoute();
