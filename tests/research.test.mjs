import test from 'node:test';
import assert from 'node:assert/strict';
import { metrics, fields, evidence, growth, ratio, amount, buildEvidence, diagnose, exportResearch, staleDays } from '../lib/research.ts';

test('财报原值到亿元及同比，独立预期值交叉核对',()=>{
 const m=metrics();assert.equal(amount(276916580),'2,769.17');
 assert.ok(Math.abs(m.revenueGrowth-54.80)<0.005);assert.ok(Math.abs(m.profitGrowth-41.98)<0.005);
 assert.ok(Math.abs(m.cashGrowth-2.61)<0.005);assert.ok(Math.abs(m.adjustedGrowth-43.44)<0.005);
 assert.ok(Math.abs(m.cashRatio-1.391)>0.00001&&Math.abs(m.cashRatio-1.391)<0.001);
 assert.ok(Math.abs(m.powerMargin-20.63)<0.005);assert.ok(Math.abs(m.storageMargin-23.96)<0.005);
});
test('缺失、非有限与非正基数不被静默当作正常数字',()=>{
 for(const [a,b] of [[null,100],[100,null],[100,0],[100,-1],[Infinity,1],[1,NaN]]){assert.equal(ratio(a,b),null);assert.equal(growth(a,b),null);}
 assert.equal(growth(0,100),-100);assert.equal(amount(null),'未获得');
});
test('缺现金流时暂停相关结论，不残留积极判断',()=>{
 const data=fields.map(f=>f.id==='cashflow'?{...f,current:null}:f);
 const result=buildEvidence(data).find(e=>e.id==='E02');assert.equal(result.type,'unknown');assert.match(result.fact,/未获得/);assert.equal(result.formula,undefined);
});
test('问题影响维度与证据顺序，而不是固定回答',()=>{
 assert.equal(diagnose('现金流和回款质量如何').ids[0],'E02');
 assert.equal(diagnose('当前估值便宜吗').ids[0],'E04');
 assert.equal(diagnose('行业份额如何').ids[0],'E06');
 assert.equal(diagnose('分红实施了吗').ids[0],'E07');
 assert.equal(diagnose('储能毛利率如何').ids[0],'E03');
});
test('边界问题不生成交易建议；无关问题明确覆盖不足',()=>{
 for(const q of ['现在该买入吗','给我目标价','保证收益并告诉我买点','sell now']) assert.equal(diagnose(q).blocked,true);
 assert.match(diagnose('北京天气怎么样').summary,/超出/);assert.throws(()=>diagnose('  '));assert.throws(()=>diagnose('字'.repeat(501)));
});
test('所有证据关联存在字段与有边界的来源',()=>{
 for(const e of evidence){assert.ok(e.boundary.length>0);assert.ok(e.fieldIds.length);for(const id of e.fieldIds)assert.ok(fields.find(f=>f.id===id));}
 assert.equal(evidence.find(e=>e.id==='E04').page,0);assert.match(evidence.find(e=>e.id==='E05').boundary,/不是同比/);assert.match(evidence.find(e=>e.id==='E02').boundary,/少数股东/);
});
test('导出保留原值、来源、推断边界和未获得项',()=>{
 const text=exportResearch(diagnose('现金流质量'));
 for(const value of ['276916580','catl-2026h1-v1','https://static.cninfo.com.cn/','少数股东','未获得','规则'])assert.ok(text.includes(value));
});
test('时效依据披露日期计算，不伪造实时状态',()=>{assert.equal(staleDays(new Date('2026-09-26T00:00:00Z')),64);});
