package net.byhealth.boyi;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.imagepicker.ImagePickerPackage;
import com.pilloxa.backgroundjob.BackgroundJobPackage;

import fr.greweb.reactnativeviewshot.RNViewShotPackage;

import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import cn.reactnative.modules.update.UpdatePackage;

import java.util.Arrays;
import java.util.List;

import cn.reactnative.modules.update.UpdateContext;

import net.byhealth.boyi.buffge.BuffPackage;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        protected String getJSBundleFile() {
            return UpdateContext.getBundleUrl(MainApplication.this);
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(new MainReactPackage(),
            new ImagePickerPackage(),
                    new BackgroundJobPackage(), new RNViewShotPackage(), new RNDeviceInfo(),
                    new ReactSliderPackage(), new RNCViewPagerPackage(), new AsyncStoragePackage(), new RNGestureHandlerPackage(),
                    new BuffPackage(), new UpdatePackage());
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
