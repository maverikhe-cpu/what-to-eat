# Playwright 测试说明

## 运行测试

### 本地开发环境测试

```bash
# 运行所有测试（会自动启动开发服务器）
npm run test

# 使用 UI 模式运行测试
npm run test:ui

# 使用有头模式运行测试
npm run test:headed
```

### 部署环境测试

要测试实际的 Serverless Functions，需要：

1. **使用 Vercel CLI**（推荐）：
   ```bash
   npm install -g vercel
   vercel dev
   # 然后在另一个终端运行测试
   TEST_BASE_URL=http://localhost:3000 TEST_DEPLOYED=true npm run test
   ```

2. **测试已部署的站点**：
   ```bash
   TEST_BASE_URL=https://your-site.vercel.app TEST_DEPLOYED=true npm run test
   ```

## 测试内容

### API 代理测试

- ✅ 健康检查端点
- ✅ 文本生成代理
- ✅ 图片生成代理
- ✅ CORS 预检请求
- ✅ 方法限制（只允许 POST）

### 前端测试

- ✅ 页面加载
- ✅ 网络请求检查
- ✅ 设置页面安全检查

## 注意事项

⚠️ **重要**：在本地开发环境中，Vite 开发服务器不会运行 Serverless Functions，因此部分 API 测试会被跳过。

要完整测试 API 代理功能，请：
1. 使用 `vercel dev` 启动本地开发服务器
2. 或在已部署的环境中运行测试

## 测试结果解读

- ✅ **通过**：功能正常
- ⚠️ **跳过**：在本地环境中无法测试（需要 Serverless Functions）
- ❌ **失败**：发现问题，需要修复

