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