export const TRIGRAMS = {
  qian: { name: '乾', symbol: '☰', lines: [1, 1, 1], image: '天', element: '金' },
  dui: { name: '兑', symbol: '☱', lines: [1, 1, 0], image: '泽', element: '金' },
  li: { name: '离', symbol: '☲', lines: [1, 0, 1], image: '火', element: '火' },
  zhen: { name: '震', symbol: '☳', lines: [1, 0, 0], image: '雷', element: '木' },
  xun: { name: '巽', symbol: '☴', lines: [0, 1, 1], image: '风', element: '木' },
  kan: { name: '坎', symbol: '☵', lines: [0, 1, 0], image: '水', element: '水' },
  gen: { name: '艮', symbol: '☶', lines: [0, 0, 1], image: '山', element: '土' },
  kun: { name: '坤', symbol: '☷', lines: [0, 0, 0], image: '地', element: '土' },
};

const HEXAGRAMS = [
  ['乾', 'qian', 'qian'], ['坤', 'kun', 'kun'], ['屯', 'kan', 'zhen'], ['蒙', 'gen', 'kan'], ['需', 'kan', 'qian'], ['讼', 'qian', 'kan'], ['师', 'kun', 'kan'], ['比', 'kan', 'kun'],
  ['小畜', 'xun', 'qian'], ['履', 'qian', 'dui'], ['泰', 'kun', 'qian'], ['否', 'qian', 'kun'], ['同人', 'qian', 'li'], ['大有', 'li', 'qian'], ['谦', 'kun', 'gen'], ['豫', 'zhen', 'kun'],
  ['随', 'dui', 'zhen'], ['蛊', 'gen', 'xun'], ['临', 'kun', 'dui'], ['观', 'xun', 'kun'], ['噬嗑', 'li', 'zhen'], ['贲', 'gen', 'li'], ['剥', 'gen', 'kun'], ['复', 'kun', 'zhen'],
  ['无妄', 'qian', 'zhen'], ['大畜', 'gen', 'qian'], ['颐', 'gen', 'zhen'], ['大过', 'dui', 'xun'], ['坎', 'kan', 'kan'], ['离', 'li', 'li'], ['咸', 'dui', 'gen'], ['恒', 'zhen', 'xun'],
  ['遁', 'qian', 'gen'], ['大壮', 'zhen', 'qian'], ['晋', 'li', 'kun'], ['明夷', 'kun', 'li'], ['家人', 'xun', 'li'], ['睽', 'li', 'dui'], ['蹇', 'kan', 'gen'], ['解', 'zhen', 'kan'],
  ['损', 'gen', 'dui'], ['益', 'xun', 'zhen'], ['夬', 'dui', 'qian'], ['姤', 'qian', 'xun'], ['萃', 'dui', 'kun'], ['升', 'kun', 'xun'], ['困', 'dui', 'kan'], ['井', 'kan', 'xun'],
  ['革', 'dui', 'li'], ['鼎', 'li', 'xun'], ['震', 'zhen', 'zhen'], ['艮', 'gen', 'gen'], ['渐', 'xun', 'gen'], ['归妹', 'zhen', 'dui'], ['丰', 'zhen', 'li'], ['旅', 'li', 'gen'],
  ['巽', 'xun', 'xun'], ['兑', 'dui', 'dui'], ['涣', 'xun', 'kan'], ['节', 'kan', 'dui'], ['中孚', 'xun', 'dui'], ['小过', 'zhen', 'gen'], ['既济', 'kan', 'li'], ['未济', 'li', 'kan'],
];

