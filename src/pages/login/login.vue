<script setup lang="ts">
import { ref } from 'vue'
import { postMockLoginAPI } from '@/services/auth'
import { getMemberUserInfoAPI } from '@/services/customer'
import { useMemberStore } from '@/stores'

const memberStore = useMemberStore()

/**
 * 登录表单中的 userId
 */
const userId = ref('')

/**
 * 点击模拟登录
 */
const onMockLogin = async () => {
  // 1. 基础校验
  if (!userId.value) {
    uni.showToast({
      icon: 'none',
      title: '请输入userId',
    })
    return
  }

  try {
    // 2. 调用模拟登录接口，获取 token
    const loginRes = await postMockLoginAPI(userId.value)

    // 3. 保存登录态
    // 你的后端统一返回字段是 result
    memberStore.setProfile(loginRes.result)

    // 4. 再拉一次完整用户信息，验证前后端链路是否通
    const infoRes = await getMemberUserInfoAPI(userId.value)
    console.log('用户完整信息：', infoRes.result)

    uni.showToast({
      icon: 'success',
      title: '登录成功',
    })

    // 5. 跳转我的页面
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/my/my',
      })
    }, 300)
  } catch (error) {
    console.error('模拟登录失败：', error)
  }
}
</script>

<template>
  <view class="login-page">
    <view class="form-item">
      <text class="label">userId</text>
      <input
        v-model="userId"
        class="input"
        placeholder="请输入企微userId"
      />
    </view>

    <button class="login-btn" @tap="onMockLogin">
      模拟登录
    </button>
  </view>
</template>

<style scoped>
.login-page {
  padding: 32rpx;
}

.form-item {
  margin-bottom: 24rpx;
}

.label {
  display: block;
  margin-bottom: 12rpx;
  font-size: 28rpx;
}

.input {
  height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 12rpx;
  background: #fff;
}

.login-btn {
  margin-top: 24rpx;
}
</style>
