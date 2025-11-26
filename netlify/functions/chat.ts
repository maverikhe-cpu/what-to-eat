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
  const apiKey = process.env.TEXT_GENERATION_API_KEY
  const baseUrl = process.env.TEXT_GENERATION_BASE_URL

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
    const targetUrl = `${baseUrl.replace(/\/$/, '')}/chat/completions`

    // 检查是否是流式请求
    const isStream = requestBody?.stream === true

    // 转发请求到 AI API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    // 如果是流式响应，需要特殊处理
    if (isStream && response.body) {
      // Netlify Functions 对流式响应的支持有限
      // 这里我们返回一个错误提示，建议使用非流式模式
      // 或者可以将流式数据缓冲后一次性返回
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullData = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullData += decoder.decode(value, { stream: true })
      }

      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: fullData
      }
    }

    // 非流式响应，正常处理
    const data = await response.json()

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
    console.error('AI API proxy error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    }
  }
}

