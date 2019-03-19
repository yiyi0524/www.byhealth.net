import React, { Component, Fragment } from 'react';
import {
  View, StyleSheet, Text, Image, ScrollView, TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Tabs, Picker } from "antd-mobile-rn";
import Icons from "react-native-vector-icons/Entypo";
import { Toast } from "antd-mobile-rn";
import { createStackNavigator, } from "react-navigation";
import pathMap from '../../routes/pathMap';
import gColor from '../../styles/color';
import gStyle from '../../styles/global';
import styles from '../../styles/rob/MyCustomerDetail';
import { windowWidth, windowHeight } from '../../utils/utils';
import { juiceApi } from "../../utils/api";


export default class Page extends Component {
  static navigationOptions = {
    headerTitle: <View style={gStyle.linearGradient}>
      <Text style={gStyle.headerText}>客户详情</Text></View>,
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
      customerDetail: {},
      customer: {
        base: [],
        required: [],
        assets: [],
      },
      refreshing: false,
    }
  }
  componentDidMount() {
    this.init();
  }
  init = async _ => {
    Toast.loading("加载中", 1, _ => { }, true)
    const { navigation } = this.props;
    let goodsId = parseInt(navigation.getParam('goodsId'));
    let json = await this.getPageData(goodsId);
    let customerDetail = json.data,
      customer = {
        base: [],
        required: [],
        assets: [],
      };
    customer.base.push({
      title: '姓名',
      value: customerDetail.custom_name,
    })
    let loanMoney = customerDetail.loan_money >= 10000 ? parseInt(customerDetail.loan_money / 10000) + "万元" : customerDetail.loan_money + "元";
    customer.base.push({
      title: '贷款金额',
      value: loanMoney,
    })
    customer.base.push({
      title: '贷款期限',
      value: customerDetail.loan_time_limit ? customerDetail.loan_time_limit : "0" + "个月",
    })
    let age = '未知';
    if (typeof customerDetail.age === 'number') {
      age = customerDetail.age + "岁"
    }
    customer.base.push({
      title: '年龄',
      value: age,
    })
    customer.base.push({
      title: '性别',
      value: customerDetail.gender === 0 ? "未知" : customerDetail.gender === 1 ? "男" : "女",
    })
    customer.base.push({
      title: '民族',
      value: customerDetail.nation || "未知",
    })
    let birthday = '未知';
    if (customerDetail.birth_date) {
      birthday = customerDetail.birth_date.substr(0, 10);
    }
    customer.base.push({
      title: '出生日期',
      value: birthday,
    })
    //学历
    let education = '未知'
    switch (customerDetail.degree_education) {
      case 1:
        education = '硕士及以上';
        break;
      case 2:
        education = '本科';
        break;
      case 3:
        education = '大专';
        break;
      case 4:
        education = '高中及以下';
        break;
    }
    customer.base.push({
      title: '教育程度',
      value: education,
    })
    let occupation = '未知'
    switch (customerDetail.occupation) {
      case 1:
        occupation = '工人';
        break;
      case 2:
        occupation = '公务员';
        break;
      case 3:
        occupation = '事业单位职员';
        break;
      case 4:
        occupation = '公司职员';
        break;
      case 5:
        occupation = '公司高管';
        break;
      case 6:
        occupation = '个体户';
        break;
      case 7:
        occupation = '自由职业';
        break;
      case 8:
        occupation = '企业法人';
        break;
    }
    customer.base.push({
      title: '职业',
      value: occupation,
    })
    customer.base.push({
      title: '身份证',
      value: customerDetail.id_card_number,
    })
    customer.base.push({
      title: '手机号码',
      value: customerDetail.custom_phone,
    })
    customer.base.push({
      title: 'email',
      value: customerDetail.email,
    })
    customer.base.push({
      title: 'QQ',
      value: customerDetail.qq,
    })
    let currAddress = '';
    if (customerDetail.current_address) {
      currAddress = customerDetail.current_address.whole || '';
      if (currAddress) {
        currAddress = currAddress.substr(0, 7) + "**********"
      }
    }
    customer.base.push({
      title: '现居住地址',
      value: currAddress,
    })
    let permanentAddress = '';
    if (customerDetail.permanent_address) {
      permanentAddress = customerDetail.permanent_address.whole || '';
      if (permanentAddress) {
        permanentAddress = permanentAddress.substr(0, 7) + "**********"
      }
    }
    customer.base.push({
      title: '户籍地址',
      value: permanentAddress,
    })
    customer.base.push({
      title: '现居住城市时长',
      value: parseInt(customerDetail.current_address_live_time) || 0 + "个月",
    })
    //婚姻
    let marital = '未知'
    switch (customerDetail.marital_status) {
      case 1:
        marital = '结婚';
        break;
      case 2:
        marital = '离异';
        break;
      case 3:
        marital = '未婚';
        break;
    }
    customer.base.push({
      title: '婚姻状况',
      value: marital,
    })
    let compantName = '未知';
    if (customerDetail.current_company) {
      compantName = customerDetail.current_company.name;
      if (compantName) {
        compantName = compantName.substr(0, 5) + "**********"
      }
    }
    customer.base.push({
      title: '公司名称',
      value: compantName,
    })
    let companyAddress = '';
    if (customerDetail.current_company && customerDetail.current_company.address) {
      companyAddress = customerDetail.current_company.address.whole || '';
      if (companyAddress) {
        companyAddress = companyAddress.substr(0, 6) + "**********"
      }
    }
    customer.base.push({
      title: '公司地址',
      value: companyAddress,
    })
    let companyPhone = '';
    if (customerDetail.current_company && customerDetail.current_company.phone) {
      companyPhone = customerDetail.current_company.phone.whole || '未知';
      if (companyPhone) {
        companyPhone = companyPhone.substr(0, 3) + "******"
      }
    }
    customer.base.push({
      title: '公司电话',
      value: companyPhone,
    })
    let entryTime = '未知';
    if (customerDetail.current_company && customerDetail.current_company.entry_time) {
      entryTime = customerDetail.current_company.entry_time.substr(0, 10);
    }
    customer.base.push({
      title: '入职时间',
      value: entryTime,
    })

    customer.required.push({
      title: '贷款用途',
      value: customerDetail.loan_purpose,
    })
    let source = "未知";
    switch (customerDetail.source) {
      case 1:
        source = "网站";
        break;
      case 2:
        source = "百度推广";
        break;
      case 3:
        source = "微信公众号";
        break;
      case 4:
        source = "老客户介绍";
        break;
      case 5:
        source = "销售人员介绍";
        break;
    }
    customer.required.push({
      title: '来源',
      value: source,
    })
    customer.required.push({
      title: '期望贷款金额',
      value: loanMoney,
    })
    customer.required.push({
      title: '期望贷款期限',
      value: parseInt(customerDetail.loan_time_limit) || 0 + "个月",
    })
    let house = '未知'
    switch (customerDetail.house_status) {
      case 1:
        house = '有房无贷';
        break;
      case 2:
        house = '有房有贷';
        break;
      case 3:
        house = '无房无贷';
        break;
      case 4:
        house = '租房';
        break;
    }
    customer.assets.push({
      title: '房产状况',
      value: house,
    })
    //车产
    let car = '未知'
    switch (customerDetail.car_status) {
      case 1:
        car = '有车无贷';
        break;
      case 2:
        car = '有车有贷';
        break;
      case 3:
        car = '无车无贷';
        break;
    }
    customer.assets.push({
      title: '车产状况',
      value: car,
    })
    let main_source_of_income = '未知'
    switch (customerDetail.car_status) {
      case 1:
        main_source_of_income = '工资收入';
        break;
      case 2:
        main_source_of_income = '投资收入';
        break;
      case 3:
        main_source_of_income = '房屋租金';
        break;
      case 4:
        main_source_of_income = '家庭提供';
        break;
    }
    customer.assets.push({
      title: '主要收入来源',
      value: main_source_of_income,
    })
    customer.assets.push({
      title: '信用卡额度',
      value: parseInt(customerDetail.credit_card_limit) || 0 + "元",
    })
    customer.assets.push({
      title: '月工资',
      value: parseInt(customerDetail.wages_of_month) || 0 + "元",
    })
    customer.assets.push({
      title: '每月其他收入',
      value: parseInt(customerDetail.other_income_of_month) || 0 + "元",
    })
    //社保
    let provident_fund = '未知'
    if (customerDetail.accumulation_fund) {
      switch (customerDetail.accumulation_fund.status) {
        case "1":
          provident_fund = '3个月以上';
          break;
        case "2":
          provident_fund = '6个月以上';
          break;
        case "3":
          provident_fund = '1年以上';
          break;
      }
    }
    customer.assets.push({
      title: '社保缴纳情况',
      value: provident_fund,
    })
    let social_security = '未知'
    if (customerDetail.social_security) {
      switch (customerDetail.social_security.status) {
        case "1":
          social_security = '3个月以上';
          break;
        case "2":
          social_security = '6个月以上';
          break;
        case "3":
          social_security = '1年以上';
          break;
      }
    }
    customer.assets.push({
      title: '公积金缴纳情况',
      value: social_security,
    })

    //芝麻信用分
    customer.assets.push({
      title: '芝麻信用分',
      value: customerDetail.sesame_credit || "0",
    })
    //发薪形式salary_form
    let salaryForm = "未知";
    if (customerDetail.salary_form) {
      switch (customerDetail.salary_form) {
        case 1:
          salaryForm = '打卡';
          break;
        case 2:
          salaryForm = '现金';
          break;
      }
    }
    customer.assets.push({
      title: '发薪形式',
      value: salaryForm,
    })
    //有无商业保险
    customer.assets.push({
      title: '有无商业保险',
      value: customerDetail.commercial_insurance === 0 ? "未知" : customerDetail.commercial_insurance === 1 ? "有" : "无",
    })
    //有无微粒贷
    customer.assets.push({
      title: '有无微粒贷',
      value: customerDetail.particulate_loan === 0 ? "未知" : customerDetail.particulate_loan === 1 ? "有" : "无",
    })
    //淘宝是否四星以上
    customer.assets.push({
      title: '淘宝是否四星以上',
      value: customerDetail.star_class === 0 ? "未知" : customerDetail.star_class === 1 ? "是" : "否",
    })
    //车产是否接受抵押
    customer.assets.push({
      title: '车产是否接受抵押',
      value: customerDetail.car_mortgage === 0 ? "未知" : customerDetail.car_mortgage === 1 ? "是" : "否",
    })
    //房产是否接受抵押
    customer.assets.push({
      title: '房产是否接受抵押',
      value: customerDetail.house_mortgage === 0 ? "未知" : customerDetail.house_mortgage === 1 ? "是" : "否",
    })


    this.setState({
      hasLoad: true,
      customerDetail,
      customer,
    })
    Toast.hide()
  }
  getPageData = async goodsId => {
    return juiceApi.getMyCustomerDetail(goodsId);
  }
  onRefresh = () => {
    this.setState({ refreshing: true });
    Promise.all([
      this.init(),
      new Promise(s => setTimeout(s, 500)),
    ]).then(_ => {
      this.setState({ refreshing: false });
    }).catch(err => {
      Toast.fail("刷新失败,错误信息: " + err.msg);
    });
  }
  render() {
    if (!this.state.hasLoad) {
      return <View style={{
        width: windowWidth,
        height: windowHeight,
        backgroundColor: 'white',
      }}></View>
    }
    const tabs = [
      { title: '基本信息' },
      { title: '贷款需求信息' },
      { title: '资产信息' },
    ];
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        <View style={styles.headerList}>
          <Tabs tabs={tabs} initialPage={0}
            tabBarPosition="top"
            tabBarActiveTextColor="#f53f68"
            tabBarUnderlineStyle={{
              backgroundColor: "#f53f68",
              marginLeft: 0,
            }}
          >
            {/* 基本信息 */}
            <View style={styles.list}>
              {this.state.customer.base.map((v, k) => {
                return (<View style={styles.item} key={k}>
                  <Text style={styles.title}>{v.title}</Text>
                  <Text style={styles.detail}>{v.value}</Text>
                </View>);
              })}
            </View>
            {/* 身份信息 */}
            <View style={styles.list}>
              {this.state.customer.required.map((v, k) => {
                return (<View style={styles.item} key={k}>
                  <Text style={styles.title}>{v.title}</Text>
                  <Text style={styles.detail}>{v.value}</Text>
                </View>);
              })}
            </View>
            {/* 资产工作 */}
            <View style={styles.list}>
              {this.state.customer.assets.map((v, k) => {
                return (<View style={styles.item} key={k}>
                  <Text style={styles.title}>{v.title}</Text>
                  <Text style={styles.detail}>{v.value}</Text>
                </View>);
              })}
            </View>
          </Tabs>
        </View>
      </ScrollView>
    );
  }
}


