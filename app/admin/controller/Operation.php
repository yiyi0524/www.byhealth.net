<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2019/1/3
 * Time: 13:42
 */

namespace app\admin\controller;

use bdk\app\admin\controller\Operation as BdkController;
use bdk\app\http\middleware\AdminAuth;

class Operation extends BdkController
{
    protected $middleware = [
        AdminAuth::class => ['except' => ['']],
    ];


}