'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Copy, RefreshCw } from 'lucide-react'

// 定义名字类型
const nameTypes = [
  { value: 'ancient', label: '古风' },
  { value: 'protagonist', label: '主角' },
  { value: 'western', label: '西方' },
  { value: 'modern', label: '现代' },
  { value: 'fantasy', label: '奇幻' },
  { value: 'japanese', label: '日式' },
  { value: 'korean', label: '韩式' },
]

// 姓氏词库
const surnames = {
  ancient: ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'],
  protagonist: ['叶', '林', '苏', '沈', '楚', '秦', '顾', '许', '萧', '陆', '韩', '唐', '宋', '夏', '江', '方', '武', '凌', '白', '龙'],
  western: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'],
  modern: ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'],
  fantasy: ['雷', '风', '火', '冰', '影', '光', '暗', '星', '月', '日', '夜', '晨', '暮', '霜', '雪', '云', '电', '岩', '海', '森'],
  japanese: ['佐藤', '铃木', '高桥', '田中', '渡边', '伊藤', '山本', '中村', '小林', '斋藤', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '清水'],
  korean: ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '류', '홍'],
}

// 名字词库
const givenNames = {
  ancient: {
    male: ['伟', '强', '军', '磊', '涛', '明', '超', '峰', '帅', '飞', '帅', '波', '辉', '刚', '勇', '斌', '浩', '亮', '鹏', '杰'],
    female: ['丽', '敏', '静', '霞', '燕', '娟', '艳', '娜', '芳', '婷', '秀英', '倩', '雪', '丽', '晶', '慧', '红', '丽', '倩', '悦']
  },
  protagonist: {
    male: ['尘', '轩', '墨', '羽', '辰', '逸', '枫', '寒', '夜', '瑾', '炎', '熙', '洛', '渊', '翎', '烬', '玄', '澈', '溟', '曜'],
    female: ['雪', '瑶', '萱', '芷', '璃', '婉', '晴', '媱', '曦', '霓', '裳', '嫣', '绫', '晗', '汐', '茉', '芊', '芮', '芙', '珞']
  },
  western: {
    male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Donald', 'Mark', 'Paul', 'Steven', 'Andrew', 'Kenneth'],
    female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle']
  },
  modern: {
    male: ['浩然', '子涵', '宇轩', '梓睿', '俊杰', '欣怡', '诗涵', '雅静', '雨桐', '佳怡', '志强', '俊豪', '思雨', '嘉豪', '雨萱', '智宸', '正豪', '昊然', '明杰', '修杰'],
    female: ['欣怡', '诗涵', '雅静', '雨桐', '睿婕', '佳怡', '雪丽', '依娜', '美琳', '雅芙', '雨婷', '梦洁', '雅彤', '歆瑶', '诗妍', '静蕾', '笑薇', '雪倩', '滢倩', '沐卉']
  },
  fantasy: {
    male: ['天行', '破军', '贪狼', '七杀', '太阴', '太阳', '紫微', '天府', '武曲', '天相', '廉贞', '巨门', '天机', '天梁', '文昌', '文曲', '左辅', '右弼', '擎羊', '陀罗'],
    female: ['凤舞', '凰歌', '月华', '星辉', '花影', '雪音', '云裳', '水韵', '风吟', '雷鸣', '电闪', '冰心', '火焰', '土灵', '金魂', '木魄', '光翼', '暗影', '圣洁', '魔灵']
  },
  japanese: {
    male: ['太郎', '次郎', '三郎', '四郎', '五郎', '一郎', '健太', '翔太', '大辅', '拓也', '直人', '和也', '优斗', '莲', '翼', '悠真', '凑', '虎之助', '岳', '海人'],
    female: ['花子', '美子', '惠子', '洋子', '纪子', '裕子', '明美', '智子', '典子', '由美', '爱美', '加奈', '千代', '千春', '千夏', '千秋', '千冬', '千代', '美咲', '彩花']
  },
  korean: {
    male: ['민준', '서준', '예준', '도현', '시우', '주원', '하준', '지후', '유준', '선우', '재윤', '도윤', '시윤', '하윤', '지훈', '지원', '재혁', '도혁', '시혁', '하혁'],
    female: ['서연', '지우', '수빈', '지민', '하린', '유진', '다은', '예은', '하은', '채원', '지윤', '수연', '서윤', '지연', '소율', '예린', '나연', '다인', '지아', '하율']
  }
}

// 古风名字词库（更复杂的组合）
const ancientComplexNames = {
  male: [
    '慕容', '欧阳', '司马', '诸葛', '东方', '独孤', '南宫', '西门', '上官', '夏侯',
    '诸葛', '皇甫', '尉迟', '长孙', '宇文', '轩辕', '令狐', '钟离', '澹台', '公孙'
  ],
  female: [
    '慕容', '欧阳', '司马', '诸葛', '东方', '独孤', '南宫', '西门', '上官', '夏侯',
    '诸葛', '皇甫', '尉迟', '长孙', '宇文', '轩辕', '令狐', '钟离', '澹台', '公孙'
  ]
}

