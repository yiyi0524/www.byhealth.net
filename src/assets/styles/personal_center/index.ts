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
  main: {
    backgroundColor: sColor.white,
  },
  separationModule: {
    flex: 1,
    height: 12,
    backgroundColor: sColor.mainBgColor,
  },
  list: {},
  item: {
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  title: {
    color: sColor.color333,
  },
  logout: {
    color: sColor.mainRed,
    height: 45,
    lineHeight: 45,
    textAlign: 'center',
  },
  icon: {
    color: sColor.color888,
  },
  version: {
    borderRadius: 25,
    backgroundColor: sColor.mainRed,
    color: sColor.white,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
  },
})
