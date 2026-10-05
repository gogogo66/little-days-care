const {chromium}=require('playwright');const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'little-days-test-'));
const offlineFile=path.join(temporary,'offline.html');
const server=http.createServer((req,res)=>{const route=new URL(req.url,'http://localhost').pathname;const file=route==='/offline.html'?offlineFile:path.join(root,'dist',route==='/'?'index.html':route);if(file!==offlineFile&&!file.startsWith(path.join(root,'dist')+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.mp4')?'video/mp4':file.endsWith('.vtt')?'text/vtt':'application/octet-stream');res.end(data);});});
let browser;
async function cleanup(){await browser?.close();await new Promise(resolve=>server.close(resolve));fs.rmSync(temporary,{recursive:true,force:true});}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/');
 async function search(q){if(!await page.locator('#search-dialog').isVisible())await page.locator('#open-search').click();await page.locator('#search-query').fill(q);await page.locator('#dialog-search button[type=submit]').click();}
 const expectations=[['几天不拉','几天不拉'],['母乳加奶粉','母乳＋配方奶'],['挤出来的母乳喝多少','母乳瓶喂'],['4个月每顿喝多少','这个年龄的全配方奶参考'],['吐绿色的奶','绿色或黄绿色呕吐'],['叫不醒','难以唤醒'],['发烧38度','38'],['12小时没尿','12小时'],['红屁股','清洁']];
 for(const [q,want] of expectations){await search(q);const first=await page.locator('.search-result').first().innerText();assert.ok(first.replace(/\s/g,'').includes(want),q+' → '+first);console.log(q+' → '+first.replace(/\n/g,' ').slice(0,180));}
 await search('4个月每顿喝多少');assert.equal(await page.locator('#search-age').inputValue(),'middle');assert.ok((await page.locator('.search-result').first().innerText()).includes('4–5个月不套6个月参考'));
 await page.locator('.search-result').first().click();assert.ok(page.url().includes('age=middle'));assert.equal(await page.locator('[data-method=formula]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.search-hit').count(),1);
 await search('混合喂养');await page.locator('.search-result').first().click();assert.equal(await page.locator('[data-method=mixed]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#lesson-breast').count(),1);assert.equal(await page.locator('#lesson-bottle').count(),1);
 await search('几天不拉');await page.locator('.search-result').first().click();assert.equal(await page.locator('.faq details[open]').count(),1);assert.ok((await page.locator('.faq details[open]').innerText()).includes('最初约6周'));
 await page.locator('#open-quick-nav').click();await page.locator('#nav-age').selectOption('toddler');await page.locator('[data-nav-topic=diaper]').click();
 for(const q of ['3天不拉','三天没拉','两天没便便']){await search(q);assert.equal(await page.locator('#search-age').inputValue(),'toddler');assert.ok((await page.locator('.search-result').first().innerText()).includes('排便少，不自动等于便秘'));}
 for(const q of ['吐血','喷射性呕吐','宝宝嘴唇发紫','宝宝喘不过气','12小时没尿']){await search(q);assert.ok(await page.locator('.search-result').first().evaluate(el=>el.classList.contains('medical-result')),q);}
 await search('出生3天尿少');assert.equal(await page.locator('#search-age').inputValue(),'week');
 await search('xyzzy完全没这个词');assert.equal(await page.locator('.search-result').count(),0);
 await search('<img src=x onerror=alert(1)>');assert.equal(await page.locator('#search-results img').count(),0);
 await page.keyboard.press('Escape');await page.locator('#open-quick-nav').click();await page.locator('#nav-age').selectOption('month');await page.locator('[data-nav-topic=feeding]').click();assert.ok(page.url().includes('age=month'));
 await page.locator('[data-method=mixed]').click();await page.locator('#font-toggle').click();await page.locator('[data-video=latch]').click();assert.equal(await page.locator('#video-steps').isVisible(),true);assert.equal(await page.locator('#video-playback').isVisible(),false);assert.equal(await page.locator('#care-player video').count(),0);await page.locator('#show-video-player').click();assert.equal(await page.locator('#care-player video').count(),1);await page.locator('#show-video-steps').click();assert.equal(await page.locator('#care-player video').count(),0);await page.keyboard.press('Escape');
 for(const width of [320,390,768]){await page.setViewportSize({width,height:844});for(const id of ['open-search','open-quick-nav','open-save']){await page.locator('#'+id).click();assert.ok(await page.locator('dialog[open]').evaluate(el=>el.scrollWidth<=el.clientWidth),width+'/'+id+' dialog overflow');await page.keyboard.press('Escape');}assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+' page overflow');}
 const download=page.waitForEvent('download');await page.locator('#open-save').click();await page.locator('#offline').click();await(await download).saveAs(offlineFile);await page.goto(base+'/offline.html');await page.context().setOffline(true);await search('几天不拉');assert.ok(await page.locator('.search-result').count()>0);await page.locator('.search-result').first().click();assert.equal(await page.locator('.faq details[open]').count(),1);await page.context().setOffline(false);
 assert.deepEqual(errors,[]);await cleanup();console.log('PASS: search ranking, age detection, method switching, FAQ opening, urgent results, unknown/XSS input, quick navigation, text-first video, 320/390/768px dialogs, offline search.');
})().catch(async e=>{console.error(e);await cleanup();process.exitCode=1;});
