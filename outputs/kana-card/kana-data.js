export const ROWS = [
  { id: "a", label: "あ行", ids: ["a", "i", "u", "e", "o"] },
  { id: "ka", label: "か行", ids: ["ka", "ki", "ku", "ke", "ko"] },
  { id: "sa", label: "さ行", ids: ["sa", "shi", "su", "se", "so"] },
  { id: "ta", label: "た行", ids: ["ta", "chi", "tsu", "te", "to"] },
  { id: "na", label: "な行", ids: ["na", "ni", "nu", "ne", "no"] },
  { id: "ha", label: "は行", ids: ["ha", "hi", "fu", "he", "ho"] },
  { id: "ma", label: "ま行", ids: ["ma", "mi", "mu", "me", "mo"] },
  { id: "ya", label: "や行", ids: ["ya", "yu", "yo"] },
  { id: "ra", label: "ら行", ids: ["ra", "ri", "ru", "re", "ro"] },
  { id: "wa", label: "わ行", ids: ["wa", "wo", "n"] }
];

const BASE_KANA_DATA = [
  { id: "a", romaji: "a", row: "a", hiragana: "あ", katakana: "ア" },
  { id: "i", romaji: "i", row: "a", hiragana: "い", katakana: "イ" },
  { id: "u", romaji: "u", row: "a", hiragana: "う", katakana: "ウ" },
  { id: "e", romaji: "e", row: "a", hiragana: "え", katakana: "エ" },
  { id: "o", romaji: "o", row: "a", hiragana: "お", katakana: "オ" },
  { id: "ka", romaji: "ka", row: "ka", hiragana: "か", katakana: "カ" },
  { id: "ki", romaji: "ki", row: "ka", hiragana: "き", katakana: "キ" },
  { id: "ku", romaji: "ku", row: "ka", hiragana: "く", katakana: "ク" },
  { id: "ke", romaji: "ke", row: "ka", hiragana: "け", katakana: "ケ" },
  { id: "ko", romaji: "ko", row: "ka", hiragana: "こ", katakana: "コ" },
  { id: "sa", romaji: "sa", row: "sa", hiragana: "さ", katakana: "サ" },
  {
    id: "shi",
    romaji: "shi",
    row: "sa",
    hiragana: "し",
    katakana: "シ",
    note: "シ 的两点纵向排列，长笔画从左下向右上挑。"
  },
  { id: "su", romaji: "su", row: "sa", hiragana: "す", katakana: "ス" },
  { id: "se", romaji: "se", row: "sa", hiragana: "せ", katakana: "セ" },
  {
    id: "so",
    romaji: "so",
    row: "sa",
    hiragana: "そ",
    katakana: "ソ",
    note: "ソ 是短点加长撇；ン 是短点加向上挑。"
  },
  { id: "ta", romaji: "ta", row: "ta", hiragana: "た", katakana: "タ" },
  {
    id: "chi",
    romaji: "chi",
    row: "ta",
    hiragana: "ち",
    katakana: "チ",
    note: "ち 的形状像数字 5；チ 像“千”的上半部。"
  },
  {
    id: "tsu",
    romaji: "tsu",
    row: "ta",
    hiragana: "つ",
    katakana: "ツ",
    note: "ツ 的两点横向排列，长笔画向右下弯。"
  },
  { id: "te", romaji: "te", row: "ta", hiragana: "て", katakana: "テ" },
  { id: "to", romaji: "to", row: "ta", hiragana: "と", katakana: "ト" },
  { id: "na", romaji: "na", row: "na", hiragana: "な", katakana: "ナ" },
  { id: "ni", romaji: "ni", row: "na", hiragana: "に", katakana: "ニ" },
  { id: "nu", romaji: "nu", row: "na", hiragana: "ぬ", katakana: "ヌ" },
  {
    id: "ne",
    romaji: "ne",
    row: "na",
    hiragana: "ね",
    katakana: "ネ",
    note: "ね、れ、わ 都有左侧竖线，靠右侧收尾区分。"
  },
  {
    id: "no",
    romaji: "no",
    row: "na",
    hiragana: "の",
    katakana: "ノ",
    note: "の 是一个环形；ノ 只有一条向右下的撇。"
  },
  { id: "ha", romaji: "ha", row: "ha", hiragana: "は", katakana: "ハ" },
  { id: "hi", romaji: "hi", row: "ha", hiragana: "ひ", katakana: "ヒ" },
  { id: "fu", romaji: "fu", row: "ha", hiragana: "ふ", katakana: "フ" },
  { id: "he", romaji: "he", row: "ha", hiragana: "へ", katakana: "ヘ" },
  { id: "ho", romaji: "ho", row: "ha", hiragana: "ほ", katakana: "ホ" },
  { id: "ma", romaji: "ma", row: "ma", hiragana: "ま", katakana: "マ" },
  { id: "mi", romaji: "mi", row: "ma", hiragana: "み", katakana: "ミ" },
  { id: "mu", romaji: "mu", row: "ma", hiragana: "む", katakana: "ム" },
  { id: "me", romaji: "me", row: "ma", hiragana: "め", katakana: "メ" },
  { id: "mo", romaji: "mo", row: "ma", hiragana: "も", katakana: "モ" },
  { id: "ya", romaji: "ya", row: "ya", hiragana: "や", katakana: "ヤ" },
  { id: "yu", romaji: "yu", row: "ya", hiragana: "ゆ", katakana: "ユ" },
  { id: "yo", romaji: "yo", row: "ya", hiragana: "よ", katakana: "ヨ" },
  { id: "ra", romaji: "ra", row: "ra", hiragana: "ら", katakana: "ラ" },
  { id: "ri", romaji: "ri", row: "ra", hiragana: "り", katakana: "リ" },
  {
    id: "ru",
    romaji: "ru",
    row: "ra",
    hiragana: "る",
    katakana: "ル",
    note: "る 的末尾有环；ろ 的末尾没有环。"
  },
  {
    id: "re",
    romaji: "re",
    row: "ra",
    hiragana: "れ",
    katakana: "レ",
    note: "れ 右侧像弯钩，和 わ、ね 一起对比记忆。"
  },
  {
    id: "ro",
    romaji: "ro",
    row: "ra",
    hiragana: "ろ",
    katakana: "ロ",
    note: "ろ 比 る 少一个环，片假名 ロ 像方框。"
  },
  {
    id: "wa",
    romaji: "wa",
    row: "wa",
    hiragana: "わ",
    katakana: "ワ",
    note: "わ 的右侧收成圆弧，れ、ね 的收尾更复杂。"
  },
  {
    id: "wo",
    romaji: "wo",
    row: "wa",
    hiragana: "を",
    katakana: "ヲ",
    note: "を 现代日语中通常只作助词，读音接近 o。"
  },
  {
    id: "n",
    romaji: "n",
    row: "wa",
    hiragana: "ん",
    katakana: "ン",
    note: "ン 是短点加向上挑；ソ 是短点加长撇。"
  }
];

