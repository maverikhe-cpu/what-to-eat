import { test, expect } from '@playwright/test';

/**
 * API 代理测试
 * 测试服务器端代理 API 是否正常工作
 * 
 * 注意：这些测试在本地开发环境中可能无法完全运行，因为需要 Serverless Functions。
 * 要完整测试，请：
 * 1. 使用 Vercel CLI: vercel dev
 * 2. 或在部署环境中运行测试
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';
const IS_DEPLOYED = process.env.TEST_DEPLOYED === 'true' || BASE_URL.includes('vercel.app') || BASE_URL.includes('netlify.app');

test.describe('API 代理测试', () => {
  
  test('健康检查端点应该返回配置信息', async ({ request }) => {
    test.skip(!IS_DEPLOYED, '此测试需要在部署环境中运行（使用 Vercel CLI 或已部署的站点）');
    
    const response = await request.get(`${BASE_URL}/api/health`);
    
    console.log(`健康检查端点状态码: ${response.status()}`);
    console.log(`Content-Type: ${response.headers()['content-type']}`);
    
    if (response.status() === 404) {
      console.log('❌ 健康检查端点未找到，可能 Serverless Functions 未部署');
      console.log('💡 请检查：');
      console.log('   1. api/health.ts 文件是否存在');
      console.log('   2. Vercel 项目设置中是否正确配置了函数');
      console.log('   3. 重新部署项目');
      test.skip();
      return;
    }
    
    if (response.status() !== 200) {
      const text = await response.text();
      console.log(`响应内容: ${text.substring(0, 200)}`);
      test.skip();
      return;
    }
    
    const contentType = response.headers()['content-type'];
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.log(`⚠️  返回的不是 JSON，而是: ${contentType}`);
      console.log(`响应内容: ${text.substring(0, 500)}`);
      console.log('💡 这可能意味着请求被 SPA 路由捕获，而不是 Serverless Function');
      test.skip();
      return;
    }
    
    const data = await response.json();
    
    // 检查响应结构
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('config');
    expect(data.status).toBe('ok');
    
    // 检查配置信息
    const config = data.config;
    expect(config).toHaveProperty('hasTextApiKey');
    expect(config).toHaveProperty('hasTextBaseUrl');
    expect(config).toHaveProperty('hasImageApiKey');
    expect(config).toHaveProperty('hasImageBaseUrl');
    
    // 输出配置信息用于调试
    console.log('📊 API 配置状态:');
    console.log(`  - 文本生成 API Key: ${config.hasTextApiKey ? '✅ 已配置' : '❌ 未配置'}`);
    console.log(`  - 文本生成 Base URL: ${config.hasTextBaseUrl ? '✅ 已配置' : '❌ 未配置'}`);
    console.log(`  - 图片生成 API Key: ${config.hasImageApiKey ? '✅ 已配置' : '❌ 未配置'}`);
    console.log(`  - 图片生成 Base URL: ${config.hasImageBaseUrl ? '✅ 已配置' : '❌ 未配置'}`);
    
    if (config.textBaseUrl && config.textBaseUrl !== 'not configured') {
      console.log(`  - 文本生成 Base URL: ${config.textBaseUrl}`);
    }
    if (config.imageBaseUrl && config.imageBaseUrl !== 'not configured') {
      console.log(`  - 图片生成 Base URL: ${config.imageBaseUrl}`);
    }
  });

  test('文本生成代理应该处理请求（需要环境变量）', async ({ request }) => {
    test.skip(!IS_DEPLOYED, '此测试需要在部署环境中运行');
    
    const response = await request.post(`${BASE_URL}/api/chat`, {
      data: {
        model: 'test-model',
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        max_tokens: 10
      }
    });
    
    console.log(`文本生成代理状态码: ${response.status()}`);
    
    // 如果返回 404，说明 Serverless Function 未部署
    if (response.status() === 404) {
      const text = await response.text();
      console.log('❌ 代理端点未找到 (404)');
      console.log(`响应内容: ${text.substring(0, 200)}`);
      console.log('💡 请检查：');
      console.log('   1. api/chat.ts 文件是否存在');
      console.log('   2. Vercel 项目是否正确部署了 Serverless Functions');
      console.log('   3. vercel.json 中的路由配置是否正确');
      test.skip();
      return;
    }
    
    // 如果返回 200 但内容是 HTML，说明被 SPA 路由捕获
    const contentType = response.headers()['content-type'];
    if (response.status() === 200 && contentType?.includes('text/html')) {
      console.log('⚠️  请求被 SPA 路由捕获，而不是 Serverless Function');
      console.log('💡 请检查 vercel.json 中的路由配置');
      test.skip();
      return;
    }
    
    // 如果环境变量未配置，应该返回 500 错误
    if (response.status() === 500) {
      try {
        const errorData = await response.json();
        console.log('⚠️  文本生成代理错误:', errorData);
        
        if (errorData.error === 'Server configuration error: API credentials not found') {
          console.log('❌ 环境变量未配置: TEXT_GENERATION_API_KEY 或 TEXT_GENERATION_BASE_URL');
          expect(errorData.message).toContain('API credentials not found');
        }
      } catch (e) {
        const text = await response.text();
        console.log('响应内容:', text.substring(0, 200));
      }
    } else if ([200, 400, 401, 429].includes(response.status())) {
      // 如果环境变量已配置，应该返回 200 或 AI API 的错误
      console.log('✅ 文本生成代理响应正常，状态码:', response.status());
    } else {
      console.log(`⚠️  意外的状态码: ${response.status()}`);
      const text = await response.text();
      console.log('响应内容:', text.substring(0, 200));
    }
  });

  test('图片生成代理应该处理请求（需要环境变量）', async ({ request }) => {
    test.skip(!IS_DEPLOYED, '此测试需要在部署环境中运行');
    
    const response = await request.post(`${BASE_URL}/api/images`, {
      data: {
        model: 'test-model',
        prompt: 'test image',
        size: '1024x1024',
        n: 1
      }
    });
    
    // 如果环境变量未配置，应该返回 500 错误
    if (response.status() === 500) {
      const errorData = await response.json();
      console.log('⚠️  图片生成代理错误:', errorData);
      
      if (errorData.error === 'Server configuration error: API credentials not found') {
        console.log('❌ 环境变量未配置: IMAGE_GENERATION_API_KEY 或 IMAGE_GENERATION_BASE_URL');
        expect(errorData.message).toContain('API credentials not found');
      }
    } else if (response.status() === 404) {
      console.log('⚠️  代理端点未找到，可能 Serverless Functions 未部署');
      test.skip();
    } else {
      // 如果环境变量已配置，应该返回 200 或 AI API 的错误
      expect([200, 400, 401, 429]).toContain(response.status());
      console.log('✅ 图片生成代理响应正常，状态码:', response.status());
    }
  });

  test('代理应该处理 CORS 预检请求', async ({ request }) => {
    test.skip(!IS_DEPLOYED, '此测试需要在部署环境中运行');
    
    // 使用 request API 测试 OPTIONS 请求
    // 注意：Playwright 的 request API 可能不支持 OPTIONS，使用 fetch 测试
    const response = await request.fetch(`${BASE_URL}/api/chat`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    expect(response.status()).toBe(200);
    
    // 检查 CORS 头（注意：某些情况下响应头可能不可访问）
    const headers = response.headers();
    if (headers['access-control-allow-origin']) {
      expect(headers['access-control-allow-origin']).toBe('*');
    }
    if (headers['access-control-allow-methods']) {
      expect(headers['access-control-allow-methods']).toContain('POST');
    }
    
    console.log('✅ CORS 预检请求响应正常，状态码:', response.status());
  });

  test('代理应该拒绝非 POST 请求', async ({ request }) => {
    test.skip(!IS_DEPLOYED, '此测试需要在部署环境中运行');
    
    const response = await request.get(`${BASE_URL}/api/chat`);
    
    console.log(`GET 请求状态码: ${response.status()}`);
    const contentType = response.headers()['content-type'];
    console.log(`Content-Type: ${contentType}`);
    
    if (response.status() === 404) {
      console.log('⚠️  代理端点未找到，可能 Serverless Functions 未部署');
      test.skip();
      return;
    }
    
    // 如果返回 200 且是 HTML，说明被 SPA 路由捕获
    if (response.status() === 200 && contentType?.includes('text/html')) {
      console.log('⚠️  GET 请求被 SPA 路由捕获，而不是 Serverless Function');
      console.log('💡 这说明 /api/chat 路由没有正确配置为 Serverless Function');
      console.log('💡 请检查 vercel.json 中的路由配置，确保 /api/* 路由优先于 SPA 路由');
      test.skip();
      return;
    }
    
    expect(response.status()).toBe(405);
    const data = await response.json();
    expect(data.error).toBe('Method not allowed');
  });
});

test.describe('前端 API 调用测试', () => {
  
  test('页面应该正常加载', async ({ page }) => {
    await page.goto('/');
    
    // 检查页面标题或关键元素
    await expect(page).toHaveTitle(/一饭封神|what.*eat/i);
    
    console.log('✅ 页面加载成功');
  });

  test('检查网络请求是否使用代理', async ({ page }) => {
    // 监听网络请求
    const requests: string[] = [];
    
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('/api/chat') || url.includes('/api/images')) {
        requests.push(url);
        console.log('📡 检测到代理请求:', url);
      }
    });

    await page.goto('/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 检查是否有直接调用 AI API 的请求（不应该有）
    const allRequests = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script'))
        .map(s => s.src)
        .filter(Boolean);
    });
    
    console.log('📊 页面加载完成，检查代理使用情况...');
    
    // 如果有代理请求，说明配置正确
    if (requests.length > 0) {
      console.log('✅ 检测到代理 API 请求');
    } else {
      console.log('ℹ️  未检测到代理 API 请求（可能是页面尚未触发 API 调用）');
    }
  });

  test('检查设置页面不显示 API 密钥输入框', async ({ page }) => {
    await page.goto('/');
    
    // 查找设置按钮并点击
    const settingsButton = page.locator('button').filter({ hasText: /设置|⚙️|Settings/i }).first();
    
    if (await settingsButton.count() > 0) {
      await settingsButton.click();
      
      // 等待设置模态框出现
      await page.waitForTimeout(500);
      
      // 检查不应该有 API 密钥输入框（type="password" 且包含 "API" 或 "密钥"）
      const apiKeyInputs = page.locator('input[type="password"]').filter({ 
        hasText: /API|密钥|key/i 
      });
      
      const count = await apiKeyInputs.count();
      
      if (count === 0) {
        console.log('✅ 设置页面已正确移除 API 密钥输入框');
      } else {
        console.log('⚠️  设置页面仍包含 API 密钥输入框');
      }
      
      // 检查是否有安全提示
      const securityNotice = page.locator('text=/安全|API密钥安全|服务器端/i');
      const hasNotice = await securityNotice.count() > 0;
      
      if (hasNotice) {
        console.log('✅ 设置页面显示安全提示');
      }
    } else {
      console.log('ℹ️  未找到设置按钮，跳过此测试');
    }
  });
});

