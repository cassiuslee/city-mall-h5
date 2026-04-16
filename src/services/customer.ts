import { http } from '@/utils/http'
import type { MemberUserInfo } from '@/types/customer'

/**
 * 根据 userId 查询用户及关联主体
 * @param userId 企微 userId
 */
export const getMemberUserInfoAPI = (userId: string) => {
  return http<MemberUserInfo>({
    method: 'GET',
    url: '/customer/member-user-info',
    data: { userId },
  })
}
