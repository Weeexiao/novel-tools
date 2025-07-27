'use client'

import { useState, useRef } from 'react'
import { Upload, Download, FileText, AlertCircle, BookOpen, Trash2 } from 'lucide-react'
import JSZip from 'jszip'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDropzone } from 'react-dropzone'

interface Chapter {
  title: string
  content: string
  index: number
  wordCount: number
}

export default function NovelSplitter() {
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [prefix, setPrefix] = useState<string>('第,Chapter,章节')
  const [minLength, setMinLength] = useState<number>(1000)
  const [processing, setProcessing] = useState<boolean>(false)
  const [downloading, setDownloading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        handleFileSelect(acceptedFiles[0])
      }
    },
    accept: {
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1
  })

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'text/plain' && !selectedFile.name.endsWith('.txt')) {
      setError('请选择TXT格式的文件')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('文件大小不能超过10MB')
      return
    }

    setFile(selectedFile)
    setError('')

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setFileContent(content)
    }
    reader.onerror = () => {
      setError('读取文件时出错')
    }
    reader.readAsText(selectedFile)
  }

  const processFile = () => {
    if (!fileContent) return

    setProcessing(true)
    setChapters([])
    setError('')

    try {
      // 模拟处理过程
      setTimeout(() => {
        const prefixes = prefix.split(',').map(p => p.trim()).filter(p => p)
      const lines = fileContent.split('\n')
      const detectedChapters: Chapter[] = []
      let currentChapter: Chapter | null = null
      let chapterIndex = 1

        lines.forEach((line, lineIndex) => {
          const trimmedLine = line.trim()
          
          // 检查是否是章节标题
          const isChapterTitle = prefixes.some(p => 
            trimmedLine.startsWith(p) || 
            trimmedLine.includes(`${p} `) || 
            trimmedLine.includes(`${p}　`) // 中文空格
          )

          if (isChapterTitle && trimmedLine.length > 0) {
            // 保存上一章节
            if (currentChapter && (currentChapter as Chapter).content.length >= minLength) {
              detectedChapters.push(currentChapter);
            }

            // 创建新章节
            currentChapter = {
              title: trimmedLine,
              content: '',
              index: chapterIndex++,
              wordCount: 0
            }
          } else if (currentChapter) {
            // 添加内容到当前章节
            (currentChapter as Chapter).content += line + '\n';
            (currentChapter as Chapter).wordCount = (currentChapter as Chapter).content.length;
          }
        })

        // 添加最后一个章节
        if (currentChapter && (currentChapter as Chapter).content.length >= minLength) {
          detectedChapters.push(currentChapter);
        }

        setChapters(detectedChapters)
        setProcessing(false)
      }, 1500)
    } catch (err) {
      setError('处理文件时出错: ' + (err as Error).message)
      setProcessing(false)
    }
  }

  const downloadChapter = (chapter: Chapter) => {
    const blob = new Blob([`# ${chapter.title}\n\n${chapter.content}`], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${chapter.index}-${chapter.title}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAll = async () => {
    if (chapters.length === 0) return

    setDownloading(true)
    setError('')

    try {
      const zip = new JSZip()
      
      chapters.forEach((chapter) => {
        const content = `# ${chapter.title}\n\n${chapter.content}`
        zip.file(`${chapter.index}-${chapter.title}.md`, content)
      })

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '小说章节打包.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('打包文件时出错: ' + (err as Error).message)
    } finally {
      setDownloading(false)
    }
  }

  const clearAll = () => {
    setFile(null)
    setFileContent('')
    setChapters([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">小说章节拆分工具</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            上传您的小说文本文件，智能识别章节结构并拆分成独立的Markdown文档
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm dark:shadow-gray-900/20 mb-6">
              <CardHeader>
                <CardTitle className="dark:text-white">文件上传</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  上传TXT格式的小说文件
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <input {...getInputProps()} />
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {isDragActive ? '松开文件以上传' : '拖拽文件到此处或点击上传'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    支持TXT格式，最大10MB
                  </p>
                </div>
                
                {file && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearAll}
                      className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm dark:shadow-gray-900/20">
              <CardHeader>
                <CardTitle className="dark:text-white">拆分设置</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  配置章节识别规则
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">章节标题前缀</Label>
                  <Input
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="例如：第、Chapter、章节"
                    className="dark:bg-gray-700/50 dark:text-white dark:border-gray-600/50 backdrop-blur-xl"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    用于识别章节标题的关键词，多个关键词用逗号分隔
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="dark:text-gray-200">最小章节长度</Label>
                  <Input
                    type="number"
                    value={minLength}
                    onChange={(e) => setMinLength(Number(e.target.value))}
                    min="100"
                    className="dark:bg-gray-700/50 dark:text-white dark:border-gray-600/50 backdrop-blur-xl"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    忽略少于指定字符的章节
                  </p>
                </div>

                <Button 
                  onClick={processFile} 
                  disabled={!fileContent || processing}
                  className="w-full"
                >
                  {processing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                      处理中...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      开始拆分
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm dark:shadow-gray-900/20 h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="dark:text-white">章节预览</CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      {chapters.length > 0 
                        ? `共识别到 ${chapters.length} 个章节` 
                        : '等待处理文件'}
                    </CardDescription>
                  </div>
                  {chapters.length > 0 && (
                    <Button 
                      onClick={downloadAll} 
                      disabled={downloading}
                      className="btn-animate"
                    >
                      {downloading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                          打包中...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          打包下载
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                    <AlertCircle className="inline h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}
                
                {chapters.length > 0 ? (
                  <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                    {chapters.map((chapter, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {chapter.title}
                          </h3>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => downloadChapter(chapter)}
                            className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700/50"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            下载
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                          {chapter.content.substring(0, 150)}...
                        </p>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {chapter.content.length.toLocaleString()} 字符
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-16 h-16 mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-1">等待处理文件</h3>
                    <p className="text-sm text-center">
                      上传小说文件并点击"开始拆分"按钮<br />
                      系统将自动识别章节结构
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
