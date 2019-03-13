<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2019/1/26
 * Time: 16:45
 */

namespace app\admin\controller;

use bdk\app\common\controller\Base as BdkController;
use bdk\constant\JsonReturnCode;
use Exception;
use think\facade\App as TpApp;

class App extends BdkController
{
    /**
     * @route /app/build get
     * @return \think\response\Json
     */
    public function build()
    {
        set_time_limit(300);
        $webRootPath = TpApp::getRootPath();
        $json        = [
            'code' => JsonReturnCode::SUCCESS,
        ];
        try {
            if ( is_file($webRootPath . 'react/scripts/build.lock') ) {
                throw new Exception('当前正在构建中,请稍等');
            }
            $ch      = curl_init();
            $options = [
                CURLOPT_URL            => 'http://127.0.0.1:6677/app/build',
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 300,
            ];
            curl_setopt_array($ch, $options);
            $httpRes = curl_exec($ch);
            if ( false === $httpRes ) {
                throw new Exception('请求编译服务器失败');
            }
            $result = json_decode($httpRes, true);
            $outputList = $result['output'];
            $cmdOutput  = '';
            foreach ($outputList as $v) {
                $cmdOutput .= ($v . "\n");
            }
            $json['cmdOutput'] = $cmdOutput;
            if ( $result['retCode'] !== 0 ) {
                $json['code'] = JsonReturnCode::SERVER_ERROR;
            }
        } catch (Exception $ex) {
            $json['code'] = JsonReturnCode::SERVER_ERROR;
            $json['msg']  = $ex->getMessage();
        }
        return json_encode($json, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    }
}