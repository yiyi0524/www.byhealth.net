import React, { Component } from "react";
import { StyleSheet, PixelRatio } from "react-native";

export default StyleSheet.create({
    main: {
        backgroundColor: "#f5f5f5",
    },
    list: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
    },
    item: {
        backgroundColor: "#f3fdff",
        padding: 45,
        overflow: "hidden",
        marginBottom: 10,
    },
    itemImg: {
        position: 'absolute',
        bottom: -40,
        right: 0,
        maxWidth: 80,
        maxHeight: 80,
        resizeMode: "center",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        height: 45,
    },
    headerLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
    },
    headerLeftIcon: {
        width: 27,
        height: 27,
        textAlign: 'center',
        lineHeight: 27,
        borderRadius: 100,
        backgroundColor: "#f53f68",
        fontSize: 12,
        color: "#fff",
        marginRight: 10,
    },
    headerLeftName: {
        fontSize: 14,
        color: "#000",
    },
    headerRight: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        textAlign: "right",
    },
    headerRightOperation: {
        fontSize: 12,
        color: "#969090",
        marginLeft: 10,
    },
    content: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        height: 50,
    },
    contentLeft: {

    },
    contentName: {
        fontSize: 16,
        color: "#000",
        width: 75,
    },
    contentDetail: {
        fontSize: 12,
        color: "#969090",
        textAlign: 'center',
        marginTop: 5,
    },
    line: {
        width: 1,
        height: 40,
        backgroundColor: "#969090",
    },
    contentRight: {},
    contentLoanMoney: {
        fontSize: 16,
        color: "#000",
    },
    contentLoanRate: {
        fontSize: 12,
        color: "#969090",
        textAlign: 'center',
        marginTop: 5,
    },
    btn: {
        height: 50,
        justifyContent: 'center',
        alignItems: "center",
        fontSize: 14,
        color: "#fff",
        lineHeight: 50,
        textAlign: "center",
    },
    btnBox: {
        marginTop: 20,
    },
    informationDetail: {

    },
    informationDetailHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 45,
        alignItems: "center",
    },
    infromationDetailTitle: {
        fontSize: 14,
        color: "#979797",
        marginRight: 5,
    },
    infromationDetailList: {},
    infromationDetailItem: {
        marginTop: 10,
    },
    infromationDetailItemTitle: {
        height: 40,
        lineHeight: 40,
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: "#eee",
        borderBottomWidth: 1 / PixelRatio.get(),
    },
    infromationDetailItemBox: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        height: 40,
        paddingTop: 15,
        paddingBottom: 15,
    },
    infromationDetailItemBoxTitle: {
        fontSize: 14,
        color: "#252525",
        marginRight: 10,
    },
    infromationDetailItemBoxDetail: {
        fontSize: 14,
        color: "#252525",
    },
    hidden: {
        display: "none",
    },
})
