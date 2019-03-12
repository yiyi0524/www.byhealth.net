<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2018/12/29
 * Time: 17:52.
 */

namespace app\common\model;

use bdk\app\common\model\Base as BdkModel;

/**
 * 患者用户信息
 * Class UserPatientInfo
 * @package app\common\model
 */
class UserPatientInfo extends BdkModel
{
    protected $field = [
        'id', 'ctime', 'utime', 'dtime',
        'age_year', 'age_month',
    ];
}
