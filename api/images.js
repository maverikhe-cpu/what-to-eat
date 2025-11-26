/**
 * 图片生成 API 代理
 * 代理前端请求到图片生成 API，保护 API 密钥安全
 */
module.exports = async function handler(req, res) {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')

  // 从环境变量获取 API 配置（注意：不使用 VITE_ 前缀）
  const apiKey = process.env.IMAGE_GENERATION_API_KEY
  const baseUrl = process.env.IMAGE_GENERATION_BASE_URL

  if (!apiKey || !baseUrl) {
    console.error('Missing API credentials:', {
      hasApiKey: !!apiKey,
      hasBaseUrl: !!baseUrl,
      baseUrl: baseUrl || 'missing'
    })
    return res.status(500).json({ 
      error: 'Server configuration error: API credentials not found',
      message: 'Please configure IMAGE_GENERATION_API_KEY and IMAGE_GENERATION_BASE_URL in your deployment platform (Vercel/Netlify) environment variables.',
      hint: 'Environment variables should NOT have VITE_ prefix for server-side functions'
    })
  }

  try {
    // 构建目标 API URL
    const targetUrl = baseUrl.replace(/\/$/, '')

    // 转发请求到图片生成 API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    })

    const data = await response.json()

    // 转发响应状态码和内容
    res.status(response.status).json(data)
  } catch (error) {
    console.error('Image API proxy error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error?.message || String(error)
    })
  }
}

