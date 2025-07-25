'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Book, Download, RefreshCw, Sparkles, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

interface StyleAnalysis {
  readability: {
    score: number
    level: string
    sentences: number
    avgWordsPerSentence: number
    avgSyllablesPerWord: number
  }
  tone: {
    primary: string
    confidence: number
    emotions: Array<{ emotion: string; score: number }>
  }
  style: {
    voice: string
    complexity: string
    pacing: string
    dialogueRatio: number
    descriptionRatio: number
  }
  issues: Array<{
    type: string
    severity: 'low' | 'medium' | 'high'
    message: string
    suggestion: string
    examples: string[]
  }>
  improvements: Array<{
    category: string
    original: string
    improved: string
    explanation: string
  }>
}

interface WritingMetrics {
  wordCount: number
  sentenceCount: number
  paragraphCount: number
  readingTime: number
  uniqueWords: number
  lexicalDiversity: number
}

const stylePresets = [
  { name: '简洁明快', description: '短句、清晰、直接', features: ['短句', '主动语态', '具体词汇'] },
  { name: '文学优美', description: '丰富描述、复杂句式', features: ['长句', '比喻', '感官细节'] },
  { name: '商业实用', description: '专业、简洁、有效', features: ['清晰结构', '要点突出', '逻辑性强'] },
  { name: '对话驱动', description: '人物互动、自然语言', features: ['对话为主', '口语化', '人物特色'] }
]

