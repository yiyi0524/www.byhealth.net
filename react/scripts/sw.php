<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2019/1/27
 * Time: 16:18
 */

use Swoole\Http\Server;

$http = new Server("127.0.0.1", 6677);
$http->set([
    'daemonize'  => 1,
    'worker_num' => 2, //worker process num
    'log_file'   => __DIR__ . '/swoole.log',
]);

$http->on("start", function ($server) {
    echo "Swoole http server is started at http://127.0.0.1:6677\n";
});

$http->on("request", function ($request, $response) {
    $response->header("Content-Type", "text/plain");
    $cmd  = '/var/www/www.byhealth.net/react/scripts/build.sh 2>&1';
    $res  = exec($cmd, $output, $retCode);
    $json = [
        'res'     => $res,
        'output'  => $output,
        'retCode' => $retCode,
    ];
    $response->end(json_encode($json, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
});


$http->start();

