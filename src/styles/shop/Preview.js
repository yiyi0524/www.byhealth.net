import React, { Component } from "react";
import { StyleSheet, PixelRatio } from "react-native";
import sColor from "../../utils/color";
import { windowWidth, windowHeight } from "../../utils/utils";

export default StyleSheet.create({
    bg: {
        width: windowWidth,
    },
    header: {
        height: 230,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 30,
        paddingBottom: 30,
    },
    imgBox: {
        width: 100,
        height: 100,
        borderRadius: 100,
        overflow: "hidden",
        borderColor: sColor.WHITE,
        borderWidth: 3,
        backgroundColor: sColor.WHITE,
    },
    headerImg: {
        width: 97,
        height: 97,
        resizeMode: "contain",
        position: 'absolute',
        left: 0,
        top: 0,
    },
    headerTitle: {
        fontSize: 22,
        color: sColor.WHITE,
        marginTop: 5,
        marginBottom: 5,
    },
    headerDetail: {
        fontSize: 14,
        color: sColor.WHITE,
    },
    list: {
        marginLeft: 25,
        marginRight: 25,
    },
    item: {
        flexDirection: "row",
        height: 50,
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    itemIcon: {
        position: "absolute",
        left: 10,
        width: 25,
        height: 25,
        resizeMode: "contain",
    },
    input: {
        flex: 1,
        backgroundColor: sColor.COMMON_INPUT_BG,
        borderRadius: 5,
        paddingLeft: 45,
        fontSize: 14,
        color: sColor.WHITE,
    },
    code: {
        color: sColor.WHITE,
        fontSize: 14,
        width: windowWidth / 750 * 220,
        marginLeft: 10,
        height: 50,
        textAlign: "center",
        lineHeight: 50,
        backgroundColor: sColor.RED,
        borderRadius: 5,
    },
    btnBox: {
        marginLeft: 25,
        marginRight: 25,
        marginTop: 10,
        borderRadius: 5,
        height: 45,
    },
    btn: {
        color: sColor.WHITE,
        fontSize: 18,
        height: 45,
        lineHeight: 45,
        textAlign: "center",
    },
    bottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 25,
        marginRight: 25,
        marginTop: 25,
    },
    bottomItem: {
        justifyContent: "center",
        alignItems: "center",
    },
    bottomImg: {
        width: 50,
        height: 50,
        resizeMode: "contain",
        marginBottom: 15,
    },
    bottomTitle: {
        color: sColor.WHITE,
        fontSize: 14,
        textAlign: "center",
    },
})
