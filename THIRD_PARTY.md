# 第三方资料与使用条件

## 香港卫生署家庭健康服务照片

图片版权属于香港特别行政区政府卫生署家庭健康服务。本项目以非商业照护科普用途引用，完整呈现并署名；没有生成或重绘图片中的人物及照护动作。

使用条款：https://www.fhs.gov.hk/sc_chi/notice/notice.html

官方条款允许注明卫生署来源的非商业复制和分发；商业使用需事先取得书面授权。该许可不自动扩大为任何开源许可证。下游使用者应遵守原权利人的条件。

| 仓库文件 | 来源 | 位置 |
| --- | --- | --- |
| `dist/media/attachment.png` | https://www.fhs.gov.hk/english/health_info/child/20000.pdf | PDF 第59页／印刷页55，含接照片 |
| `dist/media/bottle-hold.png` | https://www.fhs.gov.hk/english/health_info/child/12146.pdf | PDF 第18页／印刷页17，完整瓶喂抱姿 |
| `dist/media/bottle.png` | 同上 | PDF 第18页／印刷页17，奶瓶角度 |
| `dist/media/burping.png` | 同上 | PDF 第20页／印刷页19，坐姿拍嗝 |

图片也以数据形式嵌入生成的 `dist/index.html`，适用相同条件。详细出处、原图说明和替代文本见 `src/asset-credits.json`。

## 外部视频

香港卫生署、NHS、香港政府新闻处的官方视频及其音轨、人物画面属于各自权利人。官方页面和播放器链接见 `src/video-catalog.json` 及页面内来源链接。链接或播放器可访问不等于允许下载重传；本仓库不重新上传这些第三方视频。

NHS 使用条款：https://www.nhs.uk/our-policies/terms-and-conditions/

香港政府新闻处告示：https://www.isd.gov.hk/chi/notices.htm

## 本站中文图解短片

`dist/media/clips/` 中的四段 MP4 由本站把获准使用的原照片与中文步骤编排生成，没有配音，不是下载重传的第三方真人录像。照片完整呈现；每段片内保留署名和图解性质说明。换尿布短片使用本站绘制的几何图标。视频、海报中出现的 FHS 照片仍受上面的非商业转载条件约束。

字幕、步骤参考的官方来源见 `src/clip-catalog.json` 和 `src/video-catalog.json`；原机构没有制作或审核本站图解。生成脚本见 `scripts/generate-clips.cjs`。

## 医疗资料和本站内容

资料来源列在网页对应内容处；本项目的中文整理不代表来源机构审核或背书。第三方资料和照片不属于本站原创代码，其原始使用条件持续适用。

仓库公开可见不等于已授予统一的开源许可；如需商业复用或再发布，请分别确认所用代码、文字和素材的权利。
