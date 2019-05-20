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
const style = gStyle.common.RegisterAgreement
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
    title: "医生注册协议",
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
                <Text style={{ fontWeight: "600" }}>注册协议&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                本协议是您（也称“医师”）与博一健康平台及相关服务（包括但不限于博一健康医生版 APP
                客户端、微信公众号、www.byhealth.net&nbsp;等移动端应用及网站，以博一健康不时更新、确认的域名、移动端应用为准，以下简称“本平台”）的经营者共同就使用博一健康软件、网站、服务等相关事宜所订立的协议，本协议具有合同效力。博一健康平台及相关服务的经营者是指法律认可的经营博一健康平台及相关服务的提供主体，包括但不限于海东市平安正阳互联网中医医院有限公司、北京紫宸正阳科技有限公司等，以实际提供平台或服务的博一健康经营主体为准。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                如注册医疗机构为与平安正阳互联网中医医院签署了《互联网会诊合作协议》，则此协议不生效，请参考《医生注册协议（会诊本地医师版）》。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>重要提示</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.在使用博一健康提供的软件、网站、服务（统称为
                “博一健康产品或服务”）之前，请您务必认真阅读并充分理解博一健康《医生注册协议》与《法律声明与隐私政策》，特别是关于特别提示、隐私保护、接收邮件及消息、担保与保证、免责声明及责任限制、争议解决等条款，该等条款可能以粗体、斜体、下划线方式进行显著标注，请您注意重点阅读。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.如果您对本协议有疑问，请您联系博一健康客服（电话：0523
                86057008），博一健康将向您解释本协议内容。注册并使用博一健康产品或服务代表您理解并同意本协议及相关协议，同意与博一健康平台及相关服务的经营者签署服务协议，并进行多点执业注册备案。服务期间若您不能胜任或出现违法行为及重大医疗事故等情况时，博一健康有权单方面解除本协议。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.博一健康有权对本协议进行修订，并将在博一健康产品或服务和及网站上公布修订后的协议。您理解并同意，修订后的协议具有溯及力，如果您在本协议修订版本公布后继续使用博一健康产品或服务的，即视为您同意修订后的协议。当您与博一健康发生争议时，应以最新的服务协议为准。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>定义</Text>&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.服务：指由博一健康所有、控制和运营的，可在电脑、移动终端等各种设备上运行的软件、内容和数据资料。包括但不限于文本、图片、音频、视频、软件等信息和资料。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.医师：指同意并承诺遵守本协议规定，向博一健康用户提供互联网诊疗服务、医疗咨询解答、医疗知识传播服务的，并持有卫生局签发的《医师资格证书》、《医师执业证书》的医生。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.用户：指在博一健康APP、微信公众号、小程序等移动应用及网站上发布消息或接受服务的互联网用户。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>账户的注册和使用&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您可以通过注册账户的方式使用本平台的服务。当您按本平台要求提交信息和资料后，博一健康对您提交的材料进行初步审查后，会分配给您一个账户。您有义务保证所提供的资料信息真实、完整、有效、并在最新状态。当您在提交注册时所涉及的资料信息发生变更后，须及时向本平台提交变更申请，博一健康在审查通过后会根据申请变更您的注册信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.博一健康平台的各项电子服务的所有权和运作权归博一健康所有，您仅对您的注册账户拥有使用权。该账户不可变更，不可转让、不可借用或租用、不可赠与、不可继承。您不得违反本协议约定将您的账户用于本协议约定以外的其他目的。否则，博一健康有权随时单方限制、中止或终止向您提供本协议项下产品和服务。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.您应对您账户下发生的一切活动（包括但不限于享受本平台免费服务或购买付费服务等）承担全部法律责任，无论该活动是由您本人进行，还是由您授权的第三方实行的，您均应承担全部责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.您所注册的账号是您登录及使用本平台项下服务的唯一凭证。您应妥善保管、正确和安全地使用账户信息（包括但不限于账号及密码）等信息。若发现任何非法使用您的帐号或存在安全漏洞的情况，请立即通知博一健康。因黑客行为、您保密措施不当或您的其他行为，致使密码等丢失或泄漏所引起的一切损失和后果，均由您自行承担，博一健康不承担责任。博一健康将根据法律法规的要求，履行其作为移动互联网信息服务提供者应当履行的义务。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.在合理怀疑或有证据证明，因您的作为或不作为而可能损害博一健康或任意第三方的合法权益的情况下，博一健康有权拒绝向您提供服务，并中止或终止您对账户的使用，也可以同时或随后注销您的账户。对此博一健康将不承担任何法律责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6.您在注册账户后需要及时提交包括《医师资格证书》、《医师执业证书》等在内的本平台要求的认证资料，博一健康将对其真实性、有效性进行审核。对于未提交认证资料或未通过博一健康认证审核的医师，博一健康有权单方面解除您的注册协议，回收您的账号。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>&nbsp;医师同意&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.博一健康作为医疗健康交流互通平台仅向正规医疗机构的医生提供相关服务。因此，您必须是经合法登记、已获得相应执业证书或具有同等资质的医生。若不符合本项条件，请勿使用本服务，博一健康可随时自行全权决定拒绝向任何不符合要求的用户提供本服务。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您是具备完全民事权利能力和完全民事行为能力的自然人，保证具备履行本协议项下义务和享有本协议项下权益的资格和能力，并在申请注册时向博一健康提交您本人的如下相关信息及资质证明文件：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）中华人民共和国《医师资格证书》、《医师执业证书》扫描件。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）医师职称证书（或工作证、医院聘书）扫描件。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）个人证件照（或个人清晰头像）。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）身份证扫描件（正、反面）。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）有效联系方式（电子邮件地址、联系电话、联系地址等）。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）其他博一健康认为需查验的信息。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7）您认可博一健康有权独立的对您提供的资料、证明文件、权限开通申请进行评估和审核，您对此不持有任何异议。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您声明并保证其向博一健康提供的全部证明文件真实、准确且不存在超过时效问题。若上述内容发生任何变更，您应及时通知博一健康。如因上述信息变更后使得您不再具备履行本协议的情形出现时，博一健康有权立即中止或终止本协议。您认可博一健康在现有的技术条件下，仅能对您的注册资料进行形式审查，如因您提供虚假、过期材料，导致用户向博一健康投诉的，博一健康将立即终止向您提供服务，并不予承担任何法律责任。您声明并保证尊重博一健康和其他医师的合法权益，不贬低博一健康的商誉以及产品和服务的声誉。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您不得以虚构或歪曲事实的方式不当评价其他医师，不得采取不正当方式制造或提高（降低）其他医师的评价度及信用度，不得采取不正当方式制造或提高自身的评价度及信用度。博一健康有权对您违反本条规范的行为进行指正、警告、甚至终止向您提供服务。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.您声明并保证在使用本平台的产品和服务、以及向用户提供咨询时谨慎言行，遵守本协议以及博一健康的规则和要求，不会违反任何相关法律法规
                (包括但不限于关于规范互联网站、互联网信息、不正当竞争的法律、法规、条例或规章)&nbsp;的规定，并不得存在危害网络安全、损害第三方合法权益之行为。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.您在本平台提供医疗服务不得影响您在主要执业机构中的本职工作。您因此与主要执业机构产生的纠纷，由您自行承担，博一健康不承担任何法律责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.您声明并保证不会删除、隐匿或改变本平台的产品和服务中显示或其中包含的任何知识产权或其他所有权声明；不会以任何方式干扰或企图干扰博一健康及其产品和服务的正常运行，或者制作、发布、传播可能造成前述后果的工具、方法等。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6.您声明并保证您使用本平台产品和服务以及第三方产品和服务，和/或通过本平台的产品和服务进行发布拥有合法权利内容的时候，应遵循诚实信用原则，尊重社会公德，不损害社会公共利益。您应保证：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）您不会发布、传播、提供含有任何政治、宗教迷信、淫秽、色情、不道德、欺诈、诽谤、侮辱等内容。您发布的内容不会侵犯任何法律法规或第三方的任何权利，如因您发布的内容导致博一健康或其他第三方遭受损失的，您应承担全部责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）不得利用本平台从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）不得教唆他人从事本条所禁止的行为。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）不得利用在本平台注册的账户进行经营活动。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）不得发布明显暗示患者去某医院某科室就诊的广告，或者过分夸大某项医疗技术或某种药物作用；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）不得泄露患者隐私；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7）不得抄袭其他医生或其他平台已经发布过的内容；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8）不得发布具有广告嫌疑的网站或产品链接；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                9）不得过分彰显某公司药品或器材的商品名。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                10）您的行为真实、合法、准确、完整。您不得损害博一健康和他人的合法权益，不得妨碍博一健康和第三方行使权益。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.博一健康保有删除各类不符合法律政策或不真实的信息内容而无须通知用户的权利。若您未遵守以上规定的，博一健康有权作出独立判断并采取暂停或关闭用户帐号等措施。您须对自己在网上的言论和行为承担法律责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您在博一健康平台发布与上传的视频或文章等作品，均默认为由医师原创。医师所发布文章若标注原创，则视为医师本人的原创内容，若内容信息涉及版权问题，所产生的一切责任由医师自行承担。若经他人投诉文章或视频中含有任何可能涉嫌侵犯他人知识产权的内容，且经博一健康平台核实，平台有权在不通知本人的情况下，对该内容做删除处理。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.您所发布的信息内容如为转载，则必须标明内容来源、作者，并自行取得著作权人授权。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.您就您发布的内容（若其中涉及的第三方知识产权，您应拥有合法的授权和转授权），在此不可撤销的授予博一健康全球范围内的免费的、无期限的、非排他的、可转让和可分/转授权的使用许可。博一健康及与博一健康合作的第三方，可以不受限制地在博一健康的产品和服务或合作的产品和服务中免费使用、传播，并供用户以浏览、下载等方式使用您发布的内容，和/或以现在已知或日后开发的任何形式、媒体或技术，将上述信息纳入其它作品内。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.您同意，博一健康拥有通过邮件、短信、微信、电话等形式，向您发送订单信息、促销活动等告知信息的权利。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6.您必须自行准备如下设备和承担如下开支：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）上网设备，包括并不限于电脑或者其他上网终端、调制解调器及其他必备的上网装置；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）上网开支，包括并不限于网络接入费、上网设备租用费、手机流量费等。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您声明并同意博一健康可指定第三方成为本协议的受益人，并有权直接履行和享受本协议项下权利。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.本平台仅为您与用户间的互动平台，并不代表博一健康赞同您的观点或证实其内容的真实性。您通过本平台发表的各种言论（包括但不仅限于医学文献、诊疗建议等）需在符合本协议的条款下进行，否则造成的违法行为、重大医疗事故及相应的损失将由您承担。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>服务内容及双方权利义务&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>服务内容知悉&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.互联网诊疗服务仅针对部分常见病、慢性病复诊，且医师应在掌握患者病历资料，确定患者在实体医疗机构明确诊断为上述常见病、慢性病后，方可针对相同诊断进行复诊。如不符合上述情况，医师应拒绝提供互联网诊疗服务。当患者出现病情变化需要医务人员亲自诊查时，医疗机构及其医务人员应当立即终止互联网诊疗服务，引导患者到实体医疗机构就诊。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您可以通过本平台为您的用户提供电话复诊、图文复诊服务（以下简称“互联网诊疗服务”），以及诊后咨询等其它服务（互联网诊疗服务于其它服务通称“医疗服务”），医疗服务的交互主体为您和用户，博一健康不对您与用户医疗服务中产生的一切不符合本协议纠纷承担任何责任。互联网首诊不在互联网诊疗服务的范畴，您不可在本平台进行互联网首诊服务，否则带来的医疗纠纷、违法行为及相应损失将由您承担责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.在通过平台审核后，您可以提供互联网会诊服务。会诊服务中，患者须在实体医疗机构就诊，且会诊发起医生须提供完整的包含实体机构就诊凭证的会诊单。若不符合上述情况，您应拒绝本次会诊申请，否则带来的医疗纠纷、违法行为及相应损失，博一健康不承担责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.除法律另有强制性规定外，您知悉并同意：博一健康上展示的服务和价格等信息仅仅是要约邀请，用户下单时须填写或选择其希望购买的服务数量、价款及支付方式、联系人、联系方式、合同履行方式等内容；系统生成的订单信息是计算机信息系统根据用户填写的内容自动生成的数据，仅是用户向博一健康发出的合同要约；博一健康收到用户的订单信息后，会根据用户的需要与您可预约时间相匹配，成功后会向用户和您发出通知，您应在相应的时间向用户提供医疗服务。您可以随时登录您在本平台注册的账户，查询您可提供服务的订单状态。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.本平台上的服务及其他涉及项目的价格、数量、能否提供等信息随时可能发生变动，博一健康不作特别通知。本平台显示的信息可能会有一定的滞后性或差错，对此情形您知悉并理解，并不会因此追究博一健康的任何法律责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6.博一健康仅认可通过本平台及其关联的支付平台的线上线下交易所产生的交易行为，您通过上述渠道之外的交易行为所获得的费用，将被认定为来源不符合本协议的规则，您若因此遭受任何损失的，博一健康概不承担任何责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                博一健康的权利义务
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您注册并认证通过后，博一健康负责为您提供技术与服务支持。同时所有博一健康的用户均可免费或付费向您发起问诊服务申请。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.博一健康将会把产品（服务）发送到您所指定的接收端或短信、邮箱等，所有在本平台列出的交付时间为参考时间，参考时间的计算是根据具体服务的处理过程和发送时间的基础上估计得出的。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.博一健康需保证本平台安全、稳定，对您的服务顺利进行。您在医疗服务过程中遇到有紧急事情处理时（医生职业要求），应对用户给予解释，暂停服务，向博一健康客服申报，以便安排重新服务的具体时间。如服务在进行过程中由于本平台性能不稳定等系统原因导致服务不能完成的，将由博一健康客服为您重新安排医疗服务。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.博一健康有权根据本平台用户对您医疗服务质量的评价以及其他专业、学术指标将您与其他医师进行排名。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.经相关政府部门或司法机关核实的违法交易，利害关系人可向博一健康提出申请，博一健康将及时采取措施终止交易服务并在三年内保存有关记录。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6.如您收到博一健康订单通知后无法提供服务时，博一健康与博一健康用户有权取消订单，因此给第三方造成损失的，由您个人承担全部责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7.因如下情况造成订单延迟或无法交付等，博一健康不承担延迟交付的责任：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）您提供的信息错误、接受端设备等原因导致的；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）服务发送后无人查阅的；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）情势变更因素导致的；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）不可抗力因素导致的，例如：自然灾害、基础网络问题、突发战争、网络黑客等。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.因服务平台的特殊性，博一健康没有义务对所有医师的服务行为以及与服务有关的其它事项进行事先审查，但如存在下列情况，博一健康有权根据不同情况选择删除相关信息或停止对该医师提供服务平台，并追究相关法律责任：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）第三方通知博一健康，认为某个具体医师或具体服务事项可能存在重大问题。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）医师或第三方告知博一健康本平台上有违法或不当行为的。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）博一健康以普通非专业人员的知识水平标准对相关内容进行判别，可以认为这些内容或行为具有违法或不当性质的。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.经国家生效法律文书或行政处罚决定确认您存在违法行为，或者博一健康有足够事实依据可以认定您存在违法或违反协议行为的，博一健康有权在本平台公布您的违法和/或违规行为，并终止向您提供一切服务。如因您的行为给博一健康造成损失的，您须承担全部赔偿责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.博一健康除给您提供医疗服务的平台和工具外，双方还可协商，利用博一健康资源为医师个人在博一健康的品牌进行包装、推广；为您所拥有的医疗健康方面的学术观点、知识产权、专利、论文等进行推广服务；为您提供基于其个人积累的信息和数据进行整合分析、数据挖掘的服务，用于临床和科研工作。具体的合作模式可双方另起协议或规则进行约定。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>医师的权利义务</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.在您提供付费服务时，请您仔细确认用户所购服务的名称、价格、数量、规则、说明、注意事项、联系地址、电话、联系人等信息，由您引的疏忽起的纠纷和损失，博一健康不承担责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您在医疗服务过程中要语言文明，尊重用户，平等交流。如有对用户使用恶意中伤或不文明言语，用户有权立即中断服务，如涉及收费服务的，您须将款项全部退还。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.您在本平台的处方开具，需在医患双方充分沟通，医师充分获得患者在实体医疗机构的病历资料及诊断等所需数据基础上，未获得用户患者在实体医疗机构的病历资料和诊断等所需数据即开方导致的医疗纠纷、用户损失，博一健康不承担任何责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.博一健康的医疗处方行为是在患者在博一健康平台相关服务的经营者进行的互联网诊疗服务。请勿在其它执业医疗机构使用本平台对患者进行处方行为，如有发现，博一健康有权利立即终止本协议，并停止为您提供服务。因此造成的其它执业机构的惩罚以及其它损失，博一健康不承担任何责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.您在本平台开具处方的行为，需符合到开具处方日为止最新版《中华人民共和国药典》对药材限量，相反相畏的相关规定。您未按《中华人民共和国药典》规范开方导致的医疗纠纷和用户损失，博一健康不承担责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6.您在本平台开具处方的行为，需符合《中华人民共和国卫生部令(第53号) -
                处方管理办法》，并正确填写患者的姓名、年龄、性别等关键资料，处方内容需与患者信息一致。因您误填患者资料导致的医疗纠纷和用户损失，博一健康不承担责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7.您在本平台不得开具麻醉药品、精神药品等特殊管理药品的处方。为低龄儿童（6岁以下）开具互联网儿童用药处方时，应当确认患儿有监护人和相关专业医师陪伴。违反此条产生的医疗纠纷及用户损失，博一健康不承担任何责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8.患者购买整体用药方案所支付的费用包括您设置的医生诊后病程管理费，博一健康不收取任何额外费用。医生诊后病程管理费包括患者复诊后的医生巡诊服务、医嘱提醒、诊后提问等项目，您有义务在收取诊后病程管理费后，向有需要的患者提供以上服务。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                9.您明确理解并同意，您通过本平台为第三方提供服务时，应仔细说明服务的内容、信息以及收费的方式、若提供线下服务时应与第三方单独签署相应的协议以保障您个人的合法权益，并严格按照协议的约定履行。如因您使用第三方的产品和服务引发的任何纠纷，您应自行解决并承担由此引发的全部责任，博一健康对此不承担任何责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>数据、信息、保密约定和隐私权保护&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您在使用本平台产品和服务过程中所产生并储存于本平台客户端和博一健康服务器中的任何数据信息（包括但不仅限于账号信息、使用记录等数据信息），均属于相关程序在运行过程中产生的衍生数据。博一健康和相应的第三方产品和服务提供商分别对储存在各自服务器上的上述数据信息拥有所有权（您与用户之间的咨询信息除外），您在按照本协议规定正常使用本平台产品和服务或第三方产品和服务的过程中对属于其博一健康账户和第三方账户的数据信息享有非独家有限使用权。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.在不影响您正常接受服务的情况下，博一健康有权决定保留或不保留服务器上的全部或部分数据；第三方产品和服务中的各种数据属于第三方所提供的服务，其所有权归第三方所有，第三方产品和服务提供商有权决定保留或不保留服务器上的全部或部分数据。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.博一健康有可能主动收集包括但不限于以下数据和信息：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）为了优化给您提供的产品和服务，博一健康有可能收集您的浏览器性质、操作系统种类、给您提供接入服务的ISP域名等，以优化在您计算机或手机屏幕上显示的页面；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）为了给您提供软件升级服务，需要收集您PC端、移动端所安装软件的相关信息，例如：软件名称及版本等；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）博一健康进行客流量统计，从而改进网站的管理和服务，或进行网络行为的调查或研究。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.本协议所称商业秘密包括但不限于本协议、任何补充协议或政策所述内容及在合作过程中涉及的其他秘密信息。您未经商业秘密提供方同意，不得将该信息向任何第三方披露、传播、编辑或展示。您承诺，本协议终止后仍承担此条款下的保密义务，保密期将另持续三年。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您同意与博一健康一并保护本平台用户的个人身份信息、医疗信息、图文影像信息、联系方式、银行卡信息，以及其他能够据此直接或者间接识别出用户个人身份的隐私信息以及咨询内容、个人消费信息等。本协议所述的数据和信息，即您使用本平台产品和服务，以及第三方产品和服务中产生的数据和信息不属于本条款所指的隐私信息。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.博一健康保证不向第三方公开、提供或共享您的隐私信息，但以下情形除外：&nbsp;&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）博一健康已获得您的明确授权；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）需要公布在医疗机构中的资料和信息；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）博一健康为提升产品和服务质量；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）根据有关的法律法规要求，博一健康负有披露义务的；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）司法机关或行政机关基于法定程序要求博一健康提供的；&nbsp;&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）为维护社会公共利益及博一健康合法权益，在合理范围内进行披露的。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.博一健康尊重并尽最大努力保护您的隐私信息，但是不能保证现有的安全技术措施能确保您的个人信息不受任何形式的侵犯。您对上述情况充分理解并知晓，对因信息安全技术措施被破解失效、网络遭受病毒入侵、黑客攻击等非博一健康过错导致的损失，相关风险和后果均由您自己承担，博一健康不承担任何责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您的信任对博一健康非常重要，博一健康深知个人信息安全的重要性，博一健康将按照法律法规要求，采取安全保护措施，保护您的个人信息安全。具体详见《法律声明与隐私政策》。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.您在服务过程中获得的患者信息（包括但不限于可识别个人信息的照片、患者医疗信息等）仅能用作为患者提供医疗服务，使用完毕后您应当立刻删除相关信息。如因您的故意或过失致使用户的个人隐私信息泄露，您须单独向用户承担全部赔偿责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>违约和赔偿&nbsp;</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.如第三方对您发布的内容或向用户解答的内容持有异议或认为存在违法、侵权等情况并通知博一健康时，博一健康有权根据第三方的要求和所提交的证据以普通非专业的知识水平标准进行初步判断后自行做成处理决定，如您认为其他医师或任意第三方损害了您的合法权益，您可以通知博一健康并提供真实有效的证据后撤销该处理决定。如您在博一健康发信后2个工作日内未回复或未能提交充分的证据证明您的要求，博一健康将视情况继续屏蔽或删除相应内容，甚至暂停或终止账户使用。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.如您损害博一健康及相关服务的经营者的合法权益，或您导致博一健康及相关服务的经营者遭受任何来自第三方的纠纷、诉讼、索赔要求等，您须向博一健康赔偿相应的损失（包括由此产生的全额的诉讼费用和律师费），并需对因您的行为产生的一切后果负全部法律责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.除本协议及服务平台规则另有约定之外，如一方发生违约行为，守约方可以书面通知方式要求违约方在指定的时限内停止违约行为，并就违约行为造成的损失进行索赔，如违约方未能按时停止违约行为，则守约方有权立即终止本协议。&nbsp;&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>服务中止或终止&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您在停止接收新的医疗服务订单一年后或通过电子邮件形式告知博一健康终止本协议之日，本协议将自动终止。本协议终止后您的账号将被注销。您若之后还想在本平台提供医疗时，需要重新提交申请并提供相关审核文件。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.下述任一原因发生，无需提前通知，博一健康有权单方面决定是否随时中止或终止服务，且按有关规则对您进行处罚。您同意并接受博一健康的处理决定：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）&nbsp;如您违反博一健康的任何规则或本协议中的任何承诺或保证。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）若您违反本协议或相关规定，经博一健康提醒仍不改正三次以上的；或因您的言行对博一健康造成人民币1000元以上损失的，博一健康有权终止本协议，并冻结您的账号、注册账号等。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）非因博一健康主观故意的过错，您无法使用服务；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）因不可抗力原因，服务中止或终止；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）博一健康无法预见和控制的原因，服务中止或终止；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）博一健康停止运营某特定产品和服务；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7）博一健康认为实际情形不再适宜继续履行本协议；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8）本协议约定的其他情况。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.不论博一健康与您之间的服务因任何原因以任何方式终止，您同意并接受：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）博一健康有权保存或不保存您发布的内容及其他相关数据和信息，或转发任何未曾阅读或发送的信息给您或第三方。亦不就终止协议而您或任何第三者承担任何责任；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）博一健康有权保存或不保存您账户和账户信息；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）在服务终止之前，您和博一健康或其他第三方的交易尚未完成的，例如尚未下载完毕或尚未付款，博一健康有权在中断、终止服务的同时删除此项交易信息&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）服务终止之前，您和博一健康或其他第三方的交易已完成的，博一健康有权在中断、终止服务的同时删除此项交易信息。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）协议终止后，博一健康有权保留该您的注册数据及以前的服务行为记录。如您在协议终止前在服务平台上存在违法行为或违反协议的行为，博一健康仍可行使本协议所规定的权利。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.如无论因任何原因终止的，在终止之前，您应自行处理好数据、信息的备份以及与博一健康、任意第三方间的相关事项的处理等，否则，由此产生的您与任意第三方之间的纠纷等问题由您自行负责解决，并单独承担完全责任。由此造成博一健康损失的，您应负责赔偿。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您必须完全独立地承担，您在服务终止前实施的违法或违约行为所导致的任何赔偿和责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.博一健康未行使本协议的任何权利或规定，不构成对前述权利之放弃。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.本条不影响博一健康按照本协议规定追究您的违约责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>不可抗力及通知&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件，包括但不限于自然灾害如洪水、地震、瘟疫流行和风暴等以及社会事件如战争、动乱、法规政策颁布和修改、行政行为、政府决定等。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.出现上述情况时，博一健康将努力在第一时间与相关单位配合，及时进行修复，若由此给您造成损失的，您同意放弃追究博一健康的责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.本协议下所规定的通知有权要求以书面形式通过以下邮址递交收悉，通知的到达以博一健康收悉为准。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.博一健康联系方式地址：泰州市药城大道799-2号（数据大厦B幢1108-6）&nbsp;&nbsp;邮编：225316&nbsp;；收件人：严文慧（收）。电子邮箱：appstore@byhealth.net
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>免责条款&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.除非另有明确的书面说明，本平台及其所包含的或以其它方式通过本平台提供给您的全部信息、内容、材料、产品（包括软件）和服务，均是在“按现状”和“按现有”的基础上提供的。除非另有明确的书面说明，博一健康不对本平台的运营及其包含在本平台上的信息、内容、材料、产品（包括软件）或服务作任何形式的、明示或默示的声明或担保（根据中华人民共和国法律另有规定的以外）。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.博一健康所承载的内容（文、图、视频、音频）均为传播有益健康资讯目的，不对其真实性、科学性、准确性、严肃性做任何形式保证。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.您应拒绝回复医疗健康之外的咨询问题，包括但不限于如下情况：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）非医疗健康类问题，如动物疾病问题、社会意识形态问题等；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）医疗司法举证或询证问题；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）胎儿性别鉴定问题；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）未按提问要求提问，如提问时未指定医生，却要求具体医生回复；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）有危害他人/自己可能的问题；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）追问医生个人信息的问题；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7）故意挑逗、侮辱医生的提问。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您应遵守法律法规及本协议的约定及承诺，否则被行政机关、司法执法机构或第三方调查、举报，或被博一健康自行检查时发现的，及或因此损害博一健康及或第三方的权益的，您应当负责解决并承担全部法律责任；并且博一健康有权随时在不通知您的前提下按照如下方案予以处理，而不承担任何责任：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）不予发布、屏蔽或删除您发布的全部或部分的内容、数据和信息；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）封禁或删除您的账户，中/终止提供产品和服务；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）将您的行为对外予以公告；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）追究您的法律责任；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）其他博一健康认为适合的处理措施。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您不得在本平台进行超出本协议限定范围的医疗活动（如首诊，对急重病进行诊疗等），否则造成的违法行为、医疗纠纷及相应损失，将由您承担全部责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.博一健康不因下述任一情况而可能导致的任何损害赔偿承担责任，包括但不限于财产、收益、数据资料等方面的损失或其它无形损失：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）因不可抗力导致博一健康系统障碍不能正常运作；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）由于黑客攻击、电信部门技术调整或故障、系统维护等原因而造成的平台服务中断或者延迟。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.鉴于网络服务的特殊性，博一健康有权在无需通知您的情况下根据博一健康及其关联企业的整体运营情况或相关运营规范、规则等，可以随时终止服务或停止运营。若由此给您造成损失的，您同意放弃追究博一健康的责任。对于此类情形下可能造成的风险，请您充分了解并同意自行承担由此可能造成的一切不利后果和损失。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.在法律允许的最大限度内，博一健康明确表示不对其产品和服务做出任何明示、暗示和强制的担保，包括但不限于安全性、可靠性、稳定性、及时性、适销性、针对特定用途的适用性以及不侵犯所有权或其他权益的担保。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                协议更新及医师关注义务&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.根据国家法律法规变化及网络运营需要，博一健康有权在不另行通知的情况下对本协议条款含相关的政策（包括但不限于结算规则等）不时地进行修改，修改后的协议即时生效并适用。您可随时登陆查阅最新协议；您有义务不时关注并阅读最新版的协议及本平台公告。如您不同意更新后的协议，您可以且应立即停止接受博一健康提供的服务；如您继续使用本平台提供的服务，即视为同意更新后的协议。博一健康建议您在使用本平台之前阅读本协议及本平台的公告。如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>法律管辖和适用&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.本协议的订立、执行和解释及争议的解决均应适用在中华人民共和国大陆地区适用之有效法律（但不包括其冲突法规则）。如发生本协议与适用之法律相抵触时，则这些条款将完全按法律规定重新解释，而其它有效条款继续有效。如缔约方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，双方在此同意由上海市人民法院管辖。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.如本协议的任何条款被视作无效或无法执行，则上述条款可被分离，其余部份则仍具有法律效力。&nbsp;&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>其他&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.若博一健康用户对您的服务结果不满意，可以向博一健康提出投诉，博一健康将视情况协调沟通。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.咨询双方因服务引起的纠纷，请博一健康给予调解的，博一健康将有权了解相关信息，并将双方提供的信息与对方沟通。因在博一健康上发生服务纠纷，引起诉讼的，您应通过司法部门或行政部门依照法定程序要求博一健康提供相关数据，博一健康将积极配合并提供有关资料。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                医生注册协议（会诊本地医师版）&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>注册协议</Text>&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                本协议是您（也称“医师”）与博一健康平台及相关服务（包括但不限于博一健康医生版 APP
                客户端、微信公众号、www.byhealth.net&nbsp;等移动端应用及网站，以博一健康不时更新、确认的域名、移动端应用为准，以下简称“本平台”）的经营者共同就使用博一健康软件、网站、服务等相关事宜所订立的协议，本协议具有合同效力。博一健康平台及相关服务的经营者是指法律认可的经营博一健康平台及相关服务的提供主体，包括但不限于海东市平安正阳互联网中医医院有限公司、北京紫宸正阳科技有限公司等，以实际提供平台或服务的博一健康经营主体为准。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                如注册时所选医疗机构为与平安正阳互联网中医医院签署了《互联网会诊合作协议》，则此协议生效，否则请参考《医生注册协议》。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>重要提示</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.在使用博一健康提供的软件、网站、服务（统称为
                “博一健康产品或服务”）之前，请您务必认真阅读并充分理解博一健康《医生注册协议》与《法律声明与隐私政策》，特别是关于特别提示、隐私保护、接收邮件及消息、担保与保证、免责声明及责任限制、争议解决等条款，该等条款可能以粗体、斜体、下划线方式进行显著标注，请您注意重点阅读。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.如果您对本协议有疑问，请您联系博一健康客服（电话：0523
                86057008），博一健康将向您解释本协议内容。注册并使用博一健康产品或服务代表您理解并同意本协议及相关协议，同意与博一健康平台及相关服务的经营者签署服务协议，并进行多点执业注册备案。服务期间若您不能胜任或出现违法行为及重大医疗事故等情况时，博一健康有权单方面解除本协议。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.博一健康有权对本协议进行修订，并将在博一健康产品或服务和及网站上公布修订后的协议。您理解并同意，修订后的协议具有溯及力，如果您在本协议修订版本公布后继续使用博一健康产品或服务的，即视为您同意修订后的协议。当您与博一健康发生争议时，应以最新的服务协议为准。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>定义&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.服务：指由博一健康所有、控制和运营的，可在电脑、移动终端等各种设备上运行的软件、内容和数据资料。包括但不限于文本、图片、音频、视频、软件等信息和资料。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.医师：指同意并承诺遵守本协议规定，向博一健康用户提供互联网医疗服务、互联网医院会诊服务、医疗咨询解答、医疗知识传播服务的，并持有卫生局签发的《医师资格证书》、《医师执业证书》的医生。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.用户：指在博一健康APP、微信公众号、小程序等移动应用及网站上发布消息或接受服务的互联网用户。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                账户的注册和使用&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您所隶属的医疗机构与平安正阳互联网中医医院签订《互联网会诊合作协议》后，您可以通过注册账户的方式使用本平台的服务。当您按本平台要求提交信息和资料后，博一健康对您提交的材料进行初步审查后，会分配给您一个账户。您有义务保证所提供的资料信息真实、完整、有效、并在最新状态。当您在提交注册时所涉及的资料信息发生变更后，须及时向本平台提交变更申请，博一健康在审查通过后会根据申请变更您的注册信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.博一健康平台的各项电子服务的所有权和运作权归博一健康所有，您仅对您的注册账户拥有使用权。该账户不可变更，不可转让、不可借用或租用、不可赠与、不可继承。您不得违反本协议约定将您的账户用于本协议约定以外的其他目的。否则，博一健康有权随时单方限制、中止或终止向您提供本协议项下产品和服务。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.您应对您账户下发生的一切活动（包括但不限于享受本平台免费服务或购买付费服务等）承担全部法律责任，无论该活动是由您本人进行，还是由您授权的第三方实行的，您均应承担全部责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.您所注册的账号是您登录及使用本平台项下服务的唯一凭证。您应妥善保管、正确和安全地使用账户信息（包括但不限于账号及密码）等信息。若发现任何非法使用您的帐号或存在安全漏洞的情况，请立即通知博一健康。因黑客行为、您保密措施不当或您的其他行为，致使密码等丢失或泄漏所引起的一切损失和后果，均由您自行承担，博一健康不承担责任。博一健康将根据法律法规的要求，履行其作为移动互联网信息服务提供者应当履行的义务。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.在合理怀疑或有证据证明，因您的作为或不作为而可能损害博一健康或任意第三方的合法权益的情况下，博一健康有权拒绝向您提供服务，并中止或终止您对账户的使用，也可以同时或随后注销您的账户。对此博一健康将不承担任何法律责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6.您在注册账户后需要及时提交包括《医师资格证书》、《医师执业证书》等在内的本平台要求的认证资料，博一健康将对其真实性、有效性进行审核。对于未提交认证资料或未通过博一健康认证审核的医师，博一健康有权单方面解除您的注册协议，回收您的账号。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>&nbsp;医师同意&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.博一健康作为医疗健康交流互通平台仅向正规医疗机构的医生提供相关服务。因此，您必须是经合法登记、已获得相应执业证书或具有同等资质的医生。若不符合本项条件，请勿使用本服务，博一健康可随时自行全权决定拒绝向任何不符合要求的用户提供本服务。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您是具备完全民事权利能力和完全民事行为能力的自然人，保证具备履行本协议项下义务和享有本协议项下权益的资格和能力，并在申请注册时向博一健康提交您本人的如下相关信息及资质证明文件：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）中华人民共和国《医师资格证书》、《医师执业证书》扫描件。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）医师职称证书（或工作证、医院聘书）扫描件。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）个人证件照（或个人清晰头像）。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）身份证扫描件（正、反面）。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）有效联系方式（电子邮件地址、联系电话、联系地址等）。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）其他博一健康认为需查验的信息。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7）您认可博一健康有权独立的对您提供的资料、证明文件、权限开通申请进行评估和审核，您对此不持有任何异议。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您声明并保证其向博一健康提供的全部证明文件真实、准确且不存在超过时效问题。若上述内容发生任何变更，您应及时通知博一健康。如因上述信息变更后使得您不再具备履行本协议的情形出现时，博一健康有权立即中止或终止本协议。您认可博一健康在现有的技术条件下，仅能对您的注册资料进行形式审查，如因您提供虚假、过期材料，导致用户向博一健康投诉的，博一健康将立即终止向您提供服务，并不予承担任何法律责任。您声明并保证尊重博一健康和其他医师的合法权益，不贬低博一健康的商誉以及产品和服务的声誉。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您不得以虚构或歪曲事实的方式不当评价其他医师，不得采取不正当方式制造或提高（降低）其他医师的评价度及信用度，不得采取不正当方式制造或提高自身的评价度及信用度。博一健康有权对您违反本条规范的行为进行指正、警告、甚至终止向您提供服务。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.您声明并保证在使用本平台的产品和服务、以及向用户提供咨询时谨慎言行，遵守本协议以及博一健康的规则和要求，不会违反任何相关法律法规
                (包括但不限于关于规范互联网站、互联网信息、不正当竞争的法律、法规、条例或规章)&nbsp;的规定，并不得存在危害网络安全、损害第三方合法权益之行为。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.您在本平台提供医疗服务需经得您所在执业机构的同意。您只能在与平安正阳互联网中医医院签订了《互联网会诊合作协议》的，且为您所属的医疗机构内发起并开展会诊业务。在使用本平台为接诊患者提供互联网医疗服务时，您仅能对在您所属的实体医疗机构进行就诊的患者提供发起会诊服务，即您通过本平台邀请会诊程序邀请其他医师进行会诊时，应由受邀会诊医师出具诊断意见并开具处方。您可以参与诊断意见和开方的会诊讨论，提出专业建议，并明确表示对诊断和处方结论赞同或不赞同的意见，但不得直接作出诊断和开方。不符合上述条件产生的纠纷，由您自行承担，博一健康不承担任何法律责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.您声明并保证不会删除、隐匿或改变本平台的产品和服务中显示或其中包含的任何知识产权或其他所有权声明；不会以任何方式干扰或企图干扰博一健康及其产品和服务的正常运行，或者制作、发布、传播可能造成前述后果的工具、方法等。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6.您声明并保证您使用本平台产品和服务以及第三方产品和服务，和/或通过本平台的产品和服务进行发布拥有合法权利内容的时候，应遵循诚实信用原则，尊重社会公德，不损害社会公共利益。您应保证：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）您不会发布、传播、提供含有任何政治、宗教迷信、淫秽、色情、不道德、欺诈、诽谤、侮辱等内容。您发布的内容不会侵犯任何法律法规或第三方的任何权利，如因您发布的内容导致博一健康或其他第三方遭受损失的，您应承担全部责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）不得利用本平台从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）不得教唆他人从事本条所禁止的行为。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）不得利用在本平台注册的账户进行经营活动。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）不得发布明显暗示患者去某医院某科室就诊的广告，或者过分夸大某项医疗技术或某种药物作用；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）不得泄露患者隐私；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7）不得抄袭其他医生或其他平台已经发布过的内容；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8）不得发布具有广告嫌疑的网站或产品链接；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                9）不得过分彰显某公司药品或器材的商品名。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                10）您的行为真实、合法、准确、完整。您不得损害博一健康和他人的合法权益，不得妨碍博一健康和第三方行使权益。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.博一健康保有删除各类不符合法律政策或不真实的信息内容而无须通知用户的权利。若您未遵守以上规定的，博一健康有权作出独立判断并采取暂停或关闭用户帐号等措施。您须对自己在网上的言论和行为承担法律责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您在博一健康平台发布与上传的视频或文章等作品，均默认为由医师原创。医师所发布文章若标注原创，则视为医师本人的原创内容，若内容信息涉及版权问题，所产生的一切责任由医师自行承担。若经他人投诉文章或视频中含有任何可能涉嫌侵犯他人知识产权的内容，且经博一健康平台核实，平台有权在不通知本人的情况下，对该内容做删除处理。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.您所发布的信息内容如为转载，则必须标明内容来源、作者，并自行取得著作权人授权。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.您就您发布的内容（若其中涉及的第三方知识产权，您应拥有合法的授权和转授权），在此不可撤销的授予博一健康全球范围内的免费的、无期限的、非排他的、可转让和可分/转授权的使用许可。博一健康及与博一健康合作的第三方，可以不受限制地在博一健康的产品和服务或合作的产品和服务中免费使用、传播，并供用户以浏览、下载等方式使用您发布的内容，和/或以现在已知或日后开发的任何形式、媒体或技术，将上述信息纳入其它作品内。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.您同意，博一健康拥有通过邮件、短信、微信、电话等形式，向您发送订单信息、促销活动等告知信息的权利。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6.您必须自行准备如下设备和承担如下开支：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）上网设备，包括并不限于电脑或者其他上网终端、调制解调器及其他必备的上网装置；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）上网开支，包括并不限于网络接入费、上网设备租用费、手机流量费等。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您声明并同意博一健康可指定第三方成为本协议的受益人，并有权直接履行和享受本协议项下权利。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.本平台仅为您与用户间的互动平台，并不代表博一健康赞同您的观点或证实其内容的真实性。您通过本平台发表的各种言论（包括但不仅限于医学文献、诊疗建议等）需在符合本协议的条款下进行，否则造成的违法行为、重大医疗事故及相应的损失将由您承担。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>服务内容及双方权利义务&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>服务内容知悉&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.患者在您所在的、与平安正阳互联网中医医院签订了《互联网会诊合作协议》的实体医疗机构就诊时，若您是其接诊医师，根据患者的病情和意愿，可通过平安正阳互联网医院及本平台邀请其他医师进行会诊（以下简称“互联网会诊服务”）。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.互联网会诊服务的交互主体为您、会诊医师和接诊患者，博一健康不对您与接诊患者会诊服务中所产生的一切与本协议无关、或与本协议主旨和要求相悖的纠纷承担任何责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.互联网会诊须由会诊医师出具诊断意见及处方，您可以参与诊断意见与开方的会诊讨论，提出专业建议，并明确表示您对诊断结果和处方赞同或不赞同的态度。但不得在互联网会诊过程中单独直接出具处方，因此造成的医疗纠纷及相应损失将由您承担责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.当患者出现病情变化需要医务人员亲自诊查或会诊过程中发现患者病情不适宜在线诊疗的，您应当立即终止互联网会诊服务，引导患者到实体医疗机构就诊。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.除法律另有强制性规定外，您知悉并同意：博一健康上展示的服务和价格等信息仅仅是要约邀请，用户下单时须填写或选择其希望购买的服务数量、价款及支付方式、联系人、联系方式、合同履行方式等内容；系统生成的订单信息是计算机信息系统根据用户填写的内容自动生成的数据，仅是用户向博一健康发出的合同要约；博一健康收到用户的订单信息后，会根据用户的需要与您可预约时间相匹配，成功后会向用户和您发出通知，您应在相应的时间向用户提供互联网会诊服务。您可以随时登录您在本平台注册的账户，查询您可提供服务的订单状态。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6.本平台上的服务及其他涉及项目的价格、数量、能否提供等信息随时可能发生变动，博一健康不作特别通知。本平台显示的信息可能会有一定的滞后性或差错，对此情形您知悉并理解，并不会因此追究博一健康的任何法律责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7.博一健康仅认可通过本平台及其关联的支付平台的线上线下交易所产生的交易行为，您通过上述渠道之外的交易行为所获得的费用，将被认定为来源不符合本协议的规则，您若因此遭受任何损失的，博一健康概不承担任何责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                博一健康的权利义务
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您注册并认证通过后，博一健康负责为您提供技术与服务支持。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.博一健康将会把产品（服务）发送到您所指定的接收端或短信、邮箱等，所有在本平台列出的交付时间为参考时间，参考时间的计算是根据具体服务的处理过程和发送时间的基础上估计得出的。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.博一健康需保证本平台安全、稳定，对您的服务顺利进行。您在互联网会诊服务过程中遇到有紧急事情处理时（医生职业要求），应对用户给予解释，暂停服务，向博一健康客服申报，以便安排重新服务的具体时间。如服务在进行过程中由于本平台性能不稳定等系统原因导致服务不能完成的，将由博一健康客服为您重新安排互联网会诊服务。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.经相关政府部门或司法机关核实的违法交易，利害关系人可向博一健康提出申请，博一健康将及时采取措施终止交易服务并在三年内保存有关记录。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.博一健康有权保留您、会诊医师和患者在本平台进行互联网会诊过程中产生的内容及其它相关信息。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6.如您收到博一健康订单通知后无法提供服务时，博一健康与博一健康用户有权取消订单，因此给第三方造成损失的，由您个人承担全部责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7.因如下情况造成订单延迟或无法交付等，博一健康不承担延迟交付的责任：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）您提供的信息错误、接受端设备等原因导致的；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）服务发送后无人查阅的；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）情势变更因素导致的；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）不可抗力因素导致的，例如：自然灾害、基础网络问题、突发战争、网络黑客等。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.因服务平台的特殊性，博一健康没有义务对所有医师的服务行为以及与服务有关的其它事项进行事先审查，但如存在下列情况，博一健康有权根据不同情况选择删除相关信息或停止对该医师提供服务平台，并追究相关法律责任：
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）第三方通知博一健康，认为某个具体医师或具体服务事项可能存在重大问题。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）医师或第三方告知博一健康本平台上有违法或不当行为的。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）博一健康以普通非专业人员的知识水平标准对相关内容进行判别，可以认为这些内容或行为具有违法或不当性质的。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.经国家生效法律文书或行政处罚决定确认您存在违法行为，或者博一健康有足够事实依据可以认定您存在违法或违反协议行为的，博一健康有权在本平台公布您的违法和/或违规行为，并终止向您提供一切服务。如因您的行为给博一健康造成损失的，您须承担全部赔偿责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>医师的权利义务</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.在您提供付费服务时，请您仔细确认用户所购服务的名称、价格、数量、规则、说明、注意事项、联系地址、电话、联系人等信息，由您引的疏忽起的纠纷和损失，博一健康不承担责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您在互联网会诊过程中要语言文明，尊重用户，平等交流。如有对用户使用恶意中伤或不文明言语，用户有权立即中断服务，如涉及收费服务的，您须将款项全部退还。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.您在本平台发起互联网会诊服务时，需经医患双方充分沟通，确保会诊医师能够充分获得患者的病历资料及初步诊断，并提交给相关数据形成会诊单，发送给会诊医师。您须对患者症状描述、历史病历资料及初步诊断等相关信息的真实性、完整性、有效性承担法律责任。因会诊单中不准确的患者病情信息，造成的会诊医疗纠纷、用户损失，博一健康不承担任何责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.患者购买整体用药方案所支付的费用包括您设置的医生诊后病程管理费，博一健康不收取任何额外费用。医生诊后病程管理费包括患者复诊后的医生巡诊服务、医嘱提醒、诊后提问等项目，您有义务在收取诊后病程管理费后，向有需要的患者提供以上服务。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5.您明确理解并同意，您通过本平台为第三方提供服务时，应仔细说明服务的内容、信息以及收费的方式、若提供线下服务时应与第三方单独签署相应的协议以保障您个人的合法权益，并严格按照协议的约定履行。如因您使用第三方的产品和服务引发的任何纠纷，您应自行解决并承担由此引发的全部责任，博一健康对此不承担任何责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                数据、信息、保密约定和隐私权保护&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您在使用本平台产品和服务过程中所产生并储存于本平台客户端和博一健康服务器中的任何数据信息（包括但不仅限于账号信息、使用记录等数据信息），均属于相关程序在运行过程中产生的衍生数据。博一健康和相应的第三方产品和服务提供商分别对储存在各自服务器上的上述数据信息拥有所有权（您与用户之间的咨询信息除外），您在按照本协议规定正常使用本平台产品和服务或第三方产品和服务的过程中对属于其博一健康账户和第三方账户的数据信息享有非独家有限使用权。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.在不影响您正常接受服务的情况下，博一健康有权决定保留或不保留服务器上的全部或部分数据；第三方产品和服务中的各种数据属于第三方所提供的服务，其所有权归第三方所有，第三方产品和服务提供商有权决定保留或不保留服务器上的全部或部分数据。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.博一健康有可能主动收集包括但不限于以下数据和信息：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）为了优化给您提供的产品和服务，博一健康有可能收集您的浏览器性质、操作系统种类、给您提供接入服务的ISP域名等，以优化在您计算机或手机屏幕上显示的页面；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）为了给您提供软件升级服务，需要收集您PC端、移动端所安装软件的相关信息，例如：软件名称及版本等；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）博一健康进行客流量统计，从而改进网站的管理和服务，或进行网络行为的调查或研究。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.本协议所称商业秘密包括但不限于本协议、任何补充协议或政策所述内容及在合作过程中涉及的其他秘密信息。您未经商业秘密提供方同意，不得将该信息向任何第三方披露、传播、编辑或展示。您承诺，本协议终止后仍承担此条款下的保密义务，保密期将另持续三年。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您同意与博一健康一并保护本平台用户的个人身份信息、医疗信息、图文影像信息、联系方式、银行卡信息，以及其他能够据此直接或者间接识别出用户个人身份的隐私信息以及咨询内容、个人消费信息等。本协议所述的数据和信息，即您使用本平台产品和服务，以及第三方产品和服务中产生的数据和信息不属于本条款所指的隐私信息。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.博一健康保证不向第三方公开、提供或共享您的隐私信息，但以下情形除外：&nbsp;&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）博一健康已获得您的明确授权；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）需要公布在医疗机构中的资料和信息；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）博一健康为提升产品和服务质量；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）根据有关的法律法规要求，博一健康负有披露义务的；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）司法机关或行政机关基于法定程序要求博一健康提供的；&nbsp;&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）为维护社会公共利益及博一健康合法权益，在合理范围内进行披露的。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.博一健康尊重并尽最大努力保护您的隐私信息，但是不能保证现有的安全技术措施能确保您的个人信息不受任何形式的侵犯。您对上述情况充分理解并知晓，对因信息安全技术措施被破解失效、网络遭受病毒入侵、黑客攻击等非博一健康过错导致的损失，相关风险和后果均由您自己承担，博一健康不承担任何责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您的信任对博一健康非常重要，博一健康深知个人信息安全的重要性，博一健康将按照法律法规要求，采取安全保护措施，保护您的个人信息安全。具体详见《法律声明与隐私政策》。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.您在服务过程中获得的患者信息（包括但不限于可识别个人信息的照片、患者医疗信息等）仅能用作为患者提供医疗服务，使用完毕后您应当立刻删除相关信息。如因您的故意或过失致使用户的个人隐私信息泄露，您须单独向用户承担全部赔偿责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.在发起互联网会诊服务时，因您故意或过失未能按要求充分告知患者互联网会诊方式和所需提供个人信息范围、方式等内容，并取得患者用户明确同意而开展互联网会诊的，由此涉及的个人隐私信息不当获取、使用、处理、泄露，由您向患者用户承担全部赔偿责任。
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>违约和赔偿&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.如第三方对您发布的内容或向用户解答的内容持有异议或认为存在违法、侵权等情况并通知博一健康时，博一健康有权根据第三方的要求和所提交的证据以普通非专业的知识水平标准进行初步判断后自行做成处理决定，如您认为其他医师或任意第三方损害了您的合法权益，您可以通知博一健康并提供真实有效的证据后撤销该处理决定。如您在博一健康发信后2个工作日内未回复或未能提交充分的证据证明您的要求，博一健康将视情况继续屏蔽或删除相应内容，甚至暂停或终止账户使用。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.如您损害博一健康及相关服务的经营者的合法权益，或您导致博一健康及相关服务的经营者遭受任何来自第三方的纠纷、诉讼、索赔要求等，您须向博一健康赔偿相应的损失（包括由此产生的全额的诉讼费用和律师费），并需对因您的行为产生的一切后果负全部法律责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.除本协议及服务平台规则另有约定之外，如一方发生违约行为，守约方可以书面通知方式要求违约方在指定的时限内停止违约行为，并就违约行为造成的损失进行索赔，如违约方未能按时停止违约行为，则守约方有权立即终止本协议。&nbsp;&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>服务中止或终止&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您在停止接收新的医疗服务订单一年后或通过电子邮件形式告知博一健康终止本协议之日，本协议将自动终止。本协议终止后您的账号将被注销，本平台将依照有关规定将您的个人信息进行删除或去标识化处理，法律法规另有保留要求的除外。您若之后还想在本平台提供医疗时，需要重新提交申请并提供相关审核文件。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.下述任一原因发生，无需提前通知，博一健康有权单方面决定是否随时中止或终止服务，且按有关规则对您进行处罚。您同意并接受博一健康的处理决定：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）&nbsp;如您违反博一健康的任何规则或本协议中的任何承诺或保证。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）若您违反本协议或相关规定，经博一健康提醒仍不改正三次以上的；或因您的言行对博一健康造成人民币1000元以上损失的，博一健康有权终止本协议，并冻结您的账号、注册账号等。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）非因博一健康主观故意的过错，您无法使用服务；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）因不可抗力原因，服务中止或终止；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）博一健康无法预见和控制的原因，服务中止或终止；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）博一健康停止运营某特定产品和服务；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7）博一健康认为实际情形不再适宜继续履行本协议；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                8）本协议约定的其他情况。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.不论博一健康与您之间的服务因任何原因以任何方式终止，您同意并接受：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）博一健康有权保存或不保存您发布的内容及其他相关数据和信息，或转发任何未曾阅读或发送的信息给您或第三方。亦不就终止协议而您或任何第三者承担任何责任；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）在您注销账户后，博一健康有权选择对账户相关的个人信息采取删除或做匿名化处理，法律法规另有保留要求的除外；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）在服务终止之前，您和博一健康或其他第三方的交易尚未完成的，例如尚未下载完毕或尚未付款，博一健康有权在中断、终止服务的同时删除此项交易信息；
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）服务终止之前，您和博一健康或其他第三方的交易已完成的，对自交易完成之日起保存已满三年的交易信息，博一健康有权在中断、终止服务的同时删除此项交易信息。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）协议终止后，博一健康有权保留该您的注册数据及以前的服务行为记录。如您在协议终止前在服务平台上存在违法行为或违反协议的行为，博一健康仍可行使本协议所规定的权利。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.如无论因任何原因终止的，在终止之前，您应自行处理好数据、信息的备份以及与博一健康、任意第三方间的相关事项的处理等，否则，由此产生的您与任意第三方之间的纠纷等问题由您自行负责解决，并单独承担完全责任。由此造成博一健康损失的，您应负责赔偿。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.您必须完全独立地承担，您在服务终止前实施的违法或违约行为所导致的任何赔偿和责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.博一健康未行使本协议的任何权利或规定，不构成对前述权利之放弃。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.本条不影响博一健康按照本协议规定追究您的违约责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                不可抗力及通知&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件，包括但不限于自然灾害如洪水、地震、瘟疫流行和风暴等以及社会事件如战争、动乱、法规政策颁布和修改、行政行为、政府决定等。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.出现上述情况时，博一健康将努力在第一时间与相关单位配合，及时进行修复，若由此给您造成损失的，您同意放弃追究博一健康的责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.本协议下所规定的通知有权要求以书面形式通过以下邮址递交收悉，通知的到达以博一健康收悉为准。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4.博一健康联系方式地址：泰州市药城大道799-2号（数据大厦B幢1108-6）&nbsp;邮编：225316&nbsp;；收件人：严文慧（收）。电子邮箱：appstore@byhealth.net&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>免责条款&nbsp;</Text>
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.除非另有明确的书面说明，本平台及其所包含的或以其它方式通过本平台提供给您的全部信息、内容、材料、产品（包括软件）和服务，均是在“按现状”和“按现有”的基础上提供的。除非另有明确的书面说明，博一健康不对本平台的运营及其包含在本平台上的信息、内容、材料、产品（包括软件）或服务作任何形式的、明示或默示的声明或担保（根据中华人民共和国法律另有规定的以外）。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.博一健康所承载的内容（文、图、视频、音频）均为传播有益健康资讯目的，不对其真实性、科学性、准确性、严肃性做任何形式保证。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3.您应拒绝回复医疗健康之外的咨询问题，包括但不限于如下情况：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）非医疗健康类问题，如动物疾病问题、社会意识形态问题等；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）医疗司法举证或询证问题；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）胎儿性别鉴定问题；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）未按提问要求提问，如提问时未指定医生，却要求具体医生回复；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）有危害他人/自己可能的问题；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                6）追问医生个人信息的问题；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                7）故意挑逗、侮辱医生的提问。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您应遵守法律法规及本协议的约定及承诺，否则被行政机关、司法执法机构或第三方调查、举报，或被博一健康自行检查时发现的，及或因此损害博一健康及或第三方的权益的，您应当负责解决并承担全部法律责任；并且博一健康有权随时在不通知您的前提下按照如下方案予以处理，而不承担任何责任：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）不予发布、屏蔽或删除您发布的全部或部分的内容、数据和信息；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）封禁或删除您的账户，中/终止提供产品和服务；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                3）将您的行为对外予以公告；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                4）追究您的法律责任；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                5）其他博一健康认为适合的处理措施。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.您不得在本平台进行超出本协议限定范围的医疗活动（如在互联网会诊时单独直接作出诊断和开方，未获得患者知悉同意发起互联网会诊，互联网处方，首诊，对急重病进行诊疗等），否则造成的违法行为、医疗纠纷及相应损失，将由您承担全部责任。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.博一健康不因下述任一情况而可能导致的任何损害赔偿承担责任，包括但不限于财产、收益、数据资料等方面的损失或其它无形损失：&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1）因不可抗力导致博一健康系统障碍不能正常运作；&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2）由于黑客攻击、电信部门技术调整或故障、系统维护等原因而造成的平台服务中断或者延迟。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.鉴于网络服务的特殊性，博一健康有权在无需通知您的情况下根据博一健康及其关联企业的整体运营情况或相关运营规范、规则等，可以随时终止服务或停止运营。若由此给您造成损失的，您同意放弃追究博一健康的责任。对于此类情形下可能造成的风险，请您充分了解并同意自行承担由此可能造成的一切不利后果和损失。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.在法律允许的最大限度内，博一健康明确表示不对其产品和服务做出任何明示、暗示和强制的担保，包括但不限于安全性、可靠性、稳定性、及时性、适销性、针对特定用途的适用性以及不侵犯所有权或其他权益的担保。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                协议更新及医师关注义务&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.根据国家法律法规变化及网络运营需要，博一健康有权在不另行通知的情况下对本协议条款含相关的政策（包括但不限于结算规则等）不时地进行修改，修改后的协议即时生效并适用。您可随时登陆查阅最新协议；您有义务不时关注并阅读最新版的协议及本平台公告。如您不同意更新后的协议，您可以且应立即停止接受博一健康提供的服务；如您继续使用本平台提供的服务，即视为同意更新后的协议。博一健康建议您在使用本平台之前阅读本协议及本平台的公告。如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                法律管辖和适用&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.本协议的订立、执行和解释及争议的解决均应适用在中华人民共和国大陆地区适用之有效法律（但不包括其冲突法规则）。如发生本协议与适用之法律相抵触时，则这些条款将完全按法律规定重新解释，而其它有效条款继续有效。如缔约方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，双方在此同意由上海市人民法院管辖。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.如本协议的任何条款被视作无效或无法执行，则上述条款可被分离，其余部份则仍具有法律效力。&nbsp;&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>其他&nbsp;</Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                1.若博一健康用户对您的服务结果不满意，可以向博一健康提出投诉，博一健康将视情况协调沟通。&nbsp;
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                2.咨询双方因服务引起的纠纷，请博一健康给予调解的，博一健康将有权了解相关信息，并将双方提供的信息与对方沟通。因在博一健康上发生服务纠纷，引起诉讼的，您应通过司法部门或行政部门依照法定程序要求博一健康提供相关数据，博一健康将积极配合并提供有关资料。&nbsp;
              </Text>
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
}
