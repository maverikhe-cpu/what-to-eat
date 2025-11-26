# 🔧 Vercel Serverless Functions 修复指南

## 问题诊断

测试发现 Serverless Functions 返回 `FUNCTION_INVOCATION_FAILED` 错误（500）。

## 已实施的修复

### 1. 依赖配置修复

**问题**：`@vercel/node` 在 `devDependencies` 中，但 Vercel 运行时需要它在 `dependencies` 中。

**修复**：已将 `@vercel/node` 移到 `dependencies`。

### 2. Vercel 配置

**添加了 `functions` 配置**到 `vercel.json`：

```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  }
}
```

这明确告诉 Vercel 如何处理 `api/` 目录下的 TypeScript 文件。

### 3. 错误处理改进

在所有 Serverless Functions 中添加了 try-catch 错误处理，提供更详细的错误信息。

## 验证步骤

### 1. 等待重新部署

Vercel 会自动检测到新的提交并重新部署。在 Vercel Dashboard 中查看部署状态。

### 2. 测试健康检查端点

```bash
curl https://what-to-eat-2025.vercel.app/api/health
```

**预期结果**：
```json
{
  "status": "ok",
  "message": "API proxy health check",
  "config": {
    "hasTextApiKey": true/false,
    "hasTextBaseUrl": true/false,
    ...
  }
}
```

### 3. 检查 Vercel 函数日志

如果仍然失败：

1. 登录 Vercel Dashboard
2. 进入项目 > Functions 标签
3. 查看函数执行日志
4. 查找错误堆栈信息

## 常见问题排查

### 问题 1: 仍然返回 500 错误

**可能原因**：
- 环境变量未配置
- TypeScript 编译错误
- 运行时错误

**解决方案**：
1. 检查 Vercel 函数日志
2. 确认环境变量已配置（不使用 `VITE_` 前缀）
3. 检查代码语法错误

### 问题 2: 函数未找到（404）

**可能原因**：
- 文件路径不正确
- 文件命名不正确

**解决方案**：
- 确认文件在 `api/` 目录下
- 确认文件扩展名是 `.ts`
- 确认导出格式正确：`export default async function handler(...)`

### 问题 3: 依赖错误

**可能原因**：
- `@vercel/node` 未正确安装
- 其他依赖缺失

**解决方案**：
```bash
npm install
# 确保 @vercel/node 在 dependencies 中
```

## 正确的文件结构

```
project/
├── api/
│   ├── chat.ts          ✅ Serverless Function
│   ├── images.ts        ✅ Serverless Function
│   └── health.ts         ✅ Serverless Function
├── src/                 (前端代码)
├── package.json         (包含 @vercel/node 在 dependencies)
└── vercel.json          (包含 functions 配置)
```

## 环境变量配置

在 Vercel 项目设置中配置（**不使用 VITE_ 前缀**）：

```env
TEXT_GENERATION_BASE_URL=https://api.302ai.cn/v1/
TEXT_GENERATION_API_KEY=your_key_here
TEXT_GENERATION_MODEL=doubao-1.5-pro-32k

IMAGE_GENERATION_BASE_URL=https://open.bigmodel.cn/api/paas/v4/images/generations
IMAGE_GENERATION_API_KEY=your_key_here
IMAGE_GENERATION_MODEL=cogview-3-flash
```

## 测试命令

部署完成后，运行测试：

```bash
TEST_BASE_URL=https://what-to-eat-2025.vercel.app TEST_DEPLOYED=true npm run test
```

## 预期结果

修复后，所有端点应该正常工作：

- ✅ `GET /api/health` - 返回 JSON 配置信息（200）
- ✅ `POST /api/chat` - 代理文本生成 API
- ✅ `POST /api/images` - 代理图片生成 API
- ✅ `GET /api/chat` - 返回 405 Method Not Allowed
- ✅ `OPTIONS /api/chat` - 返回 CORS 预检响应

---

**最后更新**: 2024年

