# 🔑 API 密钥获取指南

本项目需要两个 API 服务：**文本生成 API**（生成菜谱）和 **图片生成 API**（生成菜品图片）。

## 📋 需要的环境变量

```env
# 文本生成 API（必需）
VITE_TEXT_GENERATION_BASE_URL=https://api.example.com/v1/
VITE_TEXT_GENERATION_API_KEY=your_api_key_here
VITE_TEXT_GENERATION_MODEL=model-name

# 图片生成 API（必需）
VITE_IMAGE_GENERATION_BASE_URL=https://api.example.com/v4/images/generations
VITE_IMAGE_GENERATION_API_KEY=your_api_key_here
VITE_IMAGE_GENERATION_MODEL=model-name

# 可选配置
VITE_TEXT_GENERATION_TEMPERATURE=0.7
VITE_TEXT_GENERATION_TIMEOUT=300000
```

---

## 🤖 文本生成 API 推荐

### 1. **302.AI** ⭐ 推荐（性价比高）

**特点**：
- ✅ 支持多种主流大模型（GPT-4、Claude、DeepSeek、豆包等）
- ✅ 价格实惠，按量付费
- ✅ 稳定可靠，响应速度快
- ✅ 完全兼容 OpenAI API 格式

**获取步骤**：
1. 访问 [302.AI 官网](https://302.ai) 或 [302.AI 注册](https://share.302.ai/DymMSI)
2. 注册账号并登录
3. 进入 **控制台** > **API 密钥**
4. 创建新的 API 密钥
5. 在 **模型列表** 中选择你想要的模型（推荐：`doubao-1.5-pro-32k`、`gpt-4`、`claude-3-opus`）

**配置示例**：
```env
VITE_TEXT_GENERATION_BASE_URL=https://api.302ai.cn/v1/
VITE_TEXT_GENERATION_API_KEY=sk-302-xxxxxxxxxxxxx
VITE_TEXT_GENERATION_MODEL=doubao-1.5-pro-32k
```

**推荐模型**：
- `doubao-1.5-pro-32k` - 豆包 Pro（性价比高，中文能力强）
- `gpt-4` - GPT-4（质量最高，价格较高）
- `claude-3-opus` - Claude 3（创意能力强）
- `deepseek-chat` - DeepSeek（性价比极高）

---

### 2. **零一万物（01.AI）**

**特点**：
- ✅ 中文优化的大模型
- ✅ 响应速度快
- ✅ 价格适中

**获取步骤**：
1. 访问 [零一万物官网](https://www.01.ai/)
2. 注册账号
3. 进入 **API 管理** 创建密钥
4. 获取 API Key

**配置示例**：
```env
VITE_TEXT_GENERATION_BASE_URL=https://api.lingyiwanwu.com/v1/
VITE_TEXT_GENERATION_API_KEY=sk-xxxxxxxxxxxxx
VITE_TEXT_GENERATION_MODEL=yi-lightning
```

**可用模型**：
- `yi-lightning` - 快速响应模型
- `yi-large` - 高质量模型

---

### 3. **OpenAI（官方）**

**特点**：
- ✅ 质量最高
- ✅ 模型最丰富
- ⚠️ 需要海外支付方式
- ⚠️ 价格较高

**获取步骤**：
1. 访问 [OpenAI 官网](https://platform.openai.com/)
2. 注册账号（需要海外手机号）
3. 进入 **API Keys** 创建密钥
4. 充值账户余额

**配置示例**：
```env
VITE_TEXT_GENERATION_BASE_URL=https://api.openai.com/v1/
VITE_TEXT_GENERATION_API_KEY=sk-xxxxxxxxxxxxx
VITE_TEXT_GENERATION_MODEL=gpt-4
```

**推荐模型**：
- `gpt-4` - 最高质量
- `gpt-3.5-turbo` - 性价比选择

---

### 4. **DeepSeek（深度求索）**

**特点**：
- ✅ 性价比极高
- ✅ 中文能力强
- ✅ 支持长上下文

**获取步骤**：
1. 访问 [DeepSeek 官网](https://www.deepseek.com/)
2. 注册账号
3. 进入 **API 管理** 创建密钥

**配置示例**：
```env
VITE_TEXT_GENERATION_BASE_URL=https://api.deepseek.com/v1/
VITE_TEXT_GENERATION_API_KEY=sk-xxxxxxxxxxxxx
VITE_TEXT_GENERATION_MODEL=deepseek-chat
```

---

### 5. **其他兼容 OpenAI 的 API 服务**

项目支持任何兼容 OpenAI API 格式的服务，包括：
- **Anthropic Claude** - 通过代理服务
- **Google Gemini** - 通过代理服务
- **阿里云通义千问** - 通过代理服务
- **腾讯混元** - 通过代理服务
- **百度文心一言** - 通过代理服务

---

## 🎨 图片生成 API 推荐

### 1. **智谱 AI（GLM）** ⭐ 推荐

**特点**：
- ✅ 中文优化
- ✅ 图片质量高
- ✅ 响应速度快
- ✅ 价格合理

**获取步骤**：
1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册账号并完成实名认证
3. 进入 **控制台** > **API 密钥**
4. 创建新的 API 密钥
5. 在 **模型服务** 中选择 **图像生成** 服务

**配置示例**：
```env
VITE_IMAGE_GENERATION_BASE_URL=https://open.bigmodel.cn/api/paas/v4/images/generations
VITE_IMAGE_GENERATION_API_KEY=xxxxxxxxxxxxx
VITE_IMAGE_GENERATION_MODEL=cogview-3-flash
```

**可用模型**：
- `cogview-3-flash` - 快速生成（推荐）
- `cogview-3` - 高质量生成

---

### 2. **OpenAI DALL-E**

**特点**：
- ✅ 图片质量极高
- ⚠️ 需要海外支付方式
- ⚠️ 价格较高

**获取步骤**：
1. 使用 OpenAI 账号（与文本生成 API 相同）
2. 在 OpenAI 平台启用 DALL-E 服务

**配置示例**：
```env
VITE_IMAGE_GENERATION_BASE_URL=https://api.openai.com/v1/images/generations
VITE_IMAGE_GENERATION_API_KEY=sk-xxxxxxxxxxxxx
VITE_IMAGE_GENERATION_MODEL=dall-e-3
```

---

### 3. **Stable Diffusion API**

**特点**：
- ✅ 开源模型
- ✅ 可通过第三方服务使用
- ✅ 价格便宜

**推荐服务商**：
- [Stability AI](https://platform.stability.ai/)
- [Replicate](https://replicate.com/)

---

## 💡 推荐配置组合

### 方案一：高性价比（推荐新手）

```env
# 文本生成 - 302.AI + 豆包
VITE_TEXT_GENERATION_BASE_URL=https://api.302ai.cn/v1/
VITE_TEXT_GENERATION_API_KEY=sk-302-xxxxxxxxxxxxx
VITE_TEXT_GENERATION_MODEL=doubao-1.5-pro-32k

# 图片生成 - 智谱 AI
VITE_IMAGE_GENERATION_BASE_URL=https://open.bigmodel.cn/api/paas/v4/images/generations
VITE_IMAGE_GENERATION_API_KEY=xxxxxxxxxxxxx
VITE_IMAGE_GENERATION_MODEL=cogview-3-flash
```

**优点**：价格便宜，中文能力强，适合个人使用

---

### 方案二：高质量（推荐专业用户）

```env
# 文本生成 - 302.AI + GPT-4
VITE_TEXT_GENERATION_BASE_URL=https://api.302ai.cn/v1/
VITE_TEXT_GENERATION_API_KEY=sk-302-xxxxxxxxxxxxx
VITE_TEXT_GENERATION_MODEL=gpt-4

# 图片生成 - OpenAI DALL-E
VITE_IMAGE_GENERATION_BASE_URL=https://api.openai.com/v1/images/generations
VITE_IMAGE_GENERATION_API_KEY=sk-xxxxxxxxxxxxx
VITE_IMAGE_GENERATION_MODEL=dall-e-3
```

**优点**：质量最高，适合商业使用

---

### 方案三：极致性价比

```env
# 文本生成 - DeepSeek
VITE_TEXT_GENERATION_BASE_URL=https://api.deepseek.com/v1/
VITE_TEXT_GENERATION_API_KEY=sk-xxxxxxxxxxxxx
VITE_TEXT_GENERATION_MODEL=deepseek-chat

# 图片生成 - 智谱 AI
VITE_IMAGE_GENERATION_BASE_URL=https://open.bigmodel.cn/api/paas/v4/images/generations
VITE_IMAGE_GENERATION_API_KEY=xxxxxxxxxxxxx
VITE_IMAGE_GENERATION_MODEL=cogview-3-flash
```

**优点**：价格最低，适合大量使用

---

## 🔒 安全提示

1. **不要泄露 API 密钥**
   - 永远不要将 API 密钥提交到 Git 仓库
   - 使用环境变量存储密钥
   - 在 Vercel/Netlify 等平台使用环境变量配置

2. **设置使用限额**
   - 在 API 服务商控制台设置每日/每月使用限额
   - 避免意外超支

3. **定期轮换密钥**
   - 定期更换 API 密钥
   - 如果密钥泄露，立即撤销并创建新密钥

---

## 🧪 测试 API 配置

部署后，你可以在应用中使用内置的 **配置测试功能**：

1. 点击导航栏右侧的 **⚙️ 设置按钮**
2. 在设置弹窗中点击 **"测试配置"**
3. 系统会自动测试 API 连接是否正常

---

## 📞 获取帮助

如果遇到 API 配置问题：

1. 检查 API 密钥是否正确
2. 确认 API 端点地址格式正确（注意末尾的 `/v1/` 或 `/v4/`）
3. 查看 API 服务商的控制台，确认服务是否正常
4. 检查账户余额是否充足
5. 查看项目 Issues 或提交新 Issue

---

## 💰 价格参考（仅供参考，实际价格以官网为准）

### 文本生成 API
- **302.AI**: ¥0.001-0.01/1K tokens（根据模型不同）
- **零一万物**: ¥0.002-0.01/1K tokens
- **OpenAI GPT-4**: $0.03-0.06/1K tokens
- **DeepSeek**: ¥0.001/1K tokens（极便宜）

### 图片生成 API
- **智谱 AI**: ¥0.1-0.5/张
- **OpenAI DALL-E**: $0.04-0.12/张
- **Stable Diffusion**: $0.002-0.01/张

---

## 🎯 总结

**最推荐的组合**：
- **文本生成**：302.AI + 豆包 Pro（`doubao-1.5-pro-32k`）
- **图片生成**：智谱 AI（`cogview-3-flash`）

这个组合性价比最高，中文能力强，适合大多数用户使用！

