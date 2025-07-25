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
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { BookOpen, Download, RefreshCw, Sparkles, Target, Drama, Clock } from 'lucide-react'

interface StoryElement {
  protagonist: string
  goal: string
  obstacle: string
  setting: string
  genre: string
  tone: string
}

interface PlotPoint {
  id: string
  title: string
  description: string
  act: number
  type: 'setup' | 'conflict' | 'climax' | 'resolution'
  emotionalImpact: number
  timing: number
}

interface PlotStructure {
  title: string
  description: string
  acts: PlotPoint[]
  genre: string
  tone: string
}

const genres = [
  { value: 'romance', label: '爱情', icon: '❤️' },
  { value: 'mystery', label: '悬疑', icon: '🔍' },
  { value: 'scifi', label: '科幻', icon: '🚀' },
  { value: 'fantasy', label: '奇幻', icon: '🐉' },
  { value: 'thriller', label: '惊悚', icon: '⚡' },
  { value: 'drama', label: '现实', icon: '🎭' },
  { value: 'comedy', label: '喜剧', icon: '😄' },
  { value: 'tragedy', label: '悲剧', icon: '💔' }
]

const tones = [
  { value: 'light', label: '轻松', color: 'text-green-600' },
  { value: 'dark', label: '黑暗', color: 'text-red-600' },
  { value: 'neutral', label: '中性', color: 'text-gray-600' },
  { value: 'emotional', label: '感性', color: 'text-purple-600' },
  { value: 'intellectual', label: '理性', color: 'text-blue-600' }
]

const plotTemplates = {
  'three-act': {
    name: '三幕式结构',
    acts: [
      { title: '第一幕：设定', percentage: 25, type: 'setup' },
      { title: '第二幕：对抗', percentage: 50, type: 'conflict' },
      { title: '第三幕：解决', percentage: 25, type: 'resolution' }
    ]
  },
  'hero-journey': {
    name: '英雄旅程',
    acts: [
      { title: '平凡世界', percentage: 15, type: 'setup' },
      { title: '冒险召唤', percentage: 10, type: 'setup' },
      { title: '跨越门槛', percentage: 15, type: 'conflict' },
      { title: '试炼之路', percentage: 25, type: 'conflict' },
      { title: '最终考验', percentage: 20, type: 'climax' },
      { title: '回归', percentage: 15, type: 'resolution' }
    ]
  },
  'kishotenketsu': {
    name: '起承转合',
    acts: [
      { title: '起：介绍', percentage: 25, type: 'setup' },
      { title: '承：发展', percentage: 25, type: 'setup' },
      { title: '转：转折', percentage: 25, type: 'climax' },
      { title: '合：结局', percentage: 25, type: 'resolution' }
    ]
  }
}

