import { http } from '@/utils/http'
import type { MallLoginProfile } from '@/types/auth'

/**
 * 模拟登录
 * @param userId 企微 userId
 */
export const postMockLoginAPI = (userId: string) => {
  return http<MallLoginProfile>({
    method: 'POST',
    url: '/auth/mock-login',
    data: { userId },
  })
}
