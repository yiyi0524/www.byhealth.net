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
  main: {
    backgroundColor: sColor.mainBgColor,
  },
  list: {},
  item: {
    marginTop: 8,
    padding: 8,
    backgroundColor: sColor.white,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    overflow: 'hidden',
  },
  avatarImg: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  itemCenter: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    color: sColor.mainBlack,
    marginBottom: 5,
  },
  time: {
    color: sColor.color888,
  },
  genderAge: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 5,
  },
  age: {
    color: sColor.color666,
  },
  setVisible: {
    color: sColor.color888,
  },
})
