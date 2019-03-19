import { StyleSheet, PixelRatio } from "react-native";

export default StyleSheet.create({
    myAppeal: {
        backgroundColor: "#f5f5f5",
    },
    list: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
    },
    item: {
        backgroundColor: "#fff",
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 15,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: "#eee",
    },
    headerName: {
        fontSize: 18,
        color: "#000",
    },
    headerPhone: {
        fontSize: 14,
        color: "#8b8b8b",
        marginLeft: 20,
    },
    headerTime: {
        fontSize: 14,
        color: "#8b8b8b",
    },
    content: {
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    contentTitle: {
        fontSize: 14,
        color: "#000",
        width: 90,
    },
    contentApproval: {
        fontSize: 14,
        color: "#000",
        flex: 1,
        marginLeft: 10,
    },
    contentMoney: {
        fontSize: 14,
        color: "#f53f68",
    },

})
