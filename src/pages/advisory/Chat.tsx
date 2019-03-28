import React, { Component } from "react";
import { AppState } from "@/redux/stores/store";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as userAction from "@/redux/actions/user";
import { Text, View, PixelRatio } from "react-native";
import { Toast } from "@ant-design/react-native";
import gStyle from "@utils/style";
import gImg from "@utils/img";
import sColor from "@styles/color";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import { NavigationScreenProp } from "react-navigation";
const style = gStyle.advisory.advisoryChat;
const globalStyle = gStyle.global;
interface Props {
  navigation: NavigationScreenProp<State>;
}
interface messageItem {
  _id: number;
  text: string;
  createdAt: any;
  user: {
    _id: number;
    name: string;
    avatar: string;
  };
}
interface State {
  hasLoad: boolean;
  refreshing: boolean;
  messages: messageItem[];
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
  static navigationOptions = ({ navigation }: { navigation: any }) => ({
    title: navigation.state.params.title,
    headerStyle: {
      backgroundColor: sColor.white,
      height: 45,
      elevation: 0,
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
    headerRight: <Text />
  });
  constructor(props: any) {
    super(props);
    this.state = this.getInitState();
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      messages: []
    };
  };
  async componentDidMount() {
    await this.init();
  }
  init = async () => {
    let id = this.props.navigation.getParam("id");
    let messages = [
      {
        _id: 1,
        text: "您好, 有什么问题我能帮你的吗?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "哎呀",
          avatar: "https://placeimg.com/140/140/any"
        }
      }
    ];
    this.setState({
      hasLoad: true,
      messages
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
  renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View style={{ marginRight: 10 }}>
          <Text
            style={{
              height: 45,
              lineHeight: 45,
              fontSize: 15,
              color: "#0055ec"
            }}
          >
            发送
          </Text>
        </View>
      </Send>
    );
  };
  //气泡
  renderBubble(props: any) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            //对方的气泡
            backgroundColor: "rgb(255,241,192)"
          },
          right: {
            //我方的气泡
            backgroundColor: "#ff2600"
          }
        }}
      />
    );
  }
  sendMsg = async (messages = []) => {
    await new Promise(s =>
      this.setState(
        {
          messages: GiftedChat.append(this.state.messages, messages)
        },
        s
      )
    );
    console.log(this.state.messages);
    try {
      // juiceApi.subChatMessage({
      //   sendToUid: this.state.uid,
      //   messages: this.state.messages,
      // })
    } catch (err) {
      console.log(err);
    }
  };
  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <Text
            style={[
              style.loadingTitle,
              globalStyle.fontSize14,
              globalStyle.fontStyle
            ]}
          >
            加载中...
          </Text>
        </View>
      );
    }
    return (
      <>
        <GiftedChat
          messages={this.state.messages}
          renderAvatarOnTop={true}
          renderSend={this.renderSend}
          renderBubble={this.renderBubble}
          placeholder="请输入"
          dateFormat="YYYY-MM-DD"
          showUserAvatar={true}
          // bottomOffset={20}
          timeFormat="hh:mm"
          onSend={(messages: any) => this.sendMsg(messages)}
          user={{
            _id: 22,
            name: "哎呀",
            avatar: gImg.common.defaultAvatar
          }}
        />
      </>
    );
  }
}
