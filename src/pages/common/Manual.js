import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from "react-native";
import { List, TextareaItem, } from "antd-mobile-rn";
import LinearGradient from "react-native-linear-gradient";
import styles from "../../styles/common/Manual";

export default class Manual extends Component {
    static navigationOptions = {
        title: '业务员合作协议',
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
                    <Text style={styles.title}>合作协议</Text>
                    <View style={styles.content}>
                        <Text style={styles.detail}>&nbsp;&nbsp;&nbsp;&nbsp;小金牛网站，小金牛移动软件（以下简称“小金牛”）是由上海犇沪信息技术有限公司及其相关联实体运营，为支持互联网金融信息市场的培育和发展，促进双方业务，我们与您建立友好、平等的合作关系。在您身份认证及资质审核通过后，您将成为小金牛的信贷员，我们根据您的需求为您提供相关服务。为明确约定各方权利和义务，我们与您签订合作协议及其它附属协议文件（以下简称 “本协议”），本协议以电子协议方式签订，在您点击“阅读本协议”后即视为您已同意本协议的全部内容，并愿意接受协议的约束。</Text>
                        <Text style={styles.detail}>  以下小金牛简称；甲方或我们</Text>
                        <Text style={styles.detail}>  合作信贷员简称；乙方或您</Text>
                        <Text style={styles.detailTitle}>一、合作模式 </Text>
                        <Text style={styles.detail}> 1、 甲方接受乙方委托，对于通过甲方关联方经营的网站www.shjinniu.cn移动软件申请借款的借款申请人(以下简称“借款申请人”或“借款用户”)，就其与乙方所属平台或机构之间可能发生的借款业务（以下简称“借款”）提供业务信息推荐等相关方面的咨询，撮合服务，配合乙方开展撮合借款业务。</Text>

                        <Text style={styles.detailTitle}>二、乙方的权利和义务</Text>
                        <Text style={styles.detail}> 1、基于业务模式，我们将受理借款申请人的借款申请。我们接受您的委托，按照您提供的需求，向您提供借款申请人的资料（为保证借款申请人的信息安全，部分资料可能进行脱敏处理），促成您所属平台或机构与借款申请人之间的联系。</Text>
                        <Text style={styles.detail}> 2、在向您提供服务之前，我们将对您进行身份验证，您应该向我们提供真实，有效的个人信息，包括但不限于您的身份证彩色照片（正反面）、您本人实名制认证的手机号码、居住地址、工作信息、工卡或名片、现存有效劳动合同、工作单位前台或对公固定电话号码等。出现任何工作或其他信息变动时，您应第一时间告知我们并重新进行身份验证。若您的身份认证未通过或您的行为违反本协议、附属协议文件后被我们取消身份验证，您需要重新申请身份认证并提交相关证件、文件等。</Text>
                        <Text style={styles.detail}> 3、 乙方应遵纪守法，维护甲方声誉，保护甲方利益。乙方要严格遵守甲方制定的各项有关规定，不得做出有损于甲方形象和经济效益的事情。</Text>
                        <Text style={styles.detail}> 4、乙方不得从事任何有损甲方的活动，非经甲方书面特别授权，乙方无权代表甲方或甲方的业务人员发表任何言论，或要求甲方为其言论承担责任；乙方不得将从甲方处获悉的信息及所接受的培训用于甲方以外的业务领域。</Text>
                        <Text style={styles.detail}>5、乙方不得诋毁甲方及甲方的其他业务人员，不得扰乱甲方及甲方的其他业务人员正常经营秩序；</Text>
                        <Text style={styles.detail}>6、乙方应如实介绍甲方服务，不得对甲方或甲方服务进行夸大、虚假宣传，不得误导甲方用户；</Text>
                        <Text style={styles.detail}>7、甲方网络平台为借款人提供免费的服务，乙方从甲方平台获取的客户，要按照客户需求提供相对应的服务，乙方在对客户提供服务时要遵守国家的法律法规，不准欺骗客户，不准违反国家法律、不准以甲方或平台名义向借款申请人收取任何费用。若违反本条款约定，乙方将承担所有责任。</Text>
                        <Text style={styles.detail}>8、乙方不得在未经借款申请人许可的情况下，将其个人信息向第三方透露，如违反本条款，甲方将取消乙方的认证资格并终止合作。您的行为导致借款申请人投诉，您应配合我们所有投诉处理工作；给我们申请人造成损失的，您因承担全部责任。</Text>
                        <Text style={styles.detail}>9、为规范及保护您在小金牛的操作，您应仔细阅读并遵守本协议附件《信贷员合作行为规范》所约定的全部内容。</Text>
                        <Text style={styles.detail}>10、乙方与借款申请人联系所使用的手机号码应为您已做实名制备案的非虚拟号码，且在与借款申请人通话时可显示全部、真实号段。</Text>
                        <Text style={styles.detail}>11、乙方理解并认可，甲方对乙方所属的平台或机构与借款人之间产生的争议无关，甲方对此不承担任何责任。</Text>

                        <Text style={styles.detailTitle}>三、小金牛的权利及义务</Text>
                        <Text style={styles.detail}>1、您已明确授权，为提供服务、履行协议、解决争议、保障交易安全等目的，我们对您提供的、我们自行收集的及通过第三方收集的您的个人信息、您在使用服务时储存在小金牛的非公开内容以及您的其他个人资料（以下简称“个人资料”）享有留存、整理加工、使用和披露的权利。保护用户隐私是我们重点原则，我们通过各种技术手段和强化内部管理等办法提供隐私保护服务功能，在技术条件允许的范围内充分保护您的个人信息安全。</Text>
                        <Text style={styles.detail}> 2、我们将不断完善搜索机制，提高所推荐借款申请人的准确性。对您提出的合理建议，包括不限于产品及审批条件的描述不准确，产品及审批条件变化等，我们将予以考虑并视情况改进。</Text>
                        <Text style={styles.detail}> 3、您同意并授权我们对您与用户的首次通话进行录音并将录音备份与保存，此录音仅用于判断是否属于无效退费情况，我们对此录音不承担任何侵权责任。</Text>
                        <Text style={styles.detail}> 4、您应确保在收到借款人申请资料后24小时之内与借款申请人取得初次联系，并确保服务质量；并应向我们反馈借款申请人申请的进展。如果您无法保证与我们提供的借款申请人进行及时联系，则该种情况持续超过七天后，我们有权按照《信贷员合作行为规定》对您作出对应处罚措施，原有我们的应得利益仍应继续得到保证。</Text>
                        <Text style={styles.detail}> 5、您对借款人的借款申请有完全的选择权和决定权，对不符合您要求的借款申请，您可予以否决，并通知我们否决的原因。</Text>
                        <Text style={styles.detail}> 6、您确认在本协议项下提供的服务符合国家法律法规的相关规定。</Text>

                        <Text style={styles.detailTitle}> 四、收费方式和标准</Text>
                        <Text style={styles.detail}> 1、我们将采取收取预付款的方式，向你收取预付推荐服务费。收费标准将根据不同时间进行更新，我们会通过线上后台、线下沟通或在线通知等方式告知您。在您享受我们的服务之前，你应提交本协议约定的相关证件资料，在您通过我们身份认证审核且完成预付费后，我们将为您提供服务。如您所支付的预付款已使用完毕的，我们将暂停您在平台上的所有权利，直至您继续支付预付款后再行开通。</Text>
                        <Text style={styles.detail}> 2、如您未在合同有效期内使用完已支付的预付款，协议到期后双方在签署协议的，若根据协议规定，不涉及扣除预付款的，您可按照约定继续使用该费用。如您未在合同有效期内使用完已支付的预付款，双方未能继续签署协议的，若按照约定不涉及扣除预付款的，我们将自本协议期限届满之日起10个工作日内按照原财务路径无息退还您剩余的已支付预付款。</Text>
                        <Text style={styles.detail}> 3、随着业务发展的需要我们保留对单个信息底价及规则随时调整的权利。对变更事项，我们将提前通知您。若您不同意我们对单个信息底价及规则的调整，应于收到我们调整通知之日起5个工作日内与我们协商终止本协议。但若您收到我们调整通知后5个工作日内，未提出任何异议的，则将视为您接受了我们的调整，我们将按照新价格与规则予以执行。</Text>

                        <Text style={styles.detailTitle}>五、合作具体内容及程序</Text>
                        <Text style={styles.detail}> 1、在您成功注册后，我们将向您提供系统平台的账号。在您通过审核并充值后，您可以使用该账号就您所属平台或机构的产品进行推广且接受推荐服务。</Text>
                        <Text style={styles.detail}> 2、我们向您推送借款申请人信息时，我们将按照本协议约定从您预支付的服务费中收取相应金额。我们会向您及借款申请人分别发送短信，促成双方联系；此短信仅作为推荐数量的参考，当您收到的短信数低于实际获得信息的借款申请人数量时，以实际获取的人数为准。</Text>
                        <Text style={styles.detail}>3、当日产品推广次数达到您设定的上限时，您的排位将自动调整。 </Text>
                        <Text style={styles.detail}>4、您在建立与借款申请人的联系后，应依据您的要求进行审批，并向我们反馈进展情况。 </Text>
                        <Text style={styles.detail}>5、您应该妥善保管其账户信息，任何您的操作失误，疏忽，或被第三方盗用，均由您自行承担相应后果，如我们无关。 </Text>

                        <Text style={styles.detailTitle}>六、知识产权及保密条款</Text>
                        <Text style={styles.detail}> 1、未经对方许可，您不得向第三方（根据法律规定的除外）泄漏本协议条款的任何内容以及本协议的签订及履行情况。以及通过签订和履行本协议而获知的我们、我们客户（包括借款申请人）及关联公司的任何信息。</Text>
                        <Text style={styles.detail}> 2、您保证将我们的系统只应用于本协议的用途，不会对该系统进行反相汇编等类似反向操作，且不会在合作期间自行开发类似产品。</Text>
                        <Text style={styles.detail}> 3、本协议终止后，双方仍应履行其在本条款项下的义务。</Text>

                        <Text style={styles.detailTitle}>七、违约责任</Text>
                        <Text style={styles.detail}> 1、若您违反本协议的任何条款、不履行应尽之义务或者履行义务不符合本协议之约定的，则应被视为违反了在本协议项下之义务。我们有权向您发出书面通知，您应于收到收到书面通知之日起3日内纠正违约行为。否则我们有权按照《信贷员合作行为规定》对您作出对应处罚措施或立即解除本协议，封停您的账号并删除您的全部账号、交易信息，同时，我们有权要求您赔偿因违约行为而给我们造成的全部损失。</Text>
                        <Text style={styles.detail}> 2、若我们违反本协议的任何条款、不履行应尽之义务或者履行义务不符合本协议之约定的，则应被视为违反了在本协议下之义务。您可通过后台、客户反馈问题或投诉等方式维权。</Text>
                        <Text style={styles.detail}>3、若我们因您原因而遭受到申请人或任何第三方的索赔，由您自行承担责任，您应自行解决或全程协助、配合我们解决问题，同时您应向我们补偿由此给我们造成的损失。</Text>

                        <Text style={styles.detailTitle}>八、协议期限 </Text>
                        <Text style={styles.detail}> 1、本协议自您点击“阅读并同意合作协议”后生效，自您的身份认证被我们根据本协议及其他附属协议文件内容认定失效之日起终止。</Text>
                        <Text style={styles.detail}> 2、在本协议到期或提前终止后，如您在小金牛的费用未消耗完毕，我们将根据本协议及其他附属协议文件的约定处理。</Text>

                        <Text style={styles.detailTitle}>九、其他</Text>
                        <Text style={styles.detail}> 1、其他未尽事宜，依据我国法律法规及我们相关规定办理。协议履行中发生争议的，双方应协商解决。协商不成的，可向虹口区人民法院起诉。本协议适应于中国法律。</Text>
                        <Text style={styles.detail}> 2、本协议签订予上海市虹口区。</Text>
                        <Text style={styles.detail}> 3、本协议的注解、附件、补充协议为本协议的组成部分，与本协议具有同等法律效力。</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

