/**
 * Picko - AI Tools Data Seeding Script
 * CSV 데이터를 Supabase에 업로드
 * 
 * 실행: npx tsx scripts/seed.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import Papa from 'papaparse'

// 환경 변수 로드
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다!')
  console.error('   .env.local 파일을 확인해주세요.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// CSV 행 타입 (실제 헤더 반영)
interface CSVRow {
  'category_kr': string
  'futurepedia_category': string
  'name': string
  'strength': string
  'strength_kr': string
  'free': string
  'link': string
  'description': string
  'description_kr': string
}

// DB 삽입용 타입
interface AIToolInsert {
  category_kr: string | null
  futurepedia_category: string | null
  name: string
  strength: string | null
  strength_kr: string | null
  free: boolean
  link: string | null
  description: string | null
  description_kr: string | null
}

/**
 * CSV 파싱
 */
function parseCSV(filePath: string): Promise<AIToolInsert[]> {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    
    Papa.parse<CSVRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<CSVRow>) => {
        const tools: AIToolInsert[] = results.data.map((row: CSVRow) => {
          const categoryKr = row.category_kr?.trim() || null
          const futurepediaCategory = row.futurepedia_category?.trim() || null
          const name = row.name?.trim() || 'Unknown'
          const strength = row.strength?.trim() || null
          const strengthKr = row.strength_kr?.trim() || null
          const freeStr = row.free?.trim() || '0'
          const link = row.link?.trim() || null
          const description = row.description?.trim() || null
          const descriptionKr = row.description_kr?.trim() || null
          
          const free = freeStr === '1'
          
          return {
            category_kr: categoryKr,
            futurepedia_category: futurepediaCategory,
            name,
            strength,
            strength_kr: strengthKr,
            free,
            link,
            description,
            description_kr: descriptionKr
          }
        })
        
        resolve(tools)
      },
      error: (error: Error) => {
        reject(error)
      }
    })
  })
}

/**
 * 데이터 삽입 (배치 처리)
 */
async function insertData(tools: AIToolInsert[]) {
  const BATCH_SIZE = 100
  let successCount = 0
  let errorCount = 0
  
  console.log(`\n📊 총 ${tools.length}개 도구 업로드 시작...\n`)
  
  for (let i = 0; i < tools.length; i += BATCH_SIZE) {
    const batch = tools.slice(i, i + BATCH_SIZE)
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(tools.length / BATCH_SIZE)
    
    console.log(`⏳ Batch ${batchNumber}/${totalBatches} 처리 중... (${batch.length}개)`)
    
    const { error } = await supabase
      .from('ai_tools')
      .insert(batch)
    
    if (error) {
      console.error(`   ❌ 에러:`, error.message)
      errorCount += batch.length
    } else {
      console.log(`   ✅ 성공!`)
      successCount += batch.length
    }
    
    // Rate limit 방지
    if (i + BATCH_SIZE < tools.length) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
  
  console.log(`\n📈 업로드 완료!`)
  console.log(`   ✅ 성공: ${successCount}개`)
  console.log(`   ❌ 실패: ${errorCount}개`)
}

/**
 * 통계 출력
 */
function printStats(tools: AIToolInsert[]) {
  const freeCount = tools.filter(t => t.free).length
  const paidCount = tools.filter(t => !t.free).length
  
  const categories = new Map<string, number>()
  tools.forEach(t => {
    if (t.category_kr) {
      categories.set(t.category_kr, (categories.get(t.category_kr) || 0) + 1)
    }
  })
  
  console.log('\n📊 데이터 통계:')
  console.log(`   • 총 도구: ${tools.length}개`)
  console.log(`   • 무료: ${freeCount}개 (${((freeCount/tools.length)*100).toFixed(1)}%)`)
  console.log(`   • 유료: ${paidCount}개 (${((paidCount/tools.length)*100).toFixed(1)}%)`)
  
  if (categories.size > 0) {
    console.log('\n📁 카테고리 분포:')
    Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([cat, count]) => {
        console.log(`   • ${cat}: ${count}개`)
      })
  }
}

/**
 * 메인 함수
 */
async function main() {
  try {
    console.log('🚀 Picko 시딩 스크립트 시작...\n')
    
    const csvPath = path.join(__dirname, '../data/ai_tools.csv')
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`❌ CSV 파일을 찾을 수 없습니다: ${csvPath}`)
    }
    
    console.log(`📂 CSV 파일 읽는 중...`)
    const tools = await parseCSV(csvPath)
    console.log(`✅ ${tools.length}개 도구 파싱 완료!`)
    
    printStats(tools)
    
    console.log('\n⚠️  3초 후 업로드 시작...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    console.log('\n🗑️  기존 데이터 삭제 중...')
    await supabase
      .from('ai_tools')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('✅ 삭제 완료!')
    
    await insertData(tools)
    
    const { count } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })
    
    console.log(`\n🔍 DB 확인: ${count}개 도구 저장됨`)
    console.log('\n🎉 시딩 완료!\n')
    
  } catch (error) {
    console.error('\n❌ 에러:', error)
    process.exit(1)
  }
}

main()