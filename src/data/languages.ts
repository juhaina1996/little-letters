export type LetterGroup = "vowel" | "consonant";

export type Letter = {
  /** The letter itself */
  char: string;
  /** How it sounds, in English letters */
  roman: string;
  /** What the speech engine should say for the letter (defaults to `char`) */
  say?: string;
  group: LetterGroup;
  /** A simple example word */
  word?: string;
  wordRoman?: string;
  meaning?: string;
  emoji?: string;
  /** false when the example word only contains the letter (not starts with it) */
  starts?: boolean;
};

export type LanguageId = "hindi" | "arabic" | "malayalam";

export type Language = {
  id: LanguageId;
  name: string;
  nativeName: string;
  hello: string;
  /** BCP-47 tag for the browser's speech engine */
  speechLang: string;
  dir: "ltr" | "rtl";
  /** CSS variable holding the script font */
  fontVar: string;
  color: string;
  softColor: string;
  emoji: string;
  groupLabels: Record<LetterGroup, string>;
  letters: Letter[];
};

const hindi: Letter[] = [
  // स्वर — vowels
  { char: "अ", roman: "a", group: "vowel", word: "अखबार", wordRoman: "akhbaar", meaning: "newspaper", emoji: "📰" },
  { char: "आ", roman: "aa", group: "vowel", word: "आम", wordRoman: "aam", meaning: "mango", emoji: "🥭" },
  { char: "इ", roman: "i", group: "vowel", word: "इमारत", wordRoman: "imaarat", meaning: "building", emoji: "🏢" },
  { char: "ई", roman: "ee", group: "vowel", word: "ईंट", wordRoman: "eent", meaning: "brick", emoji: "🧱" },
  { char: "उ", roman: "u", group: "vowel", word: "उल्लू", wordRoman: "ullu", meaning: "owl", emoji: "🦉" },
  { char: "ऊ", roman: "oo", group: "vowel", word: "ऊन", wordRoman: "oon", meaning: "wool", emoji: "🧶" },
  { char: "ऋ", roman: "ri", group: "vowel", word: "ऋषि", wordRoman: "rishi", meaning: "sage", emoji: "🧔" },
  { char: "ए", roman: "e", group: "vowel", word: "एक", wordRoman: "ek", meaning: "one", emoji: "1️⃣" },
  { char: "ऐ", roman: "ai", group: "vowel", word: "ऐनक", wordRoman: "ainak", meaning: "spectacles", emoji: "👓" },
  { char: "ओ", roman: "o", group: "vowel", word: "ओस", wordRoman: "os", meaning: "dew", emoji: "💧" },
  { char: "औ", roman: "au", group: "vowel", word: "औरत", wordRoman: "aurat", meaning: "woman", emoji: "👩" },
  { char: "अं", roman: "an", group: "vowel", word: "अंगूर", wordRoman: "angoor", meaning: "grapes", emoji: "🍇" },
  // व्यंजन — consonants
  { char: "क", roman: "ka", group: "consonant", word: "कबूतर", wordRoman: "kabootar", meaning: "pigeon", emoji: "🕊️" },
  { char: "ख", roman: "kha", group: "consonant", word: "खरगोश", wordRoman: "khargosh", meaning: "rabbit", emoji: "🐇" },
  { char: "ग", roman: "ga", group: "consonant", word: "गमला", wordRoman: "gamla", meaning: "flower pot", emoji: "🪴" },
  { char: "घ", roman: "gha", group: "consonant", word: "घर", wordRoman: "ghar", meaning: "house", emoji: "🏠" },
  { char: "ङ", roman: "nga", group: "consonant" },
  { char: "च", roman: "cha", group: "consonant", word: "चम्मच", wordRoman: "chammach", meaning: "spoon", emoji: "🥄" },
  { char: "छ", roman: "chha", group: "consonant", word: "छतरी", wordRoman: "chhatri", meaning: "umbrella", emoji: "☂️" },
  { char: "ज", roman: "ja", group: "consonant", word: "जहाज़", wordRoman: "jahaaz", meaning: "ship", emoji: "🚢" },
  { char: "झ", roman: "jha", group: "consonant", word: "झंडा", wordRoman: "jhanda", meaning: "flag", emoji: "🚩" },
  { char: "ञ", roman: "nya", group: "consonant" },
  { char: "ट", roman: "ta", group: "consonant", word: "टमाटर", wordRoman: "tamaatar", meaning: "tomato", emoji: "🍅" },
  { char: "ठ", roman: "tha", group: "consonant", word: "ठेला", wordRoman: "thela", meaning: "cart", emoji: "🛒" },
  { char: "ड", roman: "da", group: "consonant", word: "डलिया", wordRoman: "daliya", meaning: "basket", emoji: "🧺" },
  { char: "ढ", roman: "dha", group: "consonant", word: "ढोल", wordRoman: "dhol", meaning: "drum", emoji: "🥁" },
  { char: "ण", roman: "na", group: "consonant", word: "हिरण", wordRoman: "hiran", meaning: "deer", emoji: "🦌", starts: false },
  { char: "त", roman: "ta", group: "consonant", word: "तरबूज़", wordRoman: "tarbooz", meaning: "watermelon", emoji: "🍉" },
  { char: "थ", roman: "tha", group: "consonant", word: "थाली", wordRoman: "thaali", meaning: "plate", emoji: "🍽️" },
  { char: "द", roman: "da", group: "consonant", word: "दरवाज़ा", wordRoman: "darvaaza", meaning: "door", emoji: "🚪" },
  { char: "ध", roman: "dha", group: "consonant", word: "धनुष", wordRoman: "dhanush", meaning: "bow", emoji: "🏹" },
  { char: "न", roman: "na", group: "consonant", word: "नल", wordRoman: "nal", meaning: "tap", emoji: "🚰" },
  { char: "प", roman: "pa", group: "consonant", word: "पतंग", wordRoman: "patang", meaning: "kite", emoji: "🪁" },
  { char: "फ", roman: "pha", group: "consonant", word: "फूल", wordRoman: "phool", meaning: "flower", emoji: "🌸" },
  { char: "ब", roman: "ba", group: "consonant", word: "बतख", wordRoman: "batakh", meaning: "duck", emoji: "🦆" },
  { char: "भ", roman: "bha", group: "consonant", word: "भालू", wordRoman: "bhaalu", meaning: "bear", emoji: "🐻" },
  { char: "म", roman: "ma", group: "consonant", word: "मछली", wordRoman: "machhli", meaning: "fish", emoji: "🐟" },
  { char: "य", roman: "ya", group: "consonant", word: "यो-यो", wordRoman: "yo-yo", meaning: "yo-yo", emoji: "🪀" },
  { char: "र", roman: "ra", group: "consonant", word: "रस्सी", wordRoman: "rassi", meaning: "rope", emoji: "🪢" },
  { char: "ल", roman: "la", group: "consonant", word: "लालटेन", wordRoman: "laaltein", meaning: "lantern", emoji: "🏮" },
  { char: "व", roman: "va", group: "consonant", word: "वन", wordRoman: "van", meaning: "forest", emoji: "🌳" },
  { char: "श", roman: "sha", group: "consonant", word: "शेर", wordRoman: "sher", meaning: "lion", emoji: "🦁" },
  { char: "ष", roman: "sha", group: "consonant", word: "षटकोण", wordRoman: "shatkon", meaning: "hexagon", emoji: "⬢" },
  { char: "स", roman: "sa", group: "consonant", word: "सेब", wordRoman: "seb", meaning: "apple", emoji: "🍎" },
  { char: "ह", roman: "ha", group: "consonant", word: "हाथी", wordRoman: "haathi", meaning: "elephant", emoji: "🐘" },
  { char: "क्ष", roman: "ksha", group: "consonant", word: "क्षत्रिय", wordRoman: "kshatriya", meaning: "warrior", emoji: "⚔️" },
  { char: "त्र", roman: "tra", group: "consonant", word: "त्रिशूल", wordRoman: "trishool", meaning: "trident", emoji: "🔱" },
  { char: "ज्ञ", roman: "gya", group: "consonant", word: "ज्ञानी", wordRoman: "gyaani", meaning: "wise person", emoji: "📚" },
];

