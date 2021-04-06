const Discriminator = {
  BL: 'Live Blog',
  LQ: 'Live QA',
};
const pageSize = 10;

const manageApps = [
  // 'apps',
  // 'groupApps',
  // 'directApps',
  'blogApps',
  'boothChatApps',
  'liveApps',
];
const translations = [
  {
    name: 'Afrikaans',
    nativeName: 'Afrikaans',
    dir: 'ltr',
    code: 'af',
  },
  {
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    code: 'ar',
  },
  {
    name: 'Bulgarian',
    nativeName: 'Български',
    dir: 'ltr',
    code: 'bg',
  },
  {
    name: 'Bangla',
    nativeName: 'বাংলা',
    dir: 'ltr',
    code: 'bn',
  },
  {
    name: 'Bosnian',
    nativeName: 'bosanski (latinica)',
    dir: 'ltr',
    code: 'bs',
  },
  {
    name: 'Catalan',
    nativeName: 'Català',
    dir: 'ltr',
    code: 'ca',
  },
  {
    name: 'Chinese Simplified',
    nativeName: '简体中文',
    dir: 'ltr',
    code: 'zh-Hans',
  },
  {
    name: 'Czech',
    nativeName: 'Čeština',
    dir: 'ltr',
    code: 'cs',
  },
  {
    name: 'Welsh',
    nativeName: 'Welsh',
    dir: 'ltr',
    code: 'cy',
  },
  {
    name: 'Danish',
    nativeName: 'Dansk',
    dir: 'ltr',
    code: 'da',
  },
  {
    name: 'German',
    nativeName: 'Deutsch',
    dir: 'ltr',
    code: 'de',
  },
  {
    name: 'Greek',
    nativeName: 'Ελληνικά',
    dir: 'ltr',
    code: 'el',
  },
  {
    name: 'Spanish',
    nativeName: 'Español',
    dir: 'ltr',
    code: 'es',
  },
  {
    name: 'Estonian',
    nativeName: 'Eesti',
    dir: 'ltr',
    code: 'et',
  },
  {
    name: 'Persian',
    nativeName: 'Persian',
    dir: 'rtl',
    code: 'fa',
  },
  {
    name: 'Finnish',
    nativeName: 'Suomi',
    dir: 'ltr',
    code: 'fi',
  },
  {
    name: 'Faroese',
    nativeName: 'Haitian Creole',
    dir: 'ltr',
    code: 'ht',
  },
  {
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    code: 'fr',
  },
  {
    name: 'Hebrew',
    nativeName: 'עברית',
    dir: 'rtl',
    code: 'he',
  },
  {
    name: 'Hindi',
    nativeName: 'हिंदी',
    dir: 'ltr',
    code: 'hi',
  },
  {
    name: 'Croatian',
    nativeName: 'Hrvatski',
    dir: 'ltr',
    code: 'hr',
  },
  {
    name: 'Hungarian',
    nativeName: 'Magyar',
    dir: 'ltr',
    code: 'hu',
  },
  {
    name: 'Indonesian',
    nativeName: 'Indonesia',
    dir: 'ltr',
    code: 'id',
  },
  {
    name: 'Icelandic',
    nativeName: 'Íslenska',
    dir: 'ltr',
    code: 'is',
  },
  {
    name: 'Italian',
    nativeName: 'Italiano',
    dir: 'ltr',
    code: 'it',
  },
  {
    name: 'Japanese',
    nativeName: '日本語',
    dir: 'ltr',
    code: 'ja',
  },
  {
    name: 'Korean',
    nativeName: '한국어',
    dir: 'ltr',
    code: 'ko',
  },
  {
    name: 'Lithuanian',
    nativeName: 'Lietuvių',
    dir: 'ltr',
    code: 'lt',
  },
  {
    name: 'Latvian',
    nativeName: 'Latviešu',
    dir: 'ltr',
    code: 'lv',
  },
  {
    name: 'Maltese',
    nativeName: 'Il-Malti',
    dir: 'ltr',
    code: 'mt',
  },
  {
    name: 'Malay',
    nativeName: 'Melayu',
    dir: 'ltr',
    code: 'ms',
  },
  {
    name: 'Hmong Daw',
    nativeName: 'Hmong Daw',
    dir: 'ltr',
    code: 'mww',
  },
  {
    name: 'Dutch',
    nativeName: 'Nederlands',
    dir: 'ltr',
    code: 'nl',
  },
  {
    name: 'Norwegian',
    nativeName: 'Norsk',
    dir: 'ltr',
    code: 'nb',
  },
  {
    name: 'Polish',
    nativeName: 'Polski',
    dir: 'ltr',
    code: 'pl',
  },
  {
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    dir: 'ltr',
    code: 'pt',
  },
  {
    name: 'Romanian',
    nativeName: 'Română',
    dir: 'ltr',
    code: 'ro',
  },
  {
    name: 'Russian',
    nativeName: 'Русский',
    dir: 'ltr',
    code: 'ru',
  },
  {
    name: 'Slovak',
    nativeName: 'Slovenčina',
    dir: 'ltr',
    code: 'sk',
  },
  {
    name: 'Slovenian',
    nativeName: 'Slovenščina',
    dir: 'ltr',
    code: 'sl',
  },
  {
    name: 'Serbian (Latin)',
    nativeName: 'srpski (latinica)',
    dir: 'ltr',
    code: 'sr-Latn',
  },
  {
    name: 'Swedish',
    nativeName: 'Svenska',
    dir: 'ltr',
    code: 'sv',
  },
  {
    name: 'Swahili',
    nativeName: 'Kiswahili',
    dir: 'ltr',
    code: 'sw',
  },
  {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    dir: 'ltr',
    code: 'ta',
  },
  {
    name: 'Thai',
    nativeName: 'ไทย',
    dir: 'ltr',
    code: 'th',
  },
  {
    name: 'Klingon (Latin)',
    nativeName: 'Klingon (Latin)',
    dir: 'ltr',
    code: 'tlh-Latn',
  },
  {
    name: 'Turkish',
    nativeName: 'Türkçe',
    dir: 'ltr',
    code: 'tr',
  },
  {
    name: 'Ukrainian',
    nativeName: 'Українська',
    dir: 'ltr',
    code: 'uk',
  },
  {
    name: 'Urdu',
    nativeName: 'اردو',
    dir: 'rtl',
    code: 'ur',
  },
  {
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    dir: 'ltr',
    code: 'vi',
  },
];

const appImages = {
  twitter: 'https://cdn.pubble.io/resources/dashboard/img/twitter-ico.png',
};

const constants = {
  allowedFileTypes:
    'png,gif,jpg,jpeg,pdf,doc,docx,xls,xlsx,ppt,pptx,mp3,mp4,mpeg,avi,wmv,mov,m4v,mkv,txt,csv',
};
export {
  Discriminator,
  pageSize,
  manageApps,
  translations,
  appImages,
  constants,
};
