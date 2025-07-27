'use client'

import { Search, BookOpen, FileText, Scissors, Type, Palette, Moon, Sun, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const tools = [
  {
    id: 'novel-splitter',
    name: '小说章节拆解',
    description: '将txt格式的小说按章节拆解成单独的Markdown文档',
    icon: Scissors,
    href: '/tools/novel-splitter',
    category: '文本处理',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500'
  },
  {
    id: 'character-creator',
    name: '角色生成器',
    description: '创建丰富的人物设定和背景故事',
    icon: Type,
    href: '/tools/character-creator',
    category: '创作辅助',
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500'
  },
  {
    id: 'name-generator',
    name: '角色名生成器',
    description: '为你的小说角色生成合适的名字',
    icon: Users,
    href: '/tools/name-generator',
    category: '创作辅助',
    color: 'from-indigo-500 to-blue-500',
    gradient: 'bg-gradient-to-br from-indigo-500 to-blue-500'
  },
  {
    id: 'plot-helper',
    name: '情节助手',
    description: '协助构建故事情节和发展脉络',
    icon: BookOpen,
    href: '/tools/plot-helper',
    category: '创作辅助',
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-500'
  },
  {
    id: 'world-builder',
    name: '世界观构建',
    description: '创建完整的世界设定和背景体系',
    icon: FileText,
    href: '#',
    category: '设定工具',
    color: 'from-orange-500 to-amber-500',
    gradient: 'bg-gradient-to-br from-orange-500 to-amber-500'
  },
  {
    id: 'style-guide',
    name: '文风分析',
    description: '分析和模仿不同作者的写作风格',
    icon: Palette,
    href: '/tools/style-guide',
    category: '分析工具',
    color: 'from-pink-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-500 to-rose-500'
  }
]

const categories = ['全部', '文本处理', '创作辅助', '设定工具', '分析工具']

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeCategory, setActiveCategory] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      (localStorage.getItem('darkMode') === null && 
       window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const filteredTools = tools.filter(tool => 
    activeCategory === '全部' || tool.category === activeCategory
  ).filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/30"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              AI增强版 v2.0
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              智能小说创作工具集
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
              为现代作家打造的AI驱动创作平台，让创作更高效，让灵感更自由
            </p>
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">6+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">专业工具</div>
              </div>
              <div className="w-px bg-gray-200 dark:bg-gray-700 self-stretch hidden md:block"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">1000+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">作家信赖</div>
              </div>
              <div className="w-px bg-gray-200 dark:bg-gray-700 self-stretch hidden md:block"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">∞</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">创作可能</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16 relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="搜索工具..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-600 input-focus"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 btn-animate ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transform hover:-translate-y-1 card-hover animate-in"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} shadow-lg transform transition-transform group-hover:scale-110`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    立即体验
                    <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        
        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg">
              <div className="text-gray-400 dark:text-gray-500">
                <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">没有找到匹配的工具</h3>
                <p className="text-sm">请尝试其他搜索关键词或分类</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">小说创作工具集</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">让创作更简单，让灵感更自由。为现代作家打造的AI驱动创作平台</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400 mb-10">
              <a href="#" className="hover:text-white transition-colors btn-animate">关于我们</a>
              <a href="#" className="hover:text-white transition-colors btn-animate">使用指南</a>
              <a href="#" className="hover:text-white transition-colors btn-animate">联系支持</a>
              <a href="#" className="hover:text-white transition-colors btn-animate">API文档</a>
            </div>
            <div className="pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-500">© 2024 小说创作工具集. 使用 AI 技术驱动创作未来</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}