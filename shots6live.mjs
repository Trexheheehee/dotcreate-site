import {chromium} from '/workspace/dotcreate-test-tools/node_modules/playwright-core/index.mjs';
const out=process.argv[2]||'/workspace/v6'; const which=(process.argv[3]||'desktop,close,mobile').split(',');
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const cfg={desktop:[1440,900,false],close:[1440,900,false],mobile:[390,844,true],laptop:[1280,720,false],wide:[1920,1080,false],out:[1440,900,false],reduced:[1440,900,false]};
for(const n of which){
 const [w,h,m]=cfg[n];
 const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:m||n==='close'?2:1,isMobile:m,hasTouch:m,reducedMotion:n==='reduced'?'reduce':'no-preference'});
 const p=await ctx.newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',x=>{if(x.type()==='error')errs.push(x.text())});
 await p.goto('https://dotcreate-bt6gp6htv-pranavs-projects-a187e362.vercel.app/');
 await p.waitForTimeout(2600);
 if(n==='out'){await p.mouse.wheel(0,500);await p.waitForTimeout(1500);}
 if(n==='close'){const el=await p.$('[data-icon]');await el.screenshot({path:`${out}-${n}.png`});}
 else await p.screenshot({path:`${out}-${n}.png`});
 console.log(n,errs.slice(0,5).join(' | '));await ctx.close();
}
await b.close();
