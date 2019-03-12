<?php

namespace app\index\controller;

use bdk\app\common\controller\Base;
use think\facade\Request;

class Index extends Base
{
    public function index()
    {
        if ( Request::isOptions() ) {
            return;
        }
        return $this->fetch();
    }

    public function test()
    {
    }
}
