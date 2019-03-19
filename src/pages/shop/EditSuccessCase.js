import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import pathMap from "../../routes/pathMap"
import styles from "../../styles/shop/EditSuccessCase";
import gStyle from "../../styles/global";
import LinearGradient from "react-native-linear-gradient";
import { Toast, TextareaItem } from "antd-mobile-rn";
import Icons from "react-native-vector-icons/Entypo";
import { juiceApi } from '../../utils/api';

export default class AddSuccessCase extends Component {
    static navigationOptions = {
        headerTitle: <View style={gStyle.linearGradient}>
            <Text style={gStyle.headerText}>修改成功案例</Text></View>,
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
            name: "",
            loan_money: "",
            loan_time: "",
            circumstances: "",
            material: "",

        }
    }
    componentDidMount() {
        this.init();
    }
    init = async _ => {
        const { navigation } = this.props;
        let successCaseId = parseInt(navigation.getParam('successCaseId'));
        Toast.loading("加载中", 1, _ => { }, true)
        let json = await this.getPageData(successCaseId);
        this.setState({
            id: json.data.id,
            hasLoad: true,
            name: json.data.name,
            loan_money: json.data.loan_amount,
            loan_time: json.data.lending_time.toString(),
            circumstances: json.data.situation_description,
            material: json.data.material_description,
        })
        Toast.hide()
    }
    getPageData = async (successCaseId) => {
        return juiceApi.successCaseDetail(successCaseId);
    }
    sendData = () => {
        const { navigation } = this.props;
        let data = {
            id: this.state.id,
            name: this.state.name,
            loan_money: this.state.loan_money,
            loan_time: parseInt(this.state.loan_time),
            circumstances: this.state.circumstances,
            material: this.state.material,
        };
        console.log(data);
        return juiceApi.successCaseEdit(data).then(_ => {
            Toast.success("修改成功", 1);
            setTimeout(function () {
                navigation.navigate(pathMap.SuccessCase);
            }, 500)
        }).catch(err => {
            Toast.success("修改失败,失败的原因:" + err.msg, 1);
            console.log(err);
        });
    }
    render() {
        return (
            <View style={{ flexDirection: "row", flex: 1, }}>
                <ScrollView style={styles.mian}>
                    <View style={styles.item}>
                        <Text style={styles.title}>客户称呼: </Text>
                        <TextInput
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name}
                            style={styles.input}
                            placeholder="请填写"
                            numberOfLines={1}
                        ></TextInput>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>贷款金额(万元): </Text>
                        <TextInput
                            keyboardType="number-pad"
                            onChangeText={(loan_money) => this.setState({ loan_money })}
                            value={this.state.loan_money}
                            style={styles.input}
                            placeholder="请填写"
                            numberOfLines={1}
                        ></TextInput>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>放款时间(天): </Text>
                        <TextInput
                            keyboardType="number-pad"
                            onChangeText={(loan_time) => this.setState({ loan_time })}
                            value={this.state.loan_time}
                            style={styles.input}
                            placeholder="请填写"
                            numberOfLines={1}
                        ></TextInput>
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusTitle}>客户情况描述:  </Text>
                        <TextareaItem style={styles.statusInput} rows={4}
                            value={this.state.circumstances} placeholder="请输入"
                            count={50}
                            onChange={circumstances => {
                                this.setState({
                                    circumstances,
                                })
                            }}
                        />
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusTitle}>客户材料描述: </Text>
                        <TextareaItem style={styles.statusInput} rows={4}
                            onChange={material => {
                                this.setState({
                                    material,
                                })
                            }}
                            placeholder="请输入" value={this.state.material} count={50} />
                    </View>
                    <View style={{ height: 50, }}></View>
                </ScrollView>
                <LinearGradient
                    colors={["#f53f68", "#e92b32"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.btnBox}
                >
                    <TouchableOpacity
                        onPress={() => this.sendData()}
                    >
                        <Text style={styles.btn}>确认提交</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        );
    }
}
