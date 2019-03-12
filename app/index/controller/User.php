<?php
/**
 * Created by IntelliJ IDEA.
 * User: buff
 * Date: 2019/3/12
 * Time: 15:04
 */

namespace app\index\controller;

use app\common\model\User as UserModel;
use app\common\service\Session as SessionService;
use app\common\service\Sms as SmsService;
use app\common\validate\User as UserValid;
use bdk\app\common\model\Log as BuffLog;
use bdk\app\http\middleware\LoginAuth;
use bdk\app\index\controller\User as BdkController;
use bdk\constant\JsonReturnCode;
use Exception;
use think\facade\Request;

class User extends BdkController
{
    protected $middleware = [
        LoginAuth::class => [
            'except' => [],
        ],
    ];

    /**
     * 发送验证手机的短信
     * @route /user/sendVerifyPhoneSms post
     * @param SmsService $smsService
     * @param UserValid $userValid
     * @param SessionService $sessionService
     * @return array
     */
    public function sendVerifyPhoneSms(SmsService $smsService, UserValid $userValid,
                                       SessionService $sessionService): array
    {
        $validData = [
            'verifyPhoneNo' => Request::post('phone'),
        ];
        if ( !$userValid->scene(UserValid::SCENE['sendVerifyPhoneSms'])->check($validData) ) {
            return [
                'code' => JsonReturnCode::VALID_ERROR,
                'msg'  => $userValid->getError(),
            ];
        }
        if ( $smsService->checkSendVerifyPhoneSmsIsHighFrequency() ) {
            return [
                'code' => JsonReturnCode::HIGH_FREQUENCY,
                'msg'  => '发送短信频率过快',
            ];
        }
        $json = ['code' => JsonReturnCode::SUCCESS,];
        try {
            $verifyPhoneCode = $sessionService->generateVerifyPhoneCode();
            [$sendSuccess, $errMsg] = $smsService->sendSms($validData['verifyPhoneNo'],
                SmsService::TPL_CODE['绑定手机号码'], ['code' => $verifyPhoneCode]);
            if ( !$sendSuccess ) {
                $json['code'] = JsonReturnCode::SERVER_ERROR;
                $json['msg']  = $errMsg;
            }
        } catch (Exception $ex) {
            BuffLog::sqlException($ex);
            $json['code'] = JsonReturnCode::SERVER_ERROR;
            $json['msg']  = $ex->getMessage();
        }
        return $json;
    }

    /**
     * 验证手机号码,验证成功则更新用户手机号码信息
     * @route /user/verifyPhone post
     * @param SessionService $sessionService
     * @return array
     */
    public function verifyPhone(SessionService $sessionService): array
    {
        $code = Request::post('code');
        $json = ['code' => JsonReturnCode::SUCCESS,];
        try {
            $sessionCode        = $sessionService->getVerifyPhoneCode();
            $sessionPhoneNumber = $sessionService->getVerifyPhonePhoneNumber();
            if ( $code !== $sessionCode ) {
                throw new Exception('验证码不正确');
            }
            $uid         = $this->getUid();
            $user        = UserModel::get($uid);
            $user->phone = $sessionPhoneNumber;
            if ( !$user->save() ) {
                throw new Exception('数据库更新失败');
            }
            $sessionService->deleteVerifyPhoneCode();
            $sessionService->deleteVerifyPhonePhoneNumber();
        } catch (Exception $ex) {
            BuffLog::sqlException($ex);
            $json['code'] = JsonReturnCode::SERVER_ERROR;
            $json['msg']  = $ex->getMessage();
        }
        return $json;
    }
}