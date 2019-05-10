package net.byhealth.boyi.buffge;

import android.widget.Toast;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import me.leolin.shortcutbadger.ShortcutBadger;
import java.util.HashMap;
import java.util.Map;

public class Buff extends ReactContextBaseJavaModule {

    public Buff(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Buff";
    }

    /**
     * 设置角标
     */
    @ReactMethod
    public void setShortcutBadger(int count, Promise promise) {
        // ShortcutBadger.applyCount(getReactApplicationContext(), count);
        promise.resolve(1);
    }

    /**
     * 移除角标
     */
    @ReactMethod
    public void removeShortcutBadger() {
        ShortcutBadger.removeCount(getReactApplicationContext());
    }
}
