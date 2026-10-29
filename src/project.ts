export type SceneKind = "ventilation" | "shade" | "layers" | "options";
export type Model = {width:number; depth:number; floorHeight:number; storeys:number; courtyardWidth:number; courtyardDepth:number};
export type Scene = {kind:SceneKind; title:string; question:string; intro:string; states:{label:string; caption:string; note:string}[]; sources:string[]};
export type Project = {name:string; firm:string; context:string; headline:string; status:"illustrative"; model:Model; images:{src:string; alt:string; caption:string}[]; scenes:Scene[]};
const counts:Record<SceneKind,number>={ventilation:3,shade:3,layers:3,options:2};
const text=(v:unknown,key:string)=>{if(typeof v!=="string"||!v.trim()||v.length>1600)throw Error(`Expected nonempty text for ${key}`)};
export function validateProject(input:unknown):Project {
  if(!input||typeof input!=="object")throw Error("Project must be an object");
  const p=input as Project;
  for(const key of ["name","firm","context","headline"] as const)text(p[key],key);
  if(p.status!=="illustrative")throw Error('Keep status "illustrative"; this starter does not run performance simulations.');
  if(!p.model||typeof p.model!=="object")throw Error("Missing building model");
  for(const key of ["width","depth","floorHeight","storeys","courtyardWidth","courtyardDepth"] as const){
    const n=p.model[key];if(!Number.isFinite(n)||n<=0||n>60)throw Error(`Invalid model.${key}`);
  }
  if(!Number.isInteger(p.model.storeys)||p.model.storeys>5)throw Error("Use 1 to 5 storeys");
  if(p.model.width<6||p.model.width>40||p.model.depth<6||p.model.depth>40||p.model.floorHeight<2.4||p.model.floorHeight>5)throw Error("Use a building 6–40 m wide/deep and storeys 2.4–5 m high; extend the renderer for other scales");
  if(p.model.courtyardWidth>=p.model.width*.8||p.model.courtyardDepth>=p.model.depth*.8)throw Error("Courtyard must leave space for the surrounding building");
  if(!Array.isArray(p.scenes)||p.scenes.length<1||p.scenes.length>8)throw Error("Provide 1 to 8 scenes");
  const seen=new Set<string>();
  p.scenes.forEach(s=>{
    if(!(s.kind in counts))throw Error(`Unsupported scene: ${s.kind}`);
    if(seen.has(s.kind))throw Error(`Duplicate scene: ${s.kind}`);seen.add(s.kind);
    for(const k of ["title","question","intro"] as const)text(s[k],`scene.${k}`);
    if(!Array.isArray(s.states)||s.states.length!==counts[s.kind])throw Error(`Expected ${counts[s.kind]} states for ${s.kind}`);
    s.states.forEach(v=>{for(const k of ["label","caption","note"] as const)text(v[k],`state.${k}`)});
    if(!Array.isArray(s.sources)||s.sources.some(v=>typeof v!=="string"||!/^https:\/\//.test(v)))throw Error("Sources must be HTTPS links");
  });
  if(!Array.isArray(p.images)||p.images.length>8)throw Error("Use up to 8 project images");
  p.images.forEach(i=>{text(i.alt,"image.alt");text(i.caption,"image.caption");if(typeof i.src!=="string"||!/^project-assets\/[a-zA-Z0-9_./-]+\.(png|jpe?g|webp)$/i.test(i.src)||i.src.includes(".."))throw Error("Use a local PNG, JPEG or WebP under public/project-assets/")});
  return p;
}
