function tipSources(t){return `<details class="refs source-note"><summary>想查来源？展开看看</summary><div class="refs-links">${t.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>`).join('')}</div></details>`;}
function tipCard(t){
 const clip=CAREGIVER_VIDEOS.find(v=>v.tipIds.includes(t.id));
 return `<article class="card tip-card" id="tip-${esc(t.id)}"><p class="tip-scene">${esc(t.scene)}</p><h3>${esc(t.title)}</h3><ol class="tip-steps">${t.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="tip-note"><strong>记住这一点</strong> ${esc(t.note)}</p>${t.image?`<details class="tip-picture"><summary>展开动作图</summary>${photo(t.image)}</details>`:''}${clip?`<button class="play-button secondary" data-caregiver-video="${esc(clip.id)}">▶ 看真人示范</button>`:t.localVideo?videoButton(t.localVideo,'看中文图解'):''}${tipSources(t)}</article>`;
}
function creatorCard(v){return `<article class="card creator-card" id="creator-${esc(v.id)}"><button class="creator-cover" data-caregiver-video="${esc(v.id)}" aria-label="观看${esc(v.shortTitle)}">${!indexing&&v.cover?`<img src="${esc(v.cover)}" alt="${esc(v.shortTitle)}视频封面" loading="lazy" referrerpolicy="no-referrer">`:''}<span class="creator-play" aria-hidden="true">▶</span><span class="creator-duration">${esc(duration(v.durationSeconds))}</span></button><div class="creator-description"><p class="tip-meta">${esc(v.author)} · B站</p><h3>${esc(v.shortTitle)}</h3><p>${esc(v.focus)}</p><button class="text-button" data-caregiver-video="${esc(v.id)}">打开真人示范</button></div></article>`;}
function creatorShelf(){
 const vs=CAREGIVER_VIDEOS.filter(v=>v.ages.includes(state.age));
 return vs.length?`<section class="creator-shelf" id="everyday-videos" aria-labelledby="creator-heading"><h3 id="creator-heading">看看照护者怎么做</h3><p class="micro-note">作者自己的真人分享。点开可看原视频，也有本站整理的动作要点。</p><div class="creator-grid">${vs.map(creatorCard).join('')}</div></section>`:'';
}
function tips(){
 const groups=[{id:'feeding',title:'喂奶时，先让自己舒服一点',short:'喂奶省力'},{id:'soothing',title:'抱哄时，少折腾一点',short:'抱抱安抚'},{id:'changing',title:'换洗穿衣，提前一步就从容',short:'换洗穿衣'}];
 const available=EVERYDAY_TIPS.filter(t=>t.ages.includes(state.age));
 const active=groups.filter(g=>available.some(t=>t.group===g.id));
 return `<nav class="quick-jumps" aria-label="小窍门分类">${active.map(g=>`<a href="#tips-${g.id}">${g.short}</a>`).join('')}${CAREGIVER_VIDEOS.some(v=>v.ages.includes(state.age))?'<a href="#everyday-videos">真人短视频</a>':''}</nav>${creatorShelf()}${active.map(g=>`<section class="tip-group" id="tips-${g.id}"><h3 class="quick-title">${g.title}</h3><div class="grid">${available.filter(t=>t.group===g.id).map(tipCard).join('')}</div></section>`).join('')}${!available.length?'<p class="gentle">这组小窍门主要面向 0–6 个月。宝宝大了，可以按当前年龄继续看洗护和睡前安排。</p><button class="play-button" data-go-topic="care">看这个年龄的日常照护</button>':''}<p class="gentle">一次试一个顺手的小办法就好。宝宝不舒服时先停一停，不追求“秒睡”或“必须拍出嗝”。</p>`;
}
function openCaregiverVideo(id,trigger){
 const v=CAREGIVER_VIDEOS.find(v=>v.id===id);if(!v)return;
 const dialog=$('#everyday-video-dialog');dialog._opener=trigger;$('#everyday-video-title').textContent=v.shortTitle;

 $('#everyday-video-content').innerHTML=`<p class="creator-author">作者：${esc(v.author)} · ${esc(duration(v.durationSeconds))} · <a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">去 B 站看原片</a></p>${v.note?`<p class="tip-note">${esc(v.note)}</p>`:''}<div class="video-view-switch" role="group" aria-label="真人示范阅读或观看"><button class="play-button secondary" id="creator-read" aria-pressed="false">读动作要点</button><button class="play-button secondary" id="creator-watch" aria-pressed="false">看真人视频</button></div><section id="creator-reading" class="reader-steps" hidden><h3>这次留意这个小动作</h3><p>${esc(v.focus)}</p><ol class="tip-steps">${v.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></section><div id="creator-watching" hidden><div id="creator-player" class="creator-player"></div><p class="micro-note">播放器由 B 站提供，需联网。若播放受限，可点上方原片链接或切换“读动作要点”。</p></div><details class="source-note refs"><summary>原片信息</summary><p>《${esc(v.title)}》 · ${esc(v.author)}</p><p>原作者的经验分享；本站的三步文字为独立整理。</p></details>`;
 const view=reading=>{
  $('#creator-reading').hidden=!reading;$('#creator-watching').hidden=reading;
  $('#creator-read').setAttribute('aria-pressed',String(reading));$('#creator-watch').setAttribute('aria-pressed',String(!reading));
  $('#creator-player').innerHTML=reading?'':`<iframe src="${esc(v.embedUrl)}" title="${esc(v.shortTitle)}，${esc(v.author)}的真人示范" allow="fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  dialog.scrollTop=0;
 };
 dialog.showModal();$('#creator-read').addEventListener('click',()=>view(true));$('#creator-watch').addEventListener('click',()=>view(false));view(document.documentElement.classList.contains('large-type'));
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-caregiver-video]');if(b)openCaregiverVideo(b.dataset.caregiverVideo,b);});
document.addEventListener('error',e=>{if(e.target.matches?.('.creator-cover img'))e.target.hidden=true;},true);
$('#everyday-video-dialog').addEventListener('close',()=>{$('#everyday-video-content').innerHTML='';$('#everyday-video-dialog')._opener?.focus({preventScroll:true});});
