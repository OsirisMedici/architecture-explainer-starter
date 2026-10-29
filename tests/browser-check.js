// Inject after the built app as a module in a supported HTML browser runner.
// Set the runner's reduced-motion preference to reduce for deterministic settled poses.
// It is not bundled into the presentation. Errors fail the verification run.
const checks=[];
function assert(condition,message){if(!condition)throw Error(message);checks.push(message)}
const app=document.querySelector('#app');
const topics=[...document.querySelectorAll('.topic')];
const modes=topics.map(b=>b.dataset.kind);
assert(topics.length>0,'Configured topics mounted');
for(let i=0;i<topics.length;i++){
  topics[i].click();assert(app.dataset.topic===modes[i],modes[i]+' topic selected');
  const before=document.querySelector('#diagram svg').getAttribute('viewBox');
  const signatures=[];
  for(const [j,b]of [...document.querySelectorAll('.state-controls button')].entries()){
    b.click();assert(app.dataset.state===String(j),modes[i]+' state '+j+' selected');
    assert(b.getAttribute('aria-pressed')==='true','Selected state announced');
    assert(document.querySelector('.caption').textContent.trim().length>20,'Caption updated');
    const paths=[...document.querySelectorAll('#diagram path')].map(p=>p.getAttribute('d')||'');
    assert(paths.length>2&&!paths.some(d=>/NaN|Infinity|undefined/.test(d)),'Finite SVG geometry for '+modes[i]+' '+j);
    assert(document.querySelector('#diagram svg').getAttribute('viewBox')===before,'Stable camera framing');
    signatures.push(paths.join('|'));
  }
  assert(new Set(signatures).size>1,'Diagram changes with '+modes[i]+' state');
}
document.querySelector('.header-actions button:last-child').click();
assert(document.body.classList.contains('presenting'),'Presentation mode starts');
document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
assert(app.dataset.topic===modes[0],'Keyboard advances and wraps topics');
document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
assert(!document.body.classList.contains('presenting'),'Escape exits presentation');
assert(document.documentElement.scrollWidth<=window.innerWidth+1,'No horizontal page overflow');
// Remove this test script before export so the exported document contains only the app.
document.querySelector('script[data-browser-check]')?.remove();
document.querySelector('script[data-browser-setup]')?.remove();
let exported;
const originalObjectURL=URL.createObjectURL;
URL.createObjectURL=blob=>{exported=blob.text();return originalObjectURL(blob)};
const originalAnchorClick=HTMLAnchorElement.prototype.click;
HTMLAnchorElement.prototype.click=function(){if(!this.download)originalAnchorClick.call(this)};
document.querySelector('.header-actions button:first-child').click();
URL.createObjectURL=originalObjectURL;
assert(Boolean(exported),'Export produces a document');
const exportedHtml=await exported;
const exportedDocument=new DOMParser().parseFromString(exportedHtml,'text/html');
assert(exportedDocument.querySelector('#app').children.length===0,'Export clears transient DOM before remount');
assert(!/<script[^>]+src=|<link[^>]+href=/.test(exportedHtml),'Export has no external runtime dependencies');
assert(exportedHtml.includes('MIT License'),'Export retains attribution');
HTMLAnchorElement.prototype.click=originalAnchorClick;
topics[0].click();
console.log('BROWSER_CHECK_PASS '+checks.length+' assertions; export captured for independent reopen.');
// A browser runner can read exportedHtml here to reopen it as an independent document.
