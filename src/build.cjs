const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const legacy=JSON.parse(fs.readFileSync(path.join(__dirname,'legacy-care.json'),'utf8'));
const meta=JSON.parse(fs.readFileSync(path.join(__dirname,'asset-credits.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(__dirname,'video-catalog.json'),'utf8'));
const assetMap={bottleHold:['bottle-hold','bottle-hold.png',804,449],attachment:['breastfeeding-attachment','attachment.png',580,368],bottle:['bottle-feeding','bottle.png',498,332],burping:['supported-burping','burping.png',440,294]};const assets={};
for(const [id,[name,file,width,height]] of Object.entries(assetMap)){const a=meta.assets.find(a=>a.name===name);assets[id]={title:name,data:'data:image/png;base64,'+fs.readFileSync(path.join(root,'dist/media',file)).toString('base64'),width,height,alt:a.alt_zh,caption:a.caption_zh,source:a.original_asset_url};}
const videos={};for(const v of catalog.recommendedVideos){if(!v.embedUrl)continue;videos[v.id]={id:v.id,title:v.title,provider:v.provider,sourceUrl:v.sourceUrl,embedUrl:v.embedUrl,language:'中文官方版',durationSeconds:v.durationSeconds,steps:v.steps,image:{latch:'attachment',bottle:'bottle',burping:'burping'}[v.id]||null};}
videos.latch.backupUrl='https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/breastfeeding/positioning-and-attachment/#6372883341112';videos.diaper.backupUrl='https://www.nhs.uk/baby/caring-for-a-newborn/how-to-change-your-babys-nappy/#6372884574112';
let html=fs.readFileSync(path.join(__dirname,'template.html'),'utf8');let med=fs.readFileSync(path.join(__dirname,'medical.html'),'utf8').replace(/^<section[^>]*>/,'').replace(/<\/section>$/,'');
const content=fs.readFileSync(path.join(__dirname,'content.js'),'utf8');const app=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
html=html.replace('/*STYLES*/',fs.readFileSync(path.join(__dirname,'style.css'),'utf8')).replace('/*MEDICAL*/',med).replace('/*DATA*/',`const LEGACY=${JSON.stringify(legacy)};\nconst ASSETS=${JSON.stringify(assets)};\nconst VIDEOS=${JSON.stringify(videos)};\n${content}`).replace('/*APP*/',()=>app);
fs.writeFileSync(path.join(root,'dist/index.html'),html);console.log(`Built ${html.length} characters, ${Object.keys(assets).length} professional photos, ${Object.keys(videos).length} official video players.`);
