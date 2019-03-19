import { StyleSheet, PixelRatio } from "react-native";

export default StyleSheet.create({
    banner: {
        height: 130,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: "#f5f5f5",
    },
    bannerImg: {
        maxWidth: 75,
        maxHeight: 77,
        resizeMode: "contain",
    },
    bannerTitle: {
        fontSize: 14,
        color: "#808080",
    },
    list: {
        marginLeft: 10,
        marginRight: 10,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: "#f5f5f5",
    },
    itemBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    itemImg: {
        maxWidth: 20,
        maxHeight: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 14,
        color: "#252525",
        marginLeft: 10,
    },
    btn: {
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    btnTitle: {
        fontSize: 16,
        color: "#fff",
        height: 50,
        lineHeight: 50,
        textAlign: 'center',
    },
})
