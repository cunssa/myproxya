export async function onRequest({params,env}) {
  const kv=env.MYPROXY_KV;
  if(!kv)return new Response("Storage unavailable",{status:503});
  const expected=await kv.get("myproxy_fixed_token");
  if(!expected||String(params.token)!==expected)return new Response("Not found",{status:404});
  const yaml=await kv.get("myproxy_single_config");
  if(!yaml)return new Response("Subscription not configured",{status:404});
  return new Response(yaml+"\n",{headers:{
    "Content-Type":"text/yaml; charset=utf-8",
    "Cache-Control":"no-store, no-cache, must-revalidate",
    "X-Content-Type-Options":"nosniff"
  }});
}