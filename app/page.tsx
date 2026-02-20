'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Sparkles,
  ExternalLink,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  LogOut,
  User
} from 'lucide-react'
import { searchAITools } from './actions'
import { AITool } from '@/types'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Todo {
  id: string
  text: string
  isCompleted: boolean
  tools?: AITool[]
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodoText, setNewTodoText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [today, setToday] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    setToday(new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))

    const supabase = createBrowserSupabaseClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleAddTodo = () => {
    if (!newTodoText.trim()) {
      alert('할 일을 입력해주세요!')
      return
    }

    if (todos.length >= 5) {
      alert('최대 5개까지만 추가할 수 있어요!')
      return
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText,
      isCompleted: false
    }

    setTodos([...todos, newTodo])
    setNewTodoText('')
    inputRef.current?.focus()
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
    if (expandedTodoId === id) {
      setExpandedTodoId(null)
    }
  }

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, isCompleted: !todo.isCompleted }
        : todo
    ))
  }

  const handleGetRecommendations = async () => {
    const incompleteTodos = todos.filter(t => !t.isCompleted)

    console.log('🎯 [DEBUG] AI 추천 함수 호출됨!')
    console.log('🎯 [DEBUG] 전체 할 일:', todos)
    console.log('🎯 [DEBUG] 미완료 할 일:', incompleteTodos)

    if (incompleteTodos.length === 0) {
      alert('추천받을 할 일을 추가해주세요!')
      return
    }

    console.log('🎯 [DEBUG] 로딩 시작...')
    setIsLoading(true)

    try {
      console.log('🎯 [DEBUG] Promise.all 시작')

      const updatedTodos = await Promise.all(
        todos.map(async (todo) => {
          console.log('🎯 [DEBUG] 처리 중인 Todo:', todo.text, '완료 여부:', todo.isCompleted)

          if (todo.isCompleted) {
            console.log('🎯 [DEBUG] 완료된 Todo 스킵:', todo.text)
            return todo
          }

          console.log('🎯 [DEBUG] searchAITools 호출:', todo.text)
          const tools = await searchAITools(todo.text)
          console.log('🎯 [DEBUG] searchAITools 결과:', tools.length, '개')
          console.log('🎯 [DEBUG] 결과 상세:', tools)

          return { ...todo, tools }
        })
      )

      console.log('🎯 [DEBUG] Promise.all 완료')
      console.log('🎯 [DEBUG] 업데이트된 Todos:', updatedTodos)

      setTodos(updatedTodos)

      const firstIncompleteTodo = updatedTodos.find(t => !t.isCompleted)
      if (firstIncompleteTodo) {
        console.log('🎯 [DEBUG] 첫 번째 Todo 펼치기:', firstIncompleteTodo.text)
        setExpandedTodoId(firstIncompleteTodo.id)
      }

      console.log('🎯 [DEBUG] 추천 완료!')
    } catch (error) {
      console.error('❌ [ERROR] 추천 실패:', error)
      const errorMessage = error instanceof TypeError && error.message.includes('fetch')
        ? '네트워크 연결을 확인해주세요. 인터넷이 끊어진 것 같습니다.'
        : '추천 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      alert(errorMessage)
    } finally {
      console.log('🎯 [DEBUG] 로딩 종료')
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Picko</h1>
              <Badge variant="outline" className="text-xs">
                AI 도구 추천
              </Badge>
            </motion.div>
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {today}
              </div>
              {user && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    {user.user_metadata?.name || user.email?.split('@')[0]}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                할 일 목록
              </h2>
              <span className="text-sm text-gray-500">
                {todos.length}/5
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="예: 마케팅 보고서 작성"
                className="flex-1"
                disabled={todos.length >= 5}
              />
              <Button
                onClick={handleAddTodo}
                disabled={!newTodoText.trim() || todos.length >= 5}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {todos.map((todo, index) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group"
                  >
                    <button
                      onClick={() => handleToggleTodo(todo.id)}
                      className="flex-shrink-0"
                    >
                      {todo.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    <span
                      className={`flex-1 ${todo.isCompleted
                        ? 'line-through text-gray-400'
                        : 'text-gray-900'
                        }`}
                    >
                      {todo.text}
                    </span>

                    {todo.tools && todo.tools.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {todo.tools.length}개 추천
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {todos.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">할 일을 추가해보세요! 📝</p>
                </div>
              )}
            </div>

            {todos.length > 0 && (
              <Button
                onClick={handleGetRecommendations}
                disabled={isLoading || todos.filter(t => !t.isCompleted).length === 0}
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                    </motion.div>
                    AI가 분석 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    AI 추천받기
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {todos.some(t => t.tools && t.tools.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 px-1">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm text-gray-500 font-medium">
                  추천 결과
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {todos.map((todo) => {
                if (!todo.tools || todo.tools.length === 0) return null

                const isExpanded = expandedTodoId === todo.id

                return (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedTodoId(isExpanded ? null : todo.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {todo.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-indigo-600" />
                        )}
                        <span className="font-medium text-gray-900">
                          {todo.text}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {todo.tools.length}개
                        </Badge>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ▼
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-4 space-y-3">
                            {todo.tools.map((tool, toolIndex) => (
                              <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: toolIndex * 0.05 }}
                              >
                                <Card className="hover:shadow-md transition-shadow">
                                  <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-center gap-2">
                                        <span className="text-2xl">
                                          {toolIndex === 0 ? '🥇' : toolIndex === 1 ? '🥈' : toolIndex === 2 ? '🥉' : '🏅'}
                                        </span>
                                        <CardTitle className="text-base">
                                          {tool.name}
                                        </CardTitle>
                                      </div>
                                      <Badge
                                        variant={tool.free ? 'secondary' : 'default'}
                                        className="shrink-0 text-xs"
                                      >
                                        {tool.free ? '🆓 무료' : '💰 유료'}
                                      </Badge>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    {tool.description_kr && (
                                      <p className="text-sm text-gray-600">
                                        {tool.description_kr}
                                      </p>
                                    )}

                                    {tool.strength_kr && (
                                      <div className="bg-indigo-50 rounded-lg p-3">
                                        <p className="text-xs font-medium text-indigo-900 mb-1">
                                          💡 주요 강점
                                        </p>
                                        <p className="text-sm text-indigo-800">
                                          {tool.strength_kr}
                                        </p>
                                      </div>
                                    )}

                                    {tool.category_kr && (
                                      <Badge variant="outline" className="text-xs">
                                        📂 {tool.category_kr}
                                      </Badge>
                                    )}

                                    {tool.link && (
                                      <Button
                                        className="w-full"
                                        size="sm"
                                        onClick={() => window.open(tool.link!, '_blank')}
                                      >
                                        바로 시작하기
                                        <ExternalLink className="w-3 h-3 ml-2" />
                                      </Button>
                                    )}
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-12 h-12 text-indigo-600" />
                </motion.div>
              </div>
              <p className="text-indigo-600 font-medium">
                🤖 AI가 최적의 도구를 찾고 있어요...
              </p>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
