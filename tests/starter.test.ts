import {describe,test,expect} from "bun:test";
import {mkdtemp,rm,readFile,writeFile,lstat} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {createHash} from "node:crypto";
import original from "./fixtures/project.json";
import current from "../src/project.json";
import {validateProject} from "../src/project.ts";
import {build,root} from "../scripts/build.ts";
import {createProject} from "../scripts/create-project.ts";

describe("presentation configuration",()=>{
  test("the current project's content validates after customisation",()=>{expect(validateProject(current).name).toBe(current.name)});
  test("ships the four usable scene types",()=>{expect(validateProject(original).scenes.map(s=>s.kind)).toEqual(["ventilation","shade","layers","options"])});
  test("rejects missing behavioural states and invalid model geometry",()=>{
    const p=structuredClone(original);p.scenes[0]!.states.pop();expect(()=>validateProject(p)).toThrow("states");
    const q=structuredClone(original);q.model.courtyardWidth=q.model.width;expect(()=>validateProject(q)).toThrow("Courtyard");
    q.model.courtyardWidth=2;q.model.storeys=1.5;expect(()=>validateProject(q)).toThrow("storeys");
  });
  test("accepts local presentation photos and rejects remote or escaping paths",()=>{
    const p=structuredClone(original) as unknown as ReturnType<typeof validateProject>;
    p.images=[{src:"project-assets/courtyard.webp",alt:"Courtyard view",caption:"Proposed courtyard"}];expect(validateProject(p).images).toHaveLength(1);
    for(const src of ["https://example.com/x.png","project-assets/../private.png","project-assets/x.svg"]){p.images[0]!.src=src;expect(()=>validateProject(p)).toThrow("local")}
  });
  test("prevents accidentally relabelling the starter as a performance simulation",()=>{const p={...original,status:"simulated"};expect(()=>validateProject(p)).toThrow("illustrative")});
});

test("Hairline source stays byte-identical to the pinned upstream kernel",async()=>{
  const provenance=JSON.parse(await readFile(join(root,"src/vendor/provenance.json"),"utf8"));
  const bytes=await readFile(join(root,"src/vendor/hairline-kernel.js"));
  expect(createHash("sha256").update(bytes).digest("hex")).toBe(provenance.sha256);
  expect(provenance.commit).toBe("37d2e78dcb333ab30c3338e28ed4a690364ea014");
});

test("build produces an offline document including original attribution",async()=>{
  const folder=await mkdtemp(join(tmpdir(),"architecture-build-"));
  try{const html=await build(folder);expect(html).toContain("<!doctype html>");expect(html).toContain(" | Architecture Explainer</title>");expect(html).toContain("MIT License");expect(html).not.toMatch(/<script[^>]+src=|<link[^>]+href=|https:\/\/esm\.sh/);expect(html).not.toContain("/*APP*/");expect(html).not.toContain("/*STYLES*/");expect(await readFile(join(folder,"index.html"),"utf8")).toBe(html)}finally{await rm(folder,{recursive:true,force:true})}
});

describe("separate client project",()=>{
  test("copies a runnable project without inheriting history, dependencies or client data",async()=>{
    const parent=await mkdtemp(join(tmpdir(),"architecture-project-")),target=join(parent,"courtyard-client");
    try{
      await createProject(target,"Client House","Client Studio");
      const p=JSON.parse(await readFile(join(target,"src/project.json"),"utf8"));expect(p.name).toBe("Client House");expect(p.firm).toBe("Client Studio");
      for(const path of [".git","node_modules","dist","client-source"]){await expect(lstat(join(target,path))).rejects.toMatchObject({code:"ENOENT"})}
      expect(await Bun.file(join(target,"AGENTS.md")).exists()).toBe(true);expect(await Bun.file(join(target,"bun.lock")).exists()).toBe(true);
      // A second creation may not replace the first project's work.
      await writeFile(join(target,"keep.txt"),"client work");
      await expect(createProject(target,"Other","Studio")).rejects.toThrow("exists");expect(await readFile(join(target,"keep.txt"),"utf8")).toBe("client work");
    }finally{await rm(parent,{recursive:true,force:true})}
  });
  test("refuses destinations inside the starter, including dot-prefixed folders",async()=>{
    await expect(createProject(root,"A","B")).rejects.toThrow("outside");
    await expect(createProject(join(root,"nested-client"),"A","B")).rejects.toThrow("outside");
    await expect(createProject(join(root,"..hidden-client"),"A","B")).rejects.toThrow("outside");
  });
});
