package net.byhealth.boyi.buffge;

import android.util.Log;

import com.alibaba.sdk.android.push.CloudPushService;
import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import me.leolin.shortcutbadger.ShortcutBadger;

public class Buff extends ReactContextBaseJavaModule {
    private CloudPushService pushService;

    public Buff(ReactApplicationContext reactContext) {

        super(reactContext);
        pushService = PushServiceFactory.getCloudPushService();
    }

    @Override
    public String getName() {
        return "Buff";
    }

    @ReactMethod
    public void getAliPushDeviceId(int t, Promise promise) {
        try {
            promise.resolve(pushService.getDeviceId());
        } catch (Exception ex) {
            promise.reject(ex);
        }
    }

    @ReactMethod
    public void clearNotifications(Promise promise) {
        try {
            pushService.clearNotifications();
            Log.d("buffge", "正在清除通知");
            ShortcutBadger.applyCount(this.getReactApplicationContext(), 0); //for 1.1.4+
            promise.resolve(true);
        } catch (Exception ex) {
            promise.reject(ex);
        }
    }
}
