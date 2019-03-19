import { StyleSheet } from "react-native";
import { windowHeight, windowWidth } from "../../utils/utils";
export default StyleSheet.create({
    invite: {
        backgroundColor: "#fff",
    },
    myCode: {
        height: 125,
        backgroundColor: "#f53f68",
    },
    code: {
        height: 125,
        lineHeight: 125,
        color: "#fff",
        fontSize: 30,
        textAlign: "center",
    },
    qRcode: {
        marginTop: 75,
        marginBottom: 20,
        width: 180,
        height: 180,
        marginLeft: (windowWidth - 180) / 2,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#f53f68",
        borderWidth: 2,
        borderRadius: 5,
    },
    rqCode: {
        width: 150,
        height: 150,
    },
    description: {
        textAlign: "center",
        fontSize: 20,
        color: "#000",
    },

})
