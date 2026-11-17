import {chromium} from '/workspace/dotcreate-test-tools/node_modules/playwright-core/index.mjs';
const url=process.argv[2]||'http://127.0.0.1:4194/'; const out=process.argv[3]||'/tmp/v4';
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--autoplay-policy=no-user-gesture-required']});
for(const [n,w,h] of [['desktop',1440,900],['mobile',390,844]]){
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1,hasTouch:n==='mobile',isMobile:n==='mobile'});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text())});p.on('response',r=>{if(r.status()>=400)errs.push(r.status()+' '+r.url())});
 await p.goto(url);await p.waitForSelector('.webgl-ready',{state:'attached',timeout:60000}).catch(()=>errs.push('no webgl'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(2500);
 await p.screenshot({path:`${out}-${n}.png`});
 const H=await p.evaluate(()=>document.documentElement.scrollHeight);
 for(let y=0;y<H;y+=500){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(120);}
 await p.waitForTimeout(800);await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(1500);
 await p.addStyleTag({content:n==='mobile'?'.hero{min-height:1034px!important}.hero-stage{height:844px!important}.hero-fade{inset:354px 0 0!important}':'.hero{min-height:900px!important}'});await p.waitForTimeout(1200);
 await p.evaluate(()=>{document.querySelector('[data-nav]').classList.remove('hide');document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))});
 await p.screenshot({path:`${out}-${n}-full.png`,fullPage:true});
 const ov=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:innerWidth,H:document.documentElement.scrollHeight}));
 console.log(n,JSON.stringify(ov),errs.join(' | '));await p.close();
}
await b.close();
