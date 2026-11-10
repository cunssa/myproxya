const reply = (data, status=200) => new Response(JSON.stringify(data), {
  status, headers: {"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}
});
const CONFIG_KEY = "myproxy_single_config";
const TOKEN_KEY = "myproxy_fixed_token";
function newToken(){const b=crypto.getRandomValues(new Uint8Array(32));return [...b].map(x=>x.toString(16).padStart(2,"0")).join("");}
export async function onRequest({request, env}) {
  if(request.method!=="POST") return reply({error:"Method not allowed"},405);
  if(!env.ADMIN_PASSWORD) return reply({error:"请先设置 ADMIN_PASSWORD 环境变量"},503);
  const supplied=request.headers.get("X-Admin-Key")||"";
  if(supplied!==env.ADMIN_PASSWORD) return reply({error:"管理员密码错误"},401);
  const kv=env.MYPROXY_KV;
  if(!kv) return reply({error:"未绑定 KV。请将 KV 命名空间绑定为 MYPROXY_KV"},503);
  let body; try{body=await request.json()}catch{return reply({error:"无效 JSON"},400)}
  if(body.action==="get"){
    const yaml=await kv.get(CONFIG_KEY)||"";
    let token=await kv.get(TOKEN_KEY);
    if(!token){token=newToken();await kv.put(TOKEN_KEY,token)}
    return reply({yaml,path:"/sub/"+token});
  }
  if(body.action==="save"){
    const yaml=String(body.yaml||"").trim();
    if(!yaml)return reply({error:"YAML 配置不能为空"},400);
    if(yaml.length>200000)return reply({error:"配置不能超过 200 KB"},413);
    await kv.put(CONFIG_KEY,yaml);
    let token=await kv.get(TOKEN_KEY);
    if(!token){token=newToken();await kv.put(TOKEN_KEY,token)}
    return reply({ok:true,path:"/sub/"+token});
  }
  if(body.action==="delete"){await kv.delete(CONFIG_KEY);return reply({ok:true})}
  return reply({error:"未知操作"},400);
}