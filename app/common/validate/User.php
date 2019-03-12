<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2019/3/12
 * Time: 15:56
 */

namespace app\common\validate;

use app\common\model\User as UserModel;
use bdk\app\common\validate\User as BdkValid;
use bdk\Common as Bdk;

class User extends BdkValid
{
    public const SCENE = [
        'commonUserAccountLogin' => 'commonUserAccountLogin',
        'accountLogin'           => 'accountLogin',
        'emailLogin'             => 'emailLogin',
        'emailRegister'          => 'emailRegister',
        'phoneLogin'             => 'phoneLogin',
        'editInfo'               => 'editInfo',
        'modifyPwd'              => 'modifyPwd',
        'add'                    => 'add',
        'sendVerifyPhoneSms'     => 'sendVerifyPhoneSms',
    ];
    protected $rule    = [
        'account'                 => 'require|validAccount:thinkphp|unique:user,account',
        'loginAccount'            => 'require',
        'commonUserLoginAccount'  => 'require|validCommonUserAccount:thinkphp',
        'pwd'                     => 'require|validPwd:thinkphp',
        'loginPwd'                => 'require',
        'rePwd'                   => 'require|confirm:pwd',
        'isAdmin'                 => 'require|bool',
        'accountVerifyCode'       => 'require|captcha',
        'email'                   => 'email|unique:user,email',
        //邮箱登录时提交的邮箱地址,为了保证发送验证码的邮箱和提交的一样
        'emailLoginEmail'         => 'require|validEmailLoginEmail:thinkphp',
        'emailLoginVerifyCode'    => 'require|validEmailLoginVerifyCode:thinkphp',
        'emailRegisterEmail'      => 'require|validEmailRegisterEmail:thinkphp',
        'emailRegisterVerifyCode' => 'require|validEmailRegisterVerifyCode:thinkphp',
        'loginPhone'              => 'require|validPhone:thinkphp|isLoginSendVerifyCodePhone:thinkphp',
        'loginPhoneVerifyCode'    => 'require|validLoginPhoneVerifyCode:thinkphp',
        'editNick'                => 'length:2,10,|chsDash|unique:user,nick',
        'editEmail'               => 'email|unique:user,email',
        'editPhone'               => 'phone|unique:user,phone',
        'profile'                 => 'max:500',
        'modifyOriPwd'            => 'require|validOriPwd:thinkphp',
        'modifyNewPwd'            => 'require|validPwd:thinkphp',
        'modifyRePwd'             => 'require|confirm:modifyNewPwd',
        # sendVerifyPhoneSms 绑定手机号码发送短信
        'verifyPhoneNo'           => 'require|validVerifyPhone:thinkphp',
    ];
    protected $message = [
        'modifyOriPwd.require'     => '原密码必填',
        'modifyOriPwd.validOriPwd' => '原密码不正确',
        'modifyNewPwd.require'     => '新密码必填',
        'modifyNewPwd.validPwd'    => '密码不是有效的格式,必须为4-32位大小写字母及~@!#$^&*等可见字符',
        'modifyRePwd.require'      => '确认密码必填',
        'modifyRePwd.confirm'      => '两次输入密码不一致',

        'editNick.length'  => '昵称长度为2-10字符',
        'editNick.chsDash' => '昵称只能为汉字、字母、数字和下划线_及破折号-',
        'editNick.unique'  => '昵称已存在',

        'editEmail.email'  => '邮箱格式不正确',
        'editEmail.unique' => '邮箱已被注册',

        'editEmail.phone'  => '手机号码格式不正确',
        'editEmail.unique' => '手机号码已被注册',

        'profile.maxLength' => '个人简介最多500字',

        'account.require'                               => '用户名必填',
        'account.validAccount'                          => '用户名格式不正确,必须为2-32位大小写字母数字-_',
        'account.unique'                                => '用户名已存在',
        'loginAccount.require'                          => '用户名必填',
        'commonUserLoginAccount.require'                => '用户名必填',
        'commonUserLoginAccount.validCommonUserAccount' => '用户名或密码错误或者你没有登录权限',
        'pwd.require'                                   => '密码必填',
        'loginPwd.require'                              => '密码必填',
        'pwd.validPwd'                                  => '密码不是有效的格式,必须为4-32位大小写字母及~@!#$^&*等可见字符',
        'rePwd.require'                                 => '确认密码必填',
        'rePwd.confirm'                                 => '两次密码不一致',
        'accountVerifyCode.require'                     => '验证码必填',
        'accountVerifyCode.captcha'                     => '验证码不正确',

        'email.email'                                    => '邮箱格式不正确',
        'email.unique'                                   => '邮箱已被注册',
        'emailLoginEmail.require'                        => '邮箱必填',
        'emailLoginEmail.validEmailLoginEmail'           => '邮箱不是刚刚发送邮件的邮箱',
        'emailLoginVerifyCode.require'                   => '邮箱验证码必填',
        'emailLoginVerifyCode.validEmailLoginVerifyCode' => '邮箱验证码不正确',

        'emailRegisterEmail.require'                           => '邮箱必填',
        'emailRegisterEmail.validEmailRegisterEmail'           => '邮箱不是刚刚发送邮件的邮箱',
        'emailRegisterVerifyCode.require'                      => '邮箱验证码必填',
        'emailRegisterVerifyCode.validEmailRegisterVerifyCode' => '邮箱验证码不正确',

        'loginPhone.require'                             => '手机号码必填',
        'loginPhone.validPhone'                          => '手机号码格式不正确',
        'loginPhone.isLoginSendVerifyCodePhone'          => '手机号码不是发送验证码的手机',
        'loginPhoneVerifyCode.require'                   => '手机验证码必填',
        'loginPhoneVerifyCode.validLoginPhoneVerifyCode' => '手机验证码不正确',
    ];
    protected $scene   = [
        self::SCENE['commonUserAccountLogin'] => [
            'commonUserLoginAccount', 'loginPwd', 'accountVerifyCode',
        ],
        self::SCENE['accountLogin']           => [
            'loginAccount', 'loginPwd', 'accountVerifyCode',
        ],
        self::SCENE['emailLogin']             => [
            'emailLoginEmail', 'emailLoginVerifyCode',
        ],
        self::SCENE['emailRegister']          => [
            'account', 'pwd', 'rePwd', 'email', 'emailRegisterEmail',
            'emailRegisterVerifyCode',
        ],
        self::SCENE['phoneLogin']             => [
            'loginPhone', 'loginPhoneVerifyCode',
        ],
        self::SCENE['editInfo']               => [
            'editNick', 'editEmail', 'editPhone', 'profile',
        ],
        self::SCENE['modifyPwd']              => [
            'modifyOriPwd', 'modifyNewPwd', 'modifyRePwd',
        ],
        self::SCENE['add']                    => [
            'account', 'pwd', 'rePwd', 'nick', 'email', 'phone',
            'profile', 'isAdmin',
        ],
        self::SCENE['sendVerifyPhoneSms']     => [
            'verifyPhoneNo',
        ],
    ];

    /**
     * 验证绑定的手机号码格式是否正确并且没有被绑定
     * @param $phone
     * @return bool
     */
    public function validVerifyPhone($phone): bool
    {
        return Bdk::isMobilePhone($phone) &&
            UserModel::checkUniqueFieldExist('phone', $phone) === 0;
    }
}