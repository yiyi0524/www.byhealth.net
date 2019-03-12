<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2019/1/4
 * Time: 14:51
 */

namespace app\common\service;

use bdk\app\common\service\Session as BdkService;
use Exception;
use think\facade\Session as TpSession;

class Session extends BdkService
{
    /**
     * session 键
     */
    private const KEY = [
        '发送验证手机短信的验证码'  => 'sendVerifyPhoneSmsCode',
        '发送验证手机短信的手机号码' => 'sendVerifyPhoneSmsPhone',
    ];

    /**
     * 生成验证手机的验证码
     * 同时会保存发送的手机号码
     * @param string $phone
     * @return string
     * @throws Exception
     */
    public function generateVerifyPhoneCode(string $phone): string
    {
        $cacheService = Cache::regInstance();
        if ( $cacheService->checkReqIpSendVerifyPhoneSmsFlagExist() ) {
            throw new Exception('发送短信频率过快');
        }
        $code = (string)mt_rand(0000, 9999);
        $cacheService->setSendVerifyPhoneSmsFlag();
        TpSession::set(self::KEY['发送验证手机短信的验证码'], $code,);
        TpSession::set(self::KEY['发送验证手机短信的手机号码'], $phone);
        return $code;
    }

    /**
     * 获取验证手机的短信验证码
     * @return string|null
     */
    public function getVerifyPhoneCode(): ?string
    {
        return TpSession::get(self::KEY['发送验证手机短信的验证码']);
    }

    /**
     * 获取验证手机的手机号码
     * @return string|null
     */
    public function getVerifyPhonePhoneNumber(): ?string
    {
        return TpSession::get(self::KEY['发送验证手机短信的手机号码']);
    }

    /**
     * 删除验证手机的短信验证码
     * @return string|null
     */
    public function deleteVerifyPhoneCode(): ?string
    {
        return TpSession::delete(self::KEY['发送验证手机短信的验证码']);
    }

    /**
     * 删除验证手机的手机号码
     * @return string|null
     */
    public function deleteVerifyPhonePhoneNumber(): ?string
    {
        return TpSession::delete(self::KEY['发送验证手机短信的手机号码']);
    }
}