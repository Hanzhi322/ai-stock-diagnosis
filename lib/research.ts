/** Public, immutable evidence snapshot. Amounts are RMB thousand unless stated. */
export const snapshot = {
  id: "catl-2026h1-v1", company: "宁德时代", ticker: "300750.SZ", industry: "动力电池与储能制造",
  reportPeriod: "2026-01-01 至 2026-06-30", periodEnd: "2026-06-30", publishedAt: "2026-07-24", retrievedAt: "2026-09-26",
  title: "宁德时代 2026 年半年度报告", source: "https://static.cninfo.com.cn/finalpage/2026-07-24/1225442062.PDF",
  provider: "巨潮资讯 · 公司法定披露", unit: "人民币千元", audit: "半年度报告，未经审计",
};
export type Field = { id:string; label:string; current:number|null; previous:number|null; unit:string; comparison:string; page:number; note?:string };
export const fields: Field[] = [
 {id:"revenue",label:"营业收入",current:276916580,previous:178886253,unit:"千元",comparison:"2025 H1",page:7},
 {id:"profit",label:"归母净利润",current:43284002,previous:30485139,unit:"千元",comparison:"2025 H1",page:7},
 {id:"adjustedProfit",label:"扣非归母净利润",current:39013300,previous:27197468,unit:"千元",comparison:"2025 H1",page:7},
 {id:"cashflow",label:"经营活动现金流量净额",current:60216851,previous:58687066,unit:"千元",comparison:"2025 H1",page:7},
 {id:"cost",label:"营业成本",current:210654890,previous:134123603,unit:"千元",comparison:"2025 H1",page:15},
 {id:"rd",label:"研发投入",current:11376545,previous:10094566,unit:"千元",comparison:"2025 H1",page:15},
 {id:"receivables",label:"应收账款",current:88417984,previous:76403264,unit:"千元",comparison:"2025 年末",page:17,note:"期末对比年初，不能与收入同比直接等同比较。"},
 {id:"inventory",label:"存货",current:130819205,previous:94526239,unit:"千元",comparison:"2025 年末",page:17},
 {id:"contractLiabilities",label:"合同负债",current:36482664,previous:49233377,unit:"千元",comparison:"2025 年末",page:17},
 {id:"powerRevenue",label:"动力电池收入",current:192124890,previous:null,unit:"千元",comparison:"本期披露",page:16},
 {id:"powerCost",label:"动力电池成本",current:152492111,previous:null,unit:"千元",comparison:"本期披露",page:16},
 {id:"storageRevenue",label:"储能电池收入",current:53260967,previous:null,unit:"千元",comparison:"本期披露",page:16},
 {id:"storageCost",label:"储能电池成本",current:40500853,previous:null,unit:"千元",comparison:"本期披露",page:16},
 {id:"powerMarginChange",label:"动力电池毛利率同比变化",current:-1.78,previous:null,unit:"百分点",comparison:"2025 H1",page:16,note:"报告表内以 % 记载毛利率差，本产品标为百分点。"},
 {id:"storageMarginChange",label:"储能电池毛利率同比变化",current:-1.56,previous:null,unit:"百分点",comparison:"2025 H1",page:16},
 {id:"marketShare",label:"全球动力电池使用量市占率",current:40.2,previous:null,unit:"%",comparison:"2026 年 1—5 月",page:10,note:"公司半年报引述 SNE Research；未独立核验第三方原始数据库。"},
 {id:"marketShareChange",label:"全球市占率同比变化",current:2.2,previous:null,unit:"百分点",comparison:"2025 年 1—5 月",page:10},
 {id:"dividend",label:"中期拟每 10 股派息（含税）",current:14.11,previous:null,unit:"元",comparison:"2026 中期方案",page:31,note:"截至本报告披露时为分红方案，不代表已实施。"},
 {id:"price",label:"同日 A 股收盘价",current:null,previous:null,unit:"元/股",comparison:"未接入",page:0},
 {id:"pe",label:"A 股市盈率 TTM",current:null,previous:null,unit:"倍",comparison:"未接入",page:0},
];
export function field(id:string,data:Field[]=fields){return data.find(f=>f.id===id);}
export function ratio(a:number|null|undefined,b:number|null|undefined){return a==null||b==null||!Number.isFinite(a)||!Number.isFinite(b)||b<=0?null:a/b;}
export function growth(a:number|null|undefined,b:number|null|undefined){const r=ratio(a,b);return r===null?null:(r-1)*100;}
export function fmt(n:number|null|undefined,digits=2){return n==null||!Number.isFinite(n)?"未获得":n.toLocaleString("zh-CN",{minimumFractionDigits:digits,maximumFractionDigits:digits});}
export function amount(n:number|null|undefined){return n==null?"未获得":fmt(n/100000);}
export function metrics(data:Field[]=fields){const v=(id:string)=>field(id,data);const cashRatio=ratio(v("cashflow")?.current,v("profit")?.current);const oldCashRatio=ratio(v("cashflow")?.previous,v("profit")?.previous);return {
 revenueGrowth:growth(v("revenue")?.current,v("revenue")?.previous),profitGrowth:growth(v("profit")?.current,v("profit")?.previous),cashGrowth:growth(v("cashflow")?.current,v("cashflow")?.previous),adjustedGrowth:growth(v("adjustedProfit")?.current,v("adjustedProfit")?.previous),
 cashRatio,oldCashRatio,cashRatioChange:cashRatio===null||oldCashRatio===null?null:cashRatio-oldCashRatio,
 grossMargin:v("revenue")?.current&&v("cost")?.current!=null?(1-v("cost")!.current!/v("revenue")!.current!)*100:null,
 storageMargin:v("storageRevenue")?.current&&v("storageCost")?.current!=null?(1-v("storageCost")!.current!/v("storageRevenue")!.current!)*100:null,
 powerMargin:v("powerRevenue")?.current&&v("powerCost")?.current!=null?(1-v("powerCost")!.current!/v("powerRevenue")!.current!)*100:null,
 inventoryGrowth:growth(v("inventory")?.current,v("inventory")?.previous),receivablesGrowth:growth(v("receivables")?.current,v("receivables")?.previous),
};}
export type EvidenceType="positive"|"negative"|"conflict"|"unknown";
export type Evidence={id:string;type:EvidenceType;label:string;title:string;fact:string;inference:string;boundary:string;dimension:string;fieldIds:string[];page:number;formula?:string;nextQuestion:string};
export const typeLabels:Record<EvidenceType,string>={positive:"正面证据",negative:"负面证据",conflict:"矛盾信号",unknown:"待验证"};
export function buildEvidence(data:Field[]=fields):Evidence[]{const m=metrics(data);const has=(ids:string[])=>ids.every(id=>field(id,data)?.current!=null);const entries:Evidence[]=[
 {id:"E01",type:"positive",label:"正面证据",title:"业务规模增长，扣非利润同步提升",fact:`收入同比增长 ${fmt(m.revenueGrowth)}%，扣非归母净利润同比增长 ${fmt(m.adjustedGrowth)}%。`,inference:"收入和扣非利润同向增长，支持经营规模扩张的判断；利润增长不只来自非经常性项目。",boundary:"同比增长不等于未来持续增长，尚需区分销量、售价与产品结构的贡献。",dimension:"经营质量",fieldIds:["revenue","adjustedProfit"],page:7,formula:"同比增速 =（本期金额 ÷ 上年同期金额 − 1）× 100%",nextQuestion:"储能业务的增长与毛利率变化是否一致？"},
 {id:"E02",type:"conflict",label:"矛盾信号",title:"利润在增长，现金流增速却未同步",fact:`经营现金流同比增长 ${fmt(m.cashGrowth)}%，归母净利润同比增长 ${fmt(m.profitGrowth)}%；现金流 / 归母净利润为 ${fmt(m.cashRatio)} 倍，上年同期为 ${fmt(m.oldCashRatio)} 倍。`,inference:"现金流绝对额仍高于归母净利润，但增速落后、比值下降。两种信号应同时保留。",boundary:"分子是合并经营现金流，分母是归母利润，存在少数股东口径差异；该比值仅供辅助观察。不能由此直接认定利润失真。",dimension:"现金流质量",fieldIds:["cashflow","profit"],page:7,formula:"现金流 / 归母净利润 = 60,216,851 ÷ 43,284,002；同比各自使用同口径去年同期",nextQuestion:"应收账款、存货和合同负债有哪些变化？"},
 {id:"E03",type:"negative",label:"负面证据",title:"主营业务毛利率下降，需要核对增长代价",fact:`动力电池毛利率 ${fmt(m.powerMargin)}%，同比下降 1.78 个百分点；储能电池毛利率 ${fmt(m.storageMargin)}%，同比下降 1.56 个百分点。`,inference:"两项主营业务毛利率同时回落，是盈利能力需要关注的信号。",boundary:"毛利率下降原因尚未拆解，不能直接归因为降价或竞争加剧。",dimension:"盈利能力",fieldIds:["powerRevenue","powerCost","storageRevenue","storageCost","powerMarginChange","storageMarginChange"],page:16,formula:"毛利率 =（营业收入 − 营业成本）÷ 营业收入 × 100%；变化按公告披露",nextQuestion:"规模扩张是否带来了营运资本占用？"},
 {id:"E04",type:"unknown",label:"待验证",title:"当前估值与行情，证据仍不充分",fact:"未接入同一交易日的 A 股价格、复权 K 线、总股本与同行 TTM 估值。",inference:"不能用利润增速替代估值，不能从财报直接得出当前股价高低或趋势判断。",boundary:"缺失值保留为空，不补零、不生成模拟行情。",dimension:"估值与行情",fieldIds:["price","pe"],page:0,nextQuestion:"估值判断还需要哪些数据与比较口径？"},
 {id:"E05",type:"conflict",label:"矛盾信号",title:"扩张伴随存货与应收增加，因果仍待核对",fact:`存货较年初增长 ${fmt(m.inventoryGrowth)}%，应收账款较年初增长 ${fmt(m.receivablesGrowth)}%；合同负债由 ${amount(field("contractLiabilities",data)?.previous)} 亿元降至 ${amount(field("contractLiabilities",data)?.current)} 亿元。`,inference:"营运资本项目变化值得关注，但期末余额变化并不等于经营现金流的全部变化。",boundary:"这是 6 月末相对上年末的比较，不是同比；季节性、汇率及非现金变动均可能影响余额。",dimension:"财务趋势",fieldIds:["inventory","receivables","contractLiabilities"],page:17,formula:"较年初变化 =（期末余额 ÷ 上年末余额 − 1）× 100%",nextQuestion:"现金流增速落后是否足以说明利润质量差？"},
 {id:"E06",type:"positive",label:"正面证据",title:"行业份额提升，但第三方数据需继续验证",fact:"半年报引述 SNE Research：2026 年 1—5 月动力电池使用量全球市占率 40.2%，同比提升 2.2 个百分点。",inference:"按公司披露口径，份额提升支持行业地位增强的判断。",boundary:"行业数据期间为 1—5 月，财务期间为 1—6 月；第三方底层数据尚未独立复核，不等同于完整同行比较。",dimension:"行业位置",fieldIds:["marketShare","marketShareChange"],page:10,nextQuestion:"行业份额提升是否带来了更高毛利率？"},
 {id:"E07",type:"unknown",label:"待验证",title:"中期分红方案已披露，实施状态未核验",fact:"报告披露中期拟每 10 股派息 14.11 元（含税）。",inference:"这是披露时点的资本分配方案，需查阅后续权益分派实施公告验证是否实施。",boundary:"不将方案当作已完成事件；未按当前股价计算股息率，也未核验后续事件。",dimension:"事件与风险",fieldIds:["dividend"],page:31,nextQuestion:"分红方案的实施还需要哪些证据？"},
 ];return entries.map(e=>e.id!=="E04"&&!has(e.fieldIds)?{...e,type:"unknown",label:"待验证",title:"所需字段缺失，暂停该项判断",fact:"部分必要原始字段未获得。",inference:"无法完成确定性计算，不输出正常诊断。",boundary:"请补齐同口径字段后重新验证。",formula:undefined}:e);}
