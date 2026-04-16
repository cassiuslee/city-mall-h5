<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MemberMarketInfo } from '@/types/customer'

interface Props {
  /**
   * 当前选中的主体
   */
  currentMarket: MemberMarketInfo | null
  /**
   * 可选主体列表
   */
  marketList: MemberMarketInfo[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'change', value: MemberMarketInfo): void
}>()

/**
 * uni-popup 实例
 */
const popupRef = ref<UniHelper.UniPopupInstance | null>(null)

/**
 * 是否有主体可切换
 */
const hasMarket = computed(() => props.marketList && props.marketList.length > 0)

/**
 * 打开弹层
 */
const openPopup = () => {
  if (!hasMarket.value) return
  popupRef.value?.open()
}

/**
 * 关闭弹层
 */
const closePopup = () => {
  popupRef.value?.close()
}

/**
 * 点击选择主体
 */
const handleSelect = (item: MemberMarketInfo) => {
  emit('change', item)
  closePopup()
}

/**
 * 判断是否为当前选中主体
 */
const isActive = (item: MemberMarketInfo) => {
  if (!props.currentMarket) return false
  return (
    item.relationId === props.currentMarket.relationId ||
    item.marketFid === props.currentMarket.marketFid
  )
}
</script>

<template>
  <view class="market-switcher">
    <!-- 当前主体卡片 -->
    <view class="market-card" :class="{ disabled: !hasMarket }" @tap="openPopup">
      <view class="market-main">
        <view class="market-title-row">
          <text class="market-label">当前经营主体</text>
          <uni-tag
            v-if="currentMarket?.memberIdentity"
            :text="currentMarket.memberIdentity"
            type="primary"
            size="small"
            :inverted="true"
          />
        </view>

        <view class="market-name">
          {{ currentMarket?.markName || '暂无可用经营主体' }}
        </view>

        <view class="market-desc">
          <template v-if="currentMarket">
            {{ currentMarket.markCode || '-' }} · {{ currentMarket.marketTypeName || '-' }}
          </template>
          <template v-else> 请联系管理员绑定主体 </template>
        </view>
      </view>

      <view class="market-action">
        <text class="action-text" v-if="hasMarket">切换</text>
        <uni-icons type="right" size="18" color="#999999" />
      </view>
    </view>

    <!-- 底部弹层 -->
    <uni-popup ref="popupRef" type="bottom" background-color="#fff">
      <view class="popup-wrapper">
        <view class="popup-header">
          <text class="popup-title">选择经营主体</text>
          <view class="popup-close" @tap="closePopup">
            <uni-icons type="closeempty" size="20" color="#666666" />
          </view>
        </view>

        <scroll-view class="popup-body" scroll-y>
          <view
            v-for="item in marketList"
            :key="item.relationId || item.marketFid"
            class="market-item"
            :class="{ active: isActive(item) }"
            @tap="handleSelect(item)"
          >
            <view class="market-item-main">
              <view class="market-item-top">
                <text class="market-item-name">{{ item.markName || '-' }}</text>
                <uni-tag
                  v-if="item.memberIdentity"
                  :text="item.memberIdentity"
                  type="primary"
                  size="small"
                  :inverted="true"
                />
              </view>

              <view class="market-item-sub">
                {{ item.markCode || '-' }} · {{ item.marketTypeName || '-' }}
              </view>

              <view class="market-item-sub" v-if="item.weworkDptName">
                部门：{{ item.weworkDptName }}
              </view>
            </view>

            <view class="market-item-check">
              <uni-icons v-if="isActive(item)" type="checkmarkempty" size="20" color="#27ba9b" />
            </view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<style scoped lang="scss">
@import '@/styles/mixins.scss';
.market-switcher {
  margin: 24rpx 20rpx 0;
}

.market-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx;
  background: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);

  &.disabled {
    opacity: 0.85;
  }
}

.market-main {
  flex: 1;
  min-width: 0;
}

.market-title-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.market-label {
  font-size: 24rpx;
  color: #999999;
}

.market-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #222222;
  @include ellipsis();
}

.market-desc {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #666666;
  @include ellipsis();
}

.market-action {
  display: flex;
  align-items: center;
  margin-left: 24rpx;
}

.action-text {
  margin-right: 6rpx;
  font-size: 24rpx;
  color: #999999;
}

.popup-wrapper {
  background: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
}

.popup-header {
  position: relative;
  text-align: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #f2f2f2;
}

.popup-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #222222;
}

.popup-close {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  padding: 8rpx;
}

.popup-body {
  max-height: 70vh;
}

.market-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &.active {
    background: #f8fffd;
  }
}

.market-item-main {
  flex: 1;
  min-width: 0;
}

.market-item-top {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.market-item-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #222222;
  @include ellipsis();
}

.market-item-sub {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #666666;
  @include ellipsis();
}

.market-item-check {
  width: 48rpx;
  display: flex;
  justify-content: flex-end;
  margin-left: 16rpx;
}
</style>