const arabic: Letter[] = [
  { char: "ا", roman: "alif", say: "ألف", group: "consonant", word: "أَسَد", wordRoman: "asad", meaning: "lion", emoji: "🦁" },
  { char: "ب", roman: "baa", say: "باء", group: "consonant", word: "بَطَّة", wordRoman: "batta", meaning: "duck", emoji: "🦆" },
  { char: "ت", roman: "taa", say: "تاء", group: "consonant", word: "تُفَّاح", wordRoman: "tuffaah", meaning: "apple", emoji: "🍎" },
  { char: "ث", roman: "thaa", say: "ثاء", group: "consonant", word: "ثَعْلَب", wordRoman: "tha'lab", meaning: "fox", emoji: "🦊" },
  { char: "ج", roman: "jeem", say: "جيم", group: "consonant", word: "جَمَل", wordRoman: "jamal", meaning: "camel", emoji: "🐪" },
  { char: "ح", roman: "haa", say: "حاء", group: "consonant", word: "حِصَان", wordRoman: "hisaan", meaning: "horse", emoji: "🐎" },
  { char: "خ", roman: "khaa", say: "خاء", group: "consonant", word: "خَرُوف", wordRoman: "kharoof", meaning: "sheep", emoji: "🐑" },
  { char: "د", roman: "daal", say: "دال", group: "consonant", word: "دُبّ", wordRoman: "dubb", meaning: "bear", emoji: "🐻" },
  { char: "ذ", roman: "dhaal", say: "ذال", group: "consonant", word: "ذُرَة", wordRoman: "dhura", meaning: "corn", emoji: "🌽" },
  { char: "ر", roman: "raa", say: "راء", group: "consonant", word: "رِيشَة", wordRoman: "reesha", meaning: "feather", emoji: "🪶" },
  { char: "ز", roman: "zaay", say: "زاي", group: "consonant", word: "زَرَافَة", wordRoman: "zaraafa", meaning: "giraffe", emoji: "🦒" },
  { char: "س", roman: "seen", say: "سين", group: "consonant", word: "سَمَكَة", wordRoman: "samaka", meaning: "fish", emoji: "🐟" },
  { char: "ش", roman: "sheen", say: "شين", group: "consonant", word: "شَمْس", wordRoman: "shams", meaning: "sun", emoji: "☀️" },
  { char: "ص", roman: "saad", say: "صاد", group: "consonant", word: "صَقْر", wordRoman: "saqr", meaning: "falcon", emoji: "🦅" },
  { char: "ض", roman: "daad", say: "ضاد", group: "consonant", word: "ضِفْدَع", wordRoman: "difda'", meaning: "frog", emoji: "🐸" },
  { char: "ط", roman: "taa", say: "طاء", group: "consonant", word: "طَائِرَة", wordRoman: "taa'ira", meaning: "airplane", emoji: "✈️" },
  { char: "ظ", roman: "dhaa", say: "ظاء", group: "consonant", word: "ظَرْف", wordRoman: "dharf", meaning: "envelope", emoji: "✉️" },
  { char: "ع", roman: "ayn", say: "عين", group: "consonant", word: "عِنَب", wordRoman: "'inab", meaning: "grapes", emoji: "🍇" },
  { char: "غ", roman: "ghayn", say: "غين", group: "consonant", word: "غَيْمَة", wordRoman: "ghayma", meaning: "cloud", emoji: "☁️" },
  { char: "ف", roman: "faa", say: "فاء", group: "consonant", word: "فِيل", wordRoman: "feel", meaning: "elephant", emoji: "🐘" },
  { char: "ق", roman: "qaaf", say: "قاف", group: "consonant", word: "قِطَّة", wordRoman: "qitta", meaning: "cat", emoji: "🐱" },
  { char: "ك", roman: "kaaf", say: "كاف", group: "consonant", word: "كِتَاب", wordRoman: "kitaab", meaning: "book", emoji: "📖" },
  { char: "ل", roman: "laam", say: "لام", group: "consonant", word: "لَيْمُون", wordRoman: "laymoon", meaning: "lemon", emoji: "🍋" },
  { char: "م", roman: "meem", say: "ميم", group: "consonant", word: "مَوْز", wordRoman: "mawz", meaning: "banana", emoji: "🍌" },
  { char: "ن", roman: "noon", say: "نون", group: "consonant", word: "نَحْلَة", wordRoman: "nahla", meaning: "bee", emoji: "🐝" },
  { char: "ه", roman: "haa", say: "هاء", group: "consonant", word: "هِلَال", wordRoman: "hilaal", meaning: "crescent moon", emoji: "🌙" },
  { char: "و", roman: "waaw", say: "واو", group: "consonant", word: "وَرْدَة", wordRoman: "warda", meaning: "rose", emoji: "🌹" },
  { char: "ي", roman: "yaa", say: "ياء", group: "consonant", word: "يَد", wordRoman: "yad", meaning: "hand", emoji: "✋" },
];

