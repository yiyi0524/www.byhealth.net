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
    }

    @Override
    public String getName() {
        return "Buff";
    }

    @ReactMethod
    public void getAliPushDeciceId(Promise promise) {
        try {
            pushService = PushServiceFactory.getCloudPushService();
            promise.resolve(pushService.getDeviceId());
        } catch (Exception $ex) {
            promise.reject($ex);
        }

    }

}
