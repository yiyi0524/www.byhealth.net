<?php

namespace app\index\controller;

use app\common\controller\Base;
use bdk\app\common\service\Sms as SmsService;
use think\facade\Request;

class Index extends Base
{
    public function index()
    {
        if ( Request::isOptions() ) {
            return;
        }
        return $this->fetch();
    }

    public function test(SmsService $smsService)
    {
//        $smsConf   = TpConfig::pull('sms');
//        $smsDriver = new aliSms($smsConf[$smsConf['driver']]);
//        [$sendSuccess, $errMsg] = $smsDriver->sendSms('18061175230', 'SMS_160275074', [
//            'code' => '2344',
//        ]);
//        dump($sendSuccess);
//        dump($errMsg);
    }
}
