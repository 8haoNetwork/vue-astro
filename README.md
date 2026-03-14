# Vue Astro

基于 [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/) 的占星与命理演示项目，对接 [ApiWorks 星盘 API](https://astro.apiworks.com)，实现星座、运势、星盘、紫微斗数、星宿、八字等功能的展示与查询。

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

## 技术栈

- **Vue 3**（Composition API）
- **Vue Router 4**
- **Vue I18n 9**（中/英）
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

在项目根目录创建 `.env`（或 `.env.local`），按需配置：

| 变量名 | 说明 |
|--------|------|
| `VITE_API_BASE_URL` | 接口基础地址，指向你的 ApiWorks 星盘 API 地址 |
| `VITE_APP_ID` | 应用 ID（鉴权请求头 X-App-Id） |
| `VITE_APP_KEY` | 应用 Key（鉴权请求头 X-App-Key） |

请前往 [apiworks.com](https://astro.apiworks.com) 申请测试或正式证书 Key，配置后即可正常调用接口。

## 项目结构（简要）

```
src/
├── App.vue              # 根布局、导航、页脚
├── main.js               # 入口，挂载 Vue / Router / i18n
├── router/index.js       # 路由配置
├── i18n/                 # 多语言（zh-CN、en-US）
├── assets/               # 全局样式、图表样式
├── components/           # 公共组件（如 ZiweiPalaceCell、StarMansionChart）
├── composables/          # 组合式逻辑（useBazi、useZiweiI18n）
├── services/             # API 封装（api、sign、scope、chart、ziwei、bazi）
├── views/                # 页面
│   ├── Home.vue
│   ├── Sign.vue, Scope.vue, Ziwei.vue, Star.vue
│   ├── bazi/             # 八字相关页
│   └── chart/            # 星盘相关页
└── styles/               # 紫微盘等样式
```

## 开源与致谢

本项目为开源演示，数据与接口能力由 [ApiWorks](https://astro.apiworks.com) 提供。

## License

[MIT](LICENSE)
