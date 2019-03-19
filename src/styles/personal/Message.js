import React from 'react';
import {
  StyleSheet, Dimensions, PixelRatio,
} from "react-native";
import { windowHeight } from '../../utils/utils';

export default StyleSheet.create({
  message: {
    backgroundColor: "#f5f5f5",
    minHeight: windowHeight,
  },
  textColor: {
    color: "#ccc"
  },
  container: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  itemImagBox: {
    width: 65,
    height: 65,
    borderRadius: 100,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  itemImg: {
    width: 65,
    height: 65,
  },
  itemRight: {
    flex: 1,
    marginLeft: 15,
  },
  itemRightTitle: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
    lineHeight: 30,
  },
  itemTitle: {
    fontSize: 14,
    color: "#000",
    width: 150,
  },
  itemTime: {
    fontSize: 14,
    color: "#000",
  },
  itemContent: {},
  itemContentTitle: {

  },
  control: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  controlTitle: {
    fontSize: 14,
    color: "#000",
    marginRight: 15,
  },
  controlNoRead: {
    fontSize: 14,
    color: "#f53f68",
  },
  hidden: {
    display: "none",
  },
  headerRight: {
    marginRight: 15,
    color: "#fff",
  },

})
