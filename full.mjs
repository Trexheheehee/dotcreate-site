import {chromium} from '/workspace/dotcreate-test-tools/node_modules/playwright-core/index.mjs';
import {execSync} from 'node:child_process';
const url=process.argv[2]; const out=process.argv[3];
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
for(const [n,w,h] of [['desktop',1440,900],['mobile',390,844]]){
 const m=n==='mobile';
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:m,hasTouch:m});
 await p.goto(url);await p.waitForSelector('.webgl-ready',{state:'attached',timeout:60000});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(2500);
 const H=await p.evaluate(()=>document.documentElement.scrollHeight);
 for(let y=0;y<H;y+=400){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(100);}
 await p.evaluate(()=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));document.querySelectorAll('video[data-src]').forEach(v=>{v.pause();v.removeAttribute('src');v.load();v.dataset.src='';});});
 const files=[];let i=0;
 for(let y=0;y<H;y+=h){
   await p.evaluate(y=>{scrollTo(0,y);},y);await p.waitForTimeout(y===0?2500:900);
   await p.evaluate(y=>{document.querySelector('[data-nav]').style.visibility=y===0?'visible':'hidden'},y);
   const real=await p.evaluate(()=>scrollY);const f=`/tmp/seg-${n}-${i++}.png`;await p.screenshot({path:f});files.push([f,real]);
 }
 const py=`
from PIL import Image
segs=${JSON.stringify(files)}
W,H=${w},${H}
img=Image.new('RGB',(W,H))
for f,y in segs: img.paste(Image.open(f).convert('RGB'),(0,int(y)))
img.save('${out}-${n}-full.png')
`;
 execSync(`python3 -c "${py.replace(/"/g,'\\"')}"`);
 console.log(n,H);await p.close();
}
await b.close();
