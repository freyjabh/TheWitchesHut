const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json; charset=utf-8'};
http.createServer((req,res)=>{
  let target;
  try{target=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}
  catch{res.writeHead(400);res.end('Invalid URL');return;}
  if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  if(target===root)target=path.join(root,'index.html');
  fs.readFile(target,(error,data)=>{
    if(error){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(target).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(data);
  });
}).listen(Number(process.env.HUT_PREVIEW_PORT)||5174,'127.0.0.1',()=>console.log('The Witches Hut preview port: '+(process.env.HUT_PREVIEW_PORT||5174)));
