const AGES=[
{id:'week',label:'出生 1 周内',short:'0–7 天',legacy:'newborn',feedingNote:'最初几天，次数和有效进食比凑足一瓶更重要。',sleepNote:'新生儿还没有稳定昼夜节律。夜醒、吃奶和需要抱哄都很常见。'},
{id:'month',label:'第 2–4 周',short:'8–28 天',legacy:'newborn',feedingNote:'奶量会逐渐变化；不要把“常见范围”变成必须喝完的任务。',sleepNote:'这个阶段不要求独立入睡，也不要为了“睡整觉”延迟喂奶。'},
{id:'young',label:'1–3 个月',short:'1–3 个月',legacy:'infant',feedingNote:'每一顿都可能不同。持续的体重趋势、有效进食和尿布更有意义。',sleepNote:'可以慢慢建立昼夜线索，仍及时回应饥饿与不适。'},
{id:'middle',label:'4–6 个月',short:'4–6 个月',legacy:'middle',feedingNote:'月份不是自动加量的指令。辅食通常约6个月、具备准备信号后开始。',sleepNote:'重复一个简短睡前流程，出现尝试翻身迹象时停止襁褓包裹。'},
{id:'older',label:'7–11 个月',short:'7–11 个月',legacy:'older',feedingNote:'母乳或婴儿配方奶继续，辅食质地随能力逐步增加。',sleepNote:'一岁以内每次入睡仍仰卧放下，睡眠空间保持平坦、坚实、空。'},
{id:'toddler',label:'1–3 岁',short:'1–3 岁',legacy:'toddler',feedingNote:'规律提供多样食物，坐稳吃饭，成人在旁，不强迫吃完。',sleepNote:'可预期的睡前活动与温和、一致的回应，帮助孩子慢慢安定。'}
];
const TOPICS=[{id:'feeding',label:'喂奶与奶量',title:'怎么喂，吃多少？'},{id:'sleep',label:'哄睡与安抚',title:'从安抚到安全入睡'},{id:'diaper',label:'尿布与便便',title:'次数、颜色，一起看'},{id:'care',label:'洗护与安全',title:'一步一步，照顾日常'},{id:'videos',label:'视频示范',title:'看一遍，再跟着做'}];
const EXTRA_SOURCES={
fhsBottle:{title:'香港卫生署 · 奶瓶喂哺指引',url:'https://www.fhs.gov.hk/sc_chi/health_info/child/12146.html'},
fhsBreast:{title:'香港卫生署 · 母乳喂哺：新生婴儿篇',url:'https://www.fhs.gov.hk/tc_chi/health_info/child/12172.html'},
formulaAmount:{title:'CDC · 配方奶量与频率',url:'https://www.cdc.gov/infant-toddler-nutrition/formula-feeding/how-much-and-how-often.html'},
aapAmount:{title:'AAP · 配方奶量参考',url:'https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx'},
latch:{title:'NHS · 母乳姿势与含接',url:'https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/breastfeeding/positioning-and-attachment/'},
enoughMilk:{title:'NHS · 如何知道奶量足够',url:'https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/breastfeeding-problems/enough-milk/'},
nappy:{title:'NHS · 换尿布与排便变化',url:'https://www.nhs.uk/baby/caring-for-a-newborn/how-to-change-your-babys-nappy/'},
pooPhotos:{title:'NCT · 尿布实物照片',url:'https://www.nct.org.uk/baby-toddler/nappies-and-poo/newborn-baby-poo-nappies-what-expect'},
reflux:{title:'NHS · 婴儿吐奶',url:'https://www.nhs.uk/conditions/reflux-in-babies/'},
sleepHelp:{title:'NHS · 帮助宝宝入睡',url:'https://www.nhs.uk/baby/caring-for-a-newborn/helping-your-baby-to-sleep/'},
fhsSleep:{title:'香港卫生署 · 婴儿安全睡眠',url:'https://www.fhs.gov.hk/tc_chi/health_info/child/14799.html'},
constipation:{title:'香港卫生署 · 宝宝便秘',url:'https://www.fhs.gov.hk/tc_chi/health_info/child/30009.html'},
bloodStool:{title:'NHS · 便血',url:'https://www.nhs.uk/symptoms/bleeding-from-the-bottom-rectal-bleeding/'},
imageRights:{title:'香港卫生署 · 图像转载说明',url:'https://www.fhs.gov.hk/sc_chi/notice/notice.html'},
safeSleepVideo:{title:'香港卫生署／新闻处 · 2024安全睡眠短片',url:'https://www.isd.gov.hk/sim/tvapi/24_md411.html'}
};
const LESSONS={
breast:{title:'亲喂含接：先舒服，再看吞咽',image:'attachment',video:'latch',refs:['latch','feeding'],steps:[['贴近、对齐','妈妈坐稳；宝宝腹部贴近你，头和身体成一直线，不扭着脖子吃奶。'],['鼻尖对乳头','支撑颈肩和背，让头能稍后仰；不要按住后脑向乳房推。'],['等嘴张大','下巴先靠近乳房，含入乳头及较多乳晕，不只是叼住乳头。'],['看有效进食','脸颊圆、能看到或听到吞咽。持续疼痛、反复滑脱或听到咂嘴声时，请哺乳专业人员协助。']]},
bottle:{title:'瓶喂：让宝宝有暂停的机会',image:'bottle',video:'bottle',refs:['fhsBottle'],steps:[['半坐卧，托住头颈','把宝宝抱在怀里，脸部朝向你，保持头颈与身体对齐。不要平躺着喂。'],['轻触上唇，等主动张嘴','先看找奶信号；不要硬塞奶嘴。'],['奶瓶接近水平','仅稍微抬高，让奶嘴前端有奶。停吸、奶从嘴角流出时，给宝宝休息。'],['吃饱就结束','转头、闭嘴、推开奶瓶时停下来，不敲奶瓶催喝，也不强迫喝完。']]},
burping:{title:'拍嗝：托稳比拍得响更重要',image:'burping',video:'burping',refs:['fhsBottle','reflux'],steps:[['选择有支撑的姿势','竖抱靠在肩上并托住头颈，或让宝宝坐在大腿上。'],['托下巴和胸部，别压喉咙','坐腿式让身体略向前，头颈始终有支撑。'],['轻抚或轻拍背部','可在喂奶暂停时或喂后试几分钟；不需要用力，也不必强求每次拍出嗝。'],['睡觉仍回到安全小床','喂后可以清醒看护下竖抱一会儿；一旦要睡，仰卧放回平坦坚实的睡面，不垫高床头。']]}
};
const NAPPY_ROWS=[
{age:'出生第 1–2 天',wet:'每天至少 1–2 片',poo:'母乳宝宝通常每天至少1次；绿黑、黏稠胎便。',ids:['week']},
{age:'出生第 3–4 天',wet:'每天至少 3–4 片',poo:'母乳宝宝通常每天至少2次；颜色由绿黑转棕／绿，逐渐变软。',ids:['week']},
{age:'出生第 5 天起',wet:'通常至少 6 片明显湿',poo:'母乳最初数周通常每天至少2次软便，可黄、绿或棕。',ids:['week','month']},
{age:'第 2–6 周',wet:'通常至少约 6 片',poo:'母乳宝宝常有每天2次以上，也可能每次吃奶后都有。明显减少要先检查有效进食。',ids:['month','young']},
{age:'约 6 周后',wet:'与平常相比是否减少',poo:'母乳宝宝可几天才拉一次；若便仍软、吃奶和生长正常，可属正常。配方宝宝次数也会变化。',ids:['young','middle']}
];
const COLORS=[
{name:'绿黑 · 胎便',hex:'#333b24',tag:'只限最初几天',text:'生后最初1–2天常见，黏稠，之后应逐渐变浅。出生48小时仍无胎便，请联系医生。'},
{name:'黄／芥末黄',hex:'#c5a12f',tag:'常见母乳便',text:'软稀、可带细颗粒。单纯软稀不等于腹泻；突然明显增多且水样，要结合精神、尿量判断。'},
{name:'棕黄／绿色',hex:'#7c8050',tag:'也可能正常',text:'配方奶宝宝可较稠、较深；绿色本身不等于受凉或必须换奶。'},
{name:'白／灰白／很浅',hex:'#e6e3d8',tag:'当天联系儿科',alert:true,text:'白色、陶土灰或很浅的奶油色便，需及时评估；尤其伴黄疸或深色尿，不等几天再看。'},
{name:'红色／带血',hex:'#a84043',tag:'联系医生评估',alert:true,text:'血丝或红便不能自行当成食物过敏。量多或同时精神差、腹痛，应立即就医。'},
{name:'黑色柏油样',hex:'#25262a',tag:'胎便结束后异常',alert:true,text:'正常胎便期结束后又出现黑色柏油样便，要及时就医。不能仅凭“新生儿大便黑”而忽略。'}
];
const SLEEP_STEPS=[['先排查需要','有找奶信号就喂；检查尿布、冷热和不适。不要为了凑喂奶间隔让饿宝宝一直哭。'],['减少刺激','调暗灯光、放轻声音、结束逗玩。白天保留正常光线和互动，夜间尽量安静。'],['托稳，温柔安抚','贴近怀抱，托住头颈，轻声哼唱或缓慢走动。一次先试一种，不大力摇晃。'],['放回安全睡处','每次仰卧放入自己的硬、平、空小床。成人困了，先放下宝宝，别抱着在沙发上睡。']];
