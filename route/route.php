<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

use think\facade\{Request, Route,};

$allowOrigin = Request::header('origin');
header('Access-Control-Allow-Origin:' . $allowOrigin);
header('Access-Control-Allow-Methods:*');
header('Access-Control-Allow-Headers:content-type,x-requested-with');
header('Access-Control-Allow-Credentials:true');

// miss route
Route::miss('index/index/index');
# index
Route::rule('/', 'index/index/index');
# test
Route::rule('/test', 'index/index/test');

Route::group('app', function () {
    #构建
    Route::get('build', 'admin/app/build');
});
# 上传图片
Route::post('/uploadImg$', 'index/common/uploadImg');
# antd 组件的上传图片
Route::post('/antdUploadImg', 'index/common/uploadImg');
# 获取区域
Route::get('/getRegion$', 'index/common/getRegion');
# 开发时 导出常量
Route::get('/exportConstant', 'index/common/exportConstant');
## 用户组
Route::group('user', function () {
    # 请求发送验证手机号码短信
    Route::post('sendVerifyPhoneSms', 'index/user/sendVerifyPhoneSms');
    # 验证手机号码
    Route::post('verifyPhone', 'index/user/verifyPhone');
    # 用户登录
    Route::post('login', 'index/user/login');
    # 发送注册验证码到邮箱
    Route::get('/sendRegisterMail', 'index/common/sendRegisterMail');
});
# 发送登录验证码
Route::get('/getVerifyCode', 'index/common/getVerifyCode');


## 管理员组
Route::group('admin', function () {
    Route::post('/', 'admin/index/index');
    Route::post('login', 'admin/user/login');
});

Route::post('/editUserInfo', 'index/user/editInfo');
Route::get('/getUserInfo$', 'index/user/info');
Route::post('/editUserInfo$', 'index/user/editInfo');
Route::post('/modifyPwd$', 'index/user/modifyPwd');
Route::get('/logout$', 'index/user/logout');

Route::get('/operationList', 'admin/operation/list');
Route::get('/operationDetail', 'admin/operation/detail');
Route::post('/addOperation', 'admin/operation/add');
Route::post('/editOperation', 'admin/operation/edit');
Route::post('/deleteOperation', 'admin/operation/delete');

Route::get('/operationGroupList', 'admin/operation_group/list');
Route::get('/operationGroupDetail', 'admin/operation_group/detail');
Route::post('/addOperationGroup', 'admin/operation_group/add');
Route::post('/editOperationGroup', 'admin/operation_group/edit');
Route::post('/deleteOperationGroup', 'admin/operation_group/delete');


