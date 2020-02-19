import { windowHeight } from '@/utils/utils'
import { windowWidth } from '@api/api'
import sColor from '@styles/color'
import { StyleSheet, PixelRatio } from 'react-native'
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
    flex: 0.9,
    backgroundColor: sColor.mainBgColor,
  },
  list: {},
  item: {
    marginTop: 8,
    padding: 15,
    backgroundColor: sColor.white,
    position: 'relative',
    overflow: 'hidden',
  },
  itemImg: {
    marginRight: 8,
  },
  itemTitle: {
    color: sColor.color666,
    height: 40,
    lineHeight: 40,
  },
  operation: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: sColor.colorDdd,
  },
  itemBtnTitle: {
    color: sColor.color666,
    marginLeft: 30,
    marginTop: 10,
  },
  itemRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  itemIcon: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 12,
    borderTopColor: '#f2878d', //下箭头颜色
    borderLeftColor: 'transparent', //右箭头颜色
    borderBottomColor: 'transparent', //上箭头颜色
    borderRightColor: '#f2878d', //左箭头颜色
  },
  btn: {
    justifyContent: 'center',
    height: 50,
    marginTop: 8,
    backgroundColor: sColor.white,
  },
  btnIcon: {
    color: sColor.mainRed,
    marginRight: 8,
  },
  btnTitle: {
    color: sColor.color666,
  },
})
