import { StyleSheet } from "react-native";
import { windowWidth, windowHeight } from "../../utils/utils";

export default StyleSheet.create({
    main: {
        backgroundColor: "#f5f5f5",
    },
    headerList: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
        flexWrap: "wrap",
        backgroundColor: "#fff",
        height: windowWidth / 750 * 450,
    },
    headerItem: {
        width: (windowWidth - 40) / 4,
        height: windowWidth / 750 * 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerItemImg: {
        maxHeight: 60,
        maxWidth: 60,
        resizeMode: "center",
    },
    headerItemTitle: {
        fontSize: 14,
        color: "#252525",
    },
    title: {
        height: 45,
        justifyContent: "flex-start",
        alignItems: 'center',
        flexDirection: "row",
    },
    titleIcon: {
        paddingLeft: 15,
        height: 8,
        backgroundColor: "#f53f68",
    },
    theme: {
        fontSize: 14,
        color: "#000",
        marginLeft: 5,
    },
    list: {
        marginLeft: 15,
        marginRight: 15,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap",
    },
    content: {},
    item: {
        width: (windowWidth - 30) / 3,
        height: windowWidth / 750 * 300,
        marginBottom: 15,
    },
    itemImg: {
        maxWidth: (windowWidth - 60) / 3,
        maxHeight: windowWidth / 750 * 300,
    },
    itemDownNum: {
        position: "absolute",
        top: 0,
        left: 10,
        paddingLeft: 2,
        paddingRight: 2,
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "#fff",
        fontSize: 14,
        borderRadius: 3,
    },
})
