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
.market-switcher {
  margin: 24rpx 20rpx 0;

  .market-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 24rpx;
    background: #ffffff;
    border-radius: 20rpx;
    box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.05);

    &.disabled {
      opacity: 0.72;
    }

    .market-main {
      flex: 1;
      min-width: 0;

      .market-title-row {
        display: flex;
        align-items: center;
        gap: 12rpx;
        margin-bottom: 12rpx;

        .market-label {
          font-size: 24rpx;
          line-height: 1;
          color: #94a3b8;
        }
      }

      .market-name {
        font-size: 32rpx;
        font-weight: 700;
        line-height: 1.35;
        color: #0f172a;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .market-desc {
        margin-top: 10rpx;
        font-size: 24rpx;
        line-height: 1.4;
        color: #64748b;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .market-action {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-shrink: 0;
      min-width: 96rpx;
      margin-left: 20rpx;

      .action-text {
        margin-right: 6rpx;
        font-size: 24rpx;
        color: #94a3b8;
      }
    }
  }
}

/* 弹层 */
.popup-wrapper {
  background: #ffffff;
  border-radius: 28rpx 28rpx 0 0;
  overflow: hidden;

  .popup-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28rpx 24rpx 24rpx;
    border-bottom: 1rpx solid #eef2f7;

    .popup-title {
      font-size: 30rpx;
      font-weight: 700;
      color: #0f172a;
    }

    .popup-close {
      position: absolute;
      right: 20rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 56rpx;
      height: 56rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #f8fafc;
    }
  }

  .popup-body {
    max-height: 70vh;
    padding: 8rpx 0 24rpx;
    background: #ffffff;

    .market-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 20rpx 16rpx;
      padding: 24rpx 22rpx;
      border-radius: 18rpx;
      background: #f8fafc;
      border: 2rpx solid transparent;

      &.active {
        background: #f0fdf9;
        border-color: rgba(39, 186, 155, 0.24);
      }

      .market-item-main {
        flex: 1;
        min-width: 0;

        .market-item-top {
          display: flex;
          align-items: center;
          gap: 12rpx;

          .market-item-name {
            flex: 1;
            min-width: 0;
            font-size: 30rpx;
            font-weight: 600;
            line-height: 1.35;
            color: #0f172a;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .market-item-sub {
          margin-top: 8rpx;
          font-size: 24rpx;
          line-height: 1.4;
          color: #64748b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .market-item-check {
        width: 44rpx;
        height: 44rpx;
        margin-left: 16rpx;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
