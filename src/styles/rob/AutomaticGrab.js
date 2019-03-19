import { StyleSheet } from "react-native";
import { PixelRatio } from "react-native";

export default StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: "column",
    },
    verified: {
        backgroundColor: "#f5f5f5",
    },
    list: {

    },
    item: {
        borderBottomColor: "rgba(0,0,0,0.15)",
        borderBottomWidth: 1 / PixelRatio.get(),
        paddingLeft: 15,
        paddingRight: 15,
        height: 50,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 14,
        color: "#252525",
    },
    hidden: {
        display: "none",
    },
    reject: {
        margin: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderStyle: "dashed",
        padding: 15,
        borderRadius: 5,
    },
    input: {
        flex: 1,
        textAlign: "right",
    },
    photoItem: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    photoTitle: {
        height: 50,
        lineHeight: 50,
        fontSize: 14,
        color: "#252525",
    },
    btnBox: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        flex: 0.1,
    },
    btn: {
        textAlign: "center",
        lineHeight: 45,
        height: 50,
        color: "#fff",
        fontSize: 14,
    },
    result: {
        paddingLeft: 15,
        paddingRight: 15,
        height: 50,
        textAlign: "center",
        lineHeight: 45,
        marginTop: 15,
    },
})
