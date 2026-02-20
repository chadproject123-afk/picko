'use server'

import { supabase } from '@/lib/supabase'

export async function saveFavorite(
    sessionId: string,
    toolId: string,
    toolName: string,
    isFavorited: boolean
) {
    try {
        const { error } = await supabase
            .from('user_interactions')
            .upsert(
                {
                    session_id: sessionId,
                    tool_id: toolId,
                    tool_name: toolName,
                    interaction_type: 'favorite',
                    is_favorited: isFavorited,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: 'session_id,tool_id,interaction_type' }
            )

        if (error) {
            console.warn('⚠️ 찜 저장 실패:', error.message)
        } else {
            console.log(`💖 찜 저장: ${toolName} → ${isFavorited ? '추가' : '해제'}`)
        }
    } catch (err) {
        console.warn('⚠️ 찜 저장 오류 (무시):', err)
    }
}

export async function saveRating(
    sessionId: string,
    toolId: string,
    toolName: string,
    ratingValue: number
) {
    try {
        const { error } = await supabase
            .from('user_interactions')
            .upsert(
                {
                    session_id: sessionId,
                    tool_id: toolId,
                    tool_name: toolName,
                    interaction_type: 'rating',
                    rating_value: ratingValue,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: 'session_id,tool_id,interaction_type' }
            )

        if (error) {
            console.warn('⚠️ 별점 저장 실패:', error.message)
        } else {
            console.log(`⭐ 별점 저장: ${toolName} → ${ratingValue}점`)
        }
    } catch (err) {
        console.warn('⚠️ 별점 저장 오류 (무시):', err)
    }
}
