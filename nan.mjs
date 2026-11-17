import {chromium} from '/workspace/dotcreate-test-tools/node_modules/playwright-core/index.mjs';
const angle = process.argv[2] || 'swiftshader';
const cases = (process.argv[3] || 'clean:,nosan:&nantest&nosan&noprobe,guard:&nantest&noprobe,fallback:&nantest').split(',');
const b = await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader',`--use-angle=${angle}`,'--ignore-gpu-blocklist']});
for (const c of cases) {
  const [name, q] = c.split(':');
  const p = await b.newPage({viewport:{width:1440,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',x=>{if(x.type()==='error')errs.push(x.text())});
  await p.goto('http://127.0.0.1:4194/?debug'+q);
  await p.waitForSelector('.webgl-ready',{state:'attached',timeout:120000}).catch(()=>errs.push('no webgl'));
  await p.evaluate(()=>{window.__rest={y:1.5,dist:1.3,look:1.45};window.__ox=-0.06;window.__rot=-0.05});
  await p.waitForTimeout(6000);
  const info = await p.evaluate(()=>({gl: (()=>{const g=window.__dc3d.renderer.getContext();const e=g.getExtension('WEBGL_debug_renderer_info');return e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):'?'})(), level: window.__dc3d.safeLevel, post: !!window.__dc3d.post, log: window.__dc3d.safetyLog}));
  await p.addStyleTag({content:'.hero>*:not(.hero-stage),[data-nav]{visibility:hidden!important}'});
  await p.waitForTimeout(300);
  await p.screenshot({path:`/workspace/v5fix-${angle}-${name}.png`});
  console.log(name, JSON.stringify(info), errs.slice(0,3).join(' | '));
  await p.close();
}
await b.close();
