<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2019/1/3
 * Time: 14:02
 */

namespace app\admin\controller;


use app\common\model\User as UserModel;
use app\common\service\User as UserService;
use bdk\app\admin\controller\User as BdkController;
use bdk\app\common\model\Log as BuffLog;
use bdk\app\common\model\UserAdmin as UserAdminModel;
use bdk\constant\JsonReturnCode;
use Exception;
use think\facade\Request;

class User extends BdkController
{
    /**
     * 获取管理员列表
     * @route /user/getAdminList get
     * @return \think\response\Json
     */
    public function getAdminList()
    {
        $page   = (int)Request::get('page');
        $limit  = (int)Request::get('limit');
        $filter = Request::get('filter');
        $json   = [
            'code' => JsonReturnCode::SUCCESS,
        ];
        try {
            $adminList    = UserAdminModel::allNoDel();
            $adminUidList = [];
            foreach ($adminList as $adminItem) {
                $adminUidList[] = (int)$adminItem->getData('uid');
            }
            $map = [
                ['dtime', 'null', ''],
                ['id', 'in', $adminUidList],
            ];
            if ( is_array($filter) ) {
                if ( array_key_exists('search', $filter) && $filter['search'] ) {
                    $map[] = ['account|nick|phone|email', 'like', '%' . trim($filter['search']) . '%'];
                }
            }
            $field = ['id', 'account', 'nick', 'phone', 'email', 'gender', 'ctime'];
            $order = ['ctime' => 'desc'];
            [$userList, $count] = UserModel::getList($page, $limit, UserModel::NEED_COUNT, $map, $field, $order);
            $resList = [];
            foreach ($userList as $userItem) {
                $resList[] = [
                    'id'      => $userItem->id,
                    'account' => $userItem->account,
                    'nick'    => $userItem->nick,
                    'phone'   => $userItem->phone,
                    'email'   => $userItem->email,
                    'gender'  => $userItem->gender,
                    'address' => $userItem->address,
                    'ctime'   => $userItem->ctime,
                ];
            }
            $json['data']  = [
                'list' => $resList,
            ];
            $json['page']  = $page;
            $json['limit'] = $limit;
            $json['count'] = $count;
        } catch (Exception $ex) {
            $json['code'] = JsonReturnCode::SERVER_ERROR;
            $json['msg']  = $ex->getMessage();
            BuffLog::sqlException($ex);
        }
        return json($json);
    }
    /**
     * 管理员修改普通用户密码
     * @route /adminModifyGeneralUserPwd post
     * @param UserService $userService
     * @return \think\response\Json
     */
    public function adminModifyGeneralUserPwd(UserService $userService): \think\response\Json
    {
        $userId = Request::post('uid');
        $newPwd = Request::post('newPwd');
        $rePwd  = Request::post('rePwd');
        $json   = ['code' => JsonReturnCode::SUCCESS,];
        try {
            $user  = UserModel::get($userId);
            $admin = UserModel::get($this->getUid());
            if ( $user->isAdminUser() && !$admin->isRootUser() ) {
                return json([
                    'code' => JsonReturnCode::UNAUTHORIZED,
                    'msg'  => '只有超级管理员才能更改其他管理员的密码',
                ]);
            }
            if ( 1 !== preg_match('~^[a-zA-Z0-9\~`!@#\$%\^&\*\(\)_\-\+=\{\}\[\]\\\|;:"\',<\.>\?\/]{4,32}$~',
                    $newPwd) ) {
                return json([
                    'code' => JsonReturnCode::INVAILD_PARAM,
                    'msg'  => '密码只能为4-32为可见非中文字符',
                ]);
            }
            if ( $newPwd !== $rePwd ) {
                return json([
                    'code' => JsonReturnCode::INVAILD_PARAM,
                    'msg'  => '两次密码不一致',
                ]);
            }
            $user->pwd = $userService->buildHashPwd($newPwd);
            if ( !$user->save() ) {
                return json([
                    'code' => JsonReturnCode::SERVER_ERROR,
                    'msg'  => '修改密码失败',
                ]);
            }
        } catch (Exception $ex) {
            BuffLog::sqlException($ex);
            $json['code'] = JsonReturnCode::SERVER_ERROR;
            $json['msg']  = $ex->getMessage();
        }
        return json($json);
    }
}