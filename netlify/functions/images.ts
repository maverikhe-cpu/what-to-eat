import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // 处理 CORS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    }
  }

  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // 从环境变量获取 API 配置（注意：不使用 VITE_ 前缀）
  const apiKey = process.env.IMAGE_GENERATION_API_KEY
  const baseUrl = process.env.IMAGE_GENERATION_BASE_URL

  if (!apiKey || !baseUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Server configuration error: API credentials not found' 
      })
    }
  }

  try {
    // 解析请求体
    const requestBody = JSON.parse(event.body || '{}')

    // 构建目标 API URL
    const targetUrl = baseUrl.replace(/\/$/, '')

    // 转发请求到图片生成 API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()

    // 返回响应
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(data)
    }
  } catch (error: any) {
    console.error('Image API proxy error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    }
  }
}

