/**
 * 用户关联主体信息
 */
export type MemberMarketInfo = {
  /** 关系ID */
  relationId: string

  /** 主体ID */
  marketFid: string

  /** 用户在主体中的身份 */
  memberIdentity: string

  /** 主体状态 */
  marketCStatus: string

  /** 唛头编码 */
  markCode: string

  /** 唛头名称 */
  markName: string

  /** 主体类型编码 */
  markType: string

  /** 主体类型名称 */
  marketTypeName: string

  /** 企业微信部门ID */
  weworkDptId: number

  /** 企业微信部门名称 */
  weworkDptName: string

  /** 销售公司主体 */
  salesCompanyId: string

  /** 区域经理ID */
  regionalManagerId: string

  /** 客服经理ID */
  serviceManager: string
}

/**
 * /customer/member-user-info 返回的用户信息
 */
export type MemberUserInfo = {
  /** 用户主键 */
  fId: string

  /** 用户状态 */
  cStatus: string

  /** 企微 userId */
  userId: string

  /** 手机号 */
  mobile: string

  /** 昵称 */
  nickname: string

  /** 头像 */
  avatar: string

  /** 性别 */
  gender: string

  /** openid */
  openid: string

  /** unionId */
  unionId: string

  /** 关联主体列表 */
  markets: MemberMarketInfo[]
}
