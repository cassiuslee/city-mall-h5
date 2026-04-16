import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MallLoginProfile } from '@/types/auth'

// 定义 Store
export const useMemberStore = defineStore(
  'member',
  () => {
    /**
     * 当前登录态
     * 这里只保存最小信息：token、userId、昵称等
     * 完整用户资料通过 /customer/member-user-info 单独获取
     */
    const profile = ref<MallLoginProfile | undefined>()

    /**
     * 设置登录态
     * @param val 登录成功后的返回信息
     */
    const setProfile = (val: MallLoginProfile) => {
      profile.value = val
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      profile.value = undefined
    }

    // 记得 return
    return {
      profile,
      setProfile,
      clearProfile,
    }
  },
  {
    // 网页端配置
    // persist: true,
    // 小程序端配置
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
