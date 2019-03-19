import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    member: {
        backgroundColor: '#fff',
    },
    top: {
        height: 160,
        backgroundColor: '#f53f68',
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    topImgBox: {
        width: 60,
        height: 60,
        // backgroundColor: "#fff",
        borderRadius: 100,
        overflow: "hidden",
        justifyContent: 'center',
        alignItems: "center",
    },
    topImg: {
        width: 60,
        height: 60,
    },
    topTitle: {
        fontSize: 20,
        color: '#fff',
        marginTop: 5,
        marginBottom: 5,
    },
    topTime: {
        fontSize: 14,
        color: "#fff",
    },
    btns: {
        height: 110,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 20,
    },
    btn: {
        width: 150,
        height: 35,
        borderRadius: 5,
    },
    btnTitle: {
        color: "#fff",
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 35,
    },
    rightsAndInterests: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    rightsAndInterestsImg: {
        width: 15,
        height: 16,
        resizeMode: 'center',
    },
    theme: {
        fontSize: 14,
        color: '#000',
    },
    list: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: 'center',
        marginTop: 20,
        height: 100,
    },
    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    listImg: {
        maxWidth: 45,
        maxHeight: 45,
        resizeMode: 'center',
        marginBottom: 10,
    },
    listTitle: {
        fontSize: 14,
        color: '#000',
    },
    hidden: {
        display: "none",
    },

})
