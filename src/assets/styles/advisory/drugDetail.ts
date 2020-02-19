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
    flex: 1,
    backgroundColor: sColor.mainBgColor,
  },
  content: {
    padding: 15,
  },
  drug: {},
  themePar: {
    height: 50,
    backgroundColor: '#fff',
    paddingLeft: 15,
  },
  theme: {
    lineHeight: 50,
    fontSize: 15,
    color: '#333',
  },
  item: {
    backgroundColor: '#fff',
    marginTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  title: {
    fontSize: 14,
    color: '#666',
    lineHeight: 40,
  },
  detailPar: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#ddd',
    paddingTop: 8,
    paddingBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#333',
  },
  img: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
})
