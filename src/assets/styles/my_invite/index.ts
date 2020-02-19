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
    padding: 16,
  },
  list: {},
  item: {
    width: '100%',
    marginBottom: 19,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'solid',
  },
  header: {
    height: 50,
    backgroundColor: '#058A88',
    paddingLeft: 16,
    paddingRight: 16,
  },
  theme: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 50,
  },
  time: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 50,
  },
  detail: {
    flex: 1,
    padding: 12,
    paddingLeft: 8,
    paddingRight: 8,
  },
  desc: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
  },
  title: {
    textAlign: 'center',
    fontSize: 13,
    color: '#333',
  },
})
