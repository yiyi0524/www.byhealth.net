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
    backgroundColor: sColor.white,
  },
  header: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 8,
    paddingTop: 8,
  },
  search: {
    backgroundColor: sColor.mainBgColor,
    borderRadius: 5,
    height: 40,
    flex: 1,
  },
  searchIcon: {
    color: sColor.color888,
  },
  searchTitle: {
    color: sColor.color888,
    width: '100%',
    position: 'relative',
  },
  searchMode: {
    height: 45,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
  },
  separationModule: {
    flex: 1,
    height: 12,
    backgroundColor: sColor.mainBgColor,
  },
  group: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  groupTheme: {
    height: 50,
    flex: 1,
  },
  groupImgFa: {
    width: 30,
    height: 30,
    marginRight: 5,
    overflow: 'hidden',
  },
  groupImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  communicationItemPicture: {
    width: 45,
    height: 45,
    marginRight: 15,
    borderRadius: 100,
    overflow: 'hidden',
  },
  communicationItemPic: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  groupTitle: {
    color: sColor.color666,
  },
  groupIcon: {
    lineHeight: 45,
    color: sColor.color888,
  },
  communicationList: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  communicationItem: {
    height: 65,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorEee,
  },
  communicationItemTitle: {
    color: sColor.color333,
    marginBottom: 5,
  },
  communicationItemdescriptionBottom: {
    flex: 1,
  },
  communicationItemDescription: {
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 2,
    paddingBottom: 2,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: sColor.colorEee,
    borderRadius: 25,
  },
  communicationItemDetail: {
    color: sColor.color666,
    marginRight: 6,
  },
  genderIconFa: {
    marginRight: 2,
    width: 15,
    height: 15,
    overflow: 'hidden',
  },
  genderIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  firstConsultTime: {
    color: sColor.color888,
    marginLeft: 5,
  },
})
