import { StyleSheet, } from 'react-native';
const style = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    headerText: {
        color: "#fff",
        fontSize: 16,
        textAlign: 'center',
        height: 40,
        lineHeight: 40,
    },
    linearGradientNav: {
        flex: 1,
        backgroundColor: "#f53f68",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTextNav: {
        color: "#fff",
        fontSize: 16,
        textAlign: 'center',
    },
    navRob: {
        maxWidth: 20,
        maxHeight: 20,
        resizeMode: "center",
    },
    navHome: {
        width: 80,
        height: 80,
        position: "relative",
        top: 3,
        resizeMode: "center",
    },
    //头部导航
    headerNav: {
        marginLeft: 15,
        marginRight: 15,
        height: 35,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    headerNavImg: {
        maxWidth: 20,
        maxHeight: 20,
        resizeMode: 'center',
    },
    headerNavTitle: {
        fontSize: 14,
        color: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerNavrightTitle: {
        fontSize: 12,
        color: "#fff",
    },
})
export default style
