// Original characters. None of them copies a known character: a child should say
// "a superhero" or "a princess", never a name from a film.
// Shapes are filled white with a black outline unless marked: class "o" is an open line, "d" a solid dot.

export default [
  {
    id: 'hero',
    name: { ar: 'البطل نجم', en: 'Star the hero' },
    age: [4, 7],
    art: `<path d="M64 88L38 178H162L136 88z"/><rect x="82" y="144" width="15" height="38" rx="5"/><rect x="103" y="144" width="15" height="38" rx="5"/><path d="M79 96L52 116l8 12l24-14z"/><path d="M121 96l30-32l11 10l-34 42z"/><path d="M76 92h48l6 56H70z"/><path class="o" d="M71 138h58"/><path d="M100 104l4 8l9 1l-7 6l2 9l-8-5l-8 5l2-9l-7-6l9-1z"/><circle cx="100" cy="60" r="27"/><path d="M75 54q25-12 50 0v13q-25 9-50 0z"/><circle cx="89" cy="60" r="4" class="d"/><circle cx="111" cy="60" r="4" class="d"/><path class="o" d="M90 76q10 8 20 0"/><path class="o" d="M92 34q8-10 18-2"/>`,
  },
  {
    id: 'heroine',
    name: { ar: 'البطلة هلال', en: 'Hilal the heroine' },
    age: [4, 7],
    art: `<path d="M66 88L42 178H158L134 88z"/><rect x="84" y="152" width="13" height="30" rx="5"/><rect x="103" y="152" width="13" height="30" rx="5"/><path d="M82 96L56 116l16 18l8-8l-10-10l14-10z"/><path d="M118 96l26 20l-16 18l-8-8l10-10l-14-10z"/><path d="M74 132h52l10 28H64z"/><path d="M80 92h40l6 42H74z"/><path d="M105 99a10 10 0 1 0 7 16a8 8 0 0 1-7-16z"/><circle cx="70" cy="40" r="13"/><circle cx="130" cy="40" r="13"/><circle cx="100" cy="60" r="27"/><path class="o" d="M75 52q25-20 50 0"/><path d="M77 57q23-9 46 0v9q-23 8-46 0z"/><circle cx="90" cy="61" r="3.5" class="d"/><circle cx="110" cy="61" r="3.5" class="d"/><path class="o" d="M91 76q9 7 18 0"/>`,
  },
  {
    id: 'bolt',
    name: { ar: 'البطل برق', en: 'Barq the fast' },
    age: [4, 7],
    art: `<path d="M84 142l-14 40h16l12-36z"/><path d="M106 146l10 36h16l-12-40z"/><path d="M78 98L52 104L48 76L61 74L63 90L80 88z"/><path d="M122 98l26 6l4-28l-13-2l-2 16l-17-2z"/><path d="M76 90h48l6 56H70z"/><path d="M105 98l-14 20h10l-6 18l16-22h-10z"/><circle cx="100" cy="58" r="27"/><path d="M73 56a27 27 0 0 1 54 0z"/><path d="M68 50l-14-12l4 14l-10 2l22 6z"/><path d="M132 50l14-12l-4 14l10 2l-22 6z"/><circle cx="90" cy="64" r="3.5" class="d"/><circle cx="110" cy="64" r="3.5" class="d"/><path class="o" d="M90 74q10 8 20 0"/>`,
  },
  {
    id: 'ninja',
    name: { ar: 'النينجا خفيف', en: 'Khafif the ninja' },
    age: [4, 7],
    art: `<path d="M126 50l28-14l-4 15l16-2l-22 16z"/><path d="M76 142l-12 40h18l12-36z"/><path d="M106 146l10 36h18l-12-40z"/><path d="M80 94L52 68l-11 11l30 32z"/><path d="M120 96l26 20l-10 13l-22-14z"/><path d="M76 90h48l8 54H68z"/><rect x="69" y="124" width="62" height="11" rx="3"/><path d="M96 135l-6 20h8l2-12l2 12h8l-6-20z"/><circle cx="100" cy="62" r="29"/><path d="M76 55q24-9 48 0v12q-24 9-48 0z"/><circle cx="90" cy="61" r="3.5" class="d"/><circle cx="110" cy="61" r="3.5" class="d"/><path class="o" d="M84 53l10 3M116 53l-10 3"/>`,
  },
  {
    id: 'astronaut',
    name: { ar: 'رائد الفضاء', en: 'Astronaut' },
    age: [4, 7],
    art: `<rect x="56" y="86" width="88" height="54" rx="12"/><rect x="74" y="150" width="22" height="34" rx="9"/><rect x="104" y="150" width="22" height="34" rx="9"/><rect x="36" y="96" width="24" height="48" rx="11"/><rect x="140" y="96" width="24" height="48" rx="11"/><rect x="64" y="90" width="72" height="66" rx="14"/><rect x="82" y="108" width="36" height="20" rx="5"/><circle cx="92" cy="118" r="3.5" class="d"/><circle cx="108" cy="118" r="3.5" class="d"/><path class="o" d="M76 140h48"/><circle cx="100" cy="56" r="34"/><rect x="76" y="40" width="48" height="34" rx="16"/><circle cx="91" cy="55" r="3" class="d"/><circle cx="109" cy="55" r="3" class="d"/><path class="o" d="M93 63q7 6 14 0"/><path d="M26 34l3 8l8 3l-8 3l-3 8l-3-8l-8-3l8-3z"/><path d="M174 150l2 6l6 2l-6 2l-2 6l-2-6l-6-2l6-2z"/>`,
  },
  {
    id: 'zuzu',
    name: { ar: 'زوزو الفضائي', en: 'Zuzu from space' },
    age: [3, 6],
    art: `<path class="o" d="M86 46l-9-22M114 46l9-22"/><circle cx="76" cy="19" r="7"/><circle cx="124" cy="19" r="7"/><path d="M48 104q-24-6-30 12q16 12 32 2z"/><path d="M152 104q24-6 30 12q-16 12-32 2z"/><ellipse cx="80" cy="176" rx="17" ry="9"/><ellipse cx="120" cy="176" rx="17" ry="9"/><path d="M100 40C142 40 160 76 156 112C152 150 132 174 100 174C68 174 48 150 44 112C40 76 58 40 100 40z"/><ellipse cx="100" cy="142" rx="27" ry="23"/><circle cx="82" cy="82" r="15"/><circle cx="118" cy="82" r="15"/><circle cx="84" cy="84" r="5.5" class="d"/><circle cx="116" cy="84" r="5.5" class="d"/><path class="o" d="M80 102q20 16 40 0"/><path d="M95 108h10v8h-10z"/><circle cx="58" cy="112" r="5"/><circle cx="144" cy="118" r="4"/><circle cx="62" cy="130" r="3.5"/>`,
  },
  {
    id: 'monster',
    name: { ar: 'الوحش فرفور', en: 'Farfur the monster' },
    age: [3, 6],
    art: `<path d="M62 52l-10-28l24 14z"/><path d="M138 52l10-28l-24 14z"/><path class="o" d="M52 108l-24 16M148 108l24 16"/><circle cx="24" cy="127" r="7"/><circle cx="176" cy="127" r="7"/><path class="o" d="M84 160v20M116 160v20"/><ellipse cx="82" cy="184" rx="13" ry="6"/><ellipse cx="118" cy="184" rx="13" ry="6"/><path d="M50 72q0-32 50-32t50 32v82l-12 12l-13-12l-12 12l-13-12l-13 12l-12-12l-13 12l-12-12z"/><circle cx="82" cy="82" r="17"/><circle cx="122" cy="86" r="12"/><circle cx="84" cy="84" r="6" class="d"/><circle cx="121" cy="87" r="4.5" class="d"/><path d="M70 116h60q-6 26-30 26t-30-26z"/><path d="M80 116l6 11l6-11z"/><path d="M108 116l6 11l6-11z"/>`,
  },
  {
    id: 'dragon',
    name: { ar: 'التنين الصغير', en: 'Little dragon' },
    age: [4, 7],
    art: `<path d="M62 112L22 82l6 34l-14 6l24 12l-6 14l36-10z"/><path d="M138 112l40-30l-6 34l14 6l-24 12l6 14l-36-10z"/><path d="M130 162q38 8 42-24l12 14l-20 2q-4 32-40 22z"/><ellipse cx="80" cy="180" rx="16" ry="8"/><ellipse cx="120" cy="180" rx="16" ry="8"/><ellipse cx="100" cy="138" rx="40" ry="40"/><ellipse cx="100" cy="146" rx="24" ry="27"/><path class="o" d="M80 138h40M77 150h46M82 162h36"/><path d="M74 42l-8-26l22 14z"/><path d="M126 42l8-26l-22 14z"/><path d="M92 38l8-14l8 14z"/><ellipse cx="100" cy="74" rx="44" ry="38"/><ellipse cx="100" cy="90" rx="25" ry="16"/><circle cx="92" cy="86" r="2.5" class="d"/><circle cx="108" cy="86" r="2.5" class="d"/><path class="o" d="M88 96q12 6 24 0"/><circle cx="80" cy="62" r="9"/><circle cx="120" cy="62" r="9"/><circle cx="81" cy="63" r="4" class="d"/><circle cx="119" cy="63" r="4" class="d"/>`,
  },
  {
    id: 'princess',
    name: { ar: 'الأميرة', en: 'Princess' },
    age: [4, 7],
    art: `<path d="M72 60C64 14 136 14 128 60L136 116H64z"/><path d="M100 98L50 182H150z"/><path class="o" d="M66 156q17 12 34 0t34 0"/><path d="M86 86h28l5 24H81z"/><path class="o" d="M84 92L62 118M116 92l22 26"/><circle cx="100" cy="60" r="24"/><circle cx="91" cy="58" r="3.5" class="d"/><circle cx="109" cy="58" r="3.5" class="d"/><path class="o" d="M91 70q9 8 18 0"/><path d="M80 38l5-20l15 14l15-14l5 20z"/><path d="M150 96l3 8l8 1l-6 6l2 8l-7-4l-7 4l2-8l-6-6l8-1z"/><path class="o" d="M146 122l-8 22"/>`,
  },
  {
    id: 'mermaid',
    name: { ar: 'حورية البحر', en: 'Mermaid' },
    age: [4, 7],
    art: `<path d="M76 50C68 10 132 10 124 50L138 116H62z"/><path d="M82 102H118C122 134 112 152 104 162L132 186Q100 172 100 180Q100 172 68 186L96 162C88 152 78 134 82 102z"/><path class="o" d="M86 118q14 10 28 0M88 134q12 9 24 0M93 149q7 6 14 0"/><path d="M86 74h28l4 30H82z"/><path class="o" d="M84 80L60 100M116 80l24 20"/><circle cx="100" cy="50" r="23"/><circle cx="91" cy="49" r="3.5" class="d"/><circle cx="109" cy="49" r="3.5" class="d"/><path class="o" d="M92 60q8 7 16 0"/><path d="M118 26l3 6l7 1l-5 5l1 7l-6-3l-6 3l1-7l-5-5l7-1z"/><circle cx="34" cy="60" r="7"/><circle cx="22" cy="36" r="5"/><circle cx="170" cy="76" r="6"/>`,
  },
  {
    id: 'knight',
    name: { ar: 'الفارس', en: 'Knight' },
    age: [4, 7],
    art: `<path d="M100 36q10-24 30-14q-16 4-18 20z"/><path class="o" d="M156 34v120"/><path d="M156 38l30 11l-30 11z"/><rect x="82" y="142" width="15" height="40" rx="5"/><rect x="103" y="142" width="15" height="40" rx="5"/><path d="M122 96l30 8l-3 14l-28-6z"/><path d="M76 90h48l6 56H70z"/><path class="o" d="M100 90v56M72 118h56"/><path d="M72 66a28 30 0 0 1 56 0v24H72z"/><rect x="80" y="60" width="40" height="9" rx="3" class="d"/><path class="o" d="M100 69v21"/><path d="M26 98h44v30q0 24-22 32q-22-8-22-32z"/><path class="o" d="M48 98v62M26 124h44"/>`,
  },
  {
    id: 'robot',
    name: { ar: 'الروبوت', en: 'Robot' },
    age: [3, 6],
    art: `<path class="o" d="M100 30V14"/><circle cx="100" cy="11" r="6"/><rect x="92" y="78" width="16" height="14"/><rect x="64" y="30" width="72" height="50" rx="12"/><circle cx="84" cy="52" r="9"/><circle cx="116" cy="52" r="9"/><circle cx="84" cy="52" r="3" class="d"/><circle cx="116" cy="52" r="3" class="d"/><rect x="86" y="66" width="28" height="7" rx="3"/><rect x="28" y="96" width="22" height="52" rx="9"/><rect x="150" y="96" width="22" height="52" rx="9"/><rect x="72" y="154" width="22" height="30" rx="5"/><rect x="106" y="154" width="22" height="30" rx="5"/><rect x="54" y="90" width="92" height="68" rx="12"/><rect x="70" y="102" width="60" height="26" rx="5"/><circle cx="78" cy="142" r="6"/><circle cx="100" cy="142" r="6"/><circle cx="122" cy="142" r="6"/>`,
  },
]
