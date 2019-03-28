import * as userAction from "@/redux/actions/user";
import { AppState } from "@/redux/stores/store";
import { Icon, Toast } from "@ant-design/react-native";
import sColor from "@styles/color";
import gStyle from "@utils/style";
import React, { Component } from "react";
import {
  PixelRatio,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { NavigationScreenProp } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
const style = gStyle.addressBook.AddressBookGroup;
const global = gStyle.global;
interface NavParams {
  navigatePress: () => void;
}
interface Props {
  navigation: NavigationScreenProp<State, NavParams>;
}
interface patientGroupItem {
  id: number;
  name: string;
  patientList?: patientGroupItem[];
}
interface State {
  hasLoad: boolean;
  refreshing: boolean;
  isDeleteMode: boolean;
  patientGroupList: patientGroupItem[];
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
export default class Index extends Component<
  Props &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = ({
    navigation
  }: {
    navigation: NavigationScreenProp<State, NavParams>;
  }) => ({
    title: "患者分组",
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
    headerRight: (
      <TouchableOpacity
        onPress={() => (navigation.state.params as NavParams).navigatePress}
      >
        <Text
          style={[style.headerTitleLeft, global.fontSize14, global.fontStyle]}
        >
          {console.log(navigation.state)}
          {navigation.state.isDeleteMode ? "删除" : "完成"}
        </Text>
      </TouchableOpacity>
    )
  });
  constructor(props: any) {
    super(props);
    this.state = this.getInitState();
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isDeleteMode: true,
      patientGroupList: []
    };
  };
  async componentDidMount() {
    await this.init();
    this.props.navigation.setParams({ navigatePress: this.deleteGroup });
  }
  deleteGroup = () => {
    this.setState({
      isDeleteMode: !this.state.isDeleteMode
    });
    Toast.info(`isDeleteMode is ${this.state.isDeleteMode}`, 1);
  };
  init = async () => {
    // let {data} = await userApi.getPatientGroupList({page:-1,limit:-1,filter:{}})
    let patientGroupList = [
      {
        id: 1,
        name: "亲人",
        patientList: [
          {
            id: 1,
            name: "李伟"
          },
          {
            id: 2,
            name: "吴伟"
          },
          {
            id: 3,
            name: "孟磊"
          },
          {
            id: 4,
            name: "吴大伟"
          },
          {
            id: 5,
            name: "吴二伟"
          }
        ]
      },
      {
        id: 2,
        name: "朋友",
        patientList: [
          {
            id: 6,
            name: "孟磊"
          },
          {
            id: 7,
            name: "吴大伟"
          },
          {
            id: 8,
            name: "吴二伟"
          },
          {
            id: 9,
            name: "吴二伟"
          },
          {
            id: 10,
            name: "吴二伟"
          },
          {
            id: 11,
            name: "吴二伟"
          },
          {
            id: 12,
            name: "吴二伟"
          },
          {
            id: 13,
            name: "吴二伟"
          },
          {
            id: 14,
            name: "吴二伟"
          },
          {
            id: 15,
            name: "吴二伟"
          },
          {
            id: 16,
            name: "吴二伟"
          }
        ]
      }
    ];
    this.setState({
      hasLoad: true,
      patientGroupList
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
      <>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View style={style.patientGroupList}>
            {this.state.patientGroupList.map((v: any, k: number) => {
              return (
                <TouchableOpacity
                  key={k}
                  style={[
                    style.patientGroupItem,
                    global.flex,
                    global.justifyContentSpaceBetween,
                    global.alignItemsCenter
                  ]}
                >
                  <View style={[style.patientGroupItemTitle]}>
                    <View
                      style={[
                        style.patientGroupTitle,
                        global.flex,
                        global.alignItemsCenter
                      ]}
                    >
                      <Text
                        style={[
                          style.patientGroupTitle,
                          global.fontSize15,
                          global.fontStyle
                        ]}
                      >
                        {v.name}
                      </Text>
                      <Text
                        style={[
                          style.patientGroupCount,
                          global.fontSize15,
                          global.fontStyle
                        ]}
                      >
                        ( {v.patientList.length} ) 人
                      </Text>
                    </View>
                    <View
                      style={[
                        style.patientGroupDescription,
                        global.flex,
                        global.alignItemsCenter
                      ]}
                    >
                      {v.patientList.length === 0 ? (
                        <Text
                          style={[
                            style.patientGroupNames,
                            global.fontSize12,
                            global.fontStyle
                          ]}
                        >
                          暂无患者
                        </Text>
                      ) : (
                        <Text
                          style={[
                            style.patientGroupNames,
                            global.fontSize12,
                            global.fontStyle
                          ]}
                          numberOfLines={1}
                        >
                          {v.patientList.map((v1: any) => {
                            return v1.name + "、";
                          })}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Icon
                    name="right"
                    style={[style.patientGroupIcon, global.fontSize14]}
                  />
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[
                style.addPatientGroup,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter
              ]}
            >
              <Icon name="plus-circle" style={style.addPatientGroupBtn} />
              <Text
                style={[
                  style.addPatientGroupTitle,
                  global.fontSize14,
                  global.fontStyle
                ]}
              >
                添加新分组
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    );
  }
}
