<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2019/1/3
 * Time: 14:10
 */

namespace app\common\service;

use bdk\app\common\service\Cache as BdkService;
use think\facade\Cache as TpCache;
use think\facade\Request;

class Cache extends BdkService
{
    public const SEND_VERIFY_PHONE_CODE_FLAG = '-sendVerifyPhoneSmsFlag';

    /**
     * 检查当前请求ip 是否存在发送验证手机号的flag
     * @return bool
     */
    public function checkReqIpSendVerifyPhoneSmsFlagExist(): bool
    {
        return TpCache::has(Request::ip() . self::SEND_VERIFY_PHONE_CODE_FLAG);
    }

    /**
     * 设置手机验证的短信flag 限流
     */
    public function setSendVerifyPhoneSmsFlag(): void
    {
        $sendSmsLimitExpire = $this->getSendVerifyPhoneSmsExpire();
        TpCache::set(Request::ip() . self::SEND_VERIFY_PHONE_CODE_FLAG, '1',
            $sendSmsLimitExpire);
    }

    /**
     * 获取发送验证手机的短信限流时间(秒)
     * @return int
     */
    private function getSendVerifyPhoneSmsExpire(): int
    {
        return 60;
    }
}