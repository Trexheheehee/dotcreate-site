import {chromium} from '/workspace/dotcreate-test-tools/node_modules/playwright-core/index.mjs';
const out=process.argv[2]||'/workspace/v5'; const which=(process.argv[3]||'desktop,close,mobile').split(',');
const q=process.argv[4]||'';
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--ignore-gpu-blocklist']});
const cfg={out:[1440,900,false],desktop:[1440,900,false],close:[1440,900,false],mobile:[390,844,true],side:[1440,900,false],chest:[1440,900,false]};
for(const n of which){
 const [w,h,m]=cfg[n];
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:m?2:1,isMobile:m,hasTouch:m});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',x=>{if(x.type()==='error'||x.type()==='warning')errs.push(x.text())});
 await p.goto('http://127.0.0.1:4194/?debug'+q);
 await p.waitForSelector('.webgl-ready',{state:'attached',timeout:120000}).catch(()=>errs.push('no webgl'));
 if(n==='close') await p.evaluate(()=>{window.__rest={y:1.64,dist:0.72,look:1.6};window.__ox=-0.06;window.__rot=-0.05});
 if(n==='side') await p.evaluate(()=>{window.__rest={y:1.63,dist:0.8,look:1.6};window.__ox=0;window.__rot=-1.1});
 if(n==='out') await p.evaluate(()=>{scrollTo(0,700)});
 if(n==='chest') await p.evaluate(()=>{window.__rest={y:1.45,dist:0.95,look:1.4};window.__ox=0;window.__rot=-0.2});
 await p.waitForTimeout(n==='desktop'||n==='mobile'?3500:4500);
 if(n==='close'||n==='side'||n==='chest') await p.addStyleTag({content:'.hero>*:not(.hero-stage),[data-nav]{visibility:hidden!important}'});
 await p.waitForTimeout(300);
 await p.screenshot({path:`${out}-${n}.png`});
 console.log(n,errs.slice(0,5).join(' | '));await p.close();
}
await b.close();
