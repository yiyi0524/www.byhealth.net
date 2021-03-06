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
  invitePatient: {
    flex: 1,
  },
  headerRight: {
    paddingRight: 15,
    color: sColor.mainRed,
  },
  main: {
    flex: 0.9,
    backgroundColor: sColor.white,
  },
  invite: {
    marginTop: 30,
    alignItems: 'center',
  },
  title: {
    color: sColor.mainBlack,
    marginBottom: 15,
  },
  detail: {
    color: sColor.color888,
    marginBottom: 3,
  },
  important: {
    color: sColor.mainRed,
  },
  qrCode: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    alignItems: 'center',
  },
  logo: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: sColor.mainBgColor,
    flex: 1,
    width: '100%',
    marginTop: 15,
    marginBottom: 15,
  },
  logoImg: {
    width: 150,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  share: {
    flex: 0.1,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 5,
  },
  shareTitle: {
    color: sColor.white,
    height: 45,
    lineHeight: 45,
    borderRadius: 5,
    backgroundColor: sColor.mainRed,
    textAlign: 'center',
  },
})
