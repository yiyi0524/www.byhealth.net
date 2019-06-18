package net.byhealth.boyi.buffge;

import com.alibaba.sdk.android.push.CloudPushService;
import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


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
    public void getAliPushDeviceId(Promise promise) {
        try {
            promise.resolve(pushService.getDeviceId());
        } catch (Exception $ex) {
            promise.reject($ex);
        }
    }

    @ReactMethod
    public void clearNotifications(Promise promise) {
        try {
            pushService.clearNotifications();
            promise.resolve(true);
        } catch (Exception $ex) {
            promise.reject($ex);
        }
    }
}
