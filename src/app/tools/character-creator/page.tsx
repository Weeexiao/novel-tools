'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { callAIAPI, getCurrentModelConfig } from '@/lib/ai-config'
import { Copy, Download, RefreshCw, User, AlertCircle, Sparkles } from 'lucide-react'

interface Character {
  name: string
  age: number
  gender: string
  occupation: string
  personality: string[]
  background: string
  appearance: string
  motivation: string
  conflict: string
  relationships: string
}

const personalityTraits = [
  '勇敢', '谨慎', '聪明', '固执', '善良', '冷酷', '幽默', '严肃',
  '乐观', '悲观', '冲动', '冷静', '慷慨', '自私', '忠诚', '叛逆',
  '完美主义', '随遇而安', '领导力强', '依赖性强', '富有同情心', '铁石心肠'
]

const occupations = [
  '学生', '教师', '医生', '律师', '警察', '军人', '商人', '艺术家',
  '作家', '科学家', '工程师', '厨师', '司机', '服务员', '自由职业者', '企业家'
]

export default function CharacterCreator() {
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [error, setError] = useState('')
  const [aiEnabled, setAiEnabled] = useState(false)

  // 检查AI配置是否可用
  useState(() => {
    const { model } = getCurrentModelConfig()
    setAiEnabled(!!model)
  })

  const generateName = () => {
    const surnames = ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴']
    const names = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀英', '霞', '平']
    return surnames[Math.floor(Math.random() * surnames.length)] + names[Math.floor(Math.random() * names.length)]
  }

  const generateCharacterWithAI = async (type: 'random' | 'custom') => {
    setLoading(true)
    setError('')
    
    try {
      let prompt = ''
      
      if (type === 'random') {
        prompt = `请创建一个随机的小说角色，包含以下信息：
        1. 姓名：一个中文姓名
        2. 年龄：18-80岁之间
        3. 性别：男或女
        4. 职业：从以下选项中选择：${occupations.join('、')}
        5. 性格特征：从以下选项中选择3-5个：${personalityTraits.join('、')}
        6. 背景故事：200字左右的简短背景故事
        7. 外貌描述：100字左右的外貌特征
        8. 动机：该角色的目标或动机
        9. 冲突：该角色面临的主要冲突或挑战
        10. 人际关系：与故事中其他人物的关系
        
        请以JSON格式返回结果，严格按照以下格式：
        {
          "name": "姓名",
          "age": 年龄,
          "gender": "性别",
          "occupation": "职业",
          "personality": ["特征1", "特征2", "..."],
          "background": "背景故事",
          "appearance": "外貌描述",
          "motivation": "角色动机",
          "conflict": "主要冲突",
          "relationships": "人际关系"
        }`
      } else {
        prompt = `根据以下要求创建小说角色：${customPrompt}
        
        请以JSON格式返回结果，严格按照以下格式：
        {
          "name": "姓名",
          "age": 年龄,
          "gender": "性别",
          "occupation": "职业",
          "personality": ["特征1", "特征2", "..."],
          "background": "背景故事",
          "appearance": "外貌描述",
          "motivation": "角色动机",
          "conflict": "主要冲突",
          "relationships": "人际关系"
        }`
      }

      const response = await callAIAPI(prompt, '你是一位专业的小说角色设计师，擅长创建丰富、立体的小说角色。')
      const generatedCharacter = JSON.parse(response)
      
      setCharacter(generatedCharacter)
    } catch (err) {
      console.error('生成角色时出错:', err)
      setError('生成角色失败：' + (err instanceof Error ? err.message : '未知错误'))
    } finally {
      setLoading(false)
    }
  }

  const generateCharacterLocally = async (type: 'random' | 'custom') => {
    setLoading(true)
    
    // 模拟AI生成过程
    setTimeout(() => {
      const newCharacter: Character = {
        name: generateName(),
        age: Math.floor(Math.random() * 50) + 18,
        gender: Math.random() > 0.5 ? '男' : '女',
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        personality: personalityTraits
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 3),
        background: '这是一个随机生成的角色背景故事。他/她有着丰富的经历和独特的个性。',
        appearance: '这是角色的外貌描述，包括身高、体型、面部特征等。',
        motivation: '角色的主要动机和目标。',
        conflict: '角色面临的主要冲突和挑战。',
        relationships: '角色与其他人物的关系网络。'
      }
      
      setCharacter(newCharacter)
      setLoading(false)
    }, 1000)
  }

  const generateCharacter = async (type: 'random' | 'custom') => {
    if (aiEnabled) {
      await generateCharacterWithAI(type)
    } else {
      await generateCharacterLocally(type)
    }
  }

  const downloadCharacter = () => {
    if (!character) return
    
    const content = `角色档案
=======
姓名：${character.name}
年龄：${character.age}
性别：${character.gender}
职业：${character.occupation}

性格特征：
${character.personality.map(trait => `- ${trait}`).join('\n')}

背景故事：
${character.background}

外貌描述：
${character.appearance}

角色动机：
${character.motivation}

主要冲突：
${character.conflict}

人际关系：
${character.relationships}
`
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${character.name}_角色档案.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyCharacter = () => {
    if (!character) return
    
    const content = `姓名：${character.name}
年龄：${character.age}
性别：${character.gender}
职业：${character.occupation}
性格特征：${character.personality.join('、')}
背景故事：${character.background}
外貌描述：${character.appearance}
角色动机：${character.motivation}
主要冲突：${character.conflict}
人际关系：${character.relationships}`
    
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">角色创建器</h1>
        <p className="text-gray-600 dark:text-gray-400">
          创建丰富、立体的小说角色
        </p>
      </div>

      {!aiEnabled && (
        <Alert variant="default" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            检测到您尚未配置AI模型，当前为演示模式。如需获得更智能的角色创建体验，请前往
            <a href="/tools/settings" className="text-blue-600 hover:underline">设置页面</a>
            配置AI模型。
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>生成角色</CardTitle>
            <CardDescription>
              {aiEnabled 
                ? "使用AI创建个性化小说角色" 
                : "使用本地算法创建基础角色（配置AI后可获得更佳体验）"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="random">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="random">随机生成</TabsTrigger>
                <TabsTrigger value="custom">自定义生成</TabsTrigger>
              </TabsList>
              <TabsContent value="random" className="space-y-4 mt-4">
                <Button 
                  onClick={() => generateCharacter('random')} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成随机角色
                    </>
                  )}
                </Button>
              </TabsContent>
              <TabsContent value="custom" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">角色描述</Label>
                  <Textarea
                    id="prompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="描述您想要创建的角色，例如：一个勇敢的年轻骑士，或一个神秘的魔法师..."
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={() => generateCharacter('custom')} 
                  disabled={loading || !customPrompt.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成自定义角色
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>角色预览</CardTitle>
            <CardDescription>
              生成的角色将在此处显示
            </CardDescription>
          </CardHeader>
          <CardContent>
            {character ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">{character.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{character.age}岁</Badge>
                      <Badge variant="secondary">{character.gender}</Badge>
                      <Badge variant="secondary">{character.occupation}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={copyCharacter}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadCharacter}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">性格特征</h4>
                    <div className="flex flex-wrap gap-2">
                      {character.personality.map((trait, index) => (
                        <Badge key={index} variant="outline">{trait}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">背景故事</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {character.background}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">外貌描述</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {character.appearance}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">角色动机</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {character.motivation}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">主要冲突</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {character.conflict}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">人际关系</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {character.relationships}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <User className="h-16 w-16 mb-4" />
                <p>尚未生成角色</p>
                <p className="text-sm mt-2 text-center">
                  {aiEnabled 
                    ? "点击生成按钮创建您的小说角色" 
                    : "点击生成按钮创建基础角色，配置AI后可获得更佳体验"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}