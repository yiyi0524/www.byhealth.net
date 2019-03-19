import { StyleSheet, PixelRatio } from "react-native";
import { windowWidth } from "../../utils/utils";

export default StyleSheet.create({
  shop: {
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 95,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  left: {
    width: 70,
    height: 70,
    borderRadius: 100,
    overflow: "hidden",
  },
  leftImg: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  right: {
    flex: 1,
    marginLeft: 15,
  },
  rightName: {
    fontSize: 16,
    color: "#010101",
  },
  rightPhone: {
    fontSize: 14,
    color: "#010101",
    marginTop: 5,
    marginBottom: 5,
  },
  verified: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: "center",
  },
  verifiedTitle: {
    width: 65,
    height: 22,
    lineHeight: 22,
    textAlign: "center",
    borderRadius: 25,
    color: "#c6c6c6",
    fontSize: 12,
    backgroundColor: '#f5f5f5',
    marginRight: 5,
  },
  verifiedTitleActive: {
    backgroundColor: "#f53f68",
    color: "#fff",
    fontSize: 12,
  },
  applyList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 65,
    backgroundColor: "#fff",
    borderTopColor: "#f7f7f7",
    borderTopWidth: 1 / PixelRatio.get(),
  },
  applyItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyNum: {
    fontSize: 16,
    color: "#5c5c5c",
  },
  applyTitle: {
    fontSize: 14,
    color: "#9d9d9d",
  },
  content: {
    marginBottom: 20,
  },
  item: {
    marginTop: 8,
    backgroundColor: "#fff",
    height: 80,
    justifyContent: "space-between",
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
  },
  itemImg: {
    maxWidth: 40,
    maxHeight: 40,
    resizeMode: 'center',
  },
  itemBox: {
    justifyContent: "center",
    flex: 1,
    marginLeft: 20,
  },
  itemTitle: {
    fontSize: 14,
    color: "#0f0f0f",
    marginBottom: 5,
  },
  itemDetail: {
    fontSize: 12,
    color: "#9d9d9d",
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  hidden: {
    display: "none",
  },
  btnBox: {
    width: windowWidth - 60,
    height: 45,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnImg: {
    maxWidth: 21,
    maxHeight: 21,
    resizeMode: 'center',
    marginRight: 10,
  },
  btnTitle: {
    fontSize: 14,
    color: "#fff",
  },
  btnWhite: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  btnWhiteTitle: {
    width: windowWidth - 60,
    height: 45,
    fontSize: 14,
    color: "#f53f68",
    borderColor: '#f53f68',
    borderWidth: 1 / PixelRatio.get(),
    textAlign: 'center',
    lineHeight: 45,
    borderRadius: 5,
    backgroundColor: "#fff",

  },
})
