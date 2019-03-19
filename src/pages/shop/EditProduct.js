import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import pathMap from "../../routes/pathMap"
import styles from "../../styles/shop/AddProduct";
import gStyle from "../../styles/global";
import LinearGradient from "react-native-linear-gradient";
import { Toast, Picker } from "antd-mobile-rn";
import Icons from "react-native-vector-icons/Entypo";
import { juiceApi } from '../../utils/api';

const service = { 1: "中介服务", 2: "出借服务", 3: "保单服务" };
const service_date = [
  {
    label: "中介服务",
    value: 1,
  },
  {
    label: "出借服务",
    value: 2,
  },
  {
    label: "保单服务",
    value: 3,
  },
];
const lianStyleData = { 1: "房产贷款", 2: "信用贷款", 3: "企业贷款", 4: "车产贷款", 5: "应急贷款", 6: "担保贷", 7: "信用卡贷", };
const loan_style_date = [
  {
    label: "房产贷款",
    value: 1,
  },
  {
    label: "信用贷款",
    value: 2,
  },
  {
    label: "企业贷款",
    value: 3,
  },
  {
    label: "车产贷款",
    value: 4,
  },
  {
    label: "应急贷款",
    value: 5,
  },
  {
    label: "担保贷",
    value: 6,
  },
  {
    label: "信用卡贷",
    value: 7,
  },
];
const loanAmount = { 1: "1万 - 5万", 2: "5万 - 10万", 3: "10万 - 50万", 4: "50万 - 100万", };
const loan_amount_date = [
  {
    label: "1万 - 5万",
    value: 1,
  },
  {
    label: "5万 - 10万",
    value: 2,
  },
  {
    label: "10万 - 50万",
    value: 3,
  },
  {
    label: "50万 - 100万",
    value: 4,
  },

];
const loanTime = { 1: "1 - 15天", 2: "15 - 60天", 3: "60 - 120天", };
const loan_time_data = [
  {
    label: "1 - 15天",
    value: 1,
  },
  {
    label: "15 - 60天",
    value: 2,
  },
  {
    label: "60 - 120天",
    value: 3,
  }
];
const loanLimit = { 1: "1 - 6个月", 2: "6 - 12个月", 3: "12 - 36个月", 4: "36 - 48个月" };
const loan_limit_data = [
  {
    label: "1 - 6个月",
    value: 1,
  },
  {
    label: "6 - 12个月",
    value: 2,
  },
  {
    label: "12 - 36个月",
    value: 3,
  },
  {
    label: "36 - 48个月",
    value: 4,
  },
];
const chooseServiceList = [
  {
    id: 1,
    title: "到账快",
    ischoose: false,
  },
  {
    id: 2,
    title: "门槛低",
    ischoose: false,
  },
  {
    id: 3,
    title: "额度高",
    ischoose: false,
  },
  {
    id: 4,
    title: "灵活还款",
    ischoose: false,
  },
  {
    id: 5,
    title: "无抵押",
    ischoose: false,
  },
  {
    id: 6,
    title: "最快2小时放款",
    ischoose: false,
  },
  {
    id: 7,
    title: "全程网络操作",
    ischoose: false,
  },
  {
    id: 8,
    title: "月入2k就可放款",
    ischoose: false,
  },
];
const materialsNeedList = [
  {
    id: 1,
    title: "身份证",
    ischoose: false,
  },
  {
    id: 2,
    title: "户口本",
    ischoose: false,
  },
  {
    id: 3,
    title: "房产证",
    ischoose: false,
  },
  {
    id: 4,
    title: "居住证",
    ischoose: false,
  },
  {
    id: 5,
    title: "收入证明",
    ischoose: false,
  },
  {
    id: 6,
    title: "社保证明",
    ischoose: false,
  },
  {
    id: 7,
    title: "公积金证明",
    ischoose: false,
  },
  {
    id: 8,
    title: "车辆登记证明",
    ischoose: false,
  },
  {
    id: 9,
    title: "股票",
    ischoose: false,
  },
  {
    id: 10,
    title: "征信记录",
    ischoose: false,
  },
];


