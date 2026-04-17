<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useMemberStore } from '@/stores'
import type { MemberMarketInfo, MemberUserInfo } from '@/types/customer'
import { getMemberUserInfoAPI } from '@/services/customer'
import MarketSwitcher from '@/components/market-switcher/market-switcher.vue'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 订单选项
const orderTypes = [
  { type: '1', text: '待付款', icon: 'icon-currency' },
  { type: '2', text: '待发货', icon: 'icon-gift' },
  { type: '3', text: '待收货', icon: 'icon-check' },
  { type: '4', text: '待评价', icon: 'icon-comment' },
]

// 获取会员信息
const memberStore = useMemberStore()

/**
 * 当前完整用户信息
 * 页面本地也保留一份，便于模板直读
 */
const userInfo = ref<MemberUserInfo | null>(null)

/**
 * 页面展示时刷新用户信息
 */
const loadUserInfo = async () => {
  const userId = memberStore.profile?.userId

  if (!userId) {
    userInfo.value = null
    memberStore.setUserInfo(null)
    memberStore.setCurrentMarket(null)
    return
  }

  try {
    const res = await getMemberUserInfoAPI(userId)
    const data = res.result

    userInfo.value = data

    // 存入全局 store
    memberStore.setUserInfo(data)

    // 初始化当前主体
    memberStore.initCurrentMarket(data?.markets || [])
  } catch (error) {
    console.error('获取用户信息失败：', error)
  }
}

/**
 * 选择经营主体
 */
const handleMarketChange = (market: MemberMarketInfo) => {
  memberStore.setCurrentMarket(market)
  uni.showToast({
    icon: 'success',
    title: '已切换经营主体',
  })
}

onShow(() => {
  loadUserInfo()
})
</script>

<template>
  <scroll-view enable-back-to-top class="viewport" scroll-y>
    <!-- 个人资料 -->
    <view class="profile" :style="{ paddingTop: safeAreaInsets!.top + 'px' }">
      <!-- 情况1：已登录 -->
      <view class="overview" v-if="memberStore.profile">
        <navigator url="/pagesMember/profile/profile" hover-class="none">
          <image class="avatar" :src="memberStore.profile.avatar" mode="aspectFill"></image>
        </navigator>
        <view class="meta">
          <view class="nickname">
            {{ memberStore.profile.nickname || memberStore.profile.account }}
          </view>
          <navigator class="extra" url="/pagesMember/profile/profile" hover-class="none">
            <text class="update">更新头像昵称</text>
          </navigator>
        </view>
      </view>
      <!-- 情况2：未登录 -->
      <view class="overview" v-else>
        <navigator url="/pages/login/login" hover-class="none">
          <image
            class="avatar gray"
            mode="aspectFill"
            src="https://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/picture/2021-04-06/db628d42-88a7-46e7-abb8-659448c33081.png"
          ></image>
        </navigator>
        <view class="meta">
          <navigator url="/pages/login/login" hover-class="none" class="nickname">
            未登录
          </navigator>
          <view class="extra">
            <text class="tips">点击登录账号</text>
          </view>
        </view>
      </view>
      <navigator class="settings" url="/pagesMember/settings/settings" hover-class="none">
        设置
      </navigator>
    </view>

    <!-- 经营主体切换 -->
    <MarketSwitcher
      v-if="memberStore.profile"
      :current-market="memberStore.currentMarket"
      :market-list="userInfo?.markets || []"
      @change="handleMarketChange"
    />
    <!-- 我的订单 -->
    <view class="orders">
      <view class="title">
        我的订单
        <navigator class="navigator" url="/pagesOrder/list/list?type=0" hover-class="none">
          查看全部订单<text class="icon-right"></text>
        </navigator>
      </view>
      <view class="section">
        <!-- 订单 -->
        <navigator
          v-for="item in orderTypes"
          :key="item.type"
          :class="item.icon"
          :url="`/pagesOrder/list/list?type=${item.type}`"
          class="navigator"
          hover-class="none"
        >
          {{ item.text }}
        </navigator>
        <!-- 客服 -->
        <!-- #ifdef MP-WEIXIN -->
        <button class="contact icon-handset" open-type="contact">售后</button>
        <!-- #endif -->
      </view>
    </view>
    <!-- 猜你喜欢 -->
    <!--    <view class="guess">-->
    <!--      <XtxGuess ref="guessRef" />-->
    <!--    </view>-->
  </scroll-view>
</template>

<style scoped lang="scss">
.viewport {
  min-height: 100vh;
  background: linear-gradient(180deg, #f6f8fb 0%, #f2f4f7 100%);
}

.profile {
  position: relative;
  padding-bottom: 36rpx;
  background: linear-gradient(135deg, #27ba9b 0%, #4fd1b2 100%);
  border-radius: 0 0 32rpx 32rpx;
  overflow: hidden;

  .overview {
    display: flex;
    align-items: center;
    padding: 32rpx 24rpx 28rpx;

    .avatar {
      width: 132rpx;
      height: 132rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.92);
      background: #ffffff;
      box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
    }

    .meta {
      flex: 1;
      min-width: 0;
      margin-left: 24rpx;

      .nickname {
        font-size: 36rpx;
        font-weight: 700;
        line-height: 1.3;
        color: #ffffff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .extra {
        display: inline-flex;
        align-items: center;
        margin-top: 12rpx;
        padding: 8rpx 18rpx;
        border-radius: 999rpx;
        background: rgba(255, 255, 255, 0.16);

        .update {
          font-size: 22rpx;
          color: rgba(255, 255, 255, 0.92);
        }
      }
    }

    .settings {
      flex-shrink: 0;
      padding: 10rpx 18rpx;
      border-radius: 999rpx;
      font-size: 24rpx;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.14);
    }
  }
}

.orders {
  margin: 24rpx 20rpx 0;
  padding: 28rpx 24rpx;
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.05);

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: #1f2937;

    .navigator {
      font-size: 24rpx;
      color: #94a3b8;
    }
  }

  .section {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12rpx 8rpx;
    padding-top: 12rpx;

    .navigator,
    .contact {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 132rpx;
      border-radius: 16rpx;
      background: #f8fafc;
      font-size: 22rpx;
      color: #475569;
    }

    .navigator::before,
    .contact::before {
      margin-bottom: 14rpx;
      font-size: 38rpx;
    }

    .contact {
      border: none;
      padding: 0;
    }
  }
}
</style>
