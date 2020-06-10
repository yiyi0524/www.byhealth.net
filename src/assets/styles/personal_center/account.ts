import { windowHeight } from '@/utils/utils'
import { windowWidth } from '@api/api'
import sColor from '@styles/color'
import { PixelRatio, StyleSheet } from 'react-native'
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
  main: {
    backgroundColor: sColor.mainBgColor,
  },
  headerRight: {
    color: sColor.white,
    paddingRight: 15,
  },
  header: {
    padding: 15,
    backgroundColor: sColor.lightGreen,
  },
  headerDescription: {
    color: sColor.whiteOpa7,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerCenter: {
    marginTop: 5,
  },
  headerCenterLeft: {
    flex: 1,
  },
  headerCenterLeftIcon: {
    color: sColor.whiteOpa7,
    marginRight: 5,
  },
  headerCenterLeftTitle: {
    color: sColor.whiteOpa7,
  },
  headerCenterTitle: {
    color: sColor.whiteOpa7,
    flex: 1,
  },
  headerCenterRightFa: {
    borderWidth: 1 / PixelRatio.get(),
    borderColor: sColor.whiteOpa7,
    borderRadius: 15,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  headerCenterRight: {
    color: sColor.whiteOpa7,
  },
  bank: {
    marginTop: 15,
  },
  addBank: {
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: sColor.white,
    borderRadius: 15,
    overflow: 'hidden',
  },
  addBankTitle: {
    padding: 30,
  },
  addBankIcon: {
    color: sColor.lightGreen,
  },
  addBankDescription: {
    color: sColor.color333,
    marginLeft: 8,
  },
  addBankBtn: {
    color: sColor.white,
    backgroundColor: sColor.lightGreen,
    height: 40,
    lineHeight: 40,
    textAlign: 'center',
  },
  bankDescription: {
    marginTop: 15,
    backgroundColor: sColor.white,
    paddingLeft: 15,
    paddingRight: 15,
    height: 50,
  },
  bankDescriptionTitle: {
    color: sColor.color333,
  },
  bankDescriptionRight: {
    color: sColor.color888,
  },
  record: {
    marginTop: 15,
  },
  recordItem: {
    backgroundColor: '#fff',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingLeft: 15,
    paddingRight: 15,
  },
  recordTitle: {
    fontSize: 15,
    color: '#666',
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
  },
  recordName: {
    fontSize: 14,
    color: '#666',
  },
  recordMoney: {
    fontSize: 14,
    color: '#888',
  },
  recordSuccess: {
    fontSize: 14,
    color: sColor.lightGreen,
  },
  recordFail: {
    fontSize: 14,
    color: sColor.mainRed,
  },
  recordRime: {
    fontSize: 12,
    color: '#888',
  },
  tips: {
    fontSize: 14,
    color: sColor.mainRed,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 0,
  },
})
