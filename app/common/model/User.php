<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2019/3/12
 * Time: 12:04
 */

namespace app\common\model;

use bdk\app\common\model\User as BdkModel;

class User extends BdkModel
{
    protected $field = [
        'id', 'ctime', 'utime', 'dtime',
        'nick', 'avatar_pic_id', 'gender',
        'account', 'pwd', 'phone', 'email', 'profile',
    ];
}