import { StyleSheet, PixelRatio } from "react-native";

export default StyleSheet.create({
    about: {
        backgroundColor: "#fff",
    },
    title: {
        height: 50,
        borderBottomColor: "#eee",
        borderBottomWidth: 1 / PixelRatio.get(),
        lineHeight: 50,
        textAlign: "center",
        marginLeft: 20,
        marginRight: 20,
        fontSize: 18,
        color: "#000"
    },
    content: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
    },
    detail: {
        lineHeight: 25,
        fontSize: 14,
        color: "#252525",
        marginBottom: 10,
    },
    detailTitle: {
        fontSize: 14,
        color: "#000",
        fontWeight: '600',
    },
})
