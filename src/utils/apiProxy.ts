/**
 * API 代理工具
 * 根据部署环境自动选择使用代理 API 或直接调用
 */

/**
 * 获取文本生成 API 端点
 * 在生产环境使用代理，开发环境可以直接使用（如果配置了代理）
 */
export const getChatApiEndpoint = (): string => {
  // 检查是否在开发环境且配置了代理
  if (import.meta.env.DEV) {
    // 开发环境：优先使用代理，如果没有配置则回退到直接调用
    return '/api/chat'
  }
  
  // 生产环境：使用代理
  return '/api/chat'
}

/**
 * 获取图片生成 API 端点
 */
export const getImageApiEndpoint = (): string => {
  if (import.meta.env.DEV) {
    return '/api/images'
  }
  
  return '/api/images'
}

/**
 * 检查是否应该使用代理
 * 如果环境变量中没有 VITE_ 前缀的 API key，说明应该使用代理
 */
export const shouldUseProxy = (): boolean => {
  // 如果服务器端环境变量存在，优先使用代理
  // 前端无法直接检测服务器端环境变量，所以默认使用代理
  return true
}

