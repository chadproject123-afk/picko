'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '@/lib/supabase'
import { AITool } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function searchAITools(userInput: string): Promise<AITool[]> {
  try {
    console.log('🔍 검색 시작:', userInput)

    // Step 1: Gemini 키워드 추출 (실패 시 단순 키워드로 fallback)
    let keywords: string[]
    let model: any

    try {
      model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.3,
        }
      })

      const keywordPrompt = `사용자 입력: "${userInput}"

이 작업과 관련된 핵심 키워드를 5-10개 추출해주세요.
한글과 영어 모두 포함하고, 유사어와 관련 카테고리도 포함하세요.

예시:
입력: "마케팅 보고서 작성"
출력: {"keywords": ["마케팅", "marketing", "보고서", "report", "문서", "작성", "글쓰기", "writing", "자동화", "콘텐츠"]}

응답은 JSON 형식만 사용하세요:
{"keywords": ["키워드1", "키워드2", ...]}`

      console.log('🤖 Gemini에게 키워드 추출 요청 중...')

      const keywordResult = await model.generateContent(keywordPrompt)
      const keywordText = keywordResult.response.text()

      console.log('📥 키워드 응답:', keywordText)

      const keywordMatch = keywordText.match(/\{[\s\S]*\}/)
      keywords = keywordMatch
        ? JSON.parse(keywordMatch[0]).keywords
        : userInput.split(/\s+/).filter(word => word.length > 1)
    } catch (geminiError) {
      console.warn('⚠️ Gemini API 실패, 단순 키워드로 fallback:', geminiError instanceof Error ? geminiError.message : geminiError)
      // Gemini가 실패하면 사용자 입력을 단순 분할하여 키워드로 사용
      keywords = userInput.split(/\s+/).filter(word => word.length > 1)
      if (keywords.length === 0) {
        keywords = [userInput]
      }
    }

    console.log('🔑 추출된 키워드:', keywords)

    // Step 2: Supabase 검색
    let candidateTools: AITool[] = []

    try {
      for (const keyword of keywords.slice(0, 8)) {
        const { data, error } = await supabase
          .from('ai_tools')
          .select('*')
          .or(
            `name.ilike.%${keyword}%,` +
            `strength_kr.ilike.%${keyword}%,` +
            `description_kr.ilike.%${keyword}%,` +
            `category_kr.ilike.%${keyword}%,` +
            `futurepedia_category.ilike.%${keyword}%`
          )
          .limit(50)

        if (error) {
          console.warn('⚠️ Supabase 쿼리 오류 (keyword:', keyword, '):', error.message)
          continue
        }

        if (data && data.length > 0) {
          candidateTools = [...candidateTools, ...data]
        }
      }
    } catch (supabaseError) {
      console.error('❌ Supabase 연결 실패:', supabaseError instanceof Error ? supabaseError.message : supabaseError)
      return []
    }

    const uniqueTools = Array.from(
      new Map(candidateTools.map(tool => [tool.id, tool])).values()
    )

    console.log('✅ DB 검색 결과:', uniqueTools.length, '개')

    if (uniqueTools.length === 0) {
      console.log('⚠️  키워드 검색 결과 없음. 전체 DB 검색...')

      const { data: allTools, error } = await supabase
        .from('ai_tools')
        .select('*')
        .limit(200)

      if (error) {
        console.error('❌ Supabase 전체 검색 실패:', error.message)
        return []
      }

      if (!allTools || allTools.length === 0) {
        console.error('❌ DB에 데이터 없음')
        return []
      }

      // Gemini model이 없으면 상위 10개만 반환
      if (!model) {
        return allTools.slice(0, 10)
      }
      return await recommendWithGemini(userInput, allTools, model)
    }

    if (uniqueTools.length <= 10) {
      console.log('✅ 결과 10개 이하 → 바로 반환')
      return uniqueTools
    }

    // Gemini model이 없으면 상위 10개만 반환
    if (!model) {
      return uniqueTools.slice(0, 10)
    }
    return await recommendWithGemini(userInput, uniqueTools.slice(0, 100), model)

  } catch (error) {
    console.error('❌ 검색 에러:', error instanceof Error ? error.message : error)

    // 최종 fallback: 단순 Supabase 검색
    try {
      const { data } = await supabase
        .from('ai_tools')
        .select('*')
        .or(
          `name.ilike.%${userInput}%,` +
          `strength_kr.ilike.%${userInput}%,` +
          `description_kr.ilike.%${userInput}%`
        )
        .limit(10)

      if (data && data.length > 0) {
        console.log('🔄 Fallback 검색 성공:', data.length, '개')
        return data
      }
    } catch (fallbackError) {
      console.error('❌ Fallback도 실패:', fallbackError instanceof Error ? fallbackError.message : fallbackError)
    }

    return []
  }
}

async function recommendWithGemini(
  userInput: string,
  tools: AITool[],
  model: any
): Promise<AITool[]> {
  try {
    console.log('📝 Gemini 추천 시작:', tools.length, '개 중에서 선택')

    const toolsContext = tools
      .map((tool, idx) => {
        const desc = tool.strength_kr || tool.description_kr || tool.name
        return `${idx + 1}. [${tool.category_kr || '기타'}] ${tool.name}: ${desc}`
      })
      .join('\n')

    const prompt = `당신은 AI 도구 추천 전문가입니다.

사용자 작업: "${userInput}"

다음 AI 도구 중 가장 적합한 상위 10개를 추천해주세요:

${toolsContext}

응답은 **반드시** 다음 JSON 형식만 사용하세요:
{
  "recommendations": [
    {"rank": 1, "tool_number": 3, "reason": "추천 이유"}
  ]
}

주의:
- tool_number는 위 목록의 번호(1-${tools.length})를 사용하세요
- 최대 10개까지만 추천하세요`

    console.log('🤖 Gemini에게 최종 추천 요청 중...')

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    console.log('📥 Gemini 응답:', responseText.substring(0, 200))

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('❌ JSON 파싱 실패')
      return tools.slice(0, 10)
    }

    const recommendations = JSON.parse(jsonMatch[0])

    const rankedTools: AITool[] = recommendations.recommendations
      .map((rec: any) => {
        const tool = tools[rec.tool_number - 1]
        if (!tool) {
          console.warn(`⚠️  잘못된 tool_number: ${rec.tool_number}`)
          return null
        }
        return tool
      })
      .filter(Boolean)
      .slice(0, 10)

    console.log('✅ 최종 추천 완료:', rankedTools.length, '개')
    console.log('📋 추천된 도구:', rankedTools.map(t => t.name).join(', '))

    return rankedTools
  } catch (error) {
    console.error('❌ Gemini 추천 실패:', error)
    return tools.slice(0, 10)
  }
}
