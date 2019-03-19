import { StyleSheet } from "react-native";

export default StyleSheet.create({
  grobDetail: {
    backgroundColor: "#e7eaef",
  },
  banner: {
    backgroundColor: '#f53f68',
    height: 160,
    paddingLeft: 15,
    paddingRight: 15,
  },
  classification: {
    width: 50,
    height: 25,
    lineHeight: 25,
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    backgroundColor: "#f4959b",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    position: "absolute",
    right: 0,
  },
  bannerName: {
    marginTop: 25,
    fontSize: 18,
    color: "#fff",
  },
  bannerList: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bannerItem: {
    backgroundColor: "#f36680",
    fontSize: 12,
    color: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  loan: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingBottom: 10,
    paddingTop: 10,
  },
  left: {
    justifyContent: "center",
    alignItems: 'center',
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#ffa0a3",
  },
  right: {
    justifyContent: "center",
    alignItems: 'center',
    flex: 1,
  },
  loanMoney: {
    fontSize: 18,
    color: "#fff",
  },
  loanTime: {
    fontSize: 18,
    color: "#fff",
  },
  loanDetail: {
    fontSize: 12,
    color: "#fff",
  },
  phone: {
    marginLeft: 13,
    marginRight: 13,
    marginTop: 10,
    backgroundColor: "#fff",
    height: 55,
    justifyContent: "space-between",
    alignItems: 'center',
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    marginBottom: 8,
  },
  phoneNum: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: 'center',
  },
  phoneNumber: {
    fontSize: 18,
    color: "#000",
  },
  phoneDetail: {
    fontSize: 12,
    color: "#dfdfdf",
    marginLeft: 5,
  },
  phoneImg: {
    width: 26,
    height: 26,
  },
  basic: {
    marginLeft: 13,
    marginRight: 13,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 5,
  },
  basicTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: 'center',
    height: 43,
    marginLeft: 10,
    marginRight: 10,
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
  },
  basicTheme: {
    fontSize: 14,
    color: "#000",
  },
  basicImg: {
    maxWidth: 30,
    maxHeight: 33,
    resizeMode: 'center',
  },
  basicList: {
    marginLeft: 10,
    marginRight: 10,
  },
  basicItem: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    height: 30,
  },
  basicItemTitle: {
    fontSize: 14,
    color: "#000",
  },
  basicItemDetail: {
    fontSize: 14,
    color: "#000",
  },
  btn: {
    height: 45,
  },
  btnTitle: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 45,
    textAlign: 'center',
  },
  hidden: {
    display: "none",
  },


})
