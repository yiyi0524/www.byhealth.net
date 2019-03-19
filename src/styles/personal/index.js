import React from 'react';
import {
  StyleSheet, Dimensions, PixelRatio,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  header: {
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
  content: {
    backgroundColor: '#f7f7f7',
    paddingBottom: 50,
  },
  information: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    // height: 180,
    borderRadius: 5,
    marginTop: 45,
  },
  informationTop: {
    flex: 1,
    alignItems: 'center',
  },
  informationAvatar: {
    width: 70,
    height: 70,
    overflow: "hidden",
    borderColor: '#fff',
    borderWidth: 5,
    padding: 2,
    borderRadius: 100,
    marginTop: -40,
    justifyContent: 'center',
    alignItems: "center",
  },
  informationAvatarImg: {
    width: 68,
    height: 68,
  },
  informationTitle: {
    fontSize: 20,
    marginTop: 5,
    color: "#252525"
  },
  informationPhone: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  informationPhoneAvatar: {
    width: 10,
    height: 16,
    marginRight: 2,
  },
  informationPhoneText: {
    fontSize: 12,
    color: '#f53f68',

  },
  informationList: {
    flexDirection: 'row',
    paddingTop: 10,
    alignContent: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#d6d6d6',
    borderTopWidth: 1 / PixelRatio.get(),
  },
  hidden: {
    display: "none",
  },
  informationItem: {
    width: 110,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  informationItemBorder: {
    borderLeftWidth: 1 / PixelRatio.get(),
    borderRightWidth: 1 / PixelRatio.get(),
    borderColor: '#d6d6d6',
  },
  informationItemNum: {
    fontSize: 16,
    color: "#2f2f2f",
  },
  informationItemName: {
    fontSize: 14,
    color: '#2f2f2f',
    marginTop: 5,
  },
  informationItemImg: {
    width: 18,
    height: 15,
    marginBottom: 4,
  },
  menuList: {
    margin: 10,
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  menuItem: {
    width: (windowWidth - 60) / 3,
    height: 70,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  menuItemImg: {
    maxHeight: 25,
    maxWidth: 25,
    resizeMode: "contain",
  },
  menuItemName: {
    fontSize: 14,
    color: "#2f2f2f",
    marginTop: 15,
  },
  caseNumber: {
    marginBottom: 15,
    marginTop: 15,
  },
  caseNumberDescription: {
    fontSize: 10,
    color: "#ccc",
    textAlign: "center",
  },
})
