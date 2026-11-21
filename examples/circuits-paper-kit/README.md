# Circuits Paper：可交互的可解释性论文页

风格包 `circuits-paper` 的示例：一页自包含的研究论文（`index.html`，无构建、无依赖，单文件内联样式与脚本）。语法属于“交互式可解释性研究线索”那一类科学文章（Distill 一脉）：白色页面、三档墨色、一种朴素的无衬线体加等宽字体写词元、宽幅署名栏、左侧目录、右侧边注栏、编号图注、米色节点加紫红与深栗色的加权边、按激活强弱变色的橙色词元高亮。深色主题随系统（`prefers-color-scheme`）。

内容是占位：一份关于“价格序列小模型里的特征”的虚构研究笔记，页首横幅与每张图都写明“示例数据”。所有特征、数字、曲线、作者与机构都是虚构的，不是任何真实实验的结果；参考文献是真实公开文献，只作格式示例。语法量自三个公开的研究线索页面（私下用 Chrome 量计算样式，不进仓库），只带走数字和规则，见 [style.json](../../skill/tools/template-bank/styles/circuits-paper/style.json)。借语法，不借素材：不使用任何机构名、标志、字标、图片、文案和原版专有字体。

## 打开

```bash
cd examples/circuits-paper-kit
python3 -m http.server 8851      # 或直接双击 index.html
# http://127.0.0.1:8851/index.html
```

字体通过 Google Fonts 加载 IBM Plex Sans、Roboto Mono、STIX Two Text、Noto Sans SC（均为开源字体）；离线时落到系统字体，版式不变。

## 里面有什么

| 部分 | 对应的模板 |
| --- | --- |
| 标题、导语、署名栏（作者与标记左，机构与日期叠在右）、标记说明、摘要 | `cover.circuits-title` |
| 图 1：残差流示意，每个位置一条竖条，块读入再写回；右侧边注带缩略图 | `card.circuits-figure` |
| 图 2：特征浏览器。三个特征的标签页，四句示例的词元按激活强弱亮三档橙色，悬停或点按一个词，右侧列出它在三个特征上的激活 | `card.circuits-features` |
| 图 3：归因图。三层节点，亮起的节点是深栗色，边按权重变粗；悬停、聚焦或点按一个节点只留它的入边与出边；滑块按边权剪枝 | `card.circuits-graph` |
| 左侧目录（顶层 600、嵌套 400，当前章节用深栗色竖条标出）、脚注悬停卡片 | `doc.circuits-contents` |
| 图 4：稀疏系数 λ 与重建误差的示例曲线，滑块移动曲线上的点并更新读数 | 只在页面里（模板不含） |
| 两个公式（行内 HTML 与衬线斜体，带编号）、边注（宽屏在右侧栏，窄屏落到正文里）、引用 `[n]` 与脚注上标的悬停预览、参考文献 | 只在页面里（模板不含） |

## 动效

- 图随滚动升起（0.6 秒，位移 12 像素），进入视口 18% 时触发。
- 图 1 的读写箭头与图 3 的归因边自己画出来（`pathLength` 与 `stroke-dashoffset`，按层从下往上错开）；图 4 的曲线同样画出。
- 切换特征时词元高亮按位置依次淡入（每词 30 毫秒），右侧激活条从 0 长到目标值。
- 悬停节点时，其他节点与边降到 14% 透明度；剪枝滑块把被剪掉的边淡出，不是直接消失。
- 目录用滚动位置标出当前章节。
- `prefers-reduced-motion` 下全部关闭，页面一开始就是终态；悬停与滑块的状态变化仍然即时发生。

## 改它

- 颜色、字体在 `:root` 的变量里；深色值写在同一个 `light-dark()` 里。
- 特征数据在脚本里的 `F`、`S`、`A`（特征、句子、激活）；归因图的节点是 `NM`，边是 `E`（起点、终点、权重）；曲线函数是 `L0` 与 `ER`。
- 词元高亮的三档橙色是 `--h1`、`--h2`、`--h3`，档位阈值是 0.12、0.33、0.66；高亮上的字永远是黑色。
- 小号文字不要用 `--faint`（3.9:1，只够大字号）；小字用 `--mute`。
- 窄屏（1100 像素以下）边注落到正文里，目录折叠成可展开的列表。

## 检查

页面通过 `template check` 的浏览器部分（先用页高量一次，页高随宽度变化）。检查本身会冻结 CSS 过渡和动画；仓库测试还用 `--force-prefers-reduced-motion` 启动 Chrome，使脚本动效停在终态、结果确定：

```bash
node skill/scripts/designer-pipeline.cjs template check examples/circuits-paper-kit/index.html --browser --size 1440x6120
node skill/scripts/designer-pipeline.cjs template check examples/circuits-paper-kit/index.html --browser --size 390x7103
```

适配：成组的文字（署名栏、目录、词元条、读数）用 `data-chk` 合成一个检查单元，页面文字单元控制在 80 个以内，使检查一分钟内跑完；坐标轴刻度标了 `data-deco`；归因图的标签（词元、输出）放在 HTML 里而不是 SVG 里，窄屏上不会缩到看不清。结构与约束通过，不等于视觉验收；视觉由主人看图决定。
