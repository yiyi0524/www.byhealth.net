package net.byhealth.boyi;

import android.content.Context;
import android.util.Log;

import com.alibaba.sdk.android.push.MessageReceiver;
import com.alibaba.sdk.android.push.notification.CPushMessage;

import java.util.Map;

import me.leolin.shortcutbadger.ShortcutBadger;

public class AliPushMessageReceiver extends MessageReceiver {
    // 消息接收部分的LOG_TAG
    public static final String REC_TAG = "receiver";
    private int badgeCount = 0;

    // 接收到新通知
    @Override
    public void onNotification(Context context, String title, String summary, Map<String, String> extraMap) {
        Log.e("MyMessageReceiver",
                "Receive notification, title: " + title + ", summary: " + summary + ", extraMap: " + extraMap);
        ShortcutBadger.applyCount(context, ++badgeCount); //for 1.1.4+
    }

    @Override
    public void onMessage(Context context, CPushMessage cPushMessage) {
        Log.e("MyMessageReceiver", "onMessage, messageId: " + cPushMessage.getMessageId() + ", title: "
                + cPushMessage.getTitle() + ", content:" + cPushMessage.getContent());
    }

    // 点击了通知
    @Override
    public void onNotificationOpened(Context context, String title, String summary, String extraMap) {
        Log.e("MyMessageReceiver",
                "onNotificationOpened, title: " + title + ", summary: " + summary + ", extraMap:" + extraMap);
        badgeCount = 0;
        ShortcutBadger.applyCount(context, badgeCount); //for 1.1.4+
    }

    @Override
    protected void onNotificationClickedWithNoAction(Context context, String title, String summary, String extraMap) {
        Log.e("MyMessageReceiver", "onNotificationClickedWithNoAction, title: " + title + ", summary: " + summary
                + ", extraMap:" + extraMap);
    }

    @Override
    protected void onNotificationReceivedInApp(Context context, String title, String summary,
                                               Map<String, String> extraMap, int openType, String openActivity, String openUrl) {
        Log.e("MyMessageReceiver",
                "onNotificationReceivedInApp, title: " + title + ", summary: " + summary + ", extraMap:" + extraMap
                        + ", openType:" + openType + ", openActivity:" + openActivity + ", openUrl:" + openUrl);
    }

    /**
     * 删除了通知
     *
     * @param context
     * @param messageId
     */
    @Override
    protected void onNotificationRemoved(Context context, String messageId) {
        Log.e("MyMessageReceiver", "onNotificationRemoved");
        badgeCount--;
        ShortcutBadger.applyCount(context, badgeCount); //for 1.1.4+
    }
}
