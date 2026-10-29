import {mkdir,readFile,writeFile,stat} from "node:fs/promises";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {validateProject} from "../src/project.ts";
export const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
export async function build(destination=resolve(root,"dist")){
  const project=validateProject(JSON.parse(await readFile(resolve(root,"src/project.json"),"utf8")));
  const images:Record<string,string>={};
  for(const image of project.images){
    const file=resolve(root,"public",image.src);const info=await stat(file);
    if(info.size>8*1024*1024)throw Error(`Image exceeds 8 MB: ${image.src}`);
    const bytes=await readFile(file);const ext=file.split('.').pop()!.toLowerCase();
    const mime=ext==="jpg"||ext==="jpeg"?"image/jpeg":`image/${ext}`;
    images[image.src]=`data:${mime};base64,${bytes.toString("base64")}`;
  }
  const result=await Bun.build({entrypoints:[resolve(root,"src/main.ts")],target:"browser",minify:true,
    define:{__PROJECT_IMAGES__:JSON.stringify(images)},
    plugins:[{name:"hairline-module",setup(builder){builder.onLoad({filter:/hairline-kernel\.js$/},async a=>({contents:(await readFile(a.path,"utf8"))+"\nexport default HL;",loader:"js"}))}}]
  });
  if(!result.success)throw new AggregateError(result.logs,"Browser build failed");
  const code=(await result.outputs[0]!.text()).replace(/<\/script/gi,"<\\/script");
  const css=await readFile(resolve(root,"src/style.css"),"utf8");
  const template=await readFile(resolve(root,"src/index.html"),"utf8");
  const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
  const notices=await readFile(resolve(root,"src/vendor/HAIRLINE-LICENSE"),"utf8");
  const html=template.replace("<!--TITLE-->",escape(project.name)+" | Architecture Explainer").replace("/*STYLES*/",css).replace("/*APP*/",code).replace("<!--NOTICES-->",`<script type="text/plain" id="presentation-licenses">Hairline by Lucas Marques. Original MIT notice:\n${notices}\n</script>`);
  await mkdir(destination,{recursive:true});await writeFile(resolve(destination,"index.html"),html);
  console.log(`Built ${resolve(destination,"index.html")} (${Math.round(Buffer.byteLength(html)/1024)} KB; self-contained)`);
  return html;
}
if(import.meta.main)await build();
