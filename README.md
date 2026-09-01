# Vue Astro

基于 [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/) 的占星与命理演示项目，对接 [ApiWorks 星盘 API](https://www.apiworks.com)，实现星座、运势、星盘、紫微斗数、星宿、八字、奇门遁甲、六壬、七政四余等功能的展示与查询。

## 功能概览

| 模块 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | 入口与导航 |
| 星座 | `/sign` | 星座列表、星座配对、我的星座 |
| 运势 | `/scope` | 日/周/月/年运势 |
| 星盘 | `/chart` | 单盘（本命、行运、月返、日返、三限、次限等）、合盘（比较盘、组合盘、马克盘等） |
| 紫微 | `/ziwei` | 紫微斗数本命盘与完整运限盘 |
| 星宿 | `/star` | 本命/值日星宿及关系分析 |
| 生辰 | `/bazi` | 八字本命、大运流年、合盘匹配 |
| 奇门 | `/qimen` | 奇门遁甲排盘（时家 / 日家 / 山向） |
| 六壬 | `/liuren` | 大六壬、金口诀排盘 |
| 政余 | `/qizheng` | 七政四余本命圆盘与行运；命度/垣殿/喜忌格解读 |

### 奇门遁甲（`/qimen`）

- **时家奇门**：拆补、置闰、茅山、阴盘等定局法；支持转盘与飞盘，飞盘可选默认、鸣法、括囊、法窍、阴盘等子流派
- **日家奇门**：金函、传统定局；日家金函盘支持黄黑道展示
- **山向奇门**：按年份与二十四山（含上 / 中 / 下三元）起局
- 支持经度、真太阳时、时区；排盘结果含局信息、九宫格与宫位详情

### 六壬（`/liuren`）

- **大六壬**：天贵 / 地贵贵人起法，天地盘四课三传展示
- **金口诀**：十二地分可选
- 支持经度、真太阳时、时区；盘局支持点击交互查看课传与宫位详情

### 政余（`/qizheng`）

- **本命**：`POST /qizheng/natal`，圆盘（地支 / 十二宫 / 十一曜 / 二十八宿量天尺）+ 十一曜表 + 命度解读
- **行运**：`POST /qizheng/chart`，叠加流十一曜、当前诸限与按岁限表
- 请求体对齐后端 `QizhengNatalQry` / `QizhengQry`：`birth_dt`、`gender`、`lang`、`is_solar_time`、`is_late_zi`、经纬度；行运可传 `target_dt`
- 本命 / 行运均只读后端接口；无数据或请求失败时显示错误，不再使用本地演示盘

## 技术栈

- **Vue 3**（Composition API）
- **Vue Router 4**
- **Vue I18n 9**（简体中文 / 繁体中文 / 英文）
- **Axios**（API 请求）
- **Vite 6**（构建与开发）

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装与运行

```bash
# 克隆仓库
git clone <your-repo-url>
cd vue-astro

# 安装依赖
npm install

# 开发
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

### 环境变量

`npm run dev` 使用 `--mode dev`，会读取根目录 `.env.dev`（同名变量会覆盖 `.env`）。构建仍走 `.env.production` / `.env`。

| 变量名 | 说明 |

| 变量名 | 说明 |
|--------|------|
| `VITE_API_BASE_URL` | 接口基础地址，指向你的 ApiWorks 星盘 API 地址 |
| `VITE_APP_ID` | 应用 ID（鉴权请求头 `X-App-Id`） |
| `VITE_APP_KEY` | 应用 Key（鉴权请求头 `X-App-Key`） |

请前往 [apiworks.com](https://www.apiworks.com) 申请测试或正式证书 Key，配置后即可正常调用接口。

可参考根目录 `.env.example` 填写默认 API 地址。

## 项目结构（简要）

```
src/
├── App.vue              # 根布局、导航、页脚
├── main.js              # 入口，挂载 Vue / Router / i18n
├── router/index.js      # 路由配置
├── i18n/                # 多语言（zh-CN、zh-TW、en-US）
├── assets/              # 全局样式、星宿图标、奇门主题样式
├── components/          # 公共组件
│   ├── ZiweiPalaceCell.vue, StarMansionChart.vue, AppLangSelector.vue
│   ├── qimen/           # 奇门九宫格、宫位详情、黄黑道等
│   ├── liuren/          # 六壬天地盘、课传、详情面板
│   └── qizheng/         # 政余圆盘、十一曜表、解读
├── composables/         # 组合式逻辑（useBazi、useZiweiI18n、useQimen、useLiuren 等）
├── services/            # API 封装
│   ├── api.js           # Axios 客户端与鉴权
│   ├── sign.js, scope.js, chart.js, ziwei.js, bazi.js, naks.js
│   ├── qimen.js         # 奇门请求体与山向、定局法配置
│   ├── liuren.js        # 六壬请求体与术式选项
│   └── qizheng.js       # 七政四余本命 / 行运
├── views/               # 页面
│   ├── Home.vue
│   ├── Sign.vue, Scope.vue, Ziwei.vue, Star.vue
│   ├── qimen/index.vue  # 奇门遁甲
│   ├── liuren/index.vue # 六壬
│   ├── qizheng/index.vue # 政余（七政四余）
│   ├── bazi/            # 八字相关页
│   └── chart/           # 星盘相关页
├── styles/              # 紫微盘等样式
└── utils/               # 语言、星盘展示等工具
```

## 开源与致谢

本项目为开源演示，数据与接口能力由 [ApiWorks](https://www.apiworks.com) 提供。

## License

[MIT](LICENSE)
