import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from "react-native";
import { List, TextareaItem, } from "antd-mobile-rn";
import LinearGradient from "react-native-linear-gradient";
import styles from "../../styles/common/RegisterManual";

export default class Manual extends Component {
  static navigationOptions = {
    title: '用户注册协议',
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
  };
  constructor(props) {
    super(props);
    this.state = {
      content: "",
    }
  }
  render() {

    return (
      <ScrollView>
        <View style={styles.about}>
          <Text style={styles.title}>聚财小神牛网站用户注册协议</Text>
          <View style={styles.content}>
            <Text style={styles.detail}>&nbsp;&nbsp;&nbsp;&nbsp; 本网站由上海犇沪信息技术有限公司及其关联实体(以下简称“我们”或“犇沪”)运营，我们依照以下注册协议向您提供本注册协议涉及的相关服务。请您使用“聚财小神牛”服务前仔细阅读本注册协议，并对协议的所有内容及含义进行充分了解。 您只有完全同意所有注册协议，才能成为“聚财小神牛”的用户（"用户"）并使用相应服务。您在注册为“聚财小神牛”用户过程中点击同意“聚财小神牛”用户注册协议"按钮即表示您已仔细阅读并明确同意遵守本注册协议以及经参引而并入其中的所有条款、政策以及指南，并受该等规则的约束（合称"本注册协议"）。我们可能根据法律法规的要求或业务运营的需要，对本注册协议不时进行修改。除非另有规定，否则任何变更或修改将在修订内容于“聚财小神牛”发布之时立即生效，您对“聚财小神牛”的使用、继续使用将表明您接受此等变更或修改。如果您不同意本注册协议（包括我们可能不定时对其或其中引述的其他规则所进行的任何修改）的全部规定，则请勿使用“聚财小神牛”提供的所有服务，或您可以主动取消“聚财小神牛”提供的服务。 </Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;为了便于您了解适用于您使用“聚财小神牛”的条款和条件，我们将在“聚财小神牛”上发布我们对本注册协议的修改，您应不时地审阅本注册协议以及经参引而并入其中的其他规则。</Text>

            <Text style={styles.detailTitle}>一、服务内容</Text>
            <Text style={styles.detail}>1.1 “聚财小神牛”的具体服务内容由我们根据实际情况提供并不时更新，包括但不限于信息、图片、文章、评论、链接等，我们将定期或不定期根据用户的意愿以电子邮件、短信、电话或站内信等方式为用户提供活动信息，并向用户提供相应服务。我们对提供的服务拥有最终解释权。 </Text>
            <Text style={styles.detail}>1.2 “聚财小神牛”服务仅供个人用户使用。除我们书面同意，您或其他用户均不得将“聚财小神牛”上的任何信息用于商业目的。 </Text>
            <Text style={styles.detailTitle}>1.3 您使用“聚财小神牛”服务时所需的相关的设备以及网络资源等（如个人电脑及其他与接入互联网或移动网有关的装置）及所需的费用（如为接入互联网而支付的电话费及上网费）均由您自行负担。</Text>

            <Text style={styles.detailTitle}>二、信息提供和隐私保护</Text>
            <Text style={styles.detail}>2.1 您在访问、使用“聚财小神牛”或申请使用“聚财小神牛”服务时，必须提供本人真实的个人信息，且您应该根据实际变动情况及时更新个人信息。保护用户隐私是我们的重点原则，我们通过各种技术手段和强化内部管理等办法提供隐私保护服务功能，充分保护您的个人信息安全。  </Text>
            <Text style={styles.detail}>2.2 “聚财小神牛”不负责审核您提供的个人信息的真实性、准确性或完整性，因信息不真实、不准确或不完整而引起的任何问题及其后果，由您自行承担，且您应保证我们免受由此而产生的任何损害或责任，否则相应损失和责任都最终将由您来承担。若我们发现您提供的个人信息是虚假、不准确或不完整的，我们有权自行决定终止向您提供服务。  </Text>
            <Text style={styles.detail}>2.3 您在此明确授权，为提供服务、履行协议、解决争议、保障交易安全等目的，我们对您提供的、我们自行收集的及通过第三方收集的您的个人信息、您申请服务时的相关信息、您在使用服务时储存在“聚财小神牛”的非公开内容以及您的其他个人资料（以下简称“个人资料”）享有留存、整理加工、使用和披露的权利，且您明确授权“聚财小神牛”及其关联公司及其指定的第三方可留存、整理及加工本次获取的本人信息用于“聚财小神牛”及其关联公司及其指定的第三方为您提供的包括但不限于营销等其他服务中，具体方式包括但不限于：  </Text>
            <Text style={styles.detail}> &nbsp;&nbsp;&nbsp;&nbsp;（1）出于为您提供服务的需要在本网站公示您的个人资料；</Text>
            <Text style={styles.detail}> &nbsp;&nbsp;&nbsp;&nbsp;（2）由人工或自动程序对您的个人资料进行获取、评估、整理、存储；</Text>
            <Text style={styles.detail}> &nbsp;&nbsp;&nbsp;&nbsp;（3）使用您的个人资料以改进本网站的设计和推广； </Text>
            <Text style={styles.detail}> &nbsp;&nbsp;&nbsp;&nbsp;（4）使用您提供的联系方式与您联络并向您传递有关服务和管理方面的信息；</Text>
            <Text style={styles.detail}> &nbsp;&nbsp;&nbsp;&nbsp;（5）对您的个人资料进行分析整合并向为您提供服务的第三方提供为完成该项服务必要的信息。当为您提供服务的第三方与您电话核实信息时，为保证为您服务的质量，你同意“聚财小神牛”对上述核实电话进行录音。 </Text>
            <Text style={styles.detail}> &nbsp;&nbsp;&nbsp;&nbsp;（6）在您违反与我们或我们的其他用户签订的协议时，披露您的个人资料及违约事实，将您的违约信息写入黑名单并与必要的第三方共享数据，以供我们及第三方审核、追索之用。 </Text>
            <Text style={styles.detail}> &nbsp;&nbsp;&nbsp;&nbsp;（7）其他必要的使用及披露您个人资料的情形。您已明确同意本条款不因您终止使用“聚财小神牛”服务而失效。如因我们行使本条款项下权利使您遭受损失，我们对该等损失免责。</Text>
            <Text style={styles.detail}>2.4 您同意并授权“聚财小神牛”（或其委托或合作的第三方）在您使用服务期间，向包含但不限于中国人民银行征信中心及其分支机构以及其他信息服务机构查询并获取您的个人信息（包括但不限于身份信息、联系方式、工作信息、银行卡交易信息、银行服务相关信息、网络交易信息、逾期信息及其他信息等）【您已经充分理解并知晓该等信息被提供和使用的风险，包括但不限于：上述信息对您的信用评价、以及分析报告等结果产生不利影响的风险；该等信息依法提供给“聚财小神牛”或其委托或合作的第三方）后可能被第三方不当利用的风险；以及基于您的特定信用状况可能被不良信息骚扰的风险等。】，以了解您资信状况。</Text>
            <Text style={styles.detail}> 2.5 您同意并授权包括但不限于中国人民银行征信中心及其分支机构以及其他信息服务机构可将其拥有的您的信息提供给“聚财小神牛”（或其委托或合作的第三方），用于您申请借款、审批及贷后管理等事项。</Text>
            <Text style={styles.detail}> 2.6 您同意并授权“聚财小神牛”（或其委托或合作的第三方）向包括但不限于中国人民银行征信中心及其分支机构以及其他信息服务机构上传您在借款过程生成的资信信息。同时，您同意并授权包括但不限于中国人民银行征信中心及其分支机构以及其他信息服务机构接收“聚财小神牛”（或其委托或合作的第三方）上传的您在借款过程生成的资信信息。</Text>
            <Text style={styles.detail}> 2.7 为更好地为您提供服务，您同意并授权“聚财小神牛”可与其合作的第三方进行联合研究，并可将通过本协议获得的您的信息投入到该等联合研究中。但“聚财小神牛”其合作的第三方在开展上述联合研究前，应要求其合作的第三方对在联合研究中所获取的您的信息予以保密。</Text>
            {/*信息推送给为您提供**jr-**  */}
            <Text style={styles.detail}> 2.8 若您曾经已经登陆过“聚财小神牛”，且已经授权“聚财小神牛”完成了相应的信息获取事宜，当您再次登陆“聚财小神牛”，并选择相关产品时，您授权“聚财小神牛”自动将之前授权获取的您的信息推送给为您提供服务的机构。</Text>
            <Text style={styles.detail}>2.9 我们保证采用行业惯例以保护您的资料，但您理解，鉴于技术限制，我们无法确保用户的个人信息完全不被泄露。 </Text>
            <Text style={styles.detail}> 2.10 我们不会向与您无关的第三方恶意出售或免费提供您的个人资料，但下列情况除外：</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（1）事先获得您的明确授权；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（2）按照相关司法机构或政府主管部门的要求；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（3）以维护我们合法权益之目的； </Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（4）维护社会公众利益；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;5）为确保“聚财小神牛”业务和系统的完整与操作；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（6）符合其他合法要求。</Text>
            <Text style={styles.detail}> 2.11 本授权书可在您接受“聚财小神牛”（或其委托或合作的第三方）提供服务的过程中多次使用，“聚财小神牛”（或其委托或合作的第三方）及合作机构自您签署本授权之日起可多次依据本授权书而操作执行本授权书项下的活动无需您另行授权。</Text>
            <Text style={styles.detail}> 2.12 您确认已充分被告知、了解并接受上述授权的法律后果。</Text>

            <Text style={styles.detailTitle}>三、使用准则</Text>
            <Text style={styles.detail}>3.1 您在使用“聚财小神牛”服务过程中，必须遵循国家的相关法律法规，不通过“聚财小神牛”发布、复制、上传、散播、分发、存储、创建或以其它方式公开含有以下内容的信息： </Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（1）反对宪法所确定的基本原则的； </Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（3）损害国家荣誉和利益的； </Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（4）煽动民族仇恨、民族歧视，破坏民族团结的； </Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（5）破坏国家宗教政策，宣扬邪教和封建迷信的；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（6）散布谣言，扰乱社会秩序，破坏社会稳定的；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的、欺诈性的或以其它令人反感的讯息、数据、信息、文本、音乐、声音、照片、图形、代码或其它材料； </Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（8）侮辱或者诽谤他人，侵害他人合法权益的； </Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（9）其他违反宪法和法律、行政法规或规章制度的； </Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（10）可能侵犯他人的专利、商标、商业秘密、版权或其它知识产权或专有权利的内容；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（11）假冒任何人或实体或以其它方式歪曲您与任何人或实体之关联性的内容；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（12）未经请求而擅自提供的促销信息、政治活动、广告或意见征集； </Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（13）任何第三方的私人信息，包括但不限于地址、电话号码、电子邮件地址、身份证号以及信用卡卡号；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（14）病毒、不可靠数据或其它有害的、破坏性的或危害性的文件；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（15）与内容所在的互动区域的话题不相关的内容；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（16）依我们的自行判断，足以令人反感的内容，或者限制或妨碍他人使用或享受互动区域或“聚财小神牛”的内容，或者可能使我们或我们关联方或其他用户遭致任何类型损害或责任的内容； </Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（17）包含法律或行政法规禁止内容的其他内容。</Text>
            <Text style={styles.detail}>  3.2 用户不得利用“聚财小神牛”的服务从事下列危害互联网信息网络安全的活动：</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（1）未经允许，进入计算机信息网络或者使用计算机信息网络资源；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（2）未经允许，对计算机信息网络功能进行删除、修改或者增加；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（3）未经允许，对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（4）故意制作、传播计算机病毒等破坏性程序；</Text>
            <Text style={styles.detail}>  &nbsp;&nbsp;&nbsp;&nbsp;（5）其他危害计算机信息网络安全的行为。</Text>
            <Text style={styles.detail}>3.3 我们保留在任何时候为任何理由而不经通知地过滤、移除、筛查或编辑本网站上发布或存储的任何内容的权利，您须自行负责备份和替换在本网站发布或存储的任何内容，成本和费用自理。</Text>
            <Text style={styles.detail}>  3.4 您须对自己在使用“聚财小神牛”服务过程中的行为承担法律责任。若您为限制行为能力或无行为能力者，则您的法定监护人应承担相应的法律责任。</Text>
            <Text style={styles.detail}>  3.5 如您的操作影响系统总体稳定性或完整性，我们将暂停或终止您的操作，直到相关问题得到解决。</Text>

            <Text style={styles.detailTitle}>  四、免责声明</Text>
            <Text style={styles.detail}> 4.1 “聚财小神牛”是一个开放平台，用户将资料或照片等个人资料上传到互联网上，有可能会被其他组织或个人复制、转载、擅改或做其它非法用途，用户必须充分意识此类风险的存在。作为网络服务的提供者，我们对用户在任何论坛、个人主页或其它互动区域提供的任何陈述、声明或内容均不承担责任。您明确同意使用“聚财小神牛”服务所存在的风险或产生的一切后果将完全由您自身承担，我们对上述风险或后果不承担任何责任。</Text>
            <Text style={styles.detail}> 4.2 您违反本注册协议、违反道德或法律的，侵犯他人权利（包括但不限于知识产权）的，我们不承担任何责任。同时，我们对任何第三方通过“聚财小神牛”发送服务或包含在服务中的任何内容不承担责任。 </Text>
            <Text style={styles.detail}>  4.3 对您、其他用户或任何第三方发布、存储或上传的任何内容或由该等内容导致的任何损失或损害，我们不承担责任。</Text>
            <Text style={styles.detail}> 4.4 对任何第三方通过“聚财小神牛”可能对您造成的任何错误、中伤、诽谤、诬蔑、不作为、谬误、淫秽、色情或亵渎，我们不承担责任。</Text>
            <Text style={styles.detail}> 4.5 对黑客行为、计算机病毒、或因您保管疏忽致使帐号、密码被他人非法使用、盗用、篡改的或丢失，或由于与本网站链接的其它网站所造成您个人资料的泄露，我们不承担责任。如您发现任何非法使用用户帐号或安全漏洞的情况，请立即与我们联系。</Text>
            <Text style={styles.detail}>  4.6 因任何非“聚财小神牛”原因造成的网络服务中断或其他缺陷，我们不承担任何责任。</Text>
            <Text style={styles.detail}> 4.7 我们不保证服务一定能满足您的要求；不保证服务不会中断，也不保证服务的及时性、安全性、准确性。</Text>
            <Text style={styles.detail}>  4.8 任何情况下，因使用“聚财小神牛”而引起或与使用“聚财小神牛”有关的而产生的由我们负担的责任总额，无论是基于合同、保证、侵权、产品责任、严格责任或其它理论，均不得超过您因访问或使用本网站而向“聚财小神牛”支付的任何报酬（如果有的话）。</Text>
            <Text style={styles.detail}>  4.9 “聚财小神牛”提供免费的服务搜索和推荐服务，服务过程中遇到的任何预先收费均为诈骗行为，请保持警惕避免损失。</Text>

            <Text style={styles.detailTitle}> 五、服务变更、中断或终止</Text>
            <Text style={styles.detail}> 5.1 如因升级的需要而需暂停网络服务、或调整服务内容，我们将尽可能在网站上进行通告。由于用户未能及时浏览通告而造成的损失，我们不承担任何责任。 </Text>
            <Text style={styles.detail}> 5.2 您明确同意，我们保留根据实际情况随时调整“聚财小神牛”提供的服务内容、种类和形式，或自行决定授权第三方向您提供原本我们提供的服务。因业务调整给您或其他用户造成的损失，我们不承担任何责任。同时，我们保留随时变更、中断或终止“聚财小神牛”全部或部分服务的权利。 </Text>
            <Text style={styles.detail}> 5.3 发生下列任何一种情形，我们有权单方面中断或终止向您提供服务而无需通知您，且无需对您或第三方承担任何责任：</Text>
            <Text style={styles.detail}>&nbsp;&nbsp;&nbsp;&nbsp;（1）您提供的个人资料不真实；  </Text>
            <Text style={styles.detail}>&nbsp;&nbsp;&nbsp;&nbsp;（2）您违反本服务条款；  </Text>
            <Text style={styles.detail}>&nbsp;&nbsp;&nbsp;&nbsp;（3）未经我们书面同意，将“聚财小神牛”平台用于商业目的。 </Text>
            <Text style={styles.detail}> 5.4 您可随时通知我们终止向您提供服务或直接取消“聚财小神牛”服务。自您终止或取消服务之日起，我们不再向您承担任何形式的责任。</Text>

            <Text style={styles.detailTitle}>六、知识产权及其它权利 </Text>
            <Text style={styles.detail}> 6.1 用户可以充分利用“聚财小神牛”平台共享信息。您可以在“聚财小神牛”发布从“聚财小神牛”个人主页或其他网站复制的图片和信息等内容，但这些内容必须属于公共领域或者您拥有以上述使用方式使用该等内容的权利，且您有权对该等内容作出本条款下之授权、同意、认可或承诺。 </Text>
            <Text style={styles.detail}>6.2 对您在“聚财小神牛”发布或以其它方式传播的内容，您作如下声明和保证： </Text>
            <Text style={styles.detail}>&nbsp;&nbsp;&nbsp;&nbsp; （i）对于该等内容，您具有所有权或使用权；  </Text>
            <Text style={styles.detail}>&nbsp;&nbsp;&nbsp;&nbsp; （ii）该等内容是合法的、真实的、准确的、非误导性的； </Text>
            <Text style={styles.detail}>&nbsp;&nbsp;&nbsp;&nbsp; （iii）使用和发布此等内容或以其它方式传播此等内容不违反本注册条款，也不侵犯任何人或实体的任何权利或造成对任何人或实体的伤害。</Text>
            <Text style={styles.detail}> 6.3 未经相关内容权利人的事先书面同意，您不得擅自复制、传播在“聚财小神牛”的该等内容，或将其用于任何商业目的，所有这些资料或资料的任何部分仅可作为个人或非商业用途而保存在某台计算机内。否则，我们及/或权利人将追究您的法律责任。</Text>
            <Text style={styles.detail}> 6.4 您在“聚财小神牛”发布或传播的自有内容或具有使用权的内容，您特此同意如下：</Text>
            <Text style={styles.detail}>&nbsp;&nbsp;&nbsp;&nbsp; （1）授予我们使用、复制、修改、改编、翻译、传播、发表此等内容，从此等内容创建派生作品，以及在全世界范围内通过任何媒介（现在已知的或今后发明的）公开展示和表演此等内容的权利；  </Text>
            <Text style={styles.detail}>&nbsp;&nbsp;&nbsp;&nbsp; （2）授予“聚财小神牛”及其关联方和再许可人一项权利，可依他们的选择而使用用户有关此等内容而提交的名称；  </Text>
            <Text style={styles.detail}>&nbsp;&nbsp;&nbsp;&nbsp; （3）授予我们在第三方侵犯您在“聚财小神牛”的权益、或您发布在“聚财小神牛”的内容情况下，依法追究其责任的权利（但这并非我们的义务）； </Text>
            <Text style={styles.detail}>6.5 您在“聚财小神牛”公开发布或传播的内容、图片等为非保密信息，我们没有义务将此等信息作为您的保密信息对待。在不限制前述规定的前提下，我们保留以适当的方式使用内容的权利，包括但不限于删除、编辑、更改、不予采纳或拒绝发布。我们无义务就您提交的内容而向您付款。一旦内容已在“聚财小神牛”发布，我们也不保证向您提供对在融360发布内容进行编辑、删除或作其它修改的机会。  </Text>
            <Text style={styles.detail}>6.6 如有权利人发现您在“聚财小神牛”发表的内容侵犯其权利，并依相关法律、行政法规的规定向我们发出书面通知的，“聚财小神牛”有权在不事先通知您的情况下自行移除相关内容，并依法保留相关数据。您同意不因该种移除行为向我们主张任何赔偿，如我们因此遭受任何损失，您应向赔偿我们的损失（包括但不限于赔偿各种费用及律师费）。 </Text>
            <Text style={styles.detail}>6.7 若您认为您发布第6.6条指向内容并未侵犯其他方的权利，您可以向我们以书面方式说明被移除内容不侵犯其他方权利的书面通知，该书面通知应包含如下内容：您详细的身份证明、住址、联系方式、您认为被移除内容不侵犯其他方权利的证明、被移除内容在“聚财小神牛”上的位置以及书面通知内容的真实性声明。我们收到该书面通知后，有权决定是否恢复被移除内容。 </Text>
            <Text style={styles.detail}>6.7 若您认为您发布第6.6条指向内容并未侵犯其他方的权利，您可以向我们以书面方式说明被移除内容不侵犯其他方权利的书面通知，该书面通知应包含如下内容：您详细的身份证明、住址、联系方式、您认为被移除内容不侵犯其他方权利的证明、被移除内容在“聚财小神牛”上的位置以及书面通知内容的真实性声明。我们收到该书面通知后，有权决定是否恢复被移除内容。 </Text>
            <Text style={styles.detail}> 6.8 您特此同意，如果6.7条中的书面通知的陈述失实，您将承担由此造成的全部法律责任，如我们因此遭受任何损失，您应向赔偿我们的损失（包括但不限于赔偿各种费用及律师费）。</Text>

            <Text style={styles.detailTitle}>七、特别约定 </Text>
            <Text style={styles.detail}>7.1 您使用本服务的行为若有任何违反国家法律法规或侵犯任何第三方的合法权益的情形时，我们有权直接删除该等违反规定之信息，并可以暂停或终止向您提供服务。 </Text>
            <Text style={styles.detail}>7.2 若您利用“聚财小神牛”服务从事任何违法或侵权行为，由您自行承担全部责任，因此给我们或任何第三方造成任何损失，您应负责全额赔偿，并使我们免受由此产生的任何损害。 </Text>
            <Text style={styles.detail}>7.3 您同意我们通过重要页面的公告、通告、电子邮件以及常规信件的形式向您传送与“聚财小神牛”服务有关的任何通知和通告。  </Text>
            <Text style={styles.detail}>7.4 如您有任何有关与“聚财小神牛”服务的个人信息保护相关投诉，请您与我们联系，我们将在接到投诉之日起15日内进行答复。  </Text>
            <Text style={styles.detail}>7.5 本服务条款之效力、解释、执行均适用中华人民共和国法律。 </Text>
            <Text style={styles.detail}>7.6 若非“聚财小神牛”更新本协议，您再确认同意、签署本协议后，其效力将及于您此时及未来登陆“聚财小神牛”时所有操作。  </Text>
            <Text style={styles.detail}>7.7 您在本协议项下对本公司的授权将视为对本公司及本公司之关联公司的授权。本公司及本公司关联公司均可凭借您的授权及本协议约定执行相关操作。
                         </Text>
            <Text style={styles.detail}>7.8 如就本协议内容或其执行发生任何争议，应尽量友好协商解决；协商不成时，任何一方均可向上海犇沪信息技术有限公司所在地的人民法院提起诉讼。 </Text>
            <Text style={styles.detail}>7.9 本注册协议中的标题仅为方便而设，不影响对于条款本身的解释。本注册协议最终解释权归上海犇沪信息技术有限公司及其关联实体所有。 </Text>

          </View>
        </View>
      </ScrollView>
    );
  }
}

