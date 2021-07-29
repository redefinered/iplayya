// required for push notifications
#import <UserNotifications/UNUserNotificationCenter.h>

#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate> // added "UNUserNotificationCenterDelegate" which is required for push notifications

@property (nonatomic, strong) UIWindow *window;

@end
