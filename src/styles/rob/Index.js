import { StyleSheet, PixelRatio } from "react-native";
import { windowWidth, windowHeight } from "../../utils/utils";
import sColor from "../../utils/color";

export default StyleSheet.create({
  grob: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  linearGradient: {
    height: 40,
    justifyContent: 'center',
    flex: 1,
  },
  headerText: {
    color: "#fff",
    fontSize: 14,
    textAlign: 'center',

  },
  banner: {
    height: 90,
    backgroundColor: '#f53f68',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    position: "absolute",
    left: 0,
    right: 0,
  },
  bannerBg: {
    height: 80,
    width: 270,
    resizeMode: 'center',
  },
  topList: {
    position: "absolute",
    top: 80,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    height: 65,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  topItem: {
    width: 100,
    textAlign: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  topItemTitle: {
    fontSize: 16,
    color: '#a6a6a6',

  },
  topItemImg: {
    width: 10,
    height: 10,
    resizeMode: 'center',
    marginLeft: 5,
  },
  topItemBorder: {
    borderLeftWidth: 1 / PixelRatio.get(),
    borderRightWidth: 1 / PixelRatio.get(),
    borderColor: "#cacaca",
  },
  grobList: {
    marginTop: 150,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#f5f5f5',
  },
  grobItem: {
    height: 200,
    backgroundColor: '#fafafa',
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 8,
  },
  header: {
    height: 45,
    alignItems: "center",
    flexDirection: 'row',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#e3e3e3',
  },
  name: {
    width: 65,
    fontSize: 14,
    color: "#000",
  },
  address: {
    width: 50,
    fontSize: 12,
    color: "#000",
  },
  career: {
    width: 80,
    fontSize: 12,
    color: "#000",
  },
  time: {
    position: 'absolute',
    right: 10,
    fontSize: 12,
    color: "#9c9c9c",
  },
  centerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-between",
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 15,
  },
  Placeholder: {
    width: (windowWidth - 60) / 3,
  },
  centerItem: {
    width: (windowWidth - 60) / 3,
    height: 28,
    lineHeight: 28,
    textAlign: 'center',
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    marginBottom: 15,
  },
  centerTextItem: {
    width: (windowWidth - 60) / 3,
    height: 28,
    lineHeight: 28,
    textAlign: 'center',
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  centerImg: {
    maxHeight: 15,
    maxWidth: 15,
    resizeMode: "contain",
    marginRight: 5,
  },
  centerTitle: {
    fontSize: 14,
    color: "#929292"
  },
  active: {
    color: "#f53f68",
  },
  btnGrob: {
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    marginTop: 7,
  },
  btnGrobTitle: {
    height: 33,
    lineHeight: 33,
    fontSize: 16,
    color: "#fff",
    textAlign: 'center',
  },
  hidden: {
    display: "none",
  },
  filter: {
    position: "absolute",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    width: windowWidth,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 100,
    paddingLeft: 50,
  },
  filterBg: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: sColor.WHITE,
    // height: windowHeight,
  },
  filterBox: {
    backgroundColor: sColor.WHITE,
    paddingLeft: 15,
    paddingRight: 15,
    flex: .9,
  },
  inputBox: {
    flexDirection: "row",
    height: 50,
    alignItems: 'center',
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    height: 45,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  filterHeaderLeft: {
    fontSize: 16,
    color: sColor.BLACK,
    paddingLeft: 15,

  },
  filterHeaderTitle: {
    fontSize: 14,
    color: sColor.BLACK,
  },
  filterHeaderRight: {
    fontSize: 14,
    color: sColor.BLACK,
    paddingRight: 15,
  },
  item: {
    marginBottom: 15,
  },
  title: {
    fontSize: 15,
    color: sColor.BLACK,
  },
  input: {
    marginRight: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  itemBox: {

  },
  selectBox: {
    flexDirection: "row",
  },
  selectItem: {
    flexDirection: "row",
    width: 80,
    height: 35,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderColor: sColor.COMMON_LINE,
    borderWidth: 1 / PixelRatio.get(),
    marginRight: 15,
    marginTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
  },
  selectItemActive: {
    flexDirection: "row",
    width: 80,
    height: 35,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderColor: sColor.RED,
    borderWidth: 1 / PixelRatio.get(),
    marginRight: 15,
    marginTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
  },
  selectTitle: {
    fontSize: 14,
    color: sColor.BLACK,
  },
  selectTitleActive: {
    fontSize: 14,
    color: sColor.RED,
  },
  has: {
    fontSize: 14,
    color: sColor.RED,
  },
  btnBox: {
    height: 45,
    alignItems: "center",
    flex: .1,
    marginTop: 15,
    bottom: 0,
  },
  btn: {
    fontSize: 14,
    color: sColor.WHITE,
    height: 45,
    lineHeight: 45,
    textAlign: 'center',
    flex: 1,
  },
  btnClick: {
    flex: 1,
    width: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  textColor: {
    color: "#ccc"
  },
  container: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
