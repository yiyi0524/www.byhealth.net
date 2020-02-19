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
  },
  theme: {
    backgroundColor: '#05A4A5',
    height: 50,
    lineHeight: 50,
    paddingLeft: 16,
    paddingRight: 16,
  },
  themeTitle: {
    fontSize: 18,
    color: '#fff',
  },
  themeCount: {
    fontSize: 14,
    color: '#fff',
  },
  themeNum: {
    fontSize: 18,
    fontWeight: '700',
    paddingLeft: 10,
    color: '#fff',
  },
  list: {},
  item: {
    height: 44,
  },
  itemGray: {
    backgroundColor: 'rgba(164, 164, 164, 0.1)',
  },
  desc: {
    flex: 1,
    lineHeight: 44,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  money: {
    flex: 1,
    fontSize: 15,
    color: '#05A3A1',
    textAlign: 'center',
  },
  header: {
    height: 79,
    paddingTop: 13,
    backgroundColor: '#05A4A5',
  },
  yearPar: {
    paddingRight: 16,
    paddingLeft: 16,
  },
  year: {
    flex: 1,
  },
  rightContent: {
    width: '45%',
    textAlign: 'left',
  },
  themeHeight: {
    height: 35,
  },
  iconPar: {
    width: 40,
  },
  iconLeft: {
    textAlign: 'left',
  },
  icon: {
    textAlign: 'right',
    fontSize: 16,
    color: '#fff',
  },
  time: {
    fontSize: 13,
    color: '#fff',
  },
})
