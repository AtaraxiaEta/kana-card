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

export const KANA_DATA = [
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

export const KANA_BY_ID = new Map(KANA_DATA.map((item) => [item.id, item]));

export function getCharacter(item, script) {
  return script === "katakana" ? item.katakana : item.hiragana;
}

export function getRow(rowId) {
  return ROWS.find((row) => row.id === rowId);
}

export function getScriptName(script) {
  return script === "katakana" ? "片假名" : "平假名";
}
