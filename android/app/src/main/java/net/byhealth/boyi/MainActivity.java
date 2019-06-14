package net.byhealth.boyi;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import com.igexin.sdk.PushManager;

import net.byhealth.boyi.buffge.GtPush;
import net.byhealth.boyi.buffge.GtPushIntentService;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "博一健康";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }

            @Override
            protected void onCreate(Bundle savedInstanceState) {
                super.onCreate(savedInstanceState);
                // 初始化个推sdk
                PushManager.getInstance().initialize(getApplicationContext(), GtPush.class);
                // 注册 个推 service
                PushManager.getInstance().registerPushIntentService(getApplicationContext(),
                        GtPushIntentService.class);

            }
        };
    }
}
