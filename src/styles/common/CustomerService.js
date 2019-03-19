import { StyleSheet, PixelRatio } from "react-native";
import { windowHeight, windowWidth } from "../../utils/utils";

export default StyleSheet.create({
    customerService: {
        backgroundColor: "#f5f5f5",
    },
    banner: {
        height: 170,
        flex: 1,
    },
    bannerImg: {
        width: windowWidth,
        height: 170,
    },
    list: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        minHeight: windowHeight - 300,
    },
    item: {
        backgroundColor: "#fff",
        borderRadius: 5,
        height: 65,
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 15,
    },
    avatarBox: {
        width: 50,
        height: 50,
        borderRadius: 100,
        overflow: "hidden",
        marginRight: 15,
        // borderColor: "#000",
        // borderWidth: 1
    },
    avatarImg: {
        maxWidth: 50,
        maxHeight: 50,
        position: "absolute",
        top: 0,
        left: 0,
    },
    itemBox: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        color: "#f53f68",
    },
    time: {
        fontSize: 14,
        color: "#000",
        marginTop: 2,
    },
    btnBox: {
        marginLeft: 15,
        marginRight: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        flex: 0.1,
    },
    btn: {
        width: (windowWidth - 45) / 2,
        height: 45,
        lineHeight: 45,
        textAlign: "center",
        fontSize: 14,
        color: "#fff",

    },


})
