import { windowHeight } from '@/utils/utils'
import { windowWidth } from '@api/api'
import sColor from '@styles/color'
import { StyleSheet } from 'react-native'
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
    paddingRight: 15,
    color: sColor.mainRed,
  },
  main: {
    flex: 0.9,
    backgroundColor: sColor.mainBgColor,
  },
  searchTitle: {
    color: sColor.color888,
    width: '100%',
    position: 'relative',
  },
  searchIcon: {
    color: sColor.color888,
  },
  prescriptionList: {},
  prescriptionItem: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 14,
    backgroundColor: sColor.white,
  },
  prescriptionHeader: {
    marginBottom: 8,
  },
  prescriptionTitle: {
    color: sColor.color333,
  },
  prescriptionTime: {
    color: sColor.color888,
  },
  prescriptionDetail: {
    color: sColor.color666,
  },
})
