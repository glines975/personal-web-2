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
