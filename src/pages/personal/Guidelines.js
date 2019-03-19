import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from "react-native";
import { List, TextareaItem, } from "antd-mobile-rn";
import LinearGradient from "react-native-linear-gradient";
import styles from "../../styles/personal/Guidelines";
import gStyle from '../../styles/global';

export default class Guidelines extends Component {
    static navigationOptions = {
        headerTitle: <View style={gStyle.linearGradient}>
            <Text style={gStyle.headerText}>新手指引</Text></View>,
        headerStyle: {
            backgroundColor: '#f53f68',
            height: 45,
            elevation: 0,
            borderBottomColor: "#f53f68",
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerRight: (
            <Text> </Text>
        ),
    };
    constructor(props) {
        super(props);
        this.state = {
            content: "",
        }
    }


    render() {

        return (
            <ScrollView>
                <View style={styles.about}>
                    <Text style={styles.title}>关于犇沪商务</Text>
                    <View style={styles.content}>
                        <Text style={styles.detail}>  &nbsp;&nbsp;犇沪商务一直致力于打造中国卓越的信贷产品分发和服务平台。</Text>
                        <Text style={styles.detail}> 公司成立于2018年2月，秉承“让天下没有难贷的款”的愿景，秉持着做中国最大的金融连接服务平台的理念，坚持只做技术，支持金融机构做好金融，坚决不碰钱，坚持只做金融连接，只做金融服务，做金融的送水人，坚决自己不放贷，不做P2P，不做超高利润的信贷业务。</Text>
                        <Text style={styles.detail}>  我们要做贷款行业的红娘，要解决中国一直存在难以解决的信贷匹配难问题，特别是解决小微企业和个人贷款难的现状，让天下没有难贷的款。目前犇沪商务已经在上海开通信贷连接服务，数十家包含银行在内的信贷机构入驻犇沪商务平台。</Text>
                        <Text style={styles.detail}>   在服务方面，犇沪商务帮助借款人快速精准匹配的贷款服务者和信贷机构，同时帮助银行及金融机构获得优质信贷客户。</Text>
                        <Text style={styles.detail}>  在连接方面，犇沪商务本身不提供贷款，却为信贷双方建立有效快捷的连接。包括银行、信托、基金、证券、小贷、担保、典当行在内的，任何合法的金融信贷服务机构，均可与犇沪商务建立合作，实现在更大范围内的信贷分发和服务能力；任何一个专业的信贷经理和信贷员均可注册和入驻犇沪商务平台，获得客户服务机会和各种有效工具。</Text>
                        <Text style={styles.detail}>  目前，犇沪商务员工规模在100人左右，正在建立和完善产品、技术、渠道、运营和服务团队，目前团队核心管理层均分别供职于主流的金融科技公司以及各类金融服务机构，拥有丰富的金融行业专业服务经验以及灵活实干的互联网精神。</Text>
                        <Text style={styles.detail}>  犇沪商务期望，未来五年内能为数亿用户提供全新的贷款及全金融服务体验，打造一个万亿级的全金融服务平台，争取能为中国数亿小微企业和个人客户，提供超过数万亿的贷款匹配和连接服务，真正实现“让天下没有难贷的款”以及“让天下没有难做的金融”的梦想。</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

