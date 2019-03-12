<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2019/3/12
 * Time: 15:39
 */

use bdk\plug\sms\ali\Driver as AliSms;
use think\facade\Config;

return [
    'smsDriver' => function () {
        $smsConf = Config::pull('sms');
        return new AliSms($smsConf[$smsConf['driver']]);
    },
];