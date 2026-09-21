# Kana 5

一个无后端、可离线安装的日语假名学习 PWA。直接双击 `index.html` 即可开始互动学习。

## 本地预览

在 `kana-card` 目录运行：

```powershell
python -m http.server 4173
```

然后访问 `http://localhost:4173`。

## 部署

把整个 `kana-card` 目录上传到任意支持 HTTPS 的静态托管服务，例如 Cloudflare Pages、GitHub Pages 或 Netlify。

直接打开 `index.html` 时学习功能可以正常使用，但浏览器不允许 `Service Worker` 在 `file://` 下运行，因此离线缓存和主屏幕安装需要通过 HTTPS 或 `localhost` 访问。

## 安装到 iPhone

1. 使用 Safari 打开部署后的网址。
2. 点击“分享”。
3. 选择“添加到主屏幕”。
4. 从主屏幕图标打开，即可全屏和离线使用。

学习进度保存在当前设备。页面中的“进度”页可以导出和导入 JSON 备份。

## 复习机制

- 独立“复习”页支持到期复习和错题强化。
- 答对后按 1、3、7、14、30 天逐步拉长间隔。
- 快答会适度延后复习，慢答会更早再见。
- 连续答错 3 次会标记为困难卡，并缩短后续复习间隔。