export default function PlotHelper() {
  const [storyElements, setStoryElements] = useState<StoryElement>({
    protagonist: '',
    goal: '',
    obstacle: '',
    setting: '',
    genre: 'romance',
    tone: 'light'
  })
  
  const [plotStructure, setPlotStructure] = useState<PlotStructure | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('three-act')
  const [complexity, setComplexity] = useState([5])
  const [includeSubplots, setIncludeSubplots] = useState(false)

  const generatePlot = async () => {
    setLoading(true)
    
    setTimeout(() => {
      const template = plotTemplates[selectedTemplate as keyof typeof plotTemplates]
      const plot = generatePlotFromElements(storyElements, template, complexity[0], includeSubplots)
      setPlotStructure(plot)
      setLoading(false)
    }, 1500)
  }

  const generatePlotFromElements = (elements: StoryElement, template: any, complexity: number, includeSubplots: boolean): PlotStructure => {
    const acts: PlotPoint[] = []
    let currentPosition = 0

    template.acts.forEach((act: any, index: number) => {
      const plotPoint = generatePlotPoint(elements, act, index, currentPosition)
      acts.push(plotPoint)
      currentPosition += act.percentage
    })

    if (includeSubplots) {
      // 添加子情节
      const subPlot = generateSubplot(elements, complexity)
      acts.splice(2, 0, subPlot)
    }

    return {
      title: `${elements.genre}故事：${elements.protagonist}的${elements.goal}`,
      description: generateStoryDescription(elements),
      acts,
      genre: elements.genre,
      tone: elements.tone
    }
  }

  const generatePlotPoint = (elements: StoryElement, act: any, index: number, timing: number): PlotPoint => {
    const genreSpecific = getGenreSpecificContent(elements.genre, act.type)
    
    return {
      id: `act-${index}`,
      title: act.title,
      description: `${genreSpecific.prefix} ${elements.protagonist} ${genreSpecific.action} ${elements.obstacle}，为了实现${elements.goal}。${genreSpecific.emotion}`,
      act: index + 1,
      type: act.type,
      emotionalImpact: Math.min(10, Math.max(1, Math.floor(Math.random() * 8) + 2)),
      timing
    }
  }

  const getGenreSpecificContent = (genre: string, type: string) => {
    const contentMap: Record<string, any> = {
      romance: {
        setup: { prefix: '在', action: '遇见了生命中的真爱', emotion: '内心充满了期待和忐忑。' },
        conflict: { prefix: '然而', action: '必须面对来自家庭和社会的阻碍', emotion: '爱情面临着严峻的考验。' },
        climax: { prefix: '最终', action: '决定为了爱情勇敢抗争', emotion: '所有的矛盾在这一刻爆发。' },
        resolution: { prefix: '经过', action: '终于明白真爱的意义', emotion: '收获了幸福的结局。' }
      },
      mystery: {
        setup: { prefix: '平静的', action: '发现了一起离奇的案件', emotion: '好奇心被彻底激发。' },
        conflict: { prefix: '随着', action: '深入调查却陷入更大的谜团', emotion: '真相似乎越来越遥远。' },
        climax: { prefix: '当', action: '即将揭开真相时却面临生命危险', emotion: '真相与危险并存。' },
        resolution: { prefix: '通过', action: '成功破解了整个谜团', emotion: '正义最终战胜了邪恶。' }
      },
      scifi: {
        setup: { prefix: '在未来', action: '发现了改变世界的科技', emotion: '兴奋中带着一丝担忧。' },
        conflict: { prefix: '但是', action: '这项技术被邪恶势力盯上', emotion: '人类的命运悬于一线。' },
        climax: { prefix: '在', action: '必须做出拯救世界的选择', emotion: '责任与使命的重压之下。' },
        resolution: { prefix: '最终', action: '用智慧和勇气守护了人类的未来', emotion: '科技与人性的完美结合。' }
      }
    }
    
    return contentMap[genre]?.[type] || contentMap.romance[type]
  }

  const generateSubplot = (elements: StoryElement, complexity: number): PlotPoint => {
    const subplots = [
      '友情考验', '家庭矛盾', '事业抉择', '过去的秘密', '意外邂逅', '误会与和解'
    ]
    const selected = subplots[Math.floor(Math.random() * subplots.length)]
    
    return {
      id: 'subplot-1',
      title: `子情节：${selected}`,
      description: `在主线故事的同时，${elements.protagonist}还面临着${selected}的挑战，这将影响主线的发展。`,
      act: 2,
      type: 'conflict',
      emotionalImpact: Math.floor(Math.random() * 5) + 3,
      timing: 50
    }
  }

  const generateStoryDescription = (elements: StoryElement): string => {
    return `这是一个关于${elements.protagonist}的故事。在${elements.setting}的背景下，${elements.protagonist}必须克服${elements.obstacle}，才能实现${elements.goal}。整个故事充满${getToneDescription(elements.tone)}的氛围，展现了人性的复杂与成长。`
  }

  const getToneDescription = (tone: string): string => {
    const toneMap: Record<string, string> = {
      light: '轻松愉快',
      dark: '深沉黑暗',
      neutral: '客观理性',
      emotional: '情感丰富',
      intellectual: '理性思辨'
    }
    return toneMap[tone] || '丰富多彩'
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadPlot = () => {
    if (!plotStructure) return
    
    const content = `故事大纲：${plotStructure.title}

故事简介：
${plotStructure.description}

情节结构：
${plotStructure.acts.map((act, index) => `
${index + 1}. ${act.title}
   描述：${act.description}
   情感强度：${act.emotionalImpact}/10
   时间节点：${act.timing}%
`).join('')}

故事类型：${genres.find(g => g.value === plotStructure.genre)?.label}
故事基调：${tones.find(t => t.value === plotStructure.tone)?.label}
`
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${plotStructure.title}-故事大纲.txt`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI情节助手
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            为你的小说构建精彩的故事结构和情节发展
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 设置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>故事设定</CardTitle>
                <CardDescription>输入你的故事要素</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>主角姓名</Label>
                  <Input
                    placeholder="例如：李小明"
                    value={storyElements.protagonist}
                    onChange={(e) => setStoryElements(prev => ({ ...prev, protagonist: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>故事目标</Label>
                  <Input
                    placeholder="例如：成为武林盟主"
                    value={storyElements.goal}
                    onChange={(e) => setStoryElements(prev => ({ ...prev, goal: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>主要障碍</Label>
                  <Input
                    placeholder="例如：强大的敌人"
                    value={storyElements.obstacle}
                    onChange={(e) => setStoryElements(prev => ({ ...prev, obstacle: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>故事背景</Label>
                  <Textarea
                    placeholder="例如：现代都市"
                    value={storyElements.setting}
                    onChange={(e) => setStoryElements(prev => ({ ...prev, setting: e.target.value }))}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>故事类型</Label>
                    <Select value={storyElements.genre} onValueChange={(value) => setStoryElements(prev => ({ ...prev, genre: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map(genre => (
                          <SelectItem key={genre.value} value={genre.value}>
                            {genre.icon} {genre.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>故事基调</Label>
                    <Select value={storyElements.tone} onValueChange={(value) => setStoryElements(prev => ({ ...prev, tone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map(tone => (
                          <SelectItem key={tone.value} value={tone.value}>
                            <span className={tone.color}>{tone.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>结构设置</CardTitle>
                <CardDescription>选择情节结构</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>结构模板</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="three-act">三幕式结构</SelectItem>
                      <SelectItem value="hero-journey">英雄旅程</SelectItem>
                      <SelectItem value="kishotenketsu">起承转合</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>复杂度：{complexity[0]}</Label>
                  <Slider
                    value={complexity}
                    onValueChange={setComplexity}
                    max={10}
                    min={1}
                    step={1}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>包含子情节</Label>
                  <Switch
                    checked={includeSubplots}
                    onCheckedChange={setIncludeSubplots}
                  />
                </div>

                <Button 
                  onClick={generatePlot}
                  disabled={loading || !storyElements.protagonist || !storyElements.goal}
                  className="w-full"
                >
                  {loading ? '生成中...' : <><Sparkles className="w-4 h-4 mr-2" />生成情节</>}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 情节展示 */}
          <div className="lg:col-span-2">
            {plotStructure ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{plotStructure.title}</CardTitle>
                      <CardDescription>{plotStructure.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={downloadPlot}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                      <Button 
                        onClick={generatePlot}
                        size="sm"
                        variant="ghost"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        重新生成
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* 时间线 */}
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                      {plotStructure.acts.map((act, index) => (
                        <div key={act.id} className="relative flex items-start mb-8 last:mb-0">
                          <div className={`absolute left-2 w-4 h-4 rounded-full border-2 border-white ${
                            act.type === 'setup' ? 'bg-green-500' :
                            act.type === 'conflict' ? 'bg-yellow-500' :
                            act.type === 'climax' ? 'bg-red-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="ml-12 flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-lg">{act.title}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{act.timing}%</Badge>
                                <Badge className={`${
                                  act.emotionalImpact >= 8 ? 'bg-red-100 text-red-800' :
                                  act.emotionalImpact >= 6 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  <Drama className="w-3 h-3 mr-1" />
                                  {act.emotionalImpact}/10
                                </Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                              {act.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 故事标签 */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Badge variant="secondary">
                        {genres.find(g => g.value === plotStructure.genre)?.icon} {genres.find(g => g.value === plotStructure.genre)?.label}
                      </Badge>
                      <Badge variant="secondary">
                        {tones.find(t => t.value === plotStructure.tone)?.label}
                      </Badge>
                      {includeSubplots && <Badge variant="outline">含子情节</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">开始构建你的故事</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    在左侧输入故事要素，选择结构模板，然后点击生成按钮
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div className="text-center">
                      <Target className="w-6 h-6 mx-auto mb-1" />
                      <p>明确目标</p>
                    </div>
                    <div className="text-center">
                      <Clock className="w-6 h-6 mx-auto mb-1" />
                      <p>合理安排</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}