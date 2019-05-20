import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import api from "@/services/api"
import { Icon, Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  BackHandler,
  Image,
  NativeEventSubscription,
  PixelRatio,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
const style = gStyle.common.LawAgreement
interface NavParams {
  isLogin: boolean
}
interface Props {
  navigation: NavigationScreenProp<State, NavParams>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  isLogin: boolean
}
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid,
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: userAction.UserInfo) => {
      dispatch(userAction.userLogin(preload))
    },
  }
}
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class InvitePatients extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<State, NavParams>
  }) => ({
    title: "法律申明与隐私政策",
    headerStyle: {
      backgroundColor: sColor.white,
      height: 50,
      elevation: 0,
      color: sColor.mainBlack,
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: sColor.colorEee,
    },
    headerTintColor: sColor.color333,
    headerTitleStyle: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      color: "#666",
      textAlign: "center",
    },
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params!.isLogin
            ? navigation.goBack()
            : navigation.navigate(pathMap.Register)
        }}>
        <Icon style={{ paddingLeft: 15, fontSize: 18, color: "#333" }} name="left" />
      </TouchableOpacity>
    ),
    headerRight: <Text />,
  })
  loginStatus?: NativeEventSubscription
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isLogin: false,
    }
  }
  async componentDidMount() {
    await this.init()
    this.props.navigation.setParams({
      isLogin: this.state.isLogin,
    })
    this.loginStatus = BackHandler.addEventListener("hardwareBackPress", this.addEventListenerBack)
  }
  componentWillUnmount() {
    if (this.loginStatus) {
      this.loginStatus.remove()
    }
  }
  addEventListenerBack = () => {
    this.props.navigation.state.params!.isLogin
      ? this.props.navigation.goBack()
      : this.props.navigation.navigate(pathMap.Register)
    return true
  }
  init = async () => {
    try {
      let isLogin = await api.isLogin()
      this.setState({
        hasLoad: true,
        isLogin,
      })
    } catch (err) {
      console.log(err)
    }
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    Promise.all([this.init(), new Promise(s => setTimeout(s, 500))])
      .then(_ => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        Toast.fail("刷新失败,错误信息: " + err.msg)
      })
  }

  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
        </View>
      )
    }

    return (
      <>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.article}>
            <View style={{ width: "100%" }}>
              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>提示条款&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您的信任对我们非常重要，一直以来，博一健康都致力于为每位用户提供更安全的互联网环境。我们深知个人信息安全的重要性，我们将按照法律法规要求，采取安全保护措施，保护您的个人信息安全可控。鉴此，博一健康（或简称“我们”）制定本《法律声明与隐私政策》（以下或简称“声明和政策”）并提醒您：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                本政策适用于博一健康的产品或服务。如关联公司（范围详见定义部分）的产品或服务中使用了博一健康提供的产品或服务（例如直接使用博一健康账户登录）但未设独立法律声明与隐私政策的，则本政策同样适用于该部分产品或服务。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                请您注意，本政策和声明不适用于以下情况：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）通过我们的服务而接入的第三方服务（包括任何第三方网站）收集的信息；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）通过在我们服务中进行广告服务的其他公司或机构所收集的信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                在使用博一健康的各项服务前，请您务必仔细阅读并透彻理解本《法律声明与隐私政策》，在确认充分理解并同意后方使用相关产品和服务。一旦您开始使用博一健康服务，将被视为对本声明和政策内容的接受和认可。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                如对本声明和政策内容有任何疑问、意见或建议，您可通过博一健康客服（电话：0523
                86057008）与我们联系。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>定义</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>博一健康</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                博一健康是指江苏博一健康管理有限公司运营实体。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>博一健康平台</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                指博一健康网站（域名：https://www.byhealth.net）及博一健康APP、微信公众号、小程序等网站和移动应用。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>博一健康服务提供者</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                指博一健康的网络及软件技术服务提供者，包括但不限于海东市平安正阳互联网中医医院有限公司、北京紫宸正阳科技有限公司等，以实际提供平台或服务的博一健康经营主体为准。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>关联公司</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                博一健康直接或间接控股的公司，参股或形成经营、协作的，具有关联关系的企业。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>法律声明</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>一、权利归属</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.1
                博一健康的Logo、“博一健康”等文字、图形及其组合，以及博一健康的其他标识、徽记、博一健康服务的名称等为博一健康及其关联公司在中国和其他国家的注册商标。未经博一健康书面授权，任何人不得以任何方式展示、使用或做其他处理（包括但不限于复制、传播、展示、镜像、上传、下载），也不得向他人表明您有权展示、使用或做其他处理。如有宣传、展示等任何使用需要，您必须取得博一健康服务提供者及/或其关联公司事先书面授权。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.2
                博一健康所有的产品、服务、技术与所有程序（以下或简称“技术服务”）的知识产权均归属于博一健康及/或其权利人所有。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.3
                除非博一健康另行声明，博一健康拥有在博一健康网站内发布文档等信息（包括但不限于文字、图形、图片、照片、音频、视频、图标、色彩、版面设计、电子文档）的所有权利（包括但不限于版权、商标权、专利权、商业秘密和其他所有相关权利）。未经博一健康许可，任何人不得擅自使用如上内容（包括但不限于通过程序或设备监视、复制、转播、展示、镜像、上传、下载博一健康相关网站或移动应用程序内的任何内容）。被授权浏览、复制、打印和传播属于博一健康相关网站或移动应用程序内信息内容的，该等内容都不得用于商业目的且所有信息内容及其任何部分的使用都必须包括此权利声明。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>二、责任限制</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.1
                博一健康用户在博一健康平台及其他应用上，自行上传、提供、发布相关信息，包括但不限于用户名称、公司名称、联系人及联络信息，相关图片、资讯等，该等信息均由用户自行提供，博一健康的用户须对其提供的任何信息依法承担全部责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.2博一健康平台上转载作品（包括网站内容）出于传递更多信息之目的，并不意味博一健康赞同其观点或证实其内容的真实性。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.3博一健康在此提示，您在使用博一健康服务期间应当遵守中华人民共和国的法律，不得危害网络安全，不得利用博一健康的服务从事他人侵犯名誉、隐私、知识产权和其他合法权益的活动。尽管有前述提示，博一健康不对您使用博一健康服务的用途和目的承担任何责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>三、知识产权保护</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                我们尊重知识产权，反对并打击侵犯知识产权的行为。任何组织或个人认为博一健康的网页（含https://www.byhealth.net网页内容以及客户端页面）内容（如转载文章、发布的信息等）可能侵犯其合法权益的，可以通过向博一健康的客服渠道提出书面权利通知，我们将在收到知识产权权利人合格通知后依法及时处理。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>隐私政策</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                博一健康（以下或称为“我们”）深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。我们致力于维持您对我们的信任，恪守《中华人民共和国网络安全法》《信息安全技术
                个人信息安全规范》（GB/T
                35273-2017）以及其他相关法律法规和技术规范中规定的原则，保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。同时，我们承诺将按业界成熟的安全标准，采取相应的安全保护措施来保护您的个人信息。请在使用我们的产品（或服务）前，仔细阅读并了解本隐私政策，我们将按照本政策收集、处理及披露您的信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                本政策将帮助您了解以下内容：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>一、定义</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                二、我们可能收集的信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                三、我们如何收集和使用您的个人信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                四、我们如何使用Cookie和同类技术
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                五、我们如何共享、转让、公开披露您的个人信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                六、用户业务数据和公开信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                七、我们如何保护您的个人信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                八、您如何管理您的个人信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                九、我们如何处理未成年人的个人信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                十、您的个人信息的储存
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                十一、本声明和政策如何更新
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                十二、如何联系我们
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>一、定义</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>1.1 个人信息</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。如姓名、出生日期、身份证件号码、个人生物识别信息、住址、通信通讯联系方式、通信记录和内容、账号密码、财产信息、征信信息、行踪轨迹、住宿信息、健康生理信息、交易信息等。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>1.2 个人敏感信息</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                包括身份证件号码、个人生物识别信息、银行账号、财产信息、行踪轨迹、交易信息、14岁以下（含）儿童的个人信息等。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>1.3 个人信息删除</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                指在实现日常业务功能所涉及的系统中去除个人信息的行为，使其保持不可被检索、访问的状态。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>1.4 业务数据</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                不同于个人信息，是指博一健康的用户利用博一健康的服务上传、下载、分发等通过博一健康的技术服务处理的数据。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                二、我们可能收集的信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                我们提供产品或服务时，可能会收集、储存和使用下列与个人（或可简称“您”）有关的信息。如果您不提供相关信息，可能无法注册成为我们的用户或无法享受我们提供的某些服务，或者无法达到相关服务拟达到的效果。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.1 与个人身份无关
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                当您使用博一健康的产品或服务时，我们可能收集和汇总诸如用户的来源途径、访问顺序、停留时间等信息，例如记录使用博一健康的产品或服务的每个用户的来源途径、浏览器软件等。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.2 与个人身份有关
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                当您使用博一健康的产品或服务时，我们可能收集和汇总或要求您提供有关个人身份的信息，例如：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）个人身份证明（包括身份证、社保卡、医师资格证、专业技术资格证/职称证、医师执业证等）；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）生日、籍贯、性别、、年龄、兴趣爱好、个人电话号码、住址、工作信息、头像；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）网络身份标识信息（包括系统账号、IP地址、电子邮箱地址及与前述有关的密码、口令、口令保护答案、用户个人数字证书等）；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）个人健康生理信息（个人因生病医治等产生的相关记录，如病症、住院志、医嘱单、检验报告、手术及麻醉记录、护理记录、生育信息、既往病史、过敏史、诊治情况、家族病史、现病史等，以及与个人身体健康状况产生的相关信息，如体重、身高肺活量、舌照、面照等）；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）个人财产信息（银行账号、鉴别信息、优惠券、兑换码等）；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）通讯信息（短信、图片、音视频记录及内容）；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7）联系人信息（通讯录）；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8）个人上网记录和日志信息（包括网站浏览记录、软件使用记录、点击记录、操作日志等）；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                9）设备信息（包括设备型号、设备MAC地址、操作系统类型、设备设置）；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                10）软件列表唯一设备识别码（如IMEI/androidID/IDFA/OPENUDID/GUID、SIM卡IMSI信息等在内的描述个人常用设备基本情况的信息）；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                11）个人位置信息（包括精准定位信息、经纬度等）；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                12）其他博一健康基于为您提供服务需要而收集或汇总的您的信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                三、我们如何收集和使用您的个人信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                我们会出于本声明和政策所述的以下目的，收集、储存和使用您的个人信息：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.1 帮助您成为我们的用户
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>注册账号</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您需要注册一个账户，以便于我们为您提供服务。当您注册时，您至少需要向我们提供手机号码、密码，我们将通过发送短信验证码的方式验证您的身份是否有效。如果您仅需使用浏览、搜索等基本服务，您不需要注册账户及提供上述信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您的登录名包括但不仅限于您的手机号、邮箱账号、用户名，您可以完善昵称、密码、头像、联系地址、出生日期等相关信息，补充这些“账户信息”将有助于我们为您提供更具个性化的服务。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您需要向我们提供真实姓名和有效身份证件（包括但不限于身份证、医保卡、护照）的号码和复印件，以便于我们进行实名认证。如果您不提供这些信息，可能会影响您对博一健康部分核心业务功能的正常使用，如找名医等，但不会影响您进行基本的浏览、搜索。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                如成为我们平台的注册医生，您需要提供包括但不仅限于手机号码、邮箱账号、用户名，并创建密码。在注册过程中，如您提供以下额外信息，将有助于我们对您的医疗健康服务资格进行认证：您的真实姓名、性别、身份证正反面照片、联系信息（QQ/微信/邮箱地址）、医院电话、所属科室、擅长科目、《执业医师资格证》、《医师执业证书》、《职称证》、个人证件照（或个人清晰头像）。如果您未提供这些信息，将会影响到您在博一健康进行的互联网医疗健康服务活动。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                在您主动注销账号时，我们将根据相关法律法规的要求尽快使其匿名或删除您的个人信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.2 为您展示和推送医疗相关信息和服务
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                为实现博一健康的业务功能，我们可能需要向您收集个人信息。以下将详细列出博一健康的业务功能及为实现该功能所需收集的个人信息，若您拒绝收集，则无法使用该服务。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）搜索、浏览功能。您可浏览的内容包括博一健康中医百科、医生信息、门诊信息和用户评论等。为了优化给您提供的产品和服务，博一健康有可能收集您的浏览器性质、操作系统种类、给您提供接入服务的ISP域名等，以优化在您计算机或手机屏幕上显示的页面；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）软件下载、升级服务。为了给您提供软件升级服务，需要收集您PC端、移动端所安装软件的相关信息，例如：软件名称及版本等；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）信息发布功能。您注册成为博一健康用户后，可在博一健康平台上进行健康咨询，并对医生的回答作出评论、赞同、感谢等。在此过程中，我们可能会收集您的设备信息、浏览器类型、日志信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）网站管理和服务改进。为改善我们的产品或服务、向您提供个性化的互联网医疗健康服务，我们会根据您的浏览及搜索记录、设备信息、位置信息、历史问诊、个人生理健康信息、关注医生等，提取您的浏览、搜索偏好、行为习惯、位置信息等特征，基于特征标签进行间接人群画像并展示、推送信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                如果您不想接受我们给您发送的商业广告，您可随时通过相应产品退订功能取消。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.3 向您提供互联网医疗健康服务相关服务或商品
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.3.1 您向我们提供的信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                为便于您进行在线复诊，您需提供真实姓名、年龄、性别、手机号、实体医疗机构病历、问诊单、舌面照、社保卡、就诊卡等信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                为便于向您交付产品或服务，您需提供收货人姓名、收货地址、邮政编码、收货人联系电话。我们的产品是由第三方合作药企向您交付，我们会在征得您同意后将上述信息共享给第三方。如果您拒绝提供此类信息，我们将无法完成相关交付服务。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                为更好、更安全地向您提供互联网医疗健康服务服务，更加精准、快速地向您推荐问诊医生，我们需要您在咨询问诊时提供个人健康生理信息，例如：病症、住院志、医嘱单、检验报告、手术及麻醉记录、护理记录、用药记录、药物食物过敏信息、生育信息、以往病史、诊治情况、家族病史、现病史、传染病史等，以及与个人身体健康状况产生的相关信息，及体重、身高、肺活量等。如您不提供上述信息，将会影响您使用咨询问诊等功能，但不影响您使用博一健康产品或服务的基本浏览、搜索功能。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                为更好地支付医疗健康服务费、药费、诊后病程管理服务费等费用以便完成交易，您需要选择付款方式并提供第三方支付账号(例如支付宝帐号、微信账号、Apple
                Pay帐号或其他形式的银行卡信息)，以便我们了解您的支付状态。如您不提供上述信息，将无法正常使用健康账户相关的支付等功能，但不影响您使用博一健康产品或服务的基本浏览、搜索功能。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                为便于您使用医保卡进行医疗健康服务费用药费、诊后病程管理服务费等费用的支付，您需要提供医保卡号、医保卡绑定的手机号码以及医保支付口令。如您不提供上述信息将无法正常使用医保支付功能。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您可以通过博一健康为其他人进行咨询或购买药品，您需要提供该实际用户的前述个人信息。向博一健康提供该实际用户的前述个人信息之前，您需确保您已经取得其授权同意。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.3.2 我们在您使用服务过程中收集的信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                为向您提供更契合您需求的页面展示和搜索结果、了解产品适配性、识别账号异常状态，我们会收集关于您使用的服务以及使用方式的信息并将这些信息进行关联，这些信息包括：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                设备信息：我们会根据您在软件安装及使用中授予的具体权限，接收并记录您所使用的设备相关信息（例如设备型号、操作系统版本、设备设置、唯一设备标识符等软硬件特征信息）、设备所在位置相关信息（例如IP地址、GPS位置以及能够提供相关信息的Wi-Fi接入点、蓝牙和基站等传感器信息）。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                日志信息：当您使用我们的网站或客户端提供的产品或服务时，我们会自动收集您对我们服务的详细使用情况，作为有关网络日志保存。例如您的搜索查询内容、IP地址、浏览器的类型、电信运营商、使用的语言、访问日期和时间及您访问的网页记录等。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                请注意，单独的设备信息、日志信息等是无法识别特定自然人身份的信息。如果我们将这类非个人信息与其他信息结合用于识别特定自然人身份，或者将其与个人信息结合使用，则在结合使用期间，这类非个人信息将被视为个人信息，除取得您授权或法律法规另有规定外，我们会将该类个人信息做匿名化、去标识化处理。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                为展示您的生理健康信息，我们会收集您在使用我们服务过程中产生的问诊咨询详情（包括但不限于图片、文字、视频、语音）、检查检验、用药处方、医生诊断结果等用于向您展示及便于您对信息进行管理。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                当您与我们联系时，我们可能会保存您的通信/通话记录和内容或您留下的联系方式等信息，以便与您联系或帮助您解决问题，或记录相关问题的处理方案及结果。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.3.3 我们通过间接获得方式收集到的您的个人信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                我们可能从第三方获取您授权共享的账户信息（头像、昵称、联系方式），并在您同意声明和隐私后将您的第三方账户与您的账户绑定，使您可以通过第三方账户直接登录并使用我们的产品与/或服务。我们会将依据与第三方的约定、对个人信息来源的合法性进行确认后，在符合相关法律和法规规定的前提下，使用您的这些个人信息。为确认交易状态及为您提供售后与争议解决服务，我们会通过您基于交易所选择的交易对象、支付机构、物流公司等收集与交易进度相关的您的交易、支付、物流信息，或将您的交易信息共享给上述服务提供者。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您可通过同一账号在我们提供的链接入口使用我们关联公司提供的产品或服务，为便于我们基于关联账号共同向您提供一站式服务并便于您统一进行管理，我们在博一健康平台集中展示您的信息或推荐您感兴趣的信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                当您通过我们产品或服务使用上述服务时，您授权我们根据实际业务及合作需要从我们关联公司处接收、汇总、分析我们确认其来源合法或您授权同意其向我们提供的您的个人信息或交易信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                如您拒绝提供上述信息或拒绝授权，可能无法使用我们关联公司的相应产品或服务，或者无法展示相关信息，但不影响使用博一健康的咨询问诊等核心服务。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.4 为您提供安全保障
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                请注意，为确保账户身份真实性、向您提供更好的安全保障，您可以向我们提供身份证、社保卡等身份信息，绑定支付账户等完成实名认证。如您拒绝提供上述信息，可能无法问诊特定专家，继续可能存在风险的操作等，但不会影响您使用浏览、搜索等服务。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                为提高您使用我们及我们关联公司、合作伙伴提供服务的安全性，保护您或其他用户或公众的人身财产安全免遭侵害，更好地预防钓鱼网站、欺诈、网络漏洞、计算机病毒、网络攻击、网络侵入等安全风险，更准确地识别违反法律法规或博一健康相关协议的情况，我们可能使用或整合您的账户信息、交易信息、设备信息、有关网络日志以及我们关联公司、合作伙伴取得您授权或依据法律共享的信息，来综合判断您账户及交易风险、进行身份验证、检测及防范安全事件，并依法采取必要的记录、审计、分析、处置措施。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>3.5 其他用途</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                我们将信息用于本声明和政策未载明的其他用途，或者将基于特定目的收集而来的信息用于其他目的时，会事先征求您的同意。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.6 征得授权同意的例外
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                根据相关法律法规规定，以下情形中收集您的个人信息无需征得您的授权同意：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）与国家安全、国防安全有关的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）与公共安全、公共卫生、重大公共利益有关的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）与犯罪侦查、起诉、审判和判决执行等有关的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到您本人同意的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）所收集的个人信息是您自行向社会公众公开的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7）根据您的要求签订合同所必需的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8）用于维护所提供的产品或服务的安全稳定运行所必需的，例如发现、处置产品或服务的故障；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                9）为合法的新闻报道所必需的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                10）学术研究机构基于公共利益开展统计或学术研究所必要，且对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                11）法律法规规定的其他情形。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                如我们停止运营博一健康的产品或服务，我们将及时停止继续收集您个人信息的活动，将停止运营的通知以逐一送达或公告的形式通知您，对所持有的个人信息进行删除或匿名化处理。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>3.7 设备权限调用</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                为向您提供便捷、优质的服务，我们可能会调用您设备的一些权限，以下是我们可能调用的设备权限列表及对应的使用目的说明，您有权随时选择关闭下列权限的授权，但可能会影响您正常使用我们产品或服务的部分或全部功能。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>1）位置</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您需要授权我们使用位置权限，以便于我们基于位置向您展示、推送药店、医院等信息。您在首次打开移动客户端时会看到弹窗提醒，询问您是否授权。如您拒绝授权，可能无法正常使用基于地理位置的信息展示与推送功能。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>2）通讯录</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                在视话问诊时为保护医患双方个人信息安全，我们提供免费中转电话服务。您需要授权我们使用通讯录权限，以便于我们对此电话进行标识。您在使用相应功能时会看到弹窗提醒，询问您是否授权。如您拒绝授权，可能无法正常在视话问诊中使用电话进行沟通。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>3）相机</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您需要授权我们使用相机权限，以便于使用我们的核心业务功能，如在咨询问诊中发送图片或视频通话。您在使用相应功能时会看到弹窗提醒，询问您是否授权。如您拒绝授权，可能无法正常在问诊中进行视频通话。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>4）通知</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您需要授权我们使用通知权限，以便于使用所有基于此权限实现的功能，如支付结果、问诊状态等各类消息提醒。您在首次打开移动客户端时会看到弹窗提醒，询问您是否授权。如您拒绝授权，可能无法正常获取各类消息提醒。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>5）无线数据</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您需要授权我们使用无线数据权限，以便于我们的移动客户端可以连接网络，向您提供服务。您在首次打开移动客户端时会看到弹窗提醒，询问您是否授权。如您拒绝授权，可能无法正常使用使用移动客户端。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>6）WLAN</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您需要授权我们使用WLAN权限，以便于我们的移动客户端可以连接网络，向您提供服务。您在首次打开移动客户端时会看到弹窗提醒，询问您是否授权。如您拒绝授权，可能无法正常使用使用移动客户端。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>7）存储</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您需要授权我们使用存储权限，以便于我们的移动客户端可以写入、存储用户信息和日志等。您在首次打开移动客户端时会看到弹窗提醒，询问您是否授权。如您拒绝授权，可能无法正常使用使用移动客户端。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>8）麦克风</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您需要授权我们使用麦克风权限，以便于使用我们的核心业务功能，如在咨询问诊中发送语音消息或视频通话。您在使用相应功能时会看到弹窗提醒，询问您是否授权。如您拒绝授权，可能无法正常在问诊中进行视频通话。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                四、我们如何使用Cookie和同类技术
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>4.1 Cookie</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                为确保网站正常运转、为您获得更轻松的访问体验、向您推荐您可能感兴趣的内容，我们会在您的计算机或移动设备上存储名为Cookie的小数据文件。Cookie通常包含标识符、站点名称以及一些号码和字符。借助于Cookie，网站能够记住您的选择，提供个性化增强服务等。您可根据自己的偏好管理或删除Cookie。有关详情，请参见AboutCookies.org。您可以清除计算机上保存的所有Cookie，大部分网络浏览器都设有阻止Cookie的功能。但如果您这么做，则需要在每一次访问博一健康平台时更改用户设置。如需详细了解如何更改浏览器设置，请访问您使用的浏览器的相关设置页面。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.2 网站信标和像素标签
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                除Cookie外，我们还会在网站上使用网站信标和像素标签等其他同类技术。例如，我们向您发送的电子邮件可能含有链接至我们网站内容的地址链接，如果您点击该链接，我们则会跟踪此次点击，帮助我们了解您的产品或服务偏好以便于我们主动改善客户服务体验。网站信标通常是一种嵌入到网站或电子邮件中的透明图像。借助于电子邮件中的像素标签，我们能够获知电子邮件是否被打开。如果您不希望自己的活动以这种方式被追踪，则可以随时从我们的寄信名单中退订。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>
                  五、我们如何共享、转让、公开披露您的个人信息
                </Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>5.1 共享</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                我们不会与博一健康服务提供者以外的任何公司、组织和个人分享您的个人信息，但以下情况除外：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.1.1
                在获取明确同意的情况下共享：获得您的明确同意后，我们会与其他方共享您的个人信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.1.2
                我们可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享您的个人信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.1.3
                与关联公司间共享：为便于我们基于关联账号共同向您提供服务，推荐您可能感兴趣的信息或保护博一健康关联公司或其他用户或公众的人身财产安全免遭侵害，您的个人信息可能会与我们的关联公司共享。我们只会共享必要的个人信息（如为便于您通过同一账号使用我们关联公司产品或服务，我们会向关联公司共享您必要的账户信息），如果我们共享您的个人敏感信息或关联公司改变个人信息的使用及处理目的，将再次征求您的授权同意。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.1.4
                与授权合作伙伴共享：仅为实现本声明和隐私中声明的目的，我们的某些服务将由授权合作伙伴提供。我们可能会与合作伙伴共享您的某些个人信息，以提供更好的客户服务和用户体验。例如，当您购买我们的产品时，我们必须与物流服务提供商共享您的个人信息才能安排送货，或者安排合作伙伴提供服务。我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息，并且只会共享提供服务所必要的个人信息。我们的合作伙伴无权将共享的个人信息用于任何其他用途。如果您拒绝我们的合作伙伴在提供服务时收集为提供服务所必须的个人信息，将可能导致您无法在博一健康中使用该第三方服务。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                目前，我们的授权合作伙伴包括以下类型：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）广告、分析服务类的授权合作伙伴。除非得到您的许可，否则我们不会将您的个人身份信息（指可以识别您身份的信息，例如姓名或电子邮箱，通过这些信息可以联系到您或识别您的身份）与提供广告、分析服务的合作伙伴分享。对于广告合作伙伴，我们会向这些合作伙伴提供有关其广告覆盖面和有效性的信息，而不会提供您的个人身份信息，或者我们将这些信息进行匿名化处理，以便它不会识别您；对于分析数据的伙伴，为了更好的分析博一健康用户的使用情况，我们可能向其提供博一健康用户的数量、地区分布、活跃情况等数据，但我们仅会向这些合作伙伴提供不能识别个人身份的统计信息。例如，只有在广告主同意遵守我们的广告发布准则后，我们才可能会告诉广告主他们广告的效果如何，或者有多少人看了他们广告或在看到广告后安装了应用，或者向这些合作伙伴提供不能识别个人身份的人口统计信息（例如“位于北京的25岁男性，喜欢软件开发”），帮助他们了解其受众或顾客。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）供应商、服务提供商和其他合作伙伴。我们将信息发送给支持我们业务的供应商、服务提供商和其他合作伙伴，这些支持包括提供技术基础设施服务、分析我们服务的使用方式、衡量广告和服务的有效性、提供客户服务、支付便利或进行学术研究和调查。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                对我们与之共享个人信息的公司、组织和个人，我们会与其签署严格的保密协定，要求他们按照我们的说明、声明和隐私以及其他任何相关的保密和安全措施来处理个人信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>5.2 转让</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）在获取明确同意的情况下转让：获得您的明确同意后，我们会向其他方转让您的个人信息；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）在博一健康服务提供者发生合并、收购或破产清算情形，或其他涉及合并、收购或破产清算情形时，如涉及到个人信息转让，我们会在要求新的持有您个人信息的公司、组织继续受声明和隐私的约束，否则我们将要求该公司、组织重新向您征求授权同意。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>5.3 公开披露</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                我们不会公开披露您的个人信息，但以下情况除外：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）获得您明确同意或基于您的主动选择，我们可能会公开披露您的个人信息；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）如果我们确定您出现违反法律法规或严重违反博一健康相关协议规则的情况，或为保护博一健康及其关联公司用户或公众的人身财产安全免遭侵害，我们可能依据法律法规或博一健康相关协议规则征得您同意的情况下披露关于您的个人信息，包括相关违规行为以及博一健康已对您采取的措施。例如，若您严重违反用户协议，我们可能会公开披露或与合作方共享您的身份信息、联系方式与处罚情况。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）基于法律、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会向有权机关披露您的个人信息。但我们保证，在上述情况发生时，我们会要求披露请求方必须出具与之相应的有效法律文件，并对被披露的信息采取符合法律和业界标准的安全防护措施。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.4 共享、转让、公开披露个人信息时事先征得授权同意的例外
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                以下情形中，共享、转让、公开披露您的个人信息无需事先征得您的授权同意：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）与国家安全、国防安全有关的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）与公共安全、公共卫生、重大公共利益有关的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）与犯罪侦查、起诉、审判和判决执行等有关的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）您自行向社会公众公开的个人信息；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                根据法律规定，共享、转让经去标识化处理的个人信息，且确保数据接收方无法复原并重新识别个人信息主体的，不属于个人信息的对外共享、转让及公开披露行为，对此类数据的保存及处理将无需另行向您通知并征得您的同意。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>六、用户业务数据和公开信息</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                不同于您的个人信息，对于用户业务数据和公开信息，博一健康将按如下方式处理：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>6.1 用户业务数据</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）您通过博一健康平台提供的服务，加工、存储、上传、下载、分发以及通过其他方式处理的数据，均为您的用户业务数据，您完全拥有您的用户业务数据。博一健康作为服务提供商，我们只会严格执行您的指示处理您的业务数据，除按与您协商一致或执行明确的法律法规要求外，不对您的业务数据进行任何非授权的使用或披露。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）您应对您的用户业务数据来源及内容负责，博一健康提示您谨慎判断数据来源及内容的合法性。因您的用户业务数据内容违反法律法规、部门规章或国家政策而造成的全部结果及责任均由您自行承担。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）根据您与博一健康协商一致，博一健康在您选定的数据中心存储用户业务数据。博一健康恪守对用户的安全承诺，根据适用的法律保护用户存储在博一健康数据中心的数据。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>6.2 公开信息</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）公开信息是指您公开分享的任何信息，任何人都可以在使用和未使用博一健康服务期间查看或访问这些信息。例如您在医生详情发布的评论信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）为使用博一健康的产品或服务，可能存在您必须公开分享的信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）在使用博一健康平台进行交易时，您不可避免的要向交易对方或潜在的交易对方披露自己的个人信息，如联络方式或者邮政地址。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。您也可以通过我们的服务建立联系和相互分享。当您通过我们的服务创建交流、交易或分享时，您可以自主选择沟通、交易或分享的对象，作为能够看到您的联络方式、交流信息或分享内容等相关信息的第三方。如您发现自己的个人信息泄漏，尤其是您的账户或密码发生泄露，请您立即联络客服，以便博一健康采取相应措施。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>七、我们如何保护您的个人信息</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7.1
                我们已采取符合业界标准、合理可行的安全防护措施保护您提供的个人信息安全，防止个人信息遭到未经授权访问、公开披露、使用、修改、损坏或丢失。例如，在您的浏览器与服务器之间交换数据（如支付信息）时受https加密保护；我们同时对博一健康相关网站提供https安全浏览方式；我们会使用加密技术和防火墙提高个人信息的安全性；我们会使用受信赖的保护机制防止个人信息遭到恶意攻击；我们会部署访问控制机制，数据库仅内网访问并尽力确保只有授权人员才可访问个人信息；以及我们会举办安全和隐私保护培训课程，加强员工对于保护个人信息重要性的认识。但请您理解，由于技术的限制以及可能存在的各种恶意手段，在互联网行业，即便竭尽所能加强安全措施，也不可能始终保证信息百分之百的安全。您需要了解，您接入我们的服务所用的系统和通讯网络，有可能因我们可控范围外的因素而出现问题。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7.2
                我们有行业先进的以数据为核心，围绕数据生命周期进行的数据安全管理体系，从组织建设、制度设计、人员管理、产品技术等方面多维度提升整个系统的安全性。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7.3
                我们会采取合理可行的措施，尽力避免收集无关的个人信息。我们只会在达成本声明和隐私所述目的所需的期限内保留您的个人信息，除非需要延长保留期或受到法律的允许。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7.4
                互联网并非绝对安全的环境，我们强烈建议您不要使用非博一健康推荐的通信方式发送个人信息。您可以通过我们的服务建立联系和相互分享。当您通过我们的服务创建交流、交易或分享时，您可以自主选择沟通、交易或分享的对象，作为能够看到您的交易内容、联络方式、交流信息或分享内容等相关信息的第三方。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                在使用博一健康平台进行网上问诊时，您不可避免地要向医务人员或客服披露自己的个人信息，如联系方式或身份信息。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。如您发现自己的个人信息尤其是您的账户或密码发生泄露，请您立即联络客服，以便我们根据您的申请采取相应措施。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                请注意，您在使用我们服务时自愿共享甚至公开分享的信息，可能会涉及您或他人的个人信息甚至个人敏感信息，如您在医生评论时选择上传包含个人信息的图片。请您更加谨慎地考虑，是否在使用我们的服务时共享甚至公开分享相关信息。若您需要删除您的个人信息，您可以联系博一健康客服，我们将帮助您删除您指定的内容。例如，您对医生的评论涉及个人敏感信息，在您需要删除之时，您可以向客服发出通知，我们将会在后台删除您发布的评论。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                请使用复杂密码，协助我们保证您的账号安全。我们将尽力保障您发送给我们的任何信息的安全性。如果我们的物理、技术或管理防护设施遭到破坏，导致信息被非授权访问、公开披露、篡改或毁坏，导致您的合法权益受损，我们将承担相应的法律责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7.5
                我们将不定期更新并公开安全风险、个人信息安全影响评估报告等有关内容，您可通过博一健康平台公告方式获得。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7.6
                在不幸发生个人信息安全事件后，我们将按照法律法规的要求向您告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。事件相关情况我们将以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7.7 我们还将按照监管部门要求，上报个人信息安全事件的处置情况。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>八、您如何管理您的个人信息</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您可以通过以下方式访问及管理您的个人信息：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8.1 访问您的个人信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您有权访问您的个人信息，法律法规规定的例外情况除外。您可以通过以下方式自行访问您的个人信息：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                账户信息——如果您希望访问或编辑您的账户中的个人基本资料信息和实名认证信息、更改您的密码或添加绑定邮箱等，您可以登录账号通过“我的”，“设置”执行此类操作。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                健康档案信息：您可以在博一健康平台中查阅或清除您的问诊咨询记录、预约挂号记录等。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                银行卡管理：您可以登陆账号，通过“账户”进行银行卡的解绑、绑定。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                问诊、购药记录：您可以登陆账号，通过“我的病历”查看了解历史记录。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                如果您无法通过上述路径访问该等个人信息，您可以随时通过客服中心与我们取得联系。我们将在30个工作日内回复您的访问请求。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                对于您在使用我们的产品或服务过程中产生的其他个人信息，我们将根据本条“8.7响应您的上述请求”中的相关安排向您提供。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8.2 更正或补充您的个人信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                当您发现我们处理的关于您的个人信息有错误时，您有权要求我们做出更正或补充。您可以通过“8.1访问您的个人信息”中列明的方式提出更正或补充申请。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8.3 删除您的个人信息
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您可以通过“8.1访问您的个人信息”中列明的方式删除您的部分个人信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                在以下情形中，您可以向我们提出删除个人信息的请求：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）如果我们处理个人信息的行为违反法律法规；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）如果我们收集、使用您的个人信息，却未征得您的明确同意；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）如果我们处理个人信息的行为严重违反了与您的约定；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）如果您不再使用我们的产品或服务，或您主动注销了账号；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）如果我们永久不再为您提供产品或服务。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                若我们决定响应您的删除请求，我们还将同时尽可能通知从我们处获得您的个人信息的主体，要求其及时删除，除非法律法规另有规定，或这些主体获得您的独立授权。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                当您从我们的服务中删除信息后，我们可能不会立即备份系统中删除相应的信息，但会在备份更新时删除这些信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8.4 改变您授权同意的范围
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                您可以通过删除信息、关闭设备功能、在博一健康平台中进行隐私设置等方式改变您授权我们继续收集个人信息的范围或撤回您的授权。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                请您理解，每个业务功能需要一些基本的个人信息才能得以完成（见本隐私政策“我们如何收集和使用您的信息”）。当您收回同意后，我们将不再处理相应的个人信息。但您收回同意的决定，不会影响此前基于您的授权而开展的个人信息处理。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8.5 个人信息主体注销账户
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                在符合博一健康单项服务的服务协议约定条件及国家相关法律法规规定的情况下，您的该项博一健康服务帐号可能被注销或删除。当帐号注销或被删除后，与该帐号相关的、该单项服务项下的全部服务资料和数据将依照单项服务的服务协议约定删除或匿名化处理。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8.6 约束信息系统自动决策
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                在某些业务功能中，我们可能仅依据信息系统、算法等在内的非人工自动决策机制做出决定。如果这些决定显著影响您的合法权益，您有权要求我们做出解释，我们也将在不侵害博一健康商业秘密或其他用户权益、社会公共利益的前提下提供申诉方法。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8.7 响应您的上述请求
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                为保障安全，您可能需要提供书面请求，或以其他方式证明您的身份。我们可能会先要求您验证自己的身份，然后再处理您的请求。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                我们将在5-7个工作日内做出答复。如您不满意，还可以通过客服中心发起投诉。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                对于您合理的请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，我们将视情收取一定成本费用。对于那些无端重复、需要过多技术手段（例如，需要开发新系统或从根本上改变现行惯例）、给他人合法权益带来风险或者非常不切实际的请求，我们可能会予以拒绝。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                在以下情形中，按照法律法规要求，我们将无法响应您的请求：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）与国家安全、国防安全有关的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）与公共安全、公共卫生、重大公共利益有关的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）与犯罪侦查、起诉、审判和执行判决等有关的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）有充分证据表明个人信息主体存在主观恶意或滥用权利的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）响应您的请求将导致您或其他个人、组织的合法权益受到严重损害的；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）涉及商业秘密的。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>九、我们如何处理未成年人的个人信息</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                如果没有父母或监护人的同意，未成年人不得创建自己的用户账户。如您为未成年人的，建议您请您的父母或监护人仔细阅读本隐私政策，并在征得您的父母或监护人同意的前提下使用我们的服务或向我们提供信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                对于经父母或监护人同意使用我们的产品或服务而收集未成年人个人信息的情况，我们只会在法律法规允许、父母或监护人明确同意或者保护未成年人所必要的情况下使用、共享、转让或披露此信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                根据当地监管部门的相关规定，博一健康仅对满足特定年龄要求的用户提供互联网医疗健康服务。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>十、您的个人信息的储存</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                10.1&nbsp;我们在中华人民共和国境内运营中收集和产生的个人信息，存储在中国境内，以下情形除外：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）法律法规有明确规定；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）获得您的明确授权；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）您通过互联网进行海外就医预约等个人主动行为。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                针对以上情形，我们会确保依据本隐私权政策对您的个人信息提供足够的保护，我们会单独向您以弹窗或邮件的方式告知您数据出境的目的、接收方等，并征得您的授权同意，我们会确保数据接收方有充足的数据保护能力来保护您的个人信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                10.2&nbsp;我们承诺您个人信息的存储时间始终处于合理必要期限内。在仅浏览功能下所收集的个人信息如浏览记录、IP
                信息，我们的存储期限不会超过一个月。对于超出期限的个人信息，我们会立即删除或做匿名化处理。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                10.3&nbsp;如我们因经营不善或其他原因出现停止运营的情况，我们会立即停止对您个人信息的收集，删除已收集的个人信息。我们会将此情况在网站上进行公告或以站内信、邮件等其他合理方式逐一传达到各个用户。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>十一、本声明和政策如何更新</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                我们的隐私政策可能变更。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                未经您明确同意，我们不会削减您按照声明和隐私所应享有的权利。我们会在本页面上发布对本声明和隐私所做的任何变更。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                对于重大变更，我们还会提供更为显著的通知（包括我们会通过网站公示的方式进行通知甚至向您提供弹窗提示）。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                本声明和隐私所指的重大变更包括但不限于：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）我们的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息类型、个人信息的使用方式等；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）我们在所有权结构、组织架构等方面发生重大变化。如业务调整、破产并购等引起的所有者变更等；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）个人信息共享、转让或公开披露的主要对象发生变化；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）您参与个人信息处理方面的权利及其行使方式发生重大变化；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化时；
              </Text>
              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）个人信息安全影响评估报告表明存在高风险时。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                我们还会将本声明和隐私的旧版本存档，供您查阅。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>十二、如何联系我们</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                以下情况，您可以通过在线客服与我们联系，一般情况下我们将在30个工作日内回复您的请求：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）如对本声明和隐私内容有任何疑问、意见或建议；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）如发现个人信息可能被泄露；
              </Text>
              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                如果您对我们的回复不满意，特别是您认为我们的个人信息处理行为损害了您的合法权益，您还可以通过向上海市平安区有管辖权的法院提起诉讼来寻求解决方案。
              </Text>
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
}
