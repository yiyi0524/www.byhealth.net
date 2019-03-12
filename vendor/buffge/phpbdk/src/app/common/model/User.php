<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2018/12/29
 * Time: 17:52.
 */

namespace bdk\app\common\model;

/**
 * 用户
 * Class User
 * @package bdk\app\common\model
 */
class User extends Base
{
    /**
     * 超级管理员id
     */
    public const SUPER_USER_ID   = 0x1;
    public const GENDER          = [
        'UNDEFINED' => 0x0,
        'MAN'       => 0x1,
        'WOMAN'     => 0x2,
    ];
    public const GENDER_ZH       = [
        self::GENDER['UNDEFINED'] => '未知',
        self::GENDER['MAN']       => '男',
        self::GENDER['WOMAN']     => '女',
    ];
    public const NOT_HAVE_AVATAR = 0;
    protected $field = [
        'id', 'ctime', 'utime', 'dtime',
        'nick', 'avatar_pic_id', 'gender',
        'account', 'pwd', 'phone', 'email', 'profile',
    ];
    protected $json  = [
    ];

    /**
     * 判断用户是否为root用户
     * @return bool
     */
    public function isRootUser(): bool
    {
        return $this->id = static::SUPER_USER_ID;
    }

    /**
     * 检查唯一字段是否存在 如用户名 手机号 email
     * @param string $name
     * @param string $field
     * @return bool
     */
    public static function checkUniqueFieldExist(string $name, string $field): bool
    {
        return self::getCount([$name => $field]) > 0;
    }

    /**
     * 管理员用户信息
     * @return \think\model\relation\HasOne
     */
    public function adminInfo()
    {
        return $this->hasOne(UserAdmin::class, 'uid');
    }

    /**
     * 地址信息
     * @return \think\model\relation\HasOne
     */
    public function address()
    {
        return $this->hasOne(UserAddress::class, 'uid');
    }

    /**
     * 头像
     * @return \think\model\relation\HasOne
     */
    public function avatar()
    {
        return $this->hasOne(Picture::class, 'id', 'avatar_pic_id');
    }

    /**
     * 用户实名认证 信息
     * @return \think\model\relation\HasOne
     */
    public function idCardRealNameInfo()
    {
        return $this->hasOne(UserIdCardRealName::class, 'uid');
    }

    /**
     * 判断是否是管理员用户
     * @return bool
     */
    public function isAdminUser(): bool
    {
        return $this->adminInfo !== null;
    }

    /**
     * 判断是否为普通用户
     * @return bool
     */
    public function isCommonUser(): bool
    {
        return $this->adminInfo === null;
    }

    public function getUid(): int
    {
        return (int)$this->id;
    }

}
