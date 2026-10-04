# 小小长大 · 0–3 岁照护手册

面向新手爸妈、祖辈和照护者的中文照护参考网站，重点覆盖 0–6 个月的喂养、奶量参考、睡眠、尿布观察与日常护理。支持按年龄和主题查找、大字显示、图文离线保存及打印。

在线访问：https://little-days-care.huangyimin0926.chatgpt.site

## 本地运行

这是无后端、无数据库的静态网站。构建只需要 Node.js 18 或更新版本，不需要安装 npm 依赖。

```sh
node src/build.cjs
python3 -m http.server 8080 --directory dist
```

访问 `http://localhost:8080`。也可以把 `dist/` 部署到普通静态网站服务；不需要配置登录或 API 密钥。`.openai/hosting.json` 记录现有 Sites 项目，复制部署到自己的 Sites 时不要复用其中的项目 ID。

## 文件结构

- `src/template.html`、`src/style.css`：页面结构与样式。
- `src/app.js`、`src/content.js`：交互和照护内容。
- `src/legacy-care.json`、`src/medical.html`：分龄参考与就医提示。
- `src/video-catalog.json`、`src/asset-credits.json`：视频来源、图片出处、核验和使用条件。
- `src/clip-catalog.json`：本站中文图解短片的规格和来源记录。
- `src/build.cjs`：可重复运行的静态构建脚本。
- `dist/index.html`：可发布的构建产物，内含图片和文字，支持图文离线保存。
- `dist/media/`：构建所用的原始图片资产，必须随仓库保留。
- `dist/media/clips/`：四段本站中文图解 MP4、海报和 VTT 字幕，直接由本站提供。
- `scripts/generate-clips.cjs`：图解生成脚本。仅重新制作图解时需要 Playwright、Chromium、FFmpeg、FFprobe 和 Noto Sans CJK 字体；普通网页构建使用已提交的成品，不需要这些工具。

修改 `src/` 后重新构建，并一起提交 `src/` 和 `dist/`。仓库不包含私有凭据、用户数据或运行时会话文件。

## 内容与适用范围

本项目是一般健康足月儿的家庭照护参考，不能替代医疗评估。早产、低出生体重、有基础疾病、明显黄疸、生长或喂养困难的宝宝应按个体医嘱照护。网页中的数值有明确年龄和喂养方式条件，不能只截取数字使用。

依据以香港卫生署、NHS、CDC、AAP 等公开资料为主，具体出处见各卡片和来源列表。资料核对日期为 2026-10-04。角色代理的实际操作试用用于改善可用性，不等于真实用户研究或临床审核。

## 图片、视频与版权

详见 [THIRD_PARTY.md](THIRD_PARTY.md)。公开源码不意味着仓库内全部内容可任意商用。香港卫生署图片按其注明来源的非商业转载条件使用；第三方视频保留官方入口，不属于本项目拥有的素材。没有给整个仓库授予统一的开源许可证。

四段默认播放内容是本站制作的照片／步骤图解，含中文字、没有配音，不是连续真人动作录像。它们通过原生 HTML 视频播放器播放，不依赖 YouTube。原官方真人视频保留为可选来源，其可用性受提供方和使用地区网络影响。

“保存”下载的 HTML 包含图文，视频需要网络；每个视频弹窗另外提供 MP4 下载，可单独保存观看。
