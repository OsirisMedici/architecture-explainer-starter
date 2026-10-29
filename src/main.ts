import rawProject from "./project.json";
import {validateProject} from "./project.ts";
import {createDiagram} from "./diagram.ts";
import HL from "./vendor/hairline-kernel.js";
declare const __PROJECT_IMAGES__:Record<string,string>;
const project=validateProject(rawProject);
const root=document.getElementById("app")!;
const el=<K extends keyof HTMLElementTagNameMap>(tag:K,cls="",text="")=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e};
const button=(text:string,action:()=>void,cls="")=>{const b=el("button",cls,text);b.type="button";b.addEventListener("click",action);return b};
const header=el("header","app-header"),brand=el("span","brand",project.firm),actions=el("div","header-actions");
const exportButton=button("Export presentation",exportPresentation,"button secondary");
const presentButton=button("Present",togglePresentation,"button primary");presentButton.setAttribute("aria-pressed","false");
actions.append(exportButton,presentButton);header.append(brand,actions);
const layout=el("div","layout"),aside=el("aside","sidebar"),nav=el("nav","topics");nav.setAttribute("aria-label","Presentation topics");
const hairlineLink=el("a","hairline-credit","Built with Hairline");hairlineLink.href="https://github.com/lucasmarkes/hairline";hairlineLink.target="_blank";hairlineLink.rel="noopener noreferrer";
aside.append(nav,hairlineLink);
const main=el("main","main");main.id="main";
const context=el("p","project-context",project.name+" / "+project.context),headline=el("h1","headline",project.headline);
const panel=el("section","scene-panel");panel.setAttribute("aria-labelledby","scene-question");
const question=el("h2","question");question.id="scene-question";
const intro=el("p","intro"),states=el("div","state-controls");states.setAttribute("role","group");states.setAttribute("aria-label","Diagram states");
const stage=el("div","diagram");stage.id="diagram";
const note=el("p","scene-note"),caption=el("p","caption");caption.setAttribute("aria-live","polite");
const sceneFooter=el("footer","scene-footer"),disclaimer=el("span","disclaimer","Illustrative model · not a performance simulation");
const next=button("Next topic",()=>navigate(1),"button primary next-topic");
const nextArrow=document.createElementNS("http://www.w3.org/2000/svg","svg");nextArrow.setAttribute("viewBox","0 0 20 20");nextArrow.setAttribute("aria-hidden","true");const arrow=document.createElementNS(nextArrow.namespaceURI,"path");arrow.setAttribute("d","M3 10h13m-5-5 5 5-5 5");nextArrow.append(arrow);next.append(nextArrow);
sceneFooter.append(disclaimer,next);
const sources=el("details","sources"),sourceSummary=el("summary","","Sources and assumptions"),sourceList=el("div","source-list");sources.append(sourceSummary,sourceList);
panel.append(question,intro,states,stage,note,caption,sceneFooter,sources);
main.append(context,headline,panel);layout.append(aside,main);
const status=el("p","sr-only");status.setAttribute("role","status");
root.append(header,layout,status);
if(project.images.length){
  const gallery=el("section","project-images");gallery.setAttribute("aria-label","Project images");
  for(const image of project.images){const figure=el("figure"),img=el("img");img.src=__PROJECT_IMAGES__[image.src]!;img.alt=image.alt;img.loading="lazy";figure.append(img,el("figcaption","",image.caption));gallery.append(figure)}
  main.append(gallery);
}
let topic=0,state=1,presenting=false,diagram:ReturnType<typeof createDiagram>|undefined;
const media=matchMedia("(prefers-reduced-motion: reduce)");HL.setReducedMotion(media.matches);media.addEventListener("change",e=>HL.setReducedMotion(e.matches));
const buttons=project.scenes.map((scene,i)=>{
  const b=button("",()=>selectTopic(i),"topic");b.dataset.kind=scene.kind;b.append(el("span","topic-number",String(i+1).padStart(2,"0")),el("span","topic-title",scene.title));nav.append(b);return b;
});
function selectTopic(index:number){
  topic=index;const s=project.scenes[topic]!;state=s.kind==="ventilation"?1:0;
  buttons.forEach((b,i)=>{b.setAttribute("aria-current",i===topic?"step":"false")});
  question.textContent=s.question;intro.textContent=s.intro;
  states.replaceChildren(...s.states.map((option,i)=>{const b=button(option.label,()=>selectState(i),"button secondary");b.dataset.state=String(i);return b}));
  diagram?.destroy();diagram=createDiagram(stage,project.model,s.kind);
  sourceList.replaceChildren(el("p","","Geometry is a schematic cutaway. Airflow arrows, sun rays and exploded positions explain an idea; they do not predict project performance. Confirm project-specific claims with the responsible architect."));
  for(const url of s.sources){const a=el("a","",new URL(url).hostname);a.href=url;a.target="_blank";a.rel="noopener noreferrer";sourceList.append(a)}
  next.disabled=project.scenes.length===1;next.firstChild!.textContent=topic===project.scenes.length-1?"First topic":"Next topic";
  selectState(state);
}
function selectState(index:number){
  state=index;const option=project.scenes[topic]!.states[state]!;
  [...states.children].forEach((e,i)=>{e.setAttribute("aria-pressed",String(i===state));e.classList.toggle("is-selected",i===state)});
  note.textContent=option.note;caption.textContent=option.caption;diagram!.setState(state);
  root.dataset.topic=project.scenes[topic]!.kind;root.dataset.state=String(state);
}
function navigate(delta:number){selectTopic((topic+delta+project.scenes.length)%project.scenes.length)}
function togglePresentation(){
  presenting=!presenting;document.body.classList.toggle("presenting",presenting);
  presentButton.textContent=presenting?"Exit presentation":"Present";presentButton.setAttribute("aria-pressed",String(presenting));
  status.textContent=presenting?"Presentation mode. Left and right arrows change topics. Escape exits.":"Presentation mode ended.";
}
document.addEventListener("keydown",e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLSelectElement)return;
  if(e.key==="Escape"&&presenting){togglePresentation();return}
  if(presenting&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){e.preventDefault();navigate(e.key==="ArrowRight"?1:-1)}
});
function exportPresentation(){
  // Export only our application, excluding browser-runner chrome and transient state.
  const copy=document.implementation.createHTMLDocument(document.title);copy.documentElement.lang="en";
  const charset=copy.createElement("meta");charset.setAttribute("charset","UTF-8");copy.head.prepend(charset);
  for(const selector of ['meta[name="viewport"]','meta[name="color-scheme"]','meta[name="referrer"]','#presentation-style','#presentation-licenses']){
    const node=document.querySelector(selector);if(node)copy.head.append(node.cloneNode(true));
  }
  const freshRoot=copy.createElement("div");freshRoot.id="app";copy.body.append(freshRoot);
  const skip=document.querySelector('.skip-link');if(skip)copy.body.prepend(skip.cloneNode(true));
  copy.body.append(document.querySelector('#presentation-app')!.cloneNode(true));
  const source="<!doctype html>\n"+copy.documentElement.outerHTML;
  const url=URL.createObjectURL(new Blob([source],{type:"text/html;charset=utf-8"}));
  const link=el("a");link.href=url;link.download=project.name.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-presentation.html";link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
  status.textContent="Presentation exported. Open the HTML file in a browser; no internet connection is required.";
}
selectTopic(0);
