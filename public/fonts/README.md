# 星盘字体（同源加载，避免 CORS）

将以下文件放入此目录即可：

- `ixingpan.woff`
- `ixingpancn.woff`

前端会从 `/fonts/` 加载，与页面同源，不会触发跨域。  
若需使用其他地址，可在 `.env` 中设置 `VITE_ASTRO_FONTS_URL`。
