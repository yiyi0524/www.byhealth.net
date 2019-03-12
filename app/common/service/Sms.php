<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2019/3/12
 * Time: 15:48
 */

namespace app\common\service;

use bdk\app\common\service\Sms as BdkService;


class Sms extends BdkService
{
    /**
     * 阿里云模板代码
     */
    public const TPL_CODE = [
        '绑定手机号码' => 'SMS_160275074',
    ];

    /**
     * 检查发送验证手机的短信操作是否操作太快
     * @return bool
     */
    public function checkSendVerifyPhoneSmsIsHighFrequency(): bool
    {
        return Cache::regInstance()->checkReqIpSendVerifyPhoneSmsFlagExist();
    }
}