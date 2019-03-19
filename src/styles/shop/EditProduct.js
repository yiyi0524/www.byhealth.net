import React, { Component } from "react";
import { StyleSheet, PixelRatio } from "react-native";
import { windowHeight, windowWidth } from "../../utils/utils";

export default StyleSheet.create({
    list: {
        backgroundColor: "#f5f5f5",
    },
    item: {
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomColor: "#eee",
        borderBottomWidth: 1 / PixelRatio.get(),
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 14,
        color: "#252525",
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: "#252525",
        textAlign: "right",
    },
    chooseInput: {
        height: 50,
        lineHeight: 50,
        flex: 1,
        fontSize: 14,
        color: "#252525",
        textAlign: "right",
    },
    chooseItem: {
        textAlign: 'right',
        flex: 1,
    },
    icon: {
        width: 25,
    },
    picker: {
        flex: 1,
        fontSize: 14,
        color: "#252525",
        textAlign: "right",

    },
    pickerTitle: {
        justifyContent: "center",
        alignItems: "center",
    },
    hidden: {
        display: "none",
    },
    chooseServiceType: {
        position: "absolute",
        top: 0,
        left: 0,
        width: windowWidth,
        height: windowHeight,
        backgroundColor: "#fff",
        zIndex: 11,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
    },
    prompt: {
        borderColor: "#ccc",
        borderWidth: 1 / PixelRatio.get(),
        borderStyle: "dotted",
        borderRadius: 5,
        marginBottom: 10,
    },
    promoptTitle: {
        fontSize: 14,
        color: "#ccc",
        textAlign: 'center',
        padding: 5,
    },
    chooseServiceList: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: 'center',
        flexWrap: "wrap",
    },
    chooseServiceItem: {
        fontSize: 14,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "#ccc",
        color: "#fff",
    },
    chooseServiceItemActive: {
        backgroundColor: "#f53f68",
        fontSize: 14,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 5,
        paddingRight: 5,
        color: "#fff",
    },
    choooseServiceItem: {
        marginRight: 6,
        marginTop: 6,
    },
    senBtn: {
        flex: 1,
        position: "relative",
        top: windowHeight - 300,
    },
    btnBox: {
        height: 50,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },
    btn: {
        height: 50,
        textAlign: "center",
        lineHeight: 50,
        color: "#fff",
        fontSize: 14,
    },
    selectBtnBox: {
        backgroundColor: "#f53f68",
    },
    selectBtn: {
        height: 50,
        textAlign: "center",
        lineHeight: 50,
        color: "#fff",
        fontSize: 14,
    },
})
