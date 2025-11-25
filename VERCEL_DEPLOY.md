# 🚀 Vercel 部署指南

## 快速部署步骤

### 1. 确保代码已推送到 GitHub

你的项目已连接到 GitHub: `https://github.com/maverikhe-cpu/what-to-eat.git`

如果本地有未提交的更改，请先提交并推送：

```bash
# 检查状态
git status

# 如果有更改，提交并推送
git add .
git commit -m "准备部署到 Vercel"
git push origin master
```

### 2. 登录 Vercel

1. 访问 [Vercel 官网](https://vercel.com)
2. 点击右上角 **"Sign Up"** 或 **"Log In"**
3. 选择 **"Continue with GitHub"** 使用 GitHub 账号登录

### 3. 导入项目

1. 登录后，点击 **"Add New..."** > **"Project"**
2. 在 **"Import Git Repository"** 中，找到并选择 `maverikhe-cpu/what-to-eat`
3. 如果看不到项目，点击 **"Adjust GitHub App Permissions"** 授权访问仓库

### 4. 配置项目设置

Vercel 会自动检测到项目配置（已在 `vercel.json` 中配置），但需要确认：

- **Framework Preset**: Vite（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `npm run build`（自动检测）
- **Output Directory**: `dist`（自动检测）
- **Install Command**: `npm install`（自动检测）

### 5. 配置环境变量 ⚠️ 重要

在部署前，必须配置以下环境变量：

> 📖 **详细 API 获取指南**：请查看 [API_GUIDE.md](./API_GUIDE.md) 了解如何获取 API 密钥和推荐的服务商

点击 **"Environment Variables"** 添加以下变量：

```env
VITE_TEXT_GENERATION_BASE_URL=https://api.302ai.cn/v1/
VITE_TEXT_GENERATION_API_KEY=你的文本生成API密钥
VITE_TEXT_GENERATION_MODEL=doubao-1.5-pro-32k
VITE_IMAGE_GENERATION_BASE_URL=https://open.bigmodel.cn/api/paas/v4/images/generations
VITE_IMAGE_GENERATION_API_KEY=你的图片生成API密钥
VITE_IMAGE_GENERATION_MODEL=cogview-3-flash
```

**推荐配置**（高性价比）：
- **文本生成**：302.AI + 豆包 Pro（`doubao-1.5-pro-32k`）
- **图片生成**：智谱 AI（`cogview-3-flash`）

**添加步骤**：
1. 点击 **"Add"** 按钮
2. 输入变量名（如 `VITE_TEXT_GENERATION_BASE_URL`）
3. 输入变量值
4. 选择环境（Production, Preview, Development 都选上）
5. 点击 **"Save"**
6. 重复以上步骤添加所有 6 个环境变量

### 6. 部署

1. 确认所有环境变量已添加
2. 点击 **"Deploy"** 按钮
3. 等待构建完成（通常需要 1-3 分钟）

### 7. 访问你的应用

部署成功后，Vercel 会提供：
- **生产环境 URL**: `https://your-project-name.vercel.app`
- **部署状态**: 可以在 Dashboard 查看

## 🔄 自动部署

配置完成后，Vercel 会自动：
- **主分支推送** → 自动部署到生产环境
- **其他分支推送** → 创建预览部署
- **Pull Request** → 自动创建预览部署

## 🛠️ 后续管理

### 查看部署日志
1. 在 Vercel Dashboard 选择项目
2. 点击 **"Deployments"** 标签
3. 选择任意部署查看详细日志

### 更新环境变量
1. 进入项目设置
2. 点击 **"Environment Variables"**
3. 修改或添加变量
4. 重新部署生效

### 自定义域名
1. 进入项目设置
2. 点击 **"Domains"**
3. 添加你的域名
4. 按照提示配置 DNS 记录

## 🚨 常见问题

### 构建失败
- 检查环境变量是否全部配置
- 查看构建日志中的错误信息
- 确认 Node.js 版本（项目需要 18+）

### API 调用失败
- 检查环境变量中的 API 密钥是否正确
- 确认 API 端点地址是否正确
- 检查 API 服务是否可用

### 页面 404
- Vercel 已配置 SPA 路由重定向（在 `vercel.json` 中）
- 如果仍有问题，检查路由配置

## 📞 需要帮助？

- [Vercel 官方文档](https://vercel.com/docs)
- [项目 Issues](https://github.com/maverikhe-cpu/what-to-eat/issues)