export const DAKUTEN_ROWS = [
  { id: "ga", label: "が行", stage: 2, ids: ["ga", "gi", "gu", "ge", "go"] },
  { id: "za", label: "ざ行", stage: 2, ids: ["za", "ji", "zu", "ze", "zo"] },
  { id: "da", label: "だ行", stage: 2, ids: ["da", "dji", "dzu", "de", "do"] },
  { id: "ba", label: "ば行", stage: 2, ids: ["ba", "bi", "bu", "be", "bo"] },
  { id: "pa", label: "ぱ行", stage: 2, ids: ["pa", "pi", "pu", "pe", "po"] }
];

export const YOON_ROWS = [
  { id: "kya", label: "きゃ行", stage: 3, ids: ["kya", "kyu", "kyo"] },
  { id: "sha", label: "しゃ行", stage: 3, ids: ["sha", "shu", "sho"] },
  { id: "cha", label: "ちゃ行", stage: 3, ids: ["cha", "chu", "cho"] },
  { id: "nya", label: "にゃ行", stage: 3, ids: ["nya", "nyu", "nyo"] },
  { id: "hya", label: "ひゃ行", stage: 3, ids: ["hya", "hyu", "hyo"] },
  { id: "mya", label: "みゃ行", stage: 3, ids: ["mya", "myu", "myo"] },
  { id: "rya", label: "りゃ行", stage: 3, ids: ["rya", "ryu", "ryo"] },
  { id: "gya", label: "ぎゃ行", stage: 3, ids: ["gya", "gyu", "gyo"] },
  { id: "ja", label: "じゃ行", stage: 3, ids: ["ja", "ju", "jo"] },
  { id: "bya", label: "びゃ行", stage: 3, ids: ["bya", "byu", "byo"] },
  { id: "pya", label: "ぴゃ行", stage: 3, ids: ["pya", "pyu", "pyo"] }
];

