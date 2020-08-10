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
  prompt: {
    padding: 15,
    backgroundColor: sColor.blue,
  },
  promptTitle: {
    color: sColor.white,
  },
  diagnosis: {
    margin: 8,
    marginBottom: 0,
    padding: 15,
    backgroundColor: sColor.white,
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
    minHeight: 50,
  },
  diagnosisItemTitle: {
    color: sColor.color666,
    marginRight: 15,
  },
  percentageOfCommission: {
    width: 120,
  },
  percentageOfCommissionInput: {
    width: 110,
  },
  diagnosisItemAll: {
    color: sColor.color333,
    marginRight: 15,
  },
  diagnosisItemLineTitle: {
    color: sColor.color666,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.color999,
    marginRight: 15,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 5,
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
    marginBottom: 8,
  },
  drugList: {},
  drugItem: {
    marginTop: 5,
    marginBottom: 5,
  },
  drugItemLeft: {
    flex: 1,
  },
  drugItemLeftTitle: {
    color: sColor.color333,
  },
  drugItemLeftDetail: {
    color: sColor.color666,
    marginTop: 5,
  },
  drugItemRight: {},
  usageDosage: {},
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
    color: sColor.color999,
  },
  saveBox: {
    flex: 3,
  },
  sendbox: {
    flex: 5,
  },
  savePrescription: {
    marginTop: 8,
    height: 40,
    lineHeight: 40,
    marginLeft: 15,
    backgroundColor: '#ef6e4c',
    color: sColor.white,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 8,
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
  // 中药
  chooseCategoryDrugList: {
    flex: 1,
  },
  chooseCategoryItem: {},
  traditionalChineseMedicine: {},
  chooseDrugList: {
    paddingLeft: 10,
  },
  chooseDrugItem: {
    marginBottom: 8,
    marginRight: '2%',
    minWidth: '46%',
  },
  chooseDrugTitle: {
    color: sColor.color666,
    marginRight: 8,
  },
  chooseDrugCount: {
    color: sColor.color333,
  },
  deficiency: {
    color: sColor.mainRed,
  },
  prescriptionTpl: {
    height: 45,
  },
  prescriptionTplTitle: {
    color: sColor.color666,
  },
  prescriptionTplIcon: {
    color: sColor.color888,
  },
  empty: {
    color: sColor.color888,
    textAlign: 'center',
    marginTop: 8,
  },
  dose: {
    height: 50,
  },
  gram: {
    marginTop: 5,
    marginBottom: 8,
  },
  gramDesc: {
    color: sColor.color666,
  },
  doseTitle: {
    color: sColor.color333,
    fontSize: 14,
  },
  doseInputFather: {
    width: 100,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  doseInput: {
    fontSize: 14,
    color: sColor.mainRed,
  },
  saveTpl: {
    color: '#ccc',
  },
  tplName: {},
  tplTitle: {
    color: '#666',
  },
  name: {
    flex: 1,
  },
  minusCircle: {
    color: sColor.mainRed,
    marginRight: 10,
  },
})
