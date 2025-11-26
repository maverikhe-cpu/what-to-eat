# 🔧 API 调用失败排查指南

如果重新部署后 API 调用失败，请按照以下步骤排查：

## 📋 快速检查清单

### 1. 检查环境变量配置

**最重要**：确保在部署平台（Vercel/Netlify）中配置了正确的环境变量，且**不使用 VITE_ 前缀**。

#### Vercel 环境变量配置
1. 登录 Vercel 控制台
2. 选择你的项目
3. 进入 **Settings** > **Environment Variables**
4. 添加以下变量（注意：**不要**使用 `VITE_` 前缀）：

```env
TEXT_GENERATION_BASE_URL=https://api.302ai.cn/v1/
TEXT_GENERATION_API_KEY=your_api_key_here
TEXT_GENERATION_MODEL=doubao-1.5-pro-32k

IMAGE_GENERATION_BASE_URL=https://open.bigmodel.cn/api/paas/v4/images/generations
IMAGE_GENERATION_API_KEY=your_api_key_here
IMAGE_GENERATION_MODEL=cogview-3-flash
```

#### Netlify 环境变量配置
1. 登录 Netlify 控制台
2. 选择你的站点
3. 进入 **Site settings** > **Environment variables**
4. 添加相同的变量（**不要**使用 `VITE_` 前缀）

### 2. 验证环境变量

访问健康检查端点来验证配置：

```
https://your-site.vercel.app/api/health
或
https://your-site.netlify.app/api/health
```

应该返回类似以下的内容：

```json
{
  "status": "ok",
  "config": {
    "hasTextApiKey": true,
    "hasTextBaseUrl": true,
    "hasImageApiKey": true,
    "hasImageBaseUrl": true,
    ...
  }
}
```

如果看到 `hasTextApiKey: false` 或 `hasTextBaseUrl: false`，说明环境变量没有正确配置。

### 3. 检查浏览器控制台

打开浏览器开发者工具（F12），查看：

1. **Console 标签**：查看是否有错误信息
2. **Network 标签**：查看 API 请求
   - 请求应该发送到 `/api/chat` 或 `/api/images`
   - 检查响应状态码和错误信息

### 4. 常见错误及解决方案

#### 错误 1: "Server configuration error: API credentials not found"

**原因**：环境变量未配置或配置错误

**解决方案**：
- 检查环境变量名称是否正确（**不要**使用 `VITE_` 前缀）
- 确认环境变量已保存
- 重新部署项目（环境变量更改后需要重新部署）

#### 错误 2: "Network Error" 或 "ERR_NETWORK"

**原因**：代理 API 端点无法访问

**解决方案**：
- 检查 Serverless Functions 是否已部署
- 对于 Vercel：检查 `api/` 目录下的文件是否正确
- 对于 Netlify：检查 `netlify/functions/` 目录下的文件是否正确
- 查看部署日志，确认函数构建成功

#### 错误 3: 404 Not Found

**原因**：代理端点路由配置错误

**解决方案**：
- Vercel：检查 `vercel.json` 中的路由配置
- Netlify：检查 `netlify.toml` 中的配置
- 确认函数文件在正确的位置

#### 错误 4: CORS 错误

**原因**：跨域请求被阻止

**解决方案**：
- 检查代理函数中的 CORS 头设置
- 确认已处理 OPTIONS 预检请求

## 🔍 详细诊断步骤

### 步骤 1: 检查部署日志

#### Vercel
1. 进入项目 Dashboard
2. 查看最新的部署
3. 检查构建日志，确认：
   - TypeScript 编译成功
   - 没有错误信息
   - Serverless Functions 已构建

#### Netlify
1. 进入站点 Dashboard
2. 查看 **Deploys** 标签
3. 点击最新的部署，查看构建日志

### 步骤 2: 测试代理端点

使用 curl 或 Postman 测试代理端点：

```bash
# 测试文本生成代理
curl -X POST https://your-site.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "test",
    "messages": [{"role": "user", "content": "test"}]
  }'
```

如果返回 500 错误，检查错误信息中的提示。

### 步骤 3: 检查函数日志

#### Vercel
1. 进入项目 Dashboard
2. 选择 **Functions** 标签
3. 查看函数执行日志
4. 查找错误信息

#### Netlify
1. 进入站点 Dashboard
2. 选择 **Functions** 标签
3. 查看函数日志

### 步骤 4: 验证 API 密钥

确保 API 密钥：
- ✅ 格式正确（没有多余的空格）
- ✅ 未过期
- ✅ 有足够的额度
- ✅ 权限正确

## 🛠️ 修复步骤

### 如果环境变量配置错误

1. **删除旧的环境变量**（如果使用了 `VITE_` 前缀）
2. **添加新的环境变量**（不带 `VITE_` 前缀）
3. **重新部署项目**

### 如果代理函数有问题

1. **检查函数文件**：
   - Vercel: `api/chat.ts`, `api/images.ts`
   - Netlify: `netlify/functions/chat.ts`, `netlify/functions/images.ts`

2. **确认函数导出正确**：
   - Vercel: `export default async function handler(...)`
   - Netlify: `export const handler: Handler = async (...)`

3. **检查依赖**：
   ```bash
   npm install @vercel/node  # Vercel
   npm install @netlify/functions  # Netlify
   ```

### 如果前端代码有问题

1. **清除浏览器缓存**
2. **硬刷新页面**（Ctrl+Shift+R 或 Cmd+Shift+R）
3. **检查网络请求**：
   - 应该发送到 `/api/chat` 和 `/api/images`
   - 不应该包含 `Authorization` 头

## 📞 获取帮助

如果以上步骤都无法解决问题：

1. **收集信息**：
   - 浏览器控制台的错误信息
   - 网络请求的详细信息
   - 部署日志
   - 健康检查端点的响应

2. **检查项目 Issues**：查看是否有类似问题

3. **提交新 Issue**：提供详细的错误信息和诊断结果

## ✅ 验证修复

修复后，验证以下内容：

- [ ] 健康检查端点返回 `status: "ok"`
- [ ] 浏览器控制台没有错误
- [ ] 网络请求成功（状态码 200）
- [ ] 可以正常生成菜谱和图片
- [ ] 设置页面显示安全提示（不再显示 API 密钥输入框）

---

**最后更新**：2024年

