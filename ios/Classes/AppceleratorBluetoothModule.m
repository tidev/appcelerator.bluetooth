/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */

#import "AppceleratorBluetoothModule.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiUtils.h"

@implementation AppceleratorBluetoothModule

#pragma mark Internal

// This is generated for your module, please do not change it
- (id)moduleGUID {
  return @"d4c8bc3c-dce5-48b4-9c7e-5ccb5102f205";
}

// This is generated for your module, please do not change it
- (NSString *)moduleId {
  return @"appcelerator.bluetooth";
}

#pragma mark Lifecycle

- (void)startup {
  // This method is called when the module is first loaded
  // You *must* call the superclass
  [super startup];
  DebugLog(@"[DEBUG] %@ loaded", self);
}

#pragma Public APIs

- (NSString *)example:(id)args {
  // Example method.
  // Call with "MyModule.example(args)"
  return @"hello world";
}

- (NSString *)exampleProp {
  // Example property getter.
  // Call with "MyModule.exampleProp" or "MyModule.getExampleProp()"
  return @"Titanium rocks!";
}

- (void)setExampleProp:(id)value {
  // Example property setter.
  // Call with "MyModule.exampleProp = 'newValue'" or
  // "MyModule.setExampleProp('newValue')"
}

@end
