// import { bget, GetListParam } from "./api";
export const GENDER = {
  'UNDEFINED': 0x0,
  'MAN': 0x1,
  'WOMAN': 0x2,
};
export const GENDER_ZH = {
  [GENDER.UNDEFINED]: '未知',
  [GENDER.MAN]: '男',
  [GENDER.WOMAN]: '女',
};
/**
 * 职称
 */
export const TECHNICAL_TITLE = {
  'RESIDENT': 0x0,
  'ATTENDING_DOCTOR': 0x1,
  'DEPUTY_CHIEF_PHYSICIAN': 0x2,
  'CHIEF_PHYSICIAN': 0x3,
};
export const TECHNICAL_TITLE_ZH = {
  [TECHNICAL_TITLE.RESIDENT]: '住院医师',
  [TECHNICAL_TITLE.ATTENDING_DOCTOR]: '主治医师',
  [TECHNICAL_TITLE.DEPUTY_CHIEF_PHYSICIAN]: '副主任医师',
  [TECHNICAL_TITLE.CHIEF_PHYSICIAN]: '主任医师',
};
