# LUMEN — Personal Web (Next.js + Vercel)

个人作品集网站（LUMEN — Archive of Spatial Light），基于 Next.js App Router，
可直接部署到 Vercel。

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

## Useful Commands

- `npm run dev`: start local development (http://localhost:3000)
- `npm run build`: production build
- `npm run start`: serve the production build locally
- `npm run lint`: run ESLint

## Optimizing Images

`public/` 里的图片必须保持压缩后再提交，否则 Vercel 首屏会因体积过大而出现
背景图与动画不同步、Featured Works 空白等问题。替换新图后运行（需要临时安装 sharp）：

```bash
npm i --no-save sharp && node scripts/optimize-images.mjs
```

脚本会读取 `public/` 中的 png/jpg，按 2000px（png）/1600px（jpg）上限重采样压缩，
输出到 `public-optimized/`，再整体替换 `public/` 即可。`profit/` 目录会被跳过。

同时记得在 `app/globals.css` 与 `app/page.tsx` 中把资源版本号（`?v=…`）递增，
避免访客与 CDN 命中旧的缓存。

## Deploy to Vercel

零配置接入 Vercel，无需 `vercel.json`：

```bash
npx vercel
```

或在 [vercel.com](https://vercel.com) 上导入本仓库，Vercel 会自动识别
Next.js 框架预设并完成构建。

## Project Structure

- `app/` — App Router 页面与全局样式
- `public/` — 静态资源（图片、音乐等）
