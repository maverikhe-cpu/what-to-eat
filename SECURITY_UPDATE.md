# 🔒 安全更新说明

## 更新内容

项目已实施**服务器端 API 代理**方案，将 API 密钥从前端代码中移除，大幅提升安全性。

## 🛡️ 安全改进

### 之前的问题
- ❌ API 密钥通过 `VITE_` 环境变量暴露在前端代码中
- ❌ 用户可以在浏览器开发者工具中查看 API 密钥
- ❌ API 密钥被打包到 JavaScript 文件中，任何人都可以提取

### 现在的解决方案
- ✅ API 密钥仅存储在服务器端环境变量中
- ✅ 前端代码不再包含 API 密钥
- ✅ 所有 AI API 请求通过服务器端代理转发
- ✅ 用户无法在前端查看或修改 API 密钥

## 📋 迁移指南

### 对于新部署

1. **配置服务器端环境变量**（在 Vercel/Netlify 项目设置中）：
   ```env
   TEXT_GENERATION_BASE_URL=https://api.302ai.cn/v1/
   TEXT_GENERATION_API_KEY=your_api_key_here
   TEXT_GENERATION_MODEL=doubao-1.5-pro-32k
   
   IMAGE_GENERATION_BASE_URL=https://open.bigmodel.cn/api/paas/v4/images/generations
   IMAGE_GENERATION_API_KEY=your_api_key_here
   IMAGE_GENERATION_MODEL=cogview-3-flash
   ```
   
   ⚠️ **重要**：环境变量名称**不再使用 `VITE_` 前缀**

2. **部署项目**：正常部署即可，系统会自动使用代理 API

### 对于现有部署

1. **更新环境变量**：
   - 在 Vercel/Netlify 项目设置中，将现有的 `VITE_*` 环境变量重命名为不带 `VITE_` 前缀的版本
   - 例如：`VITE_TEXT_GENERATION_API_KEY` → `TEXT_GENERATION_API_KEY`

2. **重新部署**：推送代码更新或手动触发重新部署

3. **验证**：
   - 检查浏览器开发者工具中的网络请求
   - 确认请求发送到 `/api/chat` 和 `/api/images`
   - 确认请求头中不再包含 `Authorization` 字段

## 🏗️ 技术实现

### 服务器端代理

项目现在包含以下 Serverless Functions：

- **Vercel**：
  - `api/chat.ts` - 文本生成 API 代理
  - `api/images.ts` - 图片生成 API 代理

- **Netlify**：
  - `netlify/functions/chat.ts` - 文本生成 API 代理
  - `netlify/functions/images.ts` - 图片生成 API 代理

### 前端改动

- `src/services/aiService.ts` - 改为调用 `/api/chat` 代理
- `src/services/imageService.ts` - 改为调用 `/api/images` 代理
- `src/components/SettingsModal.vue` - 移除 API 密钥输入框

## 🔍 验证安全

### 检查清单

- [ ] 环境变量已更新为服务器端变量（无 `VITE_` 前缀）
- [ ] 浏览器开发者工具中看不到 API 密钥
- [ ] 网络请求发送到代理端点（`/api/chat`、`/api/images`）
- [ ] 请求头中不包含 `Authorization` 字段
- [ ] 设置页面不再显示 API 密钥输入框

### 测试步骤

1. 打开浏览器开发者工具（F12）
2. 切换到 Network（网络）标签
3. 使用应用生成菜谱或图片
4. 检查请求：
   - URL 应该是 `/api/chat` 或 `/api/images`
   - 请求头中不应该有 `Authorization: Bearer ...`
5. 检查源代码：
   - 搜索打包后的 JavaScript 文件
   - 确认找不到 API 密钥

## 📚 相关文档

- [部署指南](./DEPLOYMENT.md) - 详细的部署和环境变量配置说明
- [API 获取指南](./API_GUIDE.md) - 如何获取 API 密钥

## ❓ 常见问题

### Q: 本地开发怎么办？

A: 本地开发时，你可以：
1. 使用 Vercel CLI：`npm i -g vercel && vercel dev`（推荐）
2. 配置本地代理服务器
3. 临时使用前端环境变量（仅用于开发，不要提交到代码库）

### Q: 代理会影响性能吗？

A: 影响很小。Serverless Functions 通常有很低的延迟，而且可以：
- 缓存响应
- 批量处理请求
- 添加速率限制

### Q: 如果代理失败怎么办？

A: 代理函数包含错误处理，会返回友好的错误信息。如果遇到问题：
1. 检查服务器端环境变量配置
2. 查看 Serverless Functions 日志
3. 确认 API 密钥有效

## 🎉 总结

通过实施服务器端代理，我们：
- ✅ 消除了 API 密钥泄露的风险
- ✅ 提升了应用的整体安全性
- ✅ 为未来添加速率限制、缓存等功能奠定了基础

---

**更新日期**：2024年
**版本**：2.0.0

