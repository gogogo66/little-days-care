// Search only the care text embedded in this handbook; queries never leave the browser.
function searchBlocks(root){
 const selector='.card,.lesson,.faq details,.routine-step,.color-card,.notice,.freq-item,.milk-table,.stats,.video-card,.table-wrap,.gentle';
 return [...root.querySelectorAll(selector)].filter(el=>!el.parentElement?.closest(selector));
}
function tagSearchBlocks(root){searchBlocks(root).forEach((el,i)=>{el.dataset.searchKey=`care-result-${i}`;if(!el.id)el.id=el.dataset.searchKey;});}
function blockText(el){
 const copy=el.cloneNode(true);copy.querySelectorAll('.refs,.image-caption,.eyebrow,button,.video-badges,.routine-number').forEach(n=>n.remove());
 copy.querySelectorAll('h3,summary,p,li,td,th,caption,.stat,.freq-item,strong,small,span').forEach(n=>n.append(' '));
 return copy.textContent.replace(/\s+/g,' ').trim();
}
let careIndex=null,shownSearchResults=[],searchTimer;
const METHOD_LABELS={breast:'母乳亲喂',formula:'全配方奶参考',mixed:'母乳＋配方奶',expressed:'母乳瓶喂'};
function getCareIndex(){
 if(careIndex)return careIndex;
 const entries=[],saved={...state};indexing=true;
 try{
  for(const a of AGES)for(const t of TOPICS){
   const methods=t.id==='feeding'&&!['older','toddler'].includes(a.id)?['breast','formula','mixed','expressed']:['breast'];
   for(const method of methods){
    Object.assign(state,{age:a.id,topic:t.id,method});
    const template=document.createElement('template');template.innerHTML=({feeding,sleep,diaper,care,videos}[t.id]());
    searchBlocks(template.content).forEach((el,i)=>{
     let title=el.querySelector('h3,summary,caption,strong')?.textContent.trim();
     if(el.matches('.stats'))title=method==='formula'?'这个年龄的全配方奶参考':method==='expressed'?'母乳瓶喂：按需、暂停、看整体':'母乳亲喂：次数与有效进食';
     const text=blockText(el);title=title||text.split(/[。；]/)[0];
     const video=el.querySelector('[data-video]')?.dataset.video;
     entries.push({age:a.id,topic:t.id,method:methods.length>1?method:null,key:`care-result-${i}`,title,body:text,extra:video?VIDEOS[video].steps.join(' '):''});
    });
   }
  }
 }finally{Object.assign(state,saved);indexing=false;}
 document.querySelectorAll('#medical li').forEach((el,i)=>{el.id=`medical-item-${i}`;entries.push({age:null,topic:'medical',method:null,key:el.id,title:el.closest('details').querySelector('summary').textContent.trim(),body:el.textContent.trim(),extra:'就医 急诊 急救'});});
 const other=document.getElementById('medical-vomiting');entries.push({age:null,topic:'medical',method:null,key:other.id,title:'带血或喷射性呕吐：需要医疗评估',body:other.textContent.trim(),extra:'就医 呕吐'});
 careIndex=entries;return entries;
}
function normalizeSearch(s){return s.toLowerCase().replace(/[\s，。？！、＋+／/（）()：:℃°]/g,'');}
function readQueryAge(s){
 const m=s.match(/([0-9]{1,2}|[零一二两三四五六七八九十]{1,3})\s*(?:个)?(月|周|天|岁)/);if(!m)return null;
 const digits={零:0,一:1,二:2,两:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9};
 const raw=m[1];let n=/^\d+$/.test(raw)?Number(raw):raw.includes('十')?(digits[raw.split('十')[0]]||1)*10+(digits[raw.split('十')[1]]||0):digits[raw];
 if(!Number.isFinite(n))return null;
 const unit=m[2],before=s.slice(0,m.index),after=s.slice(m.index+m[0].length);
 if(['天','周'].includes(unit)&&!/出生|生后|日龄|周龄|刚满/.test(before)&&(/^(没|不|未|才|只|一直|都)/.test(after)||/已经|连续|持续/.test(before)))return null;
 let id=unit==='岁'?(n>=1&&n<=3?'toddler':null):unit==='月'?(n<1?'week':n<=3?'young':n<=6?'middle':n<=11?'older':n<=36?'toddler':null):unit==='周'?(n<=1?'week':n<=4?'month':n<=13?'young':n<=26?'middle':n<=47?'older':null):(n<=7?'week':n<=28?'month':n<=99?'young':null);
 // “几天不拉”等问题不是年龄；这里只识别明确的数值年龄。
 return id?{id,text:s.replace(m[0],'')}:null;
}
const SEARCH_FAMILIES=[
 {id:'stool-frequency',test:/不拉|没拉|没便便|没大便|排便少|攒肚|便秘|不排便/,topic:'diaper',title:/几天不拉|排便少/,terms:['便便柔软','干硬','约6周']},
 {test:/红屁股|红屁屁|红臀|尿布疹|屁股红/,topic:'care',title:/轻柔清洁|拍干|刷牙和清洁/,terms:['及时换','及时更换','保持干爽'],related:true},
 {test:/混合喂养|混喂|母乳加奶粉|母乳.*配方|补奶|补喂/,topic:'feeding',method:'mixed',title:/母乳＋配方奶|先看吃奶|再看尿布/,terms:['混合喂养','补多少','补喂量']},
 {test:/挤.*母乳|母乳瓶喂|瓶喂母乳|吸奶器|泵奶|母乳装奶瓶/,topic:'feeding',method:'expressed',title:/母乳瓶喂/,terms:['母乳瓶喂','回应式瓶喂']},
 {test:/夜里哭|晚上哭|夜醒|夜哭|哄不睡|哭闹|哄睡|放下就醒|睡觉|入睡|睡前/,topic:'sleep',title:/放下就醒|先看看|放慢节奏|重复简单|轻柔|睡前流程/,terms:['安抚','醒来哭','睡前']},
 {test:/吐奶|溢奶|喂完吐|拍嗝|反流/,topic:'feeding',title:/吐一点奶|拍嗝/,terms:['拍嗝','嘴角流出']},
 {test:/尿少|尿布干|没尿|湿尿布少|尿量少|几片尿布|脱水|排尿|尿布次数/,topic:'diaper',title:/先看这里|观察表|湿尿布明显少|更大宝宝/,terms:['尿少','湿尿布','尿是否明显减少']},
 {test:/奶不够|没吃饱|母乳不足|奶量不足|吃得少|喝奶少|频繁吃奶|一直找奶/,topic:'feeding',title:/奶量少于|有效进食|先看吃奶|再看尿布/,terms:['频繁索食','频繁找奶','吞咽','不强迫']},
 {test:/奶量|喝多少|多少毫升|几毫升|配方奶|奶粉/,topic:'feeding',method:'formula',title:/这个年龄的全配方奶参考/,terms:['奶量参考','全配方奶参考','每次参考']},
 {test:/黑色便便|黑便|大便黑|柏油便|绿黑便|胎便|拉黑色/,topic:'diaper',title:/黑色柏油|绿黑/,terms:['胎便期后的黑','胎便结束']},
 {test:/发烧|发热|体温|38度|39度|38℃|39℃|38°c|39°c|三十八度/,medical:/38|39/},
 {test:/绿色.*吐|吐.*绿色|黄绿.*吐/,medical:/绿色.*呕吐/},
 {test:/叫不醒|难唤醒|失去反应|抽搐/,medical:/难以唤醒/},
 {test:/呼吸困难|呼吸异常|停止呼吸|嘴唇.*[蓝紫]|舌头.*[蓝紫]|喘不过气|喘不上气|喘不过来/,medical:/停止呼吸/},
 {test:/12小时.*尿|十二小时.*尿|体温低于36/,medical:/12小时/},
 {test:/纽扣电池|吞.*电池/,medical:/纽扣电池/},
 {test:/喷射.*吐|吐血|呕吐带血|带血.*吐/,medical:/带血或喷射性呕吐/},
 {test:/喂奶|亲喂|含接|乳头疼|乳头痛/,topic:'feeding',title:/亲喂含接|乳头一直疼/,terms:['含接','乳头']},
 {test:/便便颜色|大便颜色|便色/,topic:'diaper',title:/绿黑|黄.*绿|红|白|黑色柏油/,terms:['胎便','颜色']},
 {test:/洗澡|脐带|脐部|肚脐/,topic:'care',title:/洗澡与/,terms:['脐带','水温']},
 {test:/就医|急救|急诊/,medical:/./}
];
function searchCare(raw,ageId){
 const q=normalizeSearch(raw);if(!q)return [];
 const families=SEARCH_FAMILIES.filter(f=>f.test.test(raw.toLowerCase()));
 const method=families.find(f=>f.method==='mixed'||f.method==='expressed')?.method||(!families.some(f=>/奶不够/.test(f.test.source)&&f.test.test(raw))?families.find(f=>f.method)?.method:null);
 const urgent=families.filter(f=>f.medical);
 const grams=[...new Set(q.match(/[\p{Script=Han}]{2,}|[a-z0-9]+/gu)?.flatMap(w=>w.length>2&&/\p{Script=Han}/u.test(w)?[...w].slice(0,-1).map((_,i)=>w.slice(i,i+2)):[w])||[])];
 const scored=[];
 for(const item of getCareIndex()){
  if(ageId!=='all'&&item.age&&item.age!==ageId)continue;
  const title=normalizeSearch(item.title),body=normalizeSearch(item.body+' '+item.extra);
  let score=title.includes(q)?120:body.includes(q)?70:0;
  if(!families.length&&!score){const hits=grams.filter(g=>body.includes(g));if(hits.length>=Math.max(1,Math.ceil(grams.length*.6)))score=hits.length*5;}
  for(const f of families){
   if(f.medical){if(item.topic==='medical'&&f.medical.test(item.body.replace(/\s/g,'')))score+=450;continue;}
   if(item.topic===f.topic){if(f.title?.test(item.title))score+=90;score+=(f.terms||[]).filter(t=>item.body.includes(t)).length*18;}
  }
  if(!score)continue;
  if(method&&item.method&&item.method!==method)score-=150;
  if(method&&item.method===method)score+=25;
  if(urgent.length&&item.topic!=='medical')score-=250;
  if(score<=0)continue;
  // Current age/feeding breaks ties, without suppressing a more relevant answer.
  if(item.age===state.age)score+=3;if(item.method===state.method)score+=2;
  if(item.topic==='diaper'&&/黑便|黑色|柏油/.test(raw)&&/黑色柏油/.test(item.title))score+=40;
  if(['older','toddler'].includes(item.age)&&item.topic==='diaper'&&families.some(f=>f.id==='stool-frequency')){if(/排便少/.test(item.title))score+=160;if(/母乳宝宝几天不拉/.test(item.title))score-=120;}
  scored.push({...item,score});
 }
 scored.sort((a,b)=>b.score-a.score);
 const seen=new Set();return scored.filter(x=>{const key=[x.age,x.topic,x.body].join('|');if(seen.has(key))return false;seen.add(key);return true;});
}
function showSearch(value=''){
 $('#search-age').innerHTML=`${AGES.map(a=>`<option value="${a.id}" ${a.id===state.age?'selected':''}>${esc(a.label)}</option>`).join('')}<option value="all">全部年龄</option>`;
 $('#search-query').value=value;$('#search-dialog').showModal();runSearch(true);$('#search-query').focus();
}
function runSearch(detectAge=false){
 clearTimeout(searchTimer);let raw=$('#search-query').value.trim();const explicit=readQueryAge(raw);
 if(detectAge&&explicit)$('#search-age').value=explicit.id;
 if(explicit)raw=explicit.text;
 const related=SEARCH_FAMILIES.some(f=>f.related&&f.test.test(raw));
 const matches=searchCare(raw,$('#search-age').value);shownSearchResults=matches.slice(0,15);$('#search-dialog .search-chips').hidden=Boolean(raw);
 $('#search-status').textContent=!raw?'输入想找的问题，或点上面的常见搜索。':related?'本站还没有红屁股的专门处理指南，以下是相关清洁内容。':matches.length?`找到 ${matches.length} 项${matches.length>15?'，先显示最相关的 15 项':''}。点一项直接查看。`:'这个年龄暂时没找到。可换个简短说法，或选“全部年龄”再查。';
 $('#search-results').innerHTML=shownSearchResults.map((r,i)=>{
  const scope=r.age?AGES.find(a=>a.id===r.age).label:'就医提示 · 请看具体年龄条件';
  const topic=r.topic==='medical'?'':TOPICS.find(t=>t.id===r.topic).label;
  const body=r.body.startsWith(r.title)?r.body.slice(r.title.length).replace(/^[。；：:\s]+/,'')||r.body:r.body;
  const snippet=body.length>230?body.slice(0,230)+'…':body;
  return `<button type="button" class="search-result ${r.topic==='medical'?'medical-result':''}" data-search-result="${i}"><span class="result-context">${esc([scope,topic,r.method?METHOD_LABELS[r.method]:''].filter(Boolean).join(' · '))}</span><strong>${esc(r.title)}</strong><span class="result-snippet">${esc(snippet)}</span><span class="result-open">查看完整图文 →</span></button>`;
 }).join('');
 $('#search-dialog').scrollTop=0;
}
$('#home-search').addEventListener('submit',e=>{e.preventDefault();showSearch($('#home-query').value);});
$('#open-search').addEventListener('click',()=>showSearch());
$('#dialog-search').addEventListener('submit',e=>{e.preventDefault();runSearch(true);});
$('#search-query').addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>runSearch(true),180);});
$('#search-age').addEventListener('change',()=>runSearch(false));
$('#search-dialog').addEventListener('close',()=>clearTimeout(searchTimer));
$('#search-dialog').addEventListener('click',e=>{
 const chip=e.target.closest('[data-search-query]');if(chip){$('#search-query').value=chip.dataset.searchQuery;runSearch(true);return;}
 const result=e.target.closest('[data-search-result]');if(!result)return;
 const r=shownSearchResults[Number(result.dataset.searchResult)];if(!r)return;
 $('#search-dialog').close();
 if(r.topic==='medical'){jumpTo(r.key);return;}
 update({age:r.age,topic:r.topic,...(r.method?{method:r.method}:{})});
 const target=$(`#content [data-search-key="${r.key}"]`);if(target){target.classList.add('search-hit');jumpTo(target.id);}
});
// Give direct links to emergency search results stable anchors before the first search.
document.querySelectorAll('#medical li').forEach((el,i)=>el.id=`medical-item-${i}`);
