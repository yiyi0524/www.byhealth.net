import { StyleSheet, PixelRatio } from 'react-native'
import sColor from '@styles/color'
import { windowWidth } from '@api/api'
import { windowHeight } from '@/utils/utils'
export default StyleSheet.create({
  loading: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: sColor.white,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loadingTitle: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  loadingPic: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImg: {
    width: 300,
    resizeMode: 'contain',
  },
  headerRight: {
    color: sColor.mainRed,
    paddingRight: 15,
  },
  main: {
    flex: 1,
    backgroundColor: sColor.mainBgColor,
  },
  steps: {
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: sColor.white,
    marginBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
  },
  step: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
  },
  activeNum: {
    width: 20,
    height: 20,
    lineHeight: 20,
    marginBottom: 3,
    backgroundColor: sColor.mainRed,
    borderRadius: 100,
    overflow: 'hidden',
  },
  activeNumDetail: {
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
    color: sColor.white,
  },
  activeStepTitle: {
    color: sColor.mainRed,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: sColor.color888,
  },
  activeLine: {
    flex: 1,
    height: 2,
    backgroundColor: sColor.mainRed,
  },
  stepTitle: {
    color: sColor.color888,
  },
  num: {
    width: 20,
    height: 20,
    lineHeight: 20,
    marginBottom: 3,
    backgroundColor: sColor.color999,
    borderRadius: 100,
    overflow: 'hidden',
  },
  numDetail: {
    width: 20,
    height: 20,
    textAlign: 'center',
    color: sColor.white,
    lineHeight: 20,
  },
  promptTitle: {
    lineHeight: 50,
    textAlign: 'center',
    color: sColor.color888,
  },
  diagnosis: {
    marginLeft: 8,
    marginRight: 0,
    padding: 15,
    marginBottom: 8,
    backgroundColor: sColor.white,
  },
  red: {
    textAlign: "right",
    color: sColor.mainRed,
  },
  theme: {},
  title: {
    color: sColor.mainBlack,
    fontWeight: '500',
    marginBottom: 5,
  },
  titleSpot: {
    marginLeft: 15,
    marginRight: 15,
    width: 3,
    height: 3,
    borderRadius: 100,
    backgroundColor: sColor.color333,
  },
  littleSpot: {
    marginLeft: 2,
    marginRight: 2,
    width: 2,
    height: 2,
    borderRadius: 100,
    backgroundColor: sColor.color333,
  },
  diagnosisItem: {
    marginBottom: 8,
    marginTop: 8,
  },
  diagnosisItemTitle: {
    color: sColor.color666,
    marginRight: 8,
  },
  diagnosisItemAll: {
    color: sColor.color333,
    marginRight: 5,
  },
  diagnosisItemLineTitle: {
    color: sColor.color666,
    marginRight: 5,
  },
  diagnosisItemInput: {
    flex: 1,
  },
  input: {
    fontSize: 14,
    color: sColor.color666,
  },
  diagnosisPic: {},
  diagnosisPicTitle: {
    height: 50,
    lineHeight: 50,
  },
  diagnosisItemImg: {
    marginLeft: 15,
  },
  paddRight: {
    marginRight: 16,
  },
  /**
   * 开方
   */
  pharmacyName: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  pharmacyNameTitle: {
    color: sColor.color666,
  },
  editPharmacyName: {
    flex: 1,
    marginRight: 15,
  },
  pharmacyNameIcon: {
    color: sColor.color999,
    marginLeft: 5,
  },
  drug: {
    color: sColor.mainBlack,
    marginTop: 8,
  },
  drugList: {
    marginTop: 8,
  },
  drugCategoryItem: {
    marginTop: 5,
    marginBottom: 5,
  },
  drugItem: {
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  drugItemTitle: {
    color: sColor.color333,
  },
  drugItemDetail: {
    color: sColor.color888,
  },
  drugItemFa: {
    marginBottom: 5,
  },
  drugItemLeft: {
    flex: 1,
  },
  drugItemLeftTitle: {
    color: sColor.color333,
  },
  drugListFa: {
    marginLeft: 10,
  },
  drugItemLeftDetail: {
    color: sColor.color666,
    marginTop: 5,
  },
  drugItemRight: {},
  usageDosage: {
    marginTop: 5,
  },
  drugPrompt: {
    color: sColor.color999,
    marginTop: 15,
  },
  important: {
    color: sColor.mainRed,
  },
  editDrug: {
    marginTop: 15,
    marginBottom: 8,
  },
  editDrugIcon: {
    marginRight: 10,
  },
  diagnosisItemDetail: {
    color: sColor.color666,
    flex: 1,
  },
  sendPatient: {
    marginTop: 8,
    height: 40,
    lineHeight: 40,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: sColor.mainRed,
    color: sColor.white,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 8,
  },
  selectPharmacy: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: sColor.blackOpa7,
  },
  selectdrug: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: sColor.blackOpa7,
  },
  doctor: {
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: sColor.white,
    padding: 15,
  },
  doctorName: {
    color: sColor.color666,
  },
  drugCategory: {
    marginBottom: 10,
  },
  drugCategoryTitle: {
    color: sColor.mainBlack,
    fontWeight: '500',
  },
  drugName: {
    color: sColor.color333,
    marginTop: 6,
    marginBottom: 3,
  },
  drugDetail: {
    color: sColor.color666,
  },
  traditionalChineseMedicineItem: {
    marginBottom: 5,
  },
  dose: {},
  doseTitle: {
    color: sColor.color666,
  },
  doseDetail: {
    color: sColor.mainRed,
    marginLeft: 5,
    marginRight: 5,
  },
})
