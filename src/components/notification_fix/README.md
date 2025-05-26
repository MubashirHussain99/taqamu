// README.md for Taqamu App Notification Fix

# Taqamu App Notification Fix

This package contains improved notification handling for the Taqamu app, specifically addressing:

1. Notifications not showing when device is locked
2. Adhan sound not playing correctly with notifications

## Files Included

- `NotificationService.js` - Core notification service with enhanced configuration
- `NotificationTester.js` - Simple component to test notifications
- `NotificationTest.js` - Comprehensive test tool with UI for validation
- `integration_guide.js` - Guide for integrating these changes into the app
- `implementation_details.md` - Technical details of the implementation

## Key Improvements

- Enhanced notification priority for locked device delivery
- Proper sound file configuration for adhan playback
- Full-screen intent implementation for critical notifications
- Wake lock support for reliable delivery
- Comprehensive testing tools

## Installation

1. Copy these files to your project
2. Follow the integration guide to implement the changes
3. Test using the provided test components

## Android-Specific Enhancements

- Added `AndroidCategory.ALARM` for higher priority
- Implemented `AndroidVisibility.PUBLIC` for lock screen visibility
- Added wake lock timeout to ensure delivery when device is locked
- Configured vibration pattern for additional alert

## Testing

Use the included `NotificationTest.js` component to validate the fixes:

1. Run the test
2. Lock your device
3. Verify notification appears and plays adhan sound
