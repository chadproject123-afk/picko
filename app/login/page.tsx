'use client'

import { createBrowserSupabaseClient } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function LoginPage() {
    const handleKakaoLogin = async () => {
        const supabase = createBrowserSupabaseClient()

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            console.error('카카오 로그인 에러:', error.message)
            alert('로그인 중 오류가 발생했습니다.')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-sm"
            >
                <div className="text-center mb-8">
                    <motion.div
                        className="flex items-center justify-center gap-2 mb-3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Sparkles className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Picko</h1>
                    </motion.div>
                    <Badge variant="outline" className="mb-4">
                        AI 도구 추천
                    </Badge>
                    <p className="text-gray-500 text-sm">
                        할 일에 맞는 최적의 AI 도구를 추천받으세요
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <button
                        onClick={handleKakaoLogin}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 hover:brightness-95 active:scale-[0.98]"
                        style={{
                            backgroundColor: '#FEE500',
                            color: '#191919',
                        }}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9 0.5C4.029 0.5 0 3.637 0 7.514C0 9.956 1.559 12.101 3.932 13.354L2.933 16.88C2.845 17.18 3.188 17.418 3.45 17.244L7.567 14.54C8.035 14.59 8.513 14.628 9 14.628C13.971 14.628 18 11.391 18 7.514C18 3.637 13.971 0.5 9 0.5Z"
                                fill="#191919"
                            />
                        </svg>
                        카카오 로그인
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        로그인하면 더 많은 기능을 사용할 수 있어요
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}
