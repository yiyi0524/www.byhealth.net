<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2019/3/11
 * Time: 17:53
 */

namespace bdk\app\common\model;

/**
 * 用户地址
 * Class UserAddress
 * @package bdk\app\common\model
 */
class UserAddress extends Base
{
    protected $field = [
        'id', 'ctime', 'utime', 'dtime',
        'uid', 'address_id',
    ];

    public function detail()
    {
        return $this->hasOne(Address::class, 'id', 'adrees_id');
    }
}