import {chromium} from '/workspace/dotcreate-test-tools/node_modules/playwright-core/index.mjs';
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
for(const [n,w,h,m] of [['hero-poster',1440,900,false],['hero-poster-m',390,844,true]]){
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:m?2:1.5,isMobile:m,hasTouch:m});
 await p.goto('http://127.0.0.1:4194/');await p.waitForSelector('.webgl-ready',{state:'attached',timeout:60000});await p.waitForTimeout(3000);
 await p.addStyleTag({content:'body>*:not(main),.hero>*:not(.hero-stage),main>*:not(.hero){visibility:hidden!important}.hero::before{display:none}html,body{background:#0A0A0A!important}'});
 await p.waitForTimeout(300);
 await p.locator('.hero-stage').screenshot({path:`/tmp/${n}.png`});await p.close();
}
await b.close();
