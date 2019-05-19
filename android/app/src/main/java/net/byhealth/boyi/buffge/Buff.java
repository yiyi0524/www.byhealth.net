package net.byhealth.boyi.buffge;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import net.byhealth.boyi.BadgeIntentService;

import me.leolin.shortcutbadger.ShortcutBadger;


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
    public void setShortcutBadger(int badgeCount, Promise promise) {
        ShortcutBadger.applyCount(getReactApplicationContext(), badgeCount);
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject("-1", "Activity doesn't exist");
            return;
        }
        getReactApplicationContext().startService(
                new Intent(currentActivity, BadgeIntentService.class).putExtra("badgeCount", badgeCount)
        );
        promise.resolve(1);
    }

    /**
     * 移除角标
     */
    @ReactMethod
    public void removeShortcutBadger() {
        ShortcutBadger.removeCount(getReactApplicationContext());
        getReactApplicationContext().startService(
                new Intent(getCurrentActivity(), BadgeIntentService.class).putExtra("badgeCount", 0)
        );
    }
}
