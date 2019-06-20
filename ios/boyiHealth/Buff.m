//
//  Buff.m
//  博一健康
//
//  Created by buff on 2019/6/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "Buff.h"

@implementation Buff

//将此对象导出到rn
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getAliPushDeviceId:findEventsWithResolver:(RCTPromiseResolveBlock) s  rejecter:(RCTPromiseRejectBlock) j)
{
 s([CloudPushSDK getDeviceId]);
}

RCT_EXPORT_METHOD(clearNotifications){
  // iOS badge 清0
[UIApplication sharedApplication].applicationIconBadgeNumber = 0;
  [CloudPushSDK syncBadgeNum:0 withCallback:^(CloudPushCallbackResult *res) {
    if (res.success) {
      NSLog(@"\n ====== Sync badge num: [%lu] success.", (unsigned long)0);
    } else {
      NSLog(@"\n ====== Sync badge num: [%lu] failed, error: %@", (unsigned long)0, res.error);
    }
  }];}

@end
