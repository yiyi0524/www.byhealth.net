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
    flex: 1,
    backgroundColor: sColor.mainBgColor,
  },
  list: {
    padding: 15,
  },
  item: {
    backgroundColor: '#fff',
    marginBottom: 8,
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
  },
  name: {
    fontSize: 14,
    color: '#333',
  },
  ctime: {
    fontSize: 13,
    color: '#888',
  },
  shipping: {
    fontSize: 14,
    color: '#dd4f43',
  },
  wait: {
    color: '#4a8af4',
  },
  success: {
    color: '#1aa15f',
  },
})
