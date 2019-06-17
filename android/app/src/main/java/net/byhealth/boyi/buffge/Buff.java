package net.byhealth.boyi.buffge;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;


public class Buff extends ReactContextBaseJavaModule {

    public Buff(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Buff";
    }

}
