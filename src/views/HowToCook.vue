<template>
    <div class="min-h-screen bg-yellow-400 px-2 md:px-4 py-6">
        <!-- 全局导航 -->
        <GlobalNavigation />

        <div class="max-w-7xl mx-auto">
            <!-- 输入区域 -->
            <div class="mb-8">
                <div class="bg-pink-400 text-white px-4 py-2 rounded-t-lg border-2 border-[#0A0910] border-b-0 inline-block">
                    <span class="font-bold">1. 输入菜名</span>
                </div>
                <div class="bg-white border-2 border-[#0A0910] rounded-lg rounded-tl-none p-4 md:p-6">
                    <div class="space-y-4">
                        <!-- 菜名输入框 -->
                        <div class="relative">
                            <input
                                v-model="dishName"
                                @keyup.enter="generateAll"
                                placeholder="例如：红烧肉、宫保鸡丁、麻婆豆腐..."
                                class="w-full p-3 md:p-4 border-2 border-[#0A0910] rounded-lg text-base md:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-pink-400 min-h-[44px]"
                            />
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <span class="text-2xl">🔍</span>
                            </div>
                        </div>



                        <!-- 一键生成按钮 -->
                        <button
                            @click="generateAll"
                            :disabled="!dishName.trim() || isLoading"
                            class="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-4 md:py-5 rounded-lg font-bold text-base md:text-lg border-2 border-[#0A0910] transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg min-h-[48px]"
                        >
                            <span class="flex items-center gap-2 justify-center">
                                <template v-if="isLoading">
                                    <div class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    <span>{{ loadingText }}</span>
                                </template>
                                <template v-else>
                                    <span class="text-xl">✨</span>
                                    <span>一键生成食材、菜谱和图片</span>
                                </template>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 菜谱结果 -->
            <div class="mb-8" data-results>
                <div class="bg-green-400 text-white px-4 py-2 rounded-t-lg border-2 border-[#0A0910] border-b-0 inline-block">
                    <span class="font-bold">2. 制作教程</span>
                </div>
                <div class="bg-white border-2 border-[#0A0910] rounded-lg rounded-tl-none p-4 md:p-6">
                    <!-- 空状态提示 -->
                    <div v-if="!recipe && !isLoading" class="text-center py-12">
                        <div class="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span class="text-white text-2xl">🍳</span>
                        </div>
                        <h3 class="text-lg font-bold text-gray-600 mb-3">等待您的菜名...</h3>
                        <div class="space-y-2 text-sm text-gray-500 max-w-md mx-auto">
                            <p class="flex items-center justify-center gap-2">
                                <span>💡</span>
                                <span>输入具体菜名效果更好，如"红烧肉"</span>
                            </p>
                            <p class="flex items-center justify-center gap-2">
                                <span>🌟</span>
                                <span>支持各种菜系：川菜、粤菜、湘菜等</span>
                            </p>
                            <p class="flex items-center justify-center gap-2">
                                <span>📝</span>
                                <span>包含详细步骤、用料和烹饪技巧</span>
                            </p>
                        </div>
                    </div>

                    <!-- 加载状态 -->
                    <div v-if="isLoading && !recipe" class="text-center py-12">
                        <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <span class="text-white text-2xl">👨‍🍳</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-700 mb-2">{{ loadingText }}</h3>
                        <p class="text-gray-500">{{ loadingSubtext }}</p>
                        <div class="mt-4">
                            <div class="animate-spin w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full mx-auto"></div>
                        </div>
                    </div>

                    <!-- 菜谱内容 -->
                    <div v-if="recipe" class="max-w-2xl mx-auto border-2 border-[#333333] rounded-lg overflow-hidden animate-fade-in-up">
                        <RecipeCard :recipe="recipe" :show-actions="true" :auto-generate-image="true" />
                    </div>
                </div>
          
            </div>

            <!-- 历史记录 -->
            <div v-if="searchHistory.length > 0" class="mb-8">
                <div class="bg-blue-400 text-white px-4 py-2 rounded-t-lg border-2 border-[#0A0910] border-b-0 inline-block">
                    <span class="font-bold">最近搜索</span>
                </div>
                <div class="bg-white border-2 border-[#0A0910] rounded-lg rounded-tl-none p-4">
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="historyItem in searchHistory.slice(0, 8)"
                            :key="historyItem"
                            @click="selectDish(historyItem)"
                            class="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-full border border-blue-300 hover:bg-blue-200 hover:border-blue-400 transition-all duration-200"
                        >
                            {{ historyItem }}
                        </button>
                        <button
                            v-if="searchHistory.length > 0"
                            @click="clearHistory"
                            class="px-3 py-2 text-sm text-red-600 hover:text-red-700 underline"
                        >
                            清除历史
                        </button>
                    </div>
                </div>
            </div>


        </div>

        <!-- 全局底部 -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { generateDishRecipeByName } from '@/services/aiService'
import type { Recipe } from '@/types'
import RecipeCard from '@/components/RecipeCard.vue'
import GlobalNavigation from '@/components/GlobalNavigation.vue'

// 响应式数据
const dishName = ref('')
const recipe = ref<Recipe | null>(null)
const isLoading = ref(false)
const searchHistory = ref<string[]>([])
const loadingText = ref('AI大师思考中...')
const loadingSubtext = ref('正在为您准备详细的菜谱...')

// 页面加载时恢复历史记录
onMounted(() => {
    const saved = localStorage.getItem('howToCook_history')
    if (saved) {
        try {
            searchHistory.value = JSON.parse(saved)
        } catch (e) {
            console.error('恢复搜索历史失败:', e)
        }
    }
})

// 选择菜品
const selectDish = (dish: string) => {
    dishName.value = dish
    generateAll()
}

// 一键生成：菜谱 + 图片
const generateAll = async () => {
    if (!dishName.value.trim() || isLoading.value) return

    const searchTerm = dishName.value.trim()
    
    // 添加到历史记录
    if (!searchHistory.value.includes(searchTerm)) {
        searchHistory.value.unshift(searchTerm)
        if (searchHistory.value.length > 20) {
            searchHistory.value = searchHistory.value.slice(0, 20)
        }
        localStorage.setItem('howToCook_history', JSON.stringify(searchHistory.value))
    }

    isLoading.value = true
    recipe.value = null
    loadingText.value = 'AI大师思考中...'
    loadingSubtext.value = '正在为您准备详细的菜谱...'

    try {
        // 步骤1: 生成菜谱
        loadingText.value = '正在生成菜谱...'
        loadingSubtext.value = 'AI大师正在分析食材和制作步骤...'
        
        const result = await generateDishRecipeByName(searchTerm)
        recipe.value = result
        
        // 滚动到结果区域
        setTimeout(() => {
            const resultsElement = document.querySelector('[data-results]')
            if (resultsElement) {
                resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }, 100)
        
        // 步骤2: 图片会在 RecipeCard 组件中自动生成（通过 auto-generate-image prop）
        // 这里不需要额外处理，RecipeCard 会自动处理图片生成
        
    } catch (error) {
        console.error('生成失败:', error)
        loadingText.value = '生成失败'
        loadingSubtext.value = error instanceof Error ? error.message : '请稍后重试'
        
        // 显示错误提示
        setTimeout(() => {
            alert(error instanceof Error ? error.message : '生成失败，请稍后重试')
        }, 500)
    } finally {
        isLoading.value = false
    }
}

// 清除历史记录
const clearHistory = () => {
    searchHistory.value = []
    localStorage.removeItem('howToCook_history')
}
</script>

<style scoped>
@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out;
}
</style>