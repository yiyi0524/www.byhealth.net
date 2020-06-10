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
    backgroundColor: sColor.white,
  },
  list: {
    paddingRight: 15,
  },
  assistantItem: {
    position: 'relative',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  basicInfo: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  name: {
    position: 'relative',
    fontSize: 14,
    color: sColor.color888,
  },
  account: {
    position: 'relative',
    marginTop: 5,
    marginLeft: 0,
    fontSize: 14,
    color: sColor.color888,
  },
  editBtn: {
    fontSize: 14,
    color: sColor.mainRed,
    // borderWidth: 1 / PixelRatio.get(),
    // borderColor: sColor.colorDdd,
    textAlign: 'center',
  },
  modal: {
    position: 'absolute',
    paddingTop: 25,
    paddingBottom: 0,
    paddingRight: 25,
    paddingLeft: 25,
    top: 100,
    width: '86%',
    left: '7%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
})
