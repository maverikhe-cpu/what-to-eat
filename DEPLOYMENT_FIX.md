# 🔧 部署问题修复指南

## 问题诊断

测试发现 `/api/*` 路由被 SPA 路由捕获，返回 HTML 而不是 Serverless Function 响应。

## 原因

Vercel 的 `rewrites` 配置中，SPA 路由 `/(.*)` 会捕获所有请求，包括 `/api/*`。

## 解决方案

### ✅ 已修复

已更新 `vercel.json`，移除了不必要的 `/api/(.*)` rewrite 规则。

**Vercel 会自动识别 `api/` 目录下的 Serverless Functions**，不需要额外的 rewrite 规则。

### 验证步骤

1. **重新部署项目**：
   ```bash
   git add vercel.json
   git commit -m "fix: 修复 API 路由配置"
   git push
   ```

2. **等待部署完成**，然后测试：
   ```bash
   # 测试健康检查端点
   curl https://what-to-eat-2025.vercel.app/api/health
   
   # 应该返回 JSON，而不是 HTML
   ```

3. **运行 Playwright 测试**：
   ```bash
   TEST_BASE_URL=https://what-to-eat-2025.vercel.app TEST_DEPLOYED=true npm run test
   ```

## 正确的 Vercel 配置

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**注意**：
- ✅ Vercel 会自动识别 `api/` 目录下的 TypeScript/JavaScript 文件作为 Serverless Functions
- ✅ `/api/*` 请求会自动路由到对应的 Serverless Function
- ❌ 不需要为 `/api/*` 添加 rewrite 规则
- ❌ SPA 路由 `/(.*)` 不会覆盖 `/api/*` 路由（Vercel 的 Serverless Functions 优先级更高）

## 如果问题仍然存在

1. **检查文件结构**：
   ```
   api/
     ├── chat.ts
     ├── images.ts
     └── health.ts
   ```

2. **检查 Vercel 部署日志**：
   - 登录 Vercel Dashboard
   - 查看最新的部署
   - 检查是否有构建错误

3. **验证环境变量**：
   - 在 Vercel 项目设置中检查环境变量
   - 确认环境变量名称正确（**不使用 VITE_ 前缀**）

4. **清除缓存并重新部署**：
   - 在 Vercel Dashboard 中选择 "Redeploy"
   - 或使用 CLI: `vercel --prod`

## 预期结果

修复后，以下端点应该正常工作：

- ✅ `GET /api/health` - 返回 JSON 配置信息
- ✅ `POST /api/chat` - 代理文本生成 API
- ✅ `POST /api/images` - 代理图片生成 API
- ✅ `GET /api/chat` - 返回 405 Method Not Allowed
- ✅ `OPTIONS /api/chat` - 返回 CORS 预检响应

---

**最后更新**: 2024年

