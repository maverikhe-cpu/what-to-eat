import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * 健康检查端点，用于诊断代理配置
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')

  const config = {
    hasTextApiKey: !!process.env.TEXT_GENERATION_API_KEY,
    hasTextBaseUrl: !!process.env.TEXT_GENERATION_BASE_URL,
    hasImageApiKey: !!process.env.IMAGE_GENERATION_API_KEY,
    hasImageBaseUrl: !!process.env.IMAGE_GENERATION_BASE_URL,
    textBaseUrl: process.env.TEXT_GENERATION_BASE_URL || 'not configured',
    imageBaseUrl: process.env.IMAGE_GENERATION_BASE_URL || 'not configured',
    // 不显示完整的 API key，只显示前几个字符
    textApiKeyPrefix: process.env.TEXT_GENERATION_API_KEY 
      ? `${process.env.TEXT_GENERATION_API_KEY.substring(0, 8)}...` 
      : 'not configured',
    imageApiKeyPrefix: process.env.IMAGE_GENERATION_API_KEY 
      ? `${process.env.IMAGE_GENERATION_API_KEY.substring(0, 8)}...` 
      : 'not configured',
  }

  res.status(200).json({
    status: 'ok',
    message: 'API proxy health check',
    config,
    timestamp: new Date().toISOString()
  })
}

