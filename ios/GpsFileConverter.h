#ifdef __cplusplus
#import "react-native-gps-file-converter.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNGpsFileConverterSpec.h"

@interface GpsFileConverter : NSObject <NativeGpsFileConverterSpec>
#else
#import <React/RCTBridgeModule.h>

@interface GpsFileConverter : NSObject <RCTBridgeModule>
#endif

@end
