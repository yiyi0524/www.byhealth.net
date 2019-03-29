import React, { Component } from "react";
import { AppState } from "@/redux/stores/store";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as userAction from "@/redux/actions/user";
import {
  ScrollView,
  Text,
  View,
  RefreshControl,
  PixelRatio,
  Image
} from "react-native";
import { Toast, Icon } from "@ant-design/react-native";
import gStyle from "@utils/style";
import { TouchableOpacity } from "react-native-gesture-handler";
import sColor from "@styles/color";
import gImg from "@utils/img";
const style = gStyle.addressBook.PatientDetail;
const global = gStyle.global;
interface Props {
  navigation: any;
}
interface State {
  hasLoad: boolean;
  refreshing: boolean;
  isShowMode: boolean;
  patientInfo: [];
  showImg: any;
}
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: userAction.UserInfo) => {
      dispatch(userAction.userLogin(preload));
    }
  };
};
@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class PatientDetail extends Component<
  Props &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => ({
    title: "患者档案",
    headerStyle: {
      backgroundColor: sColor.white,
      height: 50,
      elevation: 0,
      color: sColor.mainBlack,
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: sColor.colorEee
    },
    headerTintColor: sColor.color333,
    headerTitleStyle: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      textAlign: "center"
    },
    headerRight: <TouchableOpacity />
  });
  constructor(props: any) {
    super(props);
    this.state = this.getInitState();
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isShowMode: false,
      showImg: gImg.common.defaultAvatar,
      patientInfo: []
    };
  };
  async componentDidMount() {
    await this.init();
  }
  init = async () => {
    // let json = await patientApi.getPatientInfo();
    let patientInfo = [];

    this.setState({
      hasLoad: true
      // patientInfo
    });
  };
  onRefresh = () => {
    this.setState({ refreshing: true });
    Promise.all([this.init(), new Promise(s => setTimeout(s, 500))])
      .then(_ => {
        this.setState({ refreshing: false });
      })
      .catch(err => {
        Toast.fail("刷新失败,错误信息: " + err.msg);
      });
  };
  showMode = (img: any) => {
    this.setState({
      isShowMode: true,
      showImg: img
    });
  };
  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <Text
            style={[style.loadingTitle, global.fontSize14, global.fontStyle]}
          >
            加载中...
          </Text>
        </View>
      );
    }
    return (
      <View style={style.detail}>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View style={[style.header, global.flex, global.alignItemsCenter]}>
            <View style={style.headerPic}>
              <Image
                style={style.headerImg}
                source={gImg.common.defaultAvatar}
              />
            </View>
            <View style={style.headerDescription}>
              <View
                style={[
                  style.headerDescriptionTitle,
                  global.flex,
                  global.alignItemsCenter
                ]}
              >
                <Text
                  style={[
                    style.headerDescriptionName,
                    global.fontSize15,
                    global.fontStyle
                  ]}
                >
                  曹东升
                </Text>
                <Text
                  style={[
                    style.headerDescriptionGender,
                    global.fontSize14,
                    global.fontStyle
                  ]}
                >
                  女
                </Text>
                <Text
                  style={[
                    style.headerDescriptionAge,
                    global.fontSize14,
                    global.fontStyle
                  ]}
                >
                  1岁11个月 . 河北省
                </Text>
              </View>
              <View
                style={[
                  style.headerDescriptionRemarks,
                  global.flex,
                  global.alignItemsCenter
                ]}
              >
                <Text
                  style={[
                    style.headerDescriptionRemarksTitle,
                    global.fontSize13,
                    global.fontStyle
                  ]}
                >
                  备注名
                </Text>
                <Text style={[style.headerDescriptionReamarksName]}>
                  未备注
                  <Icon
                    style={[
                      style.headerDescriptionReamarksIcon,
                      global.fontSize14
                    ]}
                    name="right"
                  />
                </Text>
              </View>
              <View
                style={[
                  style.headerDescriptionPhone,
                  global.flex,
                  global.alignItemsCenter
                ]}
              >
                <Text
                  style={[
                    style.headerDescriptionPhoneTitle,
                    global.fontSize13,
                    global.fontStyle
                  ]}
                >
                  手机号
                </Text>
                <Text
                  style={[
                    style.headerDescriptionPhoneDetail,
                    global.fontSize13,
                    global.fontStyle
                  ]}
                >
                  180*******0
                </Text>
              </View>
            </View>
          </View>
          <View
            style={[
              style.physicalQuality,
              global.flex,
              global.justifyContentSpaceAround,
              global.alignItemsCenter
            ]}
          >
            <View style={style.physicalQualityItem}>
              <Text
                style={[
                  style.physicalQualityItemTitle,
                  global.fontSize13,
                  global.fontStyle
                ]}
              >
                患者身高
              </Text>
              <Text
                style={[
                  style.physicalQualityItemDetail,
                  global.fontSize14,
                  global.fontStyle
                ]}
              >
                111cm
              </Text>
            </View>
            <View style={style.physicalQualityItemLine} />
            <View style={style.physicalQualityItem}>
              <Text
                style={[
                  style.physicalQualityItemTitle,
                  global.fontSize13,
                  global.fontStyle
                ]}
              >
                患者体重
              </Text>
              <Text
                style={[
                  style.physicalQualityItemDetail,
                  global.fontSize14,
                  global.fontStyle
                ]}
              >
                50kg
              </Text>
            </View>
            <View style={style.physicalQualityItemLine} />
            <View style={style.physicalQualityItem}>
              <Text
                style={[
                  style.physicalQualityItemTitle,
                  global.fontSize13,
                  global.fontStyle
                ]}
              >
                特殊时期
              </Text>
              <Text
                style={[
                  style.physicalQualityItemDetail,
                  global.fontSize14,
                  global.fontStyle
                ]}
              >
                无
              </Text>
            </View>
          </View>
          <View style={style.medicalHistory}>
            <View
              style={[
                style.medicalHistoryItem,
                global.flex,
                global.alignItemsCenter
              ]}
            >
              <Text
                style={[
                  style.medicalHistoryItemTitle,
                  global.fontSize14,
                  global.fontStyle
                ]}
              >
                过敏历史
              </Text>
              <Text
                style={[
                  style.medicalHistoryItemDetail,
                  global.fontSize14,
                  global.fontStyle
                ]}
                numberOfLines={1}
              >
                无
              </Text>
            </View>
            <View
              style={[
                style.medicalHistoryItem,
                global.flex,
                global.alignItemsCenter
              ]}
            >
              <Text
                style={[
                  style.medicalHistoryItemTitle,
                  global.fontSize14,
                  global.fontStyle
                ]}
              >
                既往病史
              </Text>
              <Text
                style={[
                  style.medicalHistoryItemDetail,
                  global.fontSize14,
                  global.fontStyle
                ]}
                numberOfLines={1}
              >
                无
              </Text>
            </View>
          </View>
          <View style={style.medicalRecordPic}>
            <View style={style.medicalRecordPicTitle}>
              <Text
                style={[
                  style.medicalRecordPicTitleName,
                  global.fontSize14,
                  global.fontStyle
                ]}
              >
                实体医疗机构病历
              </Text>
            </View>
            <View
              style={[
                style.medicalRecordPics,
                global.flex,
                global.alignItemsCenter,
                global.flexWrap
              ]}
            >
              <TouchableOpacity
                onPress={() =>
                  this.showMode(
                    "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                  )
                }
              >
                <Image
                  style={style.medicalRecordImg}
                  source={{
                    uri:
                      "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.showMode(
                    "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                  )
                }
              >
                <Image
                  style={style.medicalRecordImg}
                  source={{
                    uri:
                      "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.showMode(
                    "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                  )
                }
              >
                <Image
                  style={style.medicalRecordImg}
                  source={{
                    uri:
                      "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.showMode(
                    "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                  )
                }
              >
                <Image
                  style={style.medicalRecordImg}
                  source={{
                    uri:
                      "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={style.medicalRecord}>
            <View
              style={[
                style.medicalRecordTitleBox,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween
              ]}
            >
              <View style={[global.flex, global.alignItemsCenter]}>
                <View style={style.medicalRecordIcon} />
                <Text
                  style={[
                    style.medicalRecordTitle,
                    global.fontSize15,
                    global.fontStyle
                  ]}
                >
                  历史病历
                </Text>
              </View>
              <Text style={[style.medicalRecordAdd, global.fontSize13]}>
                <Icon
                  style={[style.medicalRecordAddIcon, global.fontSize13]}
                  name="right"
                />
                添加新病历
              </Text>
            </View>
            <View style={style.medicalRecordItem}>
              <Text
                style={[
                  style.medicalRecordItemTitle,
                  global.fontSize15,
                  global.fontStyle
                ]}
              >
                2019年03月18日 15:25 复诊
              </Text>
              <Text
                style={[
                  style.medicalRecordItemSecondTitle,
                  global.fontSize14,
                  global.fontStyle
                ]}
              >
                患者自述
              </Text>
              <Text
                style={[
                  style.medicalRecordItemDetail,
                  global.fontSize14,
                  global.fontStyle
                ]}
                numberOfLines={2}
              >
                {" "}
                鬓发这里秃了一点点,很平滑
              </Text>
              <Text
                style={[
                  style.medicalRecordItemSecondTitle,
                  global.fontSize14,
                  global.fontStyle
                ]}
              >
                舌照面照及其他资料
              </Text>
              <View
                style={[
                  style.medicalRecordItemPicList,
                  global.flex,
                  global.alignItemsCenter,
                  global.flexWrap
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.showMode(
                      "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                    )
                  }
                >
                  <Image
                    style={style.medicalRecordImg}
                    source={{
                      uri:
                        "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                    }}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  style.medicalRecordItemSecondTitle,
                  global.fontSize14,
                  global.fontStyle
                ]}
              >
                对话照片
              </Text>
              <View
                style={[
                  style.medicalRecordItemPicList,
                  global.flex,
                  global.alignItemsCenter,
                  global.flexWrap
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.showMode(
                      "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                    )
                  }
                >
                  <Image
                    style={style.medicalRecordImg}
                    source={{
                      uri:
                        "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.showMode(
                      "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                    )
                  }
                >
                  <Image
                    style={style.medicalRecordImg}
                    source={{
                      uri:
                        "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png"
                    }}
                  />
                </TouchableOpacity>
              </View>
              {/* 医生方案 -诊断*/}
              <Text
                style={[
                  style.medicalRecordItemTitle,
                  global.fontSize15,
                  global.fontStyle,
                  {
                    marginTop: 10
                  }
                ]}
              >
                {" "}
                医生方案
              </Text>
              <View
                style={[style.medicalRecordItemDoctorDiagnosis, global.flex]}
              >
                <Text
                  style={[
                    style.medicalRecordItemDoctorDiagnosisTitle,
                    global.fontSize14,
                    global.fontStyle
                  ]}
                >
                  诊断
                </Text>
                <Text
                  style={[
                    style.medicalRecordItemDoctorDiagnosisDetail,
                    global.fontSize14,
                    global.fontStyle
                  ]}
                  numberOfLines={3}
                >
                  斑秃
                </Text>
              </View>
              {/* 医生方案 -治疗*/}
              <View
                style={[style.medicalRecordItemDoctorDiagnosis, global.flex]}
              >
                <Text
                  style={[
                    style.medicalRecordItemDoctorDiagnosisTitle,
                    global.fontSize14,
                    global.fontStyle
                  ]}
                >
                  治疗
                </Text>
                <Text
                  style={[
                    style.medicalRecordItemDoctorDiagnosisDetail,
                    global.fontSize14,
                    global.fontStyle
                  ]}
                  numberOfLines={3}
                >
                  生姜擦拭患处
                </Text>
              </View>
              <TouchableOpacity>
                <View
                  style={[
                    global.flex,
                    global.alignItemsCenter,
                    global.justifyContentCenter
                  ]}
                >
                  <Text
                    style={[style.medicalRecordItemReadMore, global.fontSize14]}
                  >
                    查看病历详情
                  </Text>
                  <Icon
                    style={[
                      style.medicalRecordItemReadMoreIcon,
                      global.fontSize14
                    ]}
                    name="right"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View
          style={[
            style.bottomBtn,
            global.flex,
            global.alignItemsCenter,
            global.justifyContentSpaceAround
          ]}
        >
          <TouchableOpacity>
            <Text>进入对话</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>开放</Text>
          </TouchableOpacity>
        </View>
        {/* 图片查看器 */}
        <View style={this.state.isShowMode ? style.showMode : global.hidden}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isShowMode: false,
                showImg: gImg.common.defaultAvatar
              });
            }}
          >
            <Image
              style={style.showImg}
              source={
                this.state.showImg !== gImg.common.defaultAvatar
                  ? { uri: this.state.showImg }
                  : this.state.showImg
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
