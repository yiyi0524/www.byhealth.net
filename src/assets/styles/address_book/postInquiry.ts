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
    backgroundColor: sColor.mainBgColor,
    flex: 1,
  },
  content: {
    flex: 0.9,
  },
  tips: {
    padding: 15,
    backgroundColor: '#fff',
  },
  tipsTitle: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 15,
  },
  item: {
    marginBottom: 15,
    width: 250,
  },

  avatarPar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    overflow: 'hidden',
    marginRight: 25,
    borderWidth: 2 / PixelRatio.get(),
    borderColor: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  msgRight: {
    backgroundColor: '#fff',
    marginTop: 5,
    padding: 8,
    borderRadius: 5,
    position: 'relative',
    maxWidth: 230,
  },
  icon: {
    width: 0,
    height: 0,
    borderWidth: 10,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#fff',
    borderRightWidth: 24,
    position: 'absolute',
    top: 5,
    left: -26,
  },
  msg: {
    fontSize: 14,
    color: '#666',
  },
  right: {
    flexDirection: 'row-reverse',
    textAlign: 'right',
    marginBottom: 15,
  },
  rightAvatarPar: {
    marginLeft: 25,
    marginRight: 0,
  },
  rightMsgRight: {
    backgroundColor: sColor.lightBlue,
  },
  rightIcon: {
    width: 0,
    height: 0,
    borderWidth: 10,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: sColor.lightBlue,
    borderLeftWidth: 24,
    top: 5,
    right: -26,
    position: 'absolute',
  },
  footer: {
    flex: 0.1,
    position: 'relative',
  },
  container: {
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 5,
    paddingBottom: 5,
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  inputPar: {
    flex: 1,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#ddd',
    borderRadius: 2,
    marginRight: 15,
  },
  input: {
    fontSize: 14,
    color: sColor.color666,
  },
  btn: {
    padding: 15,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#1681e7',
    borderRadius: 3,
  },
  btnTitle: {
    fontSize: 15,
    color: '#fff',
  },
})
