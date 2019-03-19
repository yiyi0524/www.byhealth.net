import { StyleSheet, PixelRatio } from "react-native";

export default StyleSheet.create({
    appeal: {
        backgroundColor: "#f5f5f5",
    },
    header: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    headerTitle: {
        height: 50,
        lineHeight: 50,
        fontSize: 14,
        color: "#8b8b8b",
        borderBottomColor: "#eee",
        borderBottomWidth: 1 / PixelRatio.get(),
        paddingLeft: 15,
        paddingRight: 15,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
    },
    headerContentName: {
        fontSize: 14,
        color: "#000",
    },
    headerContentPhone: {
        fontSize: 14,
        color: "#8b8b8b",
    },
    headerContentMoney: {
        fontSize: 14,
        color: "#000",
    },
    content: {
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    list: {
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
    },
    item: {
        flexDirection: "row",
        height: 50,
        alignItems: "center",
    },
    itemTextareaDescription: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    itemTextarea: {
        flexDirection: "row",
    },
    itemTitle: {
        fontSize: 14,
        color: "#252525",
        marginRight: 10,
    },
    appealDetail: {
        flex: 1,
    },
    finish: {
        color: "#fff",
        fontSize: 12,
        marginRight: 20,
    },
})