// 《周易》六十四卦卦辞，按通行本王弼系文本整理；不以现代文案替代经文。
const CLASSIC_JUDGEMENTS = [
  '元亨利贞。', '元亨，利牝马之贞。君子有攸往，先迷后得主，利。西南得朋，东北丧朋。安贞吉。', '元亨利贞，勿用有攸往，利建侯。', '亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。',
  '有孚，光亨，贞吉，利涉大川。', '有孚窒惕，中吉，终凶。利见大人，不利涉大川。', '贞，丈人吉，无咎。', '吉。原筮元永贞，无咎。不宁方来，后夫凶。',
  '亨。密云不雨，自我西郊。', '履虎尾，不咥人，亨。', '小往大来，吉亨。', '否之匪人，不利君子贞，大往小来。',
  '同人于野，亨。利涉大川，利君子贞。', '元亨。', '亨，君子有终。', '利建侯、行师。',
  '元亨利贞，无咎。', '元亨，利涉大川。先甲三日，后甲三日。', '元亨利贞，至于八月有凶。', '盥而不荐，有孚颙若。',
  '亨，利用狱。', '亨，小利有攸往。', '不利有攸往。', '亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。',
  '元亨利贞。其匪正有眚，不利有攸往。', '利贞，不家食吉，利涉大川。', '贞吉。观颐，自求口实。', '栋桡，利有攸往，亨。',
  '习坎，有孚，维心亨，行有尚。', '利贞，亨。畜牝牛，吉。', '亨，利贞，取女吉。', '亨，无咎，利贞，利有攸往。',
  '亨，小利贞。', '利贞。', '康侯用锡马蕃庶，昼日三接。', '利艰贞。',
  '利女贞。', '小事吉。', '利西南，不利东北；利见大人，贞吉。', '利西南，无所往，其来复吉；有攸往，夙吉。',
  '有孚，元吉，无咎，可贞，利有攸往。曷之用？二簋可用享。', '利有攸往，利涉大川。', '扬于王庭，孚号有厉。告自邑，不利即戎，利有攸往。', '女壮，勿用取女。',
  '亨。王假有庙，利见大人，亨，利贞；用大牲吉，利有攸往。', '元亨。用见大人，勿恤。南征吉。', '亨，贞大人吉，无咎。有言不信。', '改邑不改井，无丧无得，往来井井。汔至，亦未繘井，羸其瓶，凶。',
  '己日乃孚，元亨利贞，悔亡。', '元吉，亨。', '亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。', '艮其背，不获其身；行其庭，不见其人，无咎。',
  '女归吉，利贞。', '征凶，无攸利。', '亨，王假之，勿忧，宜日中。', '小亨，旅贞吉。',
  '小亨，利有攸往，利见大人。', '亨，利贞。', '亨。王假有庙，利涉大川，利贞。', '亨。苦节不可贞。',
  '豚鱼吉，利涉大川，利贞。', '亨，利贞。可小事，不可大事。飞鸟遗之音，不宜上，宜下，大吉。', '亨小，利贞；初吉终乱。', '亨。小狐汔济，濡其尾，无攸利。',
];

export const HEXAGRAM_DATA = HEXAGRAMS.map(([name, upper, lower], index) => {
  const upperTri = TRIGRAMS[upper];
  const lowerTri = TRIGRAMS[lower];
  return { id: index + 1, name, upper, lower, image: `${upperTri.image}上${lowerTri.image}下`, judgement: CLASSIC_JUDGEMENTS[index] };
});

export function getHexagram(lines) {
  const lower = lines.slice(0, 3).join('');
  const upper = lines.slice(3, 6).join('');
  return HEXAGRAM_DATA.find(item => TRIGRAMS[item.lower].lines.join('') === lower && TRIGRAMS[item.upper].lines.join('') === upper);
}

// “易签”抽取六十四卦之一；不使用或冒充任何宫观、寺庙的灵签体系。
export const LOTS = HEXAGRAM_DATA;

export const CHARACTER_IMAGES = [
  ['山', '土', '沉静蓄力', '把未竟之事分层梳理，先稳住根基。'], ['水', '水', '顺流察势', '保留弹性，答案会在流动中显现。'], ['火', '火', '照见本心', '看清真正所求，再作取舍。'], ['风', '木', '轻入人心', '以柔和的方式表达，阻力会减小。'],
  ['雷', '木', '破晓而动', '从一件小事开始，行动能驱散迟疑。'], ['泽', '金', '交感相悦', '真诚交流，会带来新的视野。'], ['天', '金', '开阔立志', '把尺度放大，但行动仍要落在当下。'], ['地', '土', '包容承载', '先照顾眼前，再等待合适的时机。'],
];
