import { StyleSheet, PixelRatio } from "react-native";

export default StyleSheet.create({
    client: {
        backgroundColor: "#f5f5f5",
    },
    search: {
        height: 60,
        backgroundColor: "#f53f68",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
        paddingLeft: 10,
        paddingRight: 10,
    },
    searchBox: {
        flex: 1,
    },
    searchImg: {
        maxWidth: 20,
        maxHeight: 20,
        resizeMode: 'center',
        position: "absolute",
        zIndex: 10,
        left: 80,
    },
    searchInput: {
        borderRadius: 5,
        height: 30,
        textAlign: 'center',
        fontSize: 14,
        color: "#bfbfbf",
        margin: 0,
        paddingLeft: 80,
    },
    filterList: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: "center",
        backgroundColor: "#f53f68",
        marginBottom: 12,
    },
    filterItem: {
        width: 60,
        height: 45,
        marginLeft: 7.5,
        marginRight: 7.5,
    },
    filterItemActive: {
        borderBottomWidth: 3,
        borderBottomColor: "#fff",
    },
    filterItemTitle: {
        fontSize: 13,
        color: "#fff",
        textAlign: "center",
        height: 45,
        lineHeight: 45,
    },
    list: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
    },
    item: {
        backgroundColor: "#fff",
        marginBottom: 12,
        borderRadius: 5,
    },
    top: {
        height: 40,
        marginLeft: 10,
        marginRight: 10,
        borderBottomColor: "#dedede",
        borderBottomWidth: 1 / PixelRatio.get(),
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topTitle: {
        fontSize: 14,
        color: "#939393",
    },
    topGolds: {
        fontSize: 12,
        color: "#f53f68",
        paddingLeft: 20,
    },
    topMore: {
        fontSize: 16,
        color: "#6b6b6b",
    },
    center: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 15,
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    centerBox: {

    },
    centerName: {
        fontSize: 16,
        color: "#000",
    },
    centerTime: {
        fontSize: 14,
        color: "#939393",
        marginTop: 5,
    },
    centerIcons: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    conterIcon: {
        paddingLeft: 15,
    },
    centerImg: {
        maxWidth: 25,
        maxHeight: 25,
        resizeMode: "contain",
    },
    notOrder: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 14,
        color: "#252525",
    },

})
