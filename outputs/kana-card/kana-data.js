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

export const ALL_ROWS = [...ROWS, ...DAKUTEN_ROWS];

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

export const KANA_DATA = [
  ...BASE_KANA_DATA.map((item) => ({ ...item, stage: 1 })),
  ...DAKUTEN_DATA
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

export function getScriptName(script) {
  return script === "katakana" ? "片假名" : "平假名";
}