const malayalam: Letter[] = [
  // സ്വരങ്ങൾ — vowels
  { char: "അ", roman: "a", group: "vowel", word: "അമ്മ", wordRoman: "amma", meaning: "mother", emoji: "👩" },
  { char: "ആ", roman: "aa", group: "vowel", word: "ആന", wordRoman: "aana", meaning: "elephant", emoji: "🐘" },
  { char: "ഇ", roman: "i", group: "vowel", word: "ഇല", wordRoman: "ila", meaning: "leaf", emoji: "🍃" },
  { char: "ഈ", roman: "ee", group: "vowel", word: "ഈച്ച", wordRoman: "eechcha", meaning: "fly", emoji: "🪰" },
  { char: "ഉ", roman: "u", group: "vowel", word: "ഉറുമ്പ്", wordRoman: "urumbu", meaning: "ant", emoji: "🐜" },
  { char: "ഊ", roman: "oo", group: "vowel", word: "ഊഞ്ഞാൽ", wordRoman: "oonjaal", meaning: "swing", emoji: "🎠" },
  { char: "ഋ", roman: "ru", group: "vowel", word: "ഋഷി", wordRoman: "rushi", meaning: "sage", emoji: "🧔" },
  { char: "എ", roman: "e", group: "vowel", word: "എലി", wordRoman: "eli", meaning: "rat", emoji: "🐭" },
  { char: "ഏ", roman: "ae", group: "vowel", word: "ഏണി", wordRoman: "aeni", meaning: "ladder", emoji: "🪜" },
  { char: "ഐ", roman: "ai", group: "vowel", word: "ഐസ്ക്രീം", wordRoman: "ice cream", meaning: "ice cream", emoji: "🍦" },
  { char: "ഒ", roman: "o", group: "vowel", word: "ഒട്ടകം", wordRoman: "ottakam", meaning: "camel", emoji: "🐪" },
  { char: "ഓ", roman: "oa", group: "vowel", word: "ഓറഞ്ച്", wordRoman: "orange", meaning: "orange", emoji: "🍊" },
  { char: "ഔ", roman: "au", group: "vowel", word: "ഔഷധം", wordRoman: "aushadham", meaning: "medicine", emoji: "💊" },
  // വ്യഞ്ജനങ്ങൾ — consonants
  { char: "ക", roman: "ka", group: "consonant", word: "കപ്പൽ", wordRoman: "kappal", meaning: "ship", emoji: "🚢" },
  { char: "ഖ", roman: "kha", group: "consonant", word: "ഖഡ്ഗം", wordRoman: "khadgam", meaning: "sword", emoji: "⚔️" },
  { char: "ഗ", roman: "ga", group: "consonant", word: "ഗരുഡൻ", wordRoman: "garudan", meaning: "eagle", emoji: "🦅" },
  { char: "ഘ", roman: "gha", group: "consonant", word: "ഘടികാരം", wordRoman: "ghadikaaram", meaning: "clock", emoji: "⏰" },
  { char: "ങ", roman: "nga", group: "consonant" },
  { char: "ച", roman: "cha", group: "consonant", word: "ചന്ദ്രൻ", wordRoman: "chandran", meaning: "moon", emoji: "🌙" },
  { char: "ഛ", roman: "chha", group: "consonant", word: "ഛത്രം", wordRoman: "chhathram", meaning: "umbrella", emoji: "☂️" },
  { char: "ജ", roman: "ja", group: "consonant", word: "ജനൽ", wordRoman: "janal", meaning: "window", emoji: "🪟" },
  { char: "ഝ", roman: "jha", group: "consonant" },
  { char: "ഞ", roman: "nja", group: "consonant", word: "ഞണ്ട്", wordRoman: "njandu", meaning: "crab", emoji: "🦀" },
  { char: "ട", roman: "ta", group: "consonant", word: "ടയർ", wordRoman: "tyre", meaning: "tyre", emoji: "🛞" },
  { char: "ഠ", roman: "tta", group: "consonant" },
  { char: "ഡ", roman: "da", group: "consonant", word: "ഡോക്ടർ", wordRoman: "doctor", meaning: "doctor", emoji: "🧑‍⚕️" },
  { char: "ഢ", roman: "dda", group: "consonant" },
  { char: "ണ", roman: "na", group: "consonant", word: "പണം", wordRoman: "panam", meaning: "money", emoji: "💰", starts: false },
  { char: "ത", roman: "tha", group: "consonant", word: "തത്ത", wordRoman: "thaththa", meaning: "parrot", emoji: "🦜" },
  { char: "ഥ", roman: "ttha", group: "consonant" },
  { char: "ദ", roman: "da", group: "consonant", word: "ദോശ", wordRoman: "dosa", meaning: "dosa", emoji: "🥞" },
  { char: "ധ", roman: "dha", group: "consonant", word: "ധ്വജം", wordRoman: "dhwajam", meaning: "flag", emoji: "🚩" },
  { char: "ന", roman: "na", group: "consonant", word: "നക്ഷത്രം", wordRoman: "nakshathram", meaning: "star", emoji: "⭐" },
  { char: "പ", roman: "pa", group: "consonant", word: "പൂച്ച", wordRoman: "poochcha", meaning: "cat", emoji: "🐱" },
  { char: "ഫ", roman: "pha", group: "consonant", word: "ഫലം", wordRoman: "phalam", meaning: "fruit", emoji: "🍎" },
  { char: "ബ", roman: "ba", group: "consonant", word: "ബലൂൺ", wordRoman: "baloon", meaning: "balloon", emoji: "🎈" },
  { char: "ഭ", roman: "bha", group: "consonant", word: "ഭരണി", wordRoman: "bharani", meaning: "jar", emoji: "🏺" },
  { char: "മ", roman: "ma", group: "consonant", word: "മയിൽ", wordRoman: "mayil", meaning: "peacock", emoji: "🦚" },
  { char: "യ", roman: "ya", group: "consonant", word: "യന്ത്രം", wordRoman: "yanthram", meaning: "machine", emoji: "⚙️" },
  { char: "ര", roman: "ra", group: "consonant", word: "രാജാവ്", wordRoman: "raajaavu", meaning: "king", emoji: "🤴" },
  { char: "ല", roman: "la", group: "consonant", word: "ലോറി", wordRoman: "lorry", meaning: "lorry", emoji: "🚚" },
  { char: "വ", roman: "va", group: "consonant", word: "വള്ളം", wordRoman: "vallam", meaning: "boat", emoji: "🛶" },
  { char: "ശ", roman: "sha", group: "consonant", word: "ശംഖ്", wordRoman: "shankhu", meaning: "conch", emoji: "🐚" },
  { char: "ഷ", roman: "sha", group: "consonant", word: "ഷർട്ട്", wordRoman: "shirt", meaning: "shirt", emoji: "👕" },
  { char: "സ", roman: "sa", group: "consonant", word: "സൂര്യൻ", wordRoman: "sooryan", meaning: "sun", emoji: "☀️" },
  { char: "ഹ", roman: "ha", group: "consonant", word: "ഹംസം", wordRoman: "hamsam", meaning: "swan", emoji: "🦢" },
  { char: "ള", roman: "la", group: "consonant", word: "വള", wordRoman: "vala", meaning: "bangle", emoji: "💍", starts: false },
  { char: "ഴ", roman: "zha", group: "consonant", word: "പുഴ", wordRoman: "puzha", meaning: "river", emoji: "🏞️", starts: false },
  { char: "റ", roman: "ra", group: "consonant", word: "റോസാപ്പൂ", wordRoman: "rosaappoo", meaning: "rose", emoji: "🌹" },
];

