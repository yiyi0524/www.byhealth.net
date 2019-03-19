import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { windowHeight, windowWidth } from "../../utils/utils";

export default StyleSheet.create({
    mian: {
        backgroundColor: "#f5f5f5",
    },
    item: {
        height: 50,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: "#fff",
        borderBottomColor: "#eee",
        borderBottomWidth: 2,
    },
    title: {
        fontSize: 14,
        color: "#000",
    },
    input: {
        textAlign: "right",
        fontSize: 14,
        color: "#6d6d6d",
    },
    statusItem: {
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: "#fff",
        marginTop: 10,
    },
    statusTitle: {
        fontSize: 14,
        color: "#000",
        height: 50,
        lineHeight: 50,
    },
    statusInput: {
        fontSize: 14,
        color: "#6d6d6d",
    },
    btnBox: {
        flex: 0.1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    btn: {
        height: 50,
        lineHeight: 50,
        textAlign: 'center',
        fontSize: 14,
        color: "#fff",
    },
})
