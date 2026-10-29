import {watch} from "node:fs";
import {build,root} from "./build.ts";
import {resolve} from "node:path";
let html=await build();
const server=Bun.serve({hostname:"127.0.0.1",port:Number(process.env.PORT??4173),fetch(req){
  if(new URL(req.url).pathname!=="/")return new Response("Not found",{status:404});
  return new Response(html,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"}});
}});
console.log(`Local development server: ${server.url}. Refresh after edits. Ctrl+C stops it.`);
let timer:ReturnType<typeof setTimeout>;
let chain=Promise.resolve();
const watchers=["src","public"].map(folder=>watch(resolve(root,folder),{recursive:true},()=>{
  clearTimeout(timer);timer=setTimeout(()=>{chain=chain.then(async()=>{try{html=await build();console.log("Updated. Refresh the presentation.")}catch(e){console.error(e)}})},120);
}));
process.on("SIGINT",()=>{watchers.forEach(w=>w.close());server.stop();process.exit(0)});
