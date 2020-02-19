import sColor from '@styles/color'
import { StyleSheet } from 'react-native'
export default StyleSheet.create({
  main: {
    flex: 1,
    position: 'relative',
  },
  tips: {
    textAlign: 'center',
    paddingTop: 30,
  },
  slider: {
    height: 210,
  },
  item: {
    width: '100%',
  },
  img: {
    width: '100%',
    height: 210,
    resizeMode: 'cover',
  },
  dotPar: {
    position: 'absolute',
    top: 170,
    left: 15,
    backgroundColor: '#999',
    borderRadius: 15,
    padding: 2,
    paddingLeft: 8,
    paddingRight: 8,
  },
  dot: {
    fontSize: 16,
    color: '#fff',
  },
  article: {
    padding: 15,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  content: {
    fontSize: 14,
    color: '#666',
    marginTop: 15,
    marginBottom: 25,
  },
  time: {},
  viewCount: {
    fontSize: 12,
    color: '#999',
  },
  rightTitle: {
    paddingRight: 15,
    fontSize: 14,
    color: sColor.mainRed,
  },
})
