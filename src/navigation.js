function moveToElement(el){
 if(!el)return;
 for(let d=el.closest('details');d;d=d.parentElement?.closest('details'))d.open=true;
 el.setAttribute('tabindex','-1');
 el.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 el.focus({preventScroll:true});
}
function jumpTo(id){
 const el=document.getElementById(id);if(!el)return;
 if(id==='medical')el.querySelectorAll('details').forEach(d=>d.open=true);
 if(id==='sources')el.open=true;
 try{history.replaceState(null,'',`#age=${state.age}&topic=${state.topic}&method=${state.method}&target=${encodeURIComponent(id)}`)}catch(_){ }
 requestAnimationFrame(()=>moveToElement(el));
}
function goCareTarget(part,id){update(part);requestAnimationFrame(()=>jumpTo(id||'main'));}
function showQuickNav(){
 $('#nav-age').innerHTML=AGES.map(a=>`<option value="${a.id}" ${a.id===state.age?'selected':''}>${esc(a.label)}</option>`).join('');
 $('#nav-topics').innerHTML=TOPICS.map(t=>`<button class="play-button secondary" data-nav-topic="${t.id}">${esc(t.id==='feeding'&&['older','toddler'].includes(state.age)?'吃饭与喂养':t.label)}</button>`).join('');
 $('#quick-nav').showModal();
}
function showSaveMenu(){
 const t=TOPICS.find(t=>t.id===state.topic);
 $('#print-current-description').textContent=`${age().label} · ${t.label}，附就医提示和资料来源。`;
 $('#save-dialog').showModal();
}
$('#open-quick-nav').addEventListener('click',showQuickNav);
$('#nav-topics').addEventListener('click',e=>{const b=e.target.closest('[data-nav-topic]');if(!b)return;const next={age:$('#nav-age').value,topic:b.dataset.navTopic};$('#quick-nav').close();goCareTarget(next,'main');});
$('#nav-age').addEventListener('change',()=>{const feedingButton=$('#nav-topics [data-nav-topic="feeding"]');feedingButton.textContent=['older','toddler'].includes($('#nav-age').value)?'吃饭与喂养':'喂奶与奶量';});
$('#back-top').addEventListener('click',()=>jumpTo('page-top'));
$('#save-menu').addEventListener('click',showSaveMenu);
$('#open-save').addEventListener('click',showSaveMenu);
$('#print-current').addEventListener('click',()=>{$('#save-dialog').close();window.print();});
$('#offline').addEventListener('click',()=>$('#save-dialog').close());
document.addEventListener('click',e=>{
 const close=e.target.closest('[data-close-dialog]');if(close){document.getElementById(close.dataset.closeDialog)?.close();return;}
 const route=e.target.closest('[data-go-topic]');if(route){goCareTarget({topic:route.dataset.goTopic},route.dataset.goTarget);return;}
 const jump=e.target.closest('[data-jump]');if(jump){jumpTo(jump.dataset.jump);return;}
 const anchor=e.target.closest('a[href^="#"]');if(anchor){const id=anchor.getAttribute('href').slice(1);if(document.getElementById(id)){e.preventDefault();jumpTo(id);}else if(!id){e.preventDefault();jumpTo('chooser');}}
});
if(query.get('target'))requestAnimationFrame(()=>jumpTo(query.get('target')));
