import { StyleSheet, PixelRatio } from "react-native";
import { windowWidth, windowHeight } from "../../utils/utils";

export default StyleSheet.create({
    integral: {
        backgroundColor: '#fff',
        fontFamily: "微软雅黑",
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
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
    },
    titleImg: {
        width: 15,
        height: 15,
        marginRight: 10,
    },
    title: {
        fontSize: 14,
        color: '#000',
    },
    list: {
        backgroundColor: '#fff',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 65,
        padding: 15,
        borderColor: '#eee',
        borderTopWidth: 1 / PixelRatio.get(),
    },
    left: {
        flex: 1,
    },
    leftTitle: {
        fontSize: 12,
        color: "#252525",
    },
    rightTitle: {
        fontSize: 14,
        color: '#000',
    },
    btnBox: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
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

})