export const LANGUAGES: Record<LanguageId, Language> = {
  hindi: {
    id: "hindi",
    name: "Hindi",
    nativeName: "हिंदी",
    hello: "नमस्ते",
    speechLang: "hi-IN",
    dir: "ltr",
    fontVar: "var(--font-devanagari)",
    color: "#f97316",
    softColor: "#ffedd5",
    emoji: "🪔",
    groupLabels: { vowel: "Vowels · स्वर", consonant: "Consonants · व्यंजन" },
    letters: hindi,
  },
  arabic: {
    id: "arabic",
    name: "Arabic",
    nativeName: "العربية",
    hello: "مرحبا",
    speechLang: "ar-SA",
    dir: "rtl",
    fontVar: "var(--font-arabic)",
    color: "#10b981",
    softColor: "#d1fae5",
    emoji: "🌙",
    groupLabels: { vowel: "Vowels", consonant: "Letters · الحروف" },
    letters: arabic,
  },
  malayalam: {
    id: "malayalam",
    name: "Malayalam",
    nativeName: "മലയാളം",
    hello: "നമസ്കാരം",
    speechLang: "ml-IN",
    dir: "ltr",
    fontVar: "var(--font-malayalam)",
    color: "#8b5cf6",
    softColor: "#ede9fe",
    emoji: "🌴",
    groupLabels: { vowel: "Vowels · സ്വരങ്ങൾ", consonant: "Consonants · വ്യഞ്ജനങ്ങൾ" },
    letters: malayalam,
  },
};

export const LANGUAGE_LIST = Object.values(LANGUAGES);

export function getLanguage(id: string): Language | undefined {
  return LANGUAGES[id as LanguageId];
}
