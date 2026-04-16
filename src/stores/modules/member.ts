import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MallLoginProfile } from '@/types/auth'
import type { MemberMarketInfo, MemberUserInfo } from '@/types/customer'

// 定义会员 Store
export const useMemberStore = defineStore(
  'member',
  () => {
    /**
     * 最小登录态
     * 这里只保存 token、userId、头像昵称等基础信息
     */
    const profile = ref<MallLoginProfile | undefined>()

    /**
     * 当前完整用户信息
     * 来源：/customer/member-user-info
     */
    const userInfo = ref<MemberUserInfo | null>(null)

    /**
     * 当前选中的经营主体
     */
    const currentMarket = ref<MemberMarketInfo | null>(null)

    /**
     * 保存登录态
     */
    const setProfile = (val: MallLoginProfile) => {
      profile.value = val
    }

    /**
     * 保存完整用户信息
     */
    const setUserInfo = (val: MemberUserInfo | null) => {
      userInfo.value = val
    }

    /**
     * 设置当前经营主体
     */
    const setCurrentMarket = (val: MemberMarketInfo | null) => {
      currentMarket.value = val
    }

    /**
     * 根据用户信息初始化当前主体
     * 规则：
     * 1. 如果 currentMarket 还存在，并且还能在新 markets 中找到，就继续用
     * 2. 否则默认取第一个主体
     * 3. 如果没有主体，则置空
     */
    const initCurrentMarket = (markets: MemberMarketInfo[] = []) => {
      if (!markets.length) {
        currentMarket.value = null
        return
      }

      if (currentMarket.value) {
        const matched = markets.find(
          (item) =>
            item.relationId === currentMarket.value?.relationId ||
            item.marketFid === currentMarket.value?.marketFid,
        )
        if (matched) {
          currentMarket.value = matched
          return
        }
      }

      currentMarket.value = markets[0]
    }

    /**
     * 退出登录 / 清空所有会员相关数据
     */
    const clearProfile = () => {
      profile.value = undefined
      userInfo.value = null
      currentMarket.value = null
    }

    return {
      profile,
      userInfo,
      currentMarket,
      setProfile,
      setUserInfo,
      setCurrentMarket,
      initCurrentMarket,
      clearProfile,
    }
  },
  {
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)
