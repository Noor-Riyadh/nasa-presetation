// Speaker script, cues and timing. Lines starting with "▶" are ADVANCE CUES (press → / Space);
// they are never shown on the projected stage. "Speaker" is a suggested split — edit freely.

export type SceneMeta = {
  id: string
  title: string
  steps: number // number of presenter-triggered states (0 .. steps-1)
  start: number // target start (seconds)
  end: number // target end (seconds)
  speaker: 'Speaker 1' | 'Speaker 2'
  cueLabels: string[] // what each step shows on screen (for the presenter view)
  script: string[]
  note?: string
}

export const DEMO_PROMPT =
  'How does oxygen concentration affect flame behavior in microgravity? Compare available NASA experiments and identify evidence gaps.'

export const REAL_APP = 'https://embernova.khedmetak.com/workspace'
export const REAL_REPLAY = 'https://embernova.khedmetak.com/s/replay:live-lunar'

export const SCENES: SceneMeta[] = [
  {
    id: 'unsinkable',
    title: 'The Unsinkable',
    steps: 4,
    start: 0,
    end: 35,
    speaker: 'Speaker 1',
    cueLabels: ['Black. Faint ocean.', '1912 · Titanic emerges from fog', 'THE UNSINKABLE', 'Cold-blue shift · iceberg (illustration) · fade to dark'],
    script: [
      '▶ 1 — Titanic يظهر من الضباب، "1912"',
      'في سنة 1912...',
      'سفينة تيتانيك كانت واحدة من أعظم الإنجازات الهندسية في عصرها.',
      'سفينة ضخمة، متطورة، والناس كانت واثقة إنها شبه مستحيل تغرق.',
      '▶ 2 — "THE UNSINKABLE"',
      'لكن في ليلة واحدة...',
      '▶ 3 — تحوّل أزرق بارد + جبل الجليد (رسم توضيحي)',
      'السفينة اصطدمت بجبل جليدي.',
      'الغريب مش إن السفينة اصطدمت.',
      'الغريب إن كتير من الركاب في البداية ماكانوش مستوعبين حجم الكارثة.',
      'كانوا لسه واثقين في السفينة...',
      'وفي الوقت اللي بدأوا فيه يدركوا خطورة الموقف...',
      'كان الوقت بيخلص.',
      '(صمت قصير — ثم → للمشهد التالي)',
    ],
    note: 'ابدأ بصمت 3 ثواني على الشاشة السوداء. الصورة أرشيفية (Titanic عند مغادرة Southampton، 1912) — وجبل الجليد رسم توضيحي وليس إعادة تمثيل تاريخية.',
  },
  {
    id: 'no-escape',
    title: 'There Is Nowhere To Escape',
    steps: 4,
    start: 35,
    end: 60,
    speaker: 'Speaker 1',
    cueLabels: ['Dark ocean dissolves into stars', 'Earth from Artemis II', 'Orion spacecraft · IN SPACE, THERE IS NO ESCAPE.', 'Orange glow blooms (illustrative) → cut'],
    script: [
      '▶ 1 — الأرض من الفضاء',
      'بس أنا مش جاي النهارده أحكيلكم عن تيتانيك.',
      'أنا جاي أتكلم عن سفن تانية...',
      '▶ 2 — مركبة Orion + العنوان',
      'سفن بتسافر على بُعد آلاف، وأحيانًا ملايين الكيلومترات من الأرض.',
      'سفن لو حصل فيها حريق... مفيش مطافي هتيجي تنقذها.',
      'مفيش مكان يهرب له رواد الفضاء.',
      '▶ 3 — توهّج برتقالي',
      'ومفيش فرصة إننا نستنى لحد ما الكارثة تحصل، وبعدين نبدأ نفكر في الحل.',
    ],
    note: 'الصورة الحقيقية من مهمة Artemis II (NASA). التوهج البرتقالي مؤثر بصري توضيحي — مش حريق حقيقي.',
  },
  {
    id: 'cost',
    title: 'The Cost of Failure',
    steps: 3,
    start: 60,
    end: 80,
    speaker: 'Speaker 1',
    cueLabels: ['Apollo 1 — 1967 (NASA photo of cabin)', 'Apollo 13 — 1970 (NASA photo, damaged Service Module)', 'The line: evidence learned early vs. too late'],
    script: [
      '▶ 1 — Apollo 1',
      'في سنة 1967، حريق في مركبة Apollo 1 أثناء اختبار أرضي أدى لوفاة 3 رواد فضاء.',
      '▶ 2 — Apollo 13',
      'وفي سنة 1970، انفجار خزان أكسجين في Apollo 13 حوّل رحلة للقمر لمعركة من أجل النجاة.',
      '▶ 3 — الجملة الختامية',
      'في الفضاء... الفرق بين الحياة والموت ممكن يكون معلومة علمية فهمناها بدري...',
      'أو خطر ماقدرناش نتوقعه في الوقت المناسب.',
      'ومن هنا بدأت قصتنا.',
    ],
    note: 'تنبيه علمي: Apollo 13 كان انفجار/تمزق خزان أكسجين في الـService Module — مش حريق في الكابينة. الشاشة بتوضح ده.',
  },
  {
    id: 'problem',
    title: 'The Research Problem',
    steps: 4,
    start: 80,
    end: 125,
    speaker: 'Speaker 1',
    cueLabels: ['Scattered NASA investigations & reports', 'THE DATA EXISTS. (corpus numbers)', 'THE INSIGHT IS HARDER TO FIND. (units, formats)', 'The manual workflow the researcher must do alone'],
    script: [
      '▶ 1 — THE DATA EXISTS',
      'NASA على مدار سنين عملت أبحاث وتجارب كتير جدًا عشان تفهم النار بتتصرف إزاي في الجاذبية الصغرى.',
      'إزاي اللهب بينتشر؟ إزاي المواد المختلفة بتتحرق؟ وإيه اللي بيحصل لما الظروف تتغير؟',
      '▶ 2 — THE INSIGHT IS HARDER TO FIND',
      'لكن هنا في مشكلة. الداتا والأبحاث مش كلها في مكان واحد، ومش كلها بنفس الشكل.',
      '▶ 3 — سير العمل اليدوي',
      'تخيل إنك باحث وعايز تعرف تأثير تركيز الأكسجين على سلوك اللهب في الجاذبية الصغرى.',
      'ممكن تحتاج تدور في أكتر من دراسة، وتقارن تجارب مختلفة، وتراجع القياسات والوحدات، وتحلل النتائج بنفسك.',
      'وده ممكن ياخد وقت ومجهود كبير.',
    ],
    note: 'الأرقام على الشاشة (34 تجربة، 93 تقرير، 3,187 صفحة، 1,161 سجل اختبار) مأخوذة من صفحة EmberNova الفعلية — snapshot بتاريخ 2026-11-13.',
  },
  {
    id: 'reveal',
    title: 'The Reveal',
    steps: 5,
    start: 125,
    end: 155,
    speaker: 'Speaker 2',
    cueLabels: ['Documents collapse into darkness', 'A small ember', 'The ember becomes a nova', 'EMBERNOVA · Autonomous AI Research Agent', 'Not another chatbot.'],
    script: [
      '▶ 1 — الوثائق بتنهار في الظلام',
      'فإحنا سألنا نفسنا سؤال:',
      'بدل ما الباحث يقضي وقته يدور على المعلومة ويجمع الداتا...',
      '▶ 2 — جمرة صغيرة',
      'إيه اللي يحصل لو بنينا AI يقدر يساعده يعمل عملية البحث والتحليل دي كلها؟',
      '▶ 3 — الـNova',
      'And that\'s why we built... EmberNova.',
      '▶ 4 — الاسم + Autonomous AI Research Agent',
      'بس EmberNova مش مجرد Chatbot بتسأله سؤال ويرد عليك بإجابة. إحنا بنينا Autonomous AI Research Agent.',
      '▶ 5 — Not another chatbot.',
      'AI Agent يقدر يبحث، ويختار الأدوات المناسبة، وينفذ تحليل باستخدام Python، ويقارن بين التجارب، ويقدم نتائج مدعومة بمصادر NASA.',
      'والأهم... إنه مش بس بيقولك إيه اللي عرفه.',
      'هو كمان بيوضحلك إيه اللي لسه مش معروف، وإيه اللي الأدلة عليه مش كفاية.',
    ],
    note: 'لحظة الكشف — خلي فيه صمت قصير قبل "EmberNova". الشاشة مش محتاجة كلام زيادة.',
  },
  {
    id: 'demo',
    title: 'Live Research Demonstration',
    steps: 10,
    start: 155,
    end: 275,
    speaker: 'Speaker 2',
    cueLabels: [
      'Demo prompt + launch buttons',
      '1 · NASA Research Search',
      '2 · Agent Tool Execution',
      '3 · Python Analysis',
      '4 · Cross-Experiment Comparison',
      '5 · Interactive Charts',
      '6 · NASA Citations',
      '7 · Validation & Uncertainty',
      '8 · Evidence-Gap Map',
      '9 · Research Artifacts & Exports',
    ],
    script: [
      '▶ 0 — السؤال + أزرار التشغيل (O = افتح التطبيق الحقيقي)',
      'خلوني أوريكم ده عمليًا. بدل ما نشرح كل Feature لوحدها، هنعمل حاجة أحسن.',
      'هنخلي EmberNova يشتغل قدامكم.',
      '▶ 1 — NASA Research Search',
      'أول حاجة، الـAgent بيبحث في المصادر والأبحاث العلمية المرتبطة بالسؤال.',
      '▶ 2 — Agent Tool Execution',
      'بعد كده بيجمع الأدلة المتاحة، ويقدر يقارن بين التجارب المختلفة بدل ما يعتمد على تجربة واحدة.',
      '▶ 3 — Python Analysis',
      'ولو السؤال محتاج تحليل عددي، عنده Python tools يقدر يستخدمها لتحليل البيانات.',
      '▶ 4 — Cross-Experiment Comparison',
      '(مقارنة التجارب بشروطها وتحذيراتها)',
      '▶ 5 — Interactive Charts',
      'وهنا النتائج بتظهر قدامنا في Interactive Charts.',
      '▶ 6 — NASA Citations',
      'وكل استنتاج مرتبط بالأدلة والمصادر اللي اتبنى عليها.',
      'لأننا مش عايزين AI يدينا إجابة شكلها مقنع وخلاص. عايزين نعرف هو وصل للإجابة دي إزاي، وقد إيه نقدر نعتمد عليها.',
      '▶ 7 — Validation & Uncertainty',
      'وعشان كده أضفنا Scientific Validation & Uncertainty. النظام بيوضح حدود الاستنتاجات وإمتى الأدلة مش كفاية.',
      '▶ 8 — Evidence-Gap Map',
      'لكن واحدة من أهم المميزات هي Evidence-Gap Map.',
      'بدل ما نقف عند النتائج اللي نعرفها... بنحاول نحدد فين النقص في الأدلة العلمية.',
      'إيه الأسئلة اللي لسه محتاجة تجارب؟ وإيه المناطق اللي محتاجة بحث أكتر؟',
      '▶ 9 — Artifacts & Exports',
      'وفي الآخر، الباحث يقدر يحتفظ بمخرجات البحث والتحليل ويصدرها.',
      'يعني إحنا مش بنقدم مجرد محادثة. إحنا بنقدم Research Workflow متكامل.',
    ],
    note:
      'مهم: الصور في هذا المشهد لقطات حقيقية من تطبيق EmberNova (جلسة مسجلة 2026-11-13 + صفحات التطبيق). السؤال المسجل كان عن habitat القمر (30–34% O₂) — مش نفس نص سؤال العرض. لو هتشغّل الـlive، اضغط O لفتح التطبيق، الصق السؤال (C لنسخه)، وارجع للعرض بـAlt+Tab — العرض بيفضل في مكانه. لو النتيجة الحية اختلفت، اعرض النتيجة الحية كما هي.',
  },
  {
    id: 'architecture',
    title: 'Under The Hood',
    steps: 7,
    start: 275,
    end: 315,
    speaker: 'Speaker 2',
    cueLabels: ['Research question', 'Autonomous agent (plans + explains)', 'NASA research search & data access', 'Python & numerical analysis · cross-experiment comparison', 'Scientific validation', 'Evidence ledger → cited output', 'Multi-turn research sessions'],
    script: [
      '▶ 1 — الـAgent',
      'قوة EmberNova مش في إنه بيستخدم Large Language Model. القوة الحقيقية في اللي بنيناه حواليه.',
      '▶ 2 — البحث والبيانات',
      'إحنا جمعنا بين Autonomous Agent Workflow، وNASA Research Search،',
      '▶ 3 — التحليل والمقارنة',
      'وPython Analysis، وCross-Experiment Comparison،',
      '▶ 4 — التحقق',
      'وScientific Validation، وEvidence-Gap Mapping.',
      '▶ 5 — المخرجات',
      'وكل ده جوه تجربة واحدة.',
      '▶ 6 — Multi-turn',
      'وعندنا كمان Multi-turn Research Sessions، عشان الباحث يقدر يكمل نفس مسار البحث ويسأل أسئلة أعمق بناءً على النتائج السابقة.',
    ],
    note: 'أسماء الأدوات على الشاشة هي أسماء الأدوات الفعلية من صفحة "How it works" في EmberNova. الأرقام (6 جولات / 120 ثانية / ~$0.30) هي الحدود الافتراضية المعلنة.',
  },
  {
    id: 'future',
    title: 'The Future',
    steps: 3,
    start: 315,
    end: 345,
    speaker: 'Speaker 2',
    cueLabels: ['Orion + Moon (Artemis II, NASA)', 'BETTER RESEARCH. BETTER DECISIONS.', 'SAFER EXPLORATION. + honest scope line'],
    script: [
      '▶ 1 — BETTER RESEARCH. BETTER DECISIONS.',
      'طيب، إيه التأثير الحقيقي اللي إحنا بنستهدفه؟',
      '▶ 2 — SAFER EXPLORATION.',
      'إحنا مش بنقول إن EmberNova هيمنع كل حرائق الفضاء. ومش بندّعي إنه بديل للعلماء أو لاختبارات السلامة.',
      'لكن إحنا عايزين نساعد الباحثين والمهندسين يوصلوا للأدلة أسرع، ويقارنوا النتائج بشكل أسهل، ويعرفوا فين لسه محتاجين بحث.',
      'لأن فهم أفضل لسلوك النار في الجاذبية الصغرى ممكن يساعد في تحسين تصميم أنظمة السلامة والوقاية في المهمات المستقبلية.',
    ],
  },
  {
    id: 'ending',
    title: 'The Full Circle',
    steps: 7,
    start: 345,
    end: 375,
    speaker: 'Speaker 1',
    cueLabels: ['Dark Atlantic returns (Titanic ghost)', 'Ocean opens into Earth from orbit', 'BECAUSE IN SPACE…', 'NO ROOM FOR GUESSING.', 'NO ROOM FOR IGNORING THE EVIDENCE.', 'NO ROOM FOR LEARNING TOO LATE.', 'EMBERNOVA · Thank you.'],
    script: [
      'فاكرين تيتانيك اللي بدأنا بيها؟',
      '▶ 1 — المحيط يتحول للأرض',
      'المشكلة ماكانتش بس في الجبل الجليدي. المشكلة كمان كانت في إن الناس ماقدرتش تستوعب الخطر وتتفاعل معاه بالسرعة الكافية.',
      'وفي استكشاف الفضاء، مش عايزين نستنى لحد ما الخطر يبقى كارثة.',
      'إحنا عايزين نستفيد من كل تجربة اتعملت... كل نتيجة اتسجلت... وكل درس اتعلمناه من الماضي...',
      'عشان نفهم المخاطر بشكل أفضل، قبل ما تتحول لأزمات في المستقبل.',
      '(وقفة)',
      '▶ 2 — BECAUSE IN SPACE...',
      '▶ 3 — NO ROOM FOR GUESSING',
      '▶ 4 — NO ROOM FOR IGNORING THE EVIDENCE',
      '▶ 5 — NO ROOM FOR LEARNING TOO LATE',
      '▶ 6 — EMBERNOVA — Thank you.',
    ],
    note: 'الأسطر الثلاثة بتظهر واحد واحد — اسيب كل سطر ياخد وقته. الختام: "Turning NASA\'s research into actionable scientific insight." ثم Thank you.',
  },
]

export const TOTAL_TARGET = SCENES[SCENES.length - 1].end

export type Pos = { scene: number; step: number }
export const clampPos = (p: Pos): Pos => {
  const scene = Math.max(0, Math.min(SCENES.length - 1, p.scene))
  const step = Math.max(0, Math.min(SCENES[scene].steps - 1, p.step))
  return { scene, step }
}
export const nextPos = (p: Pos): Pos => {
  const m = SCENES[p.scene]
  if (p.step < m.steps - 1) return { scene: p.scene, step: p.step + 1 }
  if (p.scene < SCENES.length - 1) return { scene: p.scene + 1, step: 0 }
  return p
}
export const prevPos = (p: Pos): Pos => {
  if (p.step > 0) return { scene: p.scene, step: p.step - 1 }
  if (p.scene > 0) return { scene: p.scene - 1, step: SCENES[p.scene - 1].steps - 1 }
  return p
}
export const fmt = (s: number) => {
  const m = Math.floor(Math.abs(s) / 60)
  const r = Math.floor(Math.abs(s) % 60)
  return `${s < 0 ? '-' : ''}${m}:${String(r).padStart(2, '0')}`
}