export const RULE_ROWS = [
  {
    id: "long-vowels",
    label: "长音",
    stage: 4,
    ids: [
      "long-a-hira",
      "long-i-hira",
      "long-u-hira",
      "long-e-hira",
      "long-o-hira",
      "long-a-kata",
      "long-i-kata",
      "long-u-kata",
      "long-e-kata",
      "long-o-kata"
    ]
  },
  {
    id: "sokuon",
    label: "促音",
    stage: 4,
    ids: [
      "sokuon-gakkou-hira",
      "sokuon-kitte-hira",
      "sokuon-chotto-hira",
      "sokuon-zasshi-hira",
      "sokuon-kippu-hira",
      "sokuon-kappu-kata",
      "sokuon-beddo-kata",
      "sokuon-baggu-kata",
      "sokuon-petto-kata",
      "sokuon-shoppu-kata"
    ]
  }
];

export const ALL_ROWS = [...ROWS, ...DAKUTEN_ROWS, ...YOON_ROWS, ...RULE_ROWS];

export const LEARNING_STAGES = [
  { id: 1, label: "基础假名", description: "46 个清音假名" },
  { id: 2, label: "浊音与半浊音", description: "が、ざ、だ、ば、ぱ 五行" },
  { id: 3, label: "拗音", description: "きゃ、しゃ、ちゃ等组合音" },
  { id: 4, label: "长音与促音", description: "通过短词练习发音规则" }
];

export const DAKUTEN_DATA = [
  { id: "ga", romaji: "ga", row: "ga", stage: 2, hiragana: "が", katakana: "ガ" },
  { id: "gi", romaji: "gi", row: "ga", stage: 2, hiragana: "ぎ", katakana: "ギ" },
  { id: "gu", romaji: "gu", row: "ga", stage: 2, hiragana: "ぐ", katakana: "グ" },
  { id: "ge", romaji: "ge", row: "ga", stage: 2, hiragana: "げ", katakana: "ゲ" },
  { id: "go", romaji: "go", row: "ga", stage: 2, hiragana: "ご", katakana: "ゴ" },
  { id: "za", romaji: "za", row: "za", stage: 2, hiragana: "ざ", katakana: "ザ" },
  {
    id: "ji",
    romaji: "ji",
    row: "za",
    stage: 2,
    hiragana: "じ",
    katakana: "ジ",
    note: "じ / ジ 是常用写法；ぢ / ヂ 只在少数词和连浊中出现。"
  },
  {
    id: "zu",
    romaji: "zu",
    row: "za",
    stage: 2,
    hiragana: "ず",
    katakana: "ズ",
    note: "ず / ズ 是常用写法；づ / ヅ 只在少数词中出现。"
  },
  { id: "ze", romaji: "ze", row: "za", stage: 2, hiragana: "ぜ", katakana: "ゼ" },
  { id: "zo", romaji: "zo", row: "za", stage: 2, hiragana: "ぞ", katakana: "ゾ" },
  { id: "da", romaji: "da", row: "da", stage: 2, hiragana: "だ", katakana: "ダ" },
  {
    id: "dji",
    romaji: "ji",
    row: "da",
    stage: 2,
    hiragana: "ぢ",
    katakana: "ヂ",
    note: "ぢ / ヂ 与 じ / ジ 同音，现代日语中出现频率较低。"
  },
  {
    id: "dzu",
    romaji: "zu",
    row: "da",
    stage: 2,
    hiragana: "づ",
    katakana: "ヅ",
    note: "づ / ヅ 与 ず / ズ 同音，常见于连浊词。"
  },
  { id: "de", romaji: "de", row: "da", stage: 2, hiragana: "で", katakana: "デ" },
  { id: "do", romaji: "do", row: "da", stage: 2, hiragana: "ど", katakana: "ド" },
  { id: "ba", romaji: "ba", row: "ba", stage: 2, hiragana: "ば", katakana: "バ" },
  { id: "bi", romaji: "bi", row: "ba", stage: 2, hiragana: "び", katakana: "ビ" },
  { id: "bu", romaji: "bu", row: "ba", stage: 2, hiragana: "ぶ", katakana: "ブ" },
  { id: "be", romaji: "be", row: "ba", stage: 2, hiragana: "べ", katakana: "ベ" },
  { id: "bo", romaji: "bo", row: "ba", stage: 2, hiragana: "ぼ", katakana: "ボ" },
  {
    id: "pa",
    romaji: "pa",
    row: "pa",
    stage: 2,
    hiragana: "ぱ",
    katakana: "パ",
    note: "ぱ行是半浊音，右上角使用小圆圈。"
  },
  { id: "pi", romaji: "pi", row: "pa", stage: 2, hiragana: "ぴ", katakana: "ピ" },
  { id: "pu", romaji: "pu", row: "pa", stage: 2, hiragana: "ぷ", katakana: "プ" },
  { id: "pe", romaji: "pe", row: "pa", stage: 2, hiragana: "ぺ", katakana: "ペ" },
  { id: "po", romaji: "po", row: "pa", stage: 2, hiragana: "ぽ", katakana: "ポ" }
];

