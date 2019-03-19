import React, { Component } from 'react';
import { Toast, Modal, } from 'antd-mobile-rn';
import {
  View, Text, StyleSheet, DeviceEventEmitter, Image, Linking, TouchableOpacity,
  ScrollView, Alert, RefreshControl,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { windowWidth, windowHeight } from '../../utils/utils';
import styles from "../../styles/rob/Detail";
import pathMap from "../../routes/pathMap";
import api, { isCheckMode } from "../../utils/api";


export default class Detail extends Component {
  static navigationOptions = {
    title: '抢单详情',
    headerStyle: {
      backgroundColor: '#f53f68',
      height: 45,
      elevation: 0,
      borderBottomColor: "#f53f68",
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      textAlign: 'center',
    },
    headerRight: (
      <Text> </Text>
    ),
  }
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      customerDetail: {},
      customer: {
        base: [],
        required: [],
        assets: [],
      },
      userBalance: 0,
      refreshing: false,
      isCheckMode: true,
    }
  }
  init = async _ => {
    let that = this;
    const { navigation } = this.props;
    console.log(this.props)
    api.isLogin().then(isLogin => {
      this.setState({
        isLogin,
      })
      if (isLogin) {
        api.request('/user/balance').then(json => {
          this.setState({
            userBalance: json.data.balance,
          })
        }).catch(err => {
          console.log(err)
        })
      }
    })
    let goodsId = parseInt(navigation.getParam('id'));
    that.getPageData(goodsId).then(json => {
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
        value: customerDetail.loan_time_limit + "个月",
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
        value: customerDetail.loan_time_limit + "个月",
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


      that.setState({
        hasLoad: true,
        customerDetail,
        customer,
      })
      console.log(this.state.customerDetail);
      Toast.hide()
    });
  }
  async componentDidMount() {
    this.setState({
      isCheckMode: await isCheckMode(),
    })
    Toast.loading("加载中", 0, null, true);
    this.init();
    Toast.hide();
  }
  getPageData = async goodsId => {
    return api.request('/goods/detail', {
      id: goodsId,
    })
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
        width: 3000,
        height: 1000,
        backgroundColor: 'white',
      }}></View>
    }
    let apply_type = "免费";
    switch (this.state.customerDetail.apply_type) {
      case 'common':
        apply_type = "普通";
        break;
      case 'localCustom':
        apply_type = "优质";
        break;
      default:
        apply_type = "免费";
    }
    return (
      <ScrollView style={styles.grobDetail}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        {this.state.isCheckMode ? <View style={styles.banner}>
          <Text style={styles.classification}>{apply_type}</Text>
          <Text style={styles.bannerName}>{this.state.customerDetail.custom_name}</Text>
          <View style={styles.bannerList}>
            <Text style={styles.bannerItem}>{this.state.customerDetail.current_address ?
              this.state.customerDetail.current_address.whole.substr(0, 7) + "**********" : "未知地址"}</Text>
            <Text style={styles.bannerItem}>{apply_type}</Text>
            <Text style={styles.bannerItem}>其他</Text>
          </View>
          <View style={styles.loan}>
            <View style={styles.left}>
              <Text style={styles.loanMoney}>{this.state.customerDetail.loan_money >= 10000 ? parseInt(this.state.customerDetail.loan_money / 10000) + "万" :
                this.state.customerDetail.loan_money + "元"}</Text>
              <Text style={styles.loanDetail}>订单金额</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.loanTime}>{this.state.customerDetail.loan_time_limit}个月</Text>
              <Text style={styles.loanDetail}>订单期限</Text>
            </View>
          </View>
        </View> :
          <View style={styles.banner}>
            <Text style={styles.classification}>{apply_type}</Text>
            <Text style={styles.bannerName}>{this.state.customerDetail.custom_name}</Text>
            <View style={styles.bannerList}>
              <Text style={styles.bannerItem}>{this.state.customerDetail.current_address ?
                this.state.customerDetail.current_address.whole.substr(0, 7) + "**********" : "未知地址"}</Text>
              <Text style={styles.bannerItem}>{apply_type}</Text>
              <Text style={styles.bannerItem}>其他</Text>
            </View>
            <View style={styles.loan}>
              <View style={styles.left}>
                <Text style={styles.loanMoney}>{this.state.customerDetail.loan_money >= 10000 ? parseInt(this.state.customerDetail.loan_money / 10000) + "万" :
                  this.state.customerDetail.loan_money + "元"}</Text>
                <Text style={styles.loanDetail}>借款金额</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.loanTime}>{this.state.customerDetail.loan_time_limit}个月</Text>
                <Text style={styles.loanDetail}>贷款期限</Text>
              </View>
            </View>
          </View>
        }
        {this.state.isCheckMode ?
          <View style={styles.phone}>
            <View style={styles.phoneNum}>
              <Text style={styles.phoneNumber}>{this.state.customerDetail.custom_phone}</Text>
              <Text style={styles.phoneDetail}>( 请联系 )</Text>
            </View>
            <Image style={styles.phoneImg} source={require("../../images/grob/phone.png")}></Image>
          </View> :
          <View style={styles.phone}>
            <View style={styles.phoneNum}>
              <Text style={styles.phoneNumber}>{this.state.customerDetail.custom_phone}</Text>
              <Text style={styles.phoneDetail}>( 抢单后可联系 )</Text>
            </View>
            <Image style={styles.phoneImg} source={require("../../images/grob/phone.png")}></Image>
          </View>}

        <View style={this.state.isCheckMode ? styles.hidden : styles.basic}>
          <View style={styles.basicTitle}>
            <Image style={styles.basicImg} source={require("../../images/grob/basic_information.png")}></Image>
            <Text style={styles.basicTheme}>基本信息</Text>
          </View>
          <View style={styles.basicList}>
            {this.state.customer.base.map((v, k) => {
              return (<View style={styles.basicItem} key={k}>
                <Text style={styles.basicItemTitle}>{v.title}</Text>
                <Text style={styles.basicItemDetail}>{v.value}</Text>
              </View>);
            })}
          </View>
        </View>
        <View style={this.state.isCheckMode ? styles.hidden : styles.basic}>
          <View style={styles.basicTitle}>
            <Image style={styles.basicImg} source={require("../../images/grob/identity_information.png")}></Image>
            <Text style={styles.basicTheme}>贷款需求信息</Text>
          </View>
          <View style={styles.basicList}>
            {this.state.customer.required.map((v, k) => {
              return (<View style={styles.basicItem} key={k}>
                <Text style={styles.basicItemTitle}>{v.title}</Text>
                <Text style={styles.basicItemDetail}>{v.value}</Text>
              </View>);
            })}
          </View>
        </View>
        <View style={this.state.isCheckMode ? styles.hidden : styles.basic}>
          <View style={styles.basicTitle}>
            <Image style={styles.basicImg} source={require("../../images/grob/identity_information1.png")}></Image>
            <Text style={styles.basicTheme}>资产信息</Text>
          </View>
          <View style={styles.basicList}>
            {this.state.customer.assets.map((v, k) => {
              return (<View style={styles.basicItem} key={k}>
                <Text style={styles.basicItemTitle}>{v.title}</Text>
                <Text style={styles.basicItemDetail}>{v.value}</Text>
              </View>);
            })}
          </View>
        </View>
        <TouchableOpacity style={this.state.isCheckMode ? styles.hidden : styles.btn} onPress={this.buy}>
          <LinearGradient
            colors={["#fe7e29", "#ff1f1f"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btn}
          >
            <Text style={styles.btnTitle}>{this.state.customerDetail.price}金币抢单</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView >
    );
  }
  buy = _ => {
    const { navigation } = this.props;
    if (!this.state.isLogin) {
      return Toast.fail('请先登录', 1);
    }
    if (this.state.userBalance < this.state.customerDetail.price) {
      Modal.alert('提示', '余额不足,是否立即充值1', [
        {
          text: '取消',
        },
        {
          text: '立即充值',
          onPress: _ => {
            //跳转到充值页
            navigation.push(pathMap.GoldRecharge);
          },
        },
      ]);
    } else {
      let goodsId = parseInt(navigation.getParam('id'));
      Modal.alert('提示', '你正在购买' + this.state.customerDetail.custom_name +
        '的信息,价格为' + this.state.customerDetail.price + '金币,当前余额' +
        (this.state.userBalance) + '金币,是否购买?', [
          {
            text: '取消',
          },
          {
            text: '购买',
            onPress: _ => {
              api.buyGoods(goodsId).then(_ => {
                Toast.info('购买成功', 1, _ => {
                  DeviceEventEmitter.emit(pathMap.Rob + "Reload");
                  navigation.goBack()
                }, true);
                // Modal.alert('提示', '购买成功,是否立即查看客户详情?', [
                //   {
                //     text: '取消',
                //   },
                //   {
                //     text: '确定',
                //     onPress: _ => {
                //       //跳转到充值页
                //       navigation.push(pathMap.MyCustomerDetail, {
                //         goodsId,
                //       });
                //     },
                //   },
                // ]);
              }).catch(err => {
                Toast.info('购买失败,错误信息: ' + err.msg, 1, null, true);
                // Modal.alert('提示', '购买失败,错误信息: ' + err.msg, [
                //   {
                //     text: '确定',
                //     onPress: _ => {
                //     },
                //   },
                // ]);
              })
            },
          },
        ]);
    }

  }
}
