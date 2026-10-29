import {cp,mkdir,readFile,writeFile,lstat,rm} from "node:fs/promises";
import {resolve,relative,basename,isAbsolute} from "node:path";
import {root} from "./build.ts";
import {validateProject} from "../src/project.ts";
const entries=["src","scripts","docs","public","tests",".github","package.json","bun.lock","tsconfig.json",".gitignore","AGENTS.md","README.md","PROJECT_BRIEF.md","LICENSE","THIRD_PARTY_NOTICES.md"];
export async function createProject(destination:string,name:string,firm:string){
  if(!name.trim()||!firm.trim())throw Error("Provide a project name and firm");
  const target=resolve(destination),within=relative(root,target);
  if(target===root||(!isAbsolute(within)&&within!==".."&&!within.startsWith("../")))throw Error("Choose a folder outside the starter");
  try{await lstat(target);throw Error(`Destination already exists: ${target}`)}catch(e){if((e as NodeJS.ErrnoException).code!=="ENOENT")throw e}
  await mkdir(target,{recursive:true});
  try{
    for(const entry of entries)await cp(resolve(root,entry),resolve(target,entry),{recursive:true,errorOnExist:true,force:false});
    const p=validateProject(JSON.parse(await readFile(resolve(target,"src/project.json"),"utf8")));
    p.name=name.trim();p.firm=firm.trim();p.context="Project draft · confirm diagrams before presenting";
    await writeFile(resolve(target,"src/project.json"),JSON.stringify(p,null,2)+"\n");
    const pkg=JSON.parse(await readFile(resolve(target,"package.json"),"utf8"));
    pkg.name=basename(target).toLowerCase().replace(/[^a-z0-9-]/g,"-")||"architecture-presentation";
    await writeFile(resolve(target,"package.json"),JSON.stringify(pkg,null,2)+"\n");
    // Lockfile package name is metadata; bun install updates it without changing versions.
    console.log(`Created ${target}. No Git history, remote, node_modules, or client-source copied.`);
    return target;
  }catch(e){await rm(target,{recursive:true,force:true});throw e}
}
if(import.meta.main){
  const args=Bun.argv.slice(2).filter(a=>a!=="--"),get=(flag:string)=>{const i=args.indexOf(flag);return i<0?undefined:args[i+1]};
  if(args.includes("--help")){console.log('bun run create-project --directory ../client-project --name "Courtyard House" --firm "Your Studio"');process.exit(0)}
  const destination=get("--directory"),name=get("--name"),firm=get("--firm");
  if(!destination||!name||!firm)throw Error("Required: --directory <new folder> --name <project> --firm <studio>. Use --help.");
  await createProject(destination,name,firm);
}
