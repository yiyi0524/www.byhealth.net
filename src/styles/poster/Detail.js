import { StyleSheet } from "react-native";
import { windowWidth, windowHeight } from "../../utils/utils";
import sColor from "../../utils/color";

export default StyleSheet.create({
    main: {
        backgroundColor: "#f5f5f5",
    },
    poster: {
        margin: 15,
        flex: 1,
        alignItems: "center",
    },
    posterImg: {
        width: windowWidth - 50,
        height: 500,
    },
    download: {
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        width: windowWidth - 30,
        backgroundColor: sColor.RED,
        marginTop: 30,
        borderRadius: 5,
    },
    downLoadImg: {
        fontSize: 14,
        color: sColor.WHITE,
        height: 45,
        lineHeight: 45,
    },

})
