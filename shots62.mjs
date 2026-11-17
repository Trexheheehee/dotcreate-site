import {chromium} from '/workspace/dotcreate-test-tools/node_modules/playwright-core/index.mjs';
const base=process.argv[2]||'http://127.0.0.1:4195/'; const pre=process.argv[3]||'/workspace/v61';
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const errs=[];
async function page(w,h,m){const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:m?2:1,isMobile:m,hasTouch:m,reducedMotion:'reduce'});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto(base);await p.waitForTimeout(1500);return p;}
// desktop full hero incl stats
let p=await page(1440,900,false);
await p.screenshot({path:`${pre}-desktop.png`});
await (await p.$('[data-stats]')).screenshot({path:`${pre}-stats.png`});
// cards: row with blueprint, and ledger
const rc=await p.$('.row-c2'); await rc.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
await rc.screenshot({path:`${pre}-cards.png`}); const rd=await p.$('.row-d'); await rd.scrollIntoViewIfNeeded(); await p.waitForTimeout(800); await rd.screenshot({path:`${pre}-cards2.png`});
const lg=await p.$('#numbers'); await lg.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
await lg.screenshot({path:`${pre}-ledger.png`});
// mobile
p=await page(390,844,true);
await (await p.$('[data-stats]')).scrollIntoViewIfNeeded();await p.waitForTimeout(500);
await p.screenshot({path:`${pre}-mobile.png`,fullPage:true});
await (await p.$('[data-stats]')).screenshot({path:`${pre}-mobile-stats.png`});
const bp=await p.$('[data-film="blueprint"]'); await bp.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
await (await p.$('.row-c2')).screenshot({path:`${pre}-mobile-cards.png`});
const l2=await p.$('#numbers'); await l2.scrollIntoViewIfNeeded(); await p.waitForTimeout(600); await l2.screenshot({path:`${pre}-mobile-ledger.png`});
console.log('errors:',errs.join('|')||'none'); await b.close();
