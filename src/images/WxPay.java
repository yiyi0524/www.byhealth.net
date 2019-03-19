package com.benhu.buffge;

import android.app.Activity;
import org.json.JSONObject;
import com.tencent.mm.sdk.constants.Build;
import com.tencent.mm.sdk.modelpay.PayReq;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

public class WxPay {

  private Activity act;

  public void pay(final String jsonStr, final Activity act) {
    this.act = act;

    JSONObject json = new JSONObject(jsonStr);
    if (null != json && !json.has("retcode")) {
      PayReq req = new PayReq();
      // req.appId = "wxf8b4f85f3a794e77"; // 测试用appId
      req.appId = json.getString("appid");
      req.partnerId = json.getString("partnerid");
      req.prepayId = json.getString("prepayid");
      req.nonceStr = json.getString("noncestr");
      req.timeStamp = json.getString("timestamp");
      req.packageValue = json.getString("package");
      req.sign = json.getString("sign");
      req.extData = "app data"; // optional
      Toast.makeText(this.act, "正常调起支付", Toast.LENGTH_SHORT).show();
      // 在支付之前，如果应用没有注册到微信，应该先调用IWXMsg.registerApp将应用注册到微信
      api.sendReq(req);
    } else {
      Toast.makeText(this.act, "返回错误" + json.getString("retmsg"), Toast.LENGTH_SHORT).show();
    }
  }
}
