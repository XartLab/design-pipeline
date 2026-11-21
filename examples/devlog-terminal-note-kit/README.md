# Devlog Terminal：技术笔记页

风格包 `devlog-terminal` 的示例：一页自包含的工程笔记（`index.html`，无构建、无依赖，单文件内联样式与脚本），用同一套语法写成。近黑底 `#141413`、暖白墨色、灰色正文；导航、日期、标签、章节名全是等宽字（方括号热键），标题和正文是中性无衬线；唯一的强调色陶土色只出现在方块图块和打字光标里，图块里是 9 x 9 的 1 位像素图案。左侧粘性栏有目录树（TREE）、20 格 ASCII 进度条和分享；右侧是 620 宽的阅读栏；页脚之下是点阵场，中间蹲着像素吉祥物。深色为默认，`<html data-theme="light">` 切换浅色。

内容是占位：一篇关于“让夜班工厂验证自己的工作”的虚构笔记，数字和引语都是示例，页内写明“仅用于展示版式”。语法量自一个公开的开发者技术博客（私下用 Chrome 量计算样式，不进仓库），只带走数字和规则，见 [style.json](../../skill/tools/template-bank/styles/devlog-terminal/style.json)。借语法，不借素材：不使用任何机构名、标志或原版专有字体；页里的像素鲸鱼是主人自己的吉祥物。

## 打开

```bash
cd examples/devlog-terminal-note-kit
python3 -m http.server 8851      # 或直接双击 index.html
# http://127.0.0.1:8851/index.html
```

字体通过 Google Fonts 加载 Inter、JetBrains Mono、Noto Sans SC（均为 SIL OFL）；离线时落到系统无衬线与等宽，版式不变。

## 里面有什么

| 部分 | 对应的模板 |
| --- | --- |
| 顶栏：像素吉祥物、方括号热键、反白方块按钮 | `ui.devlog-index` 的导航 |
| 文章头：陶土色图块（像素图案）、标题、导语、三栏元信息 | `ui.devlog-article-header` |
| 左栏：TREE、ASCII 进度条、分享；右栏：620 宽阅读栏 | `ui.devlog-article` |
| 块状图：一格 = 5 个，带 `FIG A` 图注框 | `card.devlog-fig` |
| 相关笔记行：图块、日期、标题、阅读时长 | `ui.devlog-index` 的文章行 |
| 点阵场加吉祥物 | `banner.devlog-dotfield` |
| 代码块带复制按钮、表格、列表、页脚订阅框 | 只在页面里（模板不含） |

## 动效

- 标题逐字打出，后面跟一个陶土色方块光标，每秒闪一次；头部图块自上而下分 6 步擦入。
- 块状图在滚动进视口时一格一格填满（从暗灰到墨色，每格 250 ms）；进度条随滚动填充，目录当前项随章节变粗。
- 点阵场是一圈缓慢的微光波，画在 canvas 上，离开屏幕就暂停；点击吉祥物，它跳一下。
- `prefers-reduced-motion` 下全部关闭：标题已打完、光标不闪、块已填满、点阵与吉祥物静止。

## 改它

- 颜色、字体在 `:root` 的变量里，浅色值在 `:root[data-theme=light]`。
- 图表数据在脚本顶部的 `B`，相关笔记在 `P`；点阵场的种子在 `build` 里（`s=11`）。
- 暗灰 `--dim`（`#5E5D59`，对黑底 2.8:1）只用于点、空格和描边，不用于文字；小字用 `--mute`。
- 陶土色只给方块图块和光标，不用于文字，也不铺大面积。

## 检查

页面通过 `template check` 的浏览器部分。页高随宽度变化，先量一次页高，再按页高检查。检查本身会冻结 CSS 过渡和动画；仓库测试还用 `--force-prefers-reduced-motion` 启动 Chrome，使打字等脚本动效停在终态、结果确定：

```bash
node skill/scripts/designer-pipeline.cjs template check examples/devlog-terminal-note-kit/index.html --browser --size 1440x3191
node skill/scripts/designer-pipeline.cjs template check examples/devlog-terminal-note-kit/index.html --browser --size 390x4569
```

为过检查做的适配（改页面，不改检查）：看不见的邮箱标签原先用 `left:-9999px` 移出画面，检查把它当成文字跑出了画布，现在邮箱输入框直接用 `aria-label`；进度条里空格的 `░` 是文字，用暗灰 `--dim` 只有 2.8:1，改成 `--mute`；窄屏下代码块改成自动换行，长命令不再超出右边缘。结构与约束通过，不等于视觉验收；视觉由主人看图决定。
