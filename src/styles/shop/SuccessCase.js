import React, { Component } from "react";
import { StyleSheet, PixelRatio } from "react-native";

export default StyleSheet.create({
    main: {
        backgroundColor: "#f5f5f5",
    },
    list: {

    },
    item: {
        backgroundColor: "#fff",
        padding: 15,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 45,
        borderBottomColor: "#eee",
        borderBottomWidth: 1 / PixelRatio.get(),
    },
    loanMoney: {
        fontSize: 14,
        color: "#000",
    },
    loanMoneyNum: {
        color: "#f53f68",
    },
    content: {
        paddingTop: 10,
        marginBottom: 10,
    },
    name: {
        flexDirection: 'row',
        height: 30,
    },
    title: {
        fontSize: 14,
        color: "#000",
        marginRight: 10,
    },
    detail: {
        fontSize: 13,
        color: "#6d6d6d",
        flex: 1,
    },
    customerStatus: {
        flexDirection: "row",
        minHeight: 30,
    },
    bottom: {
        borderTopColor: "#eee",
        borderTopWidth: 1 / PixelRatio.get(),
        flexDirection: 'row',
    },
    operation: {
        fontSize: 14,
        color: "#000",
        marginRight: 20,
        paddingTop: 10,
    },
    btnBox: {
        flex: 1,
        marginTop: 20,
    },
    btn: {
        height: 50,
        color: "#fff",
        textAlign: "center",
        lineHeight: 50,
    },

})
