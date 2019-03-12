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

Route::group('user', function () {
    # 请求发送验证手机号码短信
    Route::post('sendVerifyPhoneSms', 'index/user/sendVerifyPhoneSms');
    # 验证手机号码
    Route::post('verifyPhone', 'index/user/verifyPhone');
});