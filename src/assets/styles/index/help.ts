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
    backgroundColor: '#fff',
  },
  list: {},
  headerTitle: {
    height: 50,
    lineHeight: 50,
  },
  item: {
    padding: 15,
  },
  title: {
    fontSize: 16,
    color: '#444',
    lineHeight: 25,
  },
})
