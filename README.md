# Kana 5

Kana 5 是一个面向中文用户的日语假名学习 PWA。它按学习曲线逐步解锁内容，使用卡片式认读、反向回忆和间隔复习帮助记忆平假名、片假名、浊音、拗音、长音与促音。

应用不依赖后端，学习进度保存在当前设备。部署到 HTTPS 后，可以通过 iPhone Safari 添加到主屏幕，并离线使用。

## 功能

- 平假名、片假名和混合学习模式
- 每次学习 5 个新内容，组内进行二次巩固
- 答错内容延迟回队，直到重新答对
- 按 `1、3、7、14、30 天` 逐步拉长复习间隔
- 根据答题速度调整复习时间
- 连续答错 3 次自动标记为困难卡
- 独立的到期复习和错题强化页面
- 五十音图支持基础、浊音、拗音和规则四个阶段
- 学习进度本地保存，支持 JSON 导出与导入
- PWA 离线缓存和 iOS 主屏幕安装
- 键盘数字键选择答案，空格或回车继续

## 学习阶段

| 阶段 | 内容 | 数量 |
| --- | --- | --- |
| 1 | 基础清音假名 | 46 种读音 |
| 2 | 浊音与半浊音 | 25 种读音 |
| 3 | 常见拗音 | 33 种读音 |
| 4 | 长音与促音规则 | 每个假名体系 10 组短词 |

后续阶段在上一阶段全部接触，且至少 80% 达到 7 天复习间隔后自动解锁。

## 项目结构

```text
outputs/kana-card/      可运行的应用
  index.html            页面结构
  styles.css            移动端样式
  app.js                页面逻辑
  app.bundle.js         file:// 可直接加载的打包脚本
  kana-data.js          假名与规则数据
  learning-engine.js    学习曲线和间隔复习逻辑
  sw.js                 Service Worker
  manifest.webmanifest  PWA 配置
  icons/                应用图标

work/                   开发、构建和自动化测试脚本
  build-classic-bundle.mjs
  engine-test.mjs
  review-test.mjs
  session-sequence-test.mjs
  file-test.mjs
  browser-test.mjs
  serve-kana.mjs
```

## 本地运行

直接双击 `outputs/kana-card/index.html` 可以使用学习功能，但 `file://` 无法启用 Service Worker 和主屏幕安装。

要测试完整的 PWA 功能，在项目根目录运行：

```powershell
node work/serve-kana.mjs 8080
```

然后打开：

```text
http://127.0.0.1:8080
```

## iPhone 安装

1. 将 `outputs/kana-card` 部署到 Cloudflare Pages、GitHub Pages、Netlify 等 HTTPS 静态托管服务。
2. 使用 iPhone Safari 打开部署网址。
3. 点击“分享”。
4. 选择“添加到主屏幕”。
5. 从主屏幕图标打开，即可全屏和离线使用。

Service Worker 必须运行在 HTTPS 或 `localhost` 下。

## 部署

### Cloudflare Pages

- 构建命令：留空
- 输出目录：`outputs/kana-card`

### GitHub Pages

将 `outputs/kana-card` 作为发布目录，或把该目录内容复制到 Pages 使用的分支与目录中。仓库已配置 GitHub Actions，每次推送到 main 会自动部署到 GitHub Pages。

## 数据与隐私

- 应用不需要账号，也不连接后端。
- 学习记录保存在浏览器 `localStorage`。
- 清除浏览器数据、删除主屏幕应用或更换设备可能导致进度丢失。
- “进度”页面提供 JSON 导出和导入，可用于备份或迁移。
- 应用不会上传学习记录。

## 测试

在项目根目录运行：

```powershell
node work/engine-test.mjs
node work/review-test.mjs
node work/session-sequence-test.mjs
node work/file-test.mjs
```

测试覆盖：

- 四阶段内容和解锁条件
- 新卡二次巩固与错题回队
- 间隔复习、快答和慢答调整
- 困难卡标记
- 规则题选项
- `file://` 页面交互
- Service Worker 激活和离线重载

## 版本

- `v1.0.0`：基础 46 音、间隔复习、PWA 和进度备份
- `main`：包含完整四阶段功能

当前版本强调本地优先、无账号和离线可用。浊音、拗音、长音与促音均已纳入完整学习路径。
