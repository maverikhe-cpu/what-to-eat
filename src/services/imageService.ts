import type { Recipe } from '@/types'
import { getImageGenerationConfig } from '@/utils/apiConfig'
import { getImageApiEndpoint } from '@/utils/apiProxy'

export interface GeneratedImage {
    url: string
    id: string
}

export const generateRecipeImage = async (recipe: Recipe): Promise<GeneratedImage> => {
    // 从设置中获取图片生成配置
    const config = getImageGenerationConfig()

    // 确保模型名称存在，如果没有则使用默认值
    if (!config.model) {
        console.warn('图片生成模型名称未配置，使用默认值: cogview-3-flash')
        config.model = 'cogview-3-flash'
    }

    // 构建图片生成的提示词
    const prompt = buildImagePrompt(recipe)

    const sizeToUse = { width: 1152, height: 896 }

    try {
        // 使用代理端点，不再直接调用图片生成 API
        const response = await fetch(getImageApiEndpoint(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 注意：不再包含 Authorization header，由服务器端代理添加
            },
            body: JSON.stringify({
                model: config.model || 'cogview-3-flash',
                prompt: prompt,
                size: `${sizeToUse.width}x${sizeToUse.height}`,
                n: 1,
                style: 'vivid',
                quality: 'hd'
            })
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            
            // 检查是否是配置错误
            if (response.status === 500 && errorData?.error === 'Server configuration error: API credentials not found') {
                throw new Error('服务器配置错误：请检查环境变量配置。图片生成API密钥需要在部署平台（Vercel/Netlify）的环境变量中设置，且不使用VITE_前缀。')
            }
            
            throw new Error(errorData?.message || `API请求失败: ${response.status}`)
        }

        const data = await response.json()

        if (data.data && data.data.length > 0) {
            return {
                url: data.data[0].url,
                id: `${recipe.id}-${Date.now()}`
            }
        } else {
            throw new Error('API返回数据格式错误')
        }
    } catch (error: any) {
        console.error('生成图片失败:', error)
        
        // 检查是否是网络错误
        if (error?.message?.includes('Network Error') || error?.message?.includes('Failed to fetch')) {
            throw new Error('网络连接失败，请检查代理API是否正常工作。如果使用Vercel/Netlify，请确保Serverless Functions已正确部署。')
        }
        
        throw error
    }
}

const buildImagePrompt = (recipe: Recipe): string => {
    // 根据菜谱信息构建详细的图片生成提示词
    const ingredients = recipe.ingredients.join('、')
    const cuisineStyle = recipe.cuisine.replace('大师', '').replace('菜', '')

    return `一道精美的${cuisineStyle}菜肴：${recipe.name}，主要食材包括${ingredients}。菜品摆盘精致，色彩丰富，光线柔和，专业美食摄影风格，高清画质，餐厅级别的视觉效果。背景简洁，突出菜品本身的美感。`
}
