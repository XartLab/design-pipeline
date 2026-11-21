# Brand Band：产品站点页

风格包 `brand-band` 的示例：一页自包含的产品站点（`index.html`，无构建、无依赖，单文件内联样式与脚本），主题是主人自己的量化系统 katana（研究、回测、实盘监控），文案全是占位，不含任何客户、引语或业绩数字。象牙白、燕麦色、近黑三种色带依次铺开（象牙白首屏 → 燕麦色三张卡片 → 近黑色宣言 → 象牙白工作方式 → 燕麦色行动区 → 黑色页脚）；宣言和标题用书卷衬线，卡片标题用粗无衬线，标签与按钮用常规无衬线；方形色块底（鼠尾草绿、腮红、淡紫、天蓝、沙色）上各放一幅手绘小图。

语法量自三张公开的 AI 实验室站点页面（首页、一篇新闻、一张招聘页；私下用 Chrome 量计算样式，不进仓库），只带走数字和规则，见 [style.json](../../skill/tools/template-bank/styles/brand-band/style.json)。借语法，不借素材：不使用任何机构名、标志、字标、原版专有字体或原版插图，八幅插图都是我们自己用代码画的。

## 打开

```bash
cd examples/brand-band-site-kit
python3 -m http.server 8850      # 或直接双击 index.html
# http://127.0.0.1:8850/index.html
```

字体通过 Google Fonts 加载 Newsreader、Hanken Grotesk、Noto Serif SC、Noto Sans SC（均为 SIL OFL）；离线时落到系统衬线与无衬线，版式不变。

## 里面有什么

| 部分 | 对应的模板 |
| --- | --- |
| 吸顶导航：左侧药丸、居中字标、右侧药丸；经过黑色色带时药丸换成深色 | `kv.band-hero` 的导航 |
| 象牙白首屏：两行衬线标题、导语、墨色按钮与灰色按钮、方形色块里的“手托节点图” | `kv.band-hero` |
| 燕麦色带：“一个工作台，三件事”，三张卡片（书、长叶子的 K 线、放大镜下的波形） | `card.band-features` |
| 近黑色带：小标签、大号衬线宣言、象牙白按钮与灰色按钮、细线页脚行、指南针 | `banner.band-black-statement` |
| 象牙白工作方式：三行（幼苗、山路、两只手传递火花），交错排列，加一组问答 | 只在页面里（模板不含） |
| 燕麦色行动区：标题、导语、四个药丸、两个按钮 | `banner.band-cta-row` |

文章封面和社交卡片（`cover.band-article`、`card.band-social`）没有对应的页面区块，是同一套语法的另外两个模板。

## 八幅插图

插图库在 [illustrations-band.cjs](../../skill/tools/template-bank/illustrations-band.cjs)，页面里的八幅图就是它的输出（测试逐幅比对，改库就得重新生成页面）。每一笔是一条“马克笔带”：沿一条中心线画出的填充多边形，宽度在中段变粗、两端收成钝圆，中心线带轻微抖动；闭合的形状收笔时多画一点点、又差一点点没接上；平涂的色块（象牙白、橄榄绿、天蓝、陶土色）故意错开线条几个单位，像套印没对准。线条再过一层蜡笔线滤镜（细微位移加纸面颗粒）。

| 图 | 画的是 |
| --- | --- |
| `hand-graph` | 一只手托着一张节点图 |
| `seedling` | 长出节点的幼苗 |
| `book` | 摊开的书，书脊长出分叉的线 |
| `magnifier` | 放大镜罩着一段波形 |
| `spark-hands` | 两只手传递一点火花 |
| `path` | 带路标的山路 |
| `candles` | 长出叶子的 K 线 |
| `compass` | 指南针 |

## 动效

- 插图的线条在滚动进入视口（30%）时自己画出来：每一笔有一个沿中心线的遮罩（`pathLength` 与 `stroke-dashoffset`，每笔错开 70 毫秒），平涂色块随后淡入。
- 卡片和段落进入视口时向上浮 12 像素并淡入，依次错开 80 毫秒；悬停时卡片轻轻抬起 4 像素、图略缩放；按钮 0.2 秒变色。
- 色带之间是直接切换；导航药丸在黑色色带下换成深色。
- `prefers-reduced-motion` 下全部关闭：页面一开始就是终态，不创建任何遮罩。

## 改它

- 颜色、字体、间距在 `:root` 的变量里；插图的色块底在 `.tile` 的 `sage / blush / lilac / sky / sand` 类里。
- 换插图：每幅图是 `<svg class="pic">`，内容由库生成（`classBody(id)`）；在深色或天蓝底上，别让色块和底色同色（库里的强调色是橄榄绿和天蓝，布局会在天蓝底上改用陶土色）。
- 陶土色（对象牙白 2.96:1）只用于小标记；黑色色带上的小字用 `--dim`（#B0AEA5），不要用中灰。
- 问答用 `<details open>`：浏览器检查会量闭合状态下仍占位的正文，默认展开可避免被误报。

## 检查

页面通过 `template check` 的浏览器部分（先用页高量一次，页高随宽度变化）。检查本身会冻结 CSS 过渡和动画；仓库测试还用 `--force-prefers-reduced-motion` 启动 Chrome，使脚本动效停在终态、结果确定：

```bash
node skill/scripts/designer-pipeline.cjs template check examples/brand-band-site-kit/index.html --browser --size 1440x5514
node skill/scripts/designer-pipeline.cjs template check examples/brand-band-site-kit/index.html --browser --size 390x6155
```

结构与约束通过，不等于视觉验收；视觉由主人看图决定。
