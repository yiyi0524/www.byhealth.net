/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <CloudPushSDK/CloudPushSDK.h>
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                    moduleName:@"博一健康"
                                    initialProperties:nil
                                    launchOptions:launchOptions];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // APNs注册，获取deviceToken并上报
  [self registerAPNS:application];
  // 初始化SDK
  [self initCloudPush];
  // 监听推送通道打开动作
  //[self listenerOnChannelOpened];
  // 监听推送消息到达
  [self registerMessageReceive];
  
  // 点击通知将App从关闭状态启动时，将通知打开回执上报
  // [CloudPushSDK handleLaunching:launchOptions];(Deprecated from v1.8.1)
  [CloudPushSDK sendNotificationAck:launchOptions];
  return YES;
}

- (void)initCloudPush {
  // 正式上线建议关闭
  [CloudPushSDK turnOnDebug];
  // SDK初始化
  [CloudPushSDK asyncInit:@"27584773" appSecret:@"fe5e04bdbfa484ef99d7fcffca1938a4" callback:^(CloudPushCallbackResult *res) {
    if (res.success) {
      NSLog(@"Push SDK init success, deviceId: %@.", [CloudPushSDK getDeviceId]);
    } else {
      NSLog(@"Push SDK init failed, error: %@", res.error);
    }
  }];
}

/**
 *    注册苹果推送，获取deviceToken用于推送
 *
 *    @param     application
 */
- (void)registerAPNS:(UIApplication *)application {
  if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
    // iOS 8 Notifications
    [application registerUserNotificationSettings:
     [UIUserNotificationSettings settingsForTypes:
      (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge)
                                       categories:nil]];
    [application registerForRemoteNotifications];
  }
  else {
    // iOS < 8 Notifications
    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:
     (UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound)];
  }
}
/*
 *  苹果推送注册成功回调，将苹果返回的deviceToken上传到CloudPush服务器
 */
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [CloudPushSDK registerDevice:deviceToken withCallback:^(CloudPushCallbackResult *res) {
    if (res.success) {
      NSLog(@"Register deviceToken success.%@",deviceToken);
    } else {
      NSLog(@"Register deviceToken failed, error: %@", res.error);
    }
  }];
}
/*
 *  苹果推送注册失败回调
 */
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"didFailToRegisterForRemoteNotificationsWithError %@", error);
}

/**
 *    注册推送消息到来监听
 */
- (void)registerMessageReceive {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(onMessageReceived:)
                                               name:@"CCPDidReceiveMessageNotification"
                                             object:nil];
}
/**
 *    处理到来推送消息
 *
 *    @param     notification
 */
- (void)onMessageReceived:(NSNotification *)notification {
  CCPSysMessage *message = [notification object];
  NSString *title = [[NSString alloc] initWithData:message.title encoding:NSUTF8StringEncoding];
  NSString *body = [[NSString alloc] initWithData:message.body encoding:NSUTF8StringEncoding];
  
  //[self syncBadgeNum:0];
  NSLog(@"Receive message title: %@, content: %@.", title, body);
}

/*
 *  App处于启动状态时，通知打开回调
 */
- (void)application:(UIApplication*)application didReceiveRemoteNotification:(NSDictionary*)userInfo {
  NSLog(@"Receive one notification.");
  // 取得APNS通知内容
  NSDictionary *aps = [userInfo valueForKey:@"aps"];
  // 内容
  NSString *content = [aps valueForKey:@"alert"];
  // badge数量
  NSInteger badge = [[aps valueForKey:@"badge"] integerValue];
  // 播放声音
  NSString *sound = [aps valueForKey:@"sound"];
  // 取得Extras字段内容
  NSString *Extras = [userInfo valueForKey:@"Extras"]; //服务端中Extras字段，key是自己定义的
  NSLog(@"content = [%@], badge = [%ld], sound = [%@], Extras = [%@]", content, (long)badge, sound, Extras);
  // iOS badge 清0
  application.applicationIconBadgeNumber = 0;
  [self syncBadgeNum:0];
  // 通知打开回执上报
  // [CloudPushSDK handleReceiveRemoteNotification:userInfo];(Deprecated from v1.8.1)
  [CloudPushSDK sendNotificationAck:userInfo];
}

/* 同步通知角标数到服务端 */
- (void)syncBadgeNum:(NSUInteger)badgeNum {
  [CloudPushSDK syncBadgeNum:badgeNum withCallback:^(CloudPushCallbackResult *res) {
    if (res.success) {
      NSLog(@"\n ====== Sync badge num: [%lu] success.", (unsigned long)badgeNum);
    } else {
      NSLog(@"\n ====== Sync badge num: [%lu] failed, error: %@", (unsigned long)badgeNum, res.error);
    }
  }];
}
@end
