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
import { Copy, Download, RefreshCw, User } from 'lucide-react'

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

  const generateCharacter = async (type: 'random' | 'custom') => {
    setLoading(true)
    
    // 模拟AI生成过程
    setTimeout(() => {
      const newCharacter: Character = {
        name: generateName(),
        age: Math.floor(Math.random() * 50) + 18,
        gender: Math.random() > 0.5 ? '男' : '女',
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        personality: getRandomPersonality(3),
        background: generateBackground(),
        appearance: generateAppearance(),
        motivation: generateMotivation(),
        conflict: generateConflict(),
        relationships: generateRelationships()
      }
      
      if (type === 'custom' && customPrompt) {
        // 根据自定义提示调整角色
        newCharacter.background = `根据提示"${customPrompt}"：${newCharacter.background}`
      }
      
      setCharacter(newCharacter)
      setLoading(false)
    }, 1000)
  }

  const generateName = () => {
    const surnames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗']
    const names = ['明', '华', '强', '军', '勇', '磊', '涛', '超', '伟', '刚', '芳', '娜', '秀英', '敏', '静', '丽', '艳', '娟', '桂英', '萍']
    return surnames[Math.floor(Math.random() * surnames.length)] + names[Math.floor(Math.random() * names.length)]
  }

  const getRandomPersonality = (count: number) => {
    const shuffled = [...personalityTraits].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const generateBackground = () => {
    const backgrounds = [
      '出生在一个普通的工薪家庭，从小就展现出过人的天赋。',
      '来自农村的朴实家庭，靠自己的努力改变了命运。',
      '家境优渥，接受了良好的教育，但内心渴望真正的挑战。',
      '经历过家庭变故，早早学会了独立和坚强。',
      '在海外长大，带着东西方文化的融合视角看待世界。',
      '曾经是问题少年，后来找到了人生的方向。'
    ]
    return backgrounds[Math.floor(Math.random() * backgrounds.length)]
  }

  const generateAppearance = () => {
    const appearances = [
      '中等身材，面容清秀，眼神中透露着智慧的光芒。',
      '高挑的身材，轮廓分明的五官，给人一种可靠的感觉。',
      '小巧玲珑，笑容温暖，让人一见就感到亲切。',
      '身材魁梧，浓眉大眼，自带一种威严的气场。',
      '清瘦的身材，深邃的眼神，仿佛能看透人心。',
      '阳光帅气的外表下，藏着一颗细腻的心。'
    ]
    return appearances[Math.floor(Math.random() * appearances.length)]
  }

  const generateMotivation = () => {
    const motivations = [
      '追求真理和正义，希望通过自己的努力让世界变得更好。',
      '渴望成功和认可，证明自己的价值和能力。',
      '寻找生命的意义，探索未知的领域。',
      '保护所爱之人，为家人创造更好的生活。',
      '实现儿时的梦想，完成未竟的事业。',
      '摆脱过去的阴影，重新找回自我。'
    ]
    return motivations[Math.floor(Math.random() * motivations.length)]
  }

  const generateConflict = () => {
    const conflicts = [
      '内心的理想与现实的差距，常常陷入两难的抉择。',
      '过去的错误如同阴影，时刻影响着现在的判断。',
      '责任与自由的冲突，不知该为家人还是为自己而活。',
      '能力与野心的不匹配，渴望更多却力有不逮。',
      '信任与背叛的循环，难以真正敞开心扉。',
      '传统与创新的碰撞，在保守和突破间挣扎。'
    ]
    return conflicts[Math.floor(Math.random() * conflicts.length)]
  }

  const generateRelationships = () => {
    const relationships = [
      '有一个严厉但关心自己的父亲，关系复杂而微妙。',
      '最好的朋友是从小一起长大的伙伴，彼此信任。',
      '曾经深爱过的人现在成了最大的竞争对手。',
      '独自抚养自己长大的母亲，是生命中最重要的存在。',
      '有一个需要保护的妹妹，是她前进的动力。',
      '遇到了改变一生的导师，亦师亦友的关系。'
    ]
    return relationships[Math.floor(Math.random() * relationships.length)]
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadCharacter = () => {
    if (!character) return
    
    const content = `角色设定：${character.name}
年龄：${character.age}
性别：${character.gender}
职业：${character.occupation}
性格特点：${character.personality.join('、')}
外貌特征：${character.appearance}
背景故事：${character.background}
内在动机：${character.motivation}
主要冲突：${character.conflict}
人际关系：${character.relationships}
`
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${character.name}-角色设定.txt`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI角色生成器
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            为你的小说创作丰富立体的角色设定
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 生成控制面板 */}
          <Card>
            <CardHeader>
              <CardTitle>生成设置</CardTitle>
              <CardDescription>选择生成方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>自定义提示词（可选）</Label>
                <Textarea
                  placeholder="例如：一个神秘的古董店老板，年龄35岁..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => generateCharacter('random')}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? '生成中...' : '随机生成'}
                </Button>
                <Button 
                  onClick={() => generateCharacter('custom')}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  按提示生成
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 角色展示 */}
          <Card>
            <CardHeader>
              <CardTitle>角色设定</CardTitle>
              <CardDescription>生成的角色信息</CardDescription>
            </CardHeader>
            <CardContent>
              {character ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">{character.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {character.age}岁 · {character.gender} · {character.occupation}
                    </p>
                  </div>

                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">基础</TabsTrigger>
                      <TabsTrigger value="personality">性格</TabsTrigger>
                      <TabsTrigger value="background">背景</TabsTrigger>
                      <TabsTrigger value="story">故事</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-2">
                      <div><strong>外貌：</strong>{character.appearance}</div>
                    </TabsContent>
                    
                    <TabsContent value="personality" className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {character.personality.map((trait) => (
                          <Badge key={trait} variant="secondary">{trait}</Badge>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="background" className="space-y-2">
                      <div><strong>背景：</strong>{character.background}</div>
                    </TabsContent>
                    
                    <TabsContent value="story" className="space-y-2">
                      <div><strong>动机：</strong>{character.motivation}</div>
                      <div><strong>冲突：</strong>{character.conflict}</div>
                      <div><strong>关系：</strong>{character.relationships}</div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => copyToClipboard(JSON.stringify(character, null, 2))}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </Button>
                    <Button 
                      onClick={downloadCharacter}
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载
                    </Button>
                    <Button 
                      onClick={() => generateCharacter('random')}
                      variant="ghost"
                      size="sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      重新生成
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>点击上方按钮生成角色</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}