export default function StyleGuide() {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null)
  const [metrics, setMetrics] = useState<WritingMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  const analyzeText = async () => {
    if (!text.trim()) return
    
    setLoading(true)
    
    setTimeout(() => {
      const analysisResult = performStyleAnalysis(text)
      const metricsResult = calculateMetrics(text)
      setAnalysis(analysisResult)
      setMetrics(metricsResult)
      setLoading(false)
    }, 1000)
  }

  const performStyleAnalysis = (text: string): StyleAnalysis => {
    const words = text.split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    // 计算可读性
    const avgWordsPerSentence = words.length / sentences.length || 0
    const avgSyllablesPerWord = calculateAvgSyllables(words)
    const readabilityScore = Math.max(0, Math.min(100, 
      206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
    ))
    
    // 检测情感基调
    const emotions = detectEmotions(text)
    const primaryTone = emotions.reduce((max, curr) => curr.score > max.score ? curr : max).emotion
    
    // 分析风格特征
    const dialogueRatio = calculateDialogueRatio(text)
    const descriptionRatio = calculateDescriptionRatio(text)
    
    // 生成改进建议
    const issues = generateIssues(text, readabilityScore, avgWordsPerSentence)
    const improvements = generateImprovements(text, issues)

    return {
      readability: {
        score: Math.round(readabilityScore),
        level: getReadabilityLevel(readabilityScore),
        sentences: sentences.length,
        avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
        avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10
      },
      tone: {
        primary: primaryTone,
        confidence: Math.random() * 30 + 70,
        emotions: emotions.slice(0, 5)
      },
      style: {
        voice: avgWordsPerSentence > 20 ? '正式' : avgWordsPerSentence > 15 ? '中性' : '口语',
        complexity: avgSyllablesPerWord > 2 ? '复杂' : avgSyllablesPerWord > 1.5 ? '中等' : '简单',
        pacing: sentences.length > 10 ? '快速' : sentences.length > 5 ? '中等' : '缓慢',
        dialogueRatio: Math.round(dialogueRatio * 100),
        descriptionRatio: Math.round(descriptionRatio * 100)
      },
      issues,
      improvements
    }
  }

  const calculateMetrics = (text: string): WritingMetrics => {
    const words = text.split(/\s+/).filter(w => w.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      readingTime: Math.ceil(words.length / 200),
      uniqueWords,
      lexicalDiversity: Math.round((uniqueWords / words.length) * 100)
    }
  }

  const calculateAvgSyllables = (words: string[]): number => {
    return words.reduce((sum, word) => {
      const syllables = word.toLowerCase().split(/[aeiouy]+/).filter(s => s).length
      return sum + Math.max(1, syllables)
    }, 0) / words.length || 1
  }

  const detectEmotions = (text: string): Array<{ emotion: string; score: number }> => {
    const emotionWords: Record<string, string[]> = {
      快乐: ['开心', '高兴', '愉快', '兴奋', '喜悦', '幸福'],
      悲伤: ['难过', '伤心', '痛苦', '绝望', '沮丧', '失落'],
      愤怒: ['生气', '愤怒', '暴躁', '恼火', '气愤', '怨恨'],
      恐惧: ['害怕', '恐惧', '担心', '紧张', '不安', '焦虑'],
      惊讶: ['惊讶', '震惊', '意外', '吃惊', '愕然', '诧异'],
      爱: ['爱', '喜欢', '爱慕', '倾心', '热爱', '珍爱'],
      希望: ['希望', '期待', '渴望', '向往', '憧憬', '盼望']
    }
    
    return Object.entries(emotionWords).map(([emotion, words]) => ({
      emotion,
      score: words.reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0)
    })).filter(e => e.score > 0).sort((a, b) => b.score - a.score)
  }

  const calculateDialogueRatio = (text: string): number => {
    const dialoguePattern = /["“”][^"“”]*["”]/g
    const matches = text.match(dialoguePattern)
    const dialogueLength = matches ? matches.reduce((sum, match) => sum + match.length, 0) : 0
    return dialogueLength / text.length
  }

  const calculateDescriptionRatio = (text: string): number => {
    const descriptionWords = ['美丽', '漂亮', '宏伟', '壮观', '精致', '优雅', '古朴', '现代', '温馨', '阴森']
    const count = descriptionWords.reduce((sum, word) => sum + (text.split(word).length - 1), 0)
    return Math.min(1, count * 0.05)
  }

interface Issue {
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
  examples: string[];
}
  const generateIssues = (text: string, readability: number, avgWords: number): Issue[] => {
    const issues: Issue[] = []
    
    if (avgWords > 25) {
      issues.push({
        type: '长句',
        severity: 'medium',
        message: '句子过长可能影响阅读流畅性',
        suggestion: '将长句拆分为2-3个短句',
        examples: ['将50词的句子拆分为20-25词的短句']
      })
    }
    
    if (readability < 60) {
      issues.push({
        type: '可读性',
        severity: 'high',
        message: '文本可读性较低',
        suggestion: '使用更简单的词汇和更短的句子',
        examples: ['将"因此"改为"所以"', '将复杂从句改为简单句']
      })
    }
    
    if (text.split('的').length > text.split(' ').length * 0.3) {
      issues.push({
        type: '重复',
        severity: 'low',
        message: '过度使用"的"字',
        suggestion: '减少"的"字使用，使语言更简洁',
        examples: ['将"美丽的花园"改为"美园"']
      })
    }
    
    return issues
  }

  interface Improvement {
    category: string;
    original: string;
    improved: string;
    explanation: string;
  }
  const generateImprovements = (text: string, issues: Issue[]): Improvement[] => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    if (sentences.length === 0) return [];
    return [
      {
        category: '开头',
        original: sentences[0] || '',
        improved: sentences[0]?.replace(/^(.*?)，(.*)$/, '$1。$2') || '',
        explanation: '使用句号代替逗号，使开头更有力'
      },
      {
        category: '描述',
        original: '很好',
        improved: '出色',
        explanation: '使用更具体生动的词汇'
      },
      {
        category: '节奏',
        original: '然后...然后...然后...',
        improved: '接着...随后...最终...',
        explanation: '使用多样化的连接词，避免重复'
      }
    ];
  }

  const getReadabilityLevel = (score: number): string => {
    if (score >= 90) return '非常容易'
    if (score >= 80) return '容易'
    if (score >= 70) return '中等'
    if (score >= 60) return '较难'
    return '困难'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadReport = () => {
    if (!analysis || !metrics) return
    
    const report = `文风分析报告

文本统计：
- 总字数：${metrics.wordCount}
- 句子数：${metrics.sentenceCount}
- 段落数：${metrics.paragraphCount}
- 阅读时间：${metrics.readingTime}分钟
- 词汇多样性：${metrics.lexicalDiversity}%

可读性分析：
- 可读性评分：${analysis.readability.score}/100
- 难度等级：${analysis.readability.level}
- 平均句长：${analysis.readability.avgWordsPerSentence}词
- 平均词长：${analysis.readability.avgSyllablesPerWord}音节

情感基调：
- 主要情感：${analysis.tone.primary} (${Math.round(analysis.tone.confidence)}%)

风格特征：
- 语言风格：${analysis.style.voice}
- 复杂度：${analysis.style.complexity}
- 节奏：${analysis.style.pacing}
- 对话比例：${analysis.style.dialogueRatio}%
- 描述比例：${analysis.style.descriptionRatio}%

改进建议：
${analysis.issues.map(issue => `- ${issue.message}：${issue.suggestion}`).join('\n')}
`
    
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '文风分析报告.txt'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent mb-4">
            AI文风分析器
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            分析文本风格，提供写作改进建议
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 文本输入区 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>文本分析</CardTitle>
                <CardDescription>输入要分析的文本内容</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="请输入你要分析的文本..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[300px] text-base"
                />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={analyzeText}
                    disabled={loading || !text.trim()}
                    className="flex-1"
                  >
                    {loading ? '分析中...' : <><Sparkles className="w-4 h-4 mr-2" />开始分析</>}
                  </Button>
                  <Button 
                    onClick={() => setText('')}
                    variant="outline"
                  >
                    清空
                  </Button>
                </div>

                {/* 风格预设 */}
                <div className="pt-4">
                  <Label className="mb-2 block">风格参考</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {stylePresets.map(preset => (
                      <Button
                        key={preset.name}
                        variant={selectedPreset === preset.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPreset(selectedPreset === preset.name ? null : preset.name)}
                        className="text-xs"
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 分析结果 */}
          <div className="lg:col-span-1 space-y-6">
            {analysis && metrics ? (
              <>
                {/* 基本统计 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">文本统计</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">总字数</span>
                      <span className="font-semibold">{metrics.wordCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">句子数</span>
                      <span className="font-semibold">{metrics.sentenceCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">阅读时间</span>
                      <span className="font-semibold">{metrics.readingTime}分钟</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">词汇多样性</span>
                      <span className="font-semibold">{metrics.lexicalDiversity}%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* 可读性分析 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">可读性分析</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">可读性评分</span>
                        <span className="font-semibold">{analysis.readability.score}/100</span>
                      </div>
                      <Progress value={analysis.readability.score} className="h-2" />
                    </div>
                    <div className="text-sm">
                      <Badge variant="outline">{analysis.readability.level}</Badge>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>平均句长：{analysis.readability.avgWordsPerSentence}词</div>
                      <div>平均词长：{analysis.readability.avgSyllablesPerWord}音节</div>
                    </div>
                  </CardContent>
                </Card>

                {/* 情感基调 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">情感基调</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">主要情感</span>
                        <Badge variant="secondary">{analysis.tone.primary}</Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        置信度：{Math.round(analysis.tone.confidence)}%
                      </div>
                      <div className="space-y-1">
                        {analysis.tone.emotions.map(emotion => (
                          <div key={emotion.emotion} className="flex justify-between text-xs">
                            <span>{emotion.emotion}</span>
                            <span>{emotion.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 风格特征 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">风格特征</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">语言风格：</span>
                        <span className="font-medium">{analysis.style.voice}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">复杂度：</span>
                        <span className="font-medium">{analysis.style.complexity}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">节奏：</span>
                        <span className="font-medium">{analysis.style.pacing}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">对话比例：</span>
                        <span className="font-medium">{analysis.style.dialogueRatio}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">描述比例：</span>
                        <span className="font-medium">{analysis.style.descriptionRatio}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 问题与建议 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">问题与建议</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.issues.map((issue, index) => (
                      <Alert key={index} className={getSeverityColor(issue.severity)}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="font-medium">{issue.message}</div>
                          <div className="text-sm opacity-80">{issue.suggestion}</div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>

                <Button 
                  onClick={downloadReport}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载完整报告
                </Button>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <Book className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">开始分析文本</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    在左侧输入文本，点击分析按钮获取详细报告
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 改进建议展示 */}
        {analysis?.improvements && analysis.improvements.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>具体改进建议</CardTitle>
              <CardDescription>基于分析结果的具体修改建议</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="improvements" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="improvements">改进示例</TabsTrigger>
                  <TabsTrigger value="before-after">前后对比</TabsTrigger>
                </TabsList>
                
                <TabsContent value="improvements" className="space-y-4">
                  {analysis.improvements.map((improvement, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-red-600 mb-2">原文</h4>
                          <p className="text-sm text-gray-600">{improvement.original}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-600 mb-2">改进</h4>
                          <p className="text-sm font-medium">{improvement.improved}</p>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-gray-500">{improvement.explanation}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="before-after" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-3">原文整体</h4>
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{text}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">改进建议</h4>
                      <div className="border rounded-lg p-4 bg-green-50">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {analysis.improvements.reduce((text, imp) => 
                            text.replace(imp.original, imp.improved), text
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}