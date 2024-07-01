#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <Firebase.h> // Add this line if Firebase is used

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"PdfPlus";
  self.initialProps = @{};  // Initial props for React Native
  
  // Call Firebase configure method here
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
  
  // Return the result of super's didFinishLaunchingWithOptions
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