export const evidence=buildEvidence();
export type Diagnosis={question:string;focus:string;reason:string;ids:string[];mode:"rules"|"llm";notice:string;summary:string;followups:string[];blocked?:boolean;model?:string;generatedAt?:string};
const focuses=[
 {focus:"现金流与增长质量",pattern:/现金|回款|应收|存货|质量|cash|receivable/i,ids:["E02","E05","E01","E03"],reason:"电池制造业需要同时观察盈利、经营现金流和营运资本，避免只看利润增速。"},
 {focus:"估值与行情证据",pattern:/估值|股价|便宜|贵|市盈率|走势|k线|行情|pe\b|valuation|price/i,ids:["E04","E01","E03"],reason:"估值需要同一时点的价格与盈利口径；行情判断需要复权价格序列。"},
 {focus:"行业地位与盈利能力",pattern:/行业|同行|份额|竞争|地位|peer|market share/i,ids:["E06","E03","E04"],reason:"市场份额和盈利能力是不同维度，还需检验行业统计期间与同行可比性。"},
 {focus:"业务结构与盈利能力",pattern:/储能|动力|毛利|业务|产品|成本|margin|battery/i,ids:["E03","E01","E06"],reason:"制造业收入增长需要拆分主营业务毛利率，避免把规模扩张等同于盈利改善。"},
 {focus:"事件进展与反证",pattern:/分红|风险|事件|公告|反证|dividend|risk/i,ids:["E07","E03","E05","E04"],reason:"先核对事件所处阶段，再检查财务压力与尚缺证据。"},
 {focus:"经营增长与财务趋势",pattern:/营收|收入|增长|利润|财务|整体|诊断|growth|profit|revenue/i,ids:["E01","E02","E03","E05"],reason:"收入、扣非利润、现金流与毛利率交叉验证，保留方向不一致的证据。"},
];
export function diagnose(question:string):Diagnosis{
 const q=question.trim();
 if(!q||q.length>500)throw new Error("请输入 1—500 字的研究问题。");
 const requestedTrade=/买入|卖出|买不买|能买|该买|可以买|买点|卖点|目标价|涨停|翻倍|保证收益|稳赚|明天.*涨|预测.*涨|buy|sell|guarantee/i.test(q);
 if(requestedTrade)return {question:q,focus:"研究边界",reason:"该问题涉及交易指令或确定性预测，转为可核验的研究任务。",ids:["E04","E02","E03"],mode:"rules",notice:"不提供买卖建议、确定性涨跌预测或收益承诺。",summary:"可以核对经营与风险证据，但不能据此给出交易指令。当前行情与估值数据也未接入。",followups:["当前估值判断还缺哪些证据？","利润增长是否有现金流支撑？"],blocked:true};
 const choice=focuses.find(x=>x.pattern.test(q));
 const ids=choice?.ids??["E01","E02","E03","E04"];
 return {question:q,focus:choice?.focus??"多维证据概览",reason:choice?.reason??"问题未匹配特定财务维度，先展示概览；可进一步说明关注现金流、盈利、行业或估值。",ids,mode:"rules",notice:"规则诊断：未调用大模型。",summary:choice?"先核对披露事实，再检验推断成立所需的条件。正面、负面与未知信息会同时保留。":"这个问题可能超出当前资料范围。以下只提供宁德时代的已核验财报证据，请勿将概览视为对原问题的完整回答。",followups:ids.slice(0,3).map(id=>evidence.find(e=>e.id===id)!.nextQuestion)};
}
export function staleDays(now=new Date()){return Math.max(0,Math.floor((now.getTime()-new Date(snapshot.publishedAt+"T00:00:00Z").getTime())/86400000));}
export function exportResearch(result:Diagnosis|null){const items=result?evidence.filter(e=>result.ids.includes(e.id)):evidence;return `# 证研 · 宁德时代研究记录\n\n报告期：${snapshot.reportPeriod}\n披露：${snapshot.publishedAt}\n快照核验：${snapshot.retrievedAt}\n来源：${snapshot.source}\n快照版本：${snapshot.id}\n\n${result?`问题：${result.question}\n模式：${result.mode}\n提示：${result.notice}\n总结：${result.summary}\n\n`:""}${items.map(e=>`## ${e.id} ${e.title}\n\n分类：${e.label} / ${e.dimension}\n事实：${e.fact}\n推断：${e.inference}\n边界：${e.boundary}\n计算：${e.formula||"不适用"}\n字段：${e.fieldIds.join(", ")}\n来源：${e.page?snapshot.source+"#page="+(e.page+1):"未接入"}\n追问：${e.nextQuestion}`).join("\n\n")}\n\n## 原始字段（金额人民币千元）\n\n${fields.map(f=>`${f.id} | ${f.label} | 本期 ${f.current??"未获得"} | 比较期 ${f.previous??"未获得"} | ${f.unit} | ${f.comparison} | 报告印刷页 ${f.page||"无"}`).join("\n")}\n\n仅辅助研究，不提供买卖指令；快照不是实时行情。\n`;}