const ancientGivenNames = {
  male: [
    '逸尘', '墨轩', '瑾瑜', '寒星', '夜辰', '凌霄', '无痕', '傲天', '擎天', '御风',
    '破晓', '断念', '绝尘', '问天', '逐日', '斩月', '焚天', '灭地', '惊鸿', '流云'
  ],
  female: [
    '倾城', '若雪', '凝霜', '梦璃', '琉璃', '紫萱', '青鸢', '霓裳', '红颜', '绝代',
    '倾国', '如玉', '冰心', '雪瑶', '月华', '星雨', '云裳', '水月', '凤舞', '凰歌'
  ]
}

export default function NameGenerator() {
  const [nameType, setNameType] = useState('ancient')
  const [gender, setGender] = useState('male')
  const [generatedNames, setGeneratedNames] = useState<string[]>([])
  const [count, setCount] = useState(5)

  const generateNames = () => {
    const names = []
    const surnameList = surnames[nameType as keyof typeof surnames] || surnames.ancient
    const givenNameList = givenNames[nameType as keyof typeof givenNames]?.[gender as keyof (typeof givenNames)[keyof typeof givenNames]] || givenNames.ancient.male

    for (let i = 0; i < count; i++) {
      if (nameType === 'ancient' && Math.random() > 0.7) {
        // 30%概率生成复姓
        const complexSurname = ancientComplexNames[gender as keyof typeof ancientComplexNames][
          Math.floor(Math.random() * ancientComplexNames[gender as keyof typeof ancientComplexNames].length)
        ]
        const givenName = ancientGivenNames[gender as keyof typeof ancientGivenNames][
          Math.floor(Math.random() * ancientGivenNames[gender as keyof typeof ancientGivenNames].length)
        ]
        names.push(complexSurname + givenName)
      } else {
        const surname = surnameList[Math.floor(Math.random() * surnameList.length)]
        const givenName = givenNameList[Math.floor(Math.random() * givenNameList.length)]
        names.push(surname + givenName)
      }
    }

    setGeneratedNames(names)
  }

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name)
  }

  const copyAll = () => {
    navigator.clipboard.writeText(generatedNames.join('\n'))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">角色名生成器</h1>
          <p className="text-gray-600 dark:text-gray-400">
            为你的小说角色生成合适的名字
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm dark:shadow-gray-900/20">
            <CardHeader>
              <CardTitle className="dark:text-white">生成设置</CardTitle>
              <CardDescription className="dark:text-gray-300">
                选择名字类型和生成数量
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="dark:text-gray-200">名字类型</Label>
                <Select value={nameType} onValueChange={setNameType}>
                  <SelectTrigger className="dark:bg-gray-700/50 dark:text-white dark:border-gray-600/50 backdrop-blur-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700/80 dark:border-gray-600/50 dark:backdrop-blur-xl">
                    {nameTypes.map((type) => (
                      <SelectItem 
                        key={type.value} 
                        value={type.value}
                        className="dark:text-white dark:hover:bg-gray-600/50"
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-200">性别</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={gender === 'male' ? 'default' : 'outline'}
                    onClick={() => setGender('male')}
                    className={gender === 'male' ? '' : 'dark:border-gray-600 dark:text-white'}
                  >
                    男性
                  </Button>
                  <Button
                    variant={gender === 'female' ? 'default' : 'outline'}
                    onClick={() => setGender('female')}
                    className={gender === 'female' ? '' : 'dark:border-gray-600 dark:text-white'}
                  >
                    女性
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-200">生成数量: {count}</Label>
                <Input
                  type="range"
                  min="1"
                  max="20"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="dark:bg-gray-700/50 dark:text-white dark:border-gray-600/50 backdrop-blur-xl [&::-webkit-slider-thumb]:bg-blue-500 [&::-moz-range-thumb]:bg-blue-500"
                />
              </div>

              <Button 
                onClick={generateNames} 
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                生成名字
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm dark:shadow-gray-900/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="dark:text-white">生成结果</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    点击名字可复制到剪贴板
                  </CardDescription>
                </div>
                {generatedNames.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyAll}
                    className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700/50"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    全部复制
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedNames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {generatedNames.map((name, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
                      onClick={() => copyName(name)}
                    >
                      <span className="font-medium dark:text-white">{name}</span>
                      <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <div className="text-5xl mb-4">🔤</div>
                    <h3 className="text-lg font-medium mb-1">尚未生成名字</h3>
                    <p className="text-sm">在左侧设置生成参数，然后点击生成按钮</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm dark:shadow-gray-900/20">
          <CardHeader>
            <CardTitle className="dark:text-white">使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• 选择适合你小说背景的名字类型，如古风、现代、西方等</li>
              <li>• 根据角色性别选择合适的性别选项</li>
              <li>• 调整生成数量滑块来决定一次生成多少个名字</li>
              <li>• 点击单个名字可复制该名字，点击"全部复制"可复制所有生成的名字</li>
              <li>• 古风类型有概率生成复姓名字，更符合古代背景</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}