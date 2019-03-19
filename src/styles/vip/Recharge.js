import { StyleSheet } from "react-native";
import { windowHeight, windowWidth } from "../../utils/utils";

export default StyleSheet.create({
    gold: {
        backgroundColor: '#fff',
    },
    top: {
        height: 160,
        backgroundColor: '#f53f68',
        padding: 25,
        paddingLeft: 15,
    },
    topName: {
        fontSize: 14,
        color: "#fff",
        marginBottom: 20,
    },
    topNum: {
        fontSize: 60,
        color: '#fff',
    },
    pointsDetailsList: {

    },
    pointsDetailsTitle: {
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center',
        height: 35,
    },
    titleImg: {
        width: 15,
        height: 15,
        marginRight: 3,
    },
    title: {
        fontSize: 14,
        color: '#000',
    },
    list: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: "wrap",
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    item: {
        width: 165,
        height: 110,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#e4e4e4",
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemActive: {
        borderColor: "#e92b32",
    },
    itemPrice: {
        fontSize: 16,
        color: "#000",
    },
    itemMember: {
        fontSize: 12,
        color: "#a8a8a8",
        marginBottom: 10,
        marginTop: 10,
    },
    itemPay: {
        width: 50,
        height: 22,
        lineHeight: 22,
        textAlign: "center",
        borderRadius: 5,
        backgroundColor: "#f53f68",
        color: "#fff",
        fontSize: 14,
    },
    pay: {
        borderTopColor: '#ececec',
        borderTopWidth: 1,
    },
    payList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
        paddingTop: 15,
    },
    payItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        height: 40,
    },
    payItemTitle: {
        fontSize: 16,
        color: "#252525",
    },
    payItemImg: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    selectImg: {
        width: 25,
        height: 25,
    },

    btnBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flex: .1,
    },
    btn: {
        height: 45,
        lineHeight: 45,
        textAlign: 'center',
        fontSize: 14,
        color: '#fff',
        backgroundColor: '#f53f68',
    },
    agree: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    agreeImg: {
        width: 13,
        height: 13,
        resizeMode: "center",
        marginRight: 5,
    },
    agreeTtitle: {
        fontSize: 12,
        color: "#a5a5a5",
    },

})
