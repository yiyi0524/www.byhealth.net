export const TYPE = {
  undefined: -1,
  //数值
  eq: 0x0,
  lt: 0x1,
  gt: 0x2,
  neq: 0x3,
  betweenValue: 0x4,
  //字符串
  eqString: 0x5,
  like: 0x6,
  notLike: 0x7,
  //时间
  before: 0x8,
  after: 0x9,
  betweenTime: 0xa,
  //数组
  in: 0xb,
  notIn: 0xc,
  neqString: 0xd,
}
export const TYPE_ZH = {
  [TYPE.undefined]: '未定义',
  //数值比较
  [TYPE.eq]: '等于',
  [TYPE.lt]: '小于',
  [TYPE.gt]: '大于',
  [TYPE.neq]: '不等于',
  [TYPE.betweenValue]: '在什么值之间',
  //字符串比较
  [TYPE.eqString]: '等于',
  [TYPE.like]: '包含',
  [TYPE.notLike]: '不包含',
  //日期
  [TYPE.before]: '在什么日期之前',
  [TYPE.after]: '在什么日期之后',
  [TYPE.betweenTime]: '在什么日期之间',
  //数组
  [TYPE.in]: '在数组中',
  [TYPE.notIn]: '不在数组中',
  [TYPE.neqString]: '不等于',
}
