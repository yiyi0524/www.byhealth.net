import { StyleSheet, PixelRatio } from "react-native";

export default StyleSheet.create({
    headerList: {

    },
    list: {
        backgroundColor: "#fff",
        marginLeft: 10,
        marginRight: 10,
    },
    item: {
        borderBottomColor: "#f5f5f5",
        borderBottomWidth: 1 / PixelRatio.get(),
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 14,
        color: "#9c9c9c",
    },
    detail: {
        fontSize: 14,
        color: "#252525",
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    icons: {
        width: 20,
    },
    hidden: {
        display: 'none',
    },
    picker: {
        width: 130,
    },
})
