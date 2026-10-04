// Reproducible photo-and-Chinese-text educational clips. No voice or simulated actions.
// Usage: node generate.cjs [output-directory]; needs playwright, Chromium, FFmpeg.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const root = path.resolve(__dirname,'..');
const os = require('os');
const work = fs.mkdtempSync(path.join(os.tmpdir(),'little-days-clips-'));
const out = path.resolve(process.argv[2] || path.join(root,'dist/media/clips'));
const source = JSON.parse(fs.readFileSync(path.join(root, 'src/video-catalog.json')));
const escape = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const seconds = 7;
const titles = {latch:'正确含接',bottle:'回应式瓶喂',burping:'轻柔拍嗝',diaper:'换尿布'};
const safe = {latch:'持续疼痛或含接困难，请寻求专业协助。',bottle:'全程抱稳；留意宝宝需要暂停的信号。',burping:'托稳头颈，避开喉部；不要用力拍打。',diaper:'手边备齐用品，全程看护宝宝。'};
const icon = '<svg width="300" height="260" viewBox="0 0 300 260" aria-label="原创尿布图标"><rect x="30" y="48" width="240" height="80" rx="22" fill="#E7EBDD" stroke="#315746" stroke-width="7"/><path d="M42 104Q50 202 116 223H184Q250 202 258 104Z" fill="#FFFDF5" stroke="#315746" stroke-width="7"/><path d="M45 130Q107 123 118 220M255 130Q193 123 182 220" fill="none" stroke="#ADC4AA" stroke-width="7"/><rect x="15" y="63" width="64" height="42" rx="12" fill="#F0D49C" stroke="#315746" stroke-width="6"/><rect x="221" y="63" width="64" height="42" rx="12" fill="#F0D49C" stroke="#315746" stroke-width="6"/><circle cx="150" cy="146" r="19" fill="#E0B996"/></svg>';
const css = `*{box-sizing:border-box}html,body{margin:0;width:720px;height:960px;overflow:hidden}body{font-family:"Noto Sans CJK SC",sans-serif;background:#F5F1E8;color:#233C32}.frame{padding:30px 36px;height:960px;display:flex;flex-direction:column}.kicker{font-size:36px;font-weight:700;color:#486454;white-space:nowrap}.title{font-size:48px;font-weight:800;letter-spacing:2px;margin:8px 0 18px;line-height:1.3}.visual{height:314px;flex-shrink:0;background:#fff;border-radius:22px;display:flex;align-items:center;justify-content:center;overflow:hidden}.visual img{width:100%;height:100%;object-fit:contain}.graphic{background:#E7EBDD}.step{margin-top:20px;display:flex;align-items:center;gap:14px;font-size:36px;color:#486454;font-weight:700}.num{width:54px;height:54px;border-radius:50%;background:#315746;color:#FFF;display:flex;align-items:center;justify-content:center}.instruction{font-size:40px;font-weight:700;line-height:1.5;margin:12px 0 0;min-height:180px}.credit{margin-top:auto;border-top:2px solid #CDD3C6;padding-top:14px;font-size:36px;line-height:1.45;color:#486454}.end{background:#315746;color:#FFFDF5}.end .kicker,.end .credit{color:#E0E9D8}.end .title{margin:30px 0}.safety{font-size:44px;font-weight:700;line-height:1.55;margin:30px 0}.ending{font-size:36px;line-height:1.6}.end .credit{margin-top:auto}.progress{position:absolute;bottom:0;left:0;height:10px;background:#A8BF9B}.note{font-size:36px;margin:8px 0 0}`;
function time(n){return `00:${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}.000`;}
(async()=>{
 fs.mkdirSync(out,{recursive:true});fs.mkdirSync(path.join(work,'frames'),{recursive:true});
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox'],proxy:process.env.HTTP_PROXY?{server:process.env.HTTP_PROXY,bypass:'127.0.0.1,localhost'}:undefined});
 const page = await browser.newPage({viewport:{width:720,height:960},deviceScaleFactor:1});
 const manifest=[];
 for(const entry of source.recommendedVideos.filter(v=>Object.keys(titles).includes(v.id))){
   const frames=[];const subtitles=[];const total=entry.steps.length+1;
   for(let i=0;i<total;i++){
     const end = i===entry.steps.length;
     let photo=entry.id==='latch'?'attachment.png':entry.id==='burping'?'burping.png':i<2?'bottle-hold.png':'bottle.png';
     const visual=entry.id==='diaper'?icon:`<img src="data:image/png;base64,${fs.readFileSync(path.join(root,'dist/media',photo)).toString('base64')}" alt="官方原照片完整呈现">`;
     const photoCredit=entry.id==='diaper'?'文字参考：香港特别行政区政府<br>卫生署家庭健康服务':'图片来源：香港特别行政区政府<br>卫生署家庭健康服务';
     const copy=end?safe[entry.id]:entry.steps[i];
     const body=end?`<div class="frame end"><div class="kicker">本站中文图解 · 无配音</div><div class="title">${titles[entry.id]}｜安全要点</div><div class="safety">${copy}</div><div class="ending">${entry.id==='diaper'?'原创图标＋中文步骤说明':'官方原照片＋中文步骤说明'}<br>本站整理，非连续动作录像。<br>照片及资料限署名非商业使用。</div><div class="credit">${photoCredit}<br>${entry.id==='latch'?'《母乳喂哺》PDF 第59页':entry.id==='diaper'?'参考：官方《替宝宝换尿片》':'《用奶瓶喂哺婴儿》PDF'}<br>www.fhs.gov.hk</div></div>`:`<div class="frame"><div class="kicker">本站中文图解 · 无配音</div><div class="title">${titles[entry.id]}</div><div class="visual ${entry.id==='diaper'?'graphic':''}">${visual}</div><div class="step"><span class="num">${i+1}</span>${entry.id==='diaper'?'步骤图解':'照片＋逐步中文说明'} · ${i+1}/${entry.steps.length}</div><div class="instruction">${escape(copy)}</div><div class="credit">${photoCredit}</div></div>`;
     const html=`<!doctype html><meta charset="utf-8"><style>${css}</style>${body}<div class="progress" style="width:${(i+1)/total*720}px"></div>`;
     await page.setContent(html);await page.evaluate(()=>document.fonts.ready);
     const filename=`${entry.id}-${String(i).padStart(2,'0')}.png`; const full=path.join(work,'frames',filename);
     await page.screenshot({path:full});fs.writeFileSync(path.join(work,'frames',filename.replace('.png','.html')),html);
     const overflow=await page.evaluate(()=>[...document.querySelectorAll('.instruction,.credit,.ending')].map(e=>({class:e.className,bottom:e.getBoundingClientRect().bottom})).filter(e=>e.bottom>954));
     if(overflow.length) throw new Error(`${filename} overflow ${JSON.stringify(overflow)}`);
     frames.push(full);subtitles.push(`${i+1}\n${time(i*seconds)} --> ${time((i+1)*seconds)}\n${end?'安全要点：':''}${copy}\n`);
   }
   fs.copyFileSync(frames[0],path.join(out,`${entry.id}-poster.png`));
   const concat=path.join(work,`${entry.id}.ffconcat`);fs.writeFileSync(concat,frames.map(f=>`file '${f.replace(/'/g,"'\\''")}'\nduration ${seconds}`).join('\n')+`\nfile '${frames.at(-1)}'\n`);
   execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',concat,'-t',String(total*seconds),'-r','24','-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart','-an',path.join(out,`${entry.id}-zh-guide.mp4`)]);
   fs.writeFileSync(path.join(out,`${entry.id}-zh-guide.vtt`),'WEBVTT\n\n'+subtitles.join('\n'));
   const probe=JSON.parse(execFileSync('ffprobe',['-v','quiet','-show_format','-show_streams','-of','json',path.join(out,`${entry.id}-zh-guide.mp4`)]));
   fs.writeFileSync(path.join(work,`${entry.id}-ffprobe.json`),JSON.stringify(probe,null,2));
   manifest.push({id:entry.id,title:titles[entry.id],label:'本站中文图解 · 无配音',type:entry.id==='diaper'?'原创图标＋逐步中文说明':'官方照片＋逐步中文说明',video:`${entry.id}-zh-guide.mp4`,poster:`${entry.id}-poster.png`,captions:`${entry.id}-zh-guide.vtt`,width:720,height:960,fps:24,durationSeconds:total*seconds,stepSeconds:seconds,bytes:fs.statSync(path.join(out,`${entry.id}-zh-guide.mp4`)).size,hasAudio:false,hasBurnedInChinese:true,sourceUrl:entry.sourceUrl,rightsUrl:entry.rightsUrl,attribution:'香港特别行政区政府卫生署家庭健康服务',photosFullFrame:true,notice:'本站整理，不是连续真人动作录像；来源机构并非本片制作者。'});
   console.log(entry.id,manifest.at(-1).bytes,'bytes',total*seconds,'seconds');
 }
 await browser.close();fs.writeFileSync(path.join(root,'src/clip-catalog.json'),JSON.stringify({created:'2026-10-04',clips:manifest},null,2));
 fs.rmSync(work,{recursive:true,force:true});
})();
