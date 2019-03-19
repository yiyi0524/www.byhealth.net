import { StyleSheet, PixelRatio } from "react-native";

export default StyleSheet.create({
  informationList: {
    backgroundColor: "#fff",
  },
  headerRightTitle: {
    fontSize: 14,
    color: "#fff",
    marginRight: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: "#f7f7f7",
  },
  avatarItem: {
    height: 90,
  },
  title: {
    fontSize: 14,
    color: "#252525",
    width: 60,
  },
  itemInput: {
    flex: 1,
    textDecorationLine: "none",
    textAlign: "right",
  },
  itemTextArea: {
    flex: 1,
  },
  avatarBox: {
    width: 70,
    height: 70,
    borderRadius: 100,
    overflow: "hidden",
  },
  avatar: {
    maxWidth: 70,
    maxHeight: 70,
    resizeMode: "cover",
  },
  introductionItem: {
    height: 90,
  },
  authenticationItem: {
    height: 120,
    justifyContent: "center",
    alignItems: 'center',
  },
  authentication: {
    width: 150,
    height: 80,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  authenticationImg: {
    maxWidth: 50,
    maxHeight: 50,
    resizeMode: 'center',
    justifyContent: "center",
    alignItems: "center",
  },
  authenticationTitle: {
    fontSize: 14,
    color: "#939393",
  },
  isVerified: {
    fontSize: 14,
    color: "#939393"
  },
  isVerifiedActive: {
    color: "#252525",
    fontSize: 14,
  },
  hidden: {
    display: "none",
  },

})