export const YOON_DATA = [
  { id: "kya", romaji: "kya", row: "kya", stage: 3, hiragana: "きゃ", katakana: "キャ" },
  { id: "kyu", romaji: "kyu", row: "kya", stage: 3, hiragana: "きゅ", katakana: "キュ" },
  { id: "kyo", romaji: "kyo", row: "kya", stage: 3, hiragana: "きょ", katakana: "キョ" },
  { id: "sha", romaji: "sha", row: "sha", stage: 3, hiragana: "しゃ", katakana: "シャ" },
  { id: "shu", romaji: "shu", row: "sha", stage: 3, hiragana: "しゅ", katakana: "シュ" },
  { id: "sho", romaji: "sho", row: "sha", stage: 3, hiragana: "しょ", katakana: "ショ" },
  { id: "cha", romaji: "cha", row: "cha", stage: 3, hiragana: "ちゃ", katakana: "チャ" },
  { id: "chu", romaji: "chu", row: "cha", stage: 3, hiragana: "ちゅ", katakana: "チュ" },
  { id: "cho", romaji: "cho", row: "cha", stage: 3, hiragana: "ちょ", katakana: "チョ" },
  { id: "nya", romaji: "nya", row: "nya", stage: 3, hiragana: "にゃ", katakana: "ニャ" },
  { id: "nyu", romaji: "nyu", row: "nya", stage: 3, hiragana: "にゅ", katakana: "ニュ" },
  { id: "nyo", romaji: "nyo", row: "nya", stage: 3, hiragana: "にょ", katakana: "ニョ" },
  { id: "hya", romaji: "hya", row: "hya", stage: 3, hiragana: "ひゃ", katakana: "ヒャ" },
  { id: "hyu", romaji: "hyu", row: "hya", stage: 3, hiragana: "ひゅ", katakana: "ヒュ" },
  { id: "hyo", romaji: "hyo", row: "hya", stage: 3, hiragana: "ひょ", katakana: "ヒョ" },
  { id: "mya", romaji: "mya", row: "mya", stage: 3, hiragana: "みゃ", katakana: "ミャ" },
  { id: "myu", romaji: "myu", row: "mya", stage: 3, hiragana: "みゅ", katakana: "ミュ" },
  { id: "myo", romaji: "myo", row: "mya", stage: 3, hiragana: "みょ", katakana: "ミョ" },
  { id: "rya", romaji: "rya", row: "rya", stage: 3, hiragana: "りゃ", katakana: "リャ" },
  { id: "ryu", romaji: "ryu", row: "rya", stage: 3, hiragana: "りゅ", katakana: "リュ" },
  { id: "ryo", romaji: "ryo", row: "rya", stage: 3, hiragana: "りょ", katakana: "リョ" },
  { id: "gya", romaji: "gya", row: "gya", stage: 3, hiragana: "ぎゃ", katakana: "ギャ" },
  { id: "gyu", romaji: "gyu", row: "gya", stage: 3, hiragana: "ぎゅ", katakana: "ギュ" },
  { id: "gyo", romaji: "gyo", row: "gya", stage: 3, hiragana: "ぎょ", katakana: "ギョ" },
  { id: "ja", romaji: "ja", row: "ja", stage: 3, hiragana: "じゃ", katakana: "ジャ" },
  { id: "ju", romaji: "ju", row: "ja", stage: 3, hiragana: "じゅ", katakana: "ジュ" },
  { id: "jo", romaji: "jo", row: "ja", stage: 3, hiragana: "じょ", katakana: "ジョ" },
  { id: "bya", romaji: "bya", row: "bya", stage: 3, hiragana: "びゃ", katakana: "ビャ" },
  { id: "byu", romaji: "byu", row: "bya", stage: 3, hiragana: "びゅ", katakana: "ビュ" },
  { id: "byo", romaji: "byo", row: "bya", stage: 3, hiragana: "びょ", katakana: "ビョ" },
  { id: "pya", romaji: "pya", row: "pya", stage: 3, hiragana: "ぴゃ", katakana: "ピャ" },
  { id: "pyu", romaji: "pyu", row: "pya", stage: 3, hiragana: "ぴゅ", katakana: "ピュ" },
  { id: "pyo", romaji: "pyo", row: "pya", stage: 3, hiragana: "ぴょ", katakana: "ピョ" }
];

