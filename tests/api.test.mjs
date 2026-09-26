import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
await build({entryPoints:['app/api/diagnose/route.ts'],outfile:'.sites-runtime/test-api.mjs',bundle:true,format:'esm',platform:'node',alias:{'@':'./'},logLevel:'silent'});
const {POST}=await import('../.sites-runtime/test-api.mjs');
const originalFetch=globalThis.fetch;
const savedKey=process.env.LLM_API_KEY;
const request=(body)=>new Request('http://localhost/api/diagnose',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
const finish=()=>{globalThis.fetch=originalFetch;if(savedKey===undefined)delete process.env.LLM_API_KEY;else process.env.LLM_API_KEY=savedKey;};
test('API 空问题与无效 JSON 返回明确错误',async()=>{assert.equal((await POST(request({question:''}))).status,400);assert.equal((await POST(new Request('http://localhost/api/diagnose',{method:'POST',body:'{bad'}))).status,400);assert.equal((await POST(request({question:'字'.repeat(6000)}))).status,413);});
test('API 无模型密钥时明确返回规则模式',async()=>{delete process.env.LLM_API_KEY;try{const r=await (await POST(request({question:'现金流质量'}))).json();assert.equal(r.mode,'rules');assert.match(r.notice,/未调用大模型/);}finally{finish();}});
test('API 模拟模型合法输出保留反证且返回 llm 模式',async()=>{process.env.LLM_API_KEY='test-not-a-real-key';globalThis.fetch=async()=>Response.json({choices:[{message:{content:JSON.stringify({ids:['E01'],summary:'盈利增长与现金回流速度不同，应保留营运资本变化的反证。',reason:'制造业需要交叉核对现金流与盈利。'})}}]});try{const r=await(await POST(request({question:'现金流质量'}))).json();assert.equal(r.mode,'llm');assert.ok(r.ids.includes('E02'));assert.ok(r.ids.includes('E05'));}finally{finish();}});
test('API 模拟模型胡编证据、数值或交易指令时降级',async()=>{process.env.LLM_API_KEY='test-not-a-real-key';try{for(const answer of [{ids:['E99'],summary:'未知证据',reason:'理由'},{ids:['E01'],summary:'增长999%',reason:'理由'},{ids:['E01'],summary:'建议买入',reason:'理由'}]){globalThis.fetch=async()=>Response.json({choices:[{message:{content:JSON.stringify(answer)}}]});const r=await(await POST(request({question:'现金流质量'}))).json();assert.equal(r.mode,'rules');assert.match(r.notice,/未通过验证/);}}finally{finish();}});
test('API 模拟上游错误或超时，不能标记为 AI 成功',async()=>{process.env.LLM_API_KEY='test-not-a-real-key';try{for(const f of [async()=>new Response('error',{status:503}),async()=>{throw new DOMException('timed out','TimeoutError')}]){globalThis.fetch=f;const r=await(await POST(request({question:'利润增长'}))).json();assert.equal(r.mode,'rules');assert.match(r.notice,/降级/);}}finally{finish();}});
test('API 买卖请求在服务端阻止，不触发模型调用',async()=>{process.env.LLM_API_KEY='test-not-a-real-key';let called=false;globalThis.fetch=async()=>{called=true;throw Error()};try{const r=await(await POST(request({question:'给我买入建议'}))).json();assert.equal(r.blocked,true);assert.equal(called,false);}finally{finish();}});

test('API 合法证据编号不是财务数字，未知编号仍被拒绝',async()=>{
 process.env.LLM_API_KEY='test-not-a-real-key';
 try{for(const [summary,mode] of [['E04 表明估值证据尚不充分，E01 的经营增长不能替代估值。','llm'],['E99 表明估值合理。','rules'],['E04 表明估值为20倍。','rules'],['E041 表明估值合理。','rules']]){
  globalThis.fetch=async()=>Response.json({choices:[{message:{content:JSON.stringify({ids:['E04','E01'],summary,reason:'制造业估值需要同日市场定价与盈利口径。'})}}]});
  assert.equal((await(await POST(request({question:'估值合理吗'}))).json()).mode,mode);
 }}finally{finish();}
});
test('API 遵循 429 Retry-After 后重试真实模型路径',async()=>{
 process.env.LLM_API_KEY='test-not-a-real-key';let calls=0;
 globalThis.fetch=async()=>++calls===1?new Response('limited',{status:429,headers:{'Retry-After':'0'}}):Response.json({choices:[{message:{content:JSON.stringify({ids:['E04'],summary:'缺乏市场定价，无法判断估值。',reason:'制造业估值需要同日价格与盈利口径。'})}}]});
 try{const r=await(await POST(request({question:'估值合理吗'}))).json();assert.equal(r.mode,'llm');assert.equal(calls,2);}finally{finish();}
});
test('API 持续限流有界停止，并与输出校验错误区分',async()=>{
 process.env.LLM_API_KEY='test-not-a-real-key';let calls=0;
 globalThis.fetch=async()=>{calls++;return new Response('limited',{status:429,headers:{'Retry-After':'0'}})};
 try{const r=await(await POST(request({question:'估值合理吗'}))).json();assert.equal(r.mode,'rules');assert.equal(r.failureCode,'UPSTREAM_429');assert.match(r.notice,/频率受限/);assert.equal(calls,3);}finally{finish();}
});
