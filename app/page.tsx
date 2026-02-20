'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
    Sparkles,
    Search,
    Star,
    Zap,
    ArrowRight,
    CheckCircle2,
    Brain,
    Layers,
    TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const features = [
    {
        icon: Brain,
        title: 'AI 맞춤 추천',
        description: '할 일을 입력하면 Gemini AI가 분석해서 최적의 도구를 찾아드려요.',
        color: 'from-violet-500 to-purple-600',
        bgColor: 'bg-violet-50',
    },
    {
        icon: Layers,
        title: '2,000+ AI 도구 DB',
        description: '글쓰기, 디자인, 코딩, 마케팅 등 다양한 카테고리의 AI 도구를 보유하고 있어요.',
        color: 'from-blue-500 to-cyan-600',
        bgColor: 'bg-blue-50',
    },
    {
        icon: TrendingUp,
        title: '무료/유료 한눈에',
        description: '각 도구의 가격 정보와 강점을 한국어로 바로 확인할 수 있어요.',
        color: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50',
    },
]

const steps = [
    { number: '01', title: '할 일 입력', description: '오늘 해야 할 작업을 적어주세요', emoji: '📝' },
    { number: '02', title: 'AI 분석', description: 'Gemini가 작업을 분석해요', emoji: '🤖' },
    { number: '03', title: '도구 추천', description: '최적의 AI 도구를 추천받으세요', emoji: '✨' },
]

export default function LandingPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        <span className="text-xl font-bold text-gray-900">Picko</span>
                        <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">
                            Beta
                        </Badge>
                    </div>
                    <Button
                        onClick={() => router.push('/search')}
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                    >
                        시작하기
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-40" />
                    <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-white to-transparent" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <Badge
                            variant="secondary"
                            className="mb-6 px-4 py-1.5 text-sm bg-indigo-50 text-indigo-700 border-indigo-100"
                        >
                            <Zap className="w-3.5 h-3.5 mr-1.5" />
                            AI 기반 도구 추천 서비스
                        </Badge>
                    </motion.div>

                    <motion.h1
                        className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                    >
                        할 일에 맞는
                        <br />
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                            최적의 AI 도구
                        </span>
                        를 찾아요
                    </motion.h1>

                    <motion.p
                        className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        보고서 작성, 디자인, 코딩, 마케팅...
                        <br className="hidden sm:block" />
                        어떤 AI 도구를 써야 할지 고민이라면, <strong className="text-gray-700">Picko</strong>에게 물어보세요.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <Button
                            onClick={() => router.push('/search')}
                            size="lg"
                            className="bg-indigo-600 hover:bg-indigo-700 text-base px-8 py-6 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 transition-all"
                        >
                            <Search className="w-5 h-5 mr-2" />
                            AI 도구 추천받기
                        </Button>
                        <p className="text-sm text-gray-400">무료 · 회원가입 없이 바로 사용</p>
                    </motion.div>

                    {/* Preview mockup */}
                    <motion.div
                        className="mt-16 relative"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl shadow-gray-200/50">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <Sparkles className="w-4 h-4 text-indigo-500" />
                                    <span className="font-medium text-gray-700">할 일 목록</span>
                                </div>
                                {['마케팅 보고서 작성', '인스타그램 콘텐츠 제작'].map((task, i) => (
                                    <motion.div
                                        key={task}
                                        className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-gray-100"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 + i * 0.15 }}
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                                        <span className="text-sm text-gray-700">{task}</span>
                                        <Badge variant="secondary" className="ml-auto text-xs shrink-0">
                                            {i === 0 ? '3개 추천' : '2개 추천'}
                                        </Badge>
                                    </motion.div>
                                ))}
                                <motion.div
                                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl p-3 text-sm font-medium"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.1 }}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    AI 추천받기
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Badge variant="outline" className="mb-4 text-xs">Features</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            왜 Picko인가요?
                        </h2>
                        <p className="text-gray-500 max-w-md mx-auto">
                            수천 개의 AI 도구 중에서 나에게 딱 맞는 것만 골라드려요
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Badge variant="outline" className="mb-4 text-xs">How it works</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            3단계로 간단하게
                        </h2>
                        <p className="text-gray-500">복잡한 검색 없이, 할 일만 적으면 끝</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                            >
                                <div className="text-4xl mb-4">{step.emoji}</div>
                                <div className="text-xs font-bold text-indigo-600 tracking-widest mb-2">
                                    STEP {step.number}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-500">{step.description}</p>
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2">
                                        <ArrowRight className="w-5 h-5 text-gray-300" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        className="flex flex-wrap items-center justify-center gap-8 sm:gap-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div>
                            <div className="text-3xl font-bold text-gray-900">2,000+</div>
                            <div className="text-sm text-gray-500 mt-1">AI 도구 등록</div>
                        </div>
                        <div className="h-10 w-px bg-gray-200 hidden sm:block" />
                        <div>
                            <div className="text-3xl font-bold text-gray-900">10+</div>
                            <div className="text-sm text-gray-500 mt-1">카테고리</div>
                        </div>
                        <div className="h-10 w-px bg-gray-200 hidden sm:block" />
                        <div>
                            <div className="flex items-center justify-center gap-1 text-3xl font-bold text-gray-900">
                                <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
                                4.8
                            </div>
                            <div className="text-sm text-gray-500 mt-1">사용자 만족도</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <motion.div
                    className="max-w-3xl mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-10 sm:p-16 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
                        <div className="relative">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                지금 바로 시작하세요
                            </h2>
                            <p className="text-white/80 mb-8 max-w-md mx-auto">
                                회원가입 없이 무료로 사용할 수 있어요.
                                <br />
                                할 일을 입력하면 AI가 최적의 도구를 추천해드립니다.
                            </p>
                            <Button
                                onClick={() => router.push('/search')}
                                size="lg"
                                className="bg-white text-indigo-700 hover:bg-gray-100 text-base px-8 py-6 rounded-xl font-semibold shadow-lg"
                            >
                                <Sparkles className="w-5 h-5 mr-2" />
                                AI 추천받으러 가기
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-gray-100">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Sparkles className="w-4 h-4" />
                        <span>Picko © 2026</span>
                    </div>
                    <p className="text-xs text-gray-400">
                        Powered by Gemini AI & Supabase
                    </p>
                </div>
            </footer>
        </div>
    )
}
