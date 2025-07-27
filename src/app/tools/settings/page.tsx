'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  PRESET_AI_MODELS, 
  saveUserAIConfig, 
  getUserAIConfig, 
  UserAIConfig, 
  AIModelConfig 
} from '@/lib/ai-config';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function AISettings() {
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [customModelName, setCustomModelName] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const config = getUserAIConfig();
    if (config) {
      setSelectedModelId(config.selectedModelId || '');
      setApiKey(config.apiKey || '');
      if (config.customModels && config.selectedModelId) {
        setCustomModelName(config.customModels[config.selectedModelId] || '');
      }
    }
  }, []);

  const handleSave = () => {
    try {
      if (!selectedModelId) {
        setError('请选择AI模型');
        return;
      }

      if (!apiKey) {
        setError('请输入API密钥');
        return;
      }

      const config: UserAIConfig = {
        selectedModelId,
        apiKey,
        customModels: {}
      };

      if (customModelName) {
        config.customModels = {
          [selectedModelId]: customModelName
        };
      }

      saveUserAIConfig(config);
      setSaved(true);
      setError('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('保存配置时出错');
      console.error(err);
    }
  };

  const selectedModel = PRESET_AI_MODELS.find(model => model.id === selectedModelId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI模型设置</h1>
          <p className="text-gray-600 dark:text-gray-400">
            配置AI大模型以启用角色创建、情节辅助和写作风格指南功能
          </p>
        </div>
        
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm dark:shadow-gray-900/20">
          <CardHeader>
            <CardTitle className="dark:text-white">AI模型配置</CardTitle>
            <CardDescription className="dark:text-gray-300">
              配置AI大模型以启用角色创建、情节辅助和写作风格指南功能
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {saved && (
              <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-950/30 dark:border-green-500/50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                  配置已保存成功！
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/30 dark:border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model" className="dark:text-gray-200">AI模型选择</Label>
                <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                  <SelectTrigger id="model" className="dark:bg-gray-700/50 dark:text-white dark:border-gray-600/50 backdrop-blur-xl">
                    <SelectValue placeholder="选择AI模型" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700/80 dark:border-gray-600/50 dark:backdrop-blur-xl">
                    {PRESET_AI_MODELS.map((model) => (
                      <SelectItem 
                        key={model.id} 
                        value={model.id}
                        className="dark:text-white dark:hover:bg-gray-600/50"
                      >
                        {model.name} ({model.provider})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedModel && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedModel.description}
                    <br />
                    默认模型: {selectedModel.defaultModel}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey" className="dark:text-gray-200">API密钥</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="输入您的API密钥"
                  className="dark:bg-gray-700/50 dark:text-white dark:border-gray-600/50 backdrop-blur-xl"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  您的API密钥将仅存储在本地浏览器中，不会上传到任何服务器
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customModel" className="dark:text-gray-200">自定义模型名称（可选）</Label>
                <Input
                  id="customModel"
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  placeholder={selectedModel ? `例如: ${selectedModel.defaultModel}` : "输入模型名称"}
                  disabled={!selectedModelId}
                  className="dark:bg-gray-700/50 dark:text-white dark:border-gray-600/50 backdrop-blur-xl"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  如需使用指定模型而非默认模型，请在此输入完整模型名称
                </p>
              </div>

              <Button onClick={handleSave} className="w-full mt-4">
                保存配置
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm dark:shadow-gray-900/20">
          <CardHeader>
            <CardTitle className="dark:text-white">使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>1. 选择您要使用的AI模型提供商</li>
              <li>2. 输入从对应平台获取的API密钥</li>
              <li>3. 如需使用特定模型，可填写自定义模型名称</li>
              <li>4. 点击"保存配置"完成设置</li>
              <li>5. 配置完成后，角色创建、情节辅助和写作风格指南功能将自动启用AI能力</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}