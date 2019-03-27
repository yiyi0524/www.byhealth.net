import React, { Component } from "react";
import { AppState } from "@/redux/stores/store";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as userAction from "@/redux/actions/user";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { Toast, Icon } from "@ant-design/react-native";
import gStyle from "@utils/style";
import api from "@api/api";
const style = gStyle.personalCenter.personalCenterIndex;
const global = gStyle.global;
interface Props {
  navigation: any;
}
interface State {
  hasLoad: boolean;
  refreshing: boolean;
  version: {
    current: string;
    new: string;
  };
}
interface functionItem {
  name: string;
  link: string;
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
  functionList: functionItem[] = [];
  constructor(props: any) {
    super(props);
    this.functionList = [
      {
        name: "账户",
        link: ""
      },
      {
        name: "编辑资料",
        link: ""
      },
      {
        name: "修改密码",
        link: ""
      },
      {
        name: "关于我们",
        link: ""
      },
      {
        name: "联系客服",
        link: ""
      },
      {
        name: "退出登录",
        link: ""
      }
    ];
    this.state = this.getInitState();
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      version: {
        current: "1.0.0",
        new: ""
      }
    };
  };
  async componentDidMount() {
    await this.init();
  }
  init = async () => {
    // let {data:version} = api.getVersion();//todo 版本信息监测
    let version = {
      current: "1.0.0",
      new: "1.0.1"
    };
    this.setState({
      hasLoad: true,
      version
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
          <View style={style.separationModule} />
          <View style={style.list}>
            {this.functionList.map((v: any, k: number) => {
              if (v.name === "账户") {
                return (
                  <View key={k}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.push(v.link)}
                      style={[
                        style.item,
                        global.flex,
                        global.justifyContentSpaceBetween,
                        global.alignItemsCenter
                      ]}
                    >
                      <Text
                        style={[
                          style.title,
                          global.fontStyle,
                          global.fontSize15
                        ]}
                      >
                        {v.name}
                      </Text>
                      <Icon
                        style={[style.icon, global.fontSize14]}
                        name="right"
                      />
                    </TouchableOpacity>
                    <View style={style.separationModule} />
                  </View>
                );
              }
              if (v.name === "退出登录") {
                return (
                  <View key={k}>
                    <View style={style.separationModule} />
                    <TouchableOpacity
                      onPress={() => this.props.navigation.push(v.link)}
                      style={[
                        style.item,
                        global.flex,
                        global.justifyContentCenter,
                        global.alignItemsCenter
                      ]}
                    >
                      <Text
                        style={[
                          style.logout,
                          global.fontStyle,
                          global.fontSize15
                        ]}
                      >
                        {v.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }
              return (
                <TouchableOpacity
                  onPress={() => this.props.navigation.push(v.link)}
                  key={k}
                  style={[
                    style.item,
                    global.flex,
                    global.justifyContentSpaceBetween,
                    global.alignItemsCenter
                  ]}
                >
                  <Text
                    style={[style.title, global.fontStyle, global.fontSize15]}
                  >
                    {v.name}
                  </Text>
                  {v.name === "关于我们" ? (
                    this.state.version.new !== this.state.version.current ? (
                      <Text
                        style={[
                          style.version,
                          global.fontSize14,
                          global.fontStyle
                        ]}
                      >
                        发现新版本
                      </Text>
                    ) : (
                      <Icon
                        style={[style.icon, global.fontSize14]}
                        name="right"
                      />
                    )
                  ) : (
                    <Icon
                      style={[style.icon, global.fontSize14]}
                      name="right"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </>
    );
  }
}
