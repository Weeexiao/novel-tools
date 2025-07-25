'use client'

import { Home, Moon, Sun, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const [darkMode, setDarkMode] = useState(false)

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

  return (
    <header className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  小说创作工具集
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI驱动的创作助手</p>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Home className="h-4 w-4" />
              <span>首页</span>
            </Link>
            <Link 
              href="/tools/novel-splitter" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              章节拆解
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-500" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}