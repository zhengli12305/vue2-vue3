# HappyFri Quiz

HappyFri 是一个支持上传 Word/PDF/Excel 题库并在线答题的项目，前端使用 Vue3 + TypeScript，后端使用 FastAPI。

## 技术栈

- 前端：Vue3、TypeScript、Vite、Pinia、Vue Router、Axios
- 后端：FastAPI、python-docx、pdfplumber、openpyxl
- 桌面端：Electron（可选）

## 本地开发

### 1) 安装前端依赖

```sh
npm install
```

### 2) 配置环境变量

复制 `.env.example` 为 `.env.local`，按需修改：

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_PUBLIC_BASE=/
```

### 3) 启动后端

```sh
pip install -r backend/requirements.txt
python backend/run_desktop.py
```

### 4) 启动前端

```sh
npm run dev
```

## 生产构建

```sh
npm run build
```

构建产物输出在 `dist/` 目录。

## 部署说明（前后端分离）

- 前端可部署到 Vercel / Netlify / GitHub Pages（静态托管）
- 后端需单独部署（如 Render / Railway / Fly.io）
- 前端通过 `VITE_API_BASE_URL` 指向后端服务地址

### GitHub Pages 示例

如果仓库名是 `happyfri-vue3`，可在 `.env.production` 设置：

```env
VITE_PUBLIC_BASE=/happyfri-vue3/
VITE_API_BASE_URL=https://your-backend-domain.com
```

然后执行：

```sh
npm run build
```

将 `dist/` 发布到 Pages。

## 已知注意事项

- `.doc` 解析依赖 LibreOffice（`soffice`），建议优先使用 `.docx`
- 前端静态站点无法直接提供解析能力，必须有可访问的后端 API
