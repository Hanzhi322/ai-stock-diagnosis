# 证研 · 最终提交清单

作品：个股多维诊断与证据验证（宁德时代 300750.SZ）。

- Web 产品：[https://zhengyan-evidence-workbench.zuhanzhizzz.chatgpt.site](https://zhengyan-evidence-workbench.zuhanzhizzz.chatgpt.site)，公开可访问。
- 源码仓库：[https://github.com/Hanzhi322/ai-stock-diagnosis](https://github.com/Hanzhi322/ai-stock-diagnosis)，公开，默认分支 main。
- README：目标用户、核心设计、本地启动、环境变量、数据来源与已知边界。
- AI 使用与修正记录：`docs/AI_USAGE.md`。
- 测试说明：`docs/TESTING.md`；实际验证结果：`docs/VERIFICATION.json`。

## 验收状态

本机和线上三个研究问题均验证真实 Groq AI 返回；17 项自动测试、类型检查和正式构建通过。API Key 仅存在本机忽略文件与托管服务秘密变量中。

## 提交操作

在题目提交处填写 Web URL 与 GitHub URL，并上传最新版提交包。候选人亲自演示一个研究问题并点开一条证据核对来源。

演示视频为可选项，目前有 `docs/DEMO.md` 的演示脚本，未录制视频。

## 已知边界

只覆盖宁德时代公开财报快照；实时行情、同行估值和最新事件尚未接入并显示未知。模型受服务商额度限制，异常时明确降级。无需再新增功能即可进行本次提交审阅。
