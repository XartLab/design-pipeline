# Institute Essay：研报长文页

风格包 `institute-essay` 的示例：一页自包含的研报长文（`index.html`，无构建、无依赖，单文件内联样式与脚本），用同一套语法写成。象牙白纸面、近黑墨色、一种陶土色；标题与正文是书卷衬线，标签、图注、图例全是中性无衬线；640 宽的阅读栏，图表撑满全宽、铺在 22 单位的方格纸上；蜡笔质感的条形（SVG 滤镜：边缘轻微抖动，填色带顺着笔触的条纹和纸面颗粒）、贴在图左侧的便签、三张并列的情景卡、时间线、上标脚注与尾注；首屏右侧是按种子生成的陶土色像素爆发图。深色主题随系统（`prefers-color-scheme`）。

内容是占位：一份关于“AI 资本开支周期”的虚构研报，数字、引语、署名都是示例，页脚写明“仅用于展示版式”。语法量自两个公开的 AI 研究机构长文页（私下用 Chrome 量计算样式，不进仓库），只带走数字和规则，见 [style.json](../../skill/tools/template-bank/styles/institute-essay/style.json)。借语法，不借素材：不使用任何机构名、标志、字标和原版专有字体。

## 打开

```bash
cd examples/institute-essay-report-kit
python3 -m http.server 8850      # 或直接双击 index.html
# http://127.0.0.1:8850/index.html
```

字体通过 Google Fonts 加载 Source Serif 4、Inter、Noto Serif SC、Noto Sans SC（均为 SIL OFL）；离线时落到系统衬线与无衬线，版式不变。

## 里面有什么

| 部分 | 对应的模板 |
| --- | --- |
| 首屏：两行衬线标题、无衬线导语、两个药丸按钮、元信息行、像素爆发图 | `cover.essay-hero` |
| 发现 1：`发现 N：主题` 加一句结论，蜡笔质感的条形图，图例、星号脚注、“怎么读这张图” | `card.essay-finding` |
| 发现 2：扇形路径图，便签骑在图左侧 | `card.essay-note-figure` |
| 三种情景卡片（色块行、标题、副标题、一句话） | `doc.essay-scenarios` |
| 大号引语，陶土色左引号 | `card.essay-pullquote` |
| 流程图：纸色长条里五个手绘线图标（数据、模型、情景分叉、报告、判断）和陶土色箭头，标签在下 | `card.essay-flow` |
| 情景任务的滚动叙事：粘性方格纸舞台，12 个分析师任务图块按滚动步骤变色（不变、被增强、被自动化、新增），便签卡从上面滚过 | 只在页面里（模板不含） |
| 首字下沉、粗体无衬线引导句、时间线、脚注列表、斜体署名 | 只在页面里（模板不含） |

## 动效

- 首屏像素爆发图从中心一圈圈弹出，然后缓慢呼吸（每格 5.5 秒一轮，只改透明度）。
- 手绘流程图的蜡笔线在滚动进视口时自己画出来（`pathLength` 与 `stroke-dashoffset`，错开 0.1 秒），标签随后淡入。
- 条形增长、数值同步从 0 数到目标值；扇形图用一个裁剪矩形从左向右揭开。
- 滚动叙事 `#story`：方格纸舞台粘在屏幕上，12 个任务图块随滚动步骤变色并在最后放大，便签卡从上面滚过。
- `prefers-reduced-motion` 下全部关闭，页面一开始就是终态。

## 改它

- 颜色、字体、间距在 `:root` 的变量里；深色值写在同一个 `light-dark()` 里。
- 条形的数据在脚本顶部的 `S`，时间线在 `T`；像素爆发图的种子是 `seed=7`，改它换图案。
- 脚注上标用 `--clay-t`（比陶土色深，对象牙白底 5.2:1）；陶土色本身（2.96:1）只用于图案和符号，不用于小字。
- 小号文字不要用 `--faint`（3.5:1，只够大字号）；小字用 `--mute`。

## 检查

页面通过 `template check` 的浏览器部分（先用页高量一次，页高随宽度变化）。检查本身会冻结 CSS 过渡和动画；仓库测试还用 `--force-prefers-reduced-motion` 启动 Chrome，使脚本动效停在终态、结果确定：

```bash
node skill/scripts/designer-pipeline.cjs template check examples/institute-essay-report-kit/index.html --browser --size 1440x8090
node skill/scripts/designer-pipeline.cjs template check examples/institute-essay-report-kit/index.html --browser --size 390x8294
```

适配：滚动叙事的舞台和步骤高度用 `min(100vh, 上限)`，否则检查把视口拉到整页高度时，舞台随之变成整页高；扇形图的坐标轴刻度标了 `data-deco`（它们是动态生成的刻度，检查量它们的底色时把刻度自己也量了进去）；图表的左边距给便签留出位置，刻度不再被便签盖住。结构与约束通过，不等于视觉验收；视觉由主人看图决定。
