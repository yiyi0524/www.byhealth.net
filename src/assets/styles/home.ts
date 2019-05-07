import { StyleSheet, PixelRatio } from "react-native"
import sColor from "@styles/color"
import { windowWidth } from "@api/api"
import { windowHeight } from "@/utils/utils"
export default StyleSheet.create({
  loading: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: sColor.white,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  loadingTitle: {
    textAlign: "center",
    justifyContent: "center",
  },
  loadingPic: {
    width: "100%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingImg: {
    width: 300,
    resizeMode: "center",
  },
  main: {
    backgroundColor: sColor.white,
  },
  header: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerAvatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderWidth: 2 / PixelRatio.get(),
    borderColor: sColor.colorEee,
    overflow: "hidden",
  },
  headerAvatar: {
    width: 60,
    height: 60,
    resizeMode: "center",
  },
  headerTitle: {
    flex: 1,
    marginLeft: 15,
  },
  headerName: {
    color: sColor.color333,
  },
  headerVerifiedTitle: {
    color: sColor.color888,
  },
  headerVerified: {
    marginTop: 8,
  },
  headerMedicalQualification: {
    paddingLeft: 2,
    paddingRight: 2,
    marginLeft: 10,
    backgroundColor: sColor.mainYellow,
  },
  headerMedicalQualificationTitle: {
    color: sColor.color888,
  },
  headerMedicalQualificationIcon: {
    color: sColor.mainRed,
    marginLeft: 3,
  },
  headerHelp: {},
  headerHelpTitle: {
    color: sColor.color333,
  },
  marginHeight: {
    height: 8,
    backgroundColor: sColor.mainBgColor,
  },
  /**
   * 处方数
   */
  prescription: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  prescriptionItem: {
    flex: 1,
    alignItems: "center",
  },
  prescriptionItemTitle: {
    color: sColor.color999,
    marginTop: 3,
  },
  prescriptionItemNum: {
    color: sColor.color333,
  },
  /**
   * 认证
   * */
  verified: {
    marginLeft: 15,
    marginRight: 15,
    height: 45,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: sColor.mainYellow,
    marginBottom: 15,
  },
  verifiedTheme: {},
  verifiedTitle: {
    paddingLeft: 3,
    paddingRight: 3,
    borderColor: sColor.mainRed,
    borderWidth: 1 / PixelRatio.get(),
    marginRight: 5,
    color: sColor.mainRed,
  },
  verifiedDescription: {
    color: sColor.color666,
  },
  verifiedIcon: {
    color: sColor.color888,
  },
  /**分类 */
  categoryList: {
    padding: 15,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  categoryItem: {
    width: (windowWidth - 30) / 4,
    alignItems: "center",
  },
  categoryItemPic: {
    width: 35,
    height: 35,
    resizeMode: "center",
    borderRadius: 7,
  },
  categoryItemTitle: {
    textAlign: "center",
    color: sColor.mainBlack,
    marginTop: 8,
  },
  /**
   * banner
   */
  bannerList: {
    backgroundColor: sColor.mainBgColor,
    paddingLeft: 15,
    paddingRight: 15,
  },
  scrollPaddingRight: {
    width: 15,
  },
  bannerItem: {
    width: 130,
    height: 80,
    marginRight: 10,
    backgroundColor: sColor.white,
    borderRadius: 5,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: sColor.colorCcc,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 10,
  },
  bannerImg: {
    width: 130,
    height: 80,
    resizeMode: "cover",
  },
  /**
   * 设置
   */
  settingList: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  settingItem: {
    height: 45,
    lineHeight: 45,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  settingTitle: {
    color: sColor.mainBlack,
  },
  settingDescription: {
    color: sColor.color888,
    marginRight: 10,
  },
  settingIcon: {
    color: sColor.color888,
  },
})
