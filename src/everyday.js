function tipSources(t){return `<details class="refs source-note"><summary>想查来源？展开看看</summary><div class="refs-links">${t.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>`).join('')}</div></details>`;}
function tipCard(t){
 const clip=CAREGIVER_VIDEOS.find(v=>v.tipIds.includes(t.id));
 return `<article class="card tip-card" id="tip-${esc(t.id)}"><p class="tip-scene">${esc(t.scene)}</p><h3>${esc(t.title)}</h3><ol class="tip-steps">${t.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="tip-note"><strong>记住这一点</strong> ${esc(t.note)}</p>${t.image?`<details class="tip-picture"><summary>展开动作图</summary>${photo(t.image)}</details>`:''}${clip?`<button class="play-button secondary" data-caregiver-video="${esc(clip.id)}">▶ 看真人示范</button>`:t.localVideo?videoButton(t.localVideo,'看中文图解'):''}${tipSources(t)}</article>`;
}
function creatorCard(v){return `<article class="card creator-card" id="creator-${esc(v.id)}"><button class="creator-cover" data-caregiver-video="${esc(v.id)}" aria-label="观看${esc(v.shortTitle)}">${!indexing&&v.cover?`<img src="${esc(v.cover)}" alt="${esc(v.shortTitle)}视频封面" loading="lazy" referrerpolicy="no-referrer">`:''}<span class="creator-cover-label">${esc(v.providerLabel)} · 真人示范</span><span class="creator-play" aria-hidden="true">▶</span><span class="creator-duration">${esc(duration(v.durationSeconds))}</span></button><div class="creator-description"><p class="tip-meta">${esc(v.author)} · ${esc(v.providerLabel)}</p><h3>${esc(v.shortTitle)}</h3><p>${esc(v.focus)}</p><button class="text-button" data-caregiver-video="${esc(v.id)}">在本站播放</button></div></article>`;}
function creatorShelf(){
 const vs=CAREGIVER_VIDEOS.filter(v=>v.ages.includes(state.age));
 return vs.length?`<section class="creator-shelf" id="everyday-videos" aria-labelledby="creator-heading"><h3 id="creator-heading">看看照护者怎么做</h3><p class="micro-note">点开就在本站看，不用离开这一页。也可以切换动作步骤，或看相关中文图解。</p><div class="creator-grid">${vs.map(creatorCard).join('')}</div></section>`:'';
}
function tips(){
 const groups=[{id:'feeding',title:'喂奶时，先让自己舒服一点',short:'喂奶省力'},{id:'soothing',title:'抱哄时，少折腾一点',short:'抱抱安抚'},{id:'changing',title:'换洗穿衣，提前一步就从容',short:'换洗穿衣'}];
 const available=EVERYDAY_TIPS.filter(t=>t.ages.includes(state.age));
 const active=groups.filter(g=>available.some(t=>t.group===g.id));
 return `<nav class="quick-jumps" aria-label="小窍门分类">${active.map(g=>`<a href="#tips-${g.id}">${g.short}</a>`).join('')}${CAREGIVER_VIDEOS.some(v=>v.ages.includes(state.age))?'<a href="#everyday-videos">真人短视频</a>':''}</nav>${creatorShelf()}${active.map(g=>`<section class="tip-group" id="tips-${g.id}"><h3 class="quick-title">${g.title}</h3><div class="grid">${available.filter(t=>t.group===g.id).map(tipCard).join('')}</div></section>`).join('')}${!available.length?'<p class="gentle">这组小窍门主要面向 0–6 个月。宝宝大了，可以按当前年龄继续看洗护和睡前安排。</p><button class="play-button" data-go-topic="care">看这个年龄的日常照护</button>':''}<p class="gentle">一次试一个顺手的小办法就好。宝宝不舒服时先停一停，不追求“秒睡”或“必须拍出嗝”。</p>`;
}
function openCaregiverVideo(id,trigger){
 const v=CAREGIVER_VIDEOS.find(v=>v.id===id);if(!v)return;
 const guide=VIDEOS[v.localGuide];
 const dialog=$('#everyday-video-dialog');dialog._opener=trigger;$('#everyday-video-title').textContent=v.shortTitle;
 $('#everyday-video-content').innerHTML=`<p class="creator-author">${esc(v.author)} · ${esc(v.providerLabel)} · ${esc(duration(v.durationSeconds))}</p>${v.note?`<p class="tip-note">${esc(v.note)}</p>`:''}<div class="video-view-switch" role="group" aria-label="选择观看方式"><button class="play-button secondary" id="creator-watch" data-creator-view="watch" aria-pressed="false">▶ 在本站播放</button><button class="play-button secondary" id="creator-read" data-creator-view="read" aria-pressed="false">看动作步骤</button>${guide?'<button class="play-button secondary" id="creator-guide" data-creator-view="guide" aria-pressed="false">相关中文图解</button>':''}</div><section id="creator-reading" class="reader-steps" hidden><h3>这次留意这个小动作</h3><p>${esc(v.focus)}</p><ol class="tip-steps">${v.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></section><div id="creator-watching" hidden><div id="creator-player" class="creator-player"></div><p id="creator-player-note" class="micro-note"></p><p id="creator-playback-status" class="micro-note" role="status"></p><details class="creator-help"><summary>视频没出来？在这里继续看</summary><div class="video-actions"><button class="text-button" data-creator-view="read">看动作步骤</button>${guide?'<button class="text-button" data-creator-view="guide">换成本站中文图解</button>':''}<button class="text-button" data-creator-view="watch">重试真人视频</button></div><p class="micro-note">不用跳转。播放器若提示登录、打开 App 或暂时不可用，可以先用上面的方式继续。</p></details></div><details class="source-note refs"><summary>作者与原片出处</summary><p>《${esc(v.title)}》 · ${esc(v.author)}</p><p>真人示范使用${esc(v.providerLabel)}官方播放器，需联网。本站的动作步骤为独立整理。</p><a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">查看原片出处（打开${esc(v.providerLabel)}）</a></details>`;
 const view=mode=>{
  const reading=mode==='read',local=mode==='guide'&&guide;
  $('#creator-reading').hidden=!reading;$('#creator-watching').hidden=reading;
  $$('#everyday-video-content .video-view-switch button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.creatorView===mode)));
  const player=$('#creator-player');player.classList.toggle('portrait-player',!reading&&!local&&v.orientation==='portrait');
  $('#creator-playback-status').textContent='';
  if(reading)player.innerHTML='';
  else if(local){
   player.innerHTML=`<video controls playsinline preload="metadata" aria-label="${esc(guide.title)}，本站中文图解" poster="${esc(mediaUrl(guide.clipPoster))}"><source src="${esc(mediaUrl(guide.clipPath))}" type="video/mp4"><track kind="captions" src="${esc(mediaUrl(guide.clipCaptions))}" srclang="zh" label="中文步骤"></video>`;
   $('#creator-player-note').textContent='相关图解：'+guide.title+'。本站制作的照片／步骤短片，无配音，和上面的真人原片不同。'+(v.localGuide==='diaper'?'步骤参考香港卫生署家庭健康服务。':'照片来源：香港卫生署家庭健康服务。');
   const video=player.querySelector('video'),status=$('#creator-playback-status');
   const failure=()=>{status.textContent='图解暂时无法加载，可以切换“看动作步骤”继续。'};
   video.addEventListener('error',failure);video.querySelector('source').addEventListener('error',failure);
  }else{
   player.innerHTML=`<iframe src="${esc(v.embedUrl)}" title="${esc(v.shortTitle)}，${esc(v.author)}的真人示范" allow="fullscreen; picture-in-picture; encrypted-media" sandbox="allow-scripts allow-same-origin allow-presentation" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
   $('#creator-player-note').textContent='轻点画面里的播放键即可观看。'+v.providerLabel+'官方播放器，需要联网。';
  }
  dialog.scrollTop=0;
 };
 dialog.showModal();$$('#everyday-video-content [data-creator-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.creatorView)));view(document.documentElement.classList.contains('large-type')?'read':'watch');
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-caregiver-video]');if(b)openCaregiverVideo(b.dataset.caregiverVideo,b);});
document.addEventListener('error',e=>{if(e.target.matches?.('.creator-cover img'))e.target.hidden=true;},true);
$('#everyday-video-dialog').addEventListener('close',()=>{$('#everyday-video-content').innerHTML='';$('#everyday-video-dialog')._opener?.focus({preventScroll:true});});