export const RULE_DATA = [
  {
    id: "long-a-hira",
    romaji: "okaasan",
    row: "long-vowels",
    stage: 4,
    type: "rule",
    ruleType: "long",
    scripts: ["hiragana"],
    hiragana: "おかあさん",
    katakana: "おかあさん",
    prompt: "おかあさん",
    instruction: "这个词应该怎样读？",
    answer: "okaasan",
    options: ["okaasan", "okasan", "okassan", "okaasa"],
    note: "あ 延长了 a 音，读成 okaasan。"
  },
  {
    id: "long-i-hira",
    romaji: "oniisan",
    row: "long-vowels",
    stage: 4,
    type: "rule",
    ruleType: "long",
    scripts: ["hiragana"],
    hiragana: "おにいさん",
    katakana: "おにいさん",
    prompt: "おにいさん",
    instruction: "这个词应该怎样读？",
    answer: "oniisan",
    options: ["oniisan", "onisan", "oniisann", "onisaan"],
    note: "い 延长了 i 音，读成 oniisan。"
  },
  {
    id: "long-u-hira",
    romaji: "kuuki",
    row: "long-vowels",
    stage: 4,
    type: "rule",
    ruleType: "long",
    scripts: ["hiragana"],
    hiragana: "くうき",
    katakana: "くうき",
    prompt: "くうき",
    instruction: "这个词应该怎样读？",
    answer: "kuuki",
    options: ["kuuki", "kuki", "kukki", "kuukii"],
    note: "う 延长了 u 音，读成 kuuki。"
  },
  {
    id: "long-e-hira",
    romaji: "sensei",
    row: "long-vowels",
    stage: 4,
    type: "rule",
    ruleType: "long",
    scripts: ["hiragana"],
    hiragana: "せんせい",
    katakana: "せんせい",
    prompt: "せんせい",
    instruction: "这个词应该怎样读？",
    answer: "sensei",
    options: ["sensei", "sensai", "sensee", "sense"],
    note: "せい 中的 い 延长 e 音，读成 sensei。"
  },
  {
    id: "long-o-hira",
    romaji: "otousan",
    row: "long-vowels",
    stage: 4,
    type: "rule",
    ruleType: "long",
    scripts: ["hiragana"],
    hiragana: "おとうさん",
    katakana: "おとうさん",
    prompt: "おとうさん",
    instruction: "这个词应该怎样读？",
    answer: "otousan",
    options: ["otousan", "otosan", "otossan", "otousann"],
    note: "おう 中的 う 延长 o 音，读成 otousan。"
  },
  {
    id: "sokuon-gakkou-hira",
    romaji: "gakkou",
    row: "sokuon",
    stage: 4,
    type: "rule",
    ruleType: "sokuon",
    scripts: ["hiragana"],
    hiragana: "がっこう",
    katakana: "がっこう",
    prompt: "がっこう",
    instruction: "促音应该怎样读？",
    answer: "gakkou",
    options: ["gakkou", "gakou", "gakko", "gakkoo"],
    note: "小写的 っ 表示停顿一拍，再读出后面的 こ。"
  },
  {
    id: "sokuon-kitte-hira",
    romaji: "kitte",
    row: "sokuon",
    stage: 4,
    type: "rule",
    ruleType: "sokuon",
    scripts: ["hiragana"],
    hiragana: "きって",
    katakana: "きって",
    prompt: "きって",
    instruction: "促音应该怎样读？",
    answer: "kitte",
    options: ["kitte", "kite", "kitee", "kittei"],
    note: "小写的 っ 让 t 音停顿一拍，读成 kitte。"
  },
  {
    id: "sokuon-chotto-hira",
    romaji: "chotto",
    row: "sokuon",
    stage: 4,
    type: "rule",
    ruleType: "sokuon",
    scripts: ["hiragana"],
    hiragana: "ちょっと",
    katakana: "ちょっと",
    prompt: "ちょっと",
    instruction: "促音应该怎样读？",
    answer: "chotto",
    options: ["chotto", "choto", "chottoo", "chott"],
    note: "小写的 っ 让 t 音停顿一拍，读成 chotto。"
  },
  {
    id: "sokuon-zasshi-hira",
    romaji: "zasshi",
    row: "sokuon",
    stage: 4,
    type: "rule",
    ruleType: "sokuon",
    scripts: ["hiragana"],
    hiragana: "ざっし",
    katakana: "ざっし",
    prompt: "ざっし",
    instruction: "促音应该怎样读？",
    answer: "zasshi",
    options: ["zasshi", "zashi", "zasshii", "zassh"],
    note: "小写的 っ 让 s 音停顿一拍，读成 zasshi。"
  },
  {
    id: "sokuon-kippu-hira",
    romaji: "kippu",
    row: "sokuon",
    stage: 4,
    type: "rule",
    ruleType: "sokuon",
    scripts: ["hiragana"],
    hiragana: "きっぷ",
    katakana: "きっぷ",
    prompt: "きっぷ",
    instruction: "促音应该怎样读？",
    answer: "kippu",
    options: ["kippu", "kipu", "kippuu", "kipp"],
    note: "小写的 っ 让 p 音停顿一拍，读成 kippu。"
  },
  {
    id: "long-a-kata",
    romaji: "koohii",
    row: "long-vowels",
    stage: 4,
    type: "rule",
    ruleType: "long",
    scripts: ["katakana"],
    hiragana: "コーヒー",
    katakana: "コーヒー",
    prompt: "コーヒー",
    instruction: "这个词应该怎样读？",
    answer: "koohii",
    options: ["koohii", "kohii", "koohi", "kohhii"],
    note: "片假名长音用 ー 表示，延长前面元音一拍。"
  },
  {
    id: "long-i-kata",
    romaji: "sukii",
    row: "long-vowels",
    stage: 4,
    type: "rule",
    ruleType: "long",
    scripts: ["katakana"],
    hiragana: "スキー",
    katakana: "スキー",
    prompt: "スキー",
    instruction: "这个词应该怎样读？",
    answer: "sukii",
    options: ["sukii", "suki", "sukkii", "sukiii"],
    note: "ー 延长 i 音，读成 sukii。"
  },
  {
    id: "long-u-kata",
    romaji: "suupaa",
    row: "long-vowels",
    stage: 4,
    type: "rule",
    ruleType: "long",
    scripts: ["katakana"],
    hiragana: "スーパー",
    katakana: "スーパー",
    prompt: "スーパー",
    instruction: "这个词应该怎样读？",
    answer: "suupaa",
    options: ["suupaa", "supaa", "suppaa", "suupa"],
    note: "两个 ー 分别延长 u 音和 a 音。"
  },
  {
    id: "long-e-kata",
    romaji: "meeru",
    row: "long-vowels",
    stage: 4,
    type: "rule",
    ruleType: "long",
    scripts: ["katakana"],
    hiragana: "メール",
    katakana: "メール",
    prompt: "メール",
    instruction: "这个词应该怎样读？",
    answer: "meeru",
    options: ["meeru", "meru", "merru", "meeruu"],
    note: "ー 延长 e 音，读成 meeru。"
  },
  {
    id: "long-o-kata",
    romaji: "kooto",
    row: "long-vowels",
    stage: 4,
    type: "rule",
    ruleType: "long",
    scripts: ["katakana"],
    hiragana: "コート",
    katakana: "コート",
    prompt: "コート",
    instruction: "这个词应该怎样读？",
    answer: "kooto",
    options: ["kooto", "koto", "kotto", "kootoo"],
    note: "ー 延长 o 音，读成 kooto。"
  },
  {
    id: "sokuon-kappu-kata",
    romaji: "kappu",
    row: "sokuon",
    stage: 4,
    type: "rule",
    ruleType: "sokuon",
    scripts: ["katakana"],
    hiragana: "カップ",
    katakana: "カップ",
    prompt: "カップ",
    instruction: "促音应该怎样读？",
    answer: "kappu",
    options: ["kappu", "kapu", "kappuu", "kapp"],
    note: "小写的 ッ 让 p 音停顿一拍，读成 kappu。"
  },
  {
    id: "sokuon-beddo-kata",
    romaji: "beddo",
    row: "sokuon",
    stage: 4,
    type: "rule",
    ruleType: "sokuon",
    scripts: ["katakana"],
    hiragana: "ベッド",
    katakana: "ベッド",
    prompt: "ベッド",
    instruction: "促音应该怎样读？",
    answer: "beddo",
    options: ["beddo", "bedo", "bedd", "beddoo"],
    note: "小写的 ッ 让 d 音停顿一拍，读成 beddo。"
  },
  {
    id: "sokuon-baggu-kata",
    romaji: "baggu",
    row: "sokuon",
    stage: 4,
    type: "rule",
    ruleType: "sokuon",
    scripts: ["katakana"],
    hiragana: "バッグ",
    katakana: "バッグ",
    prompt: "バッグ",
    instruction: "促音应该怎样读？",
    answer: "baggu",
    options: ["baggu", "bagu", "bagguu", "bagg"],
    note: "小写的 ッ 让 g 音停顿一拍，读成 baggu。"
  },
  {
    id: "sokuon-petto-kata",
    romaji: "petto",
    row: "sokuon",
    stage: 4,
    type: "rule",
    ruleType: "sokuon",
    scripts: ["katakana"],
    hiragana: "ペット",
    katakana: "ペット",
    prompt: "ペット",
    instruction: "促音应该怎样读？",
    answer: "petto",
    options: ["petto", "peto", "pett", "pettoo"],
    note: "小写的 ッ 让 t 音停顿一拍，读成 petto。"
  },
  {
    id: "sokuon-shoppu-kata",
    romaji: "shoppu",
    row: "sokuon",
    stage: 4,
    type: "rule",
    ruleType: "sokuon",
    scripts: ["katakana"],
    hiragana: "ショップ",
    katakana: "ショップ",
    prompt: "ショップ",
    instruction: "促音应该怎样读？",
    answer: "shoppu",
    options: ["shoppu", "shopu", "shoppuu", "shopp"],
    note: "小写的 ッ 让 p 音停顿一下，读成 shoppu。"
  }
];

export const KANA_DATA = [
  ...BASE_KANA_DATA.map((item) => ({ ...item, stage: 1 })),
  ...DAKUTEN_DATA,
  ...YOON_DATA,
  ...RULE_DATA
];

export const KANA_BY_ID = new Map(KANA_DATA.map((item) => [item.id, item]));

export function getCharacter(item, script) {
  return script === "katakana" ? item.katakana : item.hiragana;
}

export function getRow(rowId) {
  return ALL_ROWS.find((row) => row.id === rowId);
}

export function getStage(itemOrRow) {
  return itemOrRow.stage || 1;
}

export function itemSupportsScript(item, script) {
  return !item.scripts || item.scripts.includes(script);
}

export function getTotalStudyUnits() {
  return KANA_DATA.reduce((total, item) => total + (item.scripts?.length || 2), 0);
}

export function getScriptName(script) {
  return script === "katakana" ? "片假名" : "平假名";
}
