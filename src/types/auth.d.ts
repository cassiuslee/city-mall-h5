/**
 * 商城模拟登录后，前端保存的最小登录态
 */
export type MallLoginProfile = {
  /** 登录凭证，会自动放到 Authorization 请求头 */
  token: string

  /** 用户主键 */
  fId: string

  /** 企微 userId，后续真实企微登录也会围绕这个字段 */
  userId: string

  /** 昵称 */
  nickname?: string

  /** 头像 */
  avatar?: string

  /** 手机号 */
  mobile?: string
}
