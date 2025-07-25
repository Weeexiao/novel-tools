'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, Download, FileText, AlertCircle, Sparkles, Clock, CheckCircle, Loader2, BookOpen, Trash2 } from 'lucide-react'
import JSZip from 'jszip'

interface Chapter {
  title: string
  content: string
  index: number
  wordCount: number
}

interface ProcessingStatus {
  step: string
  progress: number
  message: string
}

export default function NovelSplitter() {
  const [file, setFile] = useState<File | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [dragOver, setDragOver] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      validateAndProcessFile(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      validateAndProcessFile(droppedFile)
    }
  }

  const validateAndProcessFile = (file: File) => {
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('文件大小不能超过10MB')
        return
      }
      setFile(file)
      setError('')
      processFile(file)
    } else {
      setError('请选择TXT格式的文件')
    }
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setError('')
    setProcessingStatus({ step: 'reading', progress: 20, message: '正在读取文件...' })

    try {
      const text = await file.text()
      setProcessingStatus({ step: 'parsing', progress: 40, message: '正在分析章节结构...' })
      
      await new Promise(resolve => setTimeout(resolve, 500)) // 模拟处理时间
      
      setProcessingStatus({ step: 'detecting', progress: 70, message: '正在识别章节...' })
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const detectedChapters = detectChapters(text)
      
      setProcessingStatus({ step: 'complete', progress: 100, message: '处理完成！' })
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setChapters(detectedChapters)
      setProcessingStatus(null)
    } catch (err) {
      setError('文件读取失败，请重试')
      setProcessingStatus(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const detectChapters = (text: string): Chapter[] => {
    const chapters: Chapter[] = []
    
    // 过滤广告和无关内容
    const adKeywords = ['打包下载', '免费下载', '全集电子书', '存储服务', '下载服务']
    const lines = text.split('\n').filter(line => {
      const trimmedLine = line.trim()
      return trimmedLine.length > 0 && 
             !adKeywords.some(keyword => trimmedLine.includes(keyword)) &&
             !trimmedLine.match(/^\s*\d+\.?\s*字符\s*$/)
    }).join('\n')

    // 更精确的章节标题正则表达式
    const chapterPatterns = [
      /^\s*第[\d一二三四五六七八九十百千万零]+[章回节篇卷集部]/gm,
      /^\s*Chapter\s+\d+/gim,
      /^\s*CHAPTER\s+\d+/gim,
      /^\s*第\d+[章回节篇卷集部]/gm,
      /^\s*[\d一二三四五六七八九十百千万]+[章回节篇卷集部]/gm,
      /^\s*\d+\.\s*[一-龥a-zA-Z][一-龥a-zA-Z0-9\s]*/gm,
      /^\s*[一-龥]+[章回节篇卷集部][一-龥0-9\s]*/gm
    ]

    let bestMatch = null
    let maxMatches = 0

    // 找到匹配最多的模式
    for (const pattern of chapterPatterns) {
      const matches = Array.from(lines.matchAll(pattern))
      if (matches.length > maxMatches && matches.length > 1) {
        maxMatches = matches.length
        bestMatch = { pattern, matches }
      }
    }

    if (bestMatch) {
      const { pattern, matches } = bestMatch
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i]
        const startIndex = match.index!
        const endIndex = i + 1 < matches.length ? matches[i + 1].index! : lines.length
        
        const title = match[0].trim()
        const content = lines.substring(startIndex, endIndex).trim()
        const wordCount = content.length
        
        // 过滤过短的章节（至少500字符）
        if (wordCount >= 500) {
          chapters.push({
            title: title || `第${i + 1}章`,
            content,
            index: chapters.length + 1,
            wordCount
          })
        }
      }
    }

    // 如果没有找到章节，将整个文本作为一个章节（如果内容足够长）
    if (chapters.length === 0 && lines.trim().length >= 1000) {
      chapters.push({
        title: '全文',
        content: lines.trim(),
        index: 1,
        wordCount: lines.length
      })
    }

    return chapters
  }

  const downloadMarkdown = (chapter: Chapter) => {
    const markdownContent = `# ${chapter.title}

字数：${chapter.wordCount}

---

${chapter.content}`
    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${chapter.title.replace(/[^\u4e00-\u9fa5\w]/g, '_')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAllAsZip = async () => {
    if (chapters.length === 0) return

    setIsProcessing(true)
    setProcessingStatus({ step: 'zipping', progress: 50, message: '正在打包文件...' })

    try {
      const zip = new JSZip()
      
      chapters.forEach(chapter => {
        const markdownContent = `# ${chapter.title}

字数：${chapter.wordCount}

---

${chapter.content}`
        zip.file(`${chapter.title.replace(/[^\u4e00-\u9fa5\w]/g, '_')}.md`, markdownContent)
      })

      setProcessingStatus({ step: 'finalizing', progress: 80, message: '正在完成打包...' })

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${file?.name.replace('.txt', '') || 'novel'}_chapters.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setProcessingStatus({ step: 'done', progress: 100, message: '打包完成！' })
      setTimeout(() => setProcessingStatus(null), 2000)
    } catch (err) {
      setError('打包失败，请重试')
      setProcessingStatus(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setChapters([])
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="fixed inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mb-4">
            <BookOpen className="h-4 w-4 mr-2" />
            智能章节识别
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            小说章节拆解工具
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            智能识别TXT小说中的章节结构，一键拆分为独立的Markdown文档
          </p>
        </div>

        {/* File Upload Section */}
        {!file && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                上传您的小说文件
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                支持TXT格式，最大10MB，智能识别多种章节格式
              </p>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                dragOver
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  拖拽文件到此处，或
                  <label className="text-blue-600 hover:text-blue-500 cursor-pointer ml-1">
                    点击选择文件
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".txt"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  支持第X章、Chapter X、第X回等多种格式
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* File Info */}
        {file && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{file.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)} • {chapters.length > 0 ? `${chapters.length}章节` : '待处理'}
                  </p>
                </div>
              </div>
              <button
                onClick={clearFile}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && processingStatus && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-6">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{processingStatus.progress}%</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {processingStatus.message}
              </h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingStatus.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {chapters.length > 0 && !isProcessing && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  识别结果
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  共识别到 {chapters.length} 个章节，总计 {chapters.reduce((sum, c) => sum + c.wordCount, 0).toLocaleString()} 字符
                </p>
              </div>
              <button
                onClick={downloadAllAsZip}
                disabled={isProcessing}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>打包下载全部</span>
              </button>
            </div>

            <div className="grid gap-4">
              {chapters.map((chapter) => (
                <div 
                  key={chapter.index} 
                  className="group border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {chapter.wordCount.toLocaleString()} 字符
                      </p>
                    </div>
                    <button
                      onClick={() => downloadMarkdown(chapter)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-500 transition-all duration-200"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!file && !isProcessing && (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              开始您的创作之旅
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              上传您的小说文件，体验智能章节识别功能
            </p>
          </div>
        )}
      </div>
    </div>
  )
}