export default class AddProduct extends Component {
  static navigationOptions = {
    headerTitle: <View style={gStyle.linearGradient}>
      <Text style={gStyle.headerText}>编辑产品</Text></View>,
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
      choose_characteristics: false,
      choose_materials_need: false,
      characteristics: [],
      characteristics_id: [],
      materials_need: [],
      materials_need_id: [],
      product_name: "",
      service_type: [],
      service_date: [],
      loan_style: [],
      loan_style_date: [],
      min_monthly_interest_rate: "",
      max_monthly_interest_rate: "",
      min_handling_fee: "",
      max_handling_fee: "",
      loan_amount: [],
      loan_amount_date: [],
      loan_time: [],
      loan_time_data: [],
      loan_limit: [],
      loan_limit_data: [],
      hasChooseServiceCount: 0,
      chooseServiceList: [],
      materialsNeedList: [],
    }
  }
  componentDidMount() {
    this.init();
  }
  init = async _ => {
    const { navigation } = this.props;
    let productId = parseInt(navigation.getParam('productId'));
    Toast.loading("加载中", 0, null, true)
    let json = await this.getPageData(productId);
    console.log(json);
    let characteristics = [];
    for (let i = 0; i < 2; i++) {
      let id = json.data.characteristics[i] - 1;
      let title = chooseServiceList[id].title;
      characteristics.push(title);
    }
    let materials_need = [];
    for (let i = 0; i < 2; i++) {
      let id = json.data.materials_need[i] - 1;
      let title = materialsNeedList[id].title;
      materials_need.push(title);
    }
    this.setState({
      id: json.data.id,
      product_name: json.data.product_name,
      characteristics_id: json.data.characteristics,
      characteristics: characteristics,
      service_type: json.data.service_type,
      loan_style: json.data.loan_style,
      min_monthly_interest_rate: json.data.monthly_interest_rate[0],
      max_monthly_interest_rate: json.data.monthly_interest_rate[1],
      min_handling_fee: json.data.handling_fee[0],
      max_handling_fee: json.data.handling_fee[1],
      materials_need_id: json.data.materials_need,
      materials_need: materials_need,
      loan_time: json.data.loan_time,
      loan_amount: json.data.loan_amount,
      loan_limit: json.data.loan_limit,
      hasLoad: true,
      service_date,
      loan_style_date,
      loan_amount_date,
      loan_time_data,
      loan_limit_data,
      chooseServiceList,
      materialsNeedList,
    })

    Toast.hide()
  }
  getPageData = async (productId) => {
    return juiceApi.personalProductDetail(productId);
    return Promise.resolve({
      data: {
        "id": "13",
        "product_name": "nick",
        "characteristics": [1, 2],
        "service_type": [2],
        "loan_style": [1],
        "monthly_interest_rate": ["1", "2"],
        "handling_fee": ["2", "3"],
        "materials_need": [1, 2, 5, 6],
        "loan_amount": [3],
        "loan_time": [3],
        "loan_limit": [4],
      },
    })
  }
  addProduct = () => {
    const { navigation } = this.props;
    if (this.state.product_name === "") {
      Toast.fail("请填写产品名称", 1);
      return false;
    }
    if (this.state.characteristics.length === 0) {
      Toast.fail("请选择产品特点", 1);
      return false;
    }
    if (this.state.service_type.length === 0) {
      Toast.fail("请选择服务种类", 1);
      return false;
    }
    if (this.state.min_monthly_interest_rate === "") {
      Toast.fail("请填写月利率范围的最小值", 1);
      return false;
    }
    if (this.state.max_monthly_interest_rate === "") {
      Toast.fail("请填写月利率范围的最大值", 1);
      return false;
    }
    if (this.state.min_handling_fee === "") {
      Toast.fail("请填写办理手续费率的最小值", 1);
      return false;
    }
    if (this.state.max_handling_fee === "") {
      Toast.fail("请填写办理手续费率的最大值", 1);
      return false;
    }
    if (this.state.materials_need_id.length === 0) {
      Toast.fail("请选择所需的材料", 1);
      return false;
    }
    if (this.state.loan_amount.length === 0) {
      Toast.fail("请选择贷款额度", 1);
      return false;
    }
    if (this.state.loan_time.length === 0) {
      Toast.fail("请选择放款时间", 1);
      return false;
    }
    if (this.state.loan_limit.length === 0) {
      Toast.fail("请选择贷款期限", 1);
      return false;
    }
    let data = {
      "productId": this.state.id,
      "product_name": this.state.product_name,
      "characteristics": this.state.characteristics_id,
      "service_type": this.state.service_type,
      "loan_style": this.state.loan_style,
      "monthly_interest_rate": [this.state.min_monthly_interest_rate, this.state.max_monthly_interest_rate],
      "handling_fee": [this.state.min_handling_fee, this.state.max_handling_fee],
      "materials_need": this.state.materials_need_id,
      "loan_amount": this.state.loan_amount,
      "loan_time": this.state.loan_time,
      "loan_limit": this.state.loan_limit,
    };
    console.log(data);
    return juiceApi.personalProductEdit(data).then(_ => {
      Toast.success("修改成功", 1);
      setTimeout(function () {
        navigation.navigate(pathMap.Product);
      }, 500)
    }).catch(err => {
      Toast.success("修改失败,失败的原因:" + err.msg, 1);
      console.log(err);
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
    return (
      <View style={{ flexDirection: "row", flex: 1, }}>
        <ScrollView>
          <View style={styles.list}>
            <View style={styles.item}>
              <Text style={styles.title}>产品名称</Text>
              <TextInput
                value={this.state.product_name}
                style={styles.input}
                onChangeText={productName => {
                  this.setState({
                    product_name: productName,
                  });
                }}
                placeholder="请填写"
              ></TextInput>
              <Icons style={styles.icon} name="chevron-small-right" size={20} color="#252525"></Icons>
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>产品特点</Text>
              <TouchableOpacity style={styles.chooseItem}
                onPress={() => {
                  this.setState({
                    choose_characteristics: true,
                    characteristics: [],
                    characteristics_id: [],
                  })

                }}
              >
                <Text style={styles.chooseInput}>{
                  this.state.characteristics.length === 0 ? "请选择" : this.state.characteristics.map((v, k) => {
                    return v + " "
                  })
                }</Text>
              </TouchableOpacity>
              <Icons style={styles.icon} name="chevron-small-right" size={20} color="#252525"></Icons>
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>服务种类</Text>
              <Picker
                data={this.state.service_date}
                cols={1}
                value={this.state.service_type}
                onChange={(service_type) => {
                  this.setState({
                    service_type,
                  })
                }}
                triggerType="onPress"
                style={styles.picker}
              >
                <TouchableOpacity>
                  <Text style={styles.pickerTitle}>{this.state.service_type.length === 0 ? "请选择" : service[this.state.service_type[0]]}
                    <Icons style={styles.icon} name="chevron-small-right" size={20} color="#252525"></Icons>
                  </Text>
                </TouchableOpacity>
              </Picker>
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>贷款方式</Text>
              <Picker
                data={this.state.loan_style_date}
                cols={1}
                value={this.state.loan_style}
                onChange={(loan_style) => {
                  this.setState({
                    loan_style,
                  })
                }}
                triggerType="onPress"
                style={styles.picker}
              >
                <TouchableOpacity>
                  <Text style={styles.pickerTitle}>{this.state.loan_style.length === 0 ? "请选择" : lianStyleData[this.state.loan_style[0]]}
                    <Icons style={styles.icon} name="chevron-small-right" size={20} color="#252525"></Icons>
                  </Text>
                </TouchableOpacity>
              </Picker>
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>月利率范围(%)</Text>
              <TextInput
                keyboardType="number-pad"
                value={this.state.min_monthly_interest_rate}
                style={styles.input}
                onChangeText={(min_monthly_interest_rate) => {
                  this.setState({
                    min_monthly_interest_rate,
                  });
                }}
                placeholder="请填写"
              ></TextInput>
              <Text> - </Text>
              <TextInput
                keyboardType="number-pad"
                value={this.state.max_monthly_interest_rate}
                style={styles.input}
                onChangeText={(max_monthly_interest_rate) => {
                  this.setState({
                    max_monthly_interest_rate,
                  });
                }}
                placeholder="请填写"
              ></TextInput>
              <Icons style={styles.icon} name="chevron-small-right" size={20} color="#252525"></Icons>
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>一次性办理手续费(%)</Text>
              <TextInput
                keyboardType="number-pad"
                value={this.state.min_handling_fee}
                style={styles.input}
                onChangeText={(min_handling_fee) => {
                  this.setState({
                    min_handling_fee,
                  });
                }}
                placeholder="请填写"
              ></TextInput>
              <Text> - </Text>
              <TextInput
                keyboardType="number-pad"
                value={this.state.max_handling_fee}
                style={styles.input}
                onChangeText={(max_handling_fee) => {
                  this.setState({
                    max_handling_fee,
                  });
                }}
                placeholder="请填写"
              ></TextInput>
              <Icons style={styles.icon} name="chevron-small-right" size={20} color="#252525"></Icons>
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>所需材料(可多选)</Text>
              <TouchableOpacity style={styles.chooseItem}
                onPress={() => {
                  this.setState({
                    choose_materials_need: true,
                    materials_need: [],
                    materials_need_id: [],
                  })

                }}
              >
                <Text style={styles.chooseInput}>{
                  this.state.materials_need.length === 0 ? "请选择" : this.state.materials_need.map((v, k) => {
                    return v + " "
                  })
                }</Text>
              </TouchableOpacity>
              <Icons style={styles.icon} name="chevron-small-right" size={20} color="#252525"></Icons>
            </View>
            <View style={[styles.item, { marginTop: 20, }]}>
              <Text style={styles.title}>放款额度</Text>
              <Picker
                data={this.state.loan_amount_date}
                cols={1}
                value={this.state.loan_amount}
                onChange={(loan_amount) => {
                  this.setState({
                    loan_amount,
                  })
                }}
                triggerType="onPress"
                style={styles.picker}
              >
                <TouchableOpacity>
                  <Text style={styles.pickerTitle}>{this.state.loan_amount.length === 0 ? "请选择" : loanAmount[this.state.loan_amount[0]]}
                    <Icons style={styles.icon} name="chevron-small-right" size={20} color="#252525"></Icons>
                  </Text>
                </TouchableOpacity>
              </Picker>
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>放款时间</Text>
              <Picker
                data={this.state.loan_time_data}
                cols={1}
                value={this.state.loan_time}
                onChange={(loan_time) => {
                  this.setState({
                    loan_time,
                  })
                }}
                triggerType="onPress"
                style={styles.picker}
              >
                <TouchableOpacity>
                  <Text style={styles.pickerTitle}>{this.state.loan_time.length === 0 ? "请选择" : loanTime[this.state.loan_time[0]]}
                    <Icons style={styles.icon} name="chevron-small-right" size={20} color="#252525"></Icons>
                  </Text>
                </TouchableOpacity>
              </Picker>
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>贷款期限</Text>
              <Picker
                data={this.state.loan_limit_data}
                cols={1}
                value={this.state.loan_limit}
                onChange={(loan_limit) => {
                  this.setState({
                    loan_limit,
                  })
                }}
                triggerType="onPress"
                style={styles.picker}
              >
                <TouchableOpacity>
                  <Text style={styles.pickerTitle}>{this.state.loan_limit.length === 0 ? "请选择" : loanLimit[this.state.loan_limit[0]]}
                    <Icons style={styles.icon} name="chevron-small-right" size={20} color="#252525"></Icons>
                  </Text>
                </TouchableOpacity>
              </Picker>
            </View>
          </View>
          {/* 产品特点 */}
          <View style={this.state.choose_characteristics ? styles.chooseServiceType : styles.hidden}>
            <View style={styles.prompt}>
              <Text style={styles.promoptTitle}>关键字选择不超过2个</Text>
            </View>
            <View style={styles.chooseServiceList}>
              {this.state.chooseServiceList.map((v, k) => {
                return (<TouchableOpacity key={k}
                  style={styles.choooseServiceItem}
                  onPress={_ => {
                    let chooseServiceList = this.state.chooseServiceList
                    let characteristics = this.state.characteristics
                    let characteristics_id = this.state.characteristics_id
                    let hasChooseServiceCount = this.state.hasChooseServiceCount
                    if (chooseServiceList[k].ischoose) {
                      chooseServiceList[k].ischoose = false;
                      characteristics = characteristics.filter(v => {
                        return v !== chooseServiceList[k].title;
                      })
                      characteristics_id = characteristics_id.filter(v => {
                        return v !== chooseServiceList[k].id;
                      })

                      hasChooseServiceCount--;
                    } else {
                      if (this.state.hasChooseServiceCount >= 2) {
                        return
                      }
                      chooseServiceList[k].ischoose = true;
                      characteristics.push(chooseServiceList[k].title)
                      characteristics_id.push(chooseServiceList[k].id)
                      hasChooseServiceCount++;
                    }
                    this.setState({
                      characteristics,
                      chooseServiceList,
                      hasChooseServiceCount,
                      characteristics_id,
                    })
                  }}
                >
                  <Text style={this.state.chooseServiceList[k].ischoose ? styles.chooseServiceItemActive : styles.chooseServiceItem}>{v.title}</Text>
                </TouchableOpacity>);
              })}
            </View>
            <View style={styles.senBtn}>
              <LinearGradient
                colors={['#f53f68', '#e92b32']}
                start={{ x: 0, y: 0, }}
                end={{ x: 1, y: 1, }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      choose_characteristics: false,
                    })
                  }}
                  style={styles.selectBtnBox}
                >
                  <Text style={styles.selectBtn}>确定</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
          {/* 材料需求 */}
          <View style={this.state.choose_materials_need ? styles.chooseServiceType : styles.hidden}>
            <View style={styles.prompt}>
              <Text style={styles.promoptTitle}>关键字选择不超过2个</Text>
            </View>
            <View style={styles.chooseServiceList}>
              {this.state.materialsNeedList.map((v, k) => {
                return (<TouchableOpacity key={k}
                  style={styles.choooseServiceItem}
                  onPress={_ => {
                    let materialsNeedList = this.state.materialsNeedList
                    let materials_need = this.state.materials_need
                    let materials_need_id = this.state.materials_need_id
                    if (materialsNeedList[k].ischoose) {
                      materialsNeedList[k].ischoose = false;
                      materials_need = materials_need.filter(v => {
                        return v !== materialsNeedList[k].title;
                      })
                      materials_need_id = materials_need_id.filter(v => {
                        return v !== materialsNeedList[k].id;
                      })

                    } else {
                      materialsNeedList[k].ischoose = true;
                      materials_need.push(materialsNeedList[k].title)
                      materials_need_id.push(materialsNeedList[k].id)
                    }
                    this.setState({
                      materialsNeedList,
                      materials_need,
                      materials_need_id
                    })
                  }}
                >
                  <Text style={this.state.materialsNeedList[k].ischoose ? styles.chooseServiceItemActive : styles.chooseServiceItem}>{v.title}</Text>
                </TouchableOpacity>);
              })}
            </View>
            <View style={styles.senBtn}>
              <LinearGradient
                colors={['#f53f68', '#e92b32']}
                start={{ x: 0, y: 0, }}
                end={{ x: 1, y: 1, }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      choose_materials_need: false,
                    })
                  }}
                  style={styles.selectBtnBox}
                >
                  <Text style={styles.selectBtn}>确定</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
          <View style={{ height: 50, }}></View>
        </ScrollView>
        <LinearGradient
          colors={["#f53f68", "#e92b32"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={this.state.choose_characteristics === false &&
            this.state.choose_materials_need === false ?
            styles.btnBox : styles.hidden}
        >
          <TouchableOpacity
            onPress={() => {
              this.addProduct();
            }}
          >
            <Text style={styles.btn}>提交</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View >
    );
  }
}
