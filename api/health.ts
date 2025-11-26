import { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * 健康检查端点，用于诊断代理配置
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*')

    const textApiKey = process.env.TEXT_GENERATION_API_KEY || ''
    const imageApiKey = process.env.IMAGE_GENERATION_API_KEY || ''

    const config = {
      hasTextApiKey: !!textApiKey,
      hasTextBaseUrl: !!process.env.TEXT_GENERATION_BASE_URL,
      hasImageApiKey: !!imageApiKey,
      hasImageBaseUrl: !!process.env.IMAGE_GENERATION_BASE_URL,
      textBaseUrl: process.env.TEXT_GENERATION_BASE_URL || 'not configured',
      imageBaseUrl: process.env.IMAGE_GENERATION_BASE_URL || 'not configured',
      // 不显示完整的 API key，只显示前几个字符
      textApiKeyPrefix: textApiKey 
        ? `${textApiKey.substring(0, 8)}...` 
        : 'not configured',
      imageApiKeyPrefix: imageApiKey 
        ? `${imageApiKey.substring(0, 8)}...` 
        : 'not configured',
    }

    res.status(200).json({
      status: 'ok',
      message: 'API proxy health check',
      config,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Health check error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error?.message || String(error),
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    })
  }
}

