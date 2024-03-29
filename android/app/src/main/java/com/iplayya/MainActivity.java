package com.iplayya;

import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;
import android.view.WindowManager;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

// react-native-google-cast configuration
import androidx.annotation.Nullable;
import com.google.android.gms.cast.framework.CastContext;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "iplayya";
  }

  @Override
  protected void  onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashStatusBarTheme);
    super.onCreate(savedInstanceState);

    // lazy load Google Cast context
    CastContext.getSharedInstance(this);
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}
