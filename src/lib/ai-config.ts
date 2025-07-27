// AI模型配置类型定义
export interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  apiBaseUrl: string;
  defaultModel: string;
  description: string;
}

export interface UserAIConfig {
  selectedModelId: string | null;
  apiKey: string;
  customModels: Record<string, string>; // modelId -> modelName映射
}

// 预设的AI模型配置
export const PRESET_AI_MODELS: AIModelConfig[] = [
  {
    id: 'siliconflow',
    name: '硅基流动',
    provider: 'SiliconFlow',
    apiBaseUrl: 'https://api.siliconflow.cn/v1',
    defaultModel: 'Qwen/Qwen2-7B-Instruct',
    description: '国内领先的AI大模型服务平台'
  },
  {
    id: 'kimi',
    name: 'Kimi',
    provider: 'Moonshot AI',
    apiBaseUrl: 'https://api.moonshot.cn/v1',
    defaultModel: 'moonshot-v1-8k',
    description: '支持超长文本输入的AI模型'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    provider: 'DeepSeek',
    apiBaseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    description: '深度求索开发的通用大模型'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    provider: 'OpenAI',
    apiBaseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-3.5-turbo',
    description: 'OpenAI官方API'
  }
];

// 保存用户配置到localStorage
export const saveUserAIConfig = (config: UserAIConfig) => {
  localStorage.setItem('aiConfig', JSON.stringify(config));
};

// 从localStorage获取用户配置
export const getUserAIConfig = (): UserAIConfig | null => {
  const configStr = localStorage.getItem('aiConfig');
  return configStr ? JSON.parse(configStr) : null;
};

// 获取当前选中的模型配置
export const getCurrentModelConfig = (): { model: AIModelConfig | null, customModelName: string | null } => {
  const userConfig = getUserAIConfig();
  if (!userConfig || !userConfig.selectedModelId) {
    return { model: null, customModelName: null };
  }

  // 查找预设模型
  const presetModel = PRESET_AI_MODELS.find(
    model => model.id === userConfig.selectedModelId
  );
  
  // 如果是自定义模型名，则使用用户设置的
  const customModelName = userConfig.customModels?.[userConfig.selectedModelId] || null;

  return { 
    model: presetModel || null, 
    customModelName 
  };
};

// 调用AI API的函数
export const callAIAPI = async (prompt: string, systemMessage?: string) => {
  const { model, customModelName } = getCurrentModelConfig();
  const userConfig = getUserAIConfig();

  if (!model || !userConfig?.apiKey) {
    throw new Error('请先配置AI模型和API密钥');
  }

  const modelName = customModelName || model.defaultModel;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userConfig.apiKey}`
  };

  const body = {
    model: modelName,
    messages: systemMessage 
      ? [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ]
      : [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2048
  };

  try {
    const response = await fetch(`${model.apiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI API调用错误:', error);
    throw error;
  }
};