import HL from "./vendor/hairline-kernel.js";
import type {Model,SceneKind} from "./project.ts";
type XYZ=[number,number,number];
type XY=[number,number];
const {Cam,proj,fit,facing,rings,solid,put,prism,mk,open,seg,spring,stepS,register}=HL;

/** Cutaway presentation geometry. The model is illustrative, not a solver. */
export function createDiagram(stage:HTMLElement,model:Model,kind:SceneKind){
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("viewBox","0 0 400 300");svg.setAttribute("role","img");
  const title=mk("title",{},svg);title.textContent="Interactive cutaway of a courtyard building";
  const desc=mk("desc",{},svg);desc.textContent="Use the labelled buttons to explore the building.";
  svg.setAttribute("aria-label","Illustrative courtyard building, "+kind);
  stage.replaceChildren(svg);
  const scene=mk("g",{},svg),flow=mk("g",{},svg),labels=mk("g",{},svg);
  const W=model.width*10,D=model.depth*10,F=model.floorHeight*10,H=F*model.storeys;
  const CW=model.courtyardWidth*10,CD=model.courtyardDepth*10;
  const cam=Cam(45,.35,1);
  const extra=kind==="layers"?model.storeys*F*.65:0;
  const bounds:XYZ[]=[[-W/2-24,-D/2-10,-5],[W/2+24,D/2+10,0],[-W/2,-D/2,H+extra+35],[W/2,D/2,H+extra+35]];
  let projection=proj(cam),xs=bounds.map(p=>projection(...p)[0]),ys=bounds.map(p=>projection(...p)[1]);
  cam.S=Math.min(315/(Math.max(...xs)-Math.min(...xs)),230/(Math.max(...ys)-Math.min(...ys)));
  fit(cam,bounds,200,149);const P=proj(cam),front=facing(cam);
  let state=kind==="ventilation"?1:0;
  const lift=spring(0,{k:130,c:24}),spread=spring(0,{k:130,c:24});
  if(kind==="ventilation")lift.x=lift.t=13;
  function block(x0:number,y0:number,x1:number,y1:number,z0:number,z1:number,cls=""){
    const [ring,inner]=rings(x0,y0,x1,y1,Math.min(1.2,(x1-x0)/4,(y1-y0)/4),Math.min(.35,(x1-x0)/6,(y1-y0)/6));
    const item=solid(scene);put(item,prism(P,front,ring,inner,z0,z1));
    if(cls)item.g.setAttribute("class",cls);return item;
  }
  function line(points:XYZ[],cls="nf") {return mk("path",{d:open(points.map(p=>P(...p))),class:cls},scene)}
  function slab(z:number,voidAtCentre=true){
    if(!voidAtCentre){block(-W/2,-D/2,W/2,D/2,z,z+2);return}
    block(-W/2,-D/2,-CW/2,D/2,z,z+2);block(CW/2,-D/2,W/2,D/2,z,z+2);
    block(-CW/2,-D/2,CW/2,-CD/2,z,z+2);block(-CW/2,CD/2,CW/2,D/2,z,z+2);
  }
  function arrow(points:XYZ[]){
    const q=points.map(p=>P(...p)),a=q.at(-2)!,b=q.at(-1)!,theta=Math.atan2(b[1]-a[1],b[0]-a[0]);
    const head=(d:number):XY=>[b[0]-5*Math.cos(theta+d),b[1]-5*Math.sin(theta+d)];
    mk("path",{d:open(q)+seg(head(-.5),b)+seg(head(.5),b),class:"nf hi"},flow);
  }
  function smallLabel(text:string,x:number,y:number,anchor="start"){
    const el=mk("text",{x,y,"text-anchor":anchor},labels);el.textContent=text;
  }
  function furniture(z:number){
    // Low seating, tables, and stair treads make the rest pose read as a home.
    const left=-W/2+5,right=W/2-5;
    block(left,-D/2+6,left+Math.min(18,(W-CW)/3),-D/2+14,z,z+5,"detail");
    block(left,-D/2+6,left+Math.min(18,(W-CW)/3),-D/2+8,z+5,z+9,"detail");
    block(right-15,D/2-22,right-2,D/2-9,z,z+5,"detail");
    block(left+4,D/2-19,left+16,D/2-9,z,z+3,"detail");
    for(let i=0;i<5;i++)block(CW/2+3,-D/2+5+i*3.5,CW/2+12,-D/2+8+i*3.5,z,z+1+i*1.5,"detail");
  }
  function building(){
    block(-W/2-8,-D/2-8,W/2+8,D/2+8,-4,-2);
    slab(-2,false);
    const courtyard=kind!=="options"||state===1;
    for(let level=0;level<model.storeys;level++){
      const z=level*F+level*spread.x;
      // Rear glazing and thin corner columns. Front faces are cut away.
      for(const x of [-W/2,-CW/2,CW/2,W/2-1.5])block(x,-D/2,x+1.5,-D/2+1.5,z,z+F-1);
      for(const y of [-D/2,D/2-1.5])block(-W/2,y,-W/2+1.5,y+1.5,z,z+F-1);
      line([[-W/2,-D/2,z+F*.45],[W/2,-D/2,z+F*.45]],"nf lo");
      for(let x=-W/2+12;x<W/2;x+=12)line([[x,-D/2,z+2],[x,-D/2,z+F-2]],"nf lo");
      furniture(z+1);
      if(level>0){
        slab(z,courtyard);
        if(courtyard)line([[-CW/2,CD/2,z+2],[-CW/2,CD/2,z+10],[CW/2,CD/2,z+10],[CW/2,CD/2,z+2]]);
      }
      block(W/2-1.5,D/2-1.5,W/2,D/2,z,z+F-1);
    }
    const roofZ=H+model.storeys*spread.x+(kind==="layers"?lift.x:0);
    slab(roofZ,courtyard);
    if(kind==="ventilation"){
      block(-CW/2-1,-CD/2-1,CW/2+1,CD/2+1,roofZ+2+lift.x,roofZ+4+lift.x);
      if(lift.x>.1){
        line([[-CW/2,CD/2,roofZ+2],[-CW/2,CD/2,roofZ+2+lift.x]],"nf lo dash");
        line([[CW/2,CD/2,roofZ+2],[CW/2,CD/2,roofZ+2+lift.x]],"nf lo dash");
      }
    }
    if(kind==="layers"&&(spread.x>.1||lift.x>.1)){
      for(const [x,y]of [[-W/2,D/2],[W/2,D/2]])line([[x!,y!,0],[x!,y!,roofZ]],"nf lo dash");
    }
  }
  function ventilation(){
    if(state===0){smallLabel("Roof vent shut",277,44);return}
    const a:XYZ[]=[[-W/2-23,D*.2,F*.26],[-CW/2-8,D*.2,F*.26],[0,0,F*.4]];
    const b:XYZ[]=[[0,0,F*.4],[0,0,H*.7],[0,0,H+30],[CW/2,0,H+30]];
    arrow(state===1?a:a.slice().reverse());arrow(state===1?b:b.slice().reverse());
    smallLabel(state===1?"Warm air out":"Hot air in",277,32);
    smallLabel(state===1?"Cooler air in":"Cooler air out",25,246);
  }
  function shade(){
    // A separate schematic facade section: geometry is deliberate, not solar analysis.
    scene.replaceChildren();flow.replaceChildren();labels.replaceChildren();
    const wallX=18,wallY=12,top=H*.8,windowTop=top-5,windowBottom=top-24;
    block(-42,-15,42,32,-3,0);block(wallX,-15,wallX+3,32,0,windowBottom);
    block(wallX,-15,wallX+3,wallY-12,windowBottom,top);
    block(wallX,wallY+12,wallX+3,32,windowBottom,top);
    block(wallX,wallY-12,wallX+3,wallY+12,windowTop,top);
    line([[wallX+2,wallY-12,windowBottom],[wallX+2,wallY+12,windowBottom],[wallX+2,wallY+12,windowTop],[wallX+2,wallY-12,windowTop],[wallX+2,wallY-12,windowBottom]]);
    line([[wallX+2,wallY,windowBottom],[wallX+2,wallY,windowTop]],"nf lo");
    const overhangEnd=wallX+20;
    if(state>0)block(wallX-2,wallY-16,overhangEnd,wallY+16,top,top+2);
    const windowZ=top-16,slope=state===2?.2:1.1;
    const start:XYZ=[wallX+54,wallY,windowZ+54*slope];
    const endX=state===1?wallX+(top+2-windowZ)/slope:wallX;
    const end:XYZ=[endX,wallY,windowZ+(endX-wallX)*slope];arrow([start,end]);
    if(state!==1)arrow([[wallX-1,wallY,windowZ],[-15,wallY,windowZ-(wallX+15)*slope]]);
    smallLabel(state===2?"Low-angle sunlight":"High-angle sunlight",232,38);
    smallLabel(state===1?"Ray intercepted":"Ray reaches the window",200,260,"middle");
  }
  let measuring=true,frame:{x:number;y:number;x1:number;y1:number}|undefined;
  function draw(){
    scene.replaceChildren();flow.replaceChildren();labels.replaceChildren();building();
    if(kind==="ventilation")ventilation();if(kind==="shade")shade();
    // Measure every extreme pose once; keep the frame fixed during interaction.
    labels.replaceChildren();
    const a=scene.getBBox(),b=flow.getBBox();
    let x=a.x,y=a.y,x1=a.x+a.width,y1=a.y+a.height;
    if(b.width>0||b.height>0){x=Math.min(x,b.x);y=Math.min(y,b.y);x1=Math.max(x1,b.x+b.width);y1=Math.max(y1,b.y+b.height)}
    if(measuring){frame=frame?{x:Math.min(frame.x,x),y:Math.min(frame.y,y),x1:Math.max(frame.x1,x1),y1:Math.max(frame.y1,y1)}:{x,y,x1,y1}}
  }
  const loop=register(stage,(dt)=>{const a=stepS(lift,dt),b=stepS(spread,dt);draw();return a||b});
  function setState(value:number){
    state=value;lift.t=kind==="ventilation"?(value===0?0:13):kind==="layers"&&value>0?F*.85:0;
    spread.t=kind==="layers"&&value===2?F*.6:0;
    if(HL.reducedMotion()){stepS(lift,0);stepS(spread,0)}
    draw();loop.wake();svg.dataset.state=String(state);
  }
  const initialState=state;
  for(const n of [0,1,2]){state=n;lift.x=kind==="ventilation"?(n===0?0:13):kind==="layers"&&n>0?F*.85:0;spread.x=kind==="layers"&&n===2?F*.6:0;draw()}
  measuring=false;state=initialState;
  lift.x=lift.t=kind==="ventilation"?13:0;spread.x=spread.t=0;
  if(frame)svg.setAttribute("viewBox",`${frame.x-14} ${frame.y-12} ${frame.x1-frame.x+28} ${frame.y1-frame.y+24}`);
  draw();loop.wake();
  return {setState,destroy(){loop.unregister();stage.replaceChildren()}};
